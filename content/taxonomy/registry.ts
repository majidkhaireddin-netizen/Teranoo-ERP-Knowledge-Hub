import type { ContentClassificationType, LocalizedText } from '@/content/models/types';

export interface TaxonomyEntry<TId extends string = string> {
  readonly id: TId;
  readonly label: LocalizedText;
  readonly description?: LocalizedText;
}

export const CONTENT_CLASSIFICATION_VALUES = [
  'official',
  'approved-decision',
  'research',
  'independent',
  'future',
  'educational',
  'illustrative',
  'engineering',
] as const satisfies readonly ContentClassificationType[];

export const CONTENT_TYPE_VALUES = [
  'product-vision',
  'roadmap',
  'architecture-document',
  'module-model',
  'platform-framework',
  'architectural-decision',
  'functional-decision',
  'requirement',
  'research-report',
  'comparative-research',
  'research-evidence',
  'future-consideration',
  'independent-review',
  'independent-review-note',
  'business-process',
  'business-rule',
  'functional-specification',
  'screen-specification',
  'data-model',
  'entity-specification',
  'integration-contract',
  'api-specification',
  'implementation-guide',
  'code-example',
  'engineering-journal-entry',
  'development-task',
  'technical-issue',
  'solution-record',
  'test-specification',
  'test-result',
  'deployment-guide',
  'release-note',
  'lesson-learned',
  'glossary-entry',
  'educational-explanation',
] as const;

export type ContentTypeId = (typeof CONTENT_TYPE_VALUES)[number];

export interface ContentTypeDefinition extends TaxonomyEntry<ContentTypeId> {
  readonly rendererKey:
    | 'generic'
    | 'research'
    | 'screen-specification'
    | 'data-model'
    | 'engineering-journal'
    | 'test-record';
}

