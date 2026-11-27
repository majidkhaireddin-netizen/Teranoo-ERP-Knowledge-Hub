import type { LocalizedText } from '@/content/models/types';
import { computeCanonicalStoredBodySha256 } from '@/content/ingestion/ingestionPipeline';

export type DependencyProjectionFreshnessStatus =
  | 'verified-current'
  | 'review-required-source-changed';

export type PinnedDependencySourceKey =
  | 'dependencyModel'
  | 'moduleDependencyMatrix'
  | 'moduleLifecycleRules'
  | 'phase2ClosureReview'
  | 'financeModuleModel'
  | 'inventoryModuleModel'
  | 'procurementModuleModel'
  | 'salesModuleModel';

export interface CuratedDependencySourcePin {
  readonly key: PinnedDependencySourceKey;
  readonly documentSlug: string;
  readonly sourcePath: string;
  readonly mappedSourceRevision: string;
  readonly mappedSourceBodySha256: string;
  readonly lastCuratedReviewDate: string;
}

export interface DependencySourceFreshnessEntry {
  readonly key: PinnedDependencySourceKey;
  readonly documentSlug: string;
  readonly sourcePath: string;
  readonly mappedSourceRevision: string;
  readonly actualSourceRevision: string | null;
  readonly mappedSourceBodySha256: string;
  readonly actualSourceBodySha256: string;
  readonly status: DependencyProjectionFreshnessStatus;
}

export interface DependencyEducationalProvenance {
  readonly kind: 'curated-projection';
  readonly lastCuratedReviewDate: string;
  readonly mappingFreshnessStatus: DependencyProjectionFreshnessStatus;
  readonly sources: readonly DependencySourceFreshnessEntry[];
  readonly disclosure: LocalizedText;
  readonly reviewWarning: LocalizedText | null;
}

export interface EducationalSourceAnchorRef {
  readonly documentSlug: string;
  readonly sectionLabel: LocalizedText;
  readonly sectionAnchor: string;
}

export interface ClassificationDecisionRow {
  readonly code: 'PCD' | 'HBMD' | 'CIC' | 'FLD';
  readonly decisionQuestion: LocalizedText;
  readonly enforcementBoundary: LocalizedText;
  readonly commonMistakes: LocalizedText;
  readonly architecturalImplication: LocalizedText;
  readonly sourceRef: EducationalSourceAnchorRef;
}

export interface DecisionFlowStep {
  readonly stepNumber: number;
  readonly question: LocalizedText;
  readonly ifYesClassification: string;
  readonly rationale: LocalizedText;
  readonly sourceRef: EducationalSourceAnchorRef;
}

export interface DependencyClassificationGuide {
  readonly separationNotice: LocalizedText;
  readonly decisionFlowSteps: readonly DecisionFlowStep[];
  readonly classificationComparisonRows: readonly ClassificationDecisionRow[];
  readonly creditCheckAndFldClarification: LocalizedText;
}

export interface CoreCicEducationalGuidance {
  readonly contractId: string;
  readonly whyIntegrationExists: LocalizedText;
  readonly auditAndIdempotencyPrincipleNote: LocalizedText;
  readonly deferredDesignDecisions: LocalizedText;
  readonly sourceRefs: readonly EducationalSourceAnchorRef[];
}

export interface OwnershipDistinctionTopic {
  readonly id:
    | 'shared-identity-vs-context'
    | 'authoritative-ownership-vs-consumption'
    | 'transaction-ownership-vs-coordination'
    | 'physical-quantity-vs-financial-effect'
    | 'deferred-ownership-boundaries';
  readonly title: LocalizedText;
  readonly ruleSummary: LocalizedText;
  readonly architecturalRationale: LocalizedText;
  readonly antiPatternToAvoid: LocalizedText;
  readonly relatedOwnIds: readonly string[];
  readonly sourceRefs: readonly EducationalSourceAnchorRef[];
}

export interface OwnershipDecisionStep {
  readonly stepNumber: number;
  readonly question: LocalizedText;
  readonly guidance: LocalizedText;
}

export interface DataOwnershipDesignGuide {
  readonly schemaBoundaryNotice: LocalizedText;
  readonly distinctions: readonly OwnershipDistinctionTopic[];
  readonly architectChecklist: readonly OwnershipDecisionStep[];
}

export interface ConceptualEducationalExample {
  readonly id:
    | 'ex-po-vs-physical-receipt'
    | 'ex-sales-order-vs-inventory'
    | 'ex-standalone-inventory-vs-finance'
    | 'ex-fld-must-not-become-hbmd';
  readonly placement: 'ownership' | 'model';
  readonly title: LocalizedText;
  readonly scenarioSummary: LocalizedText;
  readonly boundaryRule: LocalizedText;
  readonly architecturalConsequenceIfViolated: LocalizedText;
  readonly relatedIdentifiers: readonly string[];
  readonly sourceRefs: readonly EducationalSourceAnchorRef[];
}

export interface DependencyEducationalGuidanceBundle {
  readonly provenance: DependencyEducationalProvenance;
  readonly classificationGuide: DependencyClassificationGuide;
  readonly cicGuidanceByContractId: Readonly<
    Record<string, CoreCicEducationalGuidance>
  >;
  readonly ownershipGuide: DataOwnershipDesignGuide;
  readonly educationalExamples: readonly ConceptualEducationalExample[];
}

/**
 * Pinned authoritative BATCH-002 revisions and canonical stored-body SHA-256 digests
 * for all curated educational projections in the Dependencies, Contracts & Ownership Center.
 */
export const CURATED_DEPENDENCY_PROJECTION_PINS: Readonly<
  Record<PinnedDependencySourceKey, CuratedDependencySourcePin>
> = {
  dependencyModel: {
    key: 'dependencyModel',
    documentSlug: 'dependency-model',
    sourcePath: 'teranoo-erp-planning/03-modules/DEPENDENCY_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '6ca9bff934962b679d43a881ddd343a04fe2fbe250550440bc6db982dc83d629',
    lastCuratedReviewDate: '2026-11-27',
  },
  moduleDependencyMatrix: {
    key: 'moduleDependencyMatrix',
    documentSlug: 'module-dependency-matrix',
    sourcePath: 'teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '34700c3027731399dd8a3276cf41f1fa3f5bc9234453502901589f8a46c55c43',
    lastCuratedReviewDate: '2026-11-27',
  },
  moduleLifecycleRules: {
    key: 'moduleLifecycleRules',
    documentSlug: 'module-lifecycle-rules',
    sourcePath: 'teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '48b2e498841e8f97ea88837ff249359200e8abc8531f350fe3bddfc218f07658',
    lastCuratedReviewDate: '2026-11-27',
  },
  phase2ClosureReview: {
    key: 'phase2ClosureReview',
    documentSlug: 'phase-2-closure-review',
    sourcePath:
      'teranoo-erp-planning/00-project-foundation/PHASE_2_CLOSURE_REVIEW.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      'eb1a9b11debd223aae17480cc05e2c352de8fe14509dadc37de84e0234717c4b',
    lastCuratedReviewDate: '2026-11-27',
  },
  financeModuleModel: {
    key: 'financeModuleModel',
    documentSlug: 'finance-module-model',
    sourcePath:
      'teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '4638fa9334a96274a7c5ddf5ebbd2642ac435d84a00b6f1ff71877fa4399ad2b',
    lastCuratedReviewDate: '2026-11-27',
  },
  inventoryModuleModel: {
    key: 'inventoryModuleModel',
    documentSlug: 'inventory-module-model',
    sourcePath:
      'teranoo-erp-planning/03-modules/inventory/INVENTORY_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      'c28df337e23ca9cc1cb086e69b0e1a60de86a25ba55a31818881598630d66729',
    lastCuratedReviewDate: '2026-11-27',
  },
  procurementModuleModel: {
    key: 'procurementModuleModel',
    documentSlug: 'procurement-module-model',
    sourcePath:
      'teranoo-erp-planning/03-modules/procurement/PROCUREMENT_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '89c207dd693b93fae802b1b55e8424e5bcae00c0b1b67a5c28ffe5507a7e46f9',
    lastCuratedReviewDate: '2026-11-27',
  },
  salesModuleModel: {
    key: 'salesModuleModel',
    documentSlug: 'sales-order-management-module-model',
    sourcePath:
      'teranoo-erp-planning/03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md',
    mappedSourceRevision: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    mappedSourceBodySha256:
      '331bcac1def77d6114e5114d25e6c22b80adabca2246e9c2a2ea21c4544528c1',
    lastCuratedReviewDate: '2026-11-27',
  },
};

