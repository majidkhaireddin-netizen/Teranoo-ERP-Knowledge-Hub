import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  loadApprovedCollections,
  parseMarkdownDocument,
} from '@/content/loaders/contentLoader';
import {
  HEADING_ID_PREFIX,
  renderSafeMarkdown,
} from '@/content/loaders/markdownPipeline';
import {
  normalizeRepoRelativePath,
  resolveMarkdownImage,
  resolveMarkdownLink,
} from '@/content/loaders/relativeLinkResolver';
import {
  ContentIntegrityError,
  validateApprovedCollections,
} from '@/content/validators/contentValidator';
import {
  createContentRegistry,
  getContentRegistry,
  resetContentRegistryCache,
} from '@/content/registry/contentRegistry';
import {
  PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
  generateSourceReadinessReport,
  getSourceManifestEntryByPath,
  validateSourceManifest,
} from '@/content/manifest/sourceManifest';
import {
  computeSourceSha256,
  prepareCanonicalIngestionArtifact,
} from '@/content/ingestion/ingestionPipeline';
import {
  getPhase5Capabilities,
  getReferenceCounts,
} from '@/content/repositories/projectRepository';
import { isValidOfficialPhaseRef } from '@/content/taxonomy/registry';
import type { SourceManifestEntry } from '@/content/models/knowledge';

function makeRawMarkdown(overrides: {
  id?: string;
  slug?: string;
  language?: 'ar' | 'en' | 'mixed';
  editorialStatus?: string;
  publicationStatus?: string;
  authorized?: boolean;
  body?: string;
  sourceYaml?: string;
} = {}): string {
  const id = overrides.id ?? 'kh-test-integrity-1';
  const slug = overrides.slug ?? 'test-integrity-1';
  const language = overrides.language ?? 'en';
  const editorialStatus = overrides.editorialStatus ?? 'published';
  const publicationStatus = overrides.publicationStatus ?? 'public';
  const authorized = overrides.authorized ?? true;
  const body = overrides.body ?? '## Section One\n\nContent body.';
  const sourceYaml =
    overrides.sourceYaml ??
    `  kind: knowledge-hub-authored
  publisher: "Test Suite"
  attribution: "Test Suite"`;

  return `---
id: ${id}
slug: ${slug}
title:
  ar: "عنوان اختباري"
  en: "Integrity Test Document"
description:
  ar: "وصف اختباري"
  en: "Integrity test description"
language: ${language}
type: educational-explanation
classification: educational
editorialStatus: ${editorialStatus}
publicationStatus: ${publicationStatus}
approvalStatus: not-applicable
implementationStatus: not-applicable
depth: L2
journeyStages:
  - product-discovery
phaseRefs:
  - phase-5
moduleRefs: []
domainRefs: []
topics:
  - governance
tags:
  - test
relationships: []
source:
${sourceYaml}
publicationAuthorization:
  authorized: ${authorized}
  completeness: complete
versioning:
  revision: 1
---

${body}
`;
}

// ============================================================================
// 1. Content Integrity Tests (TASK-002 Correction B)
// ============================================================================

test('createContentRegistry throws ContentIntegrityError on duplicate IDs or duplicate slugs instead of silently overwriting', () => {
  const docA = parseMarkdownDocument(
    makeRawMarkdown({ id: 'kh-dup-reg-id', slug: 'reg-slug-a' }),
    { sourceFileRelativePath: 'test/a.md', collection: 'educational', isFixture: false }
  );
  const docB = parseMarkdownDocument(
    makeRawMarkdown({ id: 'kh-dup-reg-id', slug: 'reg-slug-b' }),
    { sourceFileRelativePath: 'test/b.md', collection: 'educational', isFixture: false }
  );
  assert.ok(docA.ok && docB.ok);

  assert.throws(
    () => createContentRegistry([docA.document, docB.document]),
    (err: unknown) =>
      err instanceof ContentIntegrityError &&
      err.diagnostics.some((d) => d.code === 'DUPLICATE_ID')
  );

  const docC = parseMarkdownDocument(
    makeRawMarkdown({ id: 'kh-unique-reg-c', slug: 'reg-slug-a' }),
    { sourceFileRelativePath: 'test/c.md', collection: 'educational', isFixture: false }
  );
  assert.ok(docC.ok);

  assert.throws(
    () => createContentRegistry([docA.document, docC.document]),
    (err: unknown) =>
      err instanceof ContentIntegrityError &&
      err.diagnostics.some((d) => d.code === 'DUPLICATE_SLUG')
  );
});

