import type { IdentifierScope, LocalizedText } from '@/content/models/types';
import { createHeadingSlug, HEADING_ID_PREFIX } from '@/content/loaders/markdownPipeline';
import { computeCanonicalStoredBodySha256 } from '@/content/ingestion/ingestionPipeline';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import {
  MODULE_EDUCATIONAL_DEPTH_BUNDLES,
  type DecisionEducationalDetail,
  type ModuleAbsentPeerScenario,
  type ModuleBusinessProblemItem,
  type ModuleDeferredBoundaryRationale,
  type ModuleDesignReasoningEntry,
  type ModuleEducationalDepthBundle,
  type ModuleFutureDesignImpactItem,
  type ModuleOwnershipBoundaryRow,
  type ModulePurposeAndImpactProfile,
  type ModuleSourceAnchorRef,
} from '@/content/extractors/moduleEducationalContent';

export type {
  DecisionEducationalDetail,
  ModuleAbsentPeerScenario,
  ModuleBusinessProblemItem,
  ModuleDeferredBoundaryRationale,
  ModuleDesignReasoningEntry,
  ModuleEducationalDepthBundle,
  ModuleFutureDesignImpactItem,
  ModuleOwnershipBoundaryRow,
  ModulePurposeAndImpactProfile,
  ModuleSourceAnchorRef,
};

export type CoreModuleId =
  | 'finance'
  | 'inventory-warehouse'
  | 'procurement'
  | 'sales-order-management';

export type ModuleProjectionFreshnessStatus =
  | 'verified-current'
  | 'review-required-source-changed';

export interface CuratedModuleProjectionPin {
  readonly moduleId: CoreModuleId;
  readonly authoritativeDocumentSlug: string;
  readonly authoritativeSourcePath: string;
  readonly mappedSourceRevision: string;
  readonly mappedSourceBodySha256: string;
  readonly lastCuratedReviewDate: string;
}

export interface ModuleProjectionMetadata {
  readonly kind: 'curated-projection';
  readonly authoritativeDocumentId: string;
  readonly authoritativeDocumentSlug: string;
  readonly authoritativeSourcePath: string;
  readonly mappedSourceRevision: string;
  readonly actualSourceRevision: string | null;
  readonly mappedSourceBodySha256: string;
  readonly actualSourceBodySha256: string;
  readonly lastCuratedReviewDate: string;
  readonly mappingFreshnessStatus: ModuleProjectionFreshnessStatus;
  /** Fields authored as manually curated educational projections (must be reviewed when source changes). */
  readonly curatedFields: readonly string[];
  /** Fields deterministically extracted directly from the verbatim official Markdown body. */
  readonly deterministicFields: readonly string[];
  readonly projectionDisclosure: LocalizedText;
  readonly reviewWarning: LocalizedText | null;
}

/**
 * Authoritative source pins for the manually curated educational projections inside
 * CORE_MODULE_CONFIGS (KH-028 / FIX-02-R01).
 * Any revision or canonical stored-body SHA-256 drift in the backing official module
 * model flips `mappingFreshnessStatus` to `review-required-source-changed`.
 */
export const CURATED_MODULE_PROJECTION_PINS: Readonly<
  Record<CoreModuleId, CuratedModuleProjectionPin>
> = {
  finance: {
    moduleId: 'finance',
    authoritativeDocumentSlug: 'finance-module-model',
    authoritativeSourcePath:
      'teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '4638fa9334a96274a7c5ddf5ebbd2642ac435d84a00b6f1ff71877fa4399ad2b',
    lastCuratedReviewDate: '2026-11-26',
  },
  'inventory-warehouse': {
    moduleId: 'inventory-warehouse',
    authoritativeDocumentSlug: 'inventory-module-model',
    authoritativeSourcePath:
      'teranoo-erp-planning/03-modules/inventory/INVENTORY_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      'c28df337e23ca9cc1cb086e69b0e1a60de86a25ba55a31818881598630d66729',
    lastCuratedReviewDate: '2026-11-26',
  },
  procurement: {
    moduleId: 'procurement',
    authoritativeDocumentSlug: 'procurement-module-model',
    authoritativeSourcePath:
      'teranoo-erp-planning/03-modules/procurement/PROCUREMENT_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '89c207dd693b93fae802b1b55e8424e5bcae00c0b1b67a5c28ffe5507a7e46f9',
    lastCuratedReviewDate: '2026-11-26',
  },
  'sales-order-management': {
    moduleId: 'sales-order-management',
    authoritativeDocumentSlug: 'sales-order-management-module-model',
    authoritativeSourcePath:
      'teranoo-erp-planning/03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '331bcac1def77d6114e5114d25e6c22b80adabca2246e9c2a2ea21c4544528c1',
    lastCuratedReviewDate: '2026-11-26',
  },
};

export const CURATED_MODULE_PROJECTION_FIELDS: readonly string[] = [
  'identitySummary',
  'standaloneSummary',
  'criticalLimitation',
  'responsibilities',
  'standaloneCapabilities',
  'ownedDataDomains',
  'sharedReferencesConsumed',
  'relatedCicIds',
  'relatedFldLabels',
  'educationalComparisonRows',
  'purposeAndImpact',
  'designReasoning',
  'absentPeerScenarios',
  'ownershipBoundaryMatrix',
  'deferredBoundaryRationales',
  'decisions.educationalDetail',
];

export const DETERMINISTIC_MODULE_EXTRACTION_FIELDS: readonly string[] = [
  'decisions',
  'requiredPcds',
  'conditionalPcds',
  'explicitExclusions',
  'deferredDesignItems',
];

export interface Phase2SourceLocalDecision {
  readonly decisionId: string;
  readonly family: 'D-FIN' | 'D-INV' | 'D-PROC' | 'D-SALES';
  readonly title: string;
  readonly verbatimBody: string;
  readonly limitNote: string | null;
  readonly owningModuleId: CoreModuleId;
  readonly owningModuleLabel: LocalizedText;
  readonly owningDocumentId: string;
  readonly owningDocumentSlug: string;
  readonly owningDocumentPath: string;
  readonly sectionAnchor: string;
  readonly approvalStatus: 'approved';
  readonly phaseRef: 'phase-2';
  readonly scopeKind: 'phase-2-source-local';
  readonly educationalDetail: DecisionEducationalDetail;
}

export interface ModulePcdRequirement {
  readonly capability: string;
  readonly classification: string;
  readonly note: string;
  readonly kind: 'required' | 'conditional';
}

export interface ModuleLifecycleSectionSlot {
  readonly order: number;
  readonly key: string;
  readonly title: LocalizedText;
  readonly status: 'populated-phase-2' | 'future-phase';
  readonly targetPhase: string;
  readonly summary: LocalizedText;
}

export interface ModuleEducationalComparisonRow {
  readonly concept: LocalizedText;
  readonly owner: LocalizedText;
  readonly affectsOnHand: LocalizedText;
  readonly affectsGl: LocalizedText;
  readonly requiresModules: LocalizedText;
  readonly phase2BoundaryNote: LocalizedText;
}

export interface CoreModuleArchitecturalProfile {
  readonly id: CoreModuleId;
  /** Knowledge Hub internal display code (e.g. MOD-FIN); NOT an official ERP identifier (KH-032). */
  readonly code: string;
  readonly codeIdentifierScope: Extract<IdentifierScope, 'knowledge-hub-internal'>;
  readonly name: LocalizedText;
  readonly shortName: LocalizedText;
  readonly documentId: string;
  readonly documentSlug: string;
  readonly officialSourcePath: string;
  readonly researchDeferredPath: string;
  readonly phaseStatus: LocalizedText;
  readonly sourceDocumentDate: string | null;
  readonly projectionMetadata: ModuleProjectionMetadata;
  readonly identitySummary: LocalizedText;
  readonly standaloneSummary: LocalizedText;
  readonly criticalLimitation: LocalizedText;
  readonly responsibilities: readonly LocalizedText[];
  readonly standaloneCapabilities: readonly LocalizedText[];
  readonly ownedDataDomains: readonly LocalizedText[];
  readonly sharedReferencesConsumed: readonly LocalizedText[];
  readonly requiredPcds: readonly ModulePcdRequirement[];
  readonly conditionalPcds: readonly ModulePcdRequirement[];
  readonly hbmdCount: 0;
  readonly relatedCicIds: readonly string[];
  readonly relatedFldLabels: readonly string[];
  readonly explicitExclusions: readonly string[];
  readonly deferredDesignItems: readonly string[];
  readonly decisions: readonly Phase2SourceLocalDecision[];
  readonly educationalComparisonTitle?: LocalizedText;
  readonly educationalComparisonNote?: LocalizedText;
  readonly educationalComparisonRows?: readonly ModuleEducationalComparisonRow[];
  readonly purposeAndImpact: ModulePurposeAndImpactProfile;
  readonly designReasoning: readonly ModuleDesignReasoningEntry[];
  readonly absentPeerScenarios: readonly ModuleAbsentPeerScenario[];
  readonly ownershipBoundaryMatrix: readonly ModuleOwnershipBoundaryRow[];
  readonly deferredBoundaryRationales: readonly ModuleDeferredBoundaryRationale[];
  readonly lifecycleBlueprint: readonly ModuleLifecycleSectionSlot[];
}

export interface ExtractedCoreModulesCatalog {
  readonly modules: readonly CoreModuleArchitecturalProfile[];
  readonly allPhase2Decisions: readonly Phase2SourceLocalDecision[];
  readonly phase2DecisionCountByModule: Readonly<Record<CoreModuleId, number>>;
  readonly totalPhase2DecisionsCount: number;
  readonly anyProjectionRequiresReview: boolean;
}

