import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  BATCH_002_SOURCE_REVISION,
  CORE_MODULE_ARCHITECTURE_SOURCE_MANIFEST,
  OFFICIAL_SOURCE_MANIFEST,
  deriveSourceManifestSummary,
  validateSourceManifest,
} from '@/content/manifest/sourceManifest';
import {
  extractCanonicalStoredBody,
  verifyStoredOfficialDocumentIntegrity,
} from '@/content/ingestion/ingestionPipeline';
import {
  getContentRegistry,
  resetContentRegistryCache,
} from '@/content/registry/contentRegistry';
import {
  validateApprovedCollections,
  validateLoadedEntries,
} from '@/content/validators/contentValidator';
import { parseMarkdownDocument } from '@/content/loaders/contentLoader';
import {
  getExtractedDecisionRegister,
  resetExtractedDecisionRegisterCache,
} from '@/content/extractors/decisionRegisterExtractor';
import {
  CURATED_ROADMAP_PINNED_SOURCE,
  getExtractedRoadmap,
  parseRoadmapMarkdown,
  resetExtractedRoadmapCache,
} from '@/content/extractors/roadmapExtractor';
import {
  CURATED_MODULE_PROJECTION_FIELDS,
  CURATED_MODULE_PROJECTION_PINS,
  buildCoreModuleProfileFromSource,
  getCoreModuleProfileById,
  getExtractedCoreModulesCatalog,
  resetExtractedCoreModulesCache,
  type CoreModuleId,
} from '@/content/extractors/moduleModelsExtractor';
import { renderSafeMarkdown } from '@/content/loaders/markdownPipeline';
import {
  getExtractedDependencyArchitecture,
  resetExtractedDependencyArchitectureCache,
} from '@/content/extractors/dependencyArchitectureExtractor';
import {
  DEFAULT_EDUCATIONAL_CONTROLS,
  DEFAULT_PLATFORM_PREREQUISITES,
  SIMULATOR_PINNED_SOURCE,
  simulateModuleActivation,
  validateSimulatorCatalogConsistency,
  type DependencySimulationCatalog,
} from '@/content/simulators/moduleActivationSimulator';
import {
  buildUnifiedSearchIndex,
  searchUnifiedKnowledge,
} from '@/content/search/knowledgeSearch';
import { getExtractedFacRegister } from '@/content/extractors/facRegisterExtractor';
import { getExtractedGuardrails } from '@/content/extractors/guardrailsExtractor';
import { PROJECT_REFERENCE_SNAPSHOT } from '@/content/seed/projectSnapshot';

// ============================================================================
// 1. BATCH-002 Manifest, Verbatim Ingestion & Git Blob SHA Verification (16/16)
// ============================================================================

test('all 10 BATCH-002 official files and combined 16/16 OFFICIAL_SOURCE_MANIFEST verify unconditionally via stored canonical bodies without /files/', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();
  const publishedIds = new Set(
    registry.getAllPublicMetadata().map((m) => m.id)
  );

  // KH-029: Redundant tracked /files/ raw source directory must not exist
  assert.equal(
    fs.existsSync(path.join(process.cwd(), 'files')),
    false,
    'Redundant raw source attachment directory /files/ must be removed (KH-029)'
  );

  assert.equal(CORE_MODULE_ARCHITECTURE_SOURCE_MANIFEST.length, 10);
  assert.equal(OFFICIAL_SOURCE_MANIFEST.length, 16);

  const summary = deriveSourceManifestSummary(OFFICIAL_SOURCE_MANIFEST);
  assert.equal(summary.totalSources, 16);
  assert.equal(summary.publishedCount, 16);
  assert.equal(summary.awaitingSourceCount, 0);

  const manifestValidation = validateSourceManifest(
    OFFICIAL_SOURCE_MANIFEST,
    publishedIds
  );
  assert.equal(manifestValidation.ok, true);
  assert.equal(manifestValidation.errors.length, 0);

  const validationReport = validateApprovedCollections();
  assert.equal(validationReport.ok, true);
  assert.equal(validationReport.errors.length, 0);
  assert.equal(validationReport.publishedRecordsCount, 20);

  for (const entry of OFFICIAL_SOURCE_MANIFEST) {
    assert.equal(entry.importStatus, 'published');
    assert.equal(entry.publicationAuthorizationStatus, 'authorized');
    assert.equal(entry.completeness, 'complete');
    assert.equal(entry.sourceRevision, BATCH_002_SOURCE_REVISION.commitSha);
    assert.ok(entry.expectedGitBlobSha && entry.expectedGitBlobSha.length === 40);
    assert.equal(entry.actualGitBlobSha, entry.expectedGitBlobSha);
    assert.ok(entry.rawSourceSha256 && entry.rawSourceSha256.length === 64);
    assert.ok(entry.sourceFileHash && entry.sourceFileHash.length === 64);
    assert.ok(entry.publishedContentId);

    const doc = registry.getById(entry.publishedContentId);
    assert.ok(doc, `Expected published document ${entry.publishedContentId}`);
    assert.equal(doc.metadata.source.kind, 'official-source');
    if (doc.metadata.source.kind === 'official-source') {
      assert.equal(doc.metadata.source.gitBlobSha, entry.actualGitBlobSha);
      assert.equal(doc.metadata.source.commitSha, entry.sourceRevision);
      assert.equal(
        doc.metadata.source.treeSha,
        BATCH_002_SOURCE_REVISION.treeSha
      );
      assert.equal(doc.metadata.source.storedBodySha256, entry.sourceFileHash);
    }

    // KH-030: Unconditional stored canonical body SHA-256 & reproducible Git blob SHA-1 check
    const integrity = verifyStoredOfficialDocumentIntegrity(doc, entry);
    assert.equal(
      integrity.ok,
      true,
      `Stored-body integrity failed for ${entry.sourcePath}: ${integrity.issues.map((i) => i.message).join('; ')}`
    );
    assert.equal(integrity.actualStoredBodySha256, entry.sourceFileHash);
    assert.equal(integrity.actualStoredGitBlobSha1, entry.expectedGitBlobSha);
  }
});

// ============================================================================
// 2. Corrective Notes KH-024 & KH-025 Verification
// ============================================================================

test('KH-024: Decision Register centralized counter remains strictly 126 (103/10/13), separate from 34 Phase 2 decisions and D-MKT-01, with 6/6 governing artifacts published', () => {
  resetExtractedDecisionRegisterCache();
  resetExtractedCoreModulesCache();

  const register = getExtractedDecisionRegister();
  const modulesCatalog = getExtractedCoreModulesCatalog();

  assert.equal(register.declaredArchitecturalCount, 126);
  assert.equal(register.architecturalDecisions.length, 126);
  assert.equal(register.byPhaseCounts['phase-3'], 103);
  assert.equal(register.byPhaseCounts['phase-4'], 10);
  assert.equal(register.byPhaseCounts['phase-5'], 13);
  assert.equal(register.marketDecision.decisionId, 'D-MKT-01');
  assert.equal(register.marketDecision.outsideArchitecturalCounter, true);

  // All 6 governing artifacts resolve locally now (2 BATCH-001 + 4 BATCH-002)
  assert.equal(register.governingArtifacts.length, 6);
  assert.equal(
    register.governingArtifacts.filter((g) => g.importedSlug !== null).length,
    6
  );

  // None of the 34 Phase 2 decisions are ever injected into the 126 counter
  const centralizedIds = new Set(
    register.architecturalDecisions.map((d) => d.decisionId)
  );
  assert.equal(modulesCatalog.totalPhase2DecisionsCount, 34);
  for (const p2 of modulesCatalog.allPhase2Decisions) {
    assert.equal(centralizedIds.has(p2.decisionId), false);
    assert.equal(p2.scopeKind, 'phase-2-source-local');
  }
});

