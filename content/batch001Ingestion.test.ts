import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BATCH_001_SOURCE_REVISION,
  PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
  validateSourceManifest,
} from '@/content/manifest/sourceManifest';
import {
  computeGitBlobSha1,
  prepareCanonicalIngestionArtifact,
  verifySourceIntegrity,
} from '@/content/ingestion/ingestionPipeline';
import {
  getContentRegistry,
  resetContentRegistryCache,
} from '@/content/registry/contentRegistry';
import {
  getExtractedDecisionRegister,
  resetExtractedDecisionRegisterCache,
} from '@/content/extractors/decisionRegisterExtractor';
import {
  getExtractedFacRegister,
  resetExtractedFacRegisterCache,
} from '@/content/extractors/facRegisterExtractor';
import {
  getExtractedGuardrails,
  resetExtractedGuardrailsCache,
} from '@/content/extractors/guardrailsExtractor';
import {
  getExtractedRoadmap,
  resetExtractedRoadmapCache,
} from '@/content/extractors/roadmapExtractor';
import {
  buildUnifiedSearchIndex,
  searchUnifiedKnowledge,
} from '@/content/search/knowledgeSearch';
import {
  getPhase5Capabilities,
  getRuntimePlatformCapabilities,
} from '@/content/repositories/projectRepository';
import { PROJECT_REFERENCE_SNAPSHOT } from '@/content/seed/projectSnapshot';
import { parseMarkdownDocument } from '@/content/loaders/contentLoader';
import { validateLoadedEntries } from '@/content/validators/contentValidator';

// ============================================================================
// 1. Git Blob SHA Verification, LF Normalization & KH-022 Approval Semantics
// ============================================================================

test('all 6 official BATCH-001 files verify against exact Git blob SHA-1, commit SHA, tree SHA, and verbatim /files bodies', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();
  const publishedIds = new Set(
    registry.getAllPublicMetadata().map((m) => m.id)
  );

  const manifestValidation = validateSourceManifest(
    PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
    publishedIds
  );
  assert.equal(manifestValidation.ok, true);
  assert.equal(manifestValidation.errors.length, 0);

  const filesDir = path.join(process.cwd(), 'files');

  for (const entry of PROJECT_FOUNDATIONS_SOURCE_MANIFEST) {
    assert.equal(entry.importStatus, 'published');
    assert.equal(entry.publicationAuthorizationStatus, 'authorized');
    assert.equal(entry.completeness, 'complete');
    assert.equal(entry.sourceRevision, BATCH_001_SOURCE_REVISION.commitSha);
    assert.ok(entry.expectedGitBlobSha && entry.expectedGitBlobSha.length === 40);
    assert.equal(entry.actualGitBlobSha, entry.expectedGitBlobSha);
    assert.ok(entry.rawSourceSha256 && entry.rawSourceSha256.length === 64);
    assert.ok(entry.sourceFileHash && entry.sourceFileHash.length === 64);
    assert.ok(
      entry.sourceVerificationStatus === 'git-blob-verified' ||
        entry.sourceVerificationStatus === 'git-blob-verified-lf-normalized'
    );

    assert.ok(entry.publishedContentId);
    const doc = registry.getById(entry.publishedContentId);
    assert.ok(doc, `Expected published document ${entry.publishedContentId}`);
    assert.equal(doc.metadata.source.kind, 'official-source');
    if (doc.metadata.source.kind === 'official-source') {
      assert.equal(doc.metadata.source.gitBlobSha, entry.actualGitBlobSha);
      assert.equal(doc.metadata.source.commitSha, entry.sourceRevision);
      assert.equal(
        doc.metadata.source.treeSha,
        BATCH_001_SOURCE_REVISION.treeSha
      );
    }

    // Verify original raw file in /files matches stored verbatim body (LF normalized)
    const basename = path.basename(entry.sourcePath);
    const rawFilePath = path.join(filesDir, basename);
    if (fs.existsSync(rawFilePath)) {
      const rawBytes = fs.readFileSync(rawFilePath);
      const verification = verifySourceIntegrity(
        rawBytes,
        entry.expectedGitBlobSha
      );
      assert.equal(verification.matchedGitBlobSha, entry.expectedGitBlobSha);
      const rawNormalized = rawBytes
        .toString('utf8')
        .replace(/^\uFEFF/, '')
        .replace(/\r\n/g, '\n')
        .trim();
      assert.equal(doc.bodyMarkdown.trim(), rawNormalized);
    }
  }
});

