import type {
  DocumentMetadata,
  RelatedLinkItem,
  TocHeading,
} from '@/content/models/types';

export interface ProductVisionDocumentData {
  metadata: DocumentMetadata;
  headings: readonly TocHeading[];
  relatedLinks: readonly RelatedLinkItem[];
}

export const PRODUCT_VISION_DOC: ProductVisionDocumentData = {
  metadata: {
    documentId: 'DOC-VISION-REF',
    classification: 'official',
    approvalStatus: 'reference_snapshot',
    sourceReference: {
      ar: 'اللقطة المرجعية المعتمدة لمهمة TASK-001 (القسم 13)',
      en: 'Authorized TASK-001 Reference Snapshot (Section 13)',
    },
    scopeNote: {
      ar: 'صفحة مرجعية أولية لاختبار قالب التوثيق باستخدام الحقائق المعتمدة فقط؛ ستُستكمل التفاصيل الكاملة للوثيقة الرسمية في مهمة لاحقة.',
      en: 'Initial reference page validating the documentation template using exclusively authorized snapshot facts; full official product vision prose will be populated in a later task.',
    },
  },
  headings: [
    {
      id: 'identity',
      level: 2,
      title: {
        ar: 'الهوية المؤسسية للمنتج',
        en: 'Product Identity',
      },
    },
    {
      id: 'strategy',
      level: 2,
      title: {
        ar: 'استراتيجية المنتج والنطاق التجاري',
        en: 'Product Strategy & Target Segment',
      },
    },
    {
      id: 'modules',
      level: 2,
      title: {
        ar: 'الأنظمة التجارية الأساسية',
        en: 'Business Core Modules',
      },
    },
    {
      id: 'deployment',
      level: 2,
      title: {
        ar: 'استراتيجية الاستضافة وقاعدة البيانات',
        en: 'Deployment & Database Profile',
      },
    },
    {
      id: 'governance',
      level: 2,
      title: {
        ar: 'حوكمة التوثيق ومراحل التخطيط',
        en: 'Documentation & Planning Governance',
      },
    },
  ],
  relatedLinks: [
    {
      href: '/roadmap',
      title: { ar: 'خارطة الطريق', en: 'Roadmap' },
      description: {
        ar: 'متابعة مراحل التخطيط الخمس وحالة الاعتماد المعماري.',
        en: 'Track the five planning phases and architectural approval progression.',
      },
      classification: 'official',
    },
    {
      href: '/modules',
      title: { ar: 'الأنظمة الفرعية', en: 'Business Modules' },
      description: {
        ar: 'استعراض الأنظمة التجارية الأساسية الأربعة لمنتج Teranoo ERP.',
        en: 'Explore the four core business modules defined for Teranoo ERP.',
      },
      classification: 'official',
    },
    {
      href: '/platform',
      title: { ar: 'المنصة المشتركة', en: 'Platform Foundation' },
      description: {
        ar: 'استعراض قدرات المنصة المشتركة للمرحلة الخامسة ومعرفات قراراتها.',
        en: 'Inspect Phase 5 shared platform capabilities and approved decision IDs.',
      },
      classification: 'official',
    },
    {
      href: '/deployment',
      title: { ar: 'الاستضافة وقواعد البيانات', en: 'Deployment & Database' },
      description: {
        ar: 'نموذج SaaS-first والملف المستقبلي Connected On-Premises ومحرك PostgreSQL.',
        en: 'SaaS-first model, future Connected On-Premises profile, and PostgreSQL engine.',
      },
      classification: 'official',
    },
  ],
};
