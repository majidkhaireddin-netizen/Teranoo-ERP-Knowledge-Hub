import fs from 'node:fs';
import path from 'node:path';
import {
  BATCH_001_SOURCE_REVISION,
  PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
} from '@/content/manifest/sourceManifest';
import {
  prepareCanonicalIngestionArtifact,
  type SourceIngestionEnvelopeInput,
} from '@/content/ingestion/ingestionPipeline';

interface BatchFileSpec {
  readonly fileName: string;
  readonly sourceRefId: string;
  readonly internalContentId: string;
  readonly slug: string;
  readonly collectionDir: 'official' | 'future';
  readonly approvalStatus: SourceIngestionEnvelopeInput['approvalStatus'];
  readonly sourceDocumentDate: string | null;
  readonly depth: SourceIngestionEnvelopeInput['depth'];
  readonly subtitle: SourceIngestionEnvelopeInput['subtitle'];
  readonly description: SourceIngestionEnvelopeInput['description'];
  readonly scopeNote: SourceIngestionEnvelopeInput['scopeNote'];
  readonly interpretationNote?: SourceIngestionEnvelopeInput['interpretationNote'];
  readonly journeyStages: SourceIngestionEnvelopeInput['journeyStages'];
  readonly phaseRefs: SourceIngestionEnvelopeInput['phaseRefs'];
  readonly moduleRefs?: SourceIngestionEnvelopeInput['moduleRefs'];
  readonly domainRefs?: SourceIngestionEnvelopeInput['domainRefs'];
  readonly topics: SourceIngestionEnvelopeInput['topics'];
  readonly tags: SourceIngestionEnvelopeInput['tags'];
  readonly decisionIds?: SourceIngestionEnvelopeInput['decisionIds'];
  readonly futureConsiderationIds?: SourceIngestionEnvelopeInput['futureConsiderationIds'];
  readonly relationships: SourceIngestionEnvelopeInput['relationships'];
  readonly supersedesId?: string;
  readonly collectionOrder: number;
}

