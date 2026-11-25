import type { ProjectReferenceSnapshot } from '@/content/models/types';

/**
 * Authoritative TASK-001 Reference Snapshot.
 * Contains exclusively verified reference facts authorized in TASK-001 Section 13.
 * Do NOT fabricate additional decision IDs, dates, evaluations, or research outcomes.
 */
export const PROJECT_REFERENCE_SNAPSHOT: ProjectReferenceSnapshot = {
  snapshotScopeNote: {
    ar: 'لقطة مرجعية لحالة التخطيط والتوثيق والاعتماد المعماري في مشروع Teranoo ERP، وليست اتصالًا مباشرًا بالمستودع الرسمي ولا تمثل نسبة إنجاز البرمجة الفعلية لنظام ERP.',
    en: 'Reference snapshot of planning, documentation, and architectural approval status for Teranoo ERP. It is not a live connection to the official repository and does not represent ERP software implementation completion.',
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
      code: 'MOD-FIN',
      name: {
        ar: 'المالية',
        en: 'Finance',
      },
      classification: 'official',
    },
    {
      id: 'inventory-warehouse',
      order: 2,
      code: 'MOD-INV',
      name: {
        ar: 'المخزون وإدارة المستودعات',
        en: 'Inventory & Warehouse Management',
      },
      classification: 'official',
    },
    {
      id: 'procurement',
      order: 3,
      code: 'MOD-PROC',
      name: {
        ar: 'المشتريات',
        en: 'Procurement',
      },
      classification: 'official',
    },
    {
      id: 'sales-order-management',
      order: 4,
      code: 'MOD-SLS',
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
      name: {
        ar: 'إطار الهوية والصلاحيات',
        en: 'Identity & Access Framework',
      },
      status: 'approved',
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
      decisionId: 'D-PLAT-07',
    },
    {
      itemNumber: 8,
      id: 'notification',
      name: {
        ar: 'إطار الإشعارات',
        en: 'Notification Framework',
      },
      status: 'pending',
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