test('KH-025: Curated Roadmap projection pins revision + SHA-256, verifies current on actual source, flags drift on mutation, and links Phase 2 evidence', () => {
  resetExtractedRoadmapCache();
  const roadmap = getExtractedRoadmap();

  assert.equal(roadmap.projectionMetadata.kind, 'curated-projection');
  assert.equal(
    roadmap.projectionMetadata.mappingFreshnessStatus,
    'verified-current'
  );
  assert.equal(
    roadmap.projectionMetadata.mappedSourceRevision,
    CURATED_ROADMAP_PINNED_SOURCE.mappedSourceRevision
  );
  assert.equal(
    roadmap.projectionMetadata.actualSourceBodySha256,
    CURATED_ROADMAP_PINNED_SOURCE.mappedSourceBodySha256
  );
  assert.equal(roadmap.projectionMetadata.reviewWarning, null);

  // Phase 2 links to published BATCH-002 evidence
  const phase2 = roadmap.phases.find((p) => p.id === 'phase-2');
  assert.ok(phase2);
  assert.equal(phase2.completedDate, '2026-09-09');
  assert.equal(phase2.decisionCount, 34);
  assert.ok(phase2.relatedEvidenceLinks && phase2.relatedEvidenceLinks.length >= 6);
  assert.ok(
    phase2.relatedEvidenceLinks.some((l) => l.href === '/modules') &&
      phase2.relatedEvidenceLinks.some((l) => l.href === '/dependencies')
  );

  // Drift detection: mutating body flips freshness to review-required-source-changed
  const registry = getContentRegistry();
  const workPlan = registry.getBySlug('project-work-plan');
  assert.ok(workPlan);

  const mutatedBodyResult = parseRoadmapMarkdown(
    workPlan.bodyMarkdown + '\n\n## Phase 6 Started (Simulated Drift)\n'
  );
  assert.equal(
    mutatedBodyResult.projectionMetadata.mappingFreshnessStatus,
    'review-required-source-changed'
  );
  assert.ok(mutatedBodyResult.projectionMetadata.reviewWarning !== null);

  // Drift detection: changing sourceRevision also flips freshness
  const mutatedRevResult = parseRoadmapMarkdown(workPlan.bodyMarkdown, {
    sourceRevision: '0000000000000000000000000000000000000000',
  });
  assert.equal(
    mutatedRevResult.projectionMetadata.mappingFreshnessStatus,
    'review-required-source-changed'
  );
  assert.ok(mutatedRevResult.projectionMetadata.reviewWarning !== null);
});

// ============================================================================
// 3. Core Business Modules Extractor (4 Modules · 34 Decisions · 17-Section Blueprint)
// ============================================================================

test('moduleModelsExtractor extracts all 4 Core Modules, 34 Phase 2 decisions (6/8/9/11), 17-section lifecycle blueprint, and Procurement educational comparison table', () => {
  resetExtractedCoreModulesCache();
  const catalog = getExtractedCoreModulesCatalog();

  assert.equal(catalog.modules.length, 4);
  assert.equal(catalog.totalPhase2DecisionsCount, 34);
  assert.equal(catalog.phase2DecisionCountByModule.finance, 6);
  assert.equal(catalog.phase2DecisionCountByModule['inventory-warehouse'], 8);
  assert.equal(catalog.phase2DecisionCountByModule.procurement, 9);
  assert.equal(catalog.phase2DecisionCountByModule['sales-order-management'], 11);

  for (const mod of catalog.modules) {
    assert.equal(mod.hbmdCount, 0);
    assert.ok(mod.requiredPcds.length > 0, `${mod.id} should have required PCDs`);
    assert.ok(
      mod.explicitExclusions.length > 0,
      `${mod.id} should extract explicit exclusions`
    );
    assert.ok(
      mod.deferredDesignItems.length > 0,
      `${mod.id} should extract deferred design items`
    );
    assert.equal(
      mod.lifecycleBlueprint.length,
      17,
      `${mod.id} should expose the 17-section lifecycle blueprint`
    );
    assert.equal(
      mod.lifecycleBlueprint.filter((s) => s.status === 'populated-phase-2')
        .length,
      9
    );
    assert.equal(
      mod.lifecycleBlueprint.filter((s) => s.status === 'future-phase').length,
      8
    );

    for (const dec of mod.decisions) {
      assert.match(dec.decisionId, /^D-(FIN|INV|PROC|SALES)-\d{2}$/);
      assert.ok(dec.title.length > 0);
      assert.ok(dec.verbatimBody.length > 0);
      assert.ok(dec.sectionAnchor.startsWith('kh-h-'));
      assert.equal(dec.owningModuleId, mod.id);
    }
  }

  // Procurement educational 6-concept comparison table
  const procurement = getCoreModuleProfileById('procurement');
  assert.ok(procurement);
  assert.ok(procurement.educationalComparisonRows);
  assert.equal(procurement.educationalComparisonRows.length, 6);
});

// ============================================================================
// 4. Dependency Architecture Extractor (Model, Matrix, Lifecycle, Extensions, Reviews)
// ============================================================================

test('dependencyArchitectureExtractor extracts exact Phase 2 dependency model, 0-HBMD matrix, 6 CICs (16 fields), 5 FLDs, 21 PCDs, 15 Ownership, Lifecycle, Extensions, and Reviews', () => {
  resetExtractedDependencyArchitectureCache();
  const arch = getExtractedDependencyArchitecture();

  // Dependency Model
  assert.equal(arch.dependencyModel.officialTypes.length, 4);
  assert.deepEqual(
    arch.dependencyModel.officialTypes.map((t) => t.code),
    ['PCD', 'HBMD', 'CIC', 'FLD']
  );
  assert.equal(arch.dependencyModel.disallowedLabels.length, 4);
  assert.equal(arch.dependencyModel.governanceRules.length, 12);

  // Matrix
  assert.equal(arch.matrix.summaryRows.length, 4);
  assert.equal(arch.matrix.hbmdEdgeCount, 0);
  assert.equal(arch.matrix.hbmdCycleCount, 0);
  assert.equal(arch.matrix.hbmdAbsenceRegister.length, 12);
  assert.equal(arch.matrix.coreCics.length, 6);
  for (const cic of arch.matrix.coreCics) {
    assert.match(cic.contractId, /^CIC-CORE-[A-Z-]+-001$/);
    assert.ok(cic.sectionAnchor.startsWith('kh-h-'));
    // Verify all 15 metadata fields (+ contractId = 16 fields) are populated
    for (const [field, value] of Object.entries(cic.metadata)) {
      assert.ok(
        value.trim().length > 0,
        `${cic.contractId} missing metadata field ${field}`
      );
    }
  }
  assert.equal(arch.matrix.coreFlds.length, 5);
  assert.equal(arch.matrix.pcdMatrix.length, 21);
  assert.equal(arch.matrix.dataOwnershipRecords.length, 15);
  assert.equal(arch.matrix.deferredOwnershipCount, 4);
  assert.equal(arch.matrix.consistencyChecks.length, 10);

  // Lifecycle
  assert.equal(arch.lifecycle.functionalStates.length, 3);
  assert.deepEqual(
    arch.lifecycle.functionalStates.map((s) => s.state),
    ['Inactive', 'Active', 'Frozen']
  );
  assert.ok(arch.lifecycle.activationPreconditions.length >= 4);
  assert.ok(arch.lifecycle.deactivationPreconditions.length >= 4);
  assert.equal(arch.lifecycle.consistencyRows.length, 4);

  // Future Extensions
  assert.equal(arch.futureExtensions.compatibilityReviewChecklist.length, 8);
  assert.equal(arch.futureExtensions.newModuleRequirements.length, 10);
  assert.ok(arch.futureExtensions.illustrativeDirectionalExamples.length >= 4);

  // Phase 2 Reviews
  assert.equal(arch.phase2Reviews.assumptionSafety.guardrails.length, 7);
  assert.equal(arch.phase2Reviews.assumptionSafety.phase3Handoffs.length, 12);
  assert.equal(arch.phase2Reviews.closureReview.exitCriteria.length, 13);
  assert.equal(arch.phase2Reviews.closureReview.closureDate, '2026-09-09');
});

