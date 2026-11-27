import type { IdentifierScope, LocalizedText } from '@/content/models/types';
import type { CoreModuleId } from '@/content/extractors/moduleModelsExtractor';
import type {
  CoreCicContract,
  CoreFldRecord,
  ExtractedDependencyArchitecture,
  PcdMatrixRow,
} from '@/content/extractors/dependencyArchitectureExtractor';

export type SimulatorGoverningSourceKey =
  | 'moduleDependencyMatrix'
  | 'dependencyModel'
  | 'moduleLifecycleRules';

export interface SimulatorGoverningSourcePin {
  readonly key: SimulatorGoverningSourceKey;
  readonly documentSlug: string;
  readonly officialSourcePath: string;
  readonly mappedSourceRevision: string;
  readonly mappedSourceBodySha256: string;
  readonly lastReviewedDate: string;
}

export interface SimulatorGoverningSourceSnapshot {
  readonly documentSlug: string;
  readonly officialSourcePath: string;
  readonly sourceRevision: string | null;
  readonly sourceBodySha256: string;
}

/**
 * Authoritative subset of ExtractedDependencyArchitecture['matrix'] passed from
 * server-side extraction into the pure client-safe simulator.
 * Zero filesystem or server-only imports exist in this module.
 */
export type DependencySimulationCatalog = Pick<
  ExtractedDependencyArchitecture['matrix'],
  | 'documentSlug'
  | 'officialSourcePath'
  | 'sourceRevision'
  | 'sourceBodySha256'
  | 'governingSources'
  | 'hbmdEdgeCount'
  | 'hbmdCycleCount'
  | 'coreCics'
  | 'coreFlds'
  | 'pcdMatrix'
>;

/**
 * Authoritative primary source pin for the simulator's executable CIC, FLD, and PCD mappings
 * (KH-034 / FIX-02-R06). Kept alongside SIMULATOR_PINNED_GOVERNING_SOURCES for full KH-036 coverage.
 */
export const SIMULATOR_PINNED_SOURCE = {
  officialSourcePath:
    'teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md',
  mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
  mappedSourceBodySha256:
    '34700c3027731399dd8a3276cf41f1fa3f5bc9234453502901589f8a46c55c43',
  lastReviewedDate: '2026-11-27',
} as const;

/**
 * Complete governing source pins for the simulator's architectural and lifecycle semantics
 * (KH-036 / TASK-005-QA R02). Drift in any of these three documents invalidates the simulator
 * mappings fail-closed until reviewed and re-pinned.
 */
export const SIMULATOR_PINNED_GOVERNING_SOURCES: Readonly<
  Record<SimulatorGoverningSourceKey, SimulatorGoverningSourcePin>
> = {
  moduleDependencyMatrix: {
    key: 'moduleDependencyMatrix',
    documentSlug: 'module-dependency-matrix',
    officialSourcePath:
      'teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '34700c3027731399dd8a3276cf41f1fa3f5bc9234453502901589f8a46c55c43',
    lastReviewedDate: '2026-11-27',
  },
  dependencyModel: {
    key: 'dependencyModel',
    documentSlug: 'dependency-model',
    officialSourcePath: 'teranoo-erp-planning/03-modules/DEPENDENCY_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '6ca9bff934962b679d43a881ddd343a04fe2fbe250550440bc6db982dc83d629',
    lastReviewedDate: '2026-11-27',
  },
  moduleLifecycleRules: {
    key: 'moduleLifecycleRules',
    documentSlug: 'module-lifecycle-rules',
    officialSourcePath:
      'teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '48b2e498841e8f97ea88837ff249359200e8abc8531f350fe3bddfc218f07658',
    lastReviewedDate: '2026-11-27',
  },
};

export type ConditionEvalState = 'satisfied' | 'unsatisfied' | 'unknown';

export interface PlatformPrerequisiteState {
  readonly mandatoryPlatformCore: boolean;
  readonly sharedPartyIdentity: boolean;
  readonly sharedProductAndUom: boolean;
  readonly inventoryStorageContext: boolean;
  readonly fiscalCalendar: boolean;
  readonly currencyFoundation: boolean;
}

export interface CicConditionOverrides {
  readonly contractEnabled?: ConditionEvalState;
  readonly scenarioEnabled?: ConditionEvalState;
  readonly specificPreconditions?: ConditionEvalState;
}

export interface EducationalConditionControls {
  readonly defaultCicContractEnabled: ConditionEvalState;
  readonly defaultCicScenarioEnabled: ConditionEvalState;
  readonly defaultCicSpecificPreconditions: ConditionEvalState;
  readonly defaultFldConfigured: ConditionEvalState;
  /**
   * When true (default), unresolved Phase 5/6 governance & deferred functional boundaries
   * (e.g., Contract Owner: TBD — Phase 5, Deferred Invoice Matching / Costing / Billing boundaries)
   * keep readiness in 'readiness-not-established-insufficient-info' rather than marking
   * evaluated conceptual prerequisites satisfied.
   */
  readonly treatDeferredBoundariesAsUnresolved: boolean;
  readonly cicOverrides?: Readonly<Partial<Record<string, CicConditionOverrides>>>;
  readonly fldOverrides?: Readonly<Partial<Record<string, ConditionEvalState>>>;
}

export interface ModuleActivationSimulatorInput {
  readonly catalog: DependencySimulationCatalog;
  readonly selectedModules: Readonly<Record<CoreModuleId, boolean>>;
  readonly platform: PlatformPrerequisiteState;
  readonly controls?: Partial<EducationalConditionControls>;
}

export interface ActivationScopeBoundary {
  readonly evaluatedConditions: readonly LocalizedText[];
  readonly outOfScopeConditions: readonly LocalizedText[];
}

export interface SimulatedModuleOutcome {
  readonly moduleId: CoreModuleId;
  readonly selected: boolean;
  readonly canActivateBaseWithinEvaluatedScope: boolean;
  readonly status:
    | 'not-selected'
    | 'base-activatable-within-evaluated-scope'
    | 'blocked-by-required-pcd';
  readonly missingRequiredPcds: readonly string[];
  readonly hbmdBlockers: readonly string[]; // Always [] in Phase 2 Core baseline
  readonly explanation: LocalizedText;
}

export type CicModulePrerequisiteStatus =
  | 'participating-modules-unavailable'
  | 'architectural-module-prerequisites-satisfied';

export type CicReadinessStatus =
  | 'participating-modules-unavailable'
  | 'contract-or-scenario-not-enabled'
  | 'contract-prerequisites-not-satisfied'
  | 'readiness-not-established-insufficient-info'
  | 'evaluated-conceptual-prerequisites-satisfied';

export interface CicSourceReference {
  readonly documentSlug: string;
  readonly officialSourcePath: string;
  readonly sectionAnchor: string;
  readonly evidence: string;
  readonly requiredPreconditionsVerbatim: string;
  readonly activationConditionVerbatim: string;
  readonly contractOwner: string;
  readonly statusVerbatim: string;
  readonly lifecycleRuleRef: string;
}

export interface SimulatedCicOutcome {
  readonly contractId: string;
  /** Official Phase 2 ERP contract identifier (KH-032). */
  readonly identifierScope: Extract<IdentifierScope, 'official-erp'>;
  readonly sourceModuleId: CoreModuleId;
  readonly targetModuleId: CoreModuleId;
  readonly scenario: LocalizedText;
  readonly modulePrerequisiteStatus: CicModulePrerequisiteStatus;
  readonly readinessStatus: CicReadinessStatus;
  readonly participatingModulesAvailable: boolean;
  readonly contractEnabledState: ConditionEvalState;
  readonly scenarioEnabledState: ConditionEvalState;
  readonly specificPreconditionLabel: LocalizedText;
  readonly specificPreconditionsState: ConditionEvalState;
  readonly missingContractPcds: readonly string[];
  readonly hasUnresolvedOrDeferredConditions: boolean;
  readonly unresolvedDeferredReasons: readonly LocalizedText[];
  /** Always false in Phase 2: full technical/functional runtime readiness requires Phase 5/6. */
  readonly fullRuntimeReadinessEstablished: false;
  readonly statusLabel: LocalizedText;
  readonly reason: LocalizedText;
  readonly deferredBoundaryNote?: LocalizedText;
  readonly sourceRef: CicSourceReference;
}

export type FldEvaluationStatus =
  | 'source-module-inactive'
  | 'required-modules-unavailable'
  | 'dependency-prerequisites-not-satisfied'
  | 'feature-not-configured-or-disabled'
  | 'readiness-not-established-insufficient-info'
  | 'evaluated-prerequisites-satisfied-functional-unspecified';

export interface FldSourceReference {
  readonly documentSlug: string;
  readonly officialSourcePath: string;
  readonly sectionAnchor: string;
  readonly evidence: string;
  readonly featureOwner: string;
  readonly statusVerbatim: string;
  readonly lifecycleRuleRef: string;
}

export interface SimulatedFldOutcome {
  /** Knowledge Hub internal row reference ID (e.g. FLD-CORE-01); NOT an official ERP ID (KH-032). */
  readonly id: string;
  readonly identifierScope: Extract<IdentifierScope, 'knowledge-hub-internal'>;
  readonly sourceModuleId: CoreModuleId;
  readonly featureLabel: LocalizedText;
  readonly sourceModuleFeatureVerbatim: string;
  readonly targetModuleCapabilityVerbatim: string;
  readonly requiredModules: readonly CoreModuleId[];
  readonly missingModules: readonly CoreModuleId[];
  readonly missingConditionalPcds: readonly string[];
  readonly linkedCicIds: readonly string[];
  // Four strictly separated dimensions (FIX-01-R04)
  readonly requiredModulesAvailable: boolean;
  readonly featureDependencyPrerequisitesSatisfied: boolean;
  readonly featureConfiguredState: ConditionEvalState;
  /** Always false in Phase 2: functional blueprints & operational behavior belong to Phase 6. */
  readonly fullFunctionalBehaviorSpecified: false;
  readonly status: FldEvaluationStatus;
  readonly statusLabel: LocalizedText;
  readonly reason: LocalizedText;
  readonly isOwnerDeferred: boolean;
  readonly hasDeferredBoundary: boolean;
  readonly deferredNote?: LocalizedText;
  readonly sourceRef: FldSourceReference;
}

