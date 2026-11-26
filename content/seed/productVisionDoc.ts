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
    documentId: 'kh-doc-product-vision-ref',
    classification: 'official',
    approvalStatus: 'reference_snapshot',
    sourceReference: {
      ar: 'اللقطة المرجعية المعتمدة (بانتظار تسليم ملف \u206600_PROJECT_VISION.md\u2069 الكامل)',
      en: 'Authorized Reference Snapshot (awaiting full 00_PROJECT_VISION.md source delivery)',
    },
    scopeNote: {
      ar: 'يعرض هذا القسم الحقائق المعتمدة من اللقطة التخطيطية المراجعة فقط، ومهيأ لاستقبال النص الكامل لوثيقة \u206600_PROJECT_VISION.md\u2069 عند تسليمها واعتماد نشرها دون أي افتراضات.',
      en: 'This page presents verified facts from the reviewed planning snapshot only and is structured to host the full 00_PROJECT_VISION.md document once supplied and authorized, without fabricated prose.',
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