// ============================================================================
// 5. Module Activation Simulator — Semantic Integrity (TASK-005-FIX-01 / FIX-01-R06)
// ============================================================================

test('FIX-01-R06 (1, 2, 9): all 16 (2^4) Core Module combinations preserve 0 HBMD, standalone base activation, Required PCD gating, and explicit scope boundaries', () => {
  resetExtractedDependencyArchitectureCache();
  const catalog = getExtractedDependencyArchitecture().matrix;
  const modules: readonly CoreModuleId[] = [
    'finance',
    'inventory-warehouse',
    'procurement',
    'sales-order-management',
  ];

  // 1. Exhaustively test all 2^4 = 16 combinations against authoritative catalog
  for (let mask = 0; mask < 16; mask++) {
    const selectedModules: Record<CoreModuleId, boolean> = {
      finance: Boolean(mask & 1),
      'inventory-warehouse': Boolean(mask & 2),
      procurement: Boolean(mask & 4),
      'sales-order-management': Boolean(mask & 8),
    };

    const res = simulateModuleActivation({
      catalog,
      selectedModules,
      platform: DEFAULT_PLATFORM_PREREQUISITES,
    });

    const expectedSelectedCount = modules.filter(
      (id) => selectedModules[id]
    ).length;

    // 9. Zero HBMD invariant across all 16 combinations
    assert.equal(res.hbmdEdgeCount, 0);
    assert.equal(res.selectedCount, expectedSelectedCount);
    assert.equal(res.activatableModulesCount, expectedSelectedCount);
    assert.equal(res.cicOutcomes.length, 6);
    assert.equal(res.fldOutcomes.length, 5);
    assert.ok(res.disclaimer.ar.length > 0 && res.disclaimer.en.length > 0);
    assert.ok(res.activationScopeBoundary.evaluatedConditions.length >= 3);
    assert.ok(res.activationScopeBoundary.outOfScopeConditions.length >= 4);

    for (const outcome of res.moduleOutcomes) {
      assert.deepEqual(outcome.hbmdBlockers, []);
      if (outcome.selected) {
        assert.equal(outcome.canActivateBaseWithinEvaluatedScope, true);
        assert.equal(outcome.status, 'base-activatable-within-evaluated-scope');
      }
    }

    // Active modules alone with default conservative controls NEVER produce
    // evaluated-conceptual-prerequisites-satisfied or claim full runtime readiness
    assert.equal(res.cicSummary.evaluatedConceptualPrereqsSatisfied, 0);
    assert.equal(
      res.fldSummary.evaluatedPrereqsSatisfiedFunctionalUnspecified,
      0
    );

    if (expectedSelectedCount === 1) {
      assert.equal(res.activatableModulesCount, 1);
      assert.equal(res.cicSummary.architecturalModulePrereqsSatisfied, 0);
      assert.equal(
        res.fldOutcomes.filter((f) => f.requiredModulesAvailable).length,
        0
      );
    }

    if (expectedSelectedCount === 4) {
      // All 4 active => all 6 CICs satisfy participating-module prerequisites,
      // but remain readiness-not-established under conservative defaults (never bare "Ready")
      assert.equal(res.cicSummary.architecturalModulePrereqsSatisfied, 6);
      assert.equal(res.cicSummary.readinessNotEstablished, 6);
      assert.equal(res.cicSummary.evaluatedConceptualPrereqsSatisfied, 0);
      assert.equal(
        res.fldOutcomes.filter((f) => f.requiredModulesAvailable).length,
        5
      );
      assert.equal(res.fldSummary.readinessNotEstablished, 5);
    }
  }

  // 2. Missing Required PCDs: mandatoryPlatformCore blocks all 4 while HBMD stays 0
  const noPlatformCore = simulateModuleActivation({
    catalog,
    selectedModules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: {
      ...DEFAULT_PLATFORM_PREREQUISITES,
      mandatoryPlatformCore: false,
    },
  });
  assert.equal(noPlatformCore.hbmdEdgeCount, 0);
  assert.equal(noPlatformCore.activatableModulesCount, 0);
  assert.equal(noPlatformCore.cicSummary.participatingModulesUnavailable, 6);
  assert.equal(noPlatformCore.fldSummary.sourceInactive, 5);

  // Missing fiscalCalendar blocks Finance only; other 3 remain base-activatable
  const noFiscal = simulateModuleActivation({
    catalog,
    selectedModules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: {
      ...DEFAULT_PLATFORM_PREREQUISITES,
      fiscalCalendar: false,
    },
  });
  assert.equal(noFiscal.hbmdEdgeCount, 0);
  assert.equal(noFiscal.activatableModulesCount, 3);
  const finOutcome = noFiscal.moduleOutcomes.find(
    (o) => o.moduleId === 'finance'
  );
  assert.equal(finOutcome?.status, 'blocked-by-required-pcd');
  assert.ok(
    finOutcome?.missingRequiredPcds.includes(
      'Fiscal Calendar / Accounting Period'
    )
  );
  assert.equal(
    noFiscal.moduleOutcomes.find((o) => o.moduleId === 'inventory-warehouse')
      ?.status,
    'base-activatable-within-evaluated-scope'
  );
});