const CLASSIFICATION_GUIDE: DependencyClassificationGuide = {
  separationNotice: {
    ar: 'إرشاد معماري تعليمي مشتق من DEPENDENCY_MODEL.md — يوضح كيفية تطبيق القواعد المعتمدة ولا يضيف أي تصنيف اعتمادية جديد ولا يحل محل النص الرسمي.',
    en: 'Curated Educational Design Guide derived from DEPENDENCY_MODEL.md — explains how architects apply the approved taxonomy without introducing new classifications or replacing official decision text.',
  },
  decisionFlowSteps: [
    {
      stepNumber: 1,
      question: {
        ar: 'هل يحتاج النظام إلى قدرة أو هوية مشتركة من المنصة (مثل Tenant / Company / Currency / Party / Product) وليس إلى وحدة أعمال تجارية أخرى؟',
        en: 'Does the module require a shared Platform Foundation or Shared Identity (e.g., Tenant, Company, Currency, Party, Product) rather than another Business Module?',
      },
      ifYesClassification: 'PCD (Required / Conditional / Optional)',
      rationale: {
        ar: 'يُصنّف كـ PCD: إذا كان لازمًا للتشغيل الأساسي فهو Required (يُفحص عند تفعيل الوحدة)، وإذا كان مشروطًا بميزة أو لم يُحسم موضعه النهائي بعد فيوسم Conditional (C أو C*).',
        en: 'Classify as PCD: Required if mandatory for baseline operation (checked at module activation), Conditional (C) if feature/scenario-specific, or C* when capability placement remains deferred.',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§3 PCD — اعتماديات المنصة', en: '§3 PCD Definition & Enforcement' },
        sectionAnchor: 'kh-h-3-pcd-platform-capability-dependency',
      },
    },
    {
      stepNumber: 2,
      question: {
        ar: 'هل يستحيل تفعيل وتشغيل القدرة الأساسية المستقلة للوحدة (مثل القيود اليدوية أو شراء الخدمات أو بيع الخدمات) بدون تفعيل Business Module آخر؟',
        en: 'Is it genuinely impossible to activate and run the module’s simplest approved standalone capability (e.g., manual GL, service PO, service sale) without another Business Module active?',
      },
      ifYesClassification: 'HBMD (Strictly Approved Only)',
      rationale: {
        ar: 'فقط في هذه الحالة الصارمة يُطرح HBMD بقرار صريح وشرط عدم وجود دورات (Acyclic) — وفي خط أساس المرحلة 2 لجميع الأنظمة الأربعة النتيجة هي 0 HBMD.',
        en: 'Only then may an explicit, decision-backed, acyclic HBMD be proposed (§4 checklist). In the approved Phase 2 Core baseline, all 12 ordered module pairs are strictly No HBMD (0 edges).',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§4 HBMD ومنع الاعتماد الضمني', en: '§4 HBMD & Non-Implicit Rule' },
        sectionAnchor: 'kh-h-4-hbmd-hard-business-module-dependency',
      },
    },
    {
      stepNumber: 3,
      question: {
        ar: 'هل الاعتماد محصور في ميزة تجارية محددة داخل الوحدة (مثل Stock Sale أو Drop Ship أو Stock Purchase) بينما تبقى الوحدة نفسها قابلة للتفعيل؟',
        en: 'Is the requirement scoped to a specific optional/commercial feature inside the module (e.g., Stock Sale, Drop Ship, Stock Purchase) while base module activation stays intact?',
      },
      ifYesClassification: 'FLD (Feature-Level Dependency)',
      rationale: {
        ar: 'يُصنّف كـ FLD (اعتماد توافر الميزة): غياب الطرف المطلوب يعطّل تلك الميزة فقط دون تعطيل تفعيل الوحدة المصدر (§6 و§10 قاعدة 8).',
        en: 'Classify as FLD (Availability Dependency): unavailability of the peer capability disables only that specific feature while keeping the source module Active (§6 & §10 Rule 8).',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§6 FLD — اعتماديات الميزة', en: '§6 FLD — Feature-Level Dependency' },
        sectionAnchor: 'kh-h-6-fld-feature-level-dependency',
      },
    },
    {
      stepNumber: 4,
      question: {
        ar: 'كيف تتبادل وحدتان مستقلتان المراجع وتنسّقان تنفيذ سيناريو أعمال مشترك بأثر قابل للتدقيق ومنع التكرار ودون نقل ملكية البيانات؟',
        en: 'How do two independently activatable modules exchange references and coordinate a shared business scenario with auditability, idempotency, and preserved ownership?',
      },
      ifYesClassification: 'CIC + Independent Data Ownership',
      rationale: {
        ar: 'يُضبط التعاون عبر CIC (عقد تكامل مشروط)، بينما تظل ملكية السجلات (Data Ownership) مستقلة تمامًا عن تصنيف الاعتماديات (§7 و§9).',
        en: 'Model the collaboration as a CIC (Execution / Integration Contract) while keeping Data Ownership metadata strictly independent of dependency types (§7 & §9).',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§7 الفصل بين FLD وCIC', en: '§7 Official Separation: FLD vs CIC' },
        sectionAnchor: 'kh-h-7-الفصل-الرسمي-بين-fld-وcic',
      },
    },
  ],
  classificationComparisonRows: [
    {
      code: 'PCD',
      decisionQuestion: {
        ar: 'هل الهدف قدرة منصة إلزامية أو هوية/أساس أعمال مشترك تملكه المنصة (وليس Business Module نظيرًا)؟',
        en: 'Is the target a Mandatory Platform Foundation or Shared Business Foundation capability/identity owned by the platform?',
      },
      enforcementBoundary: {
        ar: 'Required ← فحص تفعيل الوحدة وتهيئتها · Conditional (C / C*) ← فحص تفعيل الميزة أو السيناريو · Optional ← لا يمنع.',
        en: 'Required → Module Activation / Configuration · Conditional (C / C*) → Feature / Scenario activation · Optional → Non-blocking.',
      },
      commonMistakes: {
        ar: 'افتراض أن وجود Shared Data (مثل Product أو Party) يعني ملكية وحدة تجارية واحدة له، أو حسم نطاق Tenant مقابل Company قبل المرحلة 3.',
        en: 'Treating Shared Product or Party master data as owned by a single Business Module, or pre-locking Tenant vs Company scope before Phase 3.',
      },
      architecturalImplication: {
        ar: 'تعتمد كل وحدة على قدرات المنصة المطلوبة فقط؛ ويبقى موضع قدرات `C*` (مثل Pricing وCredit) مؤجلاً دون فرض ملكية مبكرة.',
        en: 'Each module declares only its Required/Conditional platform needs; `C*` capabilities (Pricing, Credit) keep final ownership/placement explicitly deferred.',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§3 و§8 — PCD', en: '§3 & §8 — PCD' },
        sectionAnchor: 'kh-h-3-pcd-platform-capability-dependency',
      },
    },
    {
      code: 'HBMD',
      decisionQuestion: {
        ar: 'هل يتوقف تشغيل «القدرة الأساسية المعتمدة» للوحدة بالكامل إذا غاب Business Module آخر — مع مبرر معماري معتمد لعدم كفاية PCD/CIC/FLD؟',
        en: 'Does the dependent module’s approved standalone core fail completely without another Business Module, with formal proof why PCD/CIC/FLD are insufficient?',
      },
      enforcementBoundary: {
        ar: 'Control Plane / Module Activation / Licensing — يمنع تفعيل الوحدة التابعة بالكامل ويمنع إيقاف الوحدة المطلوبة ما دامت التابعة Active.',
        en: 'Control Plane / Module Activation / Licensing — blocks activating the dependent module and blocks deactivating the required module while dependents stay Active.',
      },
      commonMistakes: {
        ar: 'استنتاج HBMD من Foreign Key أو استدعاء API أو اشتراك Event أو جدول قاعدة بيانات مشترك أو ملاحة واجهة أو تدفق أعمال متكرر (§4 قائمة المنع التسع).',
        en: 'Inferring an HBMD from a Foreign Key, API call, event subscription, shared DB object, UI link, shared master data, process flow, or integration need (§4 9-item ban).',
      },
      architecturalImplication: {
        ar: 'يجب أن يبقى مخطط HBMD خاليًا من الدورات (Acyclic)؛ وأي احتياج دائري يُحل بإعادة رسم الحدود أو تحويله إلى CIC/FLD أو قدرة منصة.',
        en: 'HBMD graphs must stay strictly acyclic; any cyclic pressure triggers boundary refactoring into PCD, CIC, or FLD — currently 0 edges across Core.',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§4 HBMD و§10', en: '§4 HBMD & §10 Rules' },
        sectionAnchor: 'kh-h-4-hbmd-hard-business-module-dependency',
      },
    },
    {
      code: 'CIC',
      decisionQuestion: {
        ar: 'هل يحتاج سيناريو مشترك بين وحدات مستقلة إلى تبادل أحداث/مراجع منضبط مع سلوك فشل معلن وقابلية تدقيق ومنع تكرار؟',
        en: 'Does a cross-module business scenario between independent modules require governed reference/event exchange with explicit failure handling, auditability, and idempotency?',
      },
      enforcementBoundary: {
        ar: 'Scenario / Integration Readiness / Runtime Execution — يمنع أو يعلّق السيناريو المشترك فقط بحالة معلنة دون منع تفعيل الوحدات المشاركة.',
        en: 'Scenario / Integration Readiness / Runtime Execution — blocks or suspends only the shared scenario cleanly without blocking module activation.',
      },
      commonMistakes: {
        ar: 'خلطه مع HBMD، أو استخدام مصطلح «Optional Dependency»، أو فرض تفاصيل API/Payload/Transport/Retry داخل عقد Phase 2 المفاهيمي.',
        en: 'Conflating CIC with HBMD, inventing an "Optional Dependency" type, or prematurely specifying API endpoints, payloads, brokers, or retry timers inside Phase 2.',
      },
      architecturalImplication: {
        ar: 'يفصل «توفر الوحدة» عن «جاهزية السيناريو المشترك» ويمنع Silent Success عند تعطل الطرف المستهدف (MODULE_LIFECYCLE_RULES §6).',
        en: 'Decouples module activation from scenario readiness and strictly forbids Silent Success when a target module or contract is unavailable (§6).',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§5 CIC — عقد التكامل المشروط', en: '§5 CIC — Conditional Integration Contract' },
        sectionAnchor: 'kh-h-5-cic-conditional-integration-contract',
      },
    },
    {
      code: 'FLD',
      decisionQuestion: {
        ar: 'هل تحتاج «ميزة محددة» داخل وحدة (مثل Stock Sale أو Drop Ship أو Three-Way Match) إلى وحدة/قدرة نظيرة لتصبح الميزة متاحة وقابلة للتشغيل؟',
        en: 'Does a specific feature inside a module (e.g., Stock Sale, Drop Ship, Three-Way Match) require a peer module or capability to become available and runnable?',
      },
      enforcementBoundary: {
        ar: 'Feature Activation / Feature Configuration / Feature Readiness — يعطّل الميزة المحددة فقط عند غياب المتطلب، ويبقي الوحدة المصدر Active.',
        en: 'Feature Activation / Configuration / Readiness — disables only the dependent feature while leaving the source module Active.',
      },
      commonMistakes: {
        ar: 'ترقية FLD إلى HBMD لمجرد أن الميزة مهمة تجاريًا في قطاع التجزئة أو التوزيع، أو دمجه مع CIC بدلاً من إبقاء FLD للتوافر وCIC للتنفيذ.',
        en: 'Promoting an FLD to an HBMD solely because the feature is commercially vital (e.g., retail stock sales), or collapsing FLD (availability) into CIC (execution).',
      },
      architecturalImplication: {
        ar: 'يحفظ بيع الوحدات منفردة (مثل المبيعات للخدمات والمشتريات للخدمات) مع عزل التبعيات التجارية داخل نطاق الميزة وحدها.',
        en: 'Protects standalone sellability (e.g., Service Sales, Service Procurement) by isolating feature prerequisites away from base module activation.',
      },
      sourceRef: {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: '§6 و§7 — FLD مقابل CIC', en: '§6 & §7 — FLD vs CIC' },
        sectionAnchor: 'kh-h-7-الفصل-الرسمي-بين-fld-وcic',
      },
    },
  ],
  creditCheckAndFldClarification: {
    ar: 'توضيح دلالي حاسم (KH-038 / KH-039 / KH-040): يسجّل القسم 6 من MODULE_DEPENDENCY_MATRIX.md خمس اعتماديات FLD أساسية فقط، ويُشار إليها داخليًا في مركز المعرفة بـ (1) Stock Sale (FLD-CORE-01)، و(2) Customer Billing (FLD-CORE-02)، و(3) Drop Ship (FLD-CORE-03)، و(4) Stock Purchase (FLD-CORE-04)، و(5) Three-Way Match (FLD-CORE-05). أما Credit Check المذكور مفاهيميًا في D-SALES-08 فلا يظهر كصف FLD مستقل في §6، بل يرتبط بقدرة Credit Capability المصنفة C* في مصفوفة PCD (§7.2) حيث تبقى بنية Credit Management وملكيتها مؤجلة للمرحلة 5/6.',
    en: 'Critical Semantic Clarification (KH-038 / KH-039 / KH-040): MODULE_DEPENDENCY_MATRIX.md §6 registers strictly five Core FLD rows (referenced internally in the Knowledge Hub as FLD-CORE-01: Stock Sale, FLD-CORE-02: Customer Billing, FLD-CORE-03: Drop Ship, FLD-CORE-04: Stock Purchase, and FLD-CORE-05: Three-Way Match). Conceptual Credit Check mentioned in D-SALES-08 is NOT a standalone §6 Core FLD row; instead, Credit Capability appears as C* in the PCD Matrix (§7.2) with Credit Management architecture and ownership intentionally deferred to Phase 5/6.',
  },
};