export interface CatalogConsistencySummary {
  readonly valid: true;
  readonly sourceRevision: string;
  readonly sourceBodySha256: string;
  readonly pinnedSources: readonly SimulatorGoverningSourceSnapshot[];
  readonly mappingFreshnessStatus: 'verified-current';
  readonly cicCount: number;
  readonly fldCount: number;
  readonly pcdRowCount: number;
  readonly hbmdEdgeCount: 0;
}

export interface CicStatusSummary {
  readonly total: number;
  readonly participatingModulesUnavailable: number;
  readonly architecturalModulePrereqsSatisfied: number;
  readonly contractOrScenarioNotEnabled: number;
  readonly contractPrereqsNotSatisfied: number;
  readonly readinessNotEstablished: number;
  readonly evaluatedConceptualPrereqsSatisfied: number;
}

export interface FldStatusSummary {
  readonly total: number;
  readonly sourceInactive: number;
  readonly requiredModulesUnavailable: number;
  readonly dependencyPrereqsNotSatisfied: number;
  readonly featureDisabled: number;
  readonly readinessNotEstablished: number;
  readonly evaluatedPrereqsSatisfiedFunctionalUnspecified: number;
}

export interface ModuleActivationSimulationResult {
  readonly disclaimer: LocalizedText;
  readonly catalogValidation: CatalogConsistencySummary;
  readonly activationScopeBoundary: ActivationScopeBoundary;
  readonly selectedCount: number;
  readonly activatableModulesCount: number;
  readonly hbmdEdgeCount: 0;
  readonly moduleOutcomes: readonly SimulatedModuleOutcome[];
  readonly cicOutcomes: readonly SimulatedCicOutcome[];
  readonly cicSummary: CicStatusSummary;
  readonly fldOutcomes: readonly SimulatedFldOutcome[];
  readonly fldSummary: FldStatusSummary;
  readonly architecturalTakeaways: readonly LocalizedText[];
}

export const MODULE_ACTIVATION_SIMULATOR_DISCLAIMER: LocalizedText = {
  ar: 'محاكاة تعليمية للحدود المعمارية المعتمدة في المرحلة 2 فقط — تُقيّم شروط الاعتماديات المفاهيمية ولا تُمثّل نظام ERP تشغيليًا ولا جاهزية تشغيلية أو سلوكًا وظيفيًا مُحقّقًا.',
  en: 'Educational simulation of approved Phase 2 architectural boundaries only — evaluates conceptual dependency preconditions and does not represent a running ERP system, operational runtime readiness, or implemented functional behavior.',
};

export const DEFAULT_PLATFORM_PREREQUISITES: PlatformPrerequisiteState = {
  mandatoryPlatformCore: true,
  sharedPartyIdentity: true,
  sharedProductAndUom: true,
  inventoryStorageContext: true,
  fiscalCalendar: true,
  currencyFoundation: true,
};

export const DEFAULT_EDUCATIONAL_CONTROLS: EducationalConditionControls = {
  defaultCicContractEnabled: 'unknown',
  defaultCicScenarioEnabled: 'unknown',
  defaultCicSpecificPreconditions: 'unknown',
  defaultFldConfigured: 'unknown',
  treatDeferredBoundariesAsUnresolved: true,
};

export const BASE_ACTIVATION_SCOPE_BOUNDARY: ActivationScopeBoundary = {
  evaluatedConditions: [
    {
      ar: 'توفر قدرات المنصة الإلزامية (PCD: Required) المشتقة مباشرةً من مصفوفة PCD الرسمية (MODULE_DEPENDENCY_MATRIX.md §7.2 · MODULE_LIFECYCLE_RULES.md §4.2).',
      en: 'Required Platform Capability Dependencies (PCD: Required) derived directly from the official PCD Matrix (MODULE_DEPENDENCY_MATRIX.md §7.2 · MODULE_LIFECYCLE_RULES.md §4.2).',
    },
    {
      ar: 'التحقق من غياب الاعتماديات الصلبة بين الأنظمة الأساسية (0 Core HBMD و0 دورات اعتمادية — MODULE_DEPENDENCY_MATRIX.md §4 · MODULE_LIFECYCLE_RULES.md §4.3–§4.4).',
      en: 'Hard Business Module Dependency check confirming 0 approved Core HBMD edges and 0 cycles (MODULE_DEPENDENCY_MATRIX.md §4 · MODULE_LIFECYCLE_RULES.md §4.3–§4.4).',
    },
    {
      ar: 'قاعدة عدم المنع: عدم تفعيل CIC أو عدم توفر ميزة FLD لا يمنع التفعيل الأساسي للنظام أبدًا (MODULE_LIFECYCLE_RULES.md §4.8).',
      en: 'Non-blocking rule: inactive CICs or unavailable FLDs never block base module activation (MODULE_LIFECYCLE_RULES.md §4.8).',
    },
  ],
  outOfScopeConditions: [
    {
      ar: 'صلاحية الاشتراك أو ترخيص المنتج (Entitlement / Product Permission — سياسة Control Plane خارج نطاق المحاكي · §4.1).',
      en: 'Entitlement / Product Permission via Control Plane policy (outside educational simulator scope · §4.1).',
    },
    {
      ar: 'المرجعيات التنظيمية والسياقية الإلزامية المحددة في المرحلة 3 (Tenant/Company/Org scope · §4.5).',
      en: 'Mandatory organizational and context references defined in Phase 3 (Tenant/Company/Org scope · §4.5).',
    },
    {
      ar: 'تهيئة الأمن التشغيلي والأدوار والتدقيق الفعلي في بيئة التشغيل (Runtime Security/Roles/Audit provisioning · §4.6).',
      en: 'Operational runtime Security, Roles, and Audit provisioning details (§4.6).',
    },
    {
      ar: 'الحد الأدنى الصالح لإعدادات الوحدة التشغيلية (Minimum Valid Module Configuration Baseline · §4.7).',
      en: 'Minimum valid operational module configuration baseline (§4.7).',
    },
  ],
};

const CORE_MODULE_IDS: readonly CoreModuleId[] = [
  'finance',
  'inventory-warehouse',
  'procurement',
  'sales-order-management',
];

/**
 * Authoritative mapping between the 6 educational PCD toggle groups and the exact
 * capability row names extracted from MODULE_DEPENDENCY_MATRIX.md §7.2 (21 rows).
 */
export const PCD_TOGGLE_CAPABILITY_BINDINGS: Readonly<
  Record<keyof PlatformPrerequisiteState, readonly string[]>
> = {
  mandatoryPlatformCore: [
    'Tenant Context',
    'Company / Legal Entity Context',
    'Users / Roles / Permissions',
    'Audit Trail',
    'Reporting Infrastructure',
    'Configuration / Feature Management',
    'Integration / API Framework Availability',
    'Localization Framework Availability',
  ],
  sharedPartyIdentity: ['Shared Party Identity'],
  sharedProductAndUom: [
    'Shared Product / Item / Service Identity',
    'UOM Foundation',
  ],
  inventoryStorageContext: ['Inventory Storage / Fulfillment Context'],
  fiscalCalendar: ['Fiscal Calendar / Accounting Period'],
  currencyFoundation: ['Currency Foundation'],
};

/**
 * Pinned PCD Matrix classifications from MODULE_DEPENDENCY_MATRIX.md §7.2 (21 rows).
 * Detects classification drift (e.g., C -> R, — -> R, R -> C, C* modifications) so
 * stale executable simulator assumptions are rejected until reviewed (KH-034).
 */
export const PINNED_PCD_MATRIX_CLASSIFICATIONS: Readonly<
  Record<
    string,
    {
      readonly finance: string;
      readonly inventory: string;
      readonly procurement: string;
      readonly sales: string;
    }
  >
> = {
  'Tenant Context': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Company / Legal Entity Context': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Users / Roles / Permissions': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Audit Trail': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Reporting Infrastructure': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Configuration / Feature Management': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Integration / API Framework Availability': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Localization Framework Availability': { finance: 'R', inventory: 'R', procurement: 'R', sales: 'R' },
  'Branch / Operating / Business Unit Context': { finance: 'C', inventory: 'C', procurement: 'C', sales: 'C' },
  'Workflow / Approvals': { finance: 'C', inventory: 'C', procurement: 'C', sales: 'C' },
  'Documents & Attachments': { finance: 'C', inventory: 'C', procurement: 'C', sales: 'C' },
  'Shared Party Identity': { finance: 'C', inventory: 'C', procurement: 'R — Supplier', sales: 'R — Customer' },
  'Shared Product / Item / Service Identity': { finance: '—', inventory: 'R', procurement: 'C', sales: 'R' },
  'UOM Foundation': { finance: '—', inventory: 'R', procurement: 'C', sales: 'R' },
  'Inventory Storage / Fulfillment Context': { finance: '—', inventory: 'R', procurement: 'C', sales: 'C' },
  'Fiscal Calendar / Accounting Period': { finance: 'R', inventory: '—', procurement: '—', sales: '—' },
  'Currency Foundation': { finance: 'R', inventory: 'C', procurement: 'R', sales: 'R' },
  'Exchange Rates': { finance: 'C', inventory: 'C', procurement: 'C', sales: 'C' },
  'Tax Foundation': { finance: 'C', inventory: 'C', procurement: 'C', sales: 'C' },
  'Pricing Capability': { finance: '—', inventory: '—', procurement: '—', sales: 'C*' },
  'Credit Capability': { finance: '—', inventory: '—', procurement: '—', sales: 'C*' },
};

interface CicExecutableSpec {
  readonly contractId: string;
  readonly expectedSourceModuleId: CoreModuleId;
  readonly expectedTargetModuleId: CoreModuleId;
  /** Reviewed verbatim semantic pins from MODULE_DEPENDENCY_MATRIX.md §5.1–§5.6 (KH-034). */
  readonly pinnedRequiredPreconditions: string;
  readonly pinnedActivationCondition: string;
  readonly pinnedContractOwner: string;
  readonly pinnedStatus: string;
  readonly pinnedHasDeferredBoundary: boolean;
  readonly scenarioLabel: LocalizedText;
  readonly specificPreconditionLabel: LocalizedText;
  readonly requiredPlatformKeys: readonly (keyof PlatformPrerequisiteState)[];
  readonly deferredNote?: LocalizedText;
}