test('FIX-01-R06 (3, 4, 5, 6, 9): CIC readiness distinguishes contract disabled, scenario disabled, contract-specific preconditions unmet, unknown/deferred, and conceptual scope without introducing implicit HBMDs', () => {
  resetExtractedDependencyArchitectureCache();
  const catalog = getExtractedDependencyArchitecture().matrix;
  const allFour: Record<CoreModuleId, boolean> = {
    finance: true,
    'inventory-warehouse': true,
    procurement: true,
    'sales-order-management': true,
  };

  // 3. Both CIC modules active, contract disabled
  const contractDisabled = simulateModuleActivation({
    catalog,
    selectedModules: allFour,
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'unsatisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: false,
    },
  });
  assert.equal(contractDisabled.activatableModulesCount, 4);
  assert.equal(contractDisabled.hbmdEdgeCount, 0);
  assert.equal(contractDisabled.cicSummary.architecturalModulePrereqsSatisfied, 6);
  assert.equal(contractDisabled.cicSummary.contractOrScenarioNotEnabled, 6);
  assert.equal(contractDisabled.cicSummary.evaluatedConceptualPrereqsSatisfied, 0);
  for (const cic of contractDisabled.cicOutcomes) {
    assert.equal(
      cic.modulePrerequisiteStatus,
      'architectural-module-prerequisites-satisfied'
    );
    assert.equal(cic.readinessStatus, 'contract-or-scenario-not-enabled');
    assert.equal(cic.contractEnabledState, 'unsatisfied');
    assert.equal(cic.fullRuntimeReadinessEstablished, false);
  }
  // FLDs linked to blocked CICs report dependency-prerequisites-not-satisfied (never blocking base modules!)
  assert.equal(contractDisabled.fldSummary.dependencyPrereqsNotSatisfied, 5);

  // 4. Both modules active, contract enabled, required scenario disabled
  const scenarioDisabled = simulateModuleActivation({
    catalog,
    selectedModules: allFour,
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'unsatisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: false,
    },
  });
  assert.equal(scenarioDisabled.activatableModulesCount, 4);
  assert.equal(scenarioDisabled.cicSummary.contractOrScenarioNotEnabled, 6);
  for (const cic of scenarioDisabled.cicOutcomes) {
    assert.equal(cic.readinessStatus, 'contract-or-scenario-not-enabled');
    assert.equal(cic.contractEnabledState, 'satisfied');
    assert.equal(cic.scenarioEnabledState, 'unsatisfied');
    assert.ok(
      cic.reason.en.includes(cic.sourceRef.activationConditionVerbatim),
      `${cic.contractId} scenario-disabled explanation must cite official activationCondition`
    );
  }

  // 5. Contract-specific prerequisites not satisfied
  const prereqUnmet = simulateModuleActivation({
    catalog,
    selectedModules: allFour,
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'unsatisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: false,
    },
  });
  assert.equal(prereqUnmet.activatableModulesCount, 4);
  assert.equal(prereqUnmet.hbmdEdgeCount, 0);
  assert.equal(prereqUnmet.cicSummary.contractPrereqsNotSatisfied, 6);
  for (const cic of prereqUnmet.cicOutcomes) {
    assert.equal(cic.readinessStatus, 'contract-prerequisites-not-satisfied');
    assert.equal(cic.specificPreconditionsState, 'unsatisfied');
  }

  // 6a. Unknown inputs keep readiness in readiness-not-established-insufficient-info
  const unknownControls = simulateModuleActivation({
    catalog,
    selectedModules: allFour,
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: DEFAULT_EDUCATIONAL_CONTROLS,
  });
  assert.equal(unknownControls.cicSummary.readinessNotEstablished, 6);
  assert.equal(unknownControls.cicSummary.evaluatedConceptualPrereqsSatisfied, 0);

  // 6b. Satisfied inputs with treatDeferredBoundariesAsUnresolved=true STILL report
  // readiness-not-established-insufficient-info because all 6 CICs have TBD Contract Owner (Phase 5)
  const deferredUnresolved = simulateModuleActivation({
    catalog,
    selectedModules: allFour,
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: true,
    },
  });
  assert.equal(deferredUnresolved.cicSummary.readinessNotEstablished, 6);
  assert.equal(
    deferredUnresolved.cicSummary.evaluatedConceptualPrereqsSatisfied,
    0
  );
  for (const cic of deferredUnresolved.cicOutcomes) {
    assert.equal(cic.hasUnresolvedOrDeferredConditions, true);
    assert.ok(cic.unresolvedDeferredReasons.length >= 1);
  }

  // 6c. Per-CIC override tests mixed states in a single run (e.g. Sales+Inventory+Procurement+Finance)
  const mixedOverrides = simulateModuleActivation({
    catalog,
    selectedModules: allFour,
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: false,
      cicOverrides: {
        'CIC-CORE-PROC-INV-001': { specificPreconditions: 'unsatisfied' },
        'CIC-CORE-SALES-FIN-001': { scenarioEnabled: 'unsatisfied' },
        'CIC-CORE-INV-FIN-001': { contractEnabled: 'unknown' },
      },
    },
  });
  assert.equal(
    mixedOverrides.cicOutcomes.find(
      (c) => c.contractId === 'CIC-CORE-PROC-INV-001'
    )?.readinessStatus,
    'contract-prerequisites-not-satisfied'
  );
  assert.equal(
    mixedOverrides.cicOutcomes.find(
      (c) => c.contractId === 'CIC-CORE-SALES-FIN-001'
    )?.readinessStatus,
    'contract-or-scenario-not-enabled'
  );
  assert.equal(
    mixedOverrides.cicOutcomes.find(
      (c) => c.contractId === 'CIC-CORE-INV-FIN-001'
    )?.readinessStatus,
    'readiness-not-established-insufficient-info'
  );
  assert.equal(
    mixedOverrides.cicOutcomes.find(
      (c) => c.contractId === 'CIC-CORE-SALES-INV-001'
    )?.readinessStatus,
    'evaluated-conceptual-prerequisites-satisfied'
  );
});

test('FIX-01-R06 (7, 10): FLD evaluation separates all 4 dimensions, never claims full functional implementation, preserves deferred ownership, and emits non-misleading labels & source refs', () => {
  resetExtractedDependencyArchitectureCache();
  const catalog = getExtractedDependencyArchitecture().matrix;

  // Scenario A: All modules active, conceptual scope satisfied (deferred acknowledged)
  const conceptualSatisfied = simulateModuleActivation({
    catalog,
    selectedModules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'satisfied',
      treatDeferredBoundariesAsUnresolved: false,
    },
  });

  assert.equal(
    conceptualSatisfied.fldSummary.evaluatedPrereqsSatisfiedFunctionalUnspecified,
    5
  );
  for (const fld of conceptualSatisfied.fldOutcomes) {
    assert.equal(fld.requiredModulesAvailable, true);
    assert.equal(fld.featureDependencyPrerequisitesSatisfied, true);
    assert.equal(fld.featureConfiguredState, 'satisfied');
    // Crucial: full functional behavior is ALWAYS false in Phase 2
    assert.equal(fld.fullFunctionalBehaviorSpecified, false);
    assert.equal(
      fld.status,
      'evaluated-prerequisites-satisfied-functional-unspecified'
    );
    // 10. Labels must NEVER be unqualified "Available" / "متاحة"
    assert.notEqual(fld.statusLabel.en.trim().toLowerCase(), 'available');
    assert.notEqual(fld.statusLabel.ar.trim(), 'متاحة');
    assert.ok(fld.sourceRef.evidence.length > 0);
    assert.equal(fld.sourceRef.documentSlug, 'module-dependency-matrix');
    assert.equal(fld.sourceRef.lifecycleRuleRef, 'MODULE_LIFECYCLE_RULES.md §5');
  }

  // Three-Way Match must preserve Feature Owner: Deferred
  const threeWay = conceptualSatisfied.fldOutcomes.find(
    (f) => f.id === 'FLD-CORE-05'
  );
  assert.ok(threeWay);
  assert.equal(threeWay.isOwnerDeferred, true);
  assert.match(threeWay.sourceRef.featureOwner, /Deferred/i);

  // Customer Billing must preserve deferred invoice generation boundary
  const customerBilling = conceptualSatisfied.fldOutcomes.find(
    (f) => f.id === 'FLD-CORE-02'
  );
  assert.ok(customerBilling);
  assert.equal(customerBilling.hasDeferredBoundary, true);
  assert.ok(customerBilling.deferredNote);

  // Scenario B: Sales active + Inventory active, but FLD feature explicitly disabled
  const fldDisabled = simulateModuleActivation({
    catalog,
    selectedModules: {
      finance: false,
      'inventory-warehouse': true,
      procurement: false,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
    controls: {
      defaultCicContractEnabled: 'satisfied',
      defaultCicScenarioEnabled: 'satisfied',
      defaultCicSpecificPreconditions: 'satisfied',
      defaultFldConfigured: 'unsatisfied',
      treatDeferredBoundariesAsUnresolved: false,
    },
  });
  const stockSale = fldDisabled.fldOutcomes.find((f) => f.id === 'FLD-CORE-01');
  assert.ok(stockSale);
  assert.equal(stockSale.requiredModulesAvailable, true);
  assert.equal(stockSale.featureDependencyPrerequisitesSatisfied, true);
  assert.equal(stockSale.featureConfiguredState, 'unsatisfied');
  assert.equal(stockSale.status, 'feature-not-configured-or-disabled');
  assert.equal(stockSale.fullFunctionalBehaviorSpecified, false);

  // 10. CIC labels & source traceability checks
  for (const cic of conceptualSatisfied.cicOutcomes) {
    assert.notEqual(cic.statusLabel.en.trim().toLowerCase(), 'ready');
    assert.notEqual(
      cic.statusLabel.en.trim().toLowerCase(),
      'conceptually ready'
    );
    assert.notEqual(cic.statusLabel.ar.trim(), 'جاهز');
    assert.notEqual(cic.statusLabel.ar.trim(), 'جاهز مفاهيميًا');
    assert.equal(cic.fullRuntimeReadinessEstablished, false);
    assert.ok(cic.sourceRef.sectionAnchor.startsWith('kh-h-'));
    assert.ok(cic.sourceRef.evidence.length > 0);
    assert.ok(cic.sourceRef.requiredPreconditionsVerbatim.length > 0);
    assert.ok(cic.sourceRef.activationConditionVerbatim.length > 0);
    assert.equal(cic.sourceRef.lifecycleRuleRef, 'MODULE_LIFECYCLE_RULES.md §6');
  }
});