test('getContentRegistry fails loudly on invalid files in a collection root while excluding valid unpublished records cleanly', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teranoo-kh-integrity-'));
  try {
    const eduDir = path.join(tmpDir, 'educational');
    fs.mkdirSync(eduDir, { recursive: true });

    // Valid published file + valid intentionally unpublished draft
    fs.writeFileSync(
      path.join(eduDir, 'published.md'),
      makeRawMarkdown({ id: 'kh-tmp-pub', slug: 'tmp-pub' }),
      'utf8'
    );
    fs.writeFileSync(
      path.join(eduDir, 'draft.md'),
      makeRawMarkdown({
        id: 'kh-tmp-draft',
        slug: 'tmp-draft',
        editorialStatus: 'draft',
        publicationStatus: 'private',
        authorized: false,
      }),
      'utf8'
    );

    const cleanReg = getContentRegistry(tmpDir);
    assert.equal(cleanReg.getStats().totalPublished, 1);
    assert.ok(cleanReg.getBySlug('tmp-pub'));
    assert.equal(cleanReg.getBySlug('tmp-draft'), null);

    // Add an invalid file with broken frontmatter -> MUST throw ContentIntegrityError
    fs.writeFileSync(
      path.join(eduDir, 'broken.md'),
      '---\nid: kh-broken-only\n---\nMissing required schema fields.\n',
      'utf8'
    );

    assert.throws(() => getContentRegistry(tmpDir), ContentIntegrityError);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('approved repository collections validate cleanly with all 16 BATCH-001+002 official sources plus 4 foundational records', () => {
  resetContentRegistryCache();
  const report = validateApprovedCollections();
  assert.equal(report.ok, true);
  assert.equal(report.errors.length, 0);
  assert.equal(report.validRecordsCount, 20);
  assert.equal(report.publishedRecordsCount, 20);
  assert.equal(report.unpublishedValidRecordsCount, 0);

  const registry = getContentRegistry();
  const visionAr = registry.getBySlug('teranoo-product-vision-reference');
  const visionEn = registry.getBySlug('teranoo-product-vision-reference-en');
  const fullVision = registry.getBySlug('project-vision');
  assert.ok(visionAr && visionEn && fullVision);

  // Historical summaries remain superseded and point cleanly to full official source
  assert.equal(visionAr.metadata.editorialStatus, 'superseded');
  assert.equal(visionEn.metadata.editorialStatus, 'superseded');
  assert.equal(visionAr.metadata.traceability.officialDocumentId, undefined);
  assert.equal(visionEn.metadata.traceability.officialDocumentId, undefined);

  assert.ok(
    visionAr.metadata.relationships.some(
      (r) => r.type === 'derived-from' && r.targetId === 'kh-doc-project-vision-ar'
    )
  );
  assert.ok(
    visionEn.metadata.relationships.some(
      (r) => r.type === 'derived-from' && r.targetId === 'kh-doc-project-vision-ar'
    )
  );
});

// ============================================================================
// 2. Heading Anchor Collision & DOM-Clobbering Tests (TASK-002 Correction C)
// ============================================================================

test('heading anchor generator guarantees global uniqueness for Example, Example, Example-2, Example collisions and Arabic/mixed headings', () => {
  const md = [
    '## Example',
    '',
    '## Example',
    '',
    '## Example-2',
    '',
    '## Example',
    '',
    '### الهوية المؤسسية',
    '',
    '### الهوية المؤسسية',
    '',
    '### الهوية المؤسسية-2',
    '',
    '### الهوية المؤسسية',
    '',
    '## Phase 5 — القدرات المشتركة',
    '',
    '## Phase 5 — القدرات المشتركة',
  ].join('\n');

  const rendered = renderSafeMarkdown(md);
  assert.equal(rendered.headings.length, 10);

  const ids = rendered.headings.map((h) => h.id);
  // Every ID must be globally unique
  assert.equal(new Set(ids).size, 10);

  // Every ID must carry the DOM-clobbering-safe prefix and exist in rendered HTML
  for (const id of ids) {
    assert.ok(
      id.startsWith(HEADING_ID_PREFIX),
      `Expected ${id} to start with ${HEADING_ID_PREFIX}`
    );
    assert.ok(
      rendered.html.includes(`id="${id}"`),
      `Expected rendered HTML to include id="${id}" for 1:1 TOC match`
    );
  }

  // Verify exact collision resolution for Example / Example / Example-2 / Example
  assert.deepEqual(ids.slice(0, 4), [
    'kh-h-example',
    'kh-h-example-2',
    'kh-h-example-2-2',
    'kh-h-example-3',
  ]);
});

test('heading anchor generator prevents DOM clobbering for built-in browser identifiers', () => {
  const rendered = renderSafeMarkdown(
    '## document\n\n## location\n\n## forms\n\n## constructor'
  );
  for (const h of rendered.headings) {
    assert.ok(h.id.startsWith(HEADING_ID_PREFIX));
  }
  assert.equal(rendered.html.includes('id="document"'), false);
  assert.equal(rendered.html.includes('id="location"'), false);
  assert.equal(rendered.html.includes('id="forms"'), false);
  assert.equal(rendered.html.includes('id="constructor"'), false);
});

// ============================================================================
// 3. Relative Source Links & Governed Image Tests (TASK-002 Correction D)
// ============================================================================

test('relative Markdown links resolve published targets to /knowledge/[slug], mark unimported targets as deferred, and block unsafe or traversal links', () => {
  const publishedSourcePathToSlug = new Map<string, string>([
    [
      'teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md',
      'teranoo-project-work-plan',
    ],
  ]);

  // Direct resolver checks
  assert.equal(
    normalizeRepoRelativePath(
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
      './PROJECT_WORK_PLAN.md'
    ),
    'teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md'
  );
  assert.equal(
    normalizeRepoRelativePath(
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
      '../../../../etc/passwd'
    ),
    null
  );

  const publishedLink = resolveMarkdownLink('./PROJECT_WORK_PLAN.md#Core Goals', {
    currentSourcePath:
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
    publishedSourcePathToSlug,
  });
  assert.equal(publishedLink.kind, 'resolved-published');
  if (publishedLink.kind === 'resolved-published') {
    assert.equal(
      publishedLink.href,
      '/knowledge/teranoo-project-work-plan#kh-h-core-goals'
    );
  }

  const deferredLink = resolveMarkdownLink('./WORKING_RULES.md', {
    currentSourcePath:
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
    publishedSourcePathToSlug,
  });
  assert.equal(deferredLink.kind, 'deferred-source');

  const unsafeTraversal = resolveMarkdownLink('../../../../etc/passwd', {
    currentSourcePath:
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
    publishedSourcePathToSlug,
  });
  assert.equal(unsafeTraversal.kind, 'unsafe');

  const unsafeScheme = resolveMarkdownLink('javascript:alert(1)');
  assert.equal(unsafeScheme.kind, 'unsafe');

  const nonMarkdownRelative = resolveMarkdownLink('./secrets.env', {
    currentSourcePath:
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
    publishedSourcePathToSlug,
  });
  assert.equal(nonMarkdownRelative.kind, 'unsafe');

  // End-to-end renderSafeMarkdown verification
  const rendered = renderSafeMarkdown(
    [
      '## Goals',
      '',
      'See [Work Plan](./PROJECT_WORK_PLAN.md#goals), [Working Rules](./WORKING_RULES.md), [Jump](#goals), and [Bad](../secret.env).',
    ].join('\n'),
    {
      currentSourcePath:
        'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
      publishedSourcePathToSlug,
    }
  );

  assert.ok(
    rendered.html.includes('href="/knowledge/teranoo-project-work-plan#kh-h-goals"')
  );
  assert.ok(rendered.html.includes('href="#kh-h-goals"'));
  assert.ok(rendered.html.includes('kh-deferred-link'));
  assert.equal(rendered.deferredReferences.length, 1);
  assert.equal(
    rendered.deferredReferences[0]?.normalizedSourcePath,
    'teranoo-erp-planning/00-project-foundation/WORKING_RULES.md'
  );
  assert.ok(rendered.unsafeUrlsFound.includes('../secret.env'));
});

test('governed local images allow /assets/knowledge/*, defer relative source images, and block unsafe image URLs', () => {
  const allowed = resolveMarkdownImage('/assets/knowledge/erp-diagram.png');
  assert.equal(allowed.kind, 'allowed');

  const deferred = resolveMarkdownImage('./images/phase5-arch.png', {
    currentSourcePath:
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
  });
  assert.equal(deferred.kind, 'deferred-asset');

  const blockedSvgData = resolveMarkdownImage('data:image/svg+xml;base64,PHN2Zz4=');
  assert.equal(blockedSvgData.kind, 'unsafe');

  const blockedTraversal = resolveMarkdownImage(
    '/assets/knowledge/../../secret.png'
  );
  assert.equal(blockedTraversal.kind, 'unsafe');

  const rendered = renderSafeMarkdown(
    '![Governed](/assets/knowledge/overview.png)\n\n![Deferred](./assets/diagram.png)\n\n![Unsafe](javascript:alert(1))',
    {
      currentSourcePath:
        'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
    }
  );
  assert.ok(rendered.html.includes('src="/assets/knowledge/overview.png"'));
  assert.ok(rendered.html.includes('kh-deferred-asset'));
  assert.equal(rendered.deferredReferences.length, 1);
  assert.equal(rendered.deferredReferences[0]?.kind, 'asset');
  assert.ok(rendered.unsafeUrlsFound.includes('javascript:alert(1)'));
});

// ============================================================================
// 4. Official Source Manifest & Ingestion Pipeline Tests
// ============================================================================

test('Project Foundations Source Manifest registers all 6 verified official BATCH-001 sources as published with Git blob verification', () => {
  assert.equal(PROJECT_FOUNDATIONS_SOURCE_MANIFEST.length, 6);

  const summary = deriveSourceManifestSummary(
    PROJECT_FOUNDATIONS_SOURCE_MANIFEST
  );
  assert.equal(summary.totalSources, 6);
  assert.equal(summary.awaitingSourceCount, 0);
  assert.equal(summary.importedCount, 0);
  assert.equal(summary.publishedCount, 6);

  const visionEntry = getSourceManifestEntryByPath(
    'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md'
  );
  assert.ok(visionEntry);
  assert.equal(visionEntry.importStatus, 'published');
  assert.equal(visionEntry.publicationAuthorizationStatus, 'authorized');
  assert.equal(visionEntry.publishedContentId, 'kh-doc-project-vision-ar');
  assert.equal(
    visionEntry.sourceVerificationStatus,
    'git-blob-verified-lf-normalized'
  );

  const report = generateSourceReadinessReport(
    PROJECT_FOUNDATIONS_SOURCE_MANIFEST
  );
  assert.equal(report.summary.totalSources, 6);
  assert.equal(report.awaitingDelivery.length, 0);
  assert.equal(report.readyForPublicDisplay.length, 6);
});

test('validateSourceManifest rejects duplicate source paths, missing provenance on received sources, and unauthorized published entries', () => {
  const baseEntry = PROJECT_FOUNDATIONS_SOURCE_MANIFEST[0]!;
  const duplicatePath: SourceManifestEntry = {
    ...baseEntry,
    sourceRefId: 'src-duplicate-path',
  };
  const receivedWithoutProvenance: SourceManifestEntry = {
    ...PROJECT_FOUNDATIONS_SOURCE_MANIFEST[2]!,
    importStatus: 'source-received',
    sourceRevision: null,
    sourceFileHash: null,
    completeness: 'complete',
  };
  const unauthorizedPublished: SourceManifestEntry = {
    ...PROJECT_FOUNDATIONS_SOURCE_MANIFEST[3]!,
    importStatus: 'published',
    publicationAuthorizationStatus: 'pending',
    sourceFileHash: 'a'.repeat(64),
    completeness: 'complete',
    availableLanguages: ['ar'],
    publishedContentId: 'kh-non-existent-doc',
  };

  const result = validateSourceManifest(
    [baseEntry, duplicatePath, receivedWithoutProvenance, unauthorizedPublished],
    new Set(['kh-doc-product-vision-ref-ar'])
  );

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((e) => e.code === 'DUPLICATE_SOURCE_PATH'));
  assert.ok(result.errors.some((e) => e.code === 'MISSING_SOURCE_PROVENANCE'));
  assert.ok(result.errors.some((e) => e.code === 'UNAUTHORIZED_SOURCE_PUBLICATION'));
  assert.ok(result.errors.some((e) => e.code === 'UNRESOLVED_PUBLISHED_CONTENT_ID'));
});

test('canonical ingestion pipeline preserves original Markdown verbatim, computes SHA-256, and gates public exposure on explicit authorization', () => {
  const visionEntry = getSourceManifestEntryByPath(
    'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md'
  );
  assert.ok(visionEntry);

  const sampleOfficialBody =
    '# Teranoo ERP — Official Vision\n\n## Core Purpose\n\nOriginal verified Markdown text preserved verbatim.';
  const expectedHash = computeSourceSha256(sampleOfficialBody);
  assert.equal(expectedHash.length, 64);

  // Without explicit public authorization -> internal / under-review (NOT published)
  const internalArtifact = prepareCanonicalIngestionArtifact({
    manifestEntry: { ...visionEntry, expectedGitBlobSha: null },
    internalContentId: 'kh-official-project-vision-ar',
    slug: 'official-project-vision',
    language: 'ar',
    description: {
      ar: 'وثيقة رؤية المنتج الرسمية لنظام تيرانو ERP.',
      en: 'Official Teranoo ERP product vision document.',
    },
    rawBodyMarkdown: sampleOfficialBody,
    approvalStatus: 'approved',
    expectedGitBlobSha: null,
    sourceCommitSha: 'a922a69b54bc0cc611ae46d8e7434907cde0046a',
    reviewDate: '2026-11-26',
    authorizedForPublic: false,
  });

  assert.equal(internalArtifact.sourceSha256, expectedHash);
  assert.equal(internalArtifact.parsedEntry.ok, true);
  assert.equal(internalArtifact.updatedManifestEntry.importStatus, 'validated');
  assert.equal(
    internalArtifact.updatedManifestEntry.publicationAuthorizationStatus,
    'pending'
  );
  assert.equal(internalArtifact.updatedManifestEntry.publishedContentId, null);
  assert.ok(internalArtifact.canonicalMarkdown.includes(sampleOfficialBody));

  if (internalArtifact.parsedEntry.ok) {
    assert.equal(
      internalArtifact.parsedEntry.document.metadata.publicationStatus,
      'internal'
    );
    assert.equal(
      internalArtifact.parsedEntry.document.metadata.publicationAuthorization
        .authorized,
      false
    );
    assert.equal(
      internalArtifact.parsedEntry.document.bodyMarkdown.trim(),
      sampleOfficialBody.trim()
    );
  }

  // With explicit public authorization -> public / published
  const publicArtifact = prepareCanonicalIngestionArtifact({
    manifestEntry: { ...visionEntry, expectedGitBlobSha: null },
    internalContentId: 'kh-official-project-vision-ar',
    slug: 'official-project-vision',
    language: 'ar',
    description: {
      ar: 'وثيقة رؤية المنتج الرسمية لنظام تيرانو ERP.',
      en: 'Official Teranoo ERP product vision document.',
    },
    rawBodyMarkdown: sampleOfficialBody,
    approvalStatus: 'approved',
    expectedGitBlobSha: null,
    sourceCommitSha: 'a922a69b54bc0cc611ae46d8e7434907cde0046a',
    reviewDate: '2026-11-26',
    publicationDate: '2026-11-26',
    authorizedForPublic: true,
    authorizedBy: 'Project Owner',
  });
  assert.equal(publicArtifact.parsedEntry.ok, true);
  assert.equal(publicArtifact.updatedManifestEntry.importStatus, 'published');
  assert.equal(
    publicArtifact.updatedManifestEntry.publicationAuthorizationStatus,
    'authorized'
  );
  assert.equal(
    publicArtifact.updatedManifestEntry.publishedContentId,
    'kh-official-project-vision-ar'
  );
});

// ============================================================================
// 5. Content Presentation & Derived Metrics Tests
// ============================================================================

test('registry stats separate published variants from unique conceptual topics and official imported documents', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();
  const stats = registry.getStats();

  assert.equal(stats.totalPublished, 20);
  assert.equal(stats.uniqueConceptualTopics, 18);
  assert.equal(stats.officialImportedCount, 16);
  assert.equal(stats.activeCollectionsCount, 3);
});