test('Git blob verifier distinguishes exact match, LF-normalized match, and mismatch (fail-closed)', () => {
  const lfSample = '# Title\n\nLine 1\nLine 2\n';
  const expectedSha = computeGitBlobSha1(Buffer.from(lfSample, 'utf8'));

  const exactCheck = verifySourceIntegrity(
    Buffer.from(lfSample, 'utf8'),
    expectedSha
  );
  assert.equal(exactCheck.matchedGitBlobSha, expectedSha);
  assert.equal(exactCheck.verificationStatus, 'git-blob-verified');

  const crlfBytes = Buffer.from(lfSample.replace(/\n/g, '\r\n'), 'utf8');
  const crlfCheck = verifySourceIntegrity(crlfBytes, expectedSha);
  assert.equal(crlfCheck.matchedGitBlobSha, expectedSha);
  assert.equal(
    crlfCheck.verificationStatus,
    'git-blob-verified-lf-normalized'
  );

  const tamperedCheck = verifySourceIntegrity(
    Buffer.from(lfSample + '\nTampered', 'utf8'),
    expectedSha
  );
  assert.equal(tamperedCheck.matchedGitBlobSha, null);
  assert.equal(tamperedCheck.verificationStatus, 'git-blob-mismatch');

  // Fail-closed: mismatched Git blob SHA must NOT publish publicly
  const visionEntry = PROJECT_FOUNDATIONS_SOURCE_MANIFEST[0]!;
  const mismatchArtifact = prepareCanonicalIngestionArtifact({
    manifestEntry: visionEntry,
    internalContentId: 'kh-test-mismatch',
    slug: 'test-mismatch',
    language: 'ar',
    description: { ar: 'اختبار', en: 'Test' },
    rawBodyMarkdown: '# Modified body that will not match Git blob SHA',
    approvalStatus: 'approved',
    sourceCommitSha: BATCH_001_SOURCE_REVISION.commitSha,
    sourceTreeSha: BATCH_001_SOURCE_REVISION.treeSha,
    expectedGitBlobSha: expectedSha,
    rejectOnGitBlobMismatch: true,
    reviewDate: '2026-11-26',
    authorizedForPublic: true,
  });
  assert.equal(
    mismatchArtifact.integrity.verificationStatus,
    'git-blob-mismatch'
  );
  assert.equal(mismatchArtifact.updatedManifestEntry.importStatus, 'rejected');
  assert.equal(mismatchArtifact.updatedManifestEntry.publishedContentId, null);
});

test('KH-022: future-consideration records never receive approvalStatus=approved', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();
  const facDoc = registry.getBySlug('future-architecture-considerations');
  assert.ok(facDoc);
  assert.equal(facDoc.metadata.classification, 'future');
  assert.equal(facDoc.metadata.approvalStatus, 'not-applicable');

  // Validator must reject any future classification document claiming approvalStatus: 'approved'
  const invalidFacRaw = `---
id: kh-test-invalid-fac
slug: test-invalid-fac
title:
  ar: "اختبار"
  en: "Test"
description:
  ar: "وصف"
  en: "Desc"
language: ar
type: future-consideration
classification: future
editorialStatus: published
publicationStatus: public
approvalStatus: approved
implementationStatus: not-applicable
depth: L2
journeyStages:
  - architecture
phaseRefs:
  - phase-5
moduleRefs: []
domainRefs: []
topics:
  - governance
tags:
  - fac
relationships: []
source:
  kind: official-source
  repository: "https://github.com/Alabasi1980/TeranooErp"
  sourcePath: "teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md"
  sourceTitle: "FAC"
  attribution: "Teranoo ERP"
  sourceLanguage: "ar"
publicationAuthorization:
  authorized: true
  completeness: complete
versioning:
  revision: 1
---

## FAC Test
`;

  const parsed = parseMarkdownDocument(invalidFacRaw, {
    sourceFileRelativePath: 'test/invalid-fac.md',
    collection: 'future',
    isFixture: false,
  });
  const validation = validateLoadedEntries([parsed]);
  assert.equal(validation.ok, false);
  assert.ok(
    validation.errors.some(
      (err) =>
        err.code === 'INCONSISTENT_APPROVAL_STATUS' ||
        err.code === 'INVALID_FRONTMATTER'
    )
  );
});

// ============================================================================
// 2. Decision Register Extractor (126 D-* + Separate D-MKT-01 + Zero Fabrication)
// ============================================================================