/**
 * Executable evaluation bindings explicitly linked 1:1 to the 6 authoritative
 * CoreCicContract records in MODULE_DEPENDENCY_MATRIX.md §5.1–§5.6.
 * Never duplicates or replaces contract metadata; validated at runtime by
 * validateSimulatorCatalogConsistency().
 */
const CIC_EXECUTABLE_SPECS: Readonly<Record<string, CicExecutableSpec>> = {
  'CIC-CORE-INV-FIN-001': {
    contractId: 'CIC-CORE-INV-FIN-001',
    expectedSourceModuleId: 'inventory-warehouse',
    expectedTargetModuleId: 'finance',
    pinnedRequiredPreconditions:
      'الوحدتان Active؛ CIC مفعّل؛ Integration Framework متاح؛ الحركة داخلة في سيناريو مالي معتمد',
    pinnedActivationCondition:
      'Inventory + Finance + السيناريو المالي المشترك + العقد مفعّلة',
    pinnedContractOwner: 'TBD — Integration Governance / Phase 5',
    pinnedStatus:
      '✅ Approved Conceptual CIC; Costing/Valuation mechanics deferred',
    pinnedHasDeferredBoundary: true,
    scenarioLabel: {
      ar: 'الأثر المالي لحركات المخزون (Inventory → Finance)',
      en: 'Financial effect of inventory movement (Inventory → Finance)',
    },
    specificPreconditionLabel: {
      ar: 'الحركة داخلة في سيناريو مالي معتمد وإطار التكامل متاح',
      en: 'Movement belongs to an approved financial scenario & Integration Framework available',
    },
    requiredPlatformKeys: ['mandatoryPlatformCore'],
    deferredNote: {
      ar: 'آليات التكلفة والتقييم (Costing/Valuation) مؤجلة للمرحلة 5/6 ومالك العقد TBD (المرحلة 5).',
      en: 'Costing/Valuation mechanics are deferred to Phase 5/6 and Contract Owner is TBD (Phase 5).',
    },
  },
  'CIC-CORE-PROC-INV-001': {
    contractId: 'CIC-CORE-PROC-INV-001',
    expectedSourceModuleId: 'procurement',
    expectedTargetModuleId: 'inventory-warehouse',
    pinnedRequiredPreconditions:
      'Procurement + Inventory Active؛ PO صالح كسياق للاستلام؛ Storage Context متاح؛ CIC مفعّل',
    pinnedActivationCondition: 'Stock Purchase / Receipt scenario مفعّل',
    pinnedContractOwner: 'TBD — Integration Governance / Phase 5',
    pinnedStatus:
      '✅ Approved Conceptual CIC; Receiving orchestration details deferred',
    pinnedHasDeferredBoundary: true,
    scenarioLabel: {
      ar: 'الاستلام المخزني مقابل أمر الشراء (Procurement → Inventory)',
      en: 'Receipt against PO / Stock Purchase receipt (Procurement → Inventory)',
    },
    specificPreconditionLabel: {
      ar: 'أمر الشراء (PO) صالح كسياق للاستلام وسياق التخزين (Storage Context) متاح',
      en: 'Valid PO receiving context & Inventory Storage Context available',
    },
    requiredPlatformKeys: ['mandatoryPlatformCore', 'inventoryStorageContext'],
    deferredNote: {
      ar: 'تفاصيل تنسيق الاستلام (Receiving Orchestration) مؤجلة للمرحلة 6 ومالك العقد TBD (المرحلة 5).',
      en: 'Receiving orchestration details are deferred to Phase 6 and Contract Owner is TBD (Phase 5).',
    },
  },
  'CIC-CORE-PROC-FIN-001': {
    contractId: 'CIC-CORE-PROC-FIN-001',
    expectedSourceModuleId: 'procurement',
    expectedTargetModuleId: 'finance',
    pinnedRequiredPreconditions:
      'Procurement + Finance Active؛ Shared Party context متاح؛ CIC مفعّل؛ السيناريو يحتاج Finance',
    pinnedActivationCondition: 'Financial Procurement scenario مفعّل',
    pinnedContractOwner: 'TBD — Integration Governance / Phase 5',
    pinnedStatus:
      '✅ Approved Conceptual CIC; Invoice Matching ownership/orchestration deferred',
    pinnedHasDeferredBoundary: true,
    scenarioLabel: {
      ar: 'فاتورة المورد والذمم الدائنة والأثر المالي (Procurement → Finance)',
      en: 'Supplier Invoice / AP / financial effect (Procurement → Finance)',
    },
    specificPreconditionLabel: {
      ar: 'سياق الطرف المشترك (Shared Party) متاح والسيناريو الشرائي يتطلب معالجة Finance',
      en: 'Shared Party context available & procurement scenario requires Finance handling',
    },
    requiredPlatformKeys: ['mandatoryPlatformCore', 'sharedPartyIdentity'],
    deferredNote: {
      ar: 'ملكية وتنسيق Invoice Matching مؤجلان للمرحلة 5/6 ومالك العقد TBD (المرحلة 5).',
      en: 'Invoice Matching ownership/orchestration are deferred to Phase 5/6 and Contract Owner is TBD (Phase 5).',
    },
  },
  'CIC-CORE-SALES-INV-001': {
    contractId: 'CIC-CORE-SALES-INV-001',
    expectedSourceModuleId: 'sales-order-management',
    expectedTargetModuleId: 'inventory-warehouse',
    pinnedRequiredPreconditions:
      'Sales + Inventory Active؛ Product له Inventory Context مناسب؛ CIC مفعّل',
    pinnedActivationCondition: 'Stock Sale / Stock Fulfillment feature مفعّلة',
    pinnedContractOwner: 'TBD — Integration Governance / Phase 5',
    pinnedStatus:
      '✅ Approved Conceptual CIC; reservation algorithms/shipment orchestration deferred',
    pinnedHasDeferredBoundary: true,
    scenarioLabel: {
      ar: 'تنفيذ المخزون والتوفر والحجز والصرف (Sales → Inventory)',
      en: 'Stock Fulfillment: availability, reservation, and goods issue (Sales → Inventory)',
    },
    specificPreconditionLabel: {
      ar: 'الصنف يمتلك سياقًا مخزنيًا مناسبًا (Product Inventory Context)',
      en: 'Product has a suitable Inventory Context (Product/UOM + Storage context)',
    },
    requiredPlatformKeys: [
      'mandatoryPlatformCore',
      'sharedProductAndUom',
      'inventoryStorageContext',
    ],
    deferredNote: {
      ar: 'خوارزميات الحجز وتنسيق الشحن مؤجلة للمرحلة 6 ومالك العقد TBD (المرحلة 5).',
      en: 'Reservation algorithms and shipment orchestration are deferred to Phase 6 and Contract Owner is TBD (Phase 5).',
    },
  },
  'CIC-CORE-SALES-FIN-001': {
    contractId: 'CIC-CORE-SALES-FIN-001',
    expectedSourceModuleId: 'sales-order-management',
    expectedTargetModuleId: 'finance',
    pinnedRequiredPreconditions:
      'Sales + Finance Active؛ financial/billing feature/scenario active؛ CIC مفعّل',
    pinnedActivationCondition: 'Customer Billing/Financial Sales scenario مفعّل',
    pinnedContractOwner: 'TBD — Integration Governance / Phase 5',
    pinnedStatus:
      '✅ Approved Conceptual CIC; Customer Invoice Generation Boundary deferred',
    pinnedHasDeferredBoundary: true,
    scenarioLabel: {
      ar: 'فوترة العميل والذمم المدينة والإيراد والتحصيل (Sales → Finance)',
      en: 'Customer Billing / AR / Revenue / Payment flow (Sales → Finance)',
    },
    specificPreconditionLabel: {
      ar: 'ميزة/سيناريو الفوترة والمبيعات المالية نشط مع توفر سياق العميل والعملة',
      en: 'Financial/billing sales feature/scenario active with Shared Party & Currency foundation',
    },
    requiredPlatformKeys: [
      'mandatoryPlatformCore',
      'sharedPartyIdentity',
      'currencyFoundation',
    ],
    deferredNote: {
      ar: 'حدود توليد فاتورة العميل (Customer Invoice Generation Boundary) مؤجلة للمرحلة 5/6 ومالك العقد TBD (المرحلة 5).',
      en: 'Customer Invoice Generation Boundary is deferred to Phase 5/6 and Contract Owner is TBD (Phase 5).',
    },
  },
  'CIC-CORE-SALES-PROC-001': {
    contractId: 'CIC-CORE-SALES-PROC-001',
    expectedSourceModuleId: 'sales-order-management',
    expectedTargetModuleId: 'procurement',
    pinnedRequiredPreconditions:
      'Sales + Procurement Active؛ feature/scenario configured؛ CIC مفعّل',
    pinnedActivationCondition:
      'Drop Ship / Direct Delivery / Back-to-Back feature مفعّلة',
    pinnedContractOwner: 'TBD — Integration Governance / Phase 5',
    pinnedStatus: '✅ Approved Conceptual CIC',
    pinnedHasDeferredBoundary: false,
    scenarioLabel: {
      ar: 'الشحن المباشر / التوريد الخلفي (Drop Ship / Direct Delivery / Back-to-Back)',
      en: 'Drop Ship / Direct Delivery / Back-to-Back (Sales → Procurement)',
    },
    specificPreconditionLabel: {
      ar: 'ميزة/سيناريو Drop Ship أو Back-to-Back مُعدّة ومفعّلة وإطار التكامل متاح',
      en: 'Drop Ship / Direct Delivery / Back-to-Back feature/scenario configured & Integration Framework available',
    },
    requiredPlatformKeys: ['mandatoryPlatformCore'],
    deferredNote: {
      ar: 'مالك العقد ما يزال TBD (Integration Governance / المرحلة 5) وتفاصيل التنفيذ الوظيفي للمرحلة 6.',
      en: 'Contract Owner remains TBD (Integration Governance / Phase 5) and functional execution details belong to Phase 6.',
    },
  },
};