const CIC_GUIDANCE_BY_ID: Readonly<Record<string, CoreCicEducationalGuidance>> = {
  'CIC-CORE-INV-FIN-001': {
    contractId: 'CIC-CORE-INV-FIN-001',
    whyIntegrationExists: {
      ar: 'لماذا يوجد التكامل: يعمل المخزون مستقلًا لتتبع الكميات والحركات التشغيلية (D-INV-01)، بينما تملك المالية الأستاذ العام حصريًا (D-FIN-04). وعند تفعيل الوحدتين معًا في منشأة واحدة، يجب أن تعبّر الحركات المخزنية ذات الصلة المالية عن أثرها المحاسبي عبر عقد منضبط دون منح المخزون كتابة مباشرة على GL ودون جعل المالية شرط تفعيل للمخزون.',
      en: 'Why It Exists: Inventory operates independently for physical quantities and warehouse movements (D-INV-01), whereas Finance exclusively owns General Ledger posting (D-FIN-04). When both modules are active together, financially relevant movements must trigger Finance-owned ledger effects through a governed contract—without direct GL writes from Inventory or creating an HBMD.',
    },
    auditAndIdempotencyPrincipleNote: {
      ar: 'يتطلب العقد ارتباط تتبع صريحًا (Correlation) بين حركة المخزون والأثر المالي، ويمنع توليد قيود متكررة لنفس حدث الحركة (مع بقاء آلية المفاتيح/المعالجة التقنية خارج Phase 2).',
      en: 'Requires explicit end-to-end correlation between the source Inventory Movement and the resulting financial record, and forbids duplicate financial effects for the same source movement event (technical mechanism deferred).',
    },
    deferredDesignDecisions: {
      ar: 'تبقى مؤجلة للمرحلة 5/6: طرق التقييم والتكلفة (Costing/Valuation كـ FIFO/AVCO)، مالك احتساب التكلفة، الرصيد الافتتاحي المالي عند تفعيل المالية لاحقًا، وتوقيت الترحيل (Real-Time أم Event/Batch) وواجهات API/Payload/Retry.',
      en: 'Deferred to Phase 5/6: Costing/Valuation methods and ownership, opening valuation when Finance activates after Inventory-only usage, real-time vs event/batch posting cadence, and API/payload/retry specifications.',
    },
    sourceRefs: [
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §5.1 CIC-CORE-INV-FIN-001', en: 'Matrix §5.1 CIC-CORE-INV-FIN-001' },
        sectionAnchor: 'kh-h-51-cic-core-inv-fin-001-inventory-finance',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'قواعد دورة الحياة §6 جاهزية CIC', en: 'Lifecycle §6 CIC Runtime Readiness' },
        sectionAnchor: 'kh-h-6-cic-runtime-readiness',
      },
      {
        documentSlug: 'inventory-module-model',
        sectionLabel: { ar: 'المخزون §6.1 وD-INV-06', en: 'Inventory §6.1 & D-INV-06' },
        sectionAnchor: 'kh-h-61-inventory-finance',
      },
      {
        documentSlug: 'finance-module-model',
        sectionLabel: { ar: 'المالية §6.1 المالية ↔ المخزون', en: 'Finance §6.1 Finance ↔ Inventory' },
        sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management',
      },
    ],
  },
  'CIC-CORE-PROC-INV-001': {
    contractId: 'CIC-CORE-PROC-INV-001',
    whyIntegrationExists: {
      ar: 'لماذا يوجد التكامل: المشتريات قادرة على العمل مستقلّة لشراء الخدمات والمصاريف (D-PROC-06)، والمخزون يدير الكميات دون الحاجة للمشتريات (D-INV-01). وعند شراء صنف مخزني (Stock Purchase FLD: FLD-CORE-04)، ينسق هذا العقد الاستلام الفعلي مقابل أمر الشراء (PO) بحيث يظل PO مملوكًا للمشتريات وتظل حركة الاستلام والـ On-hand مملوكة للمخزون.',
      en: 'Why It Exists: Procurement operates standalone for services and expenses (D-PROC-06), while Inventory tracks stock independently (D-INV-01). When purchasing stock items (Stock Purchase FLD: FLD-CORE-04), this contract links receiving against a Procurement-owned PO to an Inventory-owned receipt movement without transferring PO ownership to Inventory.',
    },
    auditAndIdempotencyPrincipleNote: {
      ar: 'يفرض العقد تتبعًا ثنائيًا بين سطر PO وحركة الاستلام المخزني، ويمنع تكرار زيادة On-hand لنفس حدث الاستلام، مع حظر تحديث الرصيد بصمت دون حالة استلام صالحة.',
      en: 'Mandates bidirectional traceability between the PO line and the Receipt/Inventory Movement, prevents duplicate On-hand increases for the same receipt event, and bans silent stock updates without valid receipt confirmation.',
    },
    deferredDesignDecisions: {
      ar: 'تبقى مؤجلة للمرحلة 5/6: تفاصيل تنسيق الاستلام (Partial/Over-receipt، Quality Inspection، Return to Vendor)، تنسيق Three-Way Match (FLD-CORE-05)، وتفاصيل API/Transport/Retry.',
      en: 'Deferred to Phase 5/6: Receiving orchestration details (partial/over-receipt, inspection, returns), Three-Way Match orchestration (FLD-CORE-05), and API/transport/retry implementation.',
    },
    sourceRefs: [
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §5.2 CIC-CORE-PROC-INV-001', en: 'Matrix §5.2 CIC-CORE-PROC-INV-001' },
        sectionAnchor: 'kh-h-52-cic-core-proc-inv-001-procurement-inventory',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'قواعد دورة الحياة §6 جاهزية CIC', en: 'Lifecycle §6 CIC Runtime Readiness' },
        sectionAnchor: 'kh-h-6-cic-runtime-readiness',
      },
      {
        documentSlug: 'procurement-module-model',
        sectionLabel: { ar: 'المشتريات §7.2 و§8 ملكية PO', en: 'Procurement §7.2 & §8 PO Ownership' },
        sectionAnchor: 'kh-h-72-procurement-inventory',
      },
      {
        documentSlug: 'inventory-module-model',
        sectionLabel: { ar: 'المخزون §6.2 المخزون ↔ المشتريات', en: 'Inventory §6.2 Inventory ↔ Procurement' },
        sectionAnchor: 'kh-h-62-inventory-procurement',
      },
    ],
  },
  'CIC-CORE-PROC-FIN-001': {
    contractId: 'CIC-CORE-PROC-FIN-001',
    whyIntegrationExists: {
      ar: 'لماذا يوجد التكامل: المشتريات تملك القرار التجاري الشرائي وأوامر الشراء وقبول الخدمات، لكنها لا تملك فواتير الموردين المالية ولا الذمم الدائنة (AP) ولا السداد ولا GL (D-PROC-05). يربط هذا العقد مراجع الشراء وقبول الخدمات بالمعالجة المالية في Finance دون فرض HBMD على المشتريات عند التشغيل التجاري فقط.',
      en: 'Why It Exists: Procurement owns commercial purchasing decisions, POs, and service acceptance, whereas Finance owns Supplier Invoices, Accounts Payable (AP), liabilities, payments, and GL (D-PROC-05). This contract passes purchasing/acceptance references to Finance for AP/financial processing without blocking standalone operational Procurement.',
    },
    auditAndIdempotencyPrincipleNote: {
      ar: 'يوثق ترابطًا تدقيقيًا بين مراجع الشراء/قبول الخدمات وسجلات الذمم الدائنة المالية، ويمنع توليد أثر AP أو التزام مالي مكرر لنفس مرجع العملية/الفاتورة، ويمنع نجاح السيناريو صمتًا في غياب Finance.',
      en: 'Maintains audit traceability between Procurement/service-acceptance references and Finance AP records, ensures idempotency against duplicate liability postings, and forbids silent financial success when Finance is unavailable.',
    },
    deferredDesignDecisions: {
      ar: 'تبقى مؤجلة للمرحلة 5/6: ملكية وتنسيق Invoice Matching ومالك Three-Way Match (FLD-CORE-05: Owner Deferred)، توزيع صفات المورد التفصيلية بين السياق التجاري والمالي، وLanded Cost وتفاصيل API/Payload.',
      en: 'Deferred to Phase 5/6: Invoice Matching ownership/orchestration and Three-Way Match owner (FLD-CORE-05), granular commercial vs financial supplier attributes, landed cost boundaries, and API/payload design.',
    },
    sourceRefs: [
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §5.3 CIC-CORE-PROC-FIN-001', en: 'Matrix §5.3 CIC-CORE-PROC-FIN-001' },
        sectionAnchor: 'kh-h-53-cic-core-proc-fin-001-procurement-finance',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'قواعد دورة الحياة §6 جاهزية CIC', en: 'Lifecycle §6 CIC Runtime Readiness' },
        sectionAnchor: 'kh-h-6-cic-runtime-readiness',
      },
      {
        documentSlug: 'procurement-module-model',
        sectionLabel: { ar: 'المشتريات §7.1 و§14 المطابقة المؤجلة', en: 'Procurement §7.1 & §14 Deferred Matching' },
        sectionAnchor: 'kh-h-71-procurement-finance',
      },
      {
        documentSlug: 'finance-module-model',
        sectionLabel: { ar: 'المالية §6.2 المالية ↔ المشتريات', en: 'Finance §6.2 Finance ↔ Procurement' },
        sectionAnchor: 'kh-h-62-finance-procurement',
      },
    ],
  },
  'CIC-CORE-SALES-INV-001': {
    contractId: 'CIC-CORE-SALES-INV-001',
    whyIntegrationExists: {
      ar: 'لماذا يوجد التكامل: لأن المبيعات تملك أمر البيع والكمية المطلوبة تجاريًا، بينما حُسم في D-SALES-06 (ومزامنة D-INV) أن المخزون هو المالك الحصري للرصيد الفعلي (On-hand) وسجل الحجز المخزني (Reservation Record) وحركات الصرف. هذا العقد يمكّن ميزة Stock Sale (FLD-CORE-01) من طلب الحجز وتلقي حالة التنفيذ دون أن تعدّل المبيعات المخزون مباشرة ودون تعطيل بيع الخدمات المستقل (D-SALES-10).',
      en: 'Why It Exists: Sales owns the Sales Order and commercial ordered quantity, whereas D-SALES-06 (synchronized with Inventory) settled that Inventory exclusively owns On-hand Quantity, Physical Reservation Records, and Goods Issue movements. This contract enables Stock Sale (FLD-CORE-01) without granting Sales direct stock mutation or breaking standalone Service Sales (D-SALES-10).',
    },
    auditAndIdempotencyPrincipleNote: {
      ar: 'يفرض أثرًا تدقيقيًا واضحًا بين سطر أمر البيع وسجل الحجز/حركة الصرف في المخزون، ويمنع تكرار الحجز أو الصرف عند تكرار نفس الطلب، مع منع Sales من تعديل On-hand مباشرة.',
      en: 'Mandates full audit correlation between Sales Order lines and Inventory Reservations/Movements, enforces idempotent reservation/fulfillment handling, and strictly blocks direct On-hand edits by Sales.',
    },
    deferredDesignDecisions: {
      ar: 'تبقى مؤجلة للمرحلة 5/6: خوارزميات Soft مقابل Hard Reservation وأولوية التخصيص (Allocation Priority)، تفاصيل تنسيق الشحن (Shipment Orchestration)، وتصميم Order Orchestration وتفاصيل API/Transport.',
      en: 'Deferred to Phase 5/6: Soft vs Hard reservation algorithms and allocation priority, detailed shipment orchestration, Order Orchestration service placement, and API/transport design.',
    },
    sourceRefs: [
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §5.4 CIC-CORE-SALES-INV-001', en: 'Matrix §5.4 CIC-CORE-SALES-INV-001' },
        sectionAnchor: 'kh-h-54-cic-core-sales-inv-001-sales-inventory',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'قواعد دورة الحياة §6 جاهزية CIC', en: 'Lifecycle §6 CIC Runtime Readiness' },
        sectionAnchor: 'kh-h-6-cic-runtime-readiness',
      },
      {
        documentSlug: 'sales-order-management-module-model',
        sectionLabel: { ar: 'المبيعات §7 ملكية الحجز المخزني', en: 'Sales §7 Reservation Ownership' },
        sectionAnchor: 'kh-h-reservation-ownership',
      },
      {
        documentSlug: 'inventory-module-model',
        sectionLabel: { ar: 'المخزون §6.3 المخزون ↔ المبيعات', en: 'Inventory §6.3 Inventory ↔ Sales' },
        sectionAnchor: 'kh-h-63-inventory-sales',
      },
    ],
  },
  'CIC-CORE-SALES-FIN-001': {
    contractId: 'CIC-CORE-SALES-FIN-001',
    whyIntegrationExists: {
      ar: 'لماذا يوجد التكامل: تملك المبيعات الالتزام التجاري تجاه العميل ونية الفوترة، بينما تملك المالية الذمم المدينة (AR) والتحصيل والاعتراف المحاسبي بالإيراد والأستاذ العام (D-SALES-06 / D-FIN-04). يحقق العقد تدفق الفوترة المالية لميزة Customer Billing (FLD-CORE-02) عند توفر Finance دون فرض Finance كـ HBMD على أوامر البيع وعروض الأسعار (خروج مقصود عن تشابك Odoo).',
      en: 'Why It Exists: Sales owns commercial commitments and billing intent, whereas Finance exclusively owns AR, collections, revenue posting, and GL (D-SALES-06 / D-FIN-04). This contract enables Customer Billing (FLD-CORE-02) when Finance is active while keeping Finance out of Sales base module activation (intentionally decoupling from Odoo-style cross-module locks).',
    },
    auditAndIdempotencyPrincipleNote: {
      ar: 'يربط مصدر البيع التجاري بالسجل المالي النهائي في المالية بتتبع كامل، ويمنع ازدواجية قيد الذمم المدينة أو الإيراد لنفس مرجع الفوترة، ويرفض النجاح الصامت عند غياب المالية.',
      en: 'Links Sales commercial source references to Finance AR/revenue records for auditability, prevents duplicate AR/revenue postings for the same billing reference, and forbids silent billing success without Finance.',
    },
    deferredDesignDecisions: {
      ar: 'تبقى مؤجلة للمرحلة 5/6: حد توليد كائن فاتورة العميل (Customer Invoice Generation Boundary — مبيعات أم مالية)، موضع Pricing Engine وبنية Credit Management (C*)، وتوزيع صفات العميل التفصيلية، وتفاصيل API/Payload.',
      en: 'Deferred to Phase 5/6: Customer Invoice Generation Boundary (Sales vs Finance object creation), Pricing Engine & Credit Management architecture (C*), granular customer attribute ownership, and API/payload design.',
    },
    sourceRefs: [
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §5.5 CIC-CORE-SALES-FIN-001', en: 'Matrix §5.5 CIC-CORE-SALES-FIN-001' },
        sectionAnchor: 'kh-h-55-cic-core-sales-fin-001-sales-finance',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'قواعد دورة الحياة §6 جاهزية CIC', en: 'Lifecycle §6 CIC Runtime Readiness' },
        sectionAnchor: 'kh-h-6-cic-runtime-readiness',
      },
      {
        documentSlug: 'sales-order-management-module-model',
        sectionLabel: { ar: 'المبيعات §6 المبيعات ↔ المالية', en: 'Sales §6 Sales ↔ Finance' },
        sectionAnchor: 'kh-h-6-sales-finance-boundary',
      },
      {
        documentSlug: 'finance-module-model',
        sectionLabel: { ar: 'المالية §6.3 المالية ↔ المبيعات', en: 'Finance §6.3 Finance ↔ Sales' },
        sectionAnchor: 'kh-h-63-finance-sales-order-management',
      },
    ],
  },
  'CIC-CORE-SALES-PROC-001': {
    contractId: 'CIC-CORE-SALES-PROC-001',
    whyIntegrationExists: {
      ar: 'لماذا يوجد التكامل: في سيناريوهات الشحن المباشر من المورد للعميل (Drop Ship / Direct Delivery / Back-to-Back)، تبقى المبيعات مالكة لالتزام العميل ونية التوريد، بينما تملك المشتريات أمر الشراء والقرار التجاري تجاه المورد (D-SALES-07 / D-PROC-07). يفصل هذا العقد (مع FLD-CORE-03) بين نية التوريد وملكية الـ PO دون تحويل المشتريات إلى HBMD على المبيعات.',
      en: 'Why It Exists: In Drop Ship, Direct Delivery, and Back-to-Back workflows, Sales retains customer order ownership and supply intent, while Procurement retains PO creation and supplier commercial authority (D-SALES-07 / D-PROC-07). Paired with FLD-CORE-03, this contract isolates supply coordination without making Procurement an HBMD on Sales.',
    },
    auditAndIdempotencyPrincipleNote: {
      ar: 'يفرض تتبعًا واضحًا بين طلب التوريد على سطر أمر البيع ومرجع طلب/أمر الشراء في المشتريات، ويمنع إنشاء أوامر شراء مكررة لنفس طلب التوريد، بينما تظل قدرة Sales الأساسية عاملة لو تعطل Drop Ship.',
      en: 'Enforces traceability between Sales supply requests and Procurement requests/POs, prevents duplicate PO creation for the same supply request, and keeps core Sales operational if Drop Ship cannot execute.',
    },
    deferredDesignDecisions: {
      ar: 'تبقى مؤجلة للمرحلة 5/6: آلية تنفيذ تنسيق الطلبات (Order Orchestration داخل Sales أم خدمة مستقلة)، سياسات تعديل/إلغاء Drop Ship المتزامن بين العميل والمورد، وتفاصيل API/Event/Retry.',
      en: 'Deferred to Phase 5/6: Order Orchestration implementation topology (Sales-internal vs dedicated service), synchronized customer/supplier change-cancellation policies, and API/event/retry mechanics.',
    },
    sourceRefs: [
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §5.6 CIC-CORE-SALES-PROC-001', en: 'Matrix §5.6 CIC-CORE-SALES-PROC-001' },
        sectionAnchor: 'kh-h-56-cic-core-sales-proc-001-sales-procurement',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'قواعد دورة الحياة §6 جاهزية CIC', en: 'Lifecycle §6 CIC Runtime Readiness' },
        sectionAnchor: 'kh-h-6-cic-runtime-readiness',
      },
      {
        documentSlug: 'sales-order-management-module-model',
        sectionLabel: { ar: 'المبيعات §8 المبيعات ↔ المشتريات', en: 'Sales §8 Sales ↔ Procurement' },
        sectionAnchor: 'kh-h-8-sales-procurement-boundary',
      },
      {
        documentSlug: 'procurement-module-model',
        sectionLabel: { ar: 'المشتريات §7.3 المشتريات ↔ المبيعات', en: 'Procurement §7.3 Procurement ↔ Sales' },
        sectionAnchor: 'kh-h-73-procurement-sales',
      },
    ],
  },
};