test('FIX-01-R06 (8): validateSimulatorCatalogConsistency aligns 1:1 with authoritative extracted CIC, FLD, and PCD catalogs and fails loud on catalog drift', () => {
  resetExtractedDependencyArchitectureCache();
  const catalog = getExtractedDependencyArchitecture().matrix;

  // Authoritative catalog validates cleanly
  const summary = validateSimulatorCatalogConsistency(catalog);
  assert.equal(summary.valid, true);
  assert.equal(summary.cicCount, 6);
  assert.equal(summary.fldCount, 5);
  assert.equal(summary.pcdRowCount, 21);
  assert.equal(summary.hbmdEdgeCount, 0);

  // Drift 1: Missing CIC contract must throw
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        coreCics: catalog.coreCics.slice(0, 5),
      }),
    /Simulator CIC catalog drift/
  );

  // Drift 2: Altered CIC endpoint must throw
  const badCicCatalog: DependencySimulationCatalog = {
    ...catalog,
    coreCics: catalog.coreCics.map((c, idx) =>
      idx === 0 ? { ...c, targetModuleId: 'procurement' } : c
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(badCicCatalog),
    /Simulator CIC endpoint mismatch/
  );

  // Drift 3: Missing FLD record must throw
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        coreFlds: catalog.coreFlds.slice(0, 4),
      }),
    /Simulator FLD catalog drift/
  );

  // Drift 4: Flipping deferred ownership on Three-Way Match must throw
  const badFldCatalog: DependencySimulationCatalog = {
    ...catalog,
    coreFlds: catalog.coreFlds.map((f) =>
      f.id === 'FLD-CORE-05' ? { ...f, isOwnerDeferred: false } : f
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(badFldCatalog),
    /Simulator FLD deferred-owner mismatch/
  );

  // Drift 5: Missing PCD row referenced by simulator must throw
  const badPcdCatalog: DependencySimulationCatalog = {
    ...catalog,
    pcdMatrix: catalog.pcdMatrix.filter(
      (r) => r.capability !== 'Fiscal Calendar / Accounting Period'
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(badPcdCatalog),
    /not found in authoritative PCD Matrix/
  );
});

// ============================================================================
// 6. Unified Global Search — BATCH-002 Deep-Linking Coverage
// ============================================================================

test('unified global search resolves D-FIN-01, CIC-CORE-INV-FIN-001, HBMD, Freeze not Delete, Three-Way Match, and G-ASSUMP-01', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();

  const index = buildUnifiedSearchIndex(
    registry.getAllPublicMetadata(),
    PROJECT_REFERENCE_SNAPSHOT,
    {
      decisionRegister: getExtractedDecisionRegister(),
      facRegister: getExtractedFacRegister(),
      guardrails: getExtractedGuardrails(),
      roadmap: getExtractedRoadmap(),
      coreModulesCatalog: getExtractedCoreModulesCatalog(),
      dependencyArchitecture: getExtractedDependencyArchitecture(),
    }
  );

  // Phase 2 source-local decision deep-link
  const dFin01 = searchUnifiedKnowledge('D-FIN-01', index);
  assert.ok(dFin01.length >= 1);
  assert.equal(dFin01[0]?.href, '/decisions?decision=D-FIN-01');

  // Core CIC deep-link
  const cicInvFin = searchUnifiedKnowledge('CIC-CORE-INV-FIN-001', index);
  assert.ok(cicInvFin.length >= 1);
  assert.equal(
    cicInvFin[0]?.href,
    '/dependencies?tab=matrix&cic=CIC-CORE-INV-FIN-001'
  );

  // Dependency Type deep-link
  const hbmd = searchUnifiedKnowledge('HBMD', index);
  assert.ok(hbmd.length >= 1);
  assert.equal(hbmd[0]?.href, '/dependencies?tab=model&type=HBMD');

  // Module Lifecycle concept
  const freeze = searchUnifiedKnowledge('Freeze, not Delete', index);
  assert.ok(freeze.some((r) => r.href === '/dependencies?tab=lifecycle'));

  // FLD / Three-Way Match
  const threeWay = searchUnifiedKnowledge('Three-Way Match', index);
  assert.ok(threeWay.length >= 1);
  assert.ok(
    threeWay.some((r) => r.href === '/dependencies?tab=matrix#fld-register')
  );

  // Phase 2 Assumption Safety Guardrail
  const gAssump01 = searchUnifiedKnowledge('G-ASSUMP-01', index);
  assert.ok(gAssump01.length >= 1);
  assert.equal(gAssump01[0]?.href, '/dependencies?tab=reviews');

  // Core Module detail route
  const modProc = searchUnifiedKnowledge('MOD-PROC', index);
  assert.ok(modProc.length >= 1);
  assert.equal(modProc[0]?.href, '/modules/procurement');
});

// ============================================================================
// 7. TASK-005-FIX-02 — Source Integrity & Structured Knowledge Governance
//    (KH-028, KH-029, KH-030, KH-031, KH-032, KH-034)
// ============================================================================

test('FIX-02-R01 (KH-028): curated module projections pin source revision & canonical body SHA-256 and flag drift on body or revision mutation', () => {
  resetExtractedCoreModulesCache();
  const catalog = getExtractedCoreModulesCatalog();
  const registry = getContentRegistry();

  assert.equal(catalog.anyProjectionRequiresReview, false);

  for (const mod of catalog.modules) {
    const pin = CURATED_MODULE_PROJECTION_PINS[mod.id];
    assert.equal(mod.projectionMetadata.kind, 'curated-projection');
    assert.equal(
      mod.projectionMetadata.mappingFreshnessStatus,
      'verified-current'
    );
    assert.equal(
      mod.projectionMetadata.mappedSourceRevision,
      pin.mappedSourceRevision
    );
    assert.equal(
      mod.projectionMetadata.actualSourceBodySha256,
      pin.mappedSourceBodySha256
    );
    assert.equal(mod.projectionMetadata.reviewWarning, null);
    assert.ok(mod.projectionMetadata.curatedFields.length > 0);
    assert.ok(mod.projectionMetadata.deterministicFields.length > 0);
  }

  // Body drift detection on Procurement module model
  const procDoc = registry.getBySlug('procurement-module-model');
  assert.ok(procDoc);
  const mutatedBodyProfile = buildCoreModuleProfileFromSource(
    'procurement',
    procDoc.bodyMarkdown + '\n<!-- simulated source body change -->\n',
    {
      documentId: procDoc.metadata.id,
      sourceRevision:
        procDoc.metadata.source.kind === 'official-source'
          ? procDoc.metadata.source.commitSha ?? null
          : null,
    }
  );
  assert.equal(
    mutatedBodyProfile.projectionMetadata.mappingFreshnessStatus,
    'review-required-source-changed'
  );
  assert.ok(mutatedBodyProfile.projectionMetadata.reviewWarning !== null);

  // Revision drift detection on Finance module model (body unchanged, commitSha changed)
  const finDoc = registry.getBySlug('finance-module-model');
  assert.ok(finDoc);
  const mutatedRevProfile = buildCoreModuleProfileFromSource(
    'finance',
    finDoc.bodyMarkdown,
    {
      documentId: finDoc.metadata.id,
      sourceRevision: '1111111111111111111111111111111111111111',
    }
  );
  assert.equal(
    mutatedRevProfile.projectionMetadata.mappingFreshnessStatus,
    'review-required-source-changed'
  );
  assert.ok(mutatedRevProfile.projectionMetadata.reviewWarning !== null);
});