interface FldExecutableSpec {
  /** Knowledge Hub internal row reference ID (KH-032). */
  readonly id: string;
  readonly expectedSourceModuleId: CoreModuleId;
  readonly expectedTargetModules: readonly CoreModuleId[];
  readonly expectedOwnerDeferred: boolean;
  /** Reviewed verbatim semantic pins from MODULE_DEPENDENCY_MATRIX.md §6 (KH-034). */
  readonly pinnedSourceModuleFeature: string;
  readonly pinnedTargetModuleCapability: string;
  readonly pinnedFeatureScenario: string;
  readonly pinnedFeatureOwner: string;
  readonly pinnedStatus: string;
  readonly featureLabel: LocalizedText;
  readonly conditionalPlatformKeys: readonly (keyof PlatformPrerequisiteState)[];
  readonly linkedCicIds: readonly string[];
  readonly deferredNote?: LocalizedText;
}

/**
 * Executable evaluation bindings explicitly linked 1:1 to the 5 authoritative
 * CoreFldRecord entries extracted from MODULE_DEPENDENCY_MATRIX.md §6.
 */
const FLD_EXECUTABLE_SPECS: Readonly<Record<string, FldExecutableSpec>> = {
  'FLD-CORE-01': {
    id: 'FLD-CORE-01',
    expectedSourceModuleId: 'sales-order-management',
    expectedTargetModules: ['inventory-warehouse'],
    expectedOwnerDeferred: false,
    pinnedSourceModuleFeature: 'Sales / Stock Sale / Stock Fulfillment',
    pinnedTargetModuleCapability: 'Inventory',
    pinnedFeatureScenario: 'بيع صنف مخزني مع fulfillment',
    pinnedFeatureOwner: 'Sales',
    pinnedStatus: '✅ Approved',
    featureLabel: {
      ar: 'Sales · بيع المخزون وتنفيذه (Stock Sale / Stock Fulfillment)',
      en: 'Sales · Stock Sale / Stock Fulfillment',
    },
    conditionalPlatformKeys: ['inventoryStorageContext'],
    linkedCicIds: ['CIC-CORE-SALES-INV-001'],
  },
  'FLD-CORE-02': {
    id: 'FLD-CORE-02',
    expectedSourceModuleId: 'sales-order-management',
    expectedTargetModules: ['finance'],
    expectedOwnerDeferred: false,
    pinnedSourceModuleFeature: 'Sales / Customer Billing',
    pinnedTargetModuleCapability: 'Finance',
    pinnedFeatureScenario: 'Billing/AR/financial sales flow',
    pinnedFeatureOwner: 'Sales',
    pinnedStatus: '✅ Approved; invoice generation boundary deferred',
    featureLabel: {
      ar: 'Sales · فوترة العميل (Customer Billing)',
      en: 'Sales · Customer Billing',
    },
    conditionalPlatformKeys: [],
    linkedCicIds: ['CIC-CORE-SALES-FIN-001'],
    deferredNote: {
      ar: 'حدود توليد فاتورة العميل (Invoice Generation Boundary) مؤجلة للمرحلة 5/6 ولا يجوز افتراض اكتمال السلوك الوظيفي.',
      en: 'Customer Invoice Generation Boundary is deferred to Phase 5/6; full functional billing behavior is not yet specified.',
    },
  },
  'FLD-CORE-03': {
    id: 'FLD-CORE-03',
    expectedSourceModuleId: 'sales-order-management',
    expectedTargetModules: ['procurement'],
    expectedOwnerDeferred: false,
    pinnedSourceModuleFeature:
      'Sales / Drop Ship / Direct Delivery / Back-to-Back',
    pinnedTargetModuleCapability: 'Procurement',
    pinnedFeatureScenario: 'Supplier fulfillment initiated from Sales',
    pinnedFeatureOwner: 'Sales',
    pinnedStatus: '✅ Approved',
    featureLabel: {
      ar: 'Sales · الشحن المباشر / التوريد الخلفي (Drop Ship / Back-to-Back)',
      en: 'Sales · Drop Ship / Direct Delivery / Back-to-Back',
    },
    conditionalPlatformKeys: [],
    linkedCicIds: ['CIC-CORE-SALES-PROC-001'],
  },
  'FLD-CORE-04': {
    id: 'FLD-CORE-04',
    expectedSourceModuleId: 'procurement',
    expectedTargetModules: ['inventory-warehouse'],
    expectedOwnerDeferred: false,
    pinnedSourceModuleFeature: 'Procurement / Stock Purchase',
    pinnedTargetModuleCapability: 'Inventory',
    pinnedFeatureScenario: 'Procurement line/scenario requires stock receipt',
    pinnedFeatureOwner: 'Procurement',
    pinnedStatus: '✅ Approved',
    featureLabel: {
      ar: 'Procurement · شراء الأصناف المخزنية (Stock Purchase)',
      en: 'Procurement · Stock Purchase',
    },
    conditionalPlatformKeys: ['sharedProductAndUom', 'inventoryStorageContext'],
    linkedCicIds: ['CIC-CORE-PROC-INV-001'],
  },
  'FLD-CORE-05': {
    id: 'FLD-CORE-05',
    expectedSourceModuleId: 'procurement',
    expectedTargetModules: ['inventory-warehouse', 'finance'],
    expectedOwnerDeferred: true,
    pinnedSourceModuleFeature: 'Procurement / Three-Way Match',
    pinnedTargetModuleCapability: 'Inventory Receipt capability + Finance',
    pinnedFeatureScenario: 'PO + Receipt + Financial Invoice matching',
    pinnedFeatureOwner: 'Deferred',
    pinnedStatus:
      '✅ Approved as Feature-Level Dependency class; Invoice Matching ownership deferred',
    featureLabel: {
      ar: 'Procurement · المطابقة الثلاثية (Three-Way Match · المالك مؤجل)',
      en: 'Procurement · Three-Way Match (Feature Owner: Deferred)',
    },
    conditionalPlatformKeys: ['inventoryStorageContext'],
    linkedCicIds: ['CIC-CORE-PROC-INV-001', 'CIC-CORE-PROC-FIN-001'],
    deferredNote: {
      ar: 'ملكية الميزة وتنسيق Invoice Matching مؤجلان صراحةً (Feature Owner: Deferred — MODULE_DEPENDENCY_MATRIX.md §6).',
      en: 'Feature ownership and Invoice Matching orchestration are explicitly deferred (Feature Owner: Deferred — MODULE_DEPENDENCY_MATRIX.md §6).',
    },
  },
};

function getPcdCellForModule(row: PcdMatrixRow, moduleId: CoreModuleId): string {
  switch (moduleId) {
    case 'finance':
      return row.finance;
    case 'inventory-warehouse':
      return row.inventory;
    case 'procurement':
      return row.procurement;
    case 'sales-order-management':
      return row.sales;
  }
}

function isRequiredPcdCell(cellValue: string): boolean {
  return /^R(\b|\s|—|-)/i.test(cellValue.trim());
}

function getPlatformToggleKeyForCapability(
  capability: string
): keyof PlatformPrerequisiteState | null {
  const entries = Object.entries(PCD_TOGGLE_CAPABILITY_BINDINGS) as [
    keyof PlatformPrerequisiteState,
    readonly string[],
  ][];
  for (const [key, capabilities] of entries) {
    if (capabilities.includes(capability)) {
      return key;
    }
  }
  return null;
}

function getPlatformKeyLabel(key: keyof PlatformPrerequisiteState): string {
  switch (key) {
    case 'mandatoryPlatformCore':
      return 'Integration / API Framework & Mandatory Platform Core';
    case 'sharedPartyIdentity':
      return 'Shared Party Identity';
    case 'sharedProductAndUom':
      return 'Shared Product / Item / Service Identity + UOM Foundation';
    case 'inventoryStorageContext':
      return 'Inventory Storage / Fulfillment Context';
    case 'fiscalCalendar':
      return 'Fiscal Calendar / Accounting Period';
    case 'currencyFoundation':
      return 'Currency Foundation';
  }
}

