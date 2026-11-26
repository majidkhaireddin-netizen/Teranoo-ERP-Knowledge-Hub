import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  CONTENT_COLLECTIONS_ROOT,
  ContentPathSecurityError,
  loadApprovedCollections,
  loadTestFixtures,
  parseMarkdownDocument,
  resolveSafeContentPath,
} from '@/content/loaders/contentLoader';
import { renderSafeMarkdown } from '@/content/loaders/markdownPipeline';
import {
  validateApprovedCollections,
  validateLoadedEntries,
} from '@/content/validators/contentValidator';
import {
  createContentRegistry,
  getContentRegistry,
  resetContentRegistryCache,
} from '@/content/registry/contentRegistry';
import {
  buildUnifiedSearchIndex,
  searchUnifiedKnowledge,
} from '@/content/search/knowledgeSearch';
import { resolveRendererForContentType } from '@/content/renderers/rendererRegistry';
import {
  CONTENT_CLASSIFICATION_VALUES,
  CONTENT_TYPE_VALUES,
  isValidOfficialPhaseRef,
} from '@/content/taxonomy/registry';
import type { KnowledgeDocument } from '@/content/models/knowledge';

function makeValidRawDoc(overrides: {
  id?: string;
  slug?: string;
  language?: 'ar' | 'en' | 'mixed';
  editorialStatus?: string;
  publicationStatus?: string;
  approvalStatus?: string;
  authorized?: boolean;
  relationshipsYaml?: string;
  body?: string;
} = {}): string {
  const id = overrides.id ?? 'kh-test-doc-1';
  const slug = overrides.slug ?? 'test-doc-1';
  const language = overrides.language ?? 'en';
  const editorialStatus = overrides.editorialStatus ?? 'published';
  const publicationStatus = overrides.publicationStatus ?? 'public';
  const approvalStatus = overrides.approvalStatus ?? 'not-applicable';
  const authorized = overrides.authorized ?? true;
  const relationshipsYaml = overrides.relationshipsYaml ?? '[]';
  const body = overrides.body ?? '## Heading\n\nValid body text.';

  return `---
id: ${id}
slug: ${slug}
title:
  ar: "عنوان اختباري"
  en: "Test Title"
description:
  ar: "وصف اختباري"
  en: "Test description"
language: ${language}
type: educational-explanation
classification: educational
editorialStatus: ${editorialStatus}
publicationStatus: ${publicationStatus}
approvalStatus: ${approvalStatus}
implementationStatus: not-applicable
depth: L2
journeyStages:
  - architecture
phaseRefs:
  - phase-5
moduleRefs:
  - finance
domainRefs:
  - audit-trail
topics:
  - governance
tags:
  - test
relationships: ${relationshipsYaml}
source:
  kind: knowledge-hub-authored
  publisher: "Test Suite"
  attribution: "Test Suite"
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
// 1. Content Loading & Integrity Validation
// ============================================================================

test('approved local collections load cleanly and pass full integrity validation with zero errors', () => {
  const report = validateApprovedCollections();
  assert.equal(report.ok, true);
  assert.equal(report.errors.length, 0);
  assert.equal(report.totalFilesScanned, 10);
  assert.equal(report.validRecordsCount, 10);
  assert.equal(report.publishedRecordsCount, 10);
  // Explicit deferred reference to DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md produces non-blocking warning
  assert.ok(report.warnings.some((w) => w.code === 'DEFERRED_REFERENCE'));
});

test('content loader rejects invalid frontmatter, missing required fields, and JS frontmatter execution', () => {
  const missingFields = parseMarkdownDocument('---\nid: kh-incomplete\n---\nBody', {
    sourceFileRelativePath: 'test/missing.md',
    collection: 'educational',
    isFixture: true,
  });
  assert.equal(missingFields.ok, false);
  if (!missingFields.ok) {
    assert.ok(missingFields.issues.some((i) => i.field === 'slug'));
    assert.ok(missingFields.issues.some((i) => i.field === 'title'));
  }

  const jsFrontmatter = parseMarkdownDocument(
    '---js\n{ id: "kh-exploit", injected: process.exit(1) }\n---\nBody',
    {
      sourceFileRelativePath: 'test/js-engine.md',
      collection: 'educational',
      isFixture: true,
    }
  );
  assert.equal(jsFrontmatter.ok, false);
  if (!jsFrontmatter.ok) {
    assert.ok(
      jsFrontmatter.issues[0]?.message.includes(
        'JavaScript frontmatter execution is prohibited'
      )
    );
  }
});

test('content validator detects duplicate content IDs, duplicate slugs, and official ID collisions', () => {
  const docA = parseMarkdownDocument(
    makeValidRawDoc({ id: 'kh-dup-id', slug: 'unique-slug-a' }),
    { sourceFileRelativePath: 'test/a.md', collection: 'educational', isFixture: false }
  );
  const docB = parseMarkdownDocument(
    makeValidRawDoc({ id: 'kh-dup-id', slug: 'unique-slug-b' }),
    { sourceFileRelativePath: 'test/b.md', collection: 'educational', isFixture: false }
  );
  const docC = parseMarkdownDocument(
    makeValidRawDoc({ id: 'kh-unique-c', slug: 'unique-slug-a' }),
    { sourceFileRelativePath: 'test/c.md', collection: 'educational', isFixture: false }
  );
  const officialCollision = parseMarkdownDocument(
    makeValidRawDoc({ id: 'd-plat-99', slug: 'collision-slug' }),
    { sourceFileRelativePath: 'test/d.md', collection: 'educational', isFixture: false }
  );

  const report = validateLoadedEntries([docA, docB, docC, officialCollision]);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((e) => e.code === 'DUPLICATE_ID'));
  assert.ok(report.errors.some((e) => e.code === 'DUPLICATE_SLUG'));
  assert.ok(report.errors.some((e) => e.code === 'OFFICIAL_ID_COLLISION'));
});

test('taxonomy supports 8 classifications, 35 content types, and non-integer official phases (phase-6.5)', () => {
  assert.equal(CONTENT_CLASSIFICATION_VALUES.length, 8);
  assert.equal(CONTENT_TYPE_VALUES.length, 35);
  assert.equal(isValidOfficialPhaseRef('phase-5'), true);
  assert.equal(isValidOfficialPhaseRef('phase-6.5'), true);
  assert.equal(isValidOfficialPhaseRef('phase-10.25'), true);
  assert.equal(isValidOfficialPhaseRef('invalid-phase'), false);
});

// ============================================================================
// 2. Content Relationships & Backlinks
// ============================================================================

test('content registry resolves outgoing relationships, incoming backlinks, deferred refs, and external refs', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();

  const visionAr = registry.getBySlug('teranoo-product-vision-reference');
  assert.ok(visionAr);

  const rels = registry.getRelationships(visionAr.metadata.id);
  // Outgoing includes translation-of EN, related-to educational AR, and deferred original 00_PROJECT_VISION.md
  assert.ok(
    rels.outgoing.some(
      (r) =>
        r.type === 'translation-of' &&
        r.status === 'resolved' &&
        r.targetSlug === 'teranoo-product-vision-reference-en'
    )
  );
  assert.ok(
    rels.outgoing.some(
      (r) =>
        r.type === 'derived-from' &&
        r.status === 'resolved' &&
        r.targetSlug === 'project-vision'
    )
  );
  // Incoming backlink from educational governance article referencing Product Vision AR
  assert.ok(
    rels.incoming.some(
      (r) =>
        r.type === 'references' &&
        r.status === 'resolved' &&
        r.targetSlug === 'knowledge-classification-governance'
    )
  );

  // Explicit collection sequence neighbors
  const neighbors = registry.getCollectionNeighbors(visionAr.metadata.id);
  assert.equal(neighbors.previous, null);
  assert.equal(neighbors.next?.slug, 'knowledge-classification-governance');

  // External relationship check via fixture
  const fixtureEntries = loadTestFixtures();
  const validFixtureDocs: KnowledgeDocument[] = [];
  for (const entry of fixtureEntries) {
    if (entry.ok) {
      validFixtureDocs.push({
        ...entry.document,
        metadata: { ...entry.document.metadata, isFixture: false },
      });
    }
  }
  const fixtureReg = createContentRegistry(validFixtureDocs);
  const researchDoc = fixtureReg.getBySlug('fixture-research-sample');
  assert.ok(researchDoc);
  const researchRels = fixtureReg.getRelationships(researchDoc.metadata.id);
  assert.ok(researchRels.outgoing.some((r) => r.status === 'external'));
  assert.ok(researchRels.outgoing.some((r) => r.status === 'deferred'));
});

test('validator flags broken internal references and public-to-unpublished references as errors', () => {
  const brokenRefDoc = parseMarkdownDocument(
    makeValidRawDoc({
      id: 'kh-broken-src',
      slug: 'broken-src',
      relationshipsYaml: '\n  - type: references\n    targetId: kh-does-not-exist',
    }),
    { sourceFileRelativePath: 'test/broken.md', collection: 'educational', isFixture: false }
  );

  const privateTarget = parseMarkdownDocument(
    makeValidRawDoc({
      id: 'kh-private-target',
      slug: 'private-target',
      editorialStatus: 'draft',
      publicationStatus: 'private',
      authorized: false,
    }),
    { sourceFileRelativePath: 'test/private.md', collection: 'educational', isFixture: false }
  );

  const publicToPrivate = parseMarkdownDocument(
    makeValidRawDoc({
      id: 'kh-public-src',
      slug: 'public-src',
      relationshipsYaml: '\n  - type: references\n    targetId: kh-private-target',
    }),
    { sourceFileRelativePath: 'test/public.md', collection: 'educational', isFixture: false }
  );

  const report = validateLoadedEntries([
    brokenRefDoc,
    privateTarget,
    publicToPrivate,
  ]);
  assert.equal(report.ok, false);
  assert.ok(report.errors.some((e) => e.code === 'BROKEN_INTERNAL_REFERENCE'));
  assert.ok(
    report.errors.some((e) => e.code === 'PUBLIC_TO_UNPUBLISHED_REFERENCE')
  );
});

// ============================================================================
// 3. Publication Boundary
// ============================================================================

test('publication boundary excludes unpublished drafts, approved-but-unauthorized records, and test fixtures', () => {
  resetContentRegistryCache();
  const prodRegistry = getContentRegistry();

  // Production registry contains only the 10 authorized records, zero fixtures
  assert.equal(prodRegistry.getStats().totalPublished, 10);
  assert.equal(prodRegistry.getBySlug('unpublished-draft'), null);
  assert.equal(prodRegistry.getBySlug('unauthorized-approved-record'), null);
  assert.equal(prodRegistry.getBySlug('fixture-research-sample'), null);

  // Even when fixtures are passed directly to createContentRegistry, isFixture=true excludes them
  const rawFixtures = loadTestFixtures();
  const parsedFixtureDocs = rawFixtures
    .filter((e): e is Extract<typeof e, { ok: true }> => e.ok)
    .map((e) => e.document);

  const withFixturesRegistry = createContentRegistry(parsedFixtureDocs);
  assert.equal(withFixturesRegistry.getStats().totalPublished, 0);

  // Even if isFixture were false, draft and unauthorized-approved records remain excluded
  const simulatedCollectionDocs = parsedFixtureDocs.map((doc) => ({
    ...doc,
    metadata: { ...doc.metadata, isFixture: false },
  }));
  const simulatedRegistry = createContentRegistry(simulatedCollectionDocs);
  assert.equal(simulatedRegistry.getBySlug('unpublished-draft'), null);
  assert.equal(simulatedRegistry.getBySlug('unauthorized-approved-record'), null);
  assert.ok(simulatedRegistry.getBySlug('fixture-research-sample'));
});

// ============================================================================
// 4. Unified Search
// ============================================================================

test('unified search matches Arabic title, English title, official IDs, topics, content types, and excludes drafts', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();

  // Pass both public records AND an unpublished draft to verify buildUnifiedSearchIndex defense-in-depth
  const draftEntry = loadTestFixtures().find(
    (e) => e.ok && e.document.metadata.slug === 'unpublished-draft'
  );
  assert.ok(draftEntry && draftEntry.ok);

  const index = buildUnifiedSearchIndex([
    ...registry.getAllPublicMetadata(),
    draftEntry.document.metadata,
  ]);

  // Arabic title search
  const arMatches = searchUnifiedKnowledge('التمييز بين تصنيفات المعرفة', index);
  assert.ok(
    arMatches.some(
      (m) => m.href === '/knowledge/knowledge-classification-governance'
    )
  );

  // English title search
  const enMatches = searchUnifiedKnowledge('Snapshot-Derived Reference', index);
  assert.ok(
    enMatches.some(
      (m) => m.href === '/knowledge/teranoo-product-vision-reference-en'
    )
  );

  // Official decision ID lookup via both search and registry
  const decisionMatches = searchUnifiedKnowledge('D-PLAT-01', index);
  assert.ok(
    decisionMatches.some(
      (m) => m.href === '/knowledge/teranoo-product-vision-reference'
    )
  );
  assert.ok(registry.getByOfficialId('D-PLAT-01').length >= 2);

  // Topic & content type search
  const topicMatches = searchUnifiedKnowledge('governance', index);
  assert.ok(topicMatches.length >= 2);
  const typeMatches = searchUnifiedKnowledge('educational-explanation', index);
  assert.ok(typeMatches.length >= 2);

  // Zero results
  assert.equal(searchUnifiedKnowledge('zzz-unmatched-query-999', index).length, 0);

  // Unpublished draft never appears in search results
  assert.equal(
    searchUnifiedKnowledge('Unpublished Draft Fixture', index).length,
    0
  );
});

// ============================================================================
// 5. Localization & Translation Independence
// ============================================================================

test('localization links Arabic/English translations and handles missing translations gracefully', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();

  const visionAr = registry.getBySlug('teranoo-product-vision-reference');
  assert.ok(visionAr);
  assert.equal(visionAr.metadata.language, 'ar');

  const visionTranslations = registry.getTranslations(visionAr.metadata.id);
  assert.equal(visionTranslations.length, 1);
  assert.equal(visionTranslations[0]?.language, 'en');
  assert.equal(
    visionTranslations[0]?.slug,
    'teranoo-product-vision-reference-en'
  );

  // Missing translation fixture returns empty array without throwing
  const englishOnlyEntry = loadTestFixtures().find(
    (e) => e.ok && e.document.metadata.slug === 'english-only-untranslated'
  );
  assert.ok(englishOnlyEntry && englishOnlyEntry.ok);
  const simulatedReg = createContentRegistry([
    {
      ...englishOnlyEntry.document,
      metadata: { ...englishOnlyEntry.document.metadata, isFixture: false },
    },
  ]);
  const untranslated = simulatedReg.getBySlug('english-only-untranslated');
  assert.ok(untranslated);
  assert.equal(untranslated.metadata.language, 'en');
  assert.deepEqual(simulatedReg.getTranslations(untranslated.metadata.id), []);
});

// ============================================================================
// 6. Security — XSS Sanitization, Unsafe URLs, Path Traversal & Renderer Registry
// ============================================================================

test('Markdown renderer strips raw script tags, event handlers, javascript: and data: URLs while preserving safe links and duplicate heading IDs', () => {
  const unsafeFixture = loadTestFixtures().find(
    (e) => e.ok && e.document.metadata.slug === 'unsafe-markdown-fixture'
  );
  assert.ok(unsafeFixture && unsafeFixture.ok);

  const html = unsafeFixture.document.renderedHtml;
  assert.equal(html.includes('<script'), false);
  assert.equal(html.includes('onerror='), false);
  assert.equal(html.includes('javascript:'), false);
  assert.equal(html.includes('data:text/html'), false);
  assert.ok(html.includes('https://example.com/safe-doc'));
  assert.ok(unsafeFixture.unsafeUrlsFound.length >= 2);

  // Validator rejects documents containing unsafe URLs
  const validation = validateLoadedEntries([unsafeFixture]);
  assert.equal(validation.ok, false);
  assert.ok(validation.errors.some((e) => e.code === 'UNSAFE_URL'));

  // Duplicate & Arabic heading anchors are deterministic and unique
  const headingsResult = renderSafeMarkdown(
    '## Overview\n\n## Overview\n\n### الهوية المؤسسية\n\n### الهوية المؤسسية'
  );
  assert.equal(headingsResult.headings.length, 4);
  const ids = headingsResult.headings.map((h) => h.id);
  assert.equal(new Set(ids).size, 4);
  assert.equal(ids[0], 'kh-h-overview');
  assert.equal(ids[1], 'kh-h-overview-2');
});

test('path resolution strictly blocks traversal, absolute escape paths, and null bytes', () => {
  const safe = resolveSafeContentPath(
    CONTENT_COLLECTIONS_ROOT,
    'official/teranoo-product-vision-reference.ar.md'
  );
  assert.ok(safe.startsWith(path.resolve(CONTENT_COLLECTIONS_ROOT) + path.sep));

  assert.throws(
    () => resolveSafeContentPath(CONTENT_COLLECTIONS_ROOT, '../fixtures/unpublished-draft.md'),
    ContentPathSecurityError
  );
  assert.throws(
    () => resolveSafeContentPath(CONTENT_COLLECTIONS_ROOT, '../../package.json'),
    ContentPathSecurityError
  );
  assert.throws(
    () => resolveSafeContentPath(CONTENT_COLLECTIONS_ROOT, '/etc/passwd'),
    ContentPathSecurityError
  );
  assert.throws(
    () => resolveSafeContentPath(CONTENT_COLLECTIONS_ROOT, 'official/doc.md\0.txt'),
    ContentPathSecurityError
  );

  // Approved collection loader never returns fixtures
  const loaded = loadApprovedCollections();
  assert.ok(
    loaded.every((entry) =>
      entry.ok
        ? entry.document.metadata.collection !== 'fixtures'
        : entry.collection !== 'fixtures'
    )
  );
});

test('renderer registry resolves specialized future viewers and falls back to generic reader', () => {
  assert.equal(resolveRendererForContentType('comparative-research').key, 'research');
  assert.equal(
    resolveRendererForContentType('comparative-research').showResearchDisclaimerBanner,
    true
  );
  assert.equal(
    resolveRendererForContentType('screen-specification').key,
    'screen-specification'
  );
  assert.equal(resolveRendererForContentType('data-model').key, 'data-model');
  assert.equal(
    resolveRendererForContentType('engineering-journal-entry').key,
    'engineering-journal'
  );
  assert.equal(
    resolveRendererForContentType('test-specification').key,
    'test-record'
  );
  assert.equal(resolveRendererForContentType('product-vision').key, 'generic');
});
