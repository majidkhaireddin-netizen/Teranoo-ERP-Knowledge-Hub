import test from 'node:test';
import assert from 'node:assert/strict';
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
  filterPhase5Capabilities,
  getPhase5Capabilities,
  getProjectSnapshot,
  searchKnowledgeHub,
} from '@/content/repositories/projectRepository';
import { getDirection, isValidLocale } from '@/i18n/config';

test('derivePhase5Progress derives 7 approved and 6 pending out of 13 capabilities', () => {
  const progress = derivePhase5Progress();
  assert.equal(progress.totalCount, 13);
  assert.equal(progress.completedCount, 7);
  assert.equal(progress.pendingCount, 6);
  assert.equal(progress.completionPercentage, 54);
});

test('derivePlanningSummary identifies 4 completed phases and Phase 5 in progress', () => {
  const summary = derivePlanningSummary();
  assert.equal(summary.totalPhasesCount, 5);
  assert.equal(summary.completedPhasesCount, 4);
  assert.equal(summary.activePhase?.phaseNumber, 5);
  assert.equal(summary.activePhase?.status, 'in_progress');
});

test('deriveDashboardMetrics computes all dashboard metrics from authoritative snapshot', () => {
  const metrics = deriveDashboardMetrics();
  assert.equal(metrics.approvedDecisionsCount, 120);
  assert.equal(metrics.completedPhasesCount, 4);
  assert.equal(metrics.totalPhasesCount, 5);
  assert.equal(metrics.coreModulesCount, 4);
  assert.equal(metrics.phase5.completedCount, 7);
  assert.equal(metrics.phase5.totalCount, 13);
});

test('filterPhase5Capabilities filters accurately by status and preserves decision IDs', () => {
  const approved = filterPhase5Capabilities('approved');
  const pending = filterPhase5Capabilities('pending');
  const all = filterPhase5Capabilities('all');

  assert.equal(approved.length, 7);
  assert.equal(pending.length, 6);
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
    ]
  );
  assert.ok(pending.every((c) => c.decisionId === null));
});

test('reference snapshot preserves exact authorized counts without fabrication', () => {
  const snapshot = getProjectSnapshot();
  assert.equal(snapshot.identity.productName, 'Teranoo ERP');
  assert.equal(snapshot.identity.databaseEngine, 'PostgreSQL');
  assert.equal(snapshot.referenceCounts.approvedArchitecturalDecisions, 120);
  assert.equal(snapshot.referenceCounts.futureArchitectureConsiderations, 24);
  assert.equal(snapshot.referenceCounts.architecturalResearchPackages, 13);
  assert.equal(snapshot.referenceCounts.independentReviewNotes, 57);
  assert.equal(getPhase5Capabilities().length, 13);
});

test('searchKnowledgeHub matches decision IDs, Arabic titles, and English terms', () => {
  const index = buildSearchIndex();
  assert.ok(index.length >= 35);

  const byDecisionId = searchKnowledgeHub('D-PLAT-03', index);
  assert.equal(byDecisionId.length, 1);
  assert.equal(byDecisionId[0]?.code, 'D-PLAT-03');
  assert.equal(byDecisionId[0]?.href, '/platform');

  const byArabic = searchKnowledgeHub('رؤية المنتج', index);
  assert.ok(byArabic.some((item) => item.href === '/product-vision'));

  const byEnglish = searchKnowledgeHub('PostgreSQL', index);
  assert.ok(byEnglish.some((item) => item.href === '/deployment'));

  const emptyMatches = searchKnowledgeHub('nonexistent-xyz-token', index);
  assert.equal(emptyMatches.length, 0);
});

test('navigation tree defines all 5 groups and 18 unique valid routes', () => {
  assert.equal(NAVIGATION_GROUPS.length, 5);
  assert.equal(ALL_NAV_ITEMS.length, 18);

  const hrefs = new Set(ALL_NAV_ITEMS.map((item) => item.href));
  assert.equal(hrefs.size, 18);

  for (const item of ALL_NAV_ITEMS) {
    assert.equal(findNavItemByPath(item.href)?.id, item.id);
    assert.ok(findNavGroupById(item.groupId));
  }
});

test('i18n locale validation and RTL/LTR direction helpers behave strictly', () => {
  assert.equal(isValidLocale('ar'), true);
  assert.equal(isValidLocale('en'), true);
  assert.equal(isValidLocale('fr'), false);
  assert.equal(getDirection('ar'), 'rtl');
  assert.equal(getDirection('en'), 'ltr');
});