export const CONTENT_TYPES: readonly ContentTypeDefinition[] = [
  { id: 'product-vision', label: { ar: 'رؤية المنتج', en: 'Product Vision' }, rendererKey: 'generic' },
  { id: 'roadmap', label: { ar: 'خارطة الطريق', en: 'Roadmap' }, rendererKey: 'generic' },
  { id: 'architecture-document', label: { ar: 'وثيقة معمارية', en: 'Architecture Document' }, rendererKey: 'generic' },
  { id: 'module-model', label: { ar: 'نموذج نظام فرعي', en: 'Module Model' }, rendererKey: 'generic' },
  { id: 'platform-framework', label: { ar: 'إطار منصة مشتركة', en: 'Platform Framework' }, rendererKey: 'generic' },
  { id: 'architectural-decision', label: { ar: 'قرار معماري', en: 'Architectural Decision' }, rendererKey: 'generic' },
  { id: 'functional-decision', label: { ar: 'قرار وظيفي', en: 'Functional Decision' }, rendererKey: 'generic' },
  { id: 'requirement', label: { ar: 'متطلب رسمي', en: 'Requirement' }, rendererKey: 'generic' },
  { id: 'research-report', label: { ar: 'تقرير بحثي', en: 'Research Report' }, rendererKey: 'research' },
  { id: 'comparative-research', label: { ar: 'بحث مقارن', en: 'Comparative Research' }, rendererKey: 'research' },
  { id: 'research-evidence', label: { ar: 'دليل بحثي', en: 'Research Evidence' }, rendererKey: 'research' },
  { id: 'future-consideration', label: { ar: 'اعتبار مستقبلي', en: 'Future Consideration' }, rendererKey: 'generic' },
  { id: 'independent-review', label: { ar: 'مراجعة مستقلة', en: 'Independent Review' }, rendererKey: 'generic' },
  { id: 'independent-review-note', label: { ar: 'ملاحظة مراجعة مستقلة', en: 'Independent Review Note' }, rendererKey: 'generic' },
  { id: 'business-process', label: { ar: 'مسار عمل تجاري', en: 'Business Process' }, rendererKey: 'generic' },
  { id: 'business-rule', label: { ar: 'قاعدة عمل', en: 'Business Rule' }, rendererKey: 'generic' },
  { id: 'functional-specification', label: { ar: 'مواصفة وظيفية', en: 'Functional Specification' }, rendererKey: 'generic' },
  { id: 'screen-specification', label: { ar: 'مواصفة شاشة', en: 'Screen Specification' }, rendererKey: 'screen-specification' },
  { id: 'data-model', label: { ar: 'نموذج بيانات', en: 'Data Model' }, rendererKey: 'data-model' },
  { id: 'entity-specification', label: { ar: 'مواصفة كيان بيانات', en: 'Entity Specification' }, rendererKey: 'data-model' },
  { id: 'integration-contract', label: { ar: 'عقد تكامل', en: 'Integration Contract' }, rendererKey: 'generic' },
  { id: 'api-specification', label: { ar: 'مواصفة واجهة برمجة', en: 'API Specification' }, rendererKey: 'generic' },
  { id: 'implementation-guide', label: { ar: 'دليل تنفيذ هندسي', en: 'Implementation Guide' }, rendererKey: 'generic' },
  { id: 'code-example', label: { ar: 'مثال برمجي', en: 'Code Example' }, rendererKey: 'generic' },
  { id: 'engineering-journal-entry', label: { ar: 'قيد سجل هندسي', en: 'Engineering Journal Entry' }, rendererKey: 'engineering-journal' },
  { id: 'development-task', label: { ar: 'مهمة تطوير', en: 'Development Task' }, rendererKey: 'engineering-journal' },
  { id: 'technical-issue', label: { ar: 'مشكلة تقنية', en: 'Technical Issue' }, rendererKey: 'engineering-journal' },
  { id: 'solution-record', label: { ar: 'سجل حل تقني', en: 'Solution Record' }, rendererKey: 'engineering-journal' },
  { id: 'test-specification', label: { ar: 'مواصفة اختبار', en: 'Test Specification' }, rendererKey: 'test-record' },
  { id: 'test-result', label: { ar: 'نتيجة اختبار', en: 'Test Result' }, rendererKey: 'test-record' },
  { id: 'deployment-guide', label: { ar: 'دليل نشر وتشغيل', en: 'Deployment Guide' }, rendererKey: 'generic' },
  { id: 'release-note', label: { ar: 'ملاحظات إصدار', en: 'Release Note' }, rendererKey: 'generic' },
  { id: 'lesson-learned', label: { ar: 'درس مستفاد', en: 'Lesson Learned' }, rendererKey: 'engineering-journal' },
  { id: 'glossary-entry', label: { ar: 'مصطلح مرجعي', en: 'Glossary Entry' }, rendererKey: 'generic' },
  { id: 'educational-explanation', label: { ar: 'شرح تعليمي', en: 'Educational Explanation' }, rendererKey: 'generic' },
];

export const EDITORIAL_STATUS_VALUES = [
  'draft',
  'under-review',
  'reference',
  'published',
  'superseded',
  'deprecated',
  'archived',
] as const;

export type EditorialStatus = (typeof EDITORIAL_STATUS_VALUES)[number];

export const PUBLICATION_STATUS_VALUES = [
  'private',
  'internal',
  'public',
] as const;

export type PublicationStatus = (typeof PUBLICATION_STATUS_VALUES)[number];

export const OFFICIAL_APPROVAL_STATUS_VALUES = [
  'not-applicable',
  'proposed',
  'under-review',
  'approved',
  'reference',
  'superseded',
  'deprecated',
] as const;

export type OfficialApprovalStatus =
  (typeof OFFICIAL_APPROVAL_STATUS_VALUES)[number];

export const IMPLEMENTATION_STATUS_VALUES = [
  'not-applicable',
  'not-started',
  'in-progress',
  'implemented',
  'verified',
  'deprecated',
] as const;

export type ImplementationStatus =
  (typeof IMPLEMENTATION_STATUS_VALUES)[number];

export const KNOWLEDGE_DEPTH_VALUES = ['L1', 'L2', 'L3', 'L4', 'L5'] as const;

export type KnowledgeDepth = (typeof KNOWLEDGE_DEPTH_VALUES)[number];