interface CoreModuleStaticConfig {
  readonly id: CoreModuleId;
  readonly code: string;
  readonly family: 'D-FIN' | 'D-INV' | 'D-PROC' | 'D-SALES';
  readonly expectedDecisionCount: number;
  readonly documentSlug: string;
  readonly officialSourcePath: string;
  readonly researchDeferredPath: string;
  readonly name: LocalizedText;
  readonly shortName: LocalizedText;
  readonly phaseStatus: LocalizedText;
  readonly identitySummary: LocalizedText;
  readonly standaloneSummary: LocalizedText;
  readonly criticalLimitation: LocalizedText;
  readonly responsibilities: readonly LocalizedText[];
  readonly standaloneCapabilities: readonly LocalizedText[];
  readonly ownedDataDomains: readonly LocalizedText[];
  readonly sharedReferencesConsumed: readonly LocalizedText[];
  readonly relatedCicIds: readonly string[];
  readonly relatedFldLabels: readonly string[];
  readonly educationalComparisonTitle?: LocalizedText;
  readonly educationalComparisonNote?: LocalizedText;
  readonly educationalComparisonRows?: readonly ModuleEducationalComparisonRow[];
}

const REUSABLE_MODULE_LIFECYCLE_SECTIONS: readonly Omit<
  ModuleLifecycleSectionSlot,
  'summary'