test('FIX-02-R03 (KH-030): mandatory stored-body integrity catches single-char tampering, trailing whitespace edits, and CRLF drift without relying on /files/', () => {
  const visionRelativePath = 'content/collections/official/project-vision.ar.md';
  const rawFile = fs.readFileSync(
    path.join(process.cwd(), visionRelativePath),
    'utf8'
  );
  const manifestEntry = OFFICIAL_SOURCE_MANIFEST.find(
    (e) => e.publishedContentId === 'kh-doc-project-vision-ar'
  );
  assert.ok(manifestEntry);

  // Clean stored file passes mandatory validation
  const cleanParsed = parseMarkdownDocument(rawFile, {
    sourceFileRelativePath: visionRelativePath,
    collection: 'official',
    isFixture: false,
  });
  if (!cleanParsed.ok) {
    assert.fail('Expected cleanParsed.ok to be true');
  }
  assert.equal(
    verifyStoredOfficialDocumentIntegrity(cleanParsed.document, manifestEntry)
      .ok,
    true
  );

  // Single-character tampering inside body (leaving frontmatter intact) must fail validateLoadedEntries
  const envelopeSplit = rawFile.indexOf('\n---\n\n');
  assert.ok(envelopeSplit > 0);
  const head = rawFile.slice(0, envelopeSplit + 6);
  const body = rawFile.slice(envelopeSplit + 6);
  const firstLetterIdx = body.search(/[A-Za-z]/);
  assert.ok(firstLetterIdx >= 0);
  const originalChar = body[firstLetterIdx]!;
  const swappedChar = originalChar === 'X' ? 'Y' : 'X';
  const tamperedSingleChar =
    head + body.slice(0, firstLetterIdx) + swappedChar + body.slice(firstLetterIdx + 1);
  assert.notEqual(tamperedSingleChar, rawFile);

  const parsedTampered = parseMarkdownDocument(tamperedSingleChar, {
    sourceFileRelativePath: visionRelativePath,
    collection: 'official',
    isFixture: false,
  });
  const tamperedReport = validateLoadedEntries([parsedTampered], {
    manifestEntries: [manifestEntry],
  });
  assert.equal(tamperedReport.ok, false);
  assert.ok(
    tamperedReport.errors.some((e) => e.code === 'STORED_BODY_DIGEST_MISMATCH'),
    'Expected STORED_BODY_DIGEST_MISMATCH on 1-character body edit'
  );
  assert.ok(
    tamperedReport.errors.some(
      (e) => e.code === 'STORED_BODY_GIT_BLOB_MISMATCH'
    ),
    'Expected STORED_BODY_GIT_BLOB_MISMATCH on 1-character body edit'
  );

  // Trailing whitespace edit must NOT be masked by broad .trim()
  const trailingSpaceTampered = rawFile + ' ';
  const parsedTrailingSpace = parseMarkdownDocument(trailingSpaceTampered, {
    sourceFileRelativePath: visionRelativePath,
    collection: 'official',
    isFixture: false,
  });
  if (!parsedTrailingSpace.ok) {
    assert.fail('Expected parsedTrailingSpace.ok to be true');
  }
  assert.equal(
    extractCanonicalStoredBody(parsedTrailingSpace.document.bodyMarkdown).endsWith(
      ' '
    ),
    true,
    'extractCanonicalStoredBody must not trim trailing whitespace'
  );
  const trailingSpaceReport = validateLoadedEntries([parsedTrailingSpace], {
    manifestEntries: [manifestEntry],
  });
  assert.equal(trailingSpaceReport.ok, false);
  assert.ok(
    trailingSpaceReport.errors.some(
      (e) => e.code === 'STORED_BODY_DIGEST_MISMATCH'
    ),
    'Trailing whitespace tampering must fail mandatory stored-body integrity check'
  );

  // CRLF line-ending drift inside stored canonical body must also fail validation
  const crlfBodyTampered = head + body.replace(/\n/, '\r\n');
  const parsedCrlf = parseMarkdownDocument(crlfBodyTampered, {
    sourceFileRelativePath: visionRelativePath,
    collection: 'official',
    isFixture: false,
  });
  const crlfReport = validateLoadedEntries([parsedCrlf], {
    manifestEntries: [manifestEntry],
  });
  assert.equal(crlfReport.ok, false);
  assert.ok(
    crlfReport.errors.some((e) => e.code === 'STORED_BODY_CRLF_DRIFT'),
    'CRLF drift inside canonical stored body must fail mandatory validation'
  );
});

test('FIX-02-R04 (KH-031): Governing Artifacts match the exact 6 authoritative entries in DECISION_REGISTER.md lines 295-307 (never substituting module models)', () => {
  resetExtractedDecisionRegisterCache();
  const register = getExtractedDecisionRegister();

  const expectedGoverningSlugs = [
    'project-vision',
    'cross-phase-product-guardrails',
    'dependency-model',
    'module-dependency-matrix',
    'module-lifecycle-rules',
    'future-module-extension-rules',
  ];

  assert.equal(register.governingArtifacts.length, 6);
  const actualSlugs = register.governingArtifacts.map((g) => g.importedSlug);
  assert.deepEqual(actualSlugs, expectedGoverningSlugs);

  // Explicitly ensure none of the 4 Core Module models were mistakenly listed as Governing Artifacts
  const forbiddenModuleSlugs = new Set([
    'finance-module-model',
    'inventory-module-model',
    'procurement-module-model',
    'sales-order-management-module-model',
  ]);
  for (const artifact of register.governingArtifacts) {
    assert.equal(
      forbiddenModuleSlugs.has(artifact.importedSlug ?? ''),
      false,
      `${artifact.artifactPath} must not be substituted with a Core Module model`
    );
  }
});