export const KNOWLEDGE_DEPTHS: readonly TaxonomyEntry<KnowledgeDepth>[] = [
  { id: 'L1', label: { ar: 'L1 — نظرة عامة', en: 'L1 — Overview' } },
  { id: 'L2', label: { ar: 'L2 — تحليل الأعمال', en: 'L2 — Business Analysis' } },
  { id: 'L3', label: { ar: 'L3 — المعمارية', en: 'L3 — Architecture' } },
  { id: 'L4', label: { ar: 'L4 — المواصفة التفصيلية', en: 'L4 — Detailed Specification' } },
  { id: 'L5', label: { ar: 'L5 — التنفيذ الهندسي', en: 'L5 — Implementation' } },
];

export const JOURNEY_STAGE_VALUES = [
  'product-discovery',
  'research',
  'architecture',
  'functional-design',
  'detailed-system-design',
  'engineering',
  'testing',
  'deployment',
  'operations',
  'continuous-evolution',
] as const;

export type JourneyStageId = (typeof JOURNEY_STAGE_VALUES)[number];

export const JOURNEY_STAGES: readonly TaxonomyEntry<JourneyStageId>[] = [
  { id: 'product-discovery', label: { ar: 'اكتشاف المنتج والرؤية', en: 'Product Discovery' } },
  { id: 'research', label: { ar: 'الأبحاث والمقارنات', en: 'Research' } },
  { id: 'architecture', label: { ar: 'المعمارية', en: 'Architecture' } },
  { id: 'functional-design', label: { ar: 'التصميم الوظيفي', en: 'Functional Design' } },
  { id: 'detailed-system-design', label: { ar: 'التصميم التفصيلي للنظام', en: 'Detailed System Design' } },
  { id: 'engineering', label: { ar: 'الهندسة والتنفيذ', en: 'Engineering' } },
  { id: 'testing', label: { ar: 'الاختبار والجودة', en: 'Testing' } },
  { id: 'deployment', label: { ar: 'النشر والتشغيل', en: 'Deployment' } },
  { id: 'operations', label: { ar: 'العمليات والمراقبة', en: 'Operations' } },
  { id: 'continuous-evolution', label: { ar: 'التطوير المستمر', en: 'Continuous Evolution' } },
];

/**
 * Supports non-integer official Teranoo ERP project phases (e.g. Phase 6.5)
 * as string identifiers rather than integer-only numbers.
 */
export const OFFICIAL_PHASE_PATTERN = /^phase-\d+(?:\.\d+)?$/;

export const KNOWN_OFFICIAL_PHASES: readonly TaxonomyEntry[] = [
  { id: 'phase-1', label: { ar: 'المرحلة 1', en: 'Phase 1' } },
  { id: 'phase-2', label: { ar: 'المرحلة 2', en: 'Phase 2' } },
  { id: 'phase-3', label: { ar: 'المرحلة 3', en: 'Phase 3' } },
  { id: 'phase-4', label: { ar: 'المرحلة 4', en: 'Phase 4' } },
  { id: 'phase-5', label: { ar: 'المرحلة 5 — قدرات المنصة المشتركة', en: 'Phase 5 — Shared Platform Capabilities' } },
  { id: 'phase-6', label: { ar: 'المرحلة 6', en: 'Phase 6' } },
  { id: 'phase-6.5', label: { ar: 'المرحلة 6.5', en: 'Phase 6.5' } },
];

export const BUSINESS_MODULES_TAXONOMY: readonly TaxonomyEntry[] = [
  { id: 'finance', label: { ar: 'المالية', en: 'Finance' } },
  { id: 'inventory-warehouse', label: { ar: 'المخزون وإدارة المستودعات', en: 'Inventory & Warehouse Management' } },
  { id: 'procurement', label: { ar: 'المشتريات', en: 'Procurement' } },
  { id: 'sales-order-management', label: { ar: 'المبيعات وإدارة الطلبات', en: 'Sales & Order Management' } },
];

export const PLATFORM_DOMAIN_VALUES = [
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
] as const;

export type PlatformDomainId = (typeof PLATFORM_DOMAIN_VALUES)[number];