const OWNERSHIP_GUIDE: DataOwnershipDesignGuide = {
  schemaBoundaryNotice: {
    ar: 'دليل تصميم ملكية البيانات (مستوى الحدود المعمارية للمرحلة 2 فقط): يوضح قواعد فصل مصدر الحقيقة وحق التعديل، ولا يستنتج جداول قاعدة بيانات أو حقول كيانات أو مخططات تنفيذية (مؤجلة للمرحلة 14+).',
    en: 'Conceptual Data Ownership Design Guide (Phase 2 architectural boundary level only): clarifies Source-of-Truth and mutation authority principles without inferring database schemas, tables, or entity specifications.',
  },
  distinctions: [
    {
      id: 'shared-identity-vs-context',
      title: {
        ar: '1. الهوية المشتركة مقابل سياق العمل الخاص بكل وحدة (Shared Identity vs Business Context)',
        en: '1. Shared Identity vs Domain Business Context',
      },
      ruleSummary: {
        ar: 'تملك المنصة المشتركة الهوية الجوهرية للطرف والمنتج (OWN-CORE-01 وOWN-CORE-02)، بينما تملك كل وحدة تجارية سياقها الخاص فقط (تجاري في المبيعات/المشتريات، مالي في المالية، تشغيلي مخزني في المخزون).',
        en: 'Shared Platform owns core Party and Product/Item/Service identities (OWN-CORE-01, OWN-CORE-02), while each Business Module owns only its domain-specific context (commercial sales/purchasing, financial AP/AR, or operational inventory context).',
      },
      architecturalRationale: {
        ar: 'يمنع تكرار سجلات العملاء والموردين والأصناف عبر الوحدات، ويحول دون حذف بيانات مشتركة إذا تم تجميد وحدة مستهلكة واحدة (MODULE_LIFECYCLE_RULES §12).',
        en: 'Prevents duplicated customer/supplier/item masters across modules and ensures freezing one consuming module never deletes shared identity records (MODULE_LIFECYCLE_RULES §12).',
      },
      antiPatternToAvoid: {
        ar: 'جعل المخزون مالكًا لـ Product Catalog أو جعل المبيعات مالكةً لسجل العميل الشامل، ما يمنع بيع الخدمات أو تشغيل المالية منفردة.',
        en: 'Treating Inventory as owner of Product Catalog or Sales as sole owner of Customer Master, which breaks standalone Service Sales and standalone Finance.',
      },
      relatedOwnIds: ['OWN-CORE-01', 'OWN-CORE-02'],
      sourceRefs: [
        {
          documentSlug: 'module-dependency-matrix',
          sectionLabel: { ar: 'المصفوفة §8 ملكية البيانات', en: 'Matrix §8 Data Ownership' },
          sectionAnchor: 'kh-h-8-data-ownership-cross-reference-ليس-dependency-register',
        },
        {
          documentSlug: 'module-lifecycle-rules',
          sectionLabel: { ar: 'دورة الحياة §12 سلامة البيانات المشتركة', en: 'Lifecycle §12 Shared Data Safety' },
          sectionAnchor: 'kh-h-12-shared-data-safety',
        },
      ],
    },
    {
      id: 'authoritative-ownership-vs-consumption',
      title: {
        ar: '2. الملكية السلطوية مقابل استهلاك المراجع (Authoritative Ownership vs Reference Consumption)',
        en: '2. Authoritative Ownership vs Reference Consumption',
      },
      ruleSummary: {
        ar: 'يملك الكائن مصدر حقيقة واحد وسلطة تعديل واحدة (Mutation Authority) في المرحلة 2؛ أما الوحدات الأخرى فتقرأه كمرجع أو تتفاعل معه عبر CIC دون كتابة مباشرة ودون أن يخلق الاستهلاك HBMD.',
        en: 'Each object has one Phase 2 Source of Truth and Mutation Authority. Peer modules consume references or collaborate via CICs without direct mutation, and reference consumption never creates an HBMD (DEPENDENCY_MODEL §9).',
      },
      architecturalRationale: {
        ar: 'تثبيت سلطة التعديل لدى مالك واحد يحمي سلامة التدقيق ويسمح بإغلاق وحدة أو استبدال سياق تكاملي دون تضارب كتابة متعدد المصادر.',
        en: 'Single-domain mutation authority preserves audit integrity and avoids multi-writer race conditions across independent module boundaries.',
      },
      antiPatternToAvoid: {
        ar: 'افتراض أن وجود Foreign Key أو قراءة مرجع Sales Order داخل المخزون أو المالية يعني تبعية تفعيل صلبة (HBMD) أو حق تعديل متبادل.',
        en: 'Assuming a reference link to Sales Order or PO inside Inventory/Finance creates an HBMD or grants cross-module write privileges.',
      },
      relatedOwnIds: ['OWN-CORE-03', 'OWN-CORE-04', 'OWN-CORE-09', 'OWN-CORE-10'],
      sourceRefs: [
        {
          documentSlug: 'dependency-model',
          sectionLabel: { ar: 'نموذج الاعتماديات §9 استقلالية الملكية', en: 'Dependency Model §9 Ownership Independence' },
          sectionAnchor: 'kh-h-9-data-ownership-metadata-مستقل-عن-dependency-types',
        },
      ],
    },
    {
      id: 'transaction-ownership-vs-coordination',
      title: {
        ar: '3. ملكية المعاملة التجارية مقابل تنسيق الدورة (Transaction Ownership vs Coordination)',
        en: '3. Transaction Ownership vs Process Coordination',
      },
      ruleSummary: {
        ar: 'تملك المبيعات معاملة Sales Order والكمية المطلوبة تجاريًا ونية التنسيق (D-SALES-07)، وتملك المشتريات معاملة Purchase Order؛ لكن «من ينسّق السيناريو» لا يمتلك سجلات التنفيذ داخل الوحدات النظيرة.',
        en: 'Sales owns the Sales Order, ordered quantities, and coordination intent (D-SALES-07), and Procurement owns the PO; however, coordinating a multi-step flow never transfers ownership of peer execution records.',
      },
      architecturalRationale: {
        ar: 'الفصل بين النية التجارية (Intent) ونتيجة التنفيذ الفعلي (Execution Record) يمنع تشابك Order-to-Cash وProcure-to-Pay في وحدة عملاقة غير قابلة للبيع المستقل.',
        en: 'Separating commercial coordination intent from peer execution records prevents O2C/P2P workflows from collapsing into tightly coupled monoliths.',
      },
      antiPatternToAvoid: {
        ar: 'إسناد Reservation Record أو Drop-Ship PO أو Customer AR Ledger لملكية المبيعات لمجرد أن أمر البيع هو الذي بدأ السيناريو.',
        en: 'Assigning Reservation Records, Drop-Ship POs, or AR Ledger rows to Sales merely because the Sales Order initiated the workflow.',
      },
      relatedOwnIds: ['OWN-CORE-03', 'OWN-CORE-04', 'OWN-CORE-07', 'OWN-CORE-15'],
      sourceRefs: [
        {
          documentSlug: 'sales-order-management-module-model',
          sectionLabel: { ar: 'المبيعات §10 حدود تنسيق الطلب', en: 'Sales §10 Order Coordination Boundary' },
          sectionAnchor: 'kh-h-10-order-coordination-orchestration-boundary',
        },
        {
          documentSlug: 'phase-2-closure-review',
          sectionLabel: { ar: 'مراجعة الإغلاق §5 خط أساس الملكية', en: 'Closure Review §5 Ownership Baseline' },
          sectionAnchor: 'kh-h-5-core-ownership-baseline',
        },
      ],
    },
    {
      id: 'physical-quantity-vs-financial-effect',
      title: {
        ar: '4. الكمية الفيزيائية والحركة مقابل الأثر المالي (Physical Quantity vs Financial Effect)',
        en: '4. Physical Quantity & Movement vs Financial Effect',
      },
      ruleSummary: {
        ar: 'المخزون هو المالك الحصري للكمية الفعلية (On-hand) والحركات المخزنية وسجل الحجز (D-INV-04/06 وD-SALES-06)، بينما المالية هي المالك الحصري للترحيل للأستاذ العام (GL) والذمم والمدفوعات (D-FIN-04).',
        en: 'Inventory exclusively owns On-hand Quantity, Inventory Movements, and Reservation Records (D-INV-04/06, D-SALES-06), whereas Finance exclusively owns Financial Ledger Posting, AP/AR, and Payments (D-FIN-04).',
      },
      architecturalRationale: {
        ar: 'يتيح ذلك تشغيل المخزون لتتبع الكميات دون تفعيل المالية، وتشغيل المالية للمحاسبة والذمم دون تفعيل المخزون، ثم دمجهما عبر CIC-CORE-INV-FIN-001 عند الحاجة.',
        en: 'Allows Inventory to run quantity operations without Finance and Finance to run core accounting without Inventory, bridging both cleanly via CIC-CORE-INV-FIN-001 when co-activated.',
      },
      antiPatternToAvoid: {
        ar: 'السماح للمخزون أو المبيعات أو المشتريات بكتابة قيود مباشرة في الأستاذ العام، أو جعل المالية تعدّل الرصيد الكمي الفعلي في المستودع.',
        en: 'Allowing Inventory, Sales, or Procurement to write GL entries directly, or allowing Finance to mutate physical warehouse On-hand quantities.',
      },
      relatedOwnIds: ['OWN-CORE-05', 'OWN-CORE-06', 'OWN-CORE-07', 'OWN-CORE-08', 'OWN-CORE-09', 'OWN-CORE-10', 'OWN-CORE-11'],
      sourceRefs: [
        {
          documentSlug: 'inventory-module-model',
          sectionLabel: { ar: 'المخزون D-INV-06 الحد الكمي مقابل المالي', en: 'Inventory D-INV-06 Quantity vs GL' },
          sectionAnchor: 'kh-h-d-inv-06-quantity-vs-financial-posting-boundary',
        },
        {
          documentSlug: 'finance-module-model',
          sectionLabel: { ar: 'المالية D-FIN-04 حدود التكامل', en: 'Finance D-FIN-04 Conditional Integration' },
          sectionAnchor: 'kh-h-d-fin-04-conditional-integration-boundaries',
        },
      ],
    },
    {
      id: 'deferred-ownership-boundaries',
      title: {
        ar: '5. حدود الملكية المؤجلة عمدًا (Deferred Ownership Boundaries)',
        en: '5. Intentionally Deferred Ownership Boundaries',
      },
      ruleSummary: {
        ar: 'أبقت المرحلة 2 أربعة كائنات حدودية صريحة بوسم Deferred Boundary (OWN-CORE-12..15: توليد فاتورة العميل، تنسيق مطابقة الفواتير، محرك التسعير، وتنفيذ Orchestration) بالإضافة إلى بنية الائتمان (C*) وملكية التقييم/التكلفة؛ ولا يجوز حسم مالكها قسريًا في عروض التوثيق.',
        en: 'Phase 2 intentionally keeps four explicit cross-reference boundaries as Deferred Boundary (OWN-CORE-12..15: Customer Invoice Generation, Invoice Matching orchestration, Pricing Engine, Order Orchestration implementation) plus Credit Management (C*) and Costing/Valuation until Phases 5/6.',
      },
      architecturalRationale: {
        ar: 'كلا النهجين في الأنظمة العالمية (مثلاً توليد فاتورة العميل في المبيعات أم المالية، أو التسعير المشترك مقابل الداخلي) مقبولان، والحسم المتسرع في Phase 2 سيقيد Phase 3 (Tenancy/Org) وPhase 5 (APIs/Events).',
        en: 'Multiple valid enterprise patterns exist (e.g., Sales-side vs Finance-side commercial invoice generation, or shared vs module-local Pricing). Locking them prematurely would constrain Phase 3 org scoping and Phase 5 event contracts.',
      },
      antiPatternToAvoid: {
        ar: 'نسب ملكية Credit Management أو Customer Invoice Generation أو Three-Way Match إلى وحدة واحدة كأنها قرار منتهٍ في المرحلة 2.',
        en: 'Prematurely attributing unresolved Credit Management, Customer Invoice Generation, or Three-Way Match ownership as settled Phase 2 fact.',
      },
      relatedOwnIds: ['OWN-CORE-12', 'OWN-CORE-13', 'OWN-CORE-14', 'OWN-CORE-15'],
      sourceRefs: [
        {
          documentSlug: 'phase-2-closure-review',
          sectionLabel: { ar: 'مراجعة الإغلاق §9 الالتزامات المؤجلة', en: 'Closure Review §9 Deferred Commitments' },
          sectionAnchor: 'kh-h-9-deferred-architecture-commitments-ليست-blockers',
        },
        {
          documentSlug: 'module-dependency-matrix',
          sectionLabel: { ar: 'المصفوفة §11 ما لا تغلقه الوثيقة', en: 'Matrix §11 Out-of-Scope Closures' },
          sectionAnchor: 'kh-h-11-ما-لا-تغلقه-هذه-الوثيقة',
        },
      ],
    },
  ],
  architectChecklist: [
    {
      stepNumber: 1,
      question: {
        ar: 'هل المفهوم هوية أعمال أساسية مشتركة بين عدة وحدات (مثل طرف أو منتج)؟',
        en: 'Is the concept a cross-cutting foundational identity consumed by multiple modules (e.g., Party or Product)?',
      },
      guidance: {
        ar: 'ضعه في Shared Platform Foundation مع فصل سياق كل وحدة عنه.',
        en: 'Place identity in Shared Platform Foundation and isolate module-specific contexts.',
      },
    },
    {
      stepNumber: 2,
      question: {
        ar: 'أي وحدة ستظل مسؤولة عن القيد أو الكمية أو القرار حتى عند تجميد بقية الوحدات؟',
        en: 'Which single module remains authoritative for the decision, quantity, or ledger entry if peer modules are inactive or frozen?',
      },
      guidance: {
        ar: 'تلك الوحدة هي المالك السلطوي الوحيد (Mutation Authority) دون كتابة مباشرة من غيرها.',
        en: 'That module holds exclusive Mutation Authority; peers interact only via references/CICs.',
      },
    },
    {
      stepNumber: 3,
      question: {
        ar: 'هل الخلط ناتج عن إطلاق العملية مقابل تسجيل أثرها المادي أو المحاسبي؟',
        en: 'Is confusion arising between initiating/coordinating a business step vs recording its physical or accounting outcome?',
      },
      guidance: {
        ar: 'افصل Coordination Intent (مثل Sales Order / PO) عن التنفيذ المادي (Inventory) والأثر المالي (Finance).',
        en: 'Separate commercial Coordination Intent (SO/PO) from physical records (Inventory) and financial ledger records (Finance).',
      },
    },
    {
      stepNumber: 4,
      question: {
        ar: 'هل تتعلق المسألة بكائن وسطي بيني أو بسياسة تنفيذية لم تحسمها المرحلة 2؟',
        en: 'Does the boundary involve an intermediate cross-domain object or runtime placement intentionally deferred in Phase 2?',
      },
      guidance: {
        ar: 'وسّمه صراحةً كـ Deferred Boundary ولا تختلق مالكًا مؤقتًا أو بنية جدول بيانات.',
        en: 'Mark it explicitly as Deferred Boundary rather than inventing interim owners or database schemas.',
      },
    },
  ],
};