test('FIX-02-R05 (KH-032): official ERP identifiers vs Knowledge Hub internal identifiers are explicitly classified across extractors, simulator, and search', () => {
  resetContentRegistryCache();
  resetExtractedCoreModulesCache();
  resetExtractedDependencyArchitectureCache();

  const registry = getContentRegistry();
  const coreModulesCatalog = getExtractedCoreModulesCatalog();
  const dependencyArchitecture = getExtractedDependencyArchitecture();

  // Core Module display codes (MOD-*) are Knowledge Hub internal
  for (const mod of coreModulesCatalog.modules) {
    assert.equal(mod.codeIdentifierScope, 'knowledge-hub-internal');
  }

  // CIC-CORE-* are Official ERP IDs; FLD-CORE-* and OWN-CORE-* are Knowledge Hub internal
  for (const cic of dependencyArchitecture.matrix.coreCics) {
    assert.equal(cic.identifierScope, 'official-erp');
  }
  for (const fld of dependencyArchitecture.matrix.coreFlds) {
    assert.equal(fld.identifierScope, 'knowledge-hub-internal');
  }
  for (const own of dependencyArchitecture.matrix.dataOwnershipRecords) {
    assert.equal(own.identifierScope, 'knowledge-hub-internal');
  }

  // Simulator outcomes propagate identifierScope cleanly
  const simResult = simulateModuleActivation({
    catalog: dependencyArchitecture.matrix,
    selectedModules: {
      finance: true,
      'inventory-warehouse': true,
      procurement: true,
      'sales-order-management': true,
    },
    platform: DEFAULT_PLATFORM_PREREQUISITES,
  });
  for (const cicOut of simResult.cicOutcomes) {
    assert.equal(cicOut.identifierScope, 'official-erp');
  }
  for (const fldOut of simResult.fldOutcomes) {
    assert.equal(fldOut.identifierScope, 'knowledge-hub-internal');
  }

  // Unified Search distinguishes official vs internal identifierScope
  const index = buildUnifiedSearchIndex(
    registry.getAllPublicMetadata(),
    PROJECT_REFERENCE_SNAPSHOT,
    {
      decisionRegister: getExtractedDecisionRegister(),
      facRegister: getExtractedFacRegister(),
      guardrails: getExtractedGuardrails(),
      roadmap: getExtractedRoadmap(),
      coreModulesCatalog,
      dependencyArchitecture,
    }
  );

  assert.equal(
    searchUnifiedKnowledge('D-FIN-01', index)[0]?.identifierScope,
    'official-erp'
  );
  assert.equal(
    searchUnifiedKnowledge('CIC-CORE-INV-FIN-001', index)[0]?.identifierScope,
    'official-erp'
  );
  assert.equal(
    searchUnifiedKnowledge('FAC-024', index)[0]?.identifierScope,
    'official-erp'
  );
  assert.equal(
    searchUnifiedKnowledge('G-ASSUMP-01', index)[0]?.identifierScope,
    'official-erp'
  );
  assert.equal(
    searchUnifiedKnowledge('MOD-PROC', index)[0]?.identifierScope,
    'knowledge-hub-internal'
  );
  assert.equal(
    searchUnifiedKnowledge('FLD-CORE-05', index)[0]?.identifierScope,
    'knowledge-hub-internal'
  );
  assert.equal(
    searchUnifiedKnowledge('OWN-CORE-01', index)[0]?.identifierScope,
    'knowledge-hub-internal'
  );
});

test('FIX-02-R06 (KH-034): simulator catches source pin drift, CIC precondition drift, FLD semantic drift, PCD classification drift, unmapped Required PCDs, and duplicate IDs', () => {
  resetExtractedDependencyArchitectureCache();
  const catalog = getExtractedDependencyArchitecture().matrix;

  // Baseline passes and exposes pinned source metadata
  const validSummary = validateSimulatorCatalogConsistency(catalog);
  assert.equal(validSummary.valid, true);
  assert.equal(validSummary.mappingFreshnessStatus, 'verified-current');
  assert.equal(
    validSummary.sourceRevision,
    SIMULATOR_PINNED_SOURCE.mappedSourceRevision
  );
  assert.equal(
    validSummary.sourceBodySha256,
    SIMULATOR_PINNED_SOURCE.mappedSourceBodySha256
  );

  // 1. Source revision / body SHA-256 drift rejected
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        sourceRevision: '0000000000000000000000000000000000000000',
      }),
    /Simulator source revision drift/
  );
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        sourceBodySha256: '0'.repeat(64),
      }),
    /Simulator source body digest drift/
  );

  // 2. Changed CIC Required Preconditions (contractId unchanged) rejected
  const mutatedCicPrecond: DependencySimulationCatalog = {
    ...catalog,
    coreCics: catalog.coreCics.map((c) =>
      c.contractId === 'CIC-CORE-INV-FIN-001'
        ? {
            ...c,
            metadata: {
              ...c.metadata,
              requiredPreconditions:
                'Mutated precondition requiring external warehouse gateway',
            },
          }
        : c
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(mutatedCicPrecond),
    /Simulator CIC semantic drift \(Required Preconditions\)/
  );

  // 3. Changed CIC Activation Condition rejected
  const mutatedCicActivation: DependencySimulationCatalog = {
    ...catalog,
    coreCics: catalog.coreCics.map((c) =>
      c.contractId === 'CIC-CORE-PROC-FIN-001'
        ? {
            ...c,
            metadata: {
              ...c.metadata,
              activationCondition: 'Always auto-enabled when both modules active',
            },
          }
        : c
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(mutatedCicActivation),
    /Simulator CIC semantic drift \(Activation Condition\)/
  );

  // 4. Changed FLD semantics (target capability & scenario) rejected
  const mutatedFldSemantics: DependencySimulationCatalog = {
    ...catalog,
    coreFlds: catalog.coreFlds.map((f) =>
      f.id === 'FLD-CORE-05'
        ? {
            ...f,
            featureScenario: 'Mutated 2-way match scenario without Inventory',
          }
        : f
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(mutatedFldSemantics),
    /Simulator FLD semantic drift \(Feature Scenario\)/
  );

  // 5. Changed PCD classification (C -> R on mapped capability Currency Foundation for Inventory) rejected
  const mutatedMappedPcdClass: DependencySimulationCatalog = {
    ...catalog,
    pcdMatrix: catalog.pcdMatrix.map((row) =>
      row.capability === 'Currency Foundation'
        ? { ...row, inventory: 'R' }
        : row
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(mutatedMappedPcdClass),
    /Simulator PCD classification drift/
  );

  // 6. Newly Required ('R') PCD without an executable toggle binding rejected (never silently ignored)
  const unmappedRequiredPcd: DependencySimulationCatalog = {
    ...catalog,
    pcdMatrix: catalog.pcdMatrix.map((row) =>
      row.capability === 'Workflow / Approvals'
        ? { ...row, procurement: 'R' }
        : row
    ),
  };
  assert.throws(
    () => validateSimulatorCatalogConsistency(unmappedRequiredPcd),
    /Simulator PCD executable mapping missing for required capability/
  );

  // 7. Duplicate dependency identifiers (CIC, FLD, PCD) rejected
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        coreCics: [...catalog.coreCics, catalog.coreCics[0]!],
      }),
    /Simulator duplicate CIC identifier detected/
  );
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        coreFlds: [...catalog.coreFlds, catalog.coreFlds[0]!],
      }),
    /Simulator duplicate FLD identifier detected/
  );
  assert.throws(
    () =>
      validateSimulatorCatalogConsistency({
        ...catalog,
        pcdMatrix: [...catalog.pcdMatrix, catalog.pcdMatrix[0]!],
      }),
    /Simulator duplicate PCD capability identifier detected/
  );
});

// ============================================================================
// 8. TASK-005-FIX-03A — Core Module Educational Depth & Traceability (R01–R07)
// ============================================================================