const BATCH_001_SPECS: readonly BatchFileSpec[] = [
  {
    fileName: '00_PROJECT_VISION.md',
    sourceRefId: 'src-pf-01-project-vision',
    internalContentId: 'kh-doc-project-vision-ar',
    slug: 'project-vision',
    collectionDir: 'official',
    approvalStatus: 'approved',
    sourceDocumentDate: '2026-10-02',
    depth: 'L1',
    subtitle: {
      ar: 'الوثيقة التأسيسية الرسمية الكاملة لرؤية منتج Teranoo ERP والتموضع والحدود ومعايير النجاح',
      en: 'Complete official founding vision document defining Teranoo ERP positioning, boundaries, modules, principles, and success criteria',
    },
    description: {
      ar: 'النص الرسمي الكامل غير المختصر لوثيقة رؤية المنتج (00_PROJECT_VISION.md — Approved / Phase 1 Closed، محدثة بتاريخ 2026-10-02) بما يشمل الأقسام العشرة كاملة.',
      en: 'Complete verbatim official Product Vision document (00_PROJECT_VISION.md — Approved / Phase 1 Closed, updated 2026-10-02) preserving all ten sections.',
    },
    scopeNote: {
      ar: 'مصدر رسمي معتمد ومستورد بالكامل ضمن الدفعة BATCH-001 (المراجعة المرجعية 2026-11-26) دون تعديل أو اختصار لنص الوثيقة الأصلية.',
      en: 'Complete authorized official source ingested verbatim in BATCH-001 (reviewed 2026-11-26) without altering or summarizing original wording.',
    },
    interpretationNote: {
      ar: 'ملاحظة تفسيرية من مركز المعرفة: يحتفظ القسم 7.3 في النص الأصلي بعبارة تاريخية تفيد بأن نموذج عزل العملاء التفصيلي لم يُحسم بعد عند إغلاق المرحلة 1، بينما تم حسمه رسميًا لاحقًا في المرحلة 3 عبر القرارات D-ISO-01..D-ISO-12 الموثقة في سجل القرارات الرسمي.',
      en: 'Knowledge Hub interpretation note: Section 7.3 preserves a historical Phase 1 remark stating that detailed tenant isolation had not yet been decided; this was subsequently resolved in Phase 3 via D-ISO-01..D-ISO-12 in DECISION_REGISTER.md.',
    },
    journeyStages: ['product-discovery', 'architecture'],
    phaseRefs: ['phase-1', 'phase-4'],
    moduleRefs: [
      'finance',
      'inventory-warehouse',
      'procurement',
      'sales-order-management',
    ],
    topics: ['architecture', 'deployment', 'governance', 'upgradeability', 'extensibility'],
    tags: [
      'teranoo-erp',
      'project-foundations',
      'product-vision',
      'batch-001',
      'saas-first',
      'postgresql',
    ],
    decisionIds: ['D-DEP-05', 'D-DEP-06'],
    relationships: [
      {
        type: 'supersedes',
        targetId: 'kh-doc-product-vision-ref-ar',
        label: {
          ar: 'يحل محل الملخص المرجعي التاريخي المشتق من اللقطة التخطيطية السابقة',
          en: 'Supersedes the earlier snapshot-derived Product Vision reference summary',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-project-work-plan-ar',
        label: {
          ar: 'خطة عمل المشروع الرسمية (PROJECT_WORK_PLAN.md)',
          en: 'Official Project Work Plan (PROJECT_WORK_PLAN.md)',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-cross-phase-guardrails-ar',
        label: {
          ar: 'ضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
          en: 'Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-decision-register-ar',
        label: {
          ar: 'سجل القرارات الرسمي (DECISION_REGISTER.md)',
          en: 'Official Decision Register (DECISION_REGISTER.md)',
        },
      },
    ],
    supersedesId: 'kh-doc-product-vision-ref-ar',
    collectionOrder: 1,
  },
  {
    fileName: 'PROJECT_WORK_PLAN.md',
    sourceRefId: 'src-pf-02-project-work-plan',
    internalContentId: 'kh-doc-project-work-plan-ar',
    slug: 'project-work-plan',
    collectionDir: 'official',
    approvalStatus: 'reference',
    sourceDocumentDate: '2026-10-02',
    depth: 'L2',
    subtitle: {
      ar: 'خطة العمل الرسمية الكاملة للمراحل 1–12 شاملة المرحلة 6.5 وبوابة القرار A والوضع الحالي',
      en: 'Complete official planning roadmap covering Phases 1–12, Phase 6.5, Decision Gate A, and current position',
    },
    description: {
      ar: 'النص الرسمي الكامل لخطة عمل مشروع Teranoo ERP (PROJECT_WORK_PLAN.md) الموثّقة للمراحل 1 حتى 12، بما فيها بوابة القرار A (D-MKT-01) والمرحلة 6.5 ومسار جمع الأدلة السوقية المستمر.',
      en: 'Complete verbatim official Project Work Plan (PROJECT_WORK_PLAN.md) documenting Phases 1 through 12, Decision Gate A (D-MKT-01), Phase 6.5, and Continuous Market Evidence Collection.',
    },
    scopeNote: {
      ar: 'وثيقة تخطيط رسمية نشطة (Active Reference) مستوردة بالكامل ضمن BATCH-001 دون تعديل النص الأصلي.',
      en: 'Active official roadmap reference ingested verbatim in BATCH-001 without altering original source wording.',
    },
    interpretationNote: {
      ar: 'ملاحظة تفسيرية من مركز المعرفة: يتضمن قسم Current Position سطرًا قديمًا لا يزال يصف المرحلة 5 بأنها Current، بينما تؤكد بنود الحالة الختامية في نفس الوثيقة وسجل القرارات الرسمي اكتمال المرحلة 5 بالكامل (13/13 — D-PLAT-01..D-PLAT-13) واعتماد بوابة القرار A مشروطًا (D-MKT-01)، وتحديد المرحلة 6 كخطوة تالية بانتظار تكليف منفصل.',
      en: 'Knowledge Hub interpretation note: The Current Position header retains a stale line describing Phase 5 as Current, whereas the closing status bullets in the same document and DECISION_REGISTER.md confirm Phase 5 completion (13/13 — D-PLAT-01..D-PLAT-13), conditional approval of Decision Gate A (D-MKT-01), and Phase 6 as the next step awaiting separate authorization.',
    },
    journeyStages: ['product-discovery', 'architecture', 'functional-design'],
    phaseRefs: [
      'phase-1',
      'phase-2',
      'phase-3',
      'phase-4',
      'phase-5',
      'phase-6',
      'phase-6.5',
      'phase-7',
      'phase-8',
      'phase-9',
      'phase-10',
      'phase-11',
      'phase-12',
    ],
    moduleRefs: [
      'finance',
      'inventory-warehouse',
      'procurement',
      'sales-order-management',
    ],
    domainRefs: [
      'identity-access',
      'workflow-approvals',
      'audit-trail',
      'shared-master-data',
      'localization',
      'tax',
      'currency',
      'calendar',
      'documents-attachments',
      'notifications',
      'integration',
      'reporting',
      'configuration',
      'extensions',
    ],
    topics: ['governance', 'architecture', 'deployment', 'documentation'],
    tags: [
      'teranoo-erp',
      'project-foundations',
      'roadmap',
      'work-plan',
      'phase-6.5',
      'decision-gate-a',
      'batch-001',
    ],
    decisionIds: [
      'D-DEP-01',
      'D-DEP-10',
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
      'D-MKT-01',
    ],
    relationships: [
      {
        type: 'references',
        targetId: 'kh-doc-project-vision-ar',
        label: {
          ar: 'رؤية المنتج الرسمية (00_PROJECT_VISION.md)',
          en: 'Official Product Vision (00_PROJECT_VISION.md)',
        },
      },
      {
        type: 'references',
        targetId: 'kh-doc-working-rules-ar',
        label: {
          ar: 'قواعد العمل ومنهجية التخطيط (WORKING_RULES.md)',
          en: 'Working Rules & Planning Methodology (WORKING_RULES.md)',
        },
      },
      {
        type: 'references',
        targetId: 'kh-doc-cross-phase-guardrails-ar',
        label: {
          ar: 'ضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
          en: 'Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
        },
      },
      {
        type: 'references',
        targetId: 'kh-doc-decision-register-ar',
        label: {
          ar: 'سجل القرارات الرسمي (DECISION_REGISTER.md)',
          en: 'Official Decision Register (DECISION_REGISTER.md)',
        },
      },
      {
        type: 'references',
        deferredRef:
          'teranoo-erp-planning/02-erp-scope/DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md',
        label: {
          ar: 'وثيقة بوابة القرار A المالكة للقرار السوقي D-MKT-01 (بانتظار دفعة استيراد لاحقة)',
          en: 'Authoritative Decision Gate A document owning D-MKT-01 (awaiting future source batch)',
        },
      },
    ],
    collectionOrder: 2,
  },
  {
    fileName: 'WORKING_RULES.md',
    sourceRefId: 'src-pf-03-working-rules',
    internalContentId: 'kh-doc-working-rules-ar',
    slug: 'working-rules',
    collectionDir: 'official',
    approvalStatus: 'reference',
    sourceDocumentDate: null,
    depth: 'L2',
    subtitle: {
      ar: 'قواعد العمل، القاعدة العليا، بوابة الحاجة للقرار الآن، وتصنيف الأولويات A/B/C/D',
      en: 'Working rules, Supreme Rule, Need-to-Decide-Now gate, A/B/C/D triage, and anti-inflation discipline',
    },
    description: {
      ar: 'النص الرسمي الكامل لقواعد العمل ومنهجية التخطيط في مشروع Teranoo ERP (WORKING_RULES.md) بما يشمل دورة البحث والقرار والتوثيق والمراجعة وانضباط منع تضخم التخطيط.',
      en: 'Complete verbatim Working Rules (WORKING_RULES.md) establishing the Research -> Decision -> Documentation -> Review cycle, Supreme Rule, Need-to-Decide-Now gate, and planning inflation warnings.',
    },
    scopeNote: {
      ar: 'وثيقة منهجية وحوكمة تخطيطية رسمية نشطة (Active Reference) مستوردة بالكامل ضمن BATCH-001.',
      en: 'Active official planning methodology and governance reference ingested verbatim in BATCH-001.',
    },
    journeyStages: ['product-discovery', 'research', 'architecture'],
    phaseRefs: ['phase-1'],
    topics: ['governance', 'documentation', 'architecture'],
    tags: [
      'teranoo-erp',
      'project-foundations',
      'working-rules',
      'planning-methodology',
      'batch-001',
    ],
    relationships: [
      {
        type: 'constrains',
        targetId: 'kh-doc-project-work-plan-ar',
        label: {
          ar: 'تحكم قواعد العمل مسار تنفيذ خطة عمل المشروع',
          en: 'Governs execution discipline across the Project Work Plan',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-cross-phase-guardrails-ar',
        label: {
          ar: 'ضوابط المنتج العابرة للمراحل',
          en: 'Cross-Phase Product Guardrails',
        },
      },
    ],
    collectionOrder: 3,
  },
  {
    fileName: 'CROSS_PHASE_PRODUCT_GUARDRAILS.md',
    sourceRefId: 'src-pf-04-cross-phase-guardrails',
    internalContentId: 'kh-doc-cross-phase-guardrails-ar',
    slug: 'cross-phase-product-guardrails',
    collectionDir: 'official',
    approvalStatus: 'approved',
    sourceDocumentDate: null,
    depth: 'L3',
    subtitle: {
      ar: 'الضوابط الثمانية المعتمدة العابرة لجميع مراحل التخطيط والمعمارية',
      en: 'Eight approved product-wide architectural guardrails applying across all planning and architecture phases',
    },
    description: {
      ar: 'النص الرسمي الكامل لضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md — Approved)، شاملة الضوابط الثمانية من خط المنتج الموحد حتى حوكمة التهيئة والميزات.',
      en: 'Complete verbatim Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md — Approved) establishing all eight project-wide architectural guardrails.',
    },
    scopeNote: {
      ar: 'وثيقة حاكمة معتمدة (Governing Artifact بدون معرفات D-* منفصلة) مستوردة بالكامل ضمن BATCH-001.',
      en: 'Approved governing artifact (without standalone D-* IDs) ingested verbatim in BATCH-001.',
    },
    journeyStages: ['architecture', 'functional-design', 'detailed-system-design'],
    phaseRefs: ['phase-1', 'phase-3', 'phase-4', 'phase-5', 'phase-6', 'phase-10'],
    domainRefs: [
      'integration',
      'configuration',
      'extensions',
      'audit-trail',
      'workflow-approvals',
    ],
    topics: [
      'architecture',
      'upgradeability',
      'extensibility',
      'data-governance',
      'security',
      'governance',
    ],
    tags: [
      'teranoo-erp',
      'project-foundations',
      'guardrails',
      'single-product-line',
      'upgrade-safe',
      'batch-001',
    ],
    relationships: [
      {
        type: 'constrains',
        targetId: 'kh-doc-project-work-plan-ar',
        label: {
          ar: 'ضوابط ملزمة عبر مراحل خطة عمل المشروع',
          en: 'Binding guardrails across Project Work Plan phases',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-decision-register-ar',
        label: {
          ar: 'مدرجة كوثيقة حاكمة معتمدة في سجل القرارات الرسمي',
          en: 'Listed as an approved Governing Artifact in DECISION_REGISTER.md',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-future-architecture-considerations-ar',
        label: {
          ar: 'تضم سبع أفكار رُقّيت من سجل الاعتبارات المعمارية المستقبلية',
          en: 'Incorporates seven ideas promoted from FUTURE_ARCHITECTURE_CONSIDERATIONS.md',
        },
      },
    ],
    collectionOrder: 4,
  },
  {
    fileName: 'DECISION_REGISTER.md',
    sourceRefId: 'src-pf-05-decision-register',
    internalContentId: 'kh-doc-decision-register-ar',
    slug: 'decision-register',
    collectionDir: 'official',
    approvalStatus: 'reference',
    sourceDocumentDate: '2026-10-02',
    depth: 'L3',
    subtitle: {
      ar: 'الفهرس الرسمي للقرارات المعمارية المعتمدة (126 قرارًا D-*) وقرار السوق المشروط D-MKT-01 والوثائق الحاكمة',
      en: 'Official governance index of 126 approved architectural D-* decisions, conditional market decision D-MKT-01, and governing artifacts',
    },
    description: {
      ar: 'النص الرسمي الكامل لسجل القرارات (DECISION_REGISTER.md) بصفته فهرس الحوكمة الرسمي للقرارات المعتمدة في المراحل 3 و4 و5 (126 قرارًا) وقرار بوابة السوق D-MKT-01 المستقل.',
      en: 'Complete verbatim Official Decision Register (DECISION_REGISTER.md) serving as the authoritative governance index for 126 approved Phase 3–5 architectural decisions and separate conditional market decision D-MKT-01.',
    },
    scopeNote: {
      ar: 'فهرس حوكمة رسمي (Governance Index — Reference) مستورد بالكامل ضمن BATCH-001؛ لا يُعد بديلًا عن الوثائق المالكة التي تحوي النصوص الكاملة ومبررات كل قرار.',
      en: 'Authoritative governance index (reference) ingested verbatim in BATCH-001; full decision rationales remain in owning source documents awaiting future batches.',
    },
    journeyStages: ['architecture', 'functional-design'],
    phaseRefs: ['phase-1', 'phase-3', 'phase-4', 'phase-5'],
    domainRefs: [
      'identity-access',
      'workflow-approvals',
      'audit-trail',
      'shared-master-data',
      'localization',
      'tax',
      'currency',
      'calendar',
      'documents-attachments',
      'notifications',
      'integration',
      'reporting',
      'configuration',
      'extensions',
    ],
    topics: ['governance', 'architecture', 'multi-tenancy', 'deployment', 'security'],
    tags: [
      'teranoo-erp',
      'project-foundations',
      'decision-register',
      'd-mkt-01',
      'batch-001',
    ],
    decisionIds: [
      'D-TEN-01',
      'D-COMP-01',
      'D-BR-01',
      'D-ORG-01',
      'D-MD-01',
      'D-AUTH-01',
      'D-ISO-01',
      'D-CP-01',
      'D-LC-01',
      'D-DEP-01',
      'D-DEP-05',
      'D-DEP-06',
      'D-DEP-10',
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
      'D-MKT-01',
    ],
    relationships: [
      {
        type: 'references',
        targetId: 'kh-doc-project-vision-ar',
        label: {
          ar: 'وثيقة حاكمة معتمدة بدون معرفات D-* (00_PROJECT_VISION.md)',
          en: 'Governing artifact without D-* IDs (00_PROJECT_VISION.md)',
        },
      },
      {
        type: 'references',
        targetId: 'kh-doc-cross-phase-guardrails-ar',
        label: {
          ar: 'وثيقة حاكمة معتمدة بدون معرفات D-* (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
          en: 'Governing artifact without D-* IDs (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
        },
      },
      {
        type: 'references',
        deferredRef:
          'teranoo-erp-planning/02-erp-scope/DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md',
        label: {
          ar: 'الوثيقة المالكة لقرار بوابة السوق D-MKT-01 (بانتظار دفعة استيراد لاحقة)',
          en: 'Authoritative owning document for D-MKT-01 (awaiting future source batch)',
        },
      },
    ],
    collectionOrder: 5,
  },
  {
    fileName: 'FUTURE_ARCHITECTURE_CONSIDERATIONS.md',
    sourceRefId: 'src-pf-06-future-architecture-considerations',
    internalContentId: 'kh-doc-future-architecture-considerations-ar',
    slug: 'future-architecture-considerations',
    collectionDir: 'future',
    approvalStatus: 'not-applicable',
    sourceDocumentDate: null,
    depth: 'L3',
    subtitle: {
      ar: 'السجل الرسمي للـ 24 اعتبارًا معماريًا مستقبليًا (FAC-001 إلى FAC-024) — غير معتمدة كقرارات ERP بعد',
      en: 'Official register of 24 Future Architecture Considerations (FAC-001 through FAC-024) — not approved ERP decisions',
    },
    description: {
      ar: 'النص الرسمي الكامل لسجل الاعتبارات المعمارية المستقبلية (FUTURE_ARCHITECTURE_CONSIDERATIONS.md) متضمنًا السجلات الـ 24 (FAC-001..FAC-024) بحالاتها المصدرية والأفكار السبع المرقّاة إلى ضوابط رسمية.',
      en: 'Complete verbatim Future Architecture Considerations register (FUTURE_ARCHITECTURE_CONSIDERATIONS.md) containing all 24 FAC records (FAC-001..FAC-024) with source statuses and seven ideas promoted to official guardrails.',
    },
    scopeNote: {
      ar: 'سجل اعتبارات مستقبلية وأبحاث مؤجلة (ليست قرارات معمارية معتمدة). الملفات التفصيلية المنفصلة لـ FAC-019..FAC-024 غير متوفرة في BATCH-001.',
      en: 'Forward-looking register of non-approved considerations and research topics. Separate detailed documents for FAC-019..FAC-024 are not included in BATCH-001.',
    },
    journeyStages: ['research', 'architecture', 'continuous-evolution'],
    phaseRefs: ['phase-1', 'phase-6', 'phase-10'],
    topics: ['architecture', 'extensibility', 'performance', 'data-governance', 'security'],
    tags: [
      'teranoo-erp',
      'project-foundations',
      'future-considerations',
      'fac-register',
      'batch-001',
    ],
    futureConsiderationIds: Array.from(
      { length: 24 },
      (_, idx) => `FAC-${String(idx + 1).padStart(3, '0')}`
    ),
    relationships: [
      {
        type: 'related-to',
        targetId: 'kh-doc-cross-phase-guardrails-ar',
        label: {
          ar: 'الضوابط الرسمية التي رُقّيت إليها سبع أفكار من هذا السجل',
          en: 'Official guardrails incorporating seven promoted ideas from this register',
        },
      },
      {
        type: 'related-to',
        targetId: 'kh-doc-project-work-plan-ar',
        label: {
          ar: 'المراحل المستقبلية المالكة لمراجعة الاعتبارات (Phase 6 / Phase 10)',
          en: 'Future planning phases owning consideration reviews (Phase 6 / Phase 10)',
        },
      },
    ],
    collectionOrder: 6,
  },
];

function resolveExplicitStagingSourceDir(argv: readonly string[]): string {
  let cliDir: string | null = null;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--source-dir' && argv[i + 1]) {
      cliDir = argv[i + 1]!;
      break;
    }
    if (arg && arg.startsWith('--source-dir=')) {
      cliDir = arg.slice('--source-dir='.length);
      break;
    }
  }

  const rawDir = cliDir ?? process.env.TERANOO_INGESTION_SOURCE_DIR ?? '';
  if (!rawDir.trim()) {
    throw new Error(
      'Explicit staging source directory is required (KH-029). Pass --source-dir <path> or set TERANOO_INGESTION_SOURCE_DIR pointing to a temporary local staging directory outside tracked repository files.'
    );
  }

  const resolvedDir = path.resolve(rawDir.trim());
  if (!fs.existsSync(resolvedDir) || !fs.statSync(resolvedDir).isDirectory()) {
    throw new Error(`Staging source directory does not exist or is not a directory: ${resolvedDir}`);
  }

  return resolvedDir;
}

function main() {
  const filesRoot = resolveExplicitStagingSourceDir(process.argv.slice(2));
  const collectionsRoot = path.resolve(process.cwd(), 'content', 'collections');

  const manifestById = new Map(
    PROJECT_FOUNDATIONS_SOURCE_MANIFEST.map((entry) => [entry.sourceRefId, entry])
  );

  for (const spec of BATCH_001_SPECS) {
    const manifestEntry = manifestById.get(spec.sourceRefId);
    if (!manifestEntry) {
      throw new Error(`Missing manifest entry for ${spec.sourceRefId}`);
    }

    const rawFilePath = path.join(filesRoot, spec.fileName);
    if (!fs.existsSync(rawFilePath)) {
      throw new Error(`Missing staged source file: ${rawFilePath}`);
    }

    const rawBytes = fs.readFileSync(rawFilePath);
    const rawBodyMarkdown = rawBytes.toString('utf8');

    const artifact = prepareCanonicalIngestionArtifact({
      manifestEntry,
      internalContentId: spec.internalContentId,
      slug: spec.slug,
      language: 'ar',
      sourceLanguage: 'mixed',
      subtitle: spec.subtitle,
      description: spec.description,
      rawBodyMarkdown,
      rawSourceBytes: rawBytes,
      approvalStatus: spec.approvalStatus,
      expectedGitBlobSha: manifestEntry.expectedGitBlobSha,
      sourceCommitSha: BATCH_001_SOURCE_REVISION.commitSha,
      sourceTreeSha: BATCH_001_SOURCE_REVISION.treeSha,
      sourceDocumentDate: spec.sourceDocumentDate,
      reviewDate: BATCH_001_SOURCE_REVISION.reviewDate,
      publicationDate: BATCH_001_SOURCE_REVISION.publicationDate,
      authorizedForPublic: true,
      authorizedBy: 'Project Owner — TASK-004 BATCH-001 Authorized Release',
      scopeNote: spec.scopeNote,
      interpretationNote: spec.interpretationNote,
      depth: spec.depth,
      journeyStages: spec.journeyStages,
      phaseRefs: spec.phaseRefs,
      moduleRefs: spec.moduleRefs,
      domainRefs: spec.domainRefs,
      topics: spec.topics,
      tags: spec.tags,
      decisionIds: spec.decisionIds,
      futureConsiderationIds: spec.futureConsiderationIds,
      relationships: spec.relationships,
      supersedesId: spec.supersedesId,
      collectionSequence: {
        collectionId: 'kh-col-project-foundations',
        order: spec.collectionOrder,
      },
      collectionDir: spec.collectionDir,
    });

    if (
      artifact.integrity.verificationStatus !== 'git-blob-verified' &&
      artifact.integrity.verificationStatus !== 'git-blob-verified-lf-normalized'
    ) {
      throw new Error(
        `Git blob SHA verification FAILED for ${spec.fileName}: status=${artifact.integrity.verificationStatus}`
      );
    }

    if (!artifact.parsedEntry.ok) {
      throw new Error(
        `Validation FAILED for ${spec.fileName}: ${JSON.stringify(artifact.parsedEntry.issues)}`
      );
    }

    const outDir = path.join(collectionsRoot, spec.collectionDir);
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, `${spec.slug}.ar.md`);
    fs.writeFileSync(outPath, artifact.canonicalMarkdown, 'utf8');

    console.log(
      `[OK] ${spec.fileName} -> ${path.relative(process.cwd(), outPath)} | status=${artifact.integrity.verificationStatus} | blob=${artifact.integrity.matchedGitBlobSha} | rawSha256=${artifact.rawSourceSha256.slice(0, 12)} | lfSha256=${artifact.sourceSha256.slice(0, 12)}`
    );
  }
}

main();
