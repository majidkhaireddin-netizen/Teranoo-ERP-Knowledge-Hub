import type { ContentClassificationType, LocalizedText } from '@/content/models/types';

export type NavIconKey =
  | 'layout-dashboard'
  | 'compass'
  | 'map'
  | 'layers'
  | 'boxes'
  | 'git-fork'
  | 'blocks'
  | 'building-2'
  | 'database'
  | 'file-check-2'
  | 'flask-conical'
  | 'telescope'
  | 'clipboard-check'
  | 'workflow'
  | 'network'
  | 'book-open-text'
  | 'history'
  | 'info'
  | 'library'
  | 'terminal-square';

export interface NavItemConfig {
  id: string;
  href: string;
  labelKey: string;
  label: LocalizedText;
  description: LocalizedText;
  icon: NavIconKey;
  groupId: string;
  classification: ContentClassificationType;
  implementedInTask001: boolean;
}

export interface NavGroupConfig {
  id: string;
  labelKey: string;
  label: LocalizedText;
  items: readonly NavItemConfig[];
}

export const NAVIGATION_GROUPS: readonly NavGroupConfig[] = [
  {
    id: 'overview',
    labelKey: 'nav.groups.overview',
    label: { ar: 'نظرة عامة', en: 'Overview' },
    items: [
      {
        id: 'dashboard',
        href: '/',
        labelKey: 'nav.items.dashboard',
        label: { ar: 'لوحة المعلومات', en: 'Dashboard' },
        description: {
          ar: 'نظرة مرجعية على حالة التخطيط والمعمارية وتقدم المرحلة الخامسة.',
          en: 'Reference overview of planning status, layered architecture, and Phase 5 progress.',
        },
        icon: 'layout-dashboard',
        groupId: 'overview',
        classification: 'official',
        implementedInTask001: true,
      },
      {
        id: 'product-vision',
        href: '/product-vision',
        labelKey: 'nav.items.productVision',
        label: { ar: 'رؤية المنتج', en: 'Product Vision' },
        description: {
          ar: 'الهوية المعتمدة لمنتج Teranoo ERP واستراتيجية المنتج والاستضافة.',
          en: 'Verified product identity, commercial modular strategy, and deployment profile.',
        },
        icon: 'compass',
        groupId: 'overview',
        classification: 'official',
        implementedInTask001: true,
      },
      {
        id: 'roadmap',
        href: '/roadmap',
        labelKey: 'nav.items.roadmap',
        label: { ar: 'خارطة الطريق', en: 'Roadmap' },
        description: {
          ar: 'مراحل التخطيط والتوثيق والاعتماد المعماري لمشروع Teranoo ERP.',
          en: 'Planning, documentation, and architectural approval phases for Teranoo ERP.',
        },
        icon: 'map',
        groupId: 'overview',
        classification: 'official',
        implementedInTask001: false,
      },
    ],
  },
  {
    id: 'architecture',
    labelKey: 'nav.groups.architecture',
    label: { ar: 'المعمارية', en: 'Architecture' },
    items: [
      {
        id: 'architecture-overview',
        href: '/architecture',
        labelKey: 'nav.items.architectureOverview',
        label: { ar: 'المعمارية العامة', en: 'Architecture Overview' },
        description: {
          ar: 'الهيكل العام للمنتج وتوزيع الطبقات بين الأنظمة الأساسية والمنصة المشتركة.',
          en: 'High-level product architecture across core business modules and platform foundation.',
        },
        icon: 'layers',
        groupId: 'architecture',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'business-modules',
        href: '/modules',
        labelKey: 'nav.items.businessModules',
        label: { ar: 'الأنظمة الفرعية', en: 'Business Modules' },
        description: {
          ar: 'الأنظمة التجارية الأساسية الأربعة: المالية، المخزون، المشتريات، والمبيعات.',
          en: 'The four core business modules: Finance, Inventory, Procurement, and Sales.',
        },
        icon: 'boxes',
        groupId: 'architecture',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'dependencies',
        href: '/dependencies',
        labelKey: 'nav.items.dependencies',
        label: { ar: 'الاعتماديات والتكامل', en: 'Dependencies & Integration' },
        description: {
          ar: 'علاقات الاعتمادية البينية وعقود التكامل بين الأنظمة والمنصة.',
          en: 'Cross-module dependencies and integration contracts across the platform.',
        },
        icon: 'git-fork',
        groupId: 'architecture',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'platform-foundation',
        href: '/platform',
        labelKey: 'nav.items.platformFoundation',
        label: { ar: 'المنصة المشتركة', en: 'Platform Foundation' },
        description: {
          ar: 'قدرات المنصة المشتركة للمرحلة الخامسة: 12 إطار قدرة تشغيلية معتمدًا + بوابة الاعتماد التجميعي #13 (D-PLAT-01..D-PLAT-13).',
          en: 'Phase 5 shared platform capabilities: 12 approved runtime capability frameworks + item 13 adoption gate (D-PLAT-01..D-PLAT-13).',
        },
        icon: 'blocks',
        groupId: 'architecture',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'platform-tenancy',
        href: '/tenancy',
        labelKey: 'nav.items.platformTenancy',
        label: { ar: 'الهيكل المؤسسي والعملاء', en: 'Platform & Tenancy' },
        description: {
          ar: 'نموذج تعدد العملاء والعزل المؤسسي والكيانات التنظيمية.',
          en: 'Multi-tenancy model, enterprise isolation, and organizational structure.',
        },
        icon: 'building-2',
        groupId: 'architecture',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'deployment-database',
        href: '/deployment',
        labelKey: 'nav.items.deploymentDatabase',
        label: { ar: 'الاستضافة وقواعد البيانات', en: 'Deployment & Database' },
        description: {
          ar: 'استراتيجية SaaS-first، الملف المستقبلي Connected On-Premises، ومحرك PostgreSQL.',
          en: 'SaaS-first deployment strategy, future Connected On-Premises profile, and PostgreSQL.',
        },
        icon: 'database',
        groupId: 'architecture',
        classification: 'official',
        implementedInTask001: false,
      },
    ],
  },
  {
    id: 'knowledge-decisions',
    labelKey: 'nav.groups.knowledgeDecisions',
    label: { ar: 'المعرفة والقرارات', en: 'Knowledge & Decisions' },
    items: [
      {
        id: 'knowledge-library',
        href: '/knowledge',
        labelKey: 'nav.items.knowledgeLibrary',
        label: { ar: 'مكتبة المعرفة', en: 'Knowledge Library' },
        description: {
          ar: 'فهرس موحّد وقابل للتصفية لجميع الوثائق والسجلات المعرفية المصرح بنشرها.',
          en: 'Unified, filterable catalog of all authorized published knowledge records.',
        },
        icon: 'library',
        groupId: 'knowledge-decisions',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'decision-register',
        href: '/decisions',
        labelKey: 'nav.items.decisionRegister',
        label: { ar: 'سجل القرارات', en: 'Decision Register' },
        description: {
          ar: 'السجل الرسمي المفهرس للقرارات المعمارية المعتمدة (126 قرارًا D-*) بالإضافة إلى قرار بوابة السوق المشروط D-MKT-01.',
          en: 'Official indexed register of 126 approved architectural D-* decisions plus conditional Decision Gate A market decision D-MKT-01.',
        },
        icon: 'file-check-2',
        groupId: 'knowledge-decisions',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'research-center',
        href: '/research',
        labelKey: 'nav.items.researchCenter',
        label: { ar: 'مركز الأبحاث', en: 'Research Center' },
        description: {
          ar: 'حزم الأبحاث المعمارية والمقارنات المرجعية (13 حزمة بحثية في اللقطة المرجعية).',
          en: 'Architectural research packages and benchmark studies (13 in reference snapshot).',
        },
        icon: 'flask-conical',
        groupId: 'knowledge-decisions',
        classification: 'research',
        implementedInTask001: false,
      },
      {
        id: 'future-considerations',
        href: '/future-considerations',
        labelKey: 'nav.items.futureConsiderations',
        label: { ar: 'الاعتبارات المستقبلية', en: 'Future Considerations' },
        description: {
          ar: 'الموضوعات المعمارية المستقبلية غير المعتمدة كقرارات بعد (24 اعتبارًا في السجل الرسمي للاعتبارات المستقبلية).',
          en: 'Forward-looking architecture considerations not yet approved decisions (24 in the official future considerations register).',
        },
        icon: 'telescope',
        groupId: 'knowledge-decisions',
        classification: 'future',
        implementedInTask001: false,
      },
      {
        id: 'independent-reviews',
        href: '/independent-reviews',
        labelKey: 'nav.items.independentReviews',
        label: { ar: 'المراجعات المستقلة', en: 'Independent Reviews' },
        description: {
          ar: 'التحليلات والملاحظات الاستشارية المستقلة (57 ملاحظة مراجعة ضمن المراجعات السابقة).',
          en: 'Independent advisory analyses and review notes (57 notes from prior advisory reviews).',
        },
        icon: 'clipboard-check',
        groupId: 'knowledge-decisions',
        classification: 'independent',
        implementedInTask001: false,
      },
    ],
  },
  {
    id: 'exploration',
    labelKey: 'nav.groups.exploration',
    label: { ar: 'الاستكشاف', en: 'Exploration' },
    items: [
      {
        id: 'business-scenarios',
        href: '/business-scenarios',
        labelKey: 'nav.items.businessScenarios',
        label: { ar: 'سيناريوهات الأعمال', en: 'Business Scenarios' },
        description: {
          ar: 'مسارات عمل توضيحية ومحاكاة تفاعلية لسيناريوهات الأعمال عبر الأنظمة.',
          en: 'Illustrative workflows and interactive simulations of cross-module business scenarios.',
        },
        icon: 'workflow',
        groupId: 'exploration',
        classification: 'research',
        implementedInTask001: false,
      },
      {
        id: 'interactive-diagrams',
        href: '/diagrams',
        labelKey: 'nav.items.interactiveDiagrams',
        label: { ar: 'المخططات والمحاكاة', en: 'Interactive Diagrams' },
        description: {
          ar: 'مخططات معمارية تفاعلية تميّز بين المعمارية المعتمدة والنماذج التوضيحية.',
          en: 'Interactive architecture diagrams distinguishing approved architecture from illustrative models.',
        },
        icon: 'network',
        groupId: 'exploration',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'glossary',
        href: '/glossary',
        labelKey: 'nav.items.glossary',
        label: { ar: 'قاموس المصطلحات', en: 'Glossary' },
        description: {
          ar: 'التعريفات المعتمدة للمصطلحات المعمارية والوظيفية في مشروع Teranoo ERP.',
          en: 'Standardized definitions of architectural and domain terminology in Teranoo ERP.',
        },
        icon: 'book-open-text',
        groupId: 'exploration',
        classification: 'official',
        implementedInTask001: false,
      },
    ],
  },
  {
    id: 'project',
    labelKey: 'nav.groups.project',
    label: { ar: 'المشروع', en: 'Project' },
    items: [
      {
        id: 'engineering-journal',
        href: '/engineering-journal',
        labelKey: 'nav.items.engineeringJournal',
        label: { ar: 'السجل الهندسي', en: 'Engineering Journal' },
        description: {
          ar: 'سجل البناء العلني لتوثيق مهام تنفيذ منتج Teranoo ERP والمشاكل التقنية والحلول والدروس المستفادة.',
          en: 'Build-in-public engineering log documenting real Teranoo ERP implementation tasks, issues, solutions, and lessons learned.',
        },
        icon: 'terminal-square',
        groupId: 'project',
        classification: 'engineering',
        implementedInTask001: false,
      },
      {
        id: 'change-history',
        href: '/change-history',
        labelKey: 'nav.items.changeHistory',
        label: { ar: 'سجل التحديثات', en: 'Change History' },
        description: {
          ar: 'سجل تطور التوثيق والقرارات والتحديثات المعتمدة عبر مراحل المشروع.',
          en: 'Chronological record of documentation evolution and approved project updates.',
        },
        icon: 'history',
        groupId: 'project',
        classification: 'official',
        implementedInTask001: false,
      },
      {
        id: 'about',
        href: '/about',
        labelKey: 'nav.items.about',
        label: { ar: 'حول التطبيق', en: 'About' },
        description: {
          ar: 'رؤية المنصة المعرفية الشاملة، المفاهيم الستة، نموذج تصنيف المحتوى، وحوكمة النشر.',
          en: 'Comprehensive Knowledge Hub vision, six complementary concepts, classification model, and publishing governance.',
        },
        icon: 'info',
        groupId: 'project',
        classification: 'official',
        implementedInTask001: true,
      },
    ],
  },
] as const;

export const ALL_NAV_ITEMS: readonly NavItemConfig[] = NAVIGATION_GROUPS.flatMap(
  (group) => group.items
);

export function findNavItemByPath(pathname: string): NavItemConfig | undefined {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  return ALL_NAV_ITEMS.find((item) => item.href === normalized);
}

export function findNavGroupById(groupId: string): NavGroupConfig | undefined {
  return NAVIGATION_GROUPS.find((group) => group.id === groupId);
}