test('TASK-005-FIX-03A (R01–R05, R07): every core module covers all 9 educational dimensions, 4-perspective ownership, deferred rationales, and provenance fields', () => {
  resetExtractedCoreModulesCache();
  const catalog = getExtractedCoreModulesCatalog();
  assert.equal(catalog.modules.length, 4);

  const requiredEducationalProjectionFields = [
    'purposeAndImpact',
    'designReasoning',
    'absentPeerScenarios',
    'ownershipBoundaryMatrix',
    'deferredBoundaryRationales',
    'decisions.educationalDetail',
  ] as const;

  for (const field of requiredEducationalProjectionFields) {
    assert.ok(
      CURATED_MODULE_PROJECTION_FIELDS.includes(field),
      `Expected ${field} in CURATED_MODULE_PROJECTION_FIELDS`
    );
  }

  for (const mod of catalog.modules) {
    // R01: 9 educational dimensions populated in both AR & EN
    assert.ok(mod.purposeAndImpact.whyModuleExists.ar.length > 40);
    assert.ok(mod.purposeAndImpact.whyModuleExists.en.length > 40);
    assert.ok(mod.purposeAndImpact.businessProblemsAddressed.length >= 2);
    assert.ok(mod.purposeAndImpact.futureDesignImplications.length >= 2);
    assert.ok(mod.responsibilities.length >= 4);
    assert.ok(mod.explicitExclusions.length >= 3);
    assert.ok(mod.standaloneCapabilities.length >= 3);
    assert.equal(
      mod.absentPeerScenarios.length,
      3,
      `${mod.id} must cover all 3 absent peer modules`
    );
    assert.ok(mod.requiredPcds.length >= 2);
    assert.ok(mod.deferredDesignItems.length >= 2);

    // R02: Architecture Design Reasoning separates official reasoning vs educational interpretation
    assert.ok(mod.designReasoning.length >= 3);
    for (const reason of mod.designReasoning) {
      assert.ok(reason.officialReasoning.ar.length > 20);
      assert.ok(reason.officialReasoning.en.length > 20);
      assert.ok(reason.architecturalImplication.ar.length > 20);
      assert.ok(reason.architecturalImplication.en.length > 20);
      if (reason.educationalInterpretation) {
        assert.ok(reason.educationalInterpretation.ar.length > 20);
        assert.ok(reason.educationalInterpretation.en.length > 20);
      }
    }

    // R03: 4-perspective Ownership & Non-Ownership Matrix
    assert.ok(mod.ownershipBoundaryMatrix.length >= 3);
    for (const row of mod.ownershipBoundaryMatrix) {
      assert.ok(row.domainConcept.ar.length > 0 && row.domainConcept.en.length > 0);
      assert.ok(row.moduleOwns.ar.length > 0 && row.moduleOwns.en.length > 0);
      assert.ok(row.consumesOrReferences.ar.length > 0 && row.consumesOrReferences.en.length > 0);
      assert.ok(row.otherModulesOwn.ar.length > 0 && row.otherModulesOwn.en.length > 0);
      assert.ok(row.unresolvedBoundary.ar.length > 0 && row.unresolvedBoundary.en.length > 0);
    }

    // R04: Every Phase 2 decision has verbatim body + educational detail
    assert.ok(mod.decisions.length >= 6);
    for (const dec of mod.decisions) {
      assert.ok(dec.verbatimBody.length > 15);
      assert.ok(dec.educationalDetail.educationalExplanation.ar.length > 20);
      assert.ok(dec.educationalDetail.educationalExplanation.en.length > 20);
      assert.ok(dec.educationalDetail.architecturalImplication.ar.length > 20);
      assert.ok(dec.educationalDetail.architecturalImplication.en.length > 20);
      assert.ok(dec.educationalDetail.relevantLimitations.ar.length > 20);
      assert.ok(dec.educationalDetail.relevantLimitations.en.length > 20);
      assert.ok(dec.educationalDetail.relatedSourceSections.length >= 1);
    }

    // R05: Deferred design boundary rationales populated while keeping future slots unpopulated
    assert.ok(mod.deferredBoundaryRationales.length >= 3);
    const populatedSlots = mod.lifecycleBlueprint.filter(
      (s) => s.status === 'populated-phase-2'
    );
    const futureSlots = mod.lifecycleBlueprint.filter(
      (s) => s.status === 'future-phase'
    );
    assert.equal(populatedSlots.length, 9);
    assert.equal(futureSlots.length, 8);
    assert.equal(mod.lifecycleBlueprint.length, 17);

    // R07: Provenance metadata exposes both deterministic and curated educational fields
    for (const field of requiredEducationalProjectionFields) {
      assert.ok(mod.projectionMetadata.curatedFields.includes(field));
    }
  }
});

test('TASK-005-FIX-03A (R04, R07): 100% of decision anchors and educational sourceRef anchors resolve to actual rendered headings in official documents', async () => {
  resetContentRegistryCache();
  resetExtractedCoreModulesCache();
  const registry = getContentRegistry();
  const catalog = getExtractedCoreModulesCatalog();

  assert.equal(catalog.allPhase2Decisions.length, 34);

  const headingIdsBySlug = new Map<string, Set<string>>();
  for (const mod of catalog.modules) {
    const doc = registry.getBySlug(mod.documentSlug);
    assert.ok(doc, `Missing official document for slug ${mod.documentSlug}`);
    const rendered = await renderSafeMarkdown(doc.bodyMarkdown);
    const ids = new Set(rendered.headings.map((h) => h.id));
    headingIdsBySlug.set(mod.documentSlug, ids);

    const assertAnchorExists = (anchor: string, contextLabel: string) => {
      assert.ok(
        ids.has(anchor),
        `Anchor #${anchor} (${contextLabel}) not found in rendered headings for ${mod.documentSlug}`
      );
    };

    // Purpose & impact anchors
    assertAnchorExists(
      mod.purposeAndImpact.whyModuleExistsSourceRef.sectionAnchor,
      `${mod.id}.purposeAndImpact.whyModuleExistsSourceRef`
    );
    for (const problem of mod.purposeAndImpact.businessProblemsAddressed) {
      assertAnchorExists(
        problem.sourceRef.sectionAnchor,
        `${mod.id}.businessProblemsAddressed[${problem.title.en}]`
      );
    }
    for (const imp of mod.purposeAndImpact.futureDesignImplications) {
      assertAnchorExists(
        imp.sourceRef.sectionAnchor,
        `${mod.id}.futureDesignImplications[${imp.area.en}]`
      );
    }

    // Design reasoning anchors
    for (const reason of mod.designReasoning) {
      assertAnchorExists(
        reason.sourceRef.sectionAnchor,
        `${mod.id}.designReasoning[${reason.id}]`
      );
    }

    // Absent peer impact anchors
    for (const peer of mod.absentPeerScenarios) {
      assertAnchorExists(
        peer.sourceRef.sectionAnchor,
        `${mod.id}.absentPeerScenarios[${peer.absentPeerCode}]`
      );
    }

    // Ownership boundary matrix anchors
    for (const row of mod.ownershipBoundaryMatrix) {
      assertAnchorExists(
        row.sourceRef.sectionAnchor,
        `${mod.id}.ownershipBoundaryMatrix[${row.domainConcept.en}]`
      );
    }

    // Deferred boundary rationale anchors
    for (const def of mod.deferredBoundaryRationales) {
      assertAnchorExists(
        def.sourceRef.sectionAnchor,
        `${mod.id}.deferredBoundaryRationales[${def.topic.en}]`
      );
    }

    // Decision anchors + relatedSourceSections anchors
    for (const dec of mod.decisions) {
      assertAnchorExists(
        dec.sectionAnchor,
        `${mod.id}.decisions[${dec.decisionId}].sectionAnchor`
      );
      for (const sec of dec.educationalDetail.relatedSourceSections) {
        assertAnchorExists(
          sec.sectionAnchor,
          `${mod.id}.decisions[${dec.decisionId}].relatedSourceSections[${sec.sectionAnchor}]`
        );
      }
    }
  }
});