const EDUCATIONAL_EXAMPLES: readonly ConceptualEducationalExample[] = [
  {
    id: 'ex-po-vs-physical-receipt',
    placement: 'ownership',
    title: {
      ar: 'مثال مفاهيمي 1: لماذا لا يملك أمر الشراء (PO) حركة الاستلام المخزني؟',
      en: 'Conceptual Example 1: Why a Purchase Order Does Not Own the Physical Receipt',
    },
    scenarioSummary: {
      ar: 'مثال تعليمي: تُنشئ المشتريات أمر شراء (PO) لصنف مخزني بكمية مطلوبة 100 وحدة؛ لاحقًا يصل 60 وحدة إلى المستودع ثم 40 وحدة في شحنة ثانية (أو قد يشتري النظام خدمة استشارية بدون مستودع إطلاقًا).',
      en: 'Educational Example: Procurement issues a Purchase Order for 100 units of a stock item; the warehouse later receives 60 units in one delivery and 40 in another (or Procurement orders a consulting service with zero warehouse involvement).',
    },
    boundaryRule: {
      ar: 'تملك المشتريات مستند Purchase Order والقرار التجاري والكمية المطلوبة/المتوقعة (OWN-CORE-04)، بينما يملك المخزون حركة الاستلام الفعلي والكمية المتوفرة فعليًا On-hand (OWN-CORE-05 / OWN-CORE-06). يرتبط الاستلام بالـ PO كمرجع عبر CIC-CORE-PROC-INV-001 فقط (D-PROC-05 وD-INV-04).',
      en: 'Procurement owns the Purchase Order, commercial purchasing commitment, and ordered/expected quantity (OWN-CORE-04), while Inventory exclusively owns the Receipt Movement and On-hand Quantity (OWN-CORE-05 / OWN-CORE-06). The receipt references the PO via CIC-CORE-PROC-INV-001 only (D-PROC-05, D-INV-04).',
    },
    architecturalConsequenceIfViolated: {
      ar: 'لو ملكت المشتريات حركة الاستلام الفعلي لتكرر منطق المستودعات ولأصبحت المشتريات غير قابلة للانفصال عن المخزون في شراء الخدمات والمصاريف (بالمخالفة لـ D-PROC-06).',
      en: 'If Procurement owned physical receipt movements, warehouse stock balances would split across modules and standalone Service/Expense Procurement (D-PROC-06) would collapse.',
    },
    relatedIdentifiers: ['D-PROC-05', 'D-PROC-06', 'D-INV-04', 'CIC-CORE-PROC-INV-001', 'OWN-CORE-04', 'OWN-CORE-05', 'OWN-CORE-06'],
    sourceRefs: [
      {
        documentSlug: 'procurement-module-model',
        sectionLabel: { ar: 'المشتريات D-PROC-05 و§8 ملكية PO', en: 'Procurement D-PROC-05 & §8 PO Ownership' },
        sectionAnchor: 'kh-h-d-proc-05-procurement-document-physicalfinancial-boundaries',
      },
      {
        documentSlug: 'procurement-module-model',
        sectionLabel: { ar: 'المشتريات §6 حدود المنتج', en: 'Procurement §6 Product Boundary' },
        sectionAnchor: 'kh-h-6-product-item-dependency-boundary',
      },
      {
        documentSlug: 'inventory-module-model',
        sectionLabel: { ar: 'المخزون §6.2 المخزون ↔ المشتريات', en: 'Inventory §6.2 Inventory ↔ Procurement' },
        sectionAnchor: 'kh-h-62-inventory-procurement',
      },
    ],
  },
  {
    id: 'ex-sales-order-vs-inventory',
    placement: 'ownership',
    title: {
      ar: 'مثال مفاهيمي 2: لماذا لا يملك أمر البيع (Sales Order) كميات المخزون أو سجل الحجز؟',
      en: 'Conceptual Example 2: Why a Sales Order Does Not Own Inventory Quantities or Reservations',
    },
    scenarioSummary: {
      ar: 'مثال تعليمي: يؤكد فريق المبيعات أمر بيع لعميل يحتوي على صنف مخزني، ويحتاج التحقق من التوفر وحجز الكمية ثم صرفها لاحقًا من المستودع دون قيام المبيعات بتعديل الأرصدة مباشرة.',
      en: 'Educational Example: Sales confirms a Sales Order for a stocked item and needs availability checked, stock reserved, and goods eventually issued from a warehouse without Sales mutating stock balances directly.',
    },
    boundaryRule: {
      ar: 'تملك المبيعات أمر البيع والكمية المطلوبة تجاريًا ونية التنسيق (OWN-CORE-03)، لكن D-SALES-06 حسم صراحةً (ومع مزامنة INVENTORY_MODULE_MODEL) أن المخزون يملك On-hand Quantity وحركات الصرف وسجل الحجز المخزني Reservation Record (OWN-CORE-05 / OWN-CORE-06 / OWN-CORE-07)، ويتم طلب الحجز عبر CIC-CORE-SALES-INV-001.',
      en: 'Sales owns the Sales Order, ordered/confirmed commercial quantity, and fulfillment coordination intent (OWN-CORE-03), whereas D-SALES-06 (synced with Inventory) explicitly settled that Inventory owns On-hand Quantity, movements, and Physical Reservation Records (OWN-CORE-05/06/07), coordinated via CIC-CORE-SALES-INV-001.',
    },
    architecturalConsequenceIfViolated: {
      ar: 'لو ملكت المبيعات جدول الحجز أو عدّلت On-hand مباشرة لتوزعت سلطة المخزون بين المبيعات والمستودعات والمشتريات، ولفقد المخزون دوره كمصدر حقيقة وحيد للرصيد المتاح.',
      en: 'If Sales owned reservation rows or modified On-hand directly, inventory availability would splinter across Sales, Warehouse, and Transfers, breaking Inventory as the single source of physical truth.',
    },
    relatedIdentifiers: ['D-SALES-06', 'D-SALES-07', 'CIC-CORE-SALES-INV-001', 'OWN-CORE-03', 'OWN-CORE-05', 'OWN-CORE-07'],
    sourceRefs: [
      {
        documentSlug: 'sales-order-management-module-model',
        sectionLabel: { ar: 'المبيعات §7 ملكية الحجز المخزني', en: 'Sales §7 Reservation Ownership' },
        sectionAnchor: 'kh-h-reservation-ownership',
      },
      {
        documentSlug: 'sales-order-management-module-model',
        sectionLabel: { ar: 'المبيعات D-SALES-06 الحدود الثلاثية', en: 'Sales D-SALES-06 Ownership Boundary' },
        sectionAnchor: 'kh-h-d-sales-06-commercial-physical-financial-ownership-boundary',
      },
    ],
  },
  {
    id: 'ex-standalone-inventory-vs-finance',
    placement: 'ownership',
    title: {
      ar: 'مثال مفاهيمي 3: لماذا يعمل المخزون مستقلًا عن المالية بينما يظل الترحيل المالي ملكًا للمالية؟',
      en: 'Conceptual Example 3: Why Inventory Operates Standalone While Ledger Posting Remains Finance-Owned',
    },
    scenarioSummary: {
      ar: 'مثال تعليمي: قد يبدأ عميل بتفعيل نظام المخزون والمستودعات فقط لتتبع الأرصدة والجرد والتحويلات الداخلية (Standalone Inventory)، أو يفعل المخزون والمالية معًا لتوليد أثر محاسبي للحركات ذات الصلة المالية.',
      en: 'Educational Example: A tenant may initially activate Inventory & Warehouse Management standalone for stock tracking, stocktaking, and internal transfers, or co-activate Inventory and Finance so relevant movements carry financial ledger impact.',
    },
    boundaryRule: {
      ar: 'يملك المخزون الكمية والحركات ويعمل مستقلًا كميًا ومستودعيًا (D-INV-01 وD-INV-06)، ولا يكتب أبدًا في الأستاذ العام. وعند تفعيل المالية معًا، تمر الحركات ذات الأثر المالي عبر CIC-CORE-INV-FIN-001 لتسجّل المالية حصريًا الترحيل إلى GL (D-FIN-04 وOWN-CORE-08).',
      en: 'Inventory owns quantities and movements and operates standalone for warehouse quantity control (D-INV-01, D-INV-06) with zero direct GL access. When Finance is also active, financially relevant movements invoke CIC-CORE-INV-FIN-001 so Finance exclusively posts to the General Ledger (D-FIN-04, OWN-CORE-08).',
    },
    architecturalConsequenceIfViolated: {
      ar: 'لو اشترط المخزون وجود المالية كـ HBMD لفشل نموذج البيع المستقل (First-Class Sellable)؛ ولو كتب المخزون قيودًا محاسبية مباشرة لانكسرت وحدة المحاسبة وتوازن الأستاذ العام.',
      en: 'Making Finance an HBMD on Inventory breaks First-Class Sellable standalone deployment; letting Inventory write directly to GL destroys Finance ledger integrity.',
    },
    relatedIdentifiers: ['D-INV-01', 'D-INV-04', 'D-INV-06', 'D-FIN-04', 'CIC-CORE-INV-FIN-001', 'OWN-CORE-05', 'OWN-CORE-06', 'OWN-CORE-08'],
    sourceRefs: [
      {
        documentSlug: 'inventory-module-model',
        sectionLabel: { ar: 'المخزون §3 التشغيل المستقل', en: 'Inventory §3 Standalone Capabilities' },
        sectionAnchor: 'kh-h-3-ما-يستطيع-inventory-فعله-عند-تشغيله-منفردا',
      },
      {
        documentSlug: 'inventory-module-model',
        sectionLabel: { ar: 'المخزون §6.1 المخزون ↔ المالية', en: 'Inventory §6.1 Inventory ↔ Finance' },
        sectionAnchor: 'kh-h-61-inventory-finance',
      },
      {
        documentSlug: 'finance-module-model',
        sectionLabel: { ar: 'المالية §6.1 المالية ↔ المخزون', en: 'Finance §6.1 Finance ↔ Inventory' },
        sectionAnchor: 'kh-h-61-finance-inventory-warehouse-management',
      },
    ],
  },
  {
    id: 'ex-fld-must-not-become-hbmd',
    placement: 'model',
    title: {
      ar: 'مثال مفاهيمي 4: لماذا لا يجوز ترقية اعتمادية الميزة (FLD) إلى اعتمادية صلبة على مستوى الوحدة (HBMD)؟',
      en: 'Conceptual Example 4: Why Feature-Level Dependencies (FLD) Must Never Become Module-Level HBMDs',
    },
    scenarioSummary: {
      ar: 'مثال تعليمي: قد تكون ميزة بيع الأصناف المخزنية (Stock Sale — المرجع الداخلي FLD-CORE-01) أو الشحن المباشر (Drop Ship — FLD-CORE-03) أو شراء الأصناف المخزنية (Stock Purchase — FLD-CORE-04) شديدة الأهمية تجاريًا لدى شركات التوزيع، مما يغري المعماري بفرض المخزون أو المشتريات كـ HBMD على المبيعات.',
      en: 'Educational Example: Stock Sale (internal KH ref FLD-CORE-01), Drop Ship (FLD-CORE-03), and Stock Purchase (FLD-CORE-04) are commercially vital in distribution businesses—tempting architects to turn Inventory or Procurement into an HBMD on Sales.',
    },
    boundaryRule: {
      ar: 'تمنع القاعدة 8 في DEPENDENCY_MODEL.md §10 وضابط §6 في MODULE_DEPENDENCY_MATRIX.md وقرار D-SALES-10 هذه الترقية صراحةً: يظل بيع الخدمات والبنود غير المخزنية وعروض الأسعار مسارًا مستقلًا من الدرجة الأولى في المبيعات؛ عند غياب المخزون تتعطل ميزة Stock Sale فقط (FLD) ويدخل CIC-CORE-SALES-INV-001 حالة غير متاح، بينما تبقى وحدة Sales Active بالكامل (MODULE_LIFECYCLE_RULES §10).',
      en: 'DEPENDENCY_MODEL.md §10 Rule 8, the Matrix §6 FLD Guardrail, and D-SALES-10 explicitly prohibit this promotion: Service/Non-stock sales and quotations remain a first-class standalone path in Sales. Without Inventory, only the Stock Sale feature (FLD-CORE-01) and CIC-CORE-SALES-INV-001 disable, while core Sales stays Active (MODULE_LIFECYCLE_RULES §10).',
    },
    architecturalConsequenceIfViolated: {
      ar: 'ترقية FLD إلى HBMD تفرض على عملاء الخدمات والاستشارات والاشتراكات تفعيل مستودعات غير مستخدمة وتخلق تشابكًا دوريًا خفيًا بين المبيعات والمشتريات والمخزون.',
      en: 'Promoting an FLD to an HBMD would force service, consulting, and subscription tenants to activate unused warehouse infrastructure and introduce hidden coupling across Core modules.',
    },
    relatedIdentifiers: ['D-SALES-08', 'D-SALES-10', 'FLD-CORE-01', 'FLD-CORE-03', 'FLD-CORE-04', 'CIC-CORE-SALES-INV-001'],
    sourceRefs: [
      {
        documentSlug: 'dependency-model',
        sectionLabel: { ar: 'نموذج الاعتماديات §10 قواعد الحوكمة', en: 'Dependency Model §10 Governance Rules' },
        sectionAnchor: 'kh-h-10-قواعد-الحوكمة',
      },
      {
        documentSlug: 'module-dependency-matrix',
        sectionLabel: { ar: 'المصفوفة §6 ضابط FLD', en: 'Matrix §6 FLD Guardrail' },
        sectionAnchor: 'kh-h-6-core-relationship-register-fld',
      },
      {
        documentSlug: 'sales-order-management-module-model',
        sectionLabel: { ar: 'المبيعات D-SALES-10 استقلال الخدمات', en: 'Sales D-SALES-10 Service Sales' },
        sectionAnchor: 'kh-h-d-sales-10-service-sales-independence-principle',
      },
      {
        documentSlug: 'module-lifecycle-rules',
        sectionLabel: { ar: 'دورة الحياة §10 أثر الإيقاف على FLD', en: 'Lifecycle §10 Deactivation on FLD' },
        sectionAnchor: 'kh-h-10-أثر-deactivation-على-fld',
      },
    ],
  },
];

