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
import { verifySourceIntegrity } from '@/content/ingestion/ingestionPipeline';
import {
  getContentRegistry,
  resetContentRegistryCache,
} from '@/content/registry/contentRegistry';
import { validateApprovedCollections } from '@/content/validators/contentValidator';
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
  getCoreModuleProfileById,
  getExtractedCoreModulesCatalog,
  resetExtractedCoreModulesCache,
  type CoreModuleId,
} from '@/content/extractors/moduleModelsExtractor';
import {
  getExtractedDependencyArchitecture,
  resetExtractedDependencyArchitectureCache,
} from '@/content/extractors/dependencyArchitectureExtractor';
import {
  DEFAULT_EDUCATIONAL_CONTROLS,
  DEFAULT_PLATFORM_PREREQUISITES,
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

test('all 10 BATCH-002 official files and combined 16/16 OFFICIAL_SOURCE_MANIFEST verify cleanly against exact Git blob SHA-1 and verbatim /files bodies', () => {
  resetContentRegistryCache();
  const registry = getContentRegistry();
  const publishedIds = new Set(
    registry.getAllPublicMetadata().map((m) => m.id)
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

  const filesDir = path.join(process.cwd(), 'files');

  for (const entry of CORE_MODULE_ARCHITECTURE_SOURCE_MANIFEST) {
    assert.equal(entry.batchId, 'BATCH-002');
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
    }

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