test('decisionRegisterExtractor extracts all 126 D-* decisions, exact phase/family totals, separate D-MKT-01, and zero fabricated rationales', () => {
  resetExtractedDecisionRegisterCache();
  const register = getExtractedDecisionRegister();

  assert.equal(register.declaredArchitecturalCount, 126);
  assert.equal(register.architecturalDecisions.length, 126);
  assert.equal(register.byPhaseCounts['phase-3'], 103);
  assert.equal(register.byPhaseCounts['phase-4'], 10);
  assert.equal(register.byPhaseCounts['phase-5'], 13);

  const familyTotal = Object.values(register.byFamilyCounts).reduce(
    (sum, n) => sum + n,
    0
  );
  assert.equal(familyTotal, 126);
  assert.equal(Object.keys(register.byFamilyCounts).length, 11);

  // Every architectural entry preserves D-* format and honest authoritativeSourceImported=false
  const seenIds = new Set<string>();
  for (const item of register.architecturalDecisions) {
    assert.match(item.decisionId, /^D-[A-Z]+-\d{2}$/);
    assert.equal(seenIds.has(item.decisionId), false);
    seenIds.add(item.decisionId);
    assert.equal(item.authoritativeSourceImported, false);
    assert.equal(item.indexSourceSlug, 'decision-register');
    assert.ok(item.shortDecision.length > 0);
  }

  // Spot check key boundary IDs across Phases 3, 4, and 5
  assert.ok(seenIds.has('D-TEN-01'));
  assert.ok(seenIds.has('D-LC-08'));
  assert.ok(seenIds.has('D-DEP-01'));
  assert.ok(seenIds.has('D-DEP-10'));
  assert.ok(seenIds.has('D-PLAT-01'));
  assert.ok(seenIds.has('D-PLAT-08'));
  assert.ok(seenIds.has('D-PLAT-13'));
  assert.equal(seenIds.has('D-MKT-01'), false);

  // Separate D-MKT-01 conditional market decision
  assert.equal(register.marketDecision.decisionId, 'D-MKT-01');
  assert.equal(register.marketDecision.approvalStatus, 'approved-conditional');
  assert.equal(register.marketDecision.outsideArchitecturalCounter, true);
  assert.equal(register.marketDecision.authoritativeSourceImported, false);

  // Governing artifacts: all 6 published across BATCH-001 (2) + BATCH-002 (4)
  assert.equal(register.governingArtifacts.length, 6);
  const publishedGoverning = register.governingArtifacts.filter(
    (g) => g.importedSlug !== null
  );
  assert.equal(publishedGoverning.length, 6);
  assert.ok(publishedGoverning.some((g) => g.importedSlug === 'project-vision'));
  assert.ok(
    publishedGoverning.some(
      (g) => g.importedSlug === 'cross-phase-product-guardrails'
    )
  );
  assert.ok(publishedGoverning.some((g) => g.importedSlug === 'dependency-model'));
  assert.ok(
    publishedGoverning.some((g) => g.importedSlug === 'module-dependency-matrix')
  );
  assert.ok(
    publishedGoverning.some((g) => g.importedSlug === 'module-lifecycle-rules')
  );
  assert.ok(
    publishedGoverning.some(
      (g) => g.importedSlug === 'future-module-extension-rules'
    )
  );
});

// ============================================================================
// 3. Roadmap & Guardrails Extractors
// ============================================================================

test('roadmapExtractor preserves all 14 official stages, Phase 6.5 exit gate, stale-line discrepancy, and separate Continuous Market Evidence track', () => {
  resetExtractedRoadmapCache();
  const roadmap = getExtractedRoadmap();

  assert.equal(roadmap.phases.length, 14);
  assert.equal(roadmap.completedPhasesCount, 5);
  assert.equal(roadmap.totalOfficialPhasesCount, 13);
  assert.equal(roadmap.nextAuthorizedPhaseId, 'phase-6');
  assert.equal(roadmap.hasStalePhase5CurrentLine, true);

  const phase5 = roadmap.phases.find((p) => p.id === 'phase-5');
  const gateA = roadmap.phases.find((p) => p.id === 'decision-gate-a');
  const phase6 = roadmap.phases.find((p) => p.id === 'phase-6');
  const phase65 = roadmap.phases.find((p) => p.id === 'phase-6.5');

  assert.equal(phase5?.status, 'completed');
  assert.equal(phase5?.decisionCount, 13);
  assert.equal(gateA?.status, 'conditionally_approved');
  assert.equal(gateA?.kind, 'decision_gate');
  assert.equal(phase6?.status, 'awaiting_authorization');
  assert.equal(phase65?.code, 'PHASE-6.5');

  assert.equal(roadmap.continuousTrack.isIndependentPlanningPhase, false);
  assert.equal(roadmap.continuousTrack.status, 'ongoing_track');

  // Strict 12 runtime capabilities vs item 13 planning gate
  assert.equal(getRuntimePlatformCapabilities().length, 12);
  assert.equal(getPhase5Capabilities().length, 13);
});