>[] = [
  {
    order: 1,
    key: 'identity',
    title: { ar: '1. هوية النظام والغرض منه', en: '1. Module Identity & Purpose' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 2,
    key: 'boundaries',
    title: { ar: '2. الحدود المعمارية والاستبعادات', en: '2. Architectural Boundaries & Exclusions' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 3,
    key: 'standalone',
    title: { ar: '3. التشغيل المستقل (Standalone Capability)', en: '3. Standalone Capability & Limitations' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 4,
    key: 'pcd',
    title: { ar: '4. اعتماديات المنصة (PCD)', en: '4. Platform Capability Dependencies (PCD)' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 5,
    key: 'hbmd-cic-fld',
    title: { ar: '5. الاعتماديات البينية والعقود (HBMD / CIC / FLD)', en: '5. Cross-Module Dependencies (HBMD / CIC / FLD)' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 6,
    key: 'ownership',
    title: { ar: '6. ملكية البيانات ومصادر الحقيقة', en: '6. Data Ownership & Source of Truth' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 7,
    key: 'lifecycle',
    title: { ar: '7. قواعد التفعيل والتجميد (Lifecycle)', en: '7. Activation, Freeze & Deactivation Rules' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 8,
    key: 'decisions',
    title: { ar: '8. قرارات المرحلة 2 المعتمدة', en: '8. Approved Phase 2 Decisions' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2',
  },
  {
    order: 9,
    key: 'deferred',
    title: { ar: '9. التصميم والحدود المؤجلة', en: '9. Deferred Design & Open Boundaries' },
    status: 'populated-phase-2',
    targetPhase: 'Phase 2 → 5/6',
  },
  {
    order: 10,
    key: 'research',
    title: { ar: '10. الأبحاث والمقارنات المرجعية', en: '10. Research & Benchmark Evidence' },
    status: 'future-phase',
    targetPhase: 'Deferred Research Batch',
  },
  {
    order: 11,
    key: 'functional-blueprint',
    title: { ar: '11. المخطط الوظيفي التفصيلي', en: '11. Functional Blueprint' },
    status: 'future-phase',
    targetPhase: 'Phase 6 (Not Started)',
  },
  {
    order: 12,
    key: 'processes-workflows',
    title: { ar: '12. العمليات وسير العمل وقواعد الأعمال', en: '12. Business Processes, Workflows & Rules' },
    status: 'future-phase',
    targetPhase: 'Phase 6 (Not Started)',
  },
  {
    order: 13,
    key: 'screens-ux',
    title: { ar: '13. مواصفات الشاشات وتجربة المستخدم', en: '13. Screen Specifications & UX Flows' },
    status: 'future-phase',
    targetPhase: 'Phase 6+ / UI Design',
  },
  {
    order: 14,
    key: 'data-model-db',
    title: { ar: '14. نموذج البيانات وتصميم قواعد البيانات', en: '14. Logical & Physical Data Models' },
    status: 'future-phase',
    targetPhase: 'Engineering Phase (Post-Phase 12)',
  },
  {
    order: 15,
    key: 'api-contracts',
    title: { ar: '15. عقود الـ API والأحداث التشغيلية', en: '15. Runtime APIs & Event Payloads' },
    status: 'future-phase',
    targetPhase: 'Phase 6.5 / Engineering',
  },
  {
    order: 16,
    key: 'implementation',
    title: { ar: '16. دليل التنفيذ البرمجي وسجل التطوير', en: '16. Implementation Guides & Engineering Journal' },
    status: 'future-phase',
    targetPhase: 'Engineering Delivery',
  },
  {
    order: 17,
    key: 'testing-release',
    title: { ar: '17. خطط الاختبار ونتائج التحقق والإصدارات', en: '17. Test Specifications, Verification & Releases' },
    status: 'future-phase',
    targetPhase: 'Engineering QA & Release',
  },
];

const CORE_MODULE_CONFIGS: readonly CoreModuleStaticConfig[] = [
  {
    id: 'finance',
    code: 'MOD-FIN',
    family: 'D-FIN',
    expectedDecisionCount: 6,
    documentSlug: 'finance-module-model',
    officialSourcePath: 'teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md',
    researchDeferredPath:
      'teranoo-erp-planning/01-market-research/02-finance-module-architecture/02_FINANCE_MODULE_ARCHITECTURE_RESEARCH.md',
    name: {
      ar: 'المالية والمحاسبة',
      en: 'Finance & Accounting',
    },
    shortName: { ar: 'المالية', en: 'Finance' },
    phaseStatus: {
      ar: 'معتمد / المرحلة 2 مغلقة (6 قرارات D-FIN)',
      en: 'Approved / Phase 2 Closed (6 D-FIN decisions)',
    },
    identitySummary: {
      ar: 'أحد الأنظمة الأساسية الأربعة (First-Class Sellable Module) والمالك الحصري للترحيل إلى الأستاذ العام (Financial Ledger Posting) والأثر المالي النهائي في Teranoo ERP.',
      en: 'One of the four Core Business Modules (First-Class Sellable) and the exclusive owner of Financial Ledger Posting and final financial effect in Teranoo ERP.',
    },
    standaloneSummary: {
      ar: 'قادر على العمل بصورة مستقلة تمامًا (Standalone) لتشغيل المحاسبة الأساسية والأستاذ العام والقيود اليدوية والتقارير المالية والـ AP/AR والمدفوعات عند اعتمادها، دون الحاجة لتفعيل المخزون أو المشتريات أو المبيعات.',
      en: 'Fully standalone-capable for core accounting, general ledger, manual journals, financial reporting, and financial AP/AR/payment capabilities without requiring Inventory, Procurement, or Sales.',
    },
    criticalLimitation: {
      ar: 'المالية لا تملك الكميات الفعلية للمخزون ولا مستندات أوامر البيع أو أوامر الشراء، ولا تفرض تشغيلها المنفرد أتمتة مخزنية أو شرائية أو بيعية؛ الترحيل الآلي من العمليات الأخرى يتم فقط عبر عقود CIC عند تفعيل تلك الأنظمة.',
      en: 'Finance does not own physical stock quantities, Purchase Orders, or Sales Orders. Standalone Finance handles core financial accounting only; automated operational posting activates solely via approved CICs when operational modules are enabled.',
    },
    responsibilities: [
      {
        ar: 'ملكية الترحيل المحاسبي النهائي إلى الأستاذ العام (Financial Ledger Posting) وسلامة التوازن المالي.',
        en: 'Exclusive ownership of Financial Ledger Posting and general ledger accounting integrity.',
      },
      {
        ar: 'ملكية الذمم الدائنة والمدينة (AP / AR) والالتزامات المالية والمدفوعات والتحصيل المالي.',
        en: 'Ownership of Accounts Payable (AP), Accounts Receivable (AR), financial liabilities, payments, and collections.',
      },
      {
        ar: 'استقبال المراجع أو الأحداث من الأنظمة التشغيلية عبر عقود CIC معتمدة دون السماح بكتابة مباشرة على الأستاذ.',
        en: 'Consuming operational references/events via approved CICs while prohibiting direct GL writes from other modules.',
      },
      {
        ar: 'الحفاظ الكامل على السجل المالي التاريخي وفق قاعدة Freeze, not Delete بعد وجود قيود أو تاريخ مالي.',
        en: 'Preserving financial history strictly under Freeze, not Delete once postings or financial history exist.',
      },
    ],
    standaloneCapabilities: [
      {
        ar: 'تشغيل المحاسبة الأساسية والقيود المحاسبية اليدوية والتقارير المالية الأساسية فوق قدرات المنصة المطلوبة.',
        en: 'Running core accounting, manual journal entries, and foundational financial reports over required platform capabilities.',
      },
      {
        ar: 'العمل فوق التقويم المالي والعملة الأساسية وسياق الشركة/الكيان القانوني دون اعتماد صلب على أي وحدة تجارية أخرى.',
        en: 'Operating over Fiscal Calendar, Currency Foundation, and Company/Legal Entity Context with zero HBMD on other business modules.',
      },
      {
        ar: 'استهلاك Shared Party Identity عند الحاجة للتعامل مع أطراف مالية دون تكرار سجل أطراف معزول.',
        en: 'Consuming Shared Party Identity for financial counterparties without duplicating an isolated party master.',
      },
    ],
    ownedDataDomains: [
      { ar: 'الترحيل إلى الأستاذ العام (Financial Ledger Posting)', en: 'Financial Ledger Posting' },
      { ar: 'الذمم المدينة (Accounts Receivable)', en: 'Accounts Receivable (AR)' },
      { ar: 'الذمم الدائنة والتزامات الموردين (Accounts Payable / Supplier Liability)', en: 'Accounts Payable / Supplier Liability' },
      { ar: 'المدفوعات والتحصيل والسجلات المالية النهائية (Payment / Collection)', en: 'Payment / Collection & Final Financial Records' },
      { ar: 'السياق المالي للأطراف (Financial Customer/Supplier Context)', en: 'Financial Party Context (Customer & Supplier)' },
    ],
    sharedReferencesConsumed: [
      { ar: 'Shared Party Identity (عند الحاجة — PCD Conditional)', en: 'Shared Party Identity (Conditional PCD)' },
      { ar: 'Fiscal Calendar / Accounting Period (PCD Required)', en: 'Fiscal Calendar / Accounting Period (Required PCD)' },
      { ar: 'Currency Foundation (PCD Required) & Exchange Rates / Tax (Conditional)', en: 'Currency Foundation (Required) & Exchange Rates / Tax (Conditional)' },
      { ar: 'مراجع حركات المخزون وPO وSales Order كمستهلك مرجعي فقط عبر CIC', en: 'Inventory Movement, PO, and Sales Order references as reference consumer via CICs only' },
    ],
    relatedCicIds: [
      'CIC-CORE-INV-FIN-001',
      'CIC-CORE-PROC-FIN-001',
      'CIC-CORE-SALES-FIN-001',
    ],
    relatedFldLabels: [
      'Sales / Customer Billing → Finance (FLD)',
      'Procurement / Three-Way Match → Inventory Receipt + Finance (FLD)',
    ],
    educationalComparisonTitle: {
      ar: 'مقارنة معمارية: الترحيل المالي مقابل المستندات والحركات التشغيلية',
      en: 'Architectural Comparison: Financial Ledger Posting vs Operational Documents & Movements',
    },
    educationalComparisonNote: {
      ar: 'توضح هذه المقارنة الحدود المعتمدة في المرحلة 2 بين ملكية المالية وملكية الأنظمة التشغيلية الأربعة.',
      en: 'Clarifies approved Phase 2 ownership boundaries between Finance and operational core modules.',
    },
    educationalComparisonRows: [
      {
        concept: { ar: 'القيد والترحيل في الأستاذ العام (GL Posting)', en: 'Financial Ledger Posting (GL)' },
        owner: { ar: 'المالية (Finance)', en: 'Finance' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'نعم — المالك الحصري', en: 'Yes — Exclusive Owner' },
        requiresModules: { ar: 'Finance فقط (Standalone)', en: 'Finance only (Standalone)' },
        phase2BoundaryNote: {
          ar: 'D-FIN-04: لا يُسمح لأي وحدة أخرى بالكتابة المباشرة إلى الأستاذ العام.',
          en: 'D-FIN-04: No other module may write directly to the General Ledger.',
        },
      },
      {
        concept: { ar: 'حركة مخزنية ذات أثر مالي (Inventory Financial Effect)', en: 'Financially Relevant Inventory Movement' },
        owner: { ar: 'الحركة: المخزون · القيد المالي: المالية', en: 'Movement: Inventory · Ledger Posting: Finance' },
        affectsOnHand: { ar: 'نعم (في المخزون)', en: 'Yes (in Inventory)' },
        affectsGl: { ar: 'نعم (عبر CIC-CORE-INV-FIN-001)', en: 'Yes (via CIC-CORE-INV-FIN-001)' },
        requiresModules: { ar: 'Inventory + Finance', en: 'Inventory + Finance' },
        phase2BoundaryNote: {
          ar: 'تقييم المخزون وطرق التكلفة (FIFO/AVCO) وآلية الترحيل مؤجلة للمرحلة 5/6.',
          en: 'Costing/valuation mechanics and accounting event timing deferred to Phase 5/6.',
        },
      },
      {
        concept: { ar: 'فاتورة المورد / الذمم الدائنة / السداد', en: 'Supplier Invoice / AP / Payment' },
        owner: { ar: 'المالية (Finance)', en: 'Finance' },
        affectsOnHand: { ar: 'لا مباشرةً', en: 'Not directly' },
        affectsGl: { ar: 'نعم (في المالية)', en: 'Yes (in Finance)' },
        requiresModules: { ar: 'Finance (+ Procurement عند الشراء)', en: 'Finance (+ Procurement for PO flow)' },
        phase2BoundaryNote: {
          ar: 'حدود ملكية وتنسيق مطابقة الفواتير (Invoice Matching) مؤجلة للمرحلة 5/6.',
          en: 'Invoice Matching ownership/orchestration explicitly deferred to Phase 5/6.',
        },
      },
      {
        concept: { ar: 'فوترة العميل / الذمم المدينة / الإيراد', en: 'Customer Billing / AR / Revenue' },
        owner: { ar: 'AR/الإيراد: المالية · توليد فاتورة العميل: حد مؤجل', en: 'AR/Revenue: Finance · Invoice Generation: Deferred Boundary' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'نعم (في المالية عبر CIC-CORE-SALES-FIN-001)', en: 'Yes (in Finance via CIC-CORE-SALES-FIN-001)' },
        requiresModules: { ar: 'Finance (+ Sales لسيناريو البيع)', en: 'Finance (+ Sales for sales billing)' },
        phase2BoundaryNote: {
          ar: 'Customer Invoice Generation Object مسجل صراحةً كـ Deferred Boundary.',
          en: 'Customer Invoice Generation Object is explicitly recorded as a Deferred Boundary.',
        },
      },
    ],
  },
  {
    id: 'inventory-warehouse',
    code: 'MOD-INV',
    family: 'D-INV',
    expectedDecisionCount: 8,
    documentSlug: 'inventory-module-model',
    officialSourcePath: 'teranoo-erp-planning/03-modules/inventory/INVENTORY_MODULE_MODEL.md',
    researchDeferredPath:
      'teranoo-erp-planning/01-market-research/03-inventory-module-architecture/02_INVENTORY_MODULE_ARCHITECTURE_RESEARCH.md',
    name: {
      ar: 'المخزون والمستودعات',
      en: 'Inventory & Warehouse Management',
    },
    shortName: { ar: 'المخزون', en: 'Inventory' },
    phaseStatus: {
      ar: 'معتمد / المرحلة 2 مغلقة (8 قرارات D-INV)',
      en: 'Approved / Phase 2 Closed (8 D-INV decisions)',
    },
    identitySummary: {
      ar: 'أحد الأنظمة الأساسية الأربعة (First-Class Sellable Module) والمالك الحصري للكمية الفعلية (On-hand Quantity) والحركات المخزنية (Inventory Movements) وسجل الحجز المخزني (Reservation Record — متزامن مع D-SALES-06).',
      en: 'One of the four Core Business Modules (First-Class Sellable) and the exclusive owner of On-hand Quantity, Inventory Movements, and Reservation Records (synced with D-SALES-06).',
    },
    standaloneSummary: {
      ar: 'يعمل بصورة مستقلة لتتبع الكميات والأرصدة والحركات المخزنية والاستلام والصرف والتحويل والجرد فوق Shared Product / Item Master وUOM Foundation وInventory Storage Context دون اشتراط المالية أو المشتريات أو المبيعات.',
      en: 'Standalone-capable for quantity tracking, stock movements, receipts, issues, transfers, and stocktaking over Shared Product/Item Master, UOM Foundation, and Inventory Storage Context without requiring Finance, Procurement, or Sales.',
    },
    criticalLimitation: {
      ar: 'المخزون يعمل كميًا ومستودعيًا عند تشغيله منفردًا؛ لا يرحّل مباشرةً إلى الأستاذ العام (GL) ولا يملك أوامر البيع أو أوامر الشراء، بينما تظل آليات التقييم والتكلفة (Costing/Valuation) والرصيد الافتتاحي المالي عند تفعيل المالية لاحقًا مؤجلة للمرحلة 5/6.',
      en: 'Standalone Inventory is quantity/warehouse operational only: it never posts directly to GL and never owns Sales Orders or Purchase Orders. Costing/Valuation mechanics and Opening Valuation when Finance is activated later are deferred to Phase 5/6.',
    },
    responsibilities: [
      {
        ar: 'ملكية الكميات المتوفرة فعليًا (On-hand Quantity) والحركات المخزنية (Inventory Movements).',
        en: 'Exclusive ownership of On-hand Quantity and Inventory Movements.',
      },
      {
        ar: 'ملكية سجل الحجز المخزني (Reservation Record) وفق مزامنة Phase 2 Assumption Safety مع D-SALES-06.',
        en: 'Ownership of Reservation Records per Phase 2 Assumption Safety sync with D-SALES-06.',
      },
      {
        ar: 'إدارة السياق التشغيلي للتخزين والحركة مع استهلاك Shared Product / Item Identity دون احتكارها.',
        en: 'Managing operational inventory storage/movement contexts while consuming Shared Product/Item Identity without monopolizing it.',
      },
      {
        ar: 'توفير الأثر الكمي والمستودعي عبر CIC عند الاستلام مقابل PO أو الصرف لطلبات البيع أو الأثر المالي للمحاسبة.',
        en: 'Executing physical stock effects via CICs for PO receipts, sales fulfillment, and financial movement reporting.',
      },
    ],
    standaloneCapabilities: [
      {
        ar: 'تتبع الأرصدة والحركات المخزنية داخل المستودعات والمواقع التشغيلية بصورة مستقلة.',
        en: 'Tracking stock balances and physical movements across storage contexts independently.',
      },
      {
        ar: 'العمل فوق Shared Product/Item Master وUOM Foundation وInventory Storage Context (PCD Required).',
        en: 'Operating over Shared Product/Item Master, UOM Foundation, and Inventory Storage Context (Required PCDs).',
      },
      {
        ar: 'عدم اشتراط تفعيل المالية أو المبيعات أو المشتريات لتشغيل الوظيفة المخزنية الأساسية.',
        en: 'Zero hard dependency on Finance, Sales, or Procurement for core inventory operations.',
      },
    ],
    ownedDataDomains: [
      { ar: 'الكمية المتوفرة فعليًا (On-hand Quantity)', en: 'On-hand Quantity' },
      { ar: 'الحركات المخزنية (Inventory Movements)', en: 'Inventory Movements' },
      { ar: 'سجل الحجز المخزني (Reservation Record — محسوم عبر D-SALES-06)', en: 'Reservation Record (resolved via D-SALES-06)' },
      { ar: 'السياق التشغيلي للمنتج داخل المخزون (Inventory Item Context)', en: 'Inventory Operational Item Context' },
    ],
    sharedReferencesConsumed: [
      { ar: 'Shared Product / Item Identity (PCD Required — ملكية منصة مشتركة)', en: 'Shared Product / Item Identity (Required PCD — Shared Platform)' },
      { ar: 'UOM Foundation (PCD Required)', en: 'UOM Foundation (Required PCD)' },
      { ar: 'Inventory Storage / Fulfillment Context (PCD Required)', en: 'Inventory Storage / Fulfillment Context (Required PCD)' },
      { ar: 'مراجع PO وSales Order كمستهلك مرجعي فقط عبر CICs', en: 'PO and Sales Order references as reference consumer via CICs only' },
    ],
    relatedCicIds: [
      'CIC-CORE-INV-FIN-001',
      'CIC-CORE-PROC-INV-001',
      'CIC-CORE-SALES-INV-001',
    ],
    relatedFldLabels: [
      'Sales / Stock Sale & Stock Fulfillment → Inventory (FLD)',
      'Procurement / Stock Purchase → Inventory (FLD)',
      'Procurement / Three-Way Match → Inventory Receipt + Finance (FLD)',
    ],
    educationalComparisonTitle: {
      ar: 'مقارنة معمارية: الكمية المطلوبة مقابل الحجز مقابل الرصيد الفعلي مقابل القيد المالي',
      en: 'Architectural Comparison: Ordered Quantity vs Reservation vs On-Hand vs Ledger Posting',
    },
    educationalComparisonNote: {
      ar: 'توضيح الفصل الصارم بين ملكية Sales وProcurement وInventory وFinance على نفس السلعة المخزنية.',
      en: 'Clarifies strict domain separation across Sales, Procurement, Inventory, and Finance for the same stock item.',
    },
    educationalComparisonRows: [
      {
        concept: { ar: 'الكمية المطلوبة/المؤكدة تجاريًا (Ordered / Confirmed Qty)', en: 'Ordered / Confirmed Commercial Quantity' },
        owner: { ar: 'المبيعات (Sales) أو المشتريات (Procurement)', en: 'Sales (SO) or Procurement (PO)' },
        affectsOnHand: { ar: 'لا — التزام تجاري فقط', en: 'No — Commercial commitment only' },
        affectsGl: { ar: 'لا', en: 'No' },
        requiresModules: { ar: 'Sales أو Procurement منفردًا', en: 'Sales or Procurement standalone' },
        phase2BoundaryNote: {
          ar: 'لا يجوز لأمر البيع أو أمر الشراء تعديل الرصيد الفعلي للمخزون مباشرةً.',
          en: 'Neither Sales Order nor Purchase Order may directly mutate On-hand stock.',
        },
      },
      {
        concept: { ar: 'سجل الحجز المخزني (Reservation Record)', en: 'Reservation Record' },
        owner: { ar: 'المخزون (Inventory — D-SALES-06)', en: 'Inventory (D-SALES-06)' },
        affectsOnHand: { ar: 'يقيّد المتاح دون تغيير On-hand الفعلي قبل الصرف', en: 'Constrains availability without changing physical On-hand until issue' },
        affectsGl: { ar: 'لا', en: 'No' },
        requiresModules: { ar: 'Sales + Inventory (CIC-CORE-SALES-INV-001)', en: 'Sales + Inventory (CIC-CORE-SALES-INV-001)' },
        phase2BoundaryNote: {
          ar: 'خوارزميات Soft/Hard Reservation وتخصيص التوريد مؤجلة للمرحلة 6.',
          en: 'Soft/Hard reservation and allocation algorithms are deferred to Phase 6.',
        },
      },
      {
        concept: { ar: 'الكمية الفعلية والحركة المخزنية (On-hand & Movement)', en: 'On-hand Quantity & Inventory Movement' },
        owner: { ar: 'المخزون (Inventory — D-INV-04)', en: 'Inventory (D-INV-04)' },
        affectsOnHand: { ar: 'نعم — المالك الحصري', en: 'Yes — Exclusive Owner' },
        affectsGl: { ar: 'فقط عبر CIC-CORE-INV-FIN-001 عند تفعيل Finance', en: 'Only via CIC-CORE-INV-FIN-001 when Finance is active' },
        requiresModules: { ar: 'Inventory (Standalone)', en: 'Inventory (Standalone)' },
        phase2BoundaryNote: {
          ar: 'Inventory يملك الكمية والحركة ولا يكتب مباشرةً في الأستاذ العام.',
          en: 'Inventory owns quantity and movements and never writes directly to GL.',
        },
      },
      {
        concept: { ar: 'الترحيل المالي لحركة المخزون (GL Financial Posting)', en: 'Inventory Movement Financial Posting' },
        owner: { ar: 'المالية (Finance — D-FIN-04)', en: 'Finance (D-FIN-04)' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'نعم — في المالية فقط', en: 'Yes — in Finance only' },
        requiresModules: { ar: 'Inventory + Finance', en: 'Inventory + Finance' },
        phase2BoundaryNote: {
          ar: 'ملكية وآليات Costing / Valuation مؤجلة للمرحلة 5/6.',
          en: 'Costing / Valuation ownership and mechanics deferred to Phase 5/6.',
        },
      },
    ],
  },
  {
    id: 'procurement',
    code: 'MOD-PROC',
    family: 'D-PROC',
    expectedDecisionCount: 9,
    documentSlug: 'procurement-module-model',
    officialSourcePath: 'teranoo-erp-planning/03-modules/procurement/PROCUREMENT_MODULE_MODEL.md',
    researchDeferredPath:
      'teranoo-erp-planning/01-market-research/04-procurement-module-architecture/02_PROCUREMENT_MODULE_ARCHITECTURE_RESEARCH.md',
    name: {
      ar: 'المشتريات',
      en: 'Procurement',
    },
    shortName: { ar: 'المشتريات', en: 'Procurement' },
    phaseStatus: {
      ar: 'معتمد / المرحلة 2 مغلقة (9 قرارات D-PROC)',
      en: 'Approved / Phase 2 Closed (9 D-PROC decisions)',
    },
    identitySummary: {
      ar: 'أحد الأنظمة الأساسية الأربعة (First-Class Sellable Module) والمالك الحصري لأوامر الشراء (Purchase Order) والقرار التجاري الشرائي والسياق التجاري للمورد وقبول الخدمات.',
      en: 'One of the four Core Business Modules (First-Class Sellable) and the exclusive owner of Purchase Orders, commercial purchasing decisions, Commercial Supplier Context, and service acceptance.',
    },
    standaloneSummary: {
      ar: 'قادر على العمل بصورة مستقلة تشغيليًا لإدارة طلبات الشراء وعروض الموردين وأوامر الشراء وشراء الخدمات والمصاريف غير المخزنية دون الحاجة إلى المخزون أو المبيعات أو المالية في الجزء التشغيلي.',
      en: 'Operationally standalone-capable for requisitions, RFQs, Purchase Orders, and service/expense/non-stock procurement without requiring Inventory, Sales, or Finance for operational purchasing.',
    },
    criticalLimitation: {
      ar: 'المشتريات بدون المالية لا تشكل دورة مالية كاملة: فاتورة المورد والذمم الدائنة والالتزام المالي والسداد والترحيل إلى GL تقع خارج قدرتها المستقلة وتتطلب Finance عبر CIC-CORE-PROC-FIN-001. وشراء الأصناف المخزنية يتطلب Inventory عبر FLD/CIC.',
      en: 'Standalone Procurement is NOT a complete financial cycle: Supplier Invoices, AP, financial liabilities, payments, and GL postings belong to Finance (via CIC-CORE-PROC-FIN-001). Stock item purchases require Inventory via FLD/CIC.',
    },
    responsibilities: [
      {
        ar: 'ملكية مستندات الشراء (Requisition / RFQ / Purchase Order) والكمية المطلوبة/المتوقعة تجاريًا.',
        en: 'Ownership of purchasing documents (Requisition / RFQ / Purchase Order) and ordered/expected commercial quantities.',
      },
      {
        ar: 'ملكية السياق التجاري للمورد (Commercial Supplier Context) دون تكرار هوية المورد المشتركة.',
        en: 'Ownership of Commercial Supplier Context without duplicating Shared Supplier/Party Identity.',
      },
      {
        ar: 'دعم شراء الخدمات والمصاريف والبنود غير المخزنية وقبول الخدمات دون مرورها بحركة مخزنية.',
        en: 'Supporting service, expense, category-based, and non-stock procurement including service acceptance without stock movements.',
      },
      {
        ar: 'اعتماد Product/Item Master كقدرة مشروطة (Conditional PCD) لا شاملة لكل أمر شراء (D-PROC-06).',
        en: 'Treating Product/Item Master as conditional rather than mandatory for every Purchase Order (D-PROC-06).',
      },
    ],
    standaloneCapabilities: [
      {
        ar: 'إنشاء وإدارة مستندات الشراء والالتزامات التجارية تجاه الموردين بصورة مستقلة.',
        en: 'Creating and managing purchasing documents and commercial commitments to suppliers independently.',
      },
      {
        ar: 'شراء الخدمات والمصاريف وتأكيد استلام الخدمات دون الحاجة لنظام المخزون.',
        en: 'Procuring services and expenses and confirming service acceptance without Inventory.',
      },
      {
        ar: 'استخدام محرك الموافقات المشترك في المنصة (Shared Workflow) عند تفعيل سياسات الاعتماد.',
        en: 'Using Shared Platform Workflow / Approvals when customer approval policies are enabled.',
      },
    ],
    ownedDataDomains: [
      { ar: 'أمر الشراء والمستندات الشرائية (Purchase Order & Procurement Documents)', en: 'Purchase Order & Procurement Documents' },
      { ar: 'القرار التجاري الشرائي والكمية المطلوبة/المتوقعة', en: 'Commercial Purchasing Decision & Ordered Quantity' },
      { ar: 'السياق التجاري للمورد (Commercial Supplier Context)', en: 'Commercial Supplier Context' },
      { ar: 'قبول وتأكيد الخدمات (Service Acceptance References)', en: 'Service Acceptance / Confirmation References' },
    ],
    sharedReferencesConsumed: [
      { ar: 'Shared Supplier / Party Identity (PCD Required)', en: 'Shared Supplier / Party Identity (Required PCD)' },
      { ar: 'Currency Foundation (PCD Required)', en: 'Currency Foundation (Required PCD)' },
      { ar: 'Shared Product / Item Master & UOM & Storage Context (PCD Conditional — للسلع المخزنية فقط)', en: 'Shared Product / Item Master, UOM & Storage Context (Conditional PCD — stock items only)' },
      { ar: 'Shared Workflow / Approvals (PCD Conditional)', en: 'Shared Workflow / Approvals (Conditional PCD)' },
    ],
    relatedCicIds: [
      'CIC-CORE-PROC-INV-001',
      'CIC-CORE-PROC-FIN-001',
      'CIC-CORE-SALES-PROC-001',
    ],
    relatedFldLabels: [
      'Procurement / Stock Purchase → Inventory (FLD)',
      'Procurement / Three-Way Match → Inventory Receipt + Finance (FLD · Owner Deferred)',
      'Sales / Drop Ship & Back-to-Back → Procurement (FLD)',
    ],
    educationalComparisonTitle: {
      ar: 'مقارنة تعليمية حاسمة: المفاهيم الستة في دورة المشتريات وحدود ملكيتها',
      en: 'Critical Educational Comparison: Six Procurement Concepts & Ownership Boundaries',
    },
    educationalComparisonNote: {
      ar: 'تُبرز هذه المقارنة الفصل المعماري المعتمد في PROCUREMENT_MODULE_MODEL.md بين الشراء التجاري، الاستلام المخزني، القبول الخدمي، فاتورة المورد، والسداد المالي.',
      en: 'Highlights the approved architectural separation in PROCUREMENT_MODULE_MODEL.md across physical items, services, receipts, acceptance, invoices, and payments.',
    },
    educationalComparisonRows: [
      {
        concept: { ar: '1. شراء صنف مخزني مادي (Physical Item Purchase)', en: '1. Physical Item Purchase' },
        owner: { ar: 'أمر الشراء: المشتريات (Procurement)', en: 'PO: Procurement' },
        affectsOnHand: { ar: 'لا عند PO · نعم فقط عند الاستلام في المخزون', en: 'No on PO · Yes only upon Inventory Receipt' },
        affectsGl: { ar: 'لا عند PO (D-PROC-05)', en: 'No on PO (D-PROC-05)' },
        requiresModules: { ar: 'Procurement + Inventory (FLD Stock Purchase + CIC)', en: 'Procurement + Inventory (Stock Purchase FLD + CIC)' },
        phase2BoundaryNote: {
          ar: 'يتطلب Product/Item وUOM وStorage Context (Conditional PCD) ولا يغيّر PO الرصيد الفعلي.',
          en: 'Uses conditional Product/UOM/Storage PCDs; PO itself never changes On-hand stock.',
        },
      },
      {
        concept: { ar: '2. شراء خدمة أو مصروف (Service / Expense Purchase)', en: '2. Service / Expense Purchase' },
        owner: { ar: 'المشتريات (Procurement)', en: 'Procurement' },
        affectsOnHand: { ar: 'لا — لا يمر بالمخزون إطلاقًا', en: 'No — Never touches Inventory' },
        affectsGl: { ar: 'لا عند PO · فقط عند الفوترة في المالية', en: 'No on PO · Only upon Finance invoicing' },
        requiresModules: { ar: 'Procurement فقط (دليل استقلال عن Inventory)', en: 'Procurement only (proves Inventory independence)' },
        phase2BoundaryNote: {
          ar: 'D-PROC-06: لا يشترط Item Master ولا Inventory لكل عملية شراء.',
          en: 'D-PROC-06: Neither Item Master nor Inventory is universally required.',
        },
      },
      {
        concept: { ar: '3. الاستلام المخزني للسلع (Goods Receipt)', en: '3. Goods Receipt (Stock Receipt)' },
        owner: { ar: 'الأثر الكمي والحركة: المخزون (Inventory)', en: 'Quantity & Movement: Inventory' },
        affectsOnHand: { ar: 'نعم — يزيد On-hand في المخزون', en: 'Yes — Increases On-hand in Inventory' },
        affectsGl: { ar: 'فقط عبر CIC-CORE-INV-FIN-001 عند تفعيل Finance', en: 'Only via CIC-CORE-INV-FIN-001 if Finance active' },
        requiresModules: { ar: 'Procurement + Inventory (CIC-CORE-PROC-INV-001)', en: 'Procurement + Inventory (CIC-CORE-PROC-INV-001)' },
        phase2BoundaryNote: {
          ar: 'يرتبط بالـ PO كمرجع دون نقل ملكية PO للمخزون؛ تنسيق الاستلام التفصيلي مؤجل للمرحلة 6.',
          en: 'References PO without transferring PO ownership; detailed receiving orchestration deferred to Phase 6.',
        },
      },
      {
        concept: { ar: '4. قبول / تأكيد الخدمة (Service Acceptance)', en: '4. Service Acceptance / Confirmation' },
        owner: { ar: 'المشتريات (Procurement)', en: 'Procurement' },
        affectsOnHand: { ar: 'لا — الخدمة غير مخزنية', en: 'No — Services are non-stock' },
        affectsGl: { ar: 'لا مباشرةً — يمرجع الفوترة في المالية عند التفعيل', en: 'Not directly — provides reference for Finance AP' },
        requiresModules: { ar: 'Procurement فقط', en: 'Procurement only' },
        phase2BoundaryNote: {
          ar: 'يقع داخل Procurement وليس Inventory؛ سير عمل Service Entry مؤجل للمرحلة 6.',
          en: 'Resides in Procurement, not Inventory; Service Entry workflow deferred to Phase 6.',
        },
      },
      {
        concept: { ar: '5. فاتورة المورد والالتزام المالي (Supplier Invoice / AP)', en: '5. Supplier Invoice / AP / Liability' },
        owner: { ar: 'المالية (Finance)', en: 'Finance' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'نعم — ترحيل AP/GL في المالية', en: 'Yes — AP/GL posting in Finance' },
        requiresModules: { ar: 'Procurement + Finance (CIC-CORE-PROC-FIN-001)', en: 'Procurement + Finance (CIC-CORE-PROC-FIN-001)' },
        phase2BoundaryNote: {
          ar: 'ملكية وتنسيق Invoice Matching (وThree-Way Match Owner) مؤجلة صراحةً للمرحلة 5/6.',
          en: 'Invoice Matching ownership/orchestration (and Three-Way Match owner) explicitly deferred to Phase 5/6.',
        },
      },
      {
        concept: { ar: '6. السداد المالي للمورد (Payment)', en: '6. Supplier Payment' },
        owner: { ar: 'المالية (Finance)', en: 'Finance' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'نعم — تسوية الالتزام والنقدية في المالية', en: 'Yes — Settles liability & cash in Finance' },
        requiresModules: { ar: 'Finance (خارج قدرة Procurement المستقلة)', en: 'Finance (outside standalone Procurement)' },
        phase2BoundaryNote: {
          ar: 'Procurement قد يستهلك مرجع حالة السداد فقط ولا يملك أو ينفذ الدفع المالي.',
          en: 'Procurement may reference payment status only; Finance exclusively owns payment execution.',
        },
      },
    ],
  },
  {
    id: 'sales-order-management',
    code: 'MOD-SALES',
    family: 'D-SALES',
    expectedDecisionCount: 11,
    documentSlug: 'sales-order-management-module-model',
    officialSourcePath:
      'teranoo-erp-planning/03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md',
    researchDeferredPath:
      'teranoo-erp-planning/01-market-research/05-sales-order-management-architecture/02_SALES_ORDER_MANAGEMENT_ARCHITECTURE_RESEARCH.md',
    name: {
      ar: 'المبيعات وإدارة الطلبات',
      en: 'Sales & Order Management',
    },
    shortName: { ar: 'المبيعات', en: 'Sales' },
    phaseStatus: {
      ar: 'معتمد / المرحلة 2 مغلقة (11 قرارًا D-SALES · 2026-09-09)',
      en: 'Approved / Phase 2 Closed (11 D-SALES decisions · 2026-09-09)',
    },
    identitySummary: {
      ar: 'أحد الأنظمة الأساسية الأربعة (First-Class Sellable Module) والمالك الحصري لأوامر البيع (Sales Order) والالتزام التجاري تجاه العميل والكمية المطلوبة/المؤكدة ونية التنسيق البيعي.',
      en: 'One of the four Core Business Modules (First-Class Sellable) and the exclusive owner of Sales Orders, customer commercial commitments, ordered/confirmed quantities, and sales fulfillment/billing intent.',
    },
    standaloneSummary: {
      ar: 'قادر على العمل بصورة مستقلة لإدارة عروض الأسعار وأوامر البيع وبيع الخدمات والبنود غير المخزنية (D-SALES-10) والالتزامات التجارية تجاه العملاء فوق Shared Customer/Party وShared Product/Service دون اشتراط المخزون أو المالية أو المشتريات أو CRM.',
      en: 'Standalone-capable for quotations, Sales Orders, service/non-stock sales (D-SALES-10), and customer commercial commitments over Shared Customer/Party and Shared Product/Service without requiring Inventory, Finance, Procurement, or CRM.',
    },
    criticalLimitation: {
      ar: 'المبيعات لا تملك الرصيد الفعلي للمخزون ولا سجل الحجز المخزني (حُسم لـ Inventory عبر D-SALES-06) ولا ترحيل الأستاذ/AR/التحصيل؛ بيع السلع المخزنية يتطلب Inventory عبر FLD/CIC، والفوترة المالية تتطلب Finance، والشحن المباشر (Drop Ship) يتطلب Procurement.',
      en: 'Sales owns neither On-hand stock nor Reservation Records (explicitly Inventory-owned via D-SALES-06), nor AR/Revenue/GL postings. Stock fulfillment requires Inventory (FLD/CIC), billing requires Finance, and Drop Ship requires Procurement.',
    },
    responsibilities: [
      {
        ar: 'ملكية عروض الأسعار وأوامر البيع (Sales Order) والالتزام التجاري والشروط البيعية تجاه العميل.',
        en: 'Ownership of quotations, Sales Orders, commercial terms, and customer commitments.',
      },
      {
        ar: 'ملكية الكمية المطلوبة/المؤكدة تجاريًا ونية التنفيذ والفوترة (Coordination Intent — D-SALES-07).',
        en: 'Ownership of ordered/confirmed commercial quantities and fulfillment/billing coordination intent (D-SALES-07).',
      },
      {
        ar: 'استقلال بيع الخدمات والبنود غير المخزنية (D-SALES-10) كدليل معماري على عدم وجود HBMD على المخزون.',
        en: 'Service & non-stock sales independence (D-SALES-10), preventing Inventory from becoming an HBMD.',
      },
      {
        ar: 'عدم اشتراط CRM لتفعيل نظام المبيعات الأساسي (علاقة اختيارية/مستقبلية).',
        en: 'Zero hard dependency on future CRM to activate core Sales & Order Management.',
      },
    ],
    standaloneCapabilities: [
      {
        ar: 'إدارة عروض الأسعار وأوامر البيع للخدمات والبنود غير المخزنية دون الحاجة إلى Inventory أو Finance.',
        en: 'Managing quotations and Sales Orders for services and non-stock offerings without Inventory or Finance.',
      },
      {
        ar: 'استهلاك Shared Customer / Party Identity وShared Product / Service Identity وUOM وCurrency Foundation.',
        en: 'Consuming Shared Customer/Party Identity, Shared Product/Service Identity, UOM, and Currency Foundation.',
      },
      {
        ar: 'التوسع لاحقًا بميزات Stock Sale وCustomer Billing وDrop Ship وCredit Check كـ FLDs وCICs منفصلة.',
        en: 'Activating Stock Sale, Customer Billing, Drop Ship, and Credit Check cleanly as separate FLDs and CICs.',
      },
    ],
    ownedDataDomains: [
      { ar: 'أمر البيع والالتزام التجاري للعميل (Sales Order)', en: 'Sales Order & Customer Commercial Commitment' },
      { ar: 'الكمية المطلوبة/المؤكدة تجاريًا (Ordered / Confirmed Quantity)', en: 'Ordered / Confirmed Commercial Quantity' },
      { ar: 'السياق التجاري للعميل (Commercial Customer Context)', en: 'Commercial Customer Context' },
      { ar: 'نية التنفيذ والفوترة والتوريد (Fulfillment / Billing / Supply Intent)', en: 'Fulfillment, Billing & Supply Intent' },
    ],
    sharedReferencesConsumed: [
      { ar: 'Shared Customer / Party Identity (PCD Required)', en: 'Shared Customer / Party Identity (Required PCD)' },
      { ar: 'Shared Product / Service Identity & UOM & Currency (PCD Required)', en: 'Shared Product / Service Identity, UOM & Currency (Required PCDs)' },
      { ar: 'Pricing Capability & Credit Capability (C* — المالك النهائي مؤجل)', en: 'Pricing Capability & Credit Capability (C* — placement deferred)' },
      { ar: 'حالة الحجز والصرف من Inventory وAR/التحصيل من Finance وPO من Procurement عبر CICs', en: 'Reservation/fulfillment status from Inventory, AR/payment from Finance, and PO refs from Procurement via CICs' },
    ],
    relatedCicIds: [
      'CIC-CORE-SALES-INV-001',
      'CIC-CORE-SALES-FIN-001',
      'CIC-CORE-SALES-PROC-001',
    ],
    relatedFldLabels: [
      'Sales / Stock Sale & Stock Fulfillment → Inventory (FLD)',
      'Sales / Customer Billing → Finance (FLD · Invoice Generation Deferred)',
      'Sales / Drop Ship & Back-to-Back → Procurement (FLD)',
    ],
    educationalComparisonTitle: {
      ar: 'مقارنة معمارية: بيع الخدمات مقابل بيع المخزون مقابل الفوترة مقابل الشحن المباشر',
      en: 'Architectural Comparison: Service Sales vs Stock Sales vs Customer Billing vs Drop Ship',
    },
    educationalComparisonNote: {
      ar: 'توضح كيف يبقى نظام المبيعات مستقلاً في التفعيل (0 HBMD) بينما تُضبط الميزات المتقدمة بـ FLD وCIC.',
      en: 'Demonstrates how Sales remains independently activatable (0 HBMD) while advanced capabilities use FLD and CIC boundaries.',
    },
    educationalComparisonRows: [
      {
        concept: { ar: 'بيع خدمات / بنود غير مخزنية (Service Sales)', en: 'Service / Non-Stock Sales' },
        owner: { ar: 'المبيعات (Sales — D-SALES-10)', en: 'Sales (D-SALES-10)' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'لا بدون تفعيل Finance', en: 'No without Finance' },
        requiresModules: { ar: 'Sales فقط (Standalone)', en: 'Sales only (Standalone)' },
        phase2BoundaryNote: {
          ar: 'يُثبت أن Inventory ليس HBMD على Sales مهما كانت أهمية بيع المخزون تجاريًا.',
          en: 'Proves Inventory is NOT an HBMD on Sales regardless of commercial importance.',
        },
      },
      {
        concept: { ar: 'بيع صنف مخزني والحجز والصرف (Stock Fulfillment)', en: 'Stock Sale / Reservation / Goods Issue' },
        owner: { ar: 'الطلب: المبيعات · الحجز والرصيد والصرف: المخزون', en: 'Order: Sales · Reservation, On-hand & Issue: Inventory' },
        affectsOnHand: { ar: 'نعم (في المخزون فقط عبر CIC)', en: 'Yes (in Inventory only via CIC)' },
        affectsGl: { ar: 'فقط إذا كان Finance مفعّلاً عبر CIC-CORE-INV-FIN-001', en: 'Only if Finance active via CIC-CORE-INV-FIN-001' },
        requiresModules: { ar: 'Sales + Inventory (FLD + CIC-CORE-SALES-INV-001)', en: 'Sales + Inventory (FLD + CIC-CORE-SALES-INV-001)' },
        phase2BoundaryNote: {
          ar: 'D-SALES-06 حسم ملكية Reservation Record للمخزون، وخوارزميات الحجز مؤجلة للمرحلة 6.',
          en: 'D-SALES-06 fixed Reservation Record ownership in Inventory; algorithms deferred to Phase 6.',
        },
      },
      {
        concept: { ar: 'فوترة العميل والذمم المدينة (Customer Billing / AR)', en: 'Customer Billing / AR / Revenue' },
        owner: { ar: 'AR/الإيراد: المالية · توليد الفاتورة: Deferred Boundary', en: 'AR/Revenue: Finance · Invoice Generation: Deferred Boundary' },
        affectsOnHand: { ar: 'لا', en: 'No' },
        affectsGl: { ar: 'نعم (في المالية عبر CIC-CORE-SALES-FIN-001)', en: 'Yes (in Finance via CIC-CORE-SALES-FIN-001)' },
        requiresModules: { ar: 'Sales + Finance (FLD + CIC-CORE-SALES-FIN-001)', en: 'Sales + Finance (FLD + CIC-CORE-SALES-FIN-001)' },
        phase2BoundaryNote: {
          ar: 'Customer Invoice Generation Boundary وPricing Engine placement مؤجلان للمرحلة 5/6.',
          en: 'Customer Invoice Generation Boundary and Pricing Engine placement deferred to Phase 5/6.',
        },
      },
      {
        concept: { ar: 'الشحن المباشر / التسليم من المورد (Drop Ship / Back-to-Back)', en: 'Drop Ship / Direct Delivery / Back-to-Back' },
        owner: { ar: 'التزام العميل: المبيعات · أمر الشراء: المشتريات', en: 'Customer Order: Sales · PO: Procurement' },
        affectsOnHand: { ar: 'لا في Drop Ship المباشر', en: 'No in direct Drop Ship' },
        affectsGl: { ar: 'عند تفعيل Finance فقط', en: 'Only when Finance is active' },
        requiresModules: { ar: 'Sales + Procurement (FLD + CIC-CORE-SALES-PROC-001)', en: 'Sales + Procurement (FLD + CIC-CORE-SALES-PROC-001)' },
        phase2BoundaryNote: {
          ar: 'تفعيل Drop Ship مقيّد بـ FLD وCIC ولا ينشئ HBMD على المشتريات.',
          en: 'Drop Ship is governed by FLD + CIC and never creates an HBMD on Procurement.',
        },
      },
    ],
  },
];

function cleanCell(raw: string): string {
  return raw
    .trim()
    .replace(/^\*\*(.+)\*\*$/, '$1')
    .replace(/^`(.+)`$/, '$1')
    .replace(/\*\*/g, '')
    .trim();
}

function extractDecisionsFromModuleMarkdown(
  markdown: string,
  config: CoreModuleStaticConfig,
  documentId: string
): readonly Phase2SourceLocalDecision[] {
  const normalized = markdown.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const decisions: Phase2SourceLocalDecision[] = [];

  const headingRegex = /^###\s+(?:✅\s+)?(D-(?:FIN|INV|PROC|SALES)-\d+)\s+—\s+(.+)$/;

  let current: {
    decisionId: string;
    title: string;
    rawHeading: string;
    bodyLines: string[];
  } | null = null;

  const flush = () => {
    if (!current) return;
    const bodyText = current.bodyLines.join('\n').trim();
    const limitMatch = bodyText.match(/(?:^|\n)\*\*حد القرار:\*\*\s*(.+)$/m);
    const limitNote = limitMatch?.[1]?.trim() ?? null;
    const depthBundle = MODULE_EDUCATIONAL_DEPTH_BUNDLES[config.id];
    const educationalDetail = depthBundle.decisionDetails[current.decisionId];
    if (!educationalDetail) {
      throw new Error(
        `Missing curated DecisionEducationalDetail for "${current.decisionId}" in module "${config.id}".`
      );
    }
    decisions.push({
      decisionId: current.decisionId,
      family: config.family,
      title: current.title,
      verbatimBody: bodyText,
      limitNote,
      owningModuleId: config.id,
      owningModuleLabel: config.name,
      owningDocumentId: documentId,
      owningDocumentSlug: config.documentSlug,
      owningDocumentPath: config.officialSourcePath,
      sectionAnchor: `${HEADING_ID_PREFIX}${createHeadingSlug(current.rawHeading)}`,
      approvalStatus: 'approved',
      phaseRef: 'phase-2',
      scopeKind: 'phase-2-source-local',
      educationalDetail,
    });
    current = null;
  };

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    const match = trimmed.match(headingRegex);
    if (match && match[1] && match[2]) {
      flush();
      const rawHeading = trimmed.replace(/^###\s+/, '').trim();
      current = {
        decisionId: match[1].trim(),
        title: match[2].trim(),
        rawHeading,
        bodyLines: [],
      };
      continue;
    }

    if (current) {
      if (/^##\s+/.test(trimmed) || trimmed === '---') {
        flush();
        continue;
      }
      current.bodyLines.push(rawLine);
    }
  }
  flush();

  if (decisions.length !== config.expectedDecisionCount) {
    throw new Error(
      `Module decision extraction mismatch for "${config.id}": expected ${config.expectedDecisionCount} decisions, extracted ${decisions.length}.`
    );
  }

  return decisions;
}

function extractPcdsFromModuleMarkdown(markdown: string): {
  readonly requiredPcds: readonly ModulePcdRequirement[];
  readonly conditionalPcds: readonly ModulePcdRequirement[];
} {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const requiredPcds: ModulePcdRequirement[] = [];
  const conditionalPcds: ModulePcdRequirement[] = [];

  let section: 'none' | 'required' | 'conditional' = 'none';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^###\s+.*Required Platform Capabilities/i.test(line)) {
      section = /Conditionally Required/i.test(line) ? 'conditional' : 'required';
      continue;
    }
    if (/^#{2,3}\s+/.test(line)) {
      section = 'none';
      continue;
    }

    if (
      section !== 'none' &&
      line.startsWith('|') &&
      line.endsWith('|') &&
      !line.startsWith('|---') &&
      !line.startsWith('| ---')
    ) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => cleanCell(c));

      if (
        cells.length >= 2 &&
        cells[0] &&
        !/^Platform Capability$/i.test(cells[0])
      ) {
        if (section === 'required') {
          requiredPcds.push({
            capability: cells[0],
            classification: cells[1] ?? 'Required',
            note: cells[2] ?? '',
            kind: 'required',
          });
        } else {
          conditionalPcds.push({
            capability: cells[0],
            classification: 'Conditionally Required',
            note: cells[1] ?? '',
            kind: 'conditional',
          });
        }
      }
    }
  }

  return { requiredPcds, conditionalPcds };
}

function extractListSection(
  markdown: string,
  sectionHeadingPattern: RegExp
): readonly string[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const items: string[] = [];
  let active = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^##\s+/.test(line)) {
      if (sectionHeadingPattern.test(line)) {
        active = true;
        continue;
      }
      if (active) {
        break;
      }
    }
    if (!active) continue;
    const itemMatch = line.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
    if (itemMatch && itemMatch[1]) {
      const cleaned = itemMatch[1].replace(/\*\*/g, '').replace(/`/g, '').trim();
      if (cleaned) {
        items.push(cleaned);
      }
    }
  }

  return items;
}

function buildModuleLifecycleBlueprint(
  config: CoreModuleStaticConfig,
  decisionCount: number,
  requiredPcdCount: number,
  conditionalPcdCount: number,
  deferredCount: number
): readonly ModuleLifecycleSectionSlot[] {
  return REUSABLE_MODULE_LIFECYCLE_SECTIONS.map((slot) => {
    let summary: LocalizedText;
    switch (slot.key) {
      case 'identity':
        summary = config.identitySummary;
        break;
      case 'boundaries':
        summary = {
          ar: `الاستبعادات وحدود المرحلة 2 موثّقة رسميًا في ${config.officialSourcePath}.`,
          en: `Phase 2 architectural boundaries and exclusions documented in ${config.officialSourcePath}.`,
        };
        break;
      case 'standalone':
        summary = config.standaloneSummary;
        break;
      case 'pcd':
        summary = {
          ar: `${requiredPcdCount} قدرة منصة مطلوبة (Required) + ${conditionalPcdCount} قدرة مشروطة (Conditional).`,
          en: `${requiredPcdCount} Required PCDs + ${conditionalPcdCount} Conditionally Required PCDs.`,
        };
        break;
      case 'hbmd-cic-fld':
        summary = {
          ar: `0 اعتماديات صلبة (HBMD) · ${config.relatedCicIds.length} عقود تكامل مشروط (CIC) · ${config.relatedFldLabels.length} اعتماديات ميزة (FLD).`,
          en: `0 HBMDs · ${config.relatedCicIds.length} Core CICs · ${config.relatedFldLabels.length} FLDs.`,
        };
        break;
      case 'ownership':
        summary = {
          ar: `${config.ownedDataDomains.length} مجالات ملكية بيانات معتمدة (Source of Truth) منفصلة عن استهلاك المراجع.`,
          en: `${config.ownedDataDomains.length} approved Source of Truth data ownership domains separated from reference consumption.`,
        };
        break;
      case 'lifecycle':
        summary = {
          ar: 'Inactive / Active / Frozen · التفعيل المستقل مع قاعدة Freeze, not Delete.',
          en: 'Inactive / Active / Frozen · Independent activation governed by Freeze, not Delete.',
        };
        break;
      case 'decisions':
        summary = {
          ar: `${decisionCount} قرارات معمارية معتمدة محليًا في المرحلة 2 (${config.family}-01..${String(decisionCount).padStart(2, '0')}).`,
          en: `${decisionCount} approved Phase 2 source-local decisions (${config.family}-01..${String(decisionCount).padStart(2, '0')}).`,
        };
        break;
      case 'deferred':
        summary = {
          ar: `${deferredCount} بنود تصميم وحدود مؤجلة عمدًا للمراحل 5 و6 و6.5 دون حسم مبكر.`,
          en: `${deferredCount} design areas and boundaries intentionally deferred to Phases 5, 6, and 6.5.`,
        };
        break;
      case 'research':
        summary = {
          ar: `بانتظار دفعة الأبحاث المعتمدة (${config.researchDeferredPath}).`,
          en: `Awaiting authorized research batch (${config.researchDeferredPath}).`,
        };
        break;
      default:
        summary = {
          ar: `غير مُعبَّأ بعد — ينتظر مرحلته الرسمية (${slot.targetPhase}) دون اختلاق محتوى.`,
          en: `Not yet populated — awaits its official lifecycle phase (${slot.targetPhase}); zero fabricated content.`,
        };
        break;
    }
    return {
      ...slot,
      summary,
    };
  });
}

function buildModuleProjectionMetadata(
  config: CoreModuleStaticConfig,
  documentId: string,
  bodyMarkdown: string,
  actualSourceRevision: string | null
): ModuleProjectionMetadata {
  const pin = CURATED_MODULE_PROJECTION_PINS[config.id];
  const actualSourceBodySha256 = computeCanonicalStoredBodySha256(bodyMarkdown);

  const bodyChanged = actualSourceBodySha256 !== pin.mappedSourceBodySha256;
  const revisionChanged =
    actualSourceRevision !== null &&
    actualSourceRevision !== pin.mappedSourceRevision;

  const mappingFreshnessStatus: ModuleProjectionFreshnessStatus =
    bodyChanged || revisionChanged
      ? 'review-required-source-changed'
      : 'verified-current';

  return {
    kind: 'curated-projection',
    authoritativeDocumentId: documentId,
    authoritativeDocumentSlug: config.documentSlug,
    authoritativeSourcePath: config.officialSourcePath,
    mappedSourceRevision: pin.mappedSourceRevision,
    actualSourceRevision,
    mappedSourceBodySha256: pin.mappedSourceBodySha256,
    actualSourceBodySha256,
    lastCuratedReviewDate: pin.lastCuratedReviewDate,
    mappingFreshnessStatus,
    curatedFields: CURATED_MODULE_PROJECTION_FIELDS,
    deterministicFields: DETERMINISTIC_MODULE_EXTRACTION_FIELDS,
    projectionDisclosure: {
      ar: `تجمع هذه الصفحة بين استخلاص حتمي مباشر من النص الرسمي (${config.officialSourcePath}: القرارات المعتمدة حرفيًا، جداول PCD، الاستبعادات الصريحة، والبنود المؤجلة) وبين إسقاطات تعليمية مُراجعة يدويًا (الملخصات، نقاط المسؤوليات والملكية، وجدول المقارنة التعليمية) مُثبّتة على المراجعة ${pin.mappedSourceRevision.slice(0, 12)} وبصمة النص الرسمي.`,
      en: `This module view explicitly separates deterministic extraction from the verbatim official source (${config.officialSourcePath}: verbatim decisions, PCD tables, explicit exclusions, and deferred items) from manually curated educational projections (summaries, responsibility/ownership highlights, and educational comparison tables) pinned to revision ${pin.mappedSourceRevision.slice(0, 12)} and canonical body SHA-256.`,
    },
    reviewWarning:
      mappingFreshnessStatus === 'review-required-source-changed'
        ? {
            ar: `تنبيه انجراف مصدر (KH-028): تغيّرت بصمة أو مراجعة الوثيقة الرسمية (${config.officialSourcePath}) عن النسخة المُراجعة للإسقاط التعليمي — يُرجى مراجعة الإسقاطات التعليمية قبل اعتبارها مطابقة للنسخة الحالية والرجوع مباشرةً إلى النص الرسمي الكامل.`,
            en: `Source drift detected (KH-028): the authoritative document (${config.officialSourcePath}) digest or revision changed relative to the pinned curated projection — review curated educational summaries against the verbatim official source before treating them as current.`,
          }
        : null,
  };
}

/**
 * Pure, testable builder combining deterministic extraction from official module Markdown
 * with curated educational projection provenance & freshness verification (KH-028 / FIX-02-R01).
 */
export function buildCoreModuleProfileFromSource(
  moduleId: CoreModuleId,
  bodyMarkdown: string,
  options?: {
    readonly documentId?: string;
    readonly sourceRevision?: string | null;
    readonly sourceDocumentDate?: string | null;
  }
): CoreModuleArchitecturalProfile {
  const config = CORE_MODULE_CONFIGS.find((c) => c.id === moduleId);
  if (!config) {
    throw new Error(`Unknown CoreModuleId "${moduleId}".`);
  }

  const documentId =
    options?.documentId ?? `kh-doc-${config.documentSlug}-ar`;
  const actualSourceRevision =
    options?.sourceRevision === undefined
      ? CURATED_MODULE_PROJECTION_PINS[moduleId].mappedSourceRevision
      : options.sourceRevision;

  const decisions = extractDecisionsFromModuleMarkdown(
    bodyMarkdown,
    config,
    documentId
  );
  const { requiredPcds, conditionalPcds } =
    extractPcdsFromModuleMarkdown(bodyMarkdown);
  const explicitExclusions = extractListSection(
    bodyMarkdown,
    /^##\s+\d+\..*الاستبعادات الصريحة/
  );
  const deferredDesignItems = extractListSection(
    bodyMarkdown,
    /^##\s+\d+\..*القرارات المفتوحة والمؤجلة/
  );

  const lifecycleBlueprint = buildModuleLifecycleBlueprint(
    config,
    decisions.length,
    requiredPcds.length,
    conditionalPcds.length,
    deferredDesignItems.length
  );

  const projectionMetadata = buildModuleProjectionMetadata(
    config,
    documentId,
    bodyMarkdown,
    actualSourceRevision
  );

  const depthBundle = MODULE_EDUCATIONAL_DEPTH_BUNDLES[config.id];

  return {
    id: config.id,
    code: config.code,
    codeIdentifierScope: 'knowledge-hub-internal',
    name: config.name,
    shortName: config.shortName,
    documentId,
    documentSlug: config.documentSlug,
    officialSourcePath: config.officialSourcePath,
    researchDeferredPath: config.researchDeferredPath,
    phaseStatus: config.phaseStatus,
    sourceDocumentDate: options?.sourceDocumentDate ?? null,
    projectionMetadata,
    identitySummary: config.identitySummary,
    standaloneSummary: config.standaloneSummary,
    criticalLimitation: config.criticalLimitation,
    responsibilities: config.responsibilities,
    standaloneCapabilities: config.standaloneCapabilities,
    ownedDataDomains: config.ownedDataDomains,
    sharedReferencesConsumed: config.sharedReferencesConsumed,
    requiredPcds,
    conditionalPcds,
    hbmdCount: 0,
    relatedCicIds: config.relatedCicIds,
    relatedFldLabels: config.relatedFldLabels,
    explicitExclusions,
    deferredDesignItems,
    decisions,
    educationalComparisonTitle: config.educationalComparisonTitle,
    educationalComparisonNote: config.educationalComparisonNote,
    educationalComparisonRows: config.educationalComparisonRows,
    purposeAndImpact: depthBundle.purposeAndImpact,
    designReasoning: depthBundle.designReasoning,
    absentPeerScenarios: depthBundle.absentPeerScenarios,
    ownershipBoundaryMatrix: depthBundle.ownershipBoundaryMatrix,
    deferredBoundaryRationales: depthBundle.deferredBoundaryRationales,
    lifecycleBlueprint,
  };
}

let cachedCoreModulesCatalog: ExtractedCoreModulesCatalog | null = null;

export function getExtractedCoreModulesCatalog(): ExtractedCoreModulesCatalog {
  if (cachedCoreModulesCatalog) {
    return cachedCoreModulesCatalog;
  }

  const registry = getContentRegistry();
  const modules: CoreModuleArchitecturalProfile[] = [];
  const allPhase2Decisions: Phase2SourceLocalDecision[] = [];
  const phase2DecisionCountByModule: Record<CoreModuleId, number> = {
    finance: 0,
    'inventory-warehouse': 0,
    procurement: 0,
    'sales-order-management': 0,
  };

  for (const config of CORE_MODULE_CONFIGS) {
    const doc = registry.getBySlug(config.documentSlug);
    if (!doc) {
      throw new Error(
        `Published official module model document "${config.documentSlug}" is missing from Content Registry.`
      );
    }

    const sourceRevision =
      doc.metadata.source.kind === 'official-source'
        ? (doc.metadata.source.commitSha ?? null)
        : null;

    const profile = buildCoreModuleProfileFromSource(
      config.id,
      doc.bodyMarkdown,
      {
        documentId: doc.metadata.id,
        sourceRevision,
        sourceDocumentDate: doc.metadata.source.sourceDocumentDate ?? null,
      }
    );

    phase2DecisionCountByModule[config.id] = profile.decisions.length;
    allPhase2Decisions.push(...profile.decisions);
    modules.push(profile);
  }

  cachedCoreModulesCatalog = {
    modules,
    allPhase2Decisions,
    phase2DecisionCountByModule,
    totalPhase2DecisionsCount: allPhase2Decisions.length,
    anyProjectionRequiresReview: modules.some(
      (m) =>
        m.projectionMetadata.mappingFreshnessStatus ===
        'review-required-source-changed'
    ),
  };

  return cachedCoreModulesCatalog;
}

export function getCoreModuleProfileById(
  moduleId: string
): CoreModuleArchitecturalProfile | null {
  const catalog = getExtractedCoreModulesCatalog();
  return catalog.modules.find((m) => m.id === moduleId) ?? null;
}

export function resetExtractedCoreModulesCache(): void {
  cachedCoreModulesCatalog = null;
}