export interface DependencySourceSnapshotInput {
  readonly key: PinnedDependencySourceKey;
  readonly bodyMarkdown: string;
  readonly sourceRevision: string | null;
}

export function buildDependencyEducationalGuidance(
  inputs: Readonly<
    Record<PinnedDependencySourceKey, DependencySourceSnapshotInput>
  >
): DependencyEducationalGuidanceBundle {
  const keys: readonly PinnedDependencySourceKey[] = [
    'dependencyModel',
    'moduleDependencyMatrix',
    'moduleLifecycleRules',
    'phase2ClosureReview',
    'financeModuleModel',
    'inventoryModuleModel',
    'procurementModuleModel',
    'salesModuleModel',
  ];

  const entries: DependencySourceFreshnessEntry[] = keys.map((key) => {
    const pin = CURATED_DEPENDENCY_PROJECTION_PINS[key];
    const input = inputs[key];
    const actualSourceBodySha256 = computeCanonicalStoredBodySha256(
      input.bodyMarkdown
    );
    const bodyChanged = actualSourceBodySha256 !== pin.mappedSourceBodySha256;
    const revisionChanged = input.sourceRevision !== pin.mappedSourceRevision;

    return {
      key,
      documentSlug: pin.documentSlug,
      sourcePath: pin.sourcePath,
      mappedSourceRevision: pin.mappedSourceRevision,
      actualSourceRevision: input.sourceRevision,
      mappedSourceBodySha256: pin.mappedSourceBodySha256,
      actualSourceBodySha256,
      status:
        bodyChanged || revisionChanged
          ? 'review-required-source-changed'
          : 'verified-current',
    };
  });

  const drifted = entries.filter(
    (e) => e.status === 'review-required-source-changed'
  );
  const mappingFreshnessStatus: DependencyProjectionFreshnessStatus =
    drifted.length > 0 ? 'review-required-source-changed' : 'verified-current';

  return {
    provenance: {
      kind: 'curated-projection',
      lastCuratedReviewDate: '2026-11-27',
      mappingFreshnessStatus,
      sources: entries,
      disclosure: {
        ar: 'تجمع هذه الواجهة بين جداول وقواعد مستخلصة حتميًا من الوثائق الرسمية المعتمدة للمرحلة 2 وبين إرشادات وأمثلة تعليمية مُراجعة يدويًا ومربوطة ببصمات النصوص الرسمية (SHA-256) ومراجعتها (397a94e0d82f). لا تُنشئ الإرشادات التعليمية قرارات أو تصنيفات جديدة.',
        en: 'This workspace strictly separates deterministically extracted Phase 2 tables and rules from manually curated educational design guides and conceptual examples pinned to the official document revisions (397a94e0d82f) and canonical body SHA-256 digests. Educational commentary never creates new official decisions.',
      },
      reviewWarning:
        mappingFreshnessStatus === 'review-required-source-changed'
          ? {
              ar: `تنبيه انجراف مصدر (R07): تغيّرت بصمة أو مراجعة (${drifted.map((d) => d.sourcePath).join('، ')}) عن النسخة المُراجعة للإرشاد التعليمي — يُرجى مراجعة الشروحات التعليمية ومطابقتها مع النص الرسمي الكامل.`,
              en: `Source drift detected (R07): authoritative source digest or revision changed for (${drifted.map((d) => d.sourcePath).join(', ')}) relative to the curated educational projection pins — review educational guidance against the verbatim official sources.`,
            }
          : null,
    },
    classificationGuide: CLASSIFICATION_GUIDE,
    cicGuidanceByContractId: CIC_GUIDANCE_BY_ID,
    ownershipGuide: OWNERSHIP_GUIDE,
    educationalExamples: EDUCATIONAL_EXAMPLES,
  };
}