test('guardrailsExtractor extracts all 8 official guardrails preserving exact numbering (1..8) without invented IDs', () => {
  resetExtractedGuardrailsCache();
  const doc = getExtractedGuardrails();

  assert.equal(doc.guardrails.length, 8);
  assert.deepEqual(
    doc.guardrails.map((g) => g.sequenceNumber),
    [1, 2, 3, 4, 5, 6, 7, 8]
  );
  for (const g of doc.guardrails) {
    assert.ok(g.originalTitle.length > 0);
    assert.ok(g.governingPrinciple.length > 0);
    assert.ok(
      !g.governingPrinciple.startsWith('>'),
      `Guardrail ${g.sequenceNumber} governingPrinciple must not contain raw blockquote marker`
    );
    assert.ok(g.sourceSectionAnchor.startsWith('kh-h-'));
    assert.equal(g.sourceDocumentSlug, 'cross-phase-product-guardrails');
  }
  assert.ok(doc.governanceRule.length > 0);
  assert.ok(
    !doc.governanceRule.includes('# '),
    'governanceRule must not leak subsequent Markdown top-level headings'
  );
});

// ============================================================================
// 4. FAC Register Extractor (24 Non-Approved Future Considerations)
// ============================================================================

test('facRegisterExtractor extracts all 24 FAC records strictly as non-approved with unavailable FAC-019..024 detailed docs', () => {
  resetExtractedFacRegisterCache();
  const fac = getExtractedFacRegister();

  assert.equal(fac.records.length, 24);
  assert.equal(fac.byStatusCounts['RESEARCH REQUIRED'], 14);
  assert.equal(fac.byStatusCounts['REVIEW LATER'], 7);
  assert.equal(fac.byStatusCounts.WATCH, 3);
  assert.equal(fac.promotedIdeas.length, 7);
  assert.equal(fac.reviewRulePoints.length, 6);

  for (const rec of fac.records) {
    assert.match(rec.facId, /^FAC-\d{3}$/);
    assert.equal(rec.isApprovedDecision, false);
    assert.equal(rec.sourceDocumentSlug, 'future-architecture-considerations');
    assert.ok(rec.sourceSectionAnchor.startsWith('kh-h-'));
  }

  const withDetailedDoc = fac.records.filter((r) => r.referencedDetailedDoc);
  assert.equal(withDetailedDoc.length, 6);
  for (const rec of withDetailedDoc) {
    assert.equal(rec.detailedDocImported, false);
  }
});

// ============================================================================
// 5. Unified Global Search Deep-Linking & Superseded Summary Ranking
// ============================================================================

test('unified search deep-links D-PLAT-08, D-MKT-01, FAC-024, Phase 6.5, and Guardrails, and demotes superseded summaries', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();
  const decisionRegister = getExtractedDecisionRegister();
  const facRegister = getExtractedFacRegister();
  const roadmap = getExtractedRoadmap();
  const guardrails = getExtractedGuardrails();

  const index = buildUnifiedSearchIndex(
    registry.getAllPublicMetadata(),
    PROJECT_REFERENCE_SNAPSHOT,
    {
      decisionRegister,
      facRegister,
      roadmap,
      guardrails,
    }
  );

  // Exact Decision ID deep-link
  const dPlat08 = searchUnifiedKnowledge('D-PLAT-08', index);
  assert.ok(dPlat08.length >= 1);
  assert.equal(dPlat08[0]?.href, '/decisions?decision=D-PLAT-08');
  assert.equal(dPlat08[0]?.code, 'D-PLAT-08');

  // Conditional Market Decision deep-link
  const dMkt01 = searchUnifiedKnowledge('D-MKT-01', index);
  assert.ok(dMkt01.length >= 1);
  assert.equal(dMkt01[0]?.href, '/decisions?decision=D-MKT-01');

  // FAC ID deep-link
  const fac24 = searchUnifiedKnowledge('FAC-024', index);
  assert.ok(fac24.length >= 1);
  assert.equal(fac24[0]?.href, '/future-considerations?fac=FAC-024');

  // Phase 6.5 deep-link
  const phase65 = searchUnifiedKnowledge('PHASE-6.5', index);
  assert.ok(phase65.some((r) => r.href === '/roadmap?phase=phase-6.5'));

  // Guardrail deep-link
  const guardrailMatch = searchUnifiedKnowledge('Single Product Line', index);
  assert.ok(
    guardrailMatch.some((r) => r.href === '/architecture?guardrail=1#guardrail-1')
  );

  // Full official project-vision ranks ahead of superseded historical summary
  const visionResults = searchUnifiedKnowledge('00_PROJECT_VISION', index);
  const fullIdx = visionResults.findIndex(
    (r) => r.href === '/knowledge/project-vision'
  );
  const supersededIdx = visionResults.findIndex(
    (r) => r.href === '/knowledge/teranoo-product-vision-reference'
  );
  assert.ok(fullIdx !== -1);
  if (supersededIdx !== -1) {
    assert.ok(fullIdx < supersededIdx);
  }
});