export const PLATFORM_DOMAINS: readonly TaxonomyEntry<PlatformDomainId>[] = [
  { id: 'identity-access', label: { ar: 'الهوية والصلاحيات', en: 'Identity & Access' } },
  { id: 'workflow-approvals', label: { ar: 'سير العمل والموافقات', en: 'Workflow & Approvals' } },
  { id: 'audit-trail', label: { ar: 'سجل التدقيق', en: 'Audit Trail' } },
  { id: 'shared-master-data', label: { ar: 'البيانات الرئيسية المشتركة', en: 'Shared Master Data' } },
  { id: 'localization', label: { ar: 'التوطين واللغات', en: 'Localization' } },
  { id: 'tax', label: { ar: 'الضرائب', en: 'Tax' } },
  { id: 'currency', label: { ar: 'العملات', en: 'Currency' } },
  { id: 'calendar', label: { ar: 'التقويم', en: 'Calendar' } },
  { id: 'documents-attachments', label: { ar: 'المستندات والمرفقات', en: 'Documents & Attachments' } },
  { id: 'notifications', label: { ar: 'الإشعارات', en: 'Notifications' } },
  { id: 'integration', label: { ar: 'التكامل', en: 'Integration' } },
  { id: 'reporting', label: { ar: 'التقارير والتحليلات', en: 'Reporting' } },
  { id: 'configuration', label: { ar: 'التهيئة والإعدادات', en: 'Configuration' } },
  { id: 'extensions', label: { ar: 'التوسعة وعقود التوافق', en: 'Extensions' } },
];

export const CONTROLLED_TOPIC_VALUES = [
  'security',
  'multi-tenancy',
  'accounting',
  'data-governance',
  'user-experience',
  'performance',
  'compliance',
  'upgradeability',
  'extensibility',
  'documentation',
  'governance',
  'architecture',
  'deployment',
] as const;

export type ControlledTopicId = (typeof CONTROLLED_TOPIC_VALUES)[number];

export const CONTROLLED_TOPICS: readonly TaxonomyEntry<ControlledTopicId>[] = [
  { id: 'security', label: { ar: 'الأمن السيبراني', en: 'Security' } },
  { id: 'multi-tenancy', label: { ar: 'تعدد العملاء', en: 'Multi-Tenancy' } },
  { id: 'accounting', label: { ar: 'المحاسبة', en: 'Accounting' } },
  { id: 'data-governance', label: { ar: 'حوكمة البيانات', en: 'Data Governance' } },
  { id: 'user-experience', label: { ar: 'تجربة المستخدم', en: 'User Experience' } },
  { id: 'performance', label: { ar: 'الأداء', en: 'Performance' } },
  { id: 'compliance', label: { ar: 'الامتثال', en: 'Compliance' } },
  { id: 'upgradeability', label: { ar: 'قابلية الترقية', en: 'Upgradeability' } },
  { id: 'extensibility', label: { ar: 'قابلية التوسعة', en: 'Extensibility' } },
  { id: 'documentation', label: { ar: 'التوثيق والمعرفة', en: 'Documentation' } },
  { id: 'governance', label: { ar: 'الحوكمة والاعتماد', en: 'Governance' } },
  { id: 'architecture', label: { ar: 'المعمارية', en: 'Architecture' } },
  { id: 'deployment', label: { ar: 'الاستضافة والتشغيل', en: 'Deployment' } },
];

export const RELATIONSHIP_TYPE_VALUES = [
  'references',
  'supported-by-evidence',
  'derived-from',
  'justifies',
  'implements',
  'constrains',
  'depends-on',
  'related-to',
  'part-of',
  'supersedes',
  'tests',
  'validates',
  'resolves',
  'illustrates',
  'translation-of',
] as const;

export type RelationshipTypeId = (typeof RELATIONSHIP_TYPE_VALUES)[number];

export interface RelationshipTypeDefinition {
  readonly id: RelationshipTypeId;
  readonly outgoingLabel: LocalizedText;
  readonly incomingLabel: LocalizedText;
}

