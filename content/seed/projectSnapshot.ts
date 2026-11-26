import type { ProjectReferenceSnapshot } from '@/content/models/types';

/**
 * Preserved Historical Reference Snapshot (TASK-001 / 2026-11-25).
 * Retained for explicit historical traceability so users and reviewers can see
 * how the ERP project progressed from 120 architectural decisions & Phase 5
 * (7 of 13) to the current BATCH-001 verified state (126 decisions & Phase 5
 * 13 of 13 completed).
 */
export const HISTORICAL_REFERENCE_SNAPSHOT: ProjectReferenceSnapshot = {
  provenance: {
    sourceRepository: 'https://github.com/Alabasi1980/TeranooErp',
    officialSources: [
      'teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md',
      'teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md',
    ],
    reviewedTreeSha: 'a922a69b54bc0cc611ae46d8e7434907cde0046a',
    referenceReviewDate: '2026-11-25',
    isLiveSynced: false,
    snapshotNatureNote: {
      ar: 'لقطة مرجعية تاريخية سابقة (2026-11-25) محفوظة للتوثيق التاريخي قبل إغلاق المرحلة الخامسة واعتماد بوابة القرار A.',
      en: 'Prior historical reference snapshot (2026-11-25) preserved for provenance before Phase 5 completion and Decision Gate A conditional approval.',
    },
    reviewDateNote: {
      ar: 'تاريخ 2026-11-25 هو تاريخ المراجعة المرجعية التاريخية السابقة قبل دفعة BATCH-001.',
      en: '2026-11-25 was the prior independent reference review date prior to BATCH-001.',
    },
    metricsOriginNote: {
      ar: 'اللقطة التاريخية (2026-11-25): 120 قرارًا معماريًا معتمدًا، المرحلة 5 قيد التنفيذ (7 من 13 بندًا)، 24 اعتبارًا مستقبليًا، 13 حزمة بحثية، و57 ملاحظة مراجعة مستقلة.',
      en: 'Historical snapshot (2026-11-25): 120 approved architectural decisions, Phase 5 in progress (7 of 13 items), 24 future considerations, 13 research packages, and 57 independent review notes.',
    },
  },
  snapshotScopeNote: {
    ar: 'لقطة تاريخية محفوظة لحالة التخطيط قبل إغلاق المرحلة الخامسة.',
    en: 'Preserved historical planning snapshot prior to Phase 5 closure.',
  },
  identity: {
    productName: 'Teranoo ERP',
    productType: {
      ar: 'نظام ERP معياري بمستوى المؤسسات (Enterprise-Grade Modular ERP)',
      en: 'Enterprise-Grade Modular ERP',
    },
    targetCustomers: {
      ar: 'المؤسسات المتوسطة والكبيرة (Medium & Large Enterprises)',
      en: 'Medium & Large Enterprises',
    },
    productStrategy: {
      ar: 'نظام ERP تجاري، معياري، وقابل للتهيئة (Commercial, Modular, Configurable ERP)',
      en: 'Commercial, Modular, Configurable ERP',
    },
    deploymentStrategy: {
      ar: 'SaaS-first',
      en: 'SaaS-first',
    },
    futureDeploymentProfile: {
      ar: 'Connected On-Premises',
      en: 'Connected On-Premises',
    },
    databaseEngine: 'PostgreSQL',
  },
  coreBusinessModules: [
    {
      id: 'finance',
      order: 1,
      name: { ar: 'المالية', en: 'Finance' },
      classification: 'official',
    },
    {
      id: 'inventory-warehouse',
      order: 2,
      name: {
        ar: 'المخزون وإدارة المستودعات',
        en: 'Inventory & Warehouse Management',
      },
      classification: 'official',
    },
    {
      id: 'procurement',
      order: 3,
      name: { ar: 'المشتريات', en: 'Procurement' },
      classification: 'official',
    },
    {
      id: 'sales-order-management',
      order: 4,
      name: {
        ar: 'المبيعات وإدارة الطلبات',
        en: 'Sales & Order Management',
      },
      classification: 'official',
    },
  ],
  planningPhases: [
    {
      phaseNumber: 1,
      code: 'PHASE-1',
      name: { ar: 'المرحلة 1', en: 'Phase 1' },
      status: 'completed',
    },
    {
      phaseNumber: 2,
      code: 'PHASE-2',
      name: { ar: 'المرحلة 2', en: 'Phase 2' },
      status: 'completed',
    },
    {
      phaseNumber: 3,
      code: 'PHASE-3',
      name: { ar: 'المرحلة 3', en: 'Phase 3' },
      status: 'completed',
    },
    {
      phaseNumber: 4,
      code: 'PHASE-4',
      name: { ar: 'المرحلة 4', en: 'Phase 4' },
      status: 'completed',
    },
    {
      phaseNumber: 5,
      code: 'PHASE-5',
      name: {
        ar: 'المرحلة 5 — قدرات المنصة المشتركة',
        en: 'Phase 5 — Shared Platform Capabilities',
      },
      status: 'in_progress',
    },
  ],
  phase5Capabilities: [
    {
      itemNumber: 1,
      id: 'identity-access',
      name: { ar: 'إطار الهوية والصلاحيات', en: 'Identity & Access Framework' },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-01',
    },
    {
      itemNumber: 2,
      id: 'workflow-approvals',
      name: {
        ar: 'إطار سير العمل والموافقات',
        en: 'Workflow & Approvals Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-02',
    },
    {
      itemNumber: 3,
      id: 'audit-trail',
      name: { ar: 'إطار سجل التدقيق', en: 'Audit Trail Framework' },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-03',
    },
    {
      itemNumber: 4,
      id: 'shared-master-data',
      name: {
        ar: 'إطار البيانات الرئيسية المشتركة',
        en: 'Shared Master Data Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-04',
    },
    {
      itemNumber: 5,
      id: 'localization',
      name: { ar: 'إطار التوطين واللغات', en: 'Localization Framework' },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-05',
    },
    {
      itemNumber: 6,
      id: 'tax-currency-calendar',
      name: {
        ar: 'أسس الضرائب والعملات والتقويم',
        en: 'Tax / Currency / Calendar Foundations',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-06',
    },
    {
      itemNumber: 7,
      id: 'document-attachment',
      name: {
        ar: 'إطار المستندات والمرفقات',
        en: 'Document & Attachment Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-07',
    },
    {
      itemNumber: 8,
      id: 'notification',
      name: { ar: 'إطار الإشعارات', en: 'Notification Framework' },
      status: 'pending',
      kind: 'runtime_capability',
      decisionId: null,
    },
    {
      itemNumber: 9,
      id: 'integration-api',
      name: {
        ar: 'إطار التكامل وواجهات البرمجة',
        en: 'Integration / API Framework',
      },
      status: 'pending',
      kind: 'runtime_capability',
      decisionId: null,
    },
    {
      itemNumber: 10,
      id: 'reporting-analytics',
      name: {
        ar: 'إطار التقارير والتحليلات',
        en: 'Reporting & Analytics Framework',
      },
      status: 'pending',
      kind: 'runtime_capability',
      decisionId: null,
    },
    {
      itemNumber: 11,
      id: 'configuration-feature-management',
      name: {
        ar: 'إدارة التهيئة والميزات',
        en: 'Configuration & Feature Management',
      },
      status: 'pending',
      kind: 'runtime_capability',
      decisionId: null,
    },
    {
      itemNumber: 12,
      id: 'extension-compatibility',
      name: {
        ar: 'إطار التوسعة وعقود التوافق',
        en: 'Extension Framework / Compatibility Contracts',
      },
      status: 'pending',
      kind: 'runtime_capability',
      decisionId: null,
    },
    {
      itemNumber: 13,
      id: 'platform-foundation-adoption',
      name: {
        ar: 'اعتماد أسس المنصة المشتركة',
        en: 'Platform Foundation Adoption',
      },
      status: 'pending',
      kind: 'planning_gate',
      decisionId: null,
    },
  ],
  referenceCounts: {
    approvedArchitecturalDecisions: 120,
    futureArchitectureConsiderations: 24,
    architecturalResearchPackages: 13,
    independentReviewNotes: 57,
  },
};

/**
 * Authoritative Current Reference Snapshot for Teranoo ERP Knowledge Hub
 * updated in TASK-004 from the 6 verified BATCH-001 official Project Foundations
 * Markdown files (commit 397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f,
 * tree db531de6b2ab452578a550e07c5fd80e4bfe6b64, reviewed 2026-11-26).
 *
 * Strictly distinguishes:
 * - 126 approved architectural D-* decisions (D-MKT-01 is tracked separately outside this counter)
 * - 12 approved runtime platform capabilities (D-PLAT-01..D-PLAT-12) + 1 adoption gate (D-PLAT-13)
 * - Phase 6 identified as next planned phase (not started / awaiting explicit authorization)
 */
export const PROJECT_REFERENCE_SNAPSHOT: ProjectReferenceSnapshot = {
  provenance: {
    sourceRepository: 'https://github.com/Alabasi1980/TeranooErp',
    officialSources: [
      'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
      'teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md',
      'teranoo-erp-planning/00-project-foundation/WORKING_RULES.md',
      'teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md',
      'teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md',
      'teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md',
    ],
    reviewedCommitSha: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
    reviewedTreeSha: 'db531de6b2ab452578a550e07c5fd80e4bfe6b64',
    referenceReviewDate: '2026-11-26',
    isLiveSynced: false,
    snapshotNatureNote: {
      ar: 'تم استيراد وثائق أسس المشروع الست (BATCH-001) والتحقق من بصمات Git blob SHA مقابل الالتزام المرجعي، وليست المنصة في مزامنة حية مع GitHub.',
      en: 'All six BATCH-001 Project Foundations source files have been imported and Git-blob verified against the reference commit; this platform is not live-synced with GitHub.',
    },
    reviewDateNote: {
      ar: 'تاريخ 2026-11-26 هو تاريخ استيراد ومراجعة دفعة BATCH-001، وهو مستقل عن تواريخ اعتماد الوثائق المصدرية الأصلية (مثل 2026-10-02).',
      en: '2026-11-26 is the BATCH-001 ingestion and review date, distinct from original source approval dates (such as 2026-10-02).',
    },
    metricsOriginNote: {
      ar: 'التمييز المصدري (BATCH-001): 126 قرارًا معماريًا مفهرسًا ومعتمدًا (D-*) في سجل القرارات الرسمي (DECISION_REGISTER.md) ويُحتسب قرار السوق المشروط D-MKT-01 بشكل منفصل خارج عدّاد 126؛ اكتمال المراحل 1–5 وبنود المرحلة 5 (13/13: 12 قدرة تشغيلية + البند 13 بوابة اعتماد D-PLAT-13) من خطة العمل الرسمية (PROJECT_WORK_PLAN.md) مع انتظار تكليف المرحلة 6؛ و24 اعتبارًا معماريًا مستقبليًا (FAC-001..FAC-024) ليست قرارات معتمدة؛ بينما 13 حزمة بحثية و57 ملاحظة مراجعة مستقلة تعود للجرد المرجعي بانتظار دفعاتها المخصصة.',
      en: 'Source classification (BATCH-001): 126 approved architectural D-* decisions indexed in DECISION_REGISTER.md (with conditional market decision D-MKT-01 explicitly tracked outside the 126 counter); Phases 1–5 completed including Phase 5 (13/13: 12 runtime capability frameworks + item 13 adoption gate D-PLAT-13) from PROJECT_WORK_PLAN.md with Phase 6 awaiting explicit authorization; 24 Future Architecture Considerations (FAC-001..FAC-024, NOT approved decisions); while 13 research packages and 57 independent review notes remain reference inventory counts awaiting their dedicated batches.',
    },
  },
  snapshotScopeNote: {
    ar: 'حالة التخطيط والتوثيق والاعتماد المعماري الموثقة من دفعة BATCH-001 (أسس المشروع) — لا تمثل نسبة إنجاز البرمجة الفعلية لنظام Teranoo ERP ولا تتصل مباشرة بمستودع المصدر.',
    en: 'Verified planning, documentation, and architectural approval state from BATCH-001 (Project Foundations). It does not represent ERP software implementation completion and is not live-synced with the source repository.',
  },
  identity: {
    productName: 'Teranoo ERP',
    productType: {
      ar: 'نظام ERP معياري بمستوى المؤسسات (Enterprise-Grade Modular ERP)',
      en: 'Enterprise-Grade Modular ERP',
    },
    targetCustomers: {
      ar: 'المؤسسات المتوسطة والكبيرة (Medium & Large Enterprises)',
      en: 'Medium & Large Enterprises',
    },
    productStrategy: {
      ar: 'نظام ERP تجاري، معياري، وقابل للتهيئة (Commercial, Modular, Configurable ERP)',
      en: 'Commercial, Modular, Configurable ERP',
    },
    deploymentStrategy: {
      ar: 'SaaS-first',
      en: 'SaaS-first',
    },
    futureDeploymentProfile: {
      ar: 'Connected On-Premises',
      en: 'Connected On-Premises',
    },
    databaseEngine: 'PostgreSQL',
  },
  coreBusinessModules: [
    {
      id: 'finance',
      order: 1,
      name: {
        ar: 'المالية',
        en: 'Finance',
      },
      classification: 'official',
    },
    {
      id: 'inventory-warehouse',
      order: 2,
      name: {
        ar: 'المخزون وإدارة المستودعات',
        en: 'Inventory & Warehouse Management',
      },
      classification: 'official',
    },
    {
      id: 'procurement',
      order: 3,
      name: {
        ar: 'المشتريات',
        en: 'Procurement',
      },
      classification: 'official',
    },
    {
      id: 'sales-order-management',
      order: 4,
      name: {
        ar: 'المبيعات وإدارة الطلبات',
        en: 'Sales & Order Management',
      },
      classification: 'official',
    },
  ],
  planningPhases: [
    {
      phaseNumber: 1,
      code: 'PHASE-1',
      name: {
        ar: 'المرحلة 1 — تأسيس المنتج ورؤيته',
        en: 'Phase 1 — Product Foundation & Vision',
      },
      status: 'completed',
    },
    {
      phaseNumber: 2,
      code: 'PHASE-2',
      name: {
        ar: 'المرحلة 2 — معمارية الوحدات وقواعد الاعتمادية',
        en: 'Phase 2 — Module Architecture & Dependency Rules',
      },
      status: 'completed',
    },
    {
      phaseNumber: 3,
      code: 'PHASE-3',
      name: {
        ar: 'المرحلة 3 — نموذج المنصة وتعدد العملاء',
        en: 'Phase 3 — Platform & Tenancy Model',
      },
      status: 'completed',
    },
    {
      phaseNumber: 4,
      code: 'PHASE-4',
      name: {
        ar: 'المرحلة 4 — استراتيجية النشر وقواعد البيانات',
        en: 'Phase 4 — Deployment & Database Strategy',
      },
      status: 'completed',
    },
    {
      phaseNumber: 5,
      code: 'PHASE-5',
      name: {
        ar: 'المرحلة 5 — قدرات المنصة المشتركة',
        en: 'Phase 5 — Shared Platform Capabilities',
      },
      status: 'completed',
    },
  ],
  phase5Capabilities: [
    {
      itemNumber: 1,
      id: 'identity-access',
      name: {
        ar: 'إطار الهوية والصلاحيات',
        en: 'Identity & Access Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-01',
    },
    {
      itemNumber: 2,
      id: 'workflow-approvals',
      name: {
        ar: 'إطار سير العمل والموافقات',
        en: 'Workflow & Approvals Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-02',
    },
    {
      itemNumber: 3,
      id: 'audit-trail',
      name: {
        ar: 'إطار سجل التدقيق',
        en: 'Audit Trail Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-03',
    },
    {
      itemNumber: 4,
      id: 'shared-master-data',
      name: {
        ar: 'إطار البيانات الرئيسية المشتركة',
        en: 'Shared Master Data Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-04',
    },
    {
      itemNumber: 5,
      id: 'localization',
      name: {
        ar: 'إطار التوطين واللغات',
        en: 'Localization Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-05',
    },
    {
      itemNumber: 6,
      id: 'tax-currency-calendar',
      name: {
        ar: 'أسس الضرائب والعملات والتقويم',
        en: 'Tax / Currency / Calendar Foundations',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-06',
    },
    {
      itemNumber: 7,
      id: 'document-attachment',
      name: {
        ar: 'إطار المستندات والمرفقات',
        en: 'Document & Attachment Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-07',
    },
    {
      itemNumber: 8,
      id: 'notification',
      name: {
        ar: 'إطار الإشعارات',
        en: 'Notification Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-08',
    },
    {
      itemNumber: 9,
      id: 'integration-api',
      name: {
        ar: 'إطار التكامل وواجهات البرمجة',
        en: 'Integration / API Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-09',
    },
    {
      itemNumber: 10,
      id: 'reporting-analytics',
      name: {
        ar: 'إطار التقارير والتحليلات',
        en: 'Reporting & Analytics Framework',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-10',
    },
    {
      itemNumber: 11,
      id: 'configuration-feature-management',
      name: {
        ar: 'إدارة التهيئة والميزات',
        en: 'Configuration & Feature Management',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-11',
    },
    {
      itemNumber: 12,
      id: 'extension-compatibility',
      name: {
        ar: 'إطار التوسعة وعقود التوافق',
        en: 'Extension Framework / Compatibility Contracts',
      },
      status: 'approved',
      kind: 'runtime_capability',
      decisionId: 'D-PLAT-12',
    },
    {
      itemNumber: 13,
      id: 'platform-foundation-adoption',
      name: {
        ar: 'اعتماد أسس المنصة المشتركة',
        en: 'Platform Foundation Adoption',
      },
      status: 'approved',
      kind: 'planning_gate',
      decisionId: 'D-PLAT-13',
    },
  ],
  referenceCounts: {
    approvedArchitecturalDecisions: 126,
    futureArchitectureConsiderations: 24,
    architecturalResearchPackages: 13,
    independentReviewNotes: 57,
  },
};