function normalizeSemanticField(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

/**
 * Explicitly validates 1:1 structural AND semantic consistency between the
 * authoritative extracted DependencySimulationCatalog and the simulator's
 * pinned executable bindings (FIX-01-R01 + KH-034 / FIX-02-R06).
 *
 * Throws loudly (fail-closed) on:
 * - HBMD invariant violation
 * - Duplicate CIC, FLD, or PCD identifiers
 * - Source revision or canonical body SHA-256 drift vs SIMULATOR_PINNED_SOURCE
 * - Missing/extra CIC or FLD catalog records or endpoint mismatch
 * - Semantic drift in CIC preconditions, activation condition, owner, status, or deferred boundary
 * - Semantic drift in FLD feature, target capability, scenario, owner, deferred status, or status
 * - Any Required ('R') PCD row lacking an executable toggle binding (never silently ignored)
 * - PCD classification drift (R / C / C* / —) across any module column
 */
export function validateSimulatorCatalogConsistency(
  catalog: DependencySimulationCatalog
): CatalogConsistencySummary {
  if (catalog.hbmdEdgeCount !== 0 || catalog.hbmdCycleCount !== 0) {
    throw new Error(
      `Simulator catalog invariant violation: expected 0 Core HBMD edges and 0 cycles, got hbmdEdgeCount=${catalog.hbmdEdgeCount}, hbmdCycleCount=${catalog.hbmdCycleCount}.`
    );
  }

  // 1. Source revision & canonical stored-body SHA-256 pin check across all governing documents (KH-034 + KH-036)
  if (catalog.sourceRevision !== SIMULATOR_PINNED_SOURCE.mappedSourceRevision) {
    throw new Error(
      `Simulator source revision drift (KH-034): executable mappings are pinned to "${SIMULATOR_PINNED_SOURCE.mappedSourceRevision}", received "${catalog.sourceRevision ?? 'null'}". Review and re-pin simulator mappings before enabling.`
    );
  }
  if (
    catalog.sourceBodySha256 !== SIMULATOR_PINNED_SOURCE.mappedSourceBodySha256
  ) {
    throw new Error(
      `Simulator source body digest drift (KH-034): executable mappings are pinned to SHA-256 "${SIMULATOR_PINNED_SOURCE.mappedSourceBodySha256}", received "${catalog.sourceBodySha256}". Review MODULE_DEPENDENCY_MATRIX.md changes before re-pinning.`
    );
  }

  const pinnedSources: SimulatorGoverningSourceSnapshot[] = [];
  for (const key of [
    'moduleDependencyMatrix',
    'dependencyModel',
    'moduleLifecycleRules',
  ] as const) {
    const pin = SIMULATOR_PINNED_GOVERNING_SOURCES[key];
    const snap = catalog.governingSources?.[key];
    if (!snap) {
      throw new Error(
        `Simulator governing source snapshot missing (KH-036): expected pin for "${pin.officialSourcePath}".`
      );
    }
    if (snap.sourceRevision !== pin.mappedSourceRevision) {
      throw new Error(
        `Simulator governing source revision drift (KH-036) for "${pin.officialSourcePath}": executable mappings are pinned to "${pin.mappedSourceRevision}", received "${snap.sourceRevision ?? 'null'}".`
      );
    }
    if (snap.sourceBodySha256 !== pin.mappedSourceBodySha256) {
      throw new Error(
        `Simulator governing source body digest drift (KH-036) for "${pin.officialSourcePath}": executable mappings are pinned to SHA-256 "${pin.mappedSourceBodySha256}", received "${snap.sourceBodySha256}".`
      );
    }
    pinnedSources.push(snap);
  }

  // 2. Identifier uniqueness validation across CICs, FLDs, and PCD rows (KH-034)
  const seenCicIds = new Set<string>();
  for (const cic of catalog.coreCics) {
    if (seenCicIds.has(cic.contractId)) {
      throw new Error(
        `Simulator duplicate CIC identifier detected: "${cic.contractId}".`
      );
    }
    seenCicIds.add(cic.contractId);
  }

  const seenFldIds = new Set<string>();
  for (const fld of catalog.coreFlds) {
    if (seenFldIds.has(fld.id)) {
      throw new Error(
        `Simulator duplicate FLD identifier detected: "${fld.id}".`
      );
    }
    seenFldIds.add(fld.id);
  }

  const seenPcdCapabilities = new Set<string>();
  for (const row of catalog.pcdMatrix) {
    if (seenPcdCapabilities.has(row.capability)) {
      throw new Error(
        `Simulator duplicate PCD capability identifier detected: "${row.capability}".`
      );
    }
    seenPcdCapabilities.add(row.capability);
  }

  // 3. Exact CIC catalog membership, endpoints, and semantic pinning
  const expectedCicIds = Object.keys(CIC_EXECUTABLE_SPECS);
  if (catalog.coreCics.length !== expectedCicIds.length) {
    throw new Error(
      `Simulator CIC catalog drift: expected ${expectedCicIds.length} Core CICs, received ${catalog.coreCics.length}.`
    );
  }

  for (const cic of catalog.coreCics) {
    const spec = CIC_EXECUTABLE_SPECS[cic.contractId];
    if (!spec) {
      throw new Error(
        `Simulator CIC mapping missing for authoritative contractId "${cic.contractId}".`
      );
    }
    if (
      cic.sourceModuleId !== spec.expectedSourceModuleId ||
      cic.targetModuleId !== spec.expectedTargetModuleId
    ) {
      throw new Error(
        `Simulator CIC endpoint mismatch for "${cic.contractId}": authoritative=(${cic.sourceModuleId}->${cic.targetModuleId}), mapping=(${spec.expectedSourceModuleId}->${spec.expectedTargetModuleId}).`
      );
    }
    if (
      normalizeSemanticField(cic.metadata.requiredPreconditions) !==
      normalizeSemanticField(spec.pinnedRequiredPreconditions)
    ) {
      throw new Error(
        `Simulator CIC semantic drift (Required Preconditions) for "${cic.contractId}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(cic.metadata.activationCondition) !==
      normalizeSemanticField(spec.pinnedActivationCondition)
    ) {
      throw new Error(
        `Simulator CIC semantic drift (Activation Condition) for "${cic.contractId}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(cic.metadata.contractOwner) !==
      normalizeSemanticField(spec.pinnedContractOwner)
    ) {
      throw new Error(
        `Simulator CIC semantic drift (Contract Owner) for "${cic.contractId}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(cic.metadata.status) !==
      normalizeSemanticField(spec.pinnedStatus)
    ) {
      throw new Error(
        `Simulator CIC semantic drift (Status) for "${cic.contractId}": source changed relative to reviewed mapping.`
      );
    }
    if (cic.hasDeferredBoundary !== spec.pinnedHasDeferredBoundary) {
      throw new Error(
        `Simulator CIC semantic drift (Deferred Boundary) for "${cic.contractId}": authoritative=${cic.hasDeferredBoundary}, pinned=${spec.pinnedHasDeferredBoundary}.`
      );
    }
  }

  // 4. Exact FLD catalog membership, targets, deferred ownership, and semantic pinning
  const expectedFldIds = Object.keys(FLD_EXECUTABLE_SPECS);
  if (catalog.coreFlds.length !== expectedFldIds.length) {
    throw new Error(
      `Simulator FLD catalog drift: expected ${expectedFldIds.length} Core FLDs, received ${catalog.coreFlds.length}.`
    );
  }

  for (const fld of catalog.coreFlds) {
    const spec = FLD_EXECUTABLE_SPECS[fld.id];
    if (!spec) {
      throw new Error(
        `Simulator FLD mapping missing for authoritative record "${fld.id}".`
      );
    }
    if (fld.sourceModuleId !== spec.expectedSourceModuleId) {
      throw new Error(
        `Simulator FLD source mismatch for "${fld.id}": authoritative="${fld.sourceModuleId}", mapping="${spec.expectedSourceModuleId}".`
      );
    }
    const authTargets = [...fld.requiredTargetModules].sort().join(',');
    const specTargets = [...spec.expectedTargetModules].sort().join(',');
    if (authTargets !== specTargets) {
      throw new Error(
        `Simulator FLD required targets mismatch for "${fld.id}": authoritative=[${authTargets}], mapping=[${specTargets}].`
      );
    }
    if (fld.isOwnerDeferred !== spec.expectedOwnerDeferred) {
      throw new Error(
        `Simulator FLD deferred-owner mismatch for "${fld.id}": authoritative=${fld.isOwnerDeferred}, mapping=${spec.expectedOwnerDeferred}.`
      );
    }
    if (
      normalizeSemanticField(fld.sourceModuleFeature) !==
      normalizeSemanticField(spec.pinnedSourceModuleFeature)
    ) {
      throw new Error(
        `Simulator FLD semantic drift (Source Module / Feature) for "${fld.id}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(fld.targetModuleCapability) !==
      normalizeSemanticField(spec.pinnedTargetModuleCapability)
    ) {
      throw new Error(
        `Simulator FLD semantic drift (Target Capability) for "${fld.id}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(fld.featureScenario) !==
      normalizeSemanticField(spec.pinnedFeatureScenario)
    ) {
      throw new Error(
        `Simulator FLD semantic drift (Feature Scenario) for "${fld.id}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(fld.featureOwner) !==
      normalizeSemanticField(spec.pinnedFeatureOwner)
    ) {
      throw new Error(
        `Simulator FLD semantic drift (Feature Owner) for "${fld.id}": source changed relative to reviewed mapping.`
      );
    }
    if (
      normalizeSemanticField(fld.status) !==
      normalizeSemanticField(spec.pinnedStatus)
    ) {
      throw new Error(
        `Simulator FLD semantic drift (Status) for "${fld.id}": source changed relative to reviewed mapping.`
      );
    }
    for (const linkedCicId of spec.linkedCicIds) {
      if (!seenCicIds.has(linkedCicId)) {
        throw new Error(
          `Simulator FLD "${fld.id}" references unknown linked CIC "${linkedCicId}".`
        );
      }
    }
  }

  // 5. PCD bindings exist in authoritative matrix
  for (const [toggleKey, capabilities] of Object.entries(
    PCD_TOGGLE_CAPABILITY_BINDINGS
  )) {
    for (const cap of capabilities) {
      if (!seenPcdCapabilities.has(cap)) {
        throw new Error(
          `Simulator PCD mapping "${toggleKey}" references capability "${cap}" not found in authoritative PCD Matrix.`
        );
      }
    }
  }

  // 6. Never silently ignore any Required ('R') PCD lacking an executable toggle binding (KH-034)
  for (const row of catalog.pcdMatrix) {
    const requiredModules = CORE_MODULE_IDS.filter((moduleId) =>
      isRequiredPcdCell(getPcdCellForModule(row, moduleId))
    );
    if (requiredModules.length > 0) {
      const toggleKey = getPlatformToggleKeyForCapability(row.capability);
      if (!toggleKey) {
        throw new Error(
          `Simulator PCD executable mapping missing for required capability "${row.capability}" (required by: ${requiredModules.join(', ')}). Newly required PCDs must not be silently ignored.`
        );
      }
    }
  }

  // 7. Exact PCD Matrix classification pinning across all 21 capabilities (R / C / C* / —)
  const expectedPcdCapabilities = Object.keys(PINNED_PCD_MATRIX_CLASSIFICATIONS);
  if (catalog.pcdMatrix.length !== expectedPcdCapabilities.length) {
    throw new Error(
      `Simulator PCD catalog drift: expected ${expectedPcdCapabilities.length} PCD rows, received ${catalog.pcdMatrix.length}.`
    );
  }

  for (const row of catalog.pcdMatrix) {
    const pinned = PINNED_PCD_MATRIX_CLASSIFICATIONS[row.capability];
    if (!pinned) {
      throw new Error(
        `Simulator PCD classification drift: unexpected capability "${row.capability}" not present in reviewed PCD Matrix baseline.`
      );
    }
    if (
      normalizeSemanticField(row.finance) !== normalizeSemanticField(pinned.finance) ||
      normalizeSemanticField(row.inventory) !== normalizeSemanticField(pinned.inventory) ||
      normalizeSemanticField(row.procurement) !== normalizeSemanticField(pinned.procurement) ||
      normalizeSemanticField(row.sales) !== normalizeSemanticField(pinned.sales)
    ) {
      throw new Error(
        `Simulator PCD classification drift for "${row.capability}": authoritative=(fin:${row.finance}, inv:${row.inventory}, proc:${row.procurement}, sales:${row.sales}), pinned=(fin:${pinned.finance}, inv:${pinned.inventory}, proc:${pinned.procurement}, sales:${pinned.sales}).`
      );
    }
  }

  return {
    valid: true,
    sourceRevision: catalog.sourceRevision,
    sourceBodySha256: catalog.sourceBodySha256,
    pinnedSources,
    mappingFreshnessStatus: 'verified-current',
    cicCount: catalog.coreCics.length,
    fldCount: catalog.coreFlds.length,
    pcdRowCount: catalog.pcdMatrix.length,
    hbmdEdgeCount: 0,
  };
}

/**
 * Evaluates Required PCDs directly from the authoritative extracted 21-row
 * PCD Matrix (MODULE_DEPENDENCY_MATRIX.md §7.2).
 */
function getMissingRequiredPcdsFromMatrix(
  moduleId: CoreModuleId,
  pcdMatrix: readonly PcdMatrixRow[],
  platform: PlatformPrerequisiteState
): readonly string[] {
  const missing: string[] = [];
  for (const row of pcdMatrix) {
    const cell = getPcdCellForModule(row, moduleId);
    if (!isRequiredPcdCell(cell)) {
      continue;
    }
    const toggleKey = getPlatformToggleKeyForCapability(row.capability);
    if (!toggleKey) {
      throw new Error(
        `Simulator PCD executable mapping missing for required capability "${row.capability}" on module "${moduleId}".`
      );
    }
    if (!platform[toggleKey]) {
      missing.push(row.capability);
    }
  }
  return missing;
}

function formatCicStatusLabel(status: CicReadinessStatus): LocalizedText {
  switch (status) {
    case 'participating-modules-unavailable':
      return {
        ar: 'الأنظمة المشاركة غير متاحة',
        en: 'Participating Modules Unavailable',
      };
    case 'contract-or-scenario-not-enabled':
      return {
        ar: 'العقد أو السيناريو غير مفعّل',
        en: 'Contract or Scenario Not Enabled',
      };
    case 'contract-prerequisites-not-satisfied':
      return {
        ar: 'متطلبات العقد غير مستوفاة',
        en: 'Contract Prerequisites Not Satisfied',
      };
    case 'readiness-not-established-insufficient-info':
      return {
        ar: 'الجاهزية غير مُثبتة (شروط غير محددة / مؤجلة)',
        en: 'Readiness Not Established (Insufficient / Deferred Info)',
      };
    case 'evaluated-conceptual-prerequisites-satisfied':
      return {
        ar: 'المتطلبات المفاهيمية المُقيَّمة مستوفاة (نطاق تعليمي فقط)',
        en: 'Evaluated Conceptual Prerequisites Satisfied (Scope-Limited)',
      };
  }
}

function formatFldStatusLabel(status: FldEvaluationStatus): LocalizedText {
  switch (status) {
    case 'source-module-inactive':
      return {
        ar: 'النظام المصدر غير مفعّل',
        en: 'Source Module Inactive',
      };
    case 'required-modules-unavailable':
      return {
        ar: 'أنظمة الاعتمادية المطلوبة غير متاحة (FLD)',
        en: 'Required FLD Modules Unavailable',
      };
    case 'dependency-prerequisites-not-satisfied':
      return {
        ar: 'متطلبات اعتمادية الميزة غير مستوفاة',
        en: 'Feature Dependency Prerequisites Not Satisfied',
      };
    case 'feature-not-configured-or-disabled':
      return {
        ar: 'الميزة غير مُهيّأة أو معطّلة',
        en: 'Feature Not Configured / Disabled',
      };
    case 'readiness-not-established-insufficient-info':
      return {
        ar: 'جاهزية الميزة غير مُثبتة (معلومات غير محددة / حدود مؤجلة)',
        en: 'Feature Readiness Not Established (Insufficient / Deferred)',
      };
    case 'evaluated-prerequisites-satisfied-functional-unspecified':
      return {
        ar: 'المتطلبات المُقيَّمة مستوفاة (السلوك الوظيفي غير محدد في المرحلة 2)',
        en: 'Evaluated Prerequisites Satisfied (Functional Behavior Unspecified)',
      };
  }
}

function evaluateCicContract(
  cic: CoreCicContract,
  activeSet: ReadonlySet<CoreModuleId>,
  platform: PlatformPrerequisiteState,
  controls: EducationalConditionControls,
  catalog: DependencySimulationCatalog
): SimulatedCicOutcome {
  const spec = CIC_EXECUTABLE_SPECS[cic.contractId];
  const override = controls.cicOverrides?.[cic.contractId];

  const srcActive = activeSet.has(cic.sourceModuleId);
  const tgtActive = activeSet.has(cic.targetModuleId);
  const participatingModulesAvailable = srcActive && tgtActive;

  const modulePrerequisiteStatus: CicModulePrerequisiteStatus =
    participatingModulesAvailable
      ? 'architectural-module-prerequisites-satisfied'
      : 'participating-modules-unavailable';

  const contractEnabledState: ConditionEvalState =
    override?.contractEnabled ?? controls.defaultCicContractEnabled;
  const scenarioEnabledState: ConditionEvalState =
    override?.scenarioEnabled ?? controls.defaultCicScenarioEnabled;
  const specificPreconditionsState: ConditionEvalState =
    override?.specificPreconditions ?? controls.defaultCicSpecificPreconditions;

  const missingContractPcds = spec.requiredPlatformKeys
    .filter((key) => !platform[key])
    .map((key) => getPlatformKeyLabel(key));

  const hasTbdContractOwner = /TBD/i.test(cic.metadata.contractOwner);
  const unresolvedDeferredReasons: LocalizedText[] = [];

  if (hasTbdContractOwner) {
    unresolvedDeferredReasons.push({
      ar: `مالك العقد غير محسوم بعد (${cic.metadata.contractOwner}).`,
      en: `Contract Owner is unresolved (${cic.metadata.contractOwner}).`,
    });
  }
  if (cic.hasDeferredBoundary && spec.deferredNote) {
    unresolvedDeferredReasons.push(spec.deferredNote);
  }
  if (contractEnabledState === 'unknown') {
    unresolvedDeferredReasons.push({
      ar: 'حالة تفعيل العقد (CIC Enabled) غير محددة في مدخلات المحاكاة.',
      en: 'CIC contract enablement state is unspecified (Unknown) in simulation inputs.',
    });
  }
  if (scenarioEnabledState === 'unknown') {
    unresolvedDeferredReasons.push({
      ar: 'حالة تفعيل السيناريو/الميزة المشتركة غير محددة في مدخلات المحاكاة.',
      en: 'Shared business scenario/feature enablement state is unspecified (Unknown).',
    });
  }
  if (specificPreconditionsState === 'unknown') {
    unresolvedDeferredReasons.push({
      ar: 'حالة استيفاء المتطلبات الخاصة بالعقد غير محددة في مدخلات المحاكاة.',
      en: 'Contract-specific precondition satisfaction state is unspecified (Unknown).',
    });
  }

  let readinessStatus: CicReadinessStatus;
  let reason: LocalizedText;

  if (!participatingModulesAvailable) {
    readinessStatus = 'participating-modules-unavailable';
    reason =
      !srcActive && !tgtActive
        ? {
            ar: 'الأنظمة المشاركة غير متاحة — كلا طرفي العقد غير مفعّل حاليًا؛ لا يخلق ذلك أي HBMD.',
            en: 'Participating modules unavailable — neither module is active; this never creates an HBMD.',
          }
        : {
            ar: 'أحد طرفي العقد غير مفعّل — يتوقف السيناريو المشترك فقط ولا يمنع التفعيل المستقل للطرف النشط (MODULE_LIFECYCLE_RULES.md §6).',
            en: 'One participating module is inactive — only the shared scenario is unavailable; standalone activation of the active module is unaffected (MODULE_LIFECYCLE_RULES.md §6).',
          };
  } else if (
    contractEnabledState === 'unsatisfied' ||
    scenarioEnabledState === 'unsatisfied'
  ) {
    readinessStatus = 'contract-or-scenario-not-enabled';
    if (
      contractEnabledState === 'unsatisfied' &&
      scenarioEnabledState === 'unsatisfied'
    ) {
      reason = {
        ar: 'تفعيل الوحدتين المشاركتين مستوفٍ معماريًا، لكن كلاً من العقد (CIC) والسيناريو المشترك المطلوب غير مفعّلين — لذلك العقد غير جاهز (MODULE_LIFECYCLE_RULES.md §6).',
        en: 'Participating module prerequisites are met, but both the CIC contract and the required business scenario are disabled — CIC is not ready (MODULE_LIFECYCLE_RULES.md §6).',
      };
    } else if (contractEnabledState === 'unsatisfied') {
      reason = {
        ar: 'تفعيل الوحدتين المشاركتين مستوفٍ معماريًا، لكن العقد (CIC) نفسه غير مفعّل ضمن حوكمة التكامل — مجرد تفعيل الوحدتين لا يكفي للجاهزية (MODULE_LIFECYCLE_RULES.md §6).',
        en: 'Participating module prerequisites are met, but the CIC contract itself is disabled under Integration Governance — active modules alone never make a CIC ready (MODULE_LIFECYCLE_RULES.md §6).',
      };
    } else {
      reason = {
        ar: `تفعيل الوحدتين والعقد مستوفٍ، لكن شرط التفعيل/السيناريو المطلوب غير مفعّل (${cic.metadata.activationCondition}).`,
        en: `Participating modules are active, but the required business scenario/feature is not enabled (${cic.metadata.activationCondition}).`,
      };
    }
  } else if (
    missingContractPcds.length > 0 ||
    specificPreconditionsState === 'unsatisfied'
  ) {
    readinessStatus = 'contract-prerequisites-not-satisfied';
    const partsAr: string[] = [];
    const partsEn: string[] = [];
    if (missingContractPcds.length > 0) {
      partsAr.push(`قدرات المنصة اللازمة للعقد غير متوفرة: ${missingContractPcds.join('، ')}`);
      partsEn.push(`Required platform context unavailable: ${missingContractPcds.join(', ')}`);
    }
    if (specificPreconditionsState === 'unsatisfied') {
      partsAr.push(`الشرط الخاص بالعقد غير مستوفٍ: ${spec.specificPreconditionLabel.ar}`);
      partsEn.push(`Contract-specific precondition unmet: ${spec.specificPreconditionLabel.en}`);
    }
    reason = {
      ar: `الوحدتان المشاركتان مفعّلتان، لكن متطلبات العقد الخاصة غير مستوفاة — ${partsAr.join('؛ ')}.`,
      en: `Participating modules are active, but contract-specific preconditions are not satisfied — ${partsEn.join('; ')}.`,
    };
  } else if (
    contractEnabledState === 'unknown' ||
    scenarioEnabledState === 'unknown' ||
    specificPreconditionsState === 'unknown' ||
    (controls.treatDeferredBoundariesAsUnresolved &&
      (cic.hasDeferredBoundary || hasTbdContractOwner))
  ) {
    readinessStatus = 'readiness-not-established-insufficient-info';
    const hasUnknownInput =
      contractEnabledState === 'unknown' ||
      scenarioEnabledState === 'unknown' ||
      specificPreconditionsState === 'unknown';
    reason = hasUnknownInput
      ? {
          ar: 'الوحدتان المشاركتان مفعّلتان (المتطلب المعماري للوحدات مستوفٍ)، لكن الجاهزية التشغيلية للعقد غير مُثبتة لوجود شروط تفعيل/سيناريو/متطلبات خاصة غير محددة أو مؤجلة للمرحلة 5/6.',
          en: 'Participating module prerequisites are satisfied, but CIC readiness is not established because contract/scenario/specific preconditions remain unspecified (Unknown) or deferred to Phase 5/6.',
        }
      : {
          ar: 'الوحدتان المشاركتان وشروط المحاكاة المُقيَّمة مستوفاة، لكن الجاهزية الكاملة غير مُثبتة بسبب حدود وحوكمة مؤجلة رسميًا (Contract Owner: TBD — المرحلة 5 وتفاصيل المرحلة 6).',
          en: 'Participating modules and evaluated inputs are satisfied, but complete runtime readiness is not established due to officially deferred governance and functional boundaries (Contract Owner: TBD — Phase 5; functional/transport details deferred to Phase 5/6).',
        };
  } else {
    readinessStatus = 'evaluated-conceptual-prerequisites-satisfied';
    reason = {
      ar: 'استُوفيت المتطلبات المفاهيمية المُقيَّمة في هذه المحاكاة التعليمية فقط (الوحدتان + العقد + السيناريو + الشروط الخاصة) — ولا يُعد ذلك إثباتًا للجاهزية التشغيلية أو التقنية الكاملة المؤجلة للمرحلة 5/6.',
      en: 'Evaluated conceptual prerequisites are satisfied within this educational scope only (participating modules + contract + scenario + contract-specific preconditions) — NOT full operational or technical runtime readiness, which remains deferred to Phase 5/6.',
    };
  }

  return {
    contractId: cic.contractId,
    identifierScope: 'official-erp',
    sourceModuleId: cic.sourceModuleId,
    targetModuleId: cic.targetModuleId,
    scenario: spec.scenarioLabel,
    modulePrerequisiteStatus,
    readinessStatus,
    participatingModulesAvailable,
    contractEnabledState,
    scenarioEnabledState,
    specificPreconditionLabel: spec.specificPreconditionLabel,
    specificPreconditionsState,
    missingContractPcds,
    hasUnresolvedOrDeferredConditions:
      unresolvedDeferredReasons.length > 0 || cic.hasDeferredBoundary || hasTbdContractOwner,
    unresolvedDeferredReasons,
    fullRuntimeReadinessEstablished: false,
    statusLabel: formatCicStatusLabel(readinessStatus),
    reason,
    deferredBoundaryNote: spec.deferredNote,
    sourceRef: {
      documentSlug: catalog.documentSlug,
      officialSourcePath: catalog.officialSourcePath,
      sectionAnchor: cic.sectionAnchor,
      evidence: cic.evidence,
      requiredPreconditionsVerbatim: cic.metadata.requiredPreconditions,
      activationConditionVerbatim: cic.metadata.activationCondition,
      contractOwner: cic.metadata.contractOwner,
      statusVerbatim: cic.metadata.status,
      lifecycleRuleRef: 'MODULE_LIFECYCLE_RULES.md §6',
    },
  };
}

function evaluateFldRecord(
  fld: CoreFldRecord,
  activeSet: ReadonlySet<CoreModuleId>,
  platform: PlatformPrerequisiteState,
  controls: EducationalConditionControls,
  cicOutcomeById: ReadonlyMap<string, SimulatedCicOutcome>,
  catalog: DependencySimulationCatalog
): SimulatedFldOutcome {
  const spec = FLD_EXECUTABLE_SPECS[fld.id];
  const sourceActive = activeSet.has(fld.sourceModuleId);
  const missingModules = fld.requiredTargetModules.filter(
    (req) => !activeSet.has(req)
  );
  const requiredModulesAvailable = sourceActive && missingModules.length === 0;

  const missingConditionalPcds = spec.conditionalPlatformKeys
    .filter((key) => !platform[key])
    .map((key) => getPlatformKeyLabel(key));

  const linkedCics = spec.linkedCicIds
    .map((id) => cicOutcomeById.get(id))
    .filter((c): c is SimulatedCicOutcome => Boolean(c));

  const hasBlockedLinkedCic = linkedCics.some(
    (c) =>
      c.readinessStatus === 'participating-modules-unavailable' ||
      c.readinessStatus === 'contract-or-scenario-not-enabled' ||
      c.readinessStatus === 'contract-prerequisites-not-satisfied'
  );
  const hasUnresolvedLinkedCic = linkedCics.some(
    (c) => c.readinessStatus === 'readiness-not-established-insufficient-info'
  );

  const featureConfiguredState: ConditionEvalState =
    controls.fldOverrides?.[fld.id] ?? controls.defaultFldConfigured;

  const hasDeferredBoundary =
    fld.isOwnerDeferred || /deferred/i.test(fld.status);

  const featureDependencyPrerequisitesSatisfied =
    requiredModulesAvailable &&
    missingConditionalPcds.length === 0 &&
    !hasBlockedLinkedCic &&
    !hasUnresolvedLinkedCic;

  let status: FldEvaluationStatus;
  let reason: LocalizedText;

  if (!sourceActive) {
    status = 'source-module-inactive';
    reason = {
      ar: 'النظام المصدر للميزة غير مفعّل في هذا السيناريو.',
      en: 'Source module owning this feature is inactive in this scenario.',
    };
  } else if (missingModules.length > 0) {
    status = 'required-modules-unavailable';
    reason = {
      ar: `المتطلب المعماري للأنظمة غير مستوفٍ (FLD) لغياب: ${missingModules.join(', ')} — تتعطل هذه الميزة فقط بينما يبقى النظام المصدر Active بالكامل (MODULE_LIFECYCLE_RULES.md §5).`,
      en: `Required FLD target module(s) unavailable: ${missingModules.join(', ')} — only this feature is constrained while the base source module remains fully Active (MODULE_LIFECYCLE_RULES.md §5).`,
    };
  } else if (missingConditionalPcds.length > 0 || hasBlockedLinkedCic) {
    status = 'dependency-prerequisites-not-satisfied';
    const reasonsAr: string[] = [];
    const reasonsEn: string[] = [];
    if (missingConditionalPcds.length > 0) {
      reasonsAr.push(
        `قدرات المنصة الشرطية (PCD: Conditional) غير متوفرة: ${missingConditionalPcds.join('، ')}`
      );
      reasonsEn.push(
        `Conditionally Required PCD(s) missing: ${missingConditionalPcds.join(', ')}`
      );
    }
    if (hasBlockedLinkedCic) {
      reasonsAr.push(
        `عقد التكامل المرتبط (${spec.linkedCicIds.join(', ')}) غير مستوفي الشروط أو معطّل`
      );
      reasonsEn.push(
        `Linked CIC (${spec.linkedCicIds.join(', ')}) has disabled or unsatisfied preconditions`
      );
    }
    reason = {
      ar: `الأنظمة المطلوبة للميزة مفعّلة، لكن متطلبات اعتمادية الميزة غير مستوفاة — ${reasonsAr.join('؛ ')} (MODULE_LIFECYCLE_RULES.md §5).`,
      en: `Required modules are active, but feature dependency prerequisites are not satisfied — ${reasonsEn.join('; ')} (MODULE_LIFECYCLE_RULES.md §5).`,
    };
  } else if (featureConfiguredState === 'unsatisfied') {
    status = 'feature-not-configured-or-disabled';
    reason = {
      ar: 'الأنظمة المطلوبة مفعّلة ولا يوجد عائق في الاعتماديات المُقيَّمة، لكن الميزة نفسها غير مُهيّأة أو معطّلة في مدخلات المحاكاة.',
      en: 'Required modules are active and evaluated dependency checks are not failing, but the feature itself is disabled or unconfigured in simulation inputs.',
    };
  } else if (
    featureConfiguredState === 'unknown' ||
    hasUnresolvedLinkedCic ||
    (controls.treatDeferredBoundariesAsUnresolved && hasDeferredBoundary)
  ) {
    status = 'readiness-not-established-insufficient-info';
    reason = {
      ar: `الأنظمة المطلوبة للـ FLD مفعّلة، لكن جاهزية الميزة غير مُثبتة لعدم تحديد تهيئة الميزة أو وجود عقد CIC مرتبط غير محسوم أو حدود ملكية/وظيفية مؤجلة (السلوك الوظيفي الكامل غير محدد قبل المرحلة 6).`,
      en: `Required FLD modules are active, but feature readiness is not established due to unspecified feature configuration, unresolved linked CIC readiness, or deferred ownership/functional boundaries (full functional behavior is not specified until Phase 6).`,
    };
  } else {
    status = 'evaluated-prerequisites-satisfied-functional-unspecified';
    reason = {
      ar: 'الأنظمة المطلوبة + متطلبات FLD المُقيَّمة + تهيئة الميزة التعليمية مستوفاة — مع بقاء السلوك الوظيفي الكامل وتفاصيل التنفيذ غير محددة ومؤجلة للمرحلة 6.',
      en: 'Required modules, evaluated FLD dependency prerequisites, and educational feature configuration are satisfied — while full functional behavior and implementation blueprints remain unspecified in Phase 2 (Phase 6 scope).',
    };
  }

  return {
    id: fld.id,
    identifierScope: 'knowledge-hub-internal',
    sourceModuleId: fld.sourceModuleId,
    featureLabel: spec.featureLabel,
    sourceModuleFeatureVerbatim: fld.sourceModuleFeature,
    targetModuleCapabilityVerbatim: fld.targetModuleCapability,
    requiredModules: fld.requiredTargetModules,
    missingModules,
    missingConditionalPcds,
    linkedCicIds: spec.linkedCicIds,
    requiredModulesAvailable,
    featureDependencyPrerequisitesSatisfied,
    featureConfiguredState,
    fullFunctionalBehaviorSpecified: false,
    status,
    statusLabel: formatFldStatusLabel(status),
    reason,
    isOwnerDeferred: fld.isOwnerDeferred,
    hasDeferredBoundary,
    deferredNote: spec.deferredNote,
    sourceRef: {
      documentSlug: catalog.documentSlug,
      officialSourcePath: catalog.officialSourcePath,
      sectionAnchor: 'fld-register',
      evidence: fld.evidence,
      featureOwner: fld.featureOwner,
      statusVerbatim: fld.status,
      lifecycleRuleRef: 'MODULE_LIFECYCLE_RULES.md §5',
    },
  };
}

/**
 * Pure, deterministic, source-backed educational simulator for all 16 combinations
 * of the 4 Core Business Modules + official PCD Matrix + CIC & FLD rules.
 *
 * Authoritative sources:
 * - MODULE_DEPENDENCY_MATRIX.md (§4, §5.1–§5.6, §6, §7.2)
 * - MODULE_LIFECYCLE_RULES.md (§4, §5, §6)
 * - DEPENDENCY_MODEL.md
 */
export function simulateModuleActivation(
  input: ModuleActivationSimulatorInput
): ModuleActivationSimulationResult {
  const catalogValidation = validateSimulatorCatalogConsistency(input.catalog);

  const controls: EducationalConditionControls = {
    ...DEFAULT_EDUCATIONAL_CONTROLS,
    ...input.controls,
    cicOverrides: input.controls?.cicOverrides,
    fldOverrides: input.controls?.fldOverrides,
  };

  const moduleOutcomes: SimulatedModuleOutcome[] = CORE_MODULE_IDS.map(
    (moduleId) => {
      const selected = Boolean(input.selectedModules[moduleId]);
      if (!selected) {
        return {
          moduleId,
          selected: false,
          canActivateBaseWithinEvaluatedScope: false,
          status: 'not-selected',
          missingRequiredPcds: [],
          hbmdBlockers: [],
          explanation: {
            ar: 'النظام غير محدد للتفعيل في هذا السيناريو.',
            en: 'Module is not selected for activation in this scenario.',
          },
        };
      }

      const missingRequiredPcds = getMissingRequiredPcdsFromMatrix(
        moduleId,
        input.catalog.pcdMatrix,
        input.platform
      );
      const canActivateBase = missingRequiredPcds.length === 0;

      return {
        moduleId,
        selected: true,
        canActivateBaseWithinEvaluatedScope: canActivateBase,
        status: canActivateBase
          ? 'base-activatable-within-evaluated-scope'
          : 'blocked-by-required-pcd',
        missingRequiredPcds,
        hbmdBlockers: [],
        explanation: canActivateBase
          ? {
              ar: 'قابل للتفعيل الأساسي المستقل ضمن الشروط المُقيَّمة (PCD Required متوفرة و0 HBMD) — شروط Entitlement وPhase 3 Context وMinimum Config خارج نطاق المحاكي.',
              en: 'Base-activatable independently within evaluated scope (Required PCDs met & 0 HBMD) — Entitlement, Phase 3 Context, Runtime Security, and Minimum Config remain outside simulator scope.',
            }
          : {
              ar: `التفعيل الأساسي محجوب بسبب نقص قدرات المنصة الإلزامية (PCD: Required) من المصفوفة الرسمية: ${missingRequiredPcds.join('، ')} — وليس بسبب أي نظام أعمال آخر (HBMD = 0).`,
              en: `Base activation blocked by missing Required PCD(s) from the official PCD Matrix: ${missingRequiredPcds.join(', ')} — NOT by another Business Module (HBMD = 0).`,
            },
      };
    }
  );

  const activeSet = new Set<CoreModuleId>(
    moduleOutcomes
      .filter((m) => m.canActivateBaseWithinEvaluatedScope)
      .map((m) => m.moduleId)
  );

  const cicOutcomes: SimulatedCicOutcome[] = input.catalog.coreCics.map((cic) =>
    evaluateCicContract(cic, activeSet, input.platform, controls, input.catalog)
  );

  const cicOutcomeById = new Map<string, SimulatedCicOutcome>(
    cicOutcomes.map((c) => [c.contractId, c])
  );

  const fldOutcomes: SimulatedFldOutcome[] = input.catalog.coreFlds.map((fld) =>
    evaluateFldRecord(
      fld,
      activeSet,
      input.platform,
      controls,
      cicOutcomeById,
      input.catalog
    )
  );

  const cicSummary: CicStatusSummary = {
    total: cicOutcomes.length,
    participatingModulesUnavailable: cicOutcomes.filter(
      (c) => c.readinessStatus === 'participating-modules-unavailable'
    ).length,
    architecturalModulePrereqsSatisfied: cicOutcomes.filter(
      (c) =>
        c.modulePrerequisiteStatus ===
        'architectural-module-prerequisites-satisfied'
    ).length,
    contractOrScenarioNotEnabled: cicOutcomes.filter(
      (c) => c.readinessStatus === 'contract-or-scenario-not-enabled'
    ).length,
    contractPrereqsNotSatisfied: cicOutcomes.filter(
      (c) => c.readinessStatus === 'contract-prerequisites-not-satisfied'
    ).length,
    readinessNotEstablished: cicOutcomes.filter(
      (c) =>
        c.readinessStatus === 'readiness-not-established-insufficient-info'
    ).length,
    evaluatedConceptualPrereqsSatisfied: cicOutcomes.filter(
      (c) =>
        c.readinessStatus === 'evaluated-conceptual-prerequisites-satisfied'
    ).length,
  };

  const fldSummary: FldStatusSummary = {
    total: fldOutcomes.length,
    sourceInactive: fldOutcomes.filter(
      (f) => f.status === 'source-module-inactive'
    ).length,
    requiredModulesUnavailable: fldOutcomes.filter(
      (f) => f.status === 'required-modules-unavailable'
    ).length,
    dependencyPrereqsNotSatisfied: fldOutcomes.filter(
      (f) => f.status === 'dependency-prerequisites-not-satisfied'
    ).length,
    featureDisabled: fldOutcomes.filter(
      (f) => f.status === 'feature-not-configured-or-disabled'
    ).length,
    readinessNotEstablished: fldOutcomes.filter(
      (f) => f.status === 'readiness-not-established-insufficient-info'
    ).length,
    evaluatedPrereqsSatisfiedFunctionalUnspecified: fldOutcomes.filter(
      (f) =>
        f.status === 'evaluated-prerequisites-satisfied-functional-unspecified'
    ).length,
  };

  const selectedCount = moduleOutcomes.filter((m) => m.selected).length;
  const activatableModulesCount = activeSet.size;

  const architecturalTakeaways: LocalizedText[] = [];
  if (selectedCount === 0) {
    architecturalTakeaways.push({
      ar: 'اختر نظامًا واحدًا أو أكثر لاختبار التفعيل المستقل (0 HBMD)، والفصل الصارم بين تفعيل الوحدات وجاهزية عقود CIC ومتطلبات ميزات FLD.',
      en: 'Select one or more Core Modules to test standalone base activation (0 HBMD) and the strict separation between active modules, CIC readiness, and FLD feature prerequisites.',
    });
  } else {
    architecturalTakeaways.push({
      ar: 'عدد الاعتماديات الصلبة المعتمدة (HBMD) = 0: عدم جاهزية أي CIC أو تقييد أي FLD لا يمنع التفعيل الأساسي للوحدات المختارة عند توفر PCD الإلزامية.',
      en: 'Approved Core HBMD count = 0: unready CICs or constrained FLDs never block base activation of selected modules once Required PCDs are available.',
    });
    if (cicSummary.architecturalModulePrereqsSatisfied > 0) {
      architecturalTakeaways.push({
        ar: `استوفى ${cicSummary.architecturalModulePrereqsSatisfied} من 6 عقود شرط تفعيل الوحدتين المشاركتين فقط — وتبقى جاهزية العقد التشغيلية مشروطة بتفعيل العقد والسيناريو والمتطلبات الخاصة وحوكمة المرحلة 5/6 (MODULE_LIFECYCLE_RULES.md §6).`,
        en: `${cicSummary.architecturalModulePrereqsSatisfied} of 6 Core CICs satisfy participating-module prerequisites — actual CIC readiness additionally requires contract enablement, scenario enablement, contract-specific preconditions, and deferred Phase 5/6 governance (MODULE_LIFECYCLE_RULES.md §6).`,
      });
    }
    if (
      activeSet.has('sales-order-management') &&
      !activeSet.has('inventory-warehouse')
    ) {
      architecturalTakeaways.push({
        ar: 'المبيعات تعمل منفردة لبيع الخدمات والبنود غير المخزنية (D-SALES-10)، بينما تتقيد ميزة Stock Sale فقط (FLD) دون تعطيل النظام الأساسي.',
        en: 'Sales operates standalone for Service/Non-stock sales (D-SALES-10); only the Stock Sale feature is constrained (FLD), never the base module.',
      });
    }
    if (activeSet.has('procurement') && !activeSet.has('finance')) {
      architecturalTakeaways.push({
        ar: 'المشتريات تدير أوامر الشراء والخدمات منفردة، بينما تتطلب فواتير الموردين وAP والسداد وجود Finance وعقد CIC-CORE-PROC-FIN-001 (D-PROC-05).',
        en: 'Procurement handles POs and services standalone, while Supplier Invoices, AP, and Payments require Finance and CIC-CORE-PROC-FIN-001 (D-PROC-05).',
      });
    }
    if (activeSet.has('inventory-warehouse') && !activeSet.has('finance')) {
      architecturalTakeaways.push({
        ar: 'المخزون يدير الأرصدة والحركات كميًا فقط بدون GL؛ وتُؤجل آلية Opening Valuation عند تفعيل المالية لاحقًا إلى المرحلة 6.',
        en: 'Inventory manages quantities and movements without GL; Opening Valuation upon later Finance activation is deferred to Phase 6.',
      });
    }
  }

  return {
    disclaimer: MODULE_ACTIVATION_SIMULATOR_DISCLAIMER,
    catalogValidation,
    activationScopeBoundary: BASE_ACTIVATION_SCOPE_BOUNDARY,
    selectedCount,
    activatableModulesCount,
    hbmdEdgeCount: 0,
    moduleOutcomes,
    cicOutcomes,
    cicSummary,
    fldOutcomes,
    fldSummary,
    architecturalTakeaways,
  };
}