export const RELATIONSHIP_TYPES: readonly RelationshipTypeDefinition[] = [
  {
    id: 'references',
    outgoingLabel: { ar: 'يستشهد بـ', en: 'References' },
    incomingLabel: { ar: 'مُستشهَد به في', en: 'Referenced by' },
  },
  {
    id: 'supported-by-evidence',
    outgoingLabel: { ar: 'مدعوم بأدلة من', en: 'Supported by evidence' },
    incomingLabel: { ar: 'يدعم بأدلة', en: 'Provides evidence for' },
  },
  {
    id: 'derived-from',
    outgoingLabel: { ar: 'مشتق من', en: 'Derived from' },
    incomingLabel: { ar: 'مصدر اشتقاق لـ', en: 'Source for derivative' },
  },
  {
    id: 'justifies',
    outgoingLabel: { ar: 'يبرر', en: 'Justifies' },
    incomingLabel: { ar: 'مبرَّر بـ', en: 'Justified by' },
  },
  {
    id: 'implements',
    outgoingLabel: { ar: 'ينفذ', en: 'Implements' },
    incomingLabel: { ar: 'مُنفَّذ بواسطة', en: 'Implemented by' },
  },
  {
    id: 'constrains',
    outgoingLabel: { ar: 'يقيّد', en: 'Constrains' },
    incomingLabel: { ar: 'مقيَّد بـ', en: 'Constrained by' },
  },
  {
    id: 'depends-on',
    outgoingLabel: { ar: 'يعتمد معرفيًا على', en: 'Depends on' },
    incomingLabel: { ar: 'يعتمد عليه معرفيًا', en: 'Depended on by' },
  },
  {
    id: 'related-to',
    outgoingLabel: { ar: 'مرتبط بـ', en: 'Related to' },
    incomingLabel: { ar: 'مرتبط من', en: 'Related from' },
  },
  {
    id: 'part-of',
    outgoingLabel: { ar: 'جزء من', en: 'Part of' },
    incomingLabel: { ar: 'يحتوي على', en: 'Includes' },
  },
  {
    id: 'supersedes',
    outgoingLabel: { ar: 'يحل محل', en: 'Supersedes' },
    incomingLabel: { ar: 'تم استبداله بـ', en: 'Superseded by' },
  },
  {
    id: 'tests',
    outgoingLabel: { ar: 'يختبر', en: 'Tests' },
    incomingLabel: { ar: 'مُختبَر بواسطة', en: 'Tested by' },
  },
  {
    id: 'validates',
    outgoingLabel: { ar: 'يتحقق من', en: 'Validates' },
    incomingLabel: { ar: 'مُتحقَّق منه بواسطة', en: 'Validated by' },
  },
  {
    id: 'resolves',
    outgoingLabel: { ar: 'يحل', en: 'Resolves' },
    incomingLabel: { ar: 'محلول بواسطة', en: 'Resolved by' },
  },
  {
    id: 'illustrates',
    outgoingLabel: { ar: 'يوضّح', en: 'Illustrates' },
    incomingLabel: { ar: 'موضَّح بواسطة', en: 'Illustrated by' },
  },
  {
    id: 'translation-of',
    outgoingLabel: { ar: 'ترجمة لـ', en: 'Translation of' },
    incomingLabel: { ar: 'له ترجمة', en: 'Translated as' },
  },
];

export const APPROVED_COLLECTION_DIRS = [
  'official',
  'research',
  'analysis',
  'future',
  'educational',
  'engineering',
] as const;

export type ApprovedCollectionDir = (typeof APPROVED_COLLECTION_DIRS)[number];

export function getContentTypeDefinition(
  id: ContentTypeId
): ContentTypeDefinition | undefined {
  return CONTENT_TYPES.find((item) => item.id === id);
}

export function getRelationshipDefinition(
  id: RelationshipTypeId
): RelationshipTypeDefinition | undefined {
  return RELATIONSHIP_TYPES.find((item) => item.id === id);
}

export function isValidOfficialPhaseRef(value: string): boolean {
  return OFFICIAL_PHASE_PATTERN.test(value);
}

export function getTaxonomyLabel(
  entries: readonly TaxonomyEntry[],
  id: string
): LocalizedText | undefined {
  return entries.find((item) => item.id === id)?.label;
}
