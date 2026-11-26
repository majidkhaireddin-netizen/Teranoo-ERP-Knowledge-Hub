import test from 'node:test';
import assert from 'node:assert/strict';
import arMessages from '@/i18n/locales/ar.json';
import enMessages from '@/i18n/locales/en.json';
import {
  ALL_NAV_ITEMS,
  NAVIGATION_GROUPS,
  findNavGroupById,
  findNavItemByPath,
} from '@/config/navigation';
import {
  buildSearchIndex,
  deriveDashboardMetrics,
  derivePhase5Progress,
  derivePlanningSummary,
  deriveRuntimeCapabilitiesSummary,
  filterPhase5Capabilities,
  getHistoricalReferenceSnapshot,
  getPhase5Capabilities,
  getProjectSnapshot,
  getRuntimePlatformCapabilities,
  getSnapshotProvenance,
  searchKnowledgeHub,
} from '@/content/repositories/projectRepository';
import { getDirection, isValidLocale } from '@/i18n/config';

function collectKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...collectKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

test('derivePhase5Progress derives 13 approved and 0 pending out of 13 planning items in current BATCH-001 snapshot', () => {
  const progress = derivePhase5Progress();
  assert.equal(progress.totalCount, 13);
  assert.equal(progress.completedCount, 13);
  assert.equal(progress.pendingCount, 0);
  assert.equal(progress.completionPercentage, 100);
});

test('historical 2026-11-25 reference snapshot preserves 7/13 Phase 5 progress and 120 decisions without rewriting history', () => {
  const historical = getHistoricalReferenceSnapshot();
  const histProgress = derivePhase5Progress(historical.phase5Capabilities);
  const histSummary = derivePlanningSummary(historical.planningPhases);
  const histProvenance = getSnapshotProvenance(historical);

  assert.equal(historical.referenceCounts.approvedArchitecturalDecisions, 120);
  assert.equal(histProgress.completedCount, 7);
  assert.equal(histProgress.pendingCount, 6);
  assert.equal(histProgress.completionPercentage, 54);
  assert.equal(histSummary.completedPhasesCount, 4);
  assert.equal(histSummary.activePhase?.phaseNumber, 5);
  assert.equal(histSummary.activePhase?.status, 'in_progress');
  assert.equal(histProvenance.referenceReviewDate, '2026-11-25');
  assert.equal(
    histProvenance.reviewedTreeSha,
    'a922a69b54bc0cc611ae46d8e7434907cde0046a'
  );
});

test('getRuntimePlatformCapabilities returns 12 approved runtime capabilities and excludes item 13 planning gate (D-PLAT-13)', () => {
  const allPhase5 = getPhase5Capabilities();
  const runtime = getRuntimePlatformCapabilities();
  const runtimeSummary = deriveRuntimeCapabilitiesSummary(runtime);

  assert.equal(allPhase5.length, 13);
  assert.equal(runtime.length, 12);
  assert.equal(runtimeSummary.totalCount, 12);
  assert.equal(runtimeSummary.approvedCount, 12);
  assert.equal(runtimeSummary.pendingCount, 0);
  assert.ok(runtime.every((item) => item.kind === 'runtime_capability'));
  assert.ok(
    !runtime.some((item) => item.id === 'platform-foundation-adoption')
  );

  const gateItem = allPhase5.find(
    (item) => item.id === 'platform-foundation-adoption'
  );
  assert.ok(gateItem);
  assert.equal(gateItem.itemNumber, 13);
  assert.equal(gateItem.kind, 'planning_gate');
  assert.equal(gateItem.status, 'approved');
  assert.equal(gateItem.decisionId, 'D-PLAT-13');
});

test('derivePlanningSummary identifies all 5 foundational phases (Phases 1-5) as completed', () => {
  const summary = derivePlanningSummary();
  assert.equal(summary.totalPhasesCount, 5);
  assert.equal(summary.completedPhasesCount, 5);
  assert.equal(summary.activePhase, null);
});

test('deriveDashboardMetrics computes all dashboard metrics from authoritative BATCH-001 snapshot', () => {
  const metrics = deriveDashboardMetrics();
  assert.equal(metrics.approvedDecisionsCount, 126);
  assert.equal(metrics.completedPhasesCount, 5);
  assert.equal(metrics.totalPhasesCount, 5);
  assert.equal(metrics.coreModulesCount, 4);
  assert.equal(metrics.phase5.completedCount, 13);
  assert.equal(metrics.phase5.totalCount, 13);
});