test('decision metrics transparently track 126 indexed decisions, 13 Phase 5 decisions (D-PLAT-01..13), and phase-6.5 support', () => {
  const counts = getReferenceCounts();
  const verifiedPhase5DecisionIds = new Set(
    getPhase5Capabilities()
      .map((cap) => cap.decisionId)
      .filter((id): id is string => id !== null)
  );
  assert.equal(counts.approvedArchitecturalDecisions, 126);
  assert.equal(verifiedPhase5DecisionIds.size, 13);
  assert.equal(isValidOfficialPhaseRef('phase-6.5'), true);
});

test('two-pass collection loader resolves cross-document relative Markdown links between published official files', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'teranoo-kh-twopass-'));
  try {
    const officialDir = path.join(tmpDir, 'official');
    fs.mkdirSync(officialDir, { recursive: true });

    fs.writeFileSync(
      path.join(officialDir, 'vision.md'),
      makeRawMarkdown({
        id: 'kh-tmp-vision',
        slug: 'tmp-vision',
        sourceYaml: `  kind: official-source
  repository: "https://github.com/Alabasi1980/TeranooErp"
  sourcePath: "teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md"
  sourceTitle: "Product Vision"
  attribution: "Teranoo ERP"
  sourceLanguage: "en"`,
        body: '## Vision\n\nSee [Work Plan](./PROJECT_WORK_PLAN.md#milestones) and [Rules](./WORKING_RULES.md).',
      }),
      'utf8'
    );

    fs.writeFileSync(
      path.join(officialDir, 'work-plan.md'),
      makeRawMarkdown({
        id: 'kh-tmp-work-plan',
        slug: 'tmp-work-plan',
        sourceYaml: `  kind: official-source
  repository: "https://github.com/Alabasi1980/TeranooErp"
  sourcePath: "teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md"
  sourceTitle: "Project Work Plan"
  attribution: "Teranoo ERP"
  sourceLanguage: "en"`,
        body: '## Milestones\n\nWork plan milestones.',
      }),
      'utf8'
    );

    const entries = loadApprovedCollections(tmpDir);
    const vision = entries.find(
      (e) => e.ok && e.document.metadata.slug === 'tmp-vision'
    );
    assert.ok(vision && vision.ok);
    assert.ok(
      vision.document.renderedHtml.includes(
        'href="/knowledge/tmp-work-plan#kh-h-milestones"'
      )
    );
    assert.ok(vision.document.renderedHtml.includes('kh-deferred-link'));
    assert.equal(vision.document.deferredReferences.length, 1);
    assert.equal(
      vision.document.deferredReferences[0]?.normalizedSourcePath,
      'teranoo-erp-planning/00-project-foundation/WORKING_RULES.md'
    );
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