test('filterPhase5Capabilities filters accurately by status and preserves all 13 D-PLAT decision IDs', () => {
  const approved = filterPhase5Capabilities('approved');
  const pending = filterPhase5Capabilities('pending');
  const all = filterPhase5Capabilities('all');

  assert.equal(approved.length, 13);
  assert.equal(pending.length, 0);
  assert.equal(all.length, 13);
  assert.deepEqual(
    approved.map((c) => c.decisionId),
    [
      'D-PLAT-01',
      'D-PLAT-02',
      'D-PLAT-03',
      'D-PLAT-04',
      'D-PLAT-05',
      'D-PLAT-06',
      'D-PLAT-07',
      'D-PLAT-08',
      'D-PLAT-09',
      'D-PLAT-10',
      'D-PLAT-11',
      'D-PLAT-12',
      'D-PLAT-13',
    ]
  );
});

test('reference snapshot preserves exact authorized BATCH-001 counts and explicit provenance metadata', () => {
  const snapshot = getProjectSnapshot();
  const provenance = getSnapshotProvenance(snapshot);

  assert.equal(snapshot.identity.productName, 'Teranoo ERP');
  assert.equal(snapshot.identity.databaseEngine, 'PostgreSQL');
  assert.equal(snapshot.referenceCounts.approvedArchitecturalDecisions, 126);
  assert.equal(snapshot.referenceCounts.futureArchitectureConsiderations, 24);
  assert.equal(snapshot.referenceCounts.architecturalResearchPackages, 13);
  assert.equal(snapshot.referenceCounts.independentReviewNotes, 57);
  assert.equal(getPhase5Capabilities().length, 13);

  assert.equal(
    provenance.sourceRepository,
    'https://github.com/Alabasi1980/TeranooErp'
  );
  assert.equal(
    provenance.reviewedCommitSha,
    '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f'
  );
  assert.equal(
    provenance.reviewedTreeSha,
    'db531de6b2ab452578a550e07c5fd80e4bfe6b64'
  );
  assert.equal(provenance.referenceReviewDate, '2026-11-26');
  assert.equal(provenance.isLiveSynced, false);
  assert.ok(
    provenance.metricsOriginNote.en.includes('BATCH-001')
  );
  assert.ok(
    provenance.metricsOriginNote.ar.includes('BATCH-001')
  );
});

test('searchKnowledgeHub matches all 13 official D-PLAT IDs without exposing fabricated codes', () => {
  const index = buildSearchIndex();
  assert.ok(index.length >= 35);

  const codedItems = index.filter((item) => Boolean(item.code));
  assert.deepEqual(
    codedItems.map((item) => item.code),
    [
      'D-PLAT-01',
      'D-PLAT-02',
      'D-PLAT-03',
      'D-PLAT-04',
      'D-PLAT-05',
      'D-PLAT-06',
      'D-PLAT-07',
      'D-PLAT-08',
      'D-PLAT-09',
      'D-PLAT-10',
      'D-PLAT-11',
      'D-PLAT-12',
      'D-PLAT-13',
    ]
  );

  const byDecisionId = searchKnowledgeHub('D-PLAT-08', index);
  assert.equal(byDecisionId.length, 1);
  assert.equal(byDecisionId[0]?.code, 'D-PLAT-08');
  assert.equal(byDecisionId[0]?.href, '/platform');

  const byArabic = searchKnowledgeHub('رؤية المنتج', index);
  assert.ok(byArabic.some((item) => item.href === '/product-vision'));

  const byEnglish = searchKnowledgeHub('PostgreSQL', index);
  assert.ok(byEnglish.some((item) => item.href === '/deployment'));

  const emptyMatches = searchKnowledgeHub('nonexistent-xyz-token', index);
  assert.equal(emptyMatches.length, 0);
});

test('navigation tree defines all 5 groups and 20 unique valid routes including Knowledge Library and Engineering Journal', () => {
  assert.equal(NAVIGATION_GROUPS.length, 5);
  assert.equal(ALL_NAV_ITEMS.length, 20);

  const hrefs = new Set(ALL_NAV_ITEMS.map((item) => item.href));
  assert.equal(hrefs.size, 20);
  assert.ok(hrefs.has('/knowledge'));
  assert.ok(hrefs.has('/engineering-journal'));

  for (const item of ALL_NAV_ITEMS) {
    assert.equal(findNavItemByPath(item.href)?.id, item.id);
    assert.ok(findNavGroupById(item.groupId));
  }
});

test('i18n locale validation, RTL/LTR direction helpers, and ar/en key parity are strict', () => {
  assert.equal(isValidLocale('ar'), true);
  assert.equal(isValidLocale('en'), true);
  assert.equal(isValidLocale('fr'), false);
  assert.equal(getDirection('ar'), 'rtl');
  assert.equal(getDirection('en'), 'ltr');

  const arKeys = collectKeys(arMessages as Record<string, unknown>);
  const enKeys = collectKeys(enMessages as Record<string, unknown>);
  assert.deepEqual(arKeys, enKeys);
});
