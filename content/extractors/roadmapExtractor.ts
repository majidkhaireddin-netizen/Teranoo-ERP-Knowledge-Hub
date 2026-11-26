import type { LocalizedText } from '@/content/models/types';
import { createHeadingSlug, HEADING_ID_PREFIX } from '@/content/loaders/markdownPipeline';
import { getContentRegistry } from '@/content/registry/contentRegistry';
import { BATCH_001_SOURCE_REVISION } from '@/content/manifest/sourceManifest';

export type RoadmapPhaseStatus =
  | 'completed'
  | 'conditionally_approved'
  | 'awaiting_authorization'
  | 'pending'
  | 'deferred'
  | 'ongoing_track';

export interface RoadmapPhaseDetail {
  readonly id: string;
  readonly code: string;
  readonly kind: 'phase' | 'decision_gate';
  readonly originalTitle: string;
  readonly title: LocalizedText;
  readonly status: RoadmapPhaseStatus;
  readonly completedDate: string | null;
  readonly purpose: LocalizedText;
  readonly scope: LocalizedText;
  readonly workItems: readonly string[];
  readonly decisionRange: string | null;
  readonly decisionCount: number | null;
  readonly deliverables: readonly string[];
  readonly dependencies: LocalizedText;
  readonly completionCondition: LocalizedText;
  readonly approvalOutcome: LocalizedText;
  readonly deferredWork: LocalizedText;
  readonly sourceSectionAnchor: string;
  readonly sourceDocumentSlug: string;
}

export interface ContinuousActivityTrack {
  readonly id: string;
  readonly originalTitle: string;
  readonly title: LocalizedText;
  readonly status: 'ongoing_track';
  readonly purpose: LocalizedText;
  readonly guardrails: readonly string[];
  readonly sourceSectionAnchor: string;
  readonly isIndependentPlanningPhase: false;
}

export interface ExtractedRoadmap {
  readonly sourceDocumentId: string;
  readonly sourceDocumentSlug: string;
  readonly sourceRevision: string;
  readonly phases: readonly RoadmapPhaseDetail[];
  readonly continuousTrack: ContinuousActivityTrack;
  readonly completedPhasesCount: number;
  readonly totalOfficialPhasesCount: number;
  readonly nextAuthorizedPhaseId: string;
  readonly hasStalePhase5CurrentLine: boolean;
  readonly sourceDiscrepancyNote: LocalizedText;
}

function findHeadingAnchor(
  headingsMap: ReadonlyMap<string, string>,
  predicate: (heading: string) => boolean,
  fallbackText: string
): string {
  for (const [heading, anchor] of headingsMap.entries()) {
    if (predicate(heading)) {
      return anchor;
    }
  }
  return `${HEADING_ID_PREFIX}${createHeadingSlug(fallbackText)}`;
}

/**
 * Pure, deterministic extractor combining validated heading/status verification
 * from PROJECT_WORK_PLAN.md with reviewed structured phase metadata directly
 * anchored to the exact headings of the official source.
 */
export function parseRoadmapMarkdown(
  markdown: string,
  options?: {
    readonly sourceDocumentId?: string;
    readonly sourceDocumentSlug?: string;
    readonly sourceRevision?: string;
  }
): ExtractedRoadmap {
  const sourceDocumentId =
    options?.sourceDocumentId ?? 'kh-doc-project-work-plan-ar';
  const sourceDocumentSlug = options?.sourceDocumentSlug ?? 'project-work-plan';
  const sourceRevision =
    options?.sourceRevision ?? BATCH_001_SOURCE_REVISION.commitSha;

  const normalized = markdown.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');

  // Collect all H1 headings and compute their exact kh-h-* anchors
  const h1Anchors = new Map<string, string>();
  const usedIds = new Set<string>();
  for (const rawLine of lines) {
    const m = rawLine.trim().match(/^#\s+(.+)$/);
    if (m && m[1]) {
      const title = m[1].trim();
      const base = `${HEADING_ID_PREFIX}${createHeadingSlug(title)}`;
      let candidate = base;
      let suffix = 2;
      while (usedIds.has(candidate)) {
        candidate = `${base}-${suffix}`;
        suffix += 1;
      }
      usedIds.add(candidate);
      h1Anchors.set(title, candidate);
    }
  }

  // Verify mandatory official sections exist in source (fail loudly if missing)
  const requiredPatterns: readonly [string, RegExp][] = [
    ['Phase 1', /^Phase 1\b/i],
    ['Phase 2', /^Phase 2\b/i],
    ['Phase 3', /^Phase 3\b/i],
    ['Phase 4', /^Phase 4\b/i],
    ['Phase 5', /^Phase 5\b/i],
    ['Decision Gate A', /^Decision Gate A\b/i],
    ['Phase 6', /^Phase 6\s+—/i],
    ['Phase 6.5', /^Phase 6\.5\b/i],
    ['Phase 7', /^Phase 7\b/i],
    ['Phase 8', /^Phase 8\b/i],
    ['Phase 9', /^Phase 9\b/i],
    ['Phase 10', /^Phase 10\b/i],
    ['Phase 11', /^Phase 11\b/i],
    ['Phase 12', /^Phase 12\b/i],
  ];

  for (const [label, regex] of requiredPatterns) {
    const found = Array.from(h1Anchors.keys()).some((h) => regex.test(h));
    if (!found) {
      throw new Error(
        `Roadmap extraction failed: required official section "${label}" not found in PROJECT_WORK_PLAN.md.`
      );
    }
  }

  // Detect the documented stale "Phase 5 ... Current" line in Current Position
  const hasStalePhase5CurrentLine =
    /\*\*Phase 5\s+—\s+Shared Platform Capabilities\*\*\s+🔄\s*Current/i.test(
      normalized
    );

  // Confirm Phase 5 completion & Decision Gate A conditional approval in closing state
  const phase5ConfirmedCompleted = /Phase 5\s+✅\s+Completed/i.test(normalized);
  const gateAConfirmedConditional =
    /Decision Gate A\s+✅\s+Approved \(Conditional\)/i.test(normalized);

  if (!phase5ConfirmedCompleted) {
    throw new Error(
      'Roadmap extraction integrity error: closing status does not confirm Phase 5 completion.'
    );
  }
  if (!gateAConfirmedConditional) {
    throw new Error(
      'Roadmap extraction integrity error: closing status does not confirm Decision Gate A conditional approval.'
    );
  }

  const phases: RoadmapPhaseDetail[] = [
    {
      id: 'phase-1',
      code: 'PHASE-1',
      kind: 'phase',
      originalTitle: 'Phase 1 — Product Foundation & Vision',
      title: {
        ar: 'المرحلة 1 — تأسيس المنتج ورؤيته',
        en: 'Phase 1 — Product Foundation & Vision',
      },
      status: 'completed',
      completedDate: null,
      purpose: {
        ar: 'تحديد هوية منتج Teranoo ERP، المشكلة التي يعالجها، العملاء والقطاعات المستهدفة، التموضع التجاري، وحدود المنتج.',
        en: 'Define Teranoo ERP identity, business problems addressed, target customers and industries, commercial positioning, and product boundaries.',
      },
      scope: {
        ar: 'رؤية المنتج الرسمية، قواعد العمل ومنهجية التخطيط، خطة العمل الرئيسية، وضوابط المنتج العابرة للمراحل.',
        en: 'Official product vision, planning working rules, master project work plan, and cross-phase product guardrails.',
      },
      workItems: [
        'تحديد هوية المنتج والتموضع التجاري (00_PROJECT_VISION.md)',
        'توثيق قواعد العمل والتدرج المرحلي (WORKING_RULES.md)',
        'تأسيس خطة العمل الشاملة وسجل القرارات والاعتبارات المستقبلية',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        '00_PROJECT_VISION.md',
        'PROJECT_WORK_PLAN.md',
        'WORKING_RULES.md',
        'CROSS_PHASE_PRODUCT_GUARDRAILS.md',
      ],
      dependencies: {
        ar: 'نقطة الانطلاق التأسيسية للمشروع.',
        en: 'Foundational starting point for the entire project.',
      },
      completionCondition: {
        ar: 'إغلاق وثيقة رؤية المنتج واعتماد حدود المنتج وأسس التخطيط.',
        en: 'Formal closure of the Product Vision and adoption of product boundaries and planning rules.',
      },
      approvalOutcome: {
        ar: 'مكتملة ومغلقة رسميًا (Approved / Phase 1 Closed).',
        en: 'Officially closed (Approved / Phase 1 Closed).',
      },
      deferredWork: {
        ar: 'تحويل القرارات المفتوحة إلى المراحل 2 و3 و4 وبوابة القرار A.',
        en: 'Open strategic questions formally routed to Phases 2–4 and Decision Gate A.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 1\b/i.test(h),
        'Phase 1 — Product Foundation & Vision'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-2',
      code: 'PHASE-2',
      kind: 'phase',
      originalTitle: 'Phase 2 — Module Architecture & Dependency Rules',
      title: {
        ar: 'المرحلة 2 — معمارية الوحدات وقواعد الاعتمادية',
        en: 'Phase 2 — Module Architecture & Dependency Rules',
      },
      status: 'completed',
      completedDate: null,
      purpose: {
        ar: 'تأسيس خريطة الوحدات التجارية الأساسية الأربعة ونموذج الاعتماديات وقواعد دورة حياة الوحدات والتوسعة المستقبلية.',
        en: 'Establish the four Core Business Modules map, dependency semantics (PCD/HBMD/CIC/FLD), module lifecycle governance, and future extension rules.',
      },
      scope: {
        ar: 'Finance وInventory & Warehouse وProcurement وSales & Order Management، مع مصفوفة الاعتماديات وقواعد التوسعة.',
        en: 'Finance, Inventory & Warehouse, Procurement, and Sales & Order Management, plus dependency matrix and extension governance.',
      },
      workItems: [
        'تحديد الوحدات الأساسية الأربعة كحد تجاري معتمد (Core Modules)',
        'توثيق نموذج الاعتماديات (PCD / HBMD / CIC / FLD)',
        'إغلاق مصفوفة الاعتماديات وقواعد دورة حياة الوحدات وتوسعتها',
      ],
      decisionRange: 'Governing Artifacts (بدون معرفات D-* منفصلة)',
      decisionCount: null,
      deliverables: [
        '03-modules/DEPENDENCY_MODEL.md',
        '03-modules/MODULE_DEPENDENCY_MATRIX.md',
        '03-modules/MODULE_LIFECYCLE_RULES.md',
        '03-modules/FUTURE_MODULE_EXTENSION_RULES.md',
      ],
      dependencies: {
        ar: 'تعتمد على إغلاق المرحلة 1 (رؤية المنتج والحدود المعيارية).',
        en: 'Depends on Phase 1 closure (Product Vision and modular boundaries).',
      },
      completionCondition: {
        ar: 'اعتماد خريطة الوحدات ومصفوفة الاعتماديات وقواعد منع الاعتماديات الخفية.',
        en: 'Approval of module map, dependency matrix, and rules preventing hidden coupling.',
      },
      approvalOutcome: {
        ar: 'مكتملة ومغلقة رسميًا (Phase 2 Closed) — تم التحقق من التوافق الرجعي مع المرحلة 3 بدون تعارض مادي.',
        en: 'Officially closed (Phase 2 Closed) — backward compatibility later verified against Phase 3 with zero material conflicts.',
      },
      deferredWork: {
        ar: 'المخططات الوظيفية التفصيلية للوحدات الأساسية مؤجلة إلى المرحلة 6 والوحدات المؤسسية إلى المرحلة 7.',
        en: 'Detailed Core functional blueprints deferred to Phase 6; Strategic Enterprise Modules deferred to Phase 7.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 2\b/i.test(h),
        'Phase 2 — Module Architecture & Dependency Rules'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-3',
      code: 'PHASE-3',
      kind: 'phase',
      originalTitle: 'Phase 3 — Platform & Tenancy Model',
      title: {
        ar: 'المرحلة 3 — نموذج المنصة وتعدد العملاء',
        en: 'Phase 3 — Platform & Tenancy Model',
      },
      status: 'completed',
      completedDate: '2026-10-02',
      purpose: {
        ar: 'حسم النموذج التنظيمي وتعدد العملاء وعزل البيانات ولوحة التحكم ودورة حياة المستأجر قبل استراتيجية الاستضافة وقدرات المنصة.',
        en: 'Establish tenancy, multi-company, multi-branch, organizational boundaries, master data sharing, authorization boundaries, data isolation, control plane, and tenant lifecycle.',
      },
      scope: {
        ar: '9 ملفات معمارية تأسيسية + مراجعة الإغلاق النهائي وفحص التوافق الرجعي مع المرحلة 2.',
        en: '9 foundational platform/tenancy topics plus Final Approval and Backward Compatibility Check against Phase 2.',
      },
      workItems: [
        'Tenant Model (D-TEN-01..D-TEN-07)',
        'Multi-Company Model (D-COMP-01..D-COMP-11)',
        'Multi-Branch Model (D-BR-01..D-BR-12)',
        'Organizational Hierarchy Boundaries (D-ORG-01..D-ORG-15)',
        'Shared vs Company-Specific Master Data (D-MD-01..D-MD-15)',
        'User / Role / Permission Boundaries (D-AUTH-01..D-AUTH-16)',
        'Multi-Tenant Data Isolation Models (D-ISO-01..D-ISO-12)',
        'Control Plane Responsibilities (D-CP-01..D-CP-07)',
        'Tenant Lifecycle (D-LC-01..D-LC-08)',
      ],
      decisionRange: 'D-TEN-01..D-LC-08',
      decisionCount: 103,
      deliverables: [
        'TENANT_MODEL.md',
        'MULTI_COMPANY_MODEL.md',
        'MULTI_BRANCH_MODEL.md',
        'ORGANIZATIONAL_HIERARCHY_BOUNDARIES.md',
        'MASTER_DATA_SHARING_MODEL.md',
        'USER_ROLE_PERMISSION_BOUNDARIES.md',
        'MULTI_TENANT_DATA_ISOLATION_MODELS.md',
        'CONTROL_PLANE_RESPONSIBILITIES.md',
        'TENANT_LIFECYCLE_MODEL.md',
        'PHASE_3_CLOSURE_REVIEW.md',
      ],
      dependencies: {
        ar: 'تعتمد على المرحلة 1 والمرحلة 2 وضوابط المنتج العابرة للمراحل.',
        en: 'Depends on Phases 1–2 and Cross-Phase Product Guardrails.',
      },
      completionCondition: {
        ar: 'اجتياز Final Phase 3 Approval + Backward Compatibility Check مقابل المرحلة 2 بصفر تعارضات مادية.',
        en: 'PASS on Final Phase 3 Approval and Backward Compatibility Check against Phase 2 with zero material conflicts.',
      },
      approvalOutcome: {
        ar: 'مغلقة رسميًا (2026-10-02) — 103 قرارات معمارية معتمدة؛ Final Approval PASS + Backward Compatibility PASS / SAFE.',
        en: 'Closed (2026-10-02) — 103 approved architectural decisions; Final Approval PASS + Backward Compatibility PASS / SAFE.',
      },
      deferredWork: {
        ar: 'التفاصيل التقنية والتنفيذية العميقة مؤجلة إلى المراحل 4 و5 و10، وملف FAC-019 لـ Master Data Stewardship.',
        en: 'Deep technical implementation details deferred to Phases 4, 5, and 10, plus FAC-019 for Master Data Stewardship.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 3\b/i.test(h),
        'Phase 3 — Platform & Tenancy Model'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-4',
      code: 'PHASE-4',
      kind: 'phase',
      originalTitle: 'Phase 4 — Deployment & Database Strategy',
      title: {
        ar: 'المرحلة 4 — استراتيجية النشر وقواعد البيانات',
        en: 'Phase 4 — Deployment & Database Strategy',
      },
      status: 'completed',
      completedDate: '2026-10-02',
      purpose: {
        ar: 'حسم استراتيجية الاستضافة السحابية SaaS-first، ومتطلبات Connected On-Premises، وحدود التوحيد، وسياسة محرك قاعدة البيانات الواحد (PostgreSQL)، والنسخ الاحتياطي، والتوسع، والترقيات.',
        en: 'Establish SaaS-first cloud deployment, Connected On-Premises profile, unification boundaries, PostgreSQL single-engine policy, backup/DR, scalability principles, and upgrade delivery.',
      },
      scope: {
        ar: '9 بنود تخطيطية مكتملة تغطي D-DEP-01 حتى D-DEP-10، مع الالتزام بضابط عدم تصميم Provider/Kubernetes/Topology تفصيلي قبل الحاجة.',
        en: '9 completed planning items covering D-DEP-01 through D-DEP-10, bounded by the guardrail against premature cloud provider/Kubernetes topology design.',
      },
      workItems: [
        'البند 1 — Cloud/SaaS deployment requirements (D-DEP-01..02)',
        'البند 2 — On-Premises deployment requirements (D-DEP-03 · Connected On-Prem Data Plane)',
        'البند 3 — Deployment Profile Unification Boundaries (D-DEP-04)',
        'البند 4 — Database engine evaluation (D-DEP-05 · PostgreSQL Confirmation Passed)',
        'البند 5 — Single-Engine Policy (D-DEP-06 · PostgreSQL وحيد مدعوم إنتاجياً)',
        'البند 6 — Backup/Restore/DR Principles (D-DEP-07)',
        'البند 7 — Scalability & Performance Expectations (D-DEP-08)',
        'البند 8 — Upgrade Delivery & Migration Architecture (D-DEP-09)',
        'البند 9 — Deployment & Database Strategy Adopted (D-DEP-10 — اعتماد تجميعي)',
      ],
      decisionRange: 'D-DEP-01..D-DEP-10',
      decisionCount: 10,
      deliverables: [
        'CLOUD_SAAS_DEPLOYMENT_REQUIREMENTS.md',
        'ON_PREMISES_DEPLOYMENT_REQUIREMENTS.md',
        'DEPLOYMENT_PROFILE_UNIFICATION_BOUNDARIES.md',
        'DATABASE_ENGINE_EVALUATION.md',
        'SINGLE_ENGINE_POLICY.md',
        'BACKUP_RESTORE_DR_PRINCIPLES.md',
        'SCALABILITY_PERFORMANCE_EXPECTATIONS.md',
        'UPGRADE_DELIVERY_MIGRATION_ARCHITECTURE.md',
        'DEPLOYMENT_DATABASE_STRATEGY_ADOPTION.md',
      ],
      dependencies: {
        ar: 'تعتمد على إغلاق المرحلة 3 (عزل البيانات ولوحة التحكم ودورة حياة المستأجر).',
        en: 'Depends on Phase 3 closure (data isolation, control plane, and tenant lifecycle).',
      },
      completionCondition: {
        ar: 'الاعتماد التجميعي في البند 9 (D-DEP-10) بصفر تعارضات مادية مع المراحل 1–3.',
        en: 'Consolidation adoption in item 9 (D-DEP-10) with zero material conflicts against Phases 1–3.',
      },
      approvalOutcome: {
        ar: 'مغلقة رسميًا (2026-10-02) — جميع البنود 1–9 مكتملة (10 قرارات D-DEP-01..10).',
        en: 'Closed (2026-10-02) — all 9 items approved (10 decisions D-DEP-01..10).',
      },
      deferredWork: {
        ar: 'الأرقام القياسية للأداء والتوافر SLA مؤجلة للمرحلة 10، والالتزام التجاري بإطلاق On-Premises في V1 مؤجل إلى Phase 11 (OBS-1).',
        en: 'Concrete performance/availability SLAs deferred to Phase 10; commercial V1 On-Premises launch commitment deferred to Phase 11 (OBS-1).',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 4\b/i.test(h),
        'Phase 4 — Deployment & Database Strategy'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-5',
      code: 'PHASE-5',
      kind: 'phase',
      originalTitle: 'Phase 5 — Shared Platform Capabilities',
      title: {
        ar: 'المرحلة 5 — قدرات المنصة المشتركة',
        en: 'Phase 5 — Shared Platform Capabilities',
      },
      status: 'completed',
      completedDate: '2026-10-02',
      purpose: {
        ar: 'تحديد واعتماد أطر القدرات المشتركة الـ 12 التي تعتمد عليها جميع الوحدات التجارية، ثم اعتمادها تجميعيًا كخط أساس رسمي للمرحلة 6 وما بعدها.',
        en: 'Define and approve the 12 shared runtime platform capability frameworks relied upon by all business modules, followed by item 13 consolidated adoption gate.',
      },
      scope: {
        ar: '13 بندًا تخطيطيًا معتمدًا بالكامل: 12 إطار قدرة تشغيلية (D-PLAT-01..D-PLAT-12) + البند 13 بوابة الاعتماد التجميعي (D-PLAT-13 — ليس قدرة تشغيلية رقم 13).',
        en: '13 approved planning items: 12 runtime capability frameworks (D-PLAT-01..D-PLAT-12) plus item 13 Platform Foundation Detailed Adoption gate (D-PLAT-13 — a planning gate, not a 13th runtime capability).',
      },
      workItems: [
        'البند 1 — Identity & Access Framework (D-PLAT-01 · R-IDN-1..16)',
        'البند 2 — Workflow & Approvals Framework (D-PLAT-02 · R-WFL-1..14)',
        'البند 3 — Audit Trail Framework (D-PLAT-03 · R-AUD-1..14)',
        'البند 4 — Shared Master Data Framework (D-PLAT-04 · R-MDM-1..17)',
        'البند 5 — Localization Framework (D-PLAT-05 · R-L10N-1..15)',
        'البند 6 — Tax / Currency / Calendar Foundations (D-PLAT-06 · R-FND-1..14)',
        'البند 7 — Document & Attachment Framework (D-PLAT-07 · R-DOC-1..16)',
        'البند 8 — Notification Framework (D-PLAT-08 · R-NOT-1..14)',
        'البند 9 — Integration / API Framework (D-PLAT-09 · R-INT-1..16)',
        'البند 10 — Reporting & Analytics Framework (D-PLAT-10 · R-RPT-1..16)',
        'البند 11 — Configuration & Feature Management (D-PLAT-11 · R-CFG-1..16)',
        'البند 12 — Extension Framework / Compatibility Contracts (D-PLAT-12 · R-EXT-1..16)',
        'البند 13 — Platform Foundation Detailed Adoption (D-PLAT-13 — بوابة اعتماد تجميعي)',
      ],
      decisionRange: 'D-PLAT-01..D-PLAT-13',
      decisionCount: 13,
      deliverables: [
        'IDENTITY_ACCESS_FRAMEWORK.md .. EXTENSION_FRAMEWORK.md (12 إطارًا)',
        'PLATFORM_FOUNDATION_ADOPTION.md (البند 13 — اعتماد تجميعي)',
      ],
      dependencies: {
        ar: 'تعتمد على إغلاق المراحل 2 و3 و4 وضوابط المنتج العابرة للمراحل.',
        en: 'Depends on closure of Phases 2, 3, and 4 and Cross-Phase Product Guardrails.',
      },
      completionCondition: {
        ar: 'فحص الاتساق التجميعي للبنود 1–12 والتحقق من الثوابت السبع العابرة بصفر تناقض عبر D-PLAT-13.',
        en: 'Cross-consistency check across items 1–12 verifying 7 cross-cutting invariants with zero contradictions via D-PLAT-13.',
      },
      approvalOutcome: {
        ar: 'مكتملة بالكامل (2026-10-02) — 13/13 بندًا معتمدًا (12 قدرة تشغيلية + بوابة اعتماد #13)؛ صفر تناقض.',
        en: 'Completed (2026-10-02) — 13/13 items approved (12 runtime frameworks + item 13 adoption gate); zero contradictions.',
      },
      deferredWork: {
        ar: 'سجل مؤجلات موحّد بـ 5 مالكين (Phase 6، Phase 10، بحوث FAC-019..024، منتج/إطلاق، وتقنية البناء) + ملاحظات OBS-5-1/5-2/5-3 بدون عوائق.',
        en: 'Unified deferral register across 5 owners (Phase 6, Phase 10, FAC research, product/launch, technical build-out) plus non-blocking OBS-5-1/5-2/5-3.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 5\b/i.test(h),
        'Phase 5 — Shared Platform Capabilities'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'decision-gate-a',
      code: 'GATE-A',
      kind: 'decision_gate',
      originalTitle: 'Decision Gate A — Primary Launch Market / First Industry Priority',
      title: {
        ar: 'بوابة القرار A — السوق الأول للانطلاق وأولوية القطاع الأول',
        en: 'Decision Gate A — Primary Launch Market / First Industry Priority',
      },
      status: 'conditionally_approved',
      completedDate: '2026-10-02',
      purpose: {
        ar: 'حسم السوق الأول للانطلاق والقطاع الصناعي الأول كأولوية وحيدة للنسخة الأولى (V1) ومنع تشتيت النطاق عبر إطلاق متزامن للقطاعات الأربعة.',
        en: 'Select the primary launch market and single first industry priority for V1, explicitly prohibiting simultaneous V1 launch across all four target industries.',
      },
      scope: {
        ar: 'قرار سوقي مستقل (D-MKT-01) — مسجّل خارج عدّاد القرارات المعمارية الـ 126.',
        en: 'Independent market decision (D-MKT-01) — explicitly outside the 126 architectural D-* decision counter.',
      },
      workItems: [
        'تحديد الأردن كسوق الانطلاق الأول',
        'اعتماد التجارة والتوزيع بالجملة (Trading & Wholesale Distribution) كأولوية إطلاق وحيدة',
        'اعتماد ملف العميل المثالي (ICP) وإقرار V1 غير متزامن (Manufacturing ثانيًا بعد Phase 8، وConstruction/PS مؤجلان)',
        'اشتراط O-2 (تحقق ميداني من الاستعداد للدفع عبر 5–10 مقابلات) قبل التسعير وقبل Product Baseline',
      ],
      decisionRange: 'D-MKT-01 (قرار سوقي مستقل خارج عدّاد 126)',
      decisionCount: null,
      deliverables: [
        '02-erp-scope/DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md (بانتظار دفعة استيراد مستقبلية)',
      ],
      dependencies: {
        ar: 'تعتمد على اكتمال المرحلة 5 ومسار جمع الأدلة السوقية المستمر.',
        en: 'Follows Phase 5 completion and inputs from Continuous Market Evidence Collection.',
      },
      completionCondition: {
        ar: 'شرط النفاذ الحاكم O-2: إتمام التحقق الميداني للاستعداد للدفع (5–10 مقابلات) قبل التسعير وقبل Product Baseline.',
        en: 'Binding condition O-2: field willingness-to-pay verification (5–10 interviews) mandatory prior to pricing and Product Baseline.',
      },
      approvalOutcome: {
        ar: 'معتمدة مشروطًا (Approved Conditional — 2026-10-02) · D-MKT-01.',
        en: 'Approved (Conditional) on 2026-10-02 · D-MKT-01.',
      },
      deferredWork: {
        ar: 'التفاصيل الكاملة للـ ICP ومبررات القرار السوقي محفوظة في وثيقة بوابة القرار A غير المشمولة في BATCH-001.',
        en: 'Full ICP details and complete market rationale reside in DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md (awaiting future authorized batch).',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Decision Gate A\b/i.test(h),
        'Decision Gate A — Primary Launch Market / First Industry Priority'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-6',
      code: 'PHASE-6',
      kind: 'phase',
      originalTitle: 'Phase 6 — Core Module Functional Blueprints',
      title: {
        ar: 'المرحلة 6 — المخططات الوظيفية للوحدات الأساسية',
        en: 'Phase 6 — Core Module Functional Blueprints',
      },
      status: 'awaiting_authorization',
      completedDate: null,
      purpose: {
        ar: 'إعداد المخططات الوظيفية العميقة للوحدات التجارية الأساسية الأربعة بالتسلسل: المالية ثم المخزون والمستودعات ثم المشتريات ثم المبيعات وإدارة الطلبات.',
        en: 'Produce deep functional blueprints sequentially for the four Core Business Modules: Finance, Inventory & Warehouse, Procurement, and Sales & Order Management.',
      },
      scope: {
        ar: 'لكل وحدة: النطاق والقدرات والبيانات الرئيسية والمعاملات وسير العمل والقواعد والموافقات والأثر المحاسبي والاعتماديات والتقارير والتهيئة والتدقيق والأمان والفروقات القطاعية.',
        en: 'Per module: scope, capabilities, masters, transactions, workflows, rules, approvals, accounting impact, dependencies, reporting, configuration, audit, security, and industry variations.',
      },
      workItems: [
        '1. ⏳ Finance',
        '2. ⏳ Inventory & Warehouse Management',
        '3. ⏳ Procurement',
        '4. ⏳ Sales & Order Management',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        'مخطط وظيفي مغلق ومعتمد لكل وحدة من الوحدات الأساسية الأربعة بالتتابع',
      ],
      dependencies: {
        ar: 'تعتمد على اعتماد Platform Foundation (D-PLAT-13) وبوابة القرار A؛ لا تبدأ إلا بتكليف منفصل وصريح من مالك المشروع.',
        en: 'Depends on Platform Foundation Adoption (D-PLAT-13) and Decision Gate A; has NOT started and requires explicit owner authorization.',
      },
      completionCondition: {
        ar: 'قاعدة إلزامية: لا انتقال إلى وحدة تالية قبل إغلاق المخطط الوظيفي للوحدة الحالية.',
        en: 'Mandatory rule: do not proceed to the next module before closing the current module blueprint.',
      },
      approvalOutcome: {
        ar: 'الخطوة التالية المحددة — لم تبدأ بعد وبانتظار تكليف منفصل.',
        en: 'Identified as the next planning stage — not started; awaiting explicit separate authorization.',
      },
      deferredWork: {
        ar: 'التحقق الشامل من عقود التكامل البيني بين الوحدات الأربعة ينفّذ في البوابة الإلزامية Phase 6.5.',
        en: 'Cross-module integration contract validation is executed in mandatory exit gate Phase 6.5.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 6\s+—/i.test(h),
        'Phase 6 — Core Module Functional Blueprints'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-6.5',
      code: 'PHASE-6.5',
      kind: 'phase',
      originalTitle: 'Phase 6.5 — Core Cross-Module Contract Validation',
      title: {
        ar: 'المرحلة 6.5 — التحقق من عقود التكامل البيني الأساسية',
        en: 'Phase 6.5 — Core Cross-Module Contract Validation',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'بوابة خروج إلزامية (Mandatory Exit Gate) بعد إغلاق المخططات الأربعة للمرحلة 6 وقبل الانتقال إلى المرحلة 7 للتحقق من سلامة العقود البينية للعمليات الأساسية.',
        en: 'Mandatory Exit Gate following the four Core Blueprints and prior to Phase 7, validating end-to-end cross-module contracts and all six Core CICs.',
      },
      scope: {
        ar: 'مراجعة Procure-to-Pay وOrder-to-Cash وInventory-to-Finance وRecord-to-Report touchpoints وجميع Core CICs الستة، وتثبيت المالك ومصدر الحقيقة والأثر المالي والمخزني ودلالات الإلغاء والعكس.',
        en: 'Review Procure-to-Pay, Order-to-Cash, Inventory-to-Finance, Record-to-Report touchpoints, and all six Core CICs — proving trigger, state owner, Source of Truth, financial/inventory effects, cancel/reverse semantics, and traceability.',
      },
      workItems: [
        'التحقق من سيناريو Procure-to-Pay',
        'التحقق من سيناريو Order-to-Cash',
        'التحقق من نقاط تماس Inventory-to-Finance وRecord-to-Report',
        'التحقق من جميع Core CICs الستة ونفي Hidden HBMD وOwnership ambiguity وفجوات Traceability',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        'تقرير التحقق واعتماد عقود التكامل البيني للوحدات الأساسية (Exit Gate Review)',
      ],
      dependencies: {
        ar: 'تعتمد على إغلاق جميع المخططات الوظيفية الأربعة في المرحلة 6.',
        en: 'Depends on closure of all four Core Module Functional Blueprints in Phase 6.',
      },
      completionCondition: {
        ar: 'لا انتقال إلى المرحلة 7 قبل نفي Hidden HBMD وOwnership ambiguity وفجوات التتبع ومراجعة جميع Core CICs الستة.',
        en: 'No transition to Phase 7 until Hidden HBMD, ownership ambiguity, and traceability gaps are eliminated and all six Core CICs are reviewed.',
      },
      approvalOutcome: {
        ar: 'مؤجلة / بانتظار إكمال المرحلة 6.',
        en: 'Pending completion of Phase 6.',
      },
      deferredWork: {
        ar: 'توسيع العمليات البينية ليشمل الوحدات المؤسسية والامتدادات القطاعية يتم لاحقًا في المرحلة 9.',
        en: 'Extended cross-module business processes involving Enterprise Modules and Industry Extensions occur later in Phase 9.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 6\.5\b/i.test(h),
        'Phase 6.5 — Core Cross-Module Contract Validation'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-7',
      code: 'PHASE-7',
      kind: 'phase',
      originalTitle: 'Phase 7 — Strategic Enterprise Modules',
      title: {
        ar: 'المرحلة 7 — الوحدات المؤسسية الاستراتيجية',
        en: 'Phase 7 — Strategic Enterprise Modules',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'تخطيط الوحدات المؤسسية الاستراتيجية المرشحة بعد استقرار النواة الأساسية.',
        en: 'Plan candidate Strategic Enterprise Modules once the Core Business Modules and cross-module contracts are stabilized.',
      },
      scope: {
        ar: 'مرشحون حاليًا (الترتيب غير معتمد بعد): Projects & Project Accounting، Human Capital Management، Payroll، CRM، Enterprise Asset Management / Maintenance، Advanced Budgeting & Performance Management.',
        en: 'Current candidates (ordering not yet approved): Projects & Project Accounting, Human Capital Management, Payroll, CRM, Enterprise Asset Management / Maintenance, and Advanced Budgeting & Performance Management.',
      },
      workItems: [
        'Projects & Project Accounting',
        'Human Capital Management',
        'Payroll',
        'CRM',
        'Enterprise Asset Management / Maintenance',
        'Advanced Budgeting & Performance Management',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        'مخططات الوحدات المؤسسية وفق الأولوية التجارية ونتائج Phase 6.5',
      ],
      dependencies: {
        ar: 'تعتمد على اجتياز بوابة Phase 6.5 والأولوية التجارية وFirst Industry Priority.',
        en: 'Depends on passing Phase 6.5 Exit Gate, commercial priority, and First Industry Priority.',
      },
      completionCondition: {
        ar: 'تحديد واعتماد ترتيب الوحدات المؤسسية وإغلاق مخططاتها الوظيفية دون تعديل ضمني لملكية النواة.',
        en: 'Approve ordering and close module blueprints without implicitly redefining Core ownership.',
      },
      approvalOutcome: {
        ar: 'معلقة — الترتيب غير معتمد بعد.',
        en: 'Pending — module ordering not yet approved.',
      },
      deferredWork: {
        ar: 'يخضع الترتيب الفعلي لنتائج Phase 6.5 والأولويات التجارية.',
        en: 'Actual prioritization deferred until Phase 6.5 outcomes and commercial evidence.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 7\b/i.test(h),
        'Phase 7 — Strategic Enterprise Modules'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-8',
      code: 'PHASE-8',
      kind: 'phase',
      originalTitle: 'Phase 8 — Industry Extensions',
      title: {
        ar: 'المرحلة 8 — الامتدادات القطاعية',
        en: 'Phase 8 — Industry Extensions',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'تحليل الفجوات القطاعية وبناء امتدادات قطاعية معزولة فوق النواة بدءًا من الأولوية الأولى المعتمدة (التجارة والتوزيع بالجملة).',
        en: 'Analyze industry gaps and define isolated industry extensions starting from the approved First Industry Priority (Trading & Wholesale Distribution).',
      },
      scope: {
        ar: 'القطاعات الأربعة الأساسية: 1) Trading & Wholesale Distribution، 2) Manufacturing، 3) Construction & Contracting، 4) Professional & Project-Based Services — مع إضافة امتدادات للفجوات القطاعية المثبتة فقط.',
        en: 'Four primary industries: 1) Trading & Wholesale Distribution, 2) Manufacturing, 3) Construction & Contracting, 4) Professional & Project-Based Services — adding extensions strictly for verified industry gaps.',
      },
      workItems: [
        '1. Trading & Wholesale Distribution (أولوية الإطلاق الأولى المعتمدة)',
        '2. Manufacturing (القطاع الثاني بعد Phase 8)',
        '3. Construction & Contracting (مؤجل)',
        '4. Professional & Project-Based Services (مؤجل)',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        'تحليل ما يغطيه Core مقابل الفجوات القطاعية المثبتة ومواصفات الامتدادات القطاعية',
      ],
      dependencies: {
        ar: 'تعتمد على Decision Gate A (D-MKT-01) والمراحل 6 و6.5 و7 وضابط خط المنتج الموحد.',
        en: 'Depends on Decision Gate A (D-MKT-01), Phases 6–7, and Single Product Line guardrails.',
      },
      completionCondition: {
        ar: 'فصل صريح بين تغطية النواة والفجوات القطاعية دون تشعيب النواة الأساسية.',
        en: 'Explicit separation between Core coverage and verified industry gaps without forking the core.',
      },
      approvalOutcome: {
        ar: 'معلقة بانتظار المراحل السابقة.',
        en: 'Pending prior phases.',
      },
      deferredWork: {
        ar: 'بموجب D-MKT-01: التصنيع مؤجل كقطاع ثانٍ، والمقاولات والخدمات المهنية مؤجلة لما بعد الإطلاق الأول.',
        en: 'Per D-MKT-01: Manufacturing is second priority; Construction and Professional Services are deferred beyond initial launch.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 8\b/i.test(h),
        'Phase 8 — Industry Extensions'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-9',
      code: 'PHASE-9',
      kind: 'phase',
      originalTitle: 'Phase 9 — Extended Cross-Module Business Processes',
      title: {
        ar: 'المرحلة 9 — العمليات التجارية الممتدة عبر الوحدات',
        en: 'Phase 9 — Extended Cross-Module Business Processes',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'توسيع العمليات العابرة للوحدات بعد استقرار Core Contracts في Phase 6.5 وإضافة الوحدات المؤسسية والامتدادات القطاعية.',
        en: 'Expand end-to-end business processes after Core Contracts stabilize in Phase 6.5 and Enterprise Modules / Industry Extensions are added.',
      },
      scope: {
        ar: 'أمثلة: Project-to-Cash، Hire-to-Retire، العمليات الخاصة بالتصنيع والمقاولات والخدمات، وتوسعات P2P/O2C — دون إعادة تعريف Core Ownership ضمنيًا بدون Reopen رسمي.',
        en: 'Examples: Project-to-Cash, Hire-to-Retire, industry-specific processes, and P2P/O2C extensions — prohibited from implicitly redefining Core Ownership without a formal Reopen.',
      },
      workItems: [
        'Project-to-Cash وHire-to-Retire',
        'العمليات القطاعية الممتدة وتوسعات P2P/O2C',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        'عقود ومسارات العمليات المؤسسية الممتدة',
      ],
      dependencies: {
        ar: 'تعتمد على استقرار Core Contracts في Phase 6.5 ومخرجات المرحلتين 7 و8.',
        en: 'Depends on stabilized Core Contracts from Phase 6.5 and outputs of Phases 7 and 8.',
      },
      completionCondition: {
        ar: 'توثيق العمليات الممتدة مع الحفاظ التام على حدود ملكية النواة المعتمدة.',
        en: 'Document extended processes while preserving approved Core Ownership boundaries.',
      },
      approvalOutcome: {
        ar: 'معلقة بانتظار المراحل السابقة.',
        en: 'Pending prior phases.',
      },
      deferredWork: {
        ar: 'غير مفعّلة حاليًا.',
        en: 'Not yet initiated.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 9\b/i.test(h),
        'Phase 9 — Extended Cross-Module Business Processes'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-10',
      code: 'PHASE-10',
      kind: 'phase',
      originalTitle: 'Phase 10 — Enterprise-Wide Requirements',
      title: {
        ar: 'المرحلة 10 — المتطلبات على مستوى المؤسسة',
        en: 'Phase 10 — Enterprise-Wide Requirements',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'تحديد والتحقق من المتطلبات غير الوظيفية والشاملة على مستوى المنتج والمؤسسة.',
        en: 'Specify and validate product-wide non-functional, operational, compliance, and lifecycle enterprise requirements.',
      },
      scope: {
        ar: 'Security، Audit & Compliance، Performance، Availability، Scalability، Data Retention، Import/Export، Integration، Observability، Administration، Localization، Accessibility، Reporting & Analytics، Upgradeability، Extensibility، Compatibility، Migration Safety، Failed-Upgrade Recovery، وRelease & Support Lifecycle.',
        en: 'Security, Audit & Compliance, Performance, Availability, Scalability, Data Retention, Import/Export, Integration, Observability, Administration, Localization, Accessibility, Reporting & Analytics, Upgradeability, Extensibility, Compatibility, Migration Safety, Failed-Upgrade Recovery, and Release & Support Lifecycle.',
      },
      workItems: [
        'حسم الأرقام القياسية للأداء والتوافر وقابلية التوسع والاحتفاظ بالبيانات',
        'التحقق من متطلبات الأمان والتدقيق والترقية والتعافي من فشل الترقية',
        'مراجعة بنود FAC المؤجلة المالكة للمرحلة 10 قبل الإغلاق',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: [
        'حزمة المتطلبات المؤسسية الشاملة (Enterprise-Wide Requirements)',
      ],
      dependencies: {
        ar: 'تعتمد على اكتمال التخطيط الوظيفي والمنصي والمخرجات المؤجلة من المراحل 4–9 وملفات FAC.',
        en: 'Depends on platform and functional planning outputs plus deferred validations from Phases 4–9 and FAC items.',
      },
      completionCondition: {
        ar: 'مراجعة وإغلاق جميع المتطلبات المؤسسية وبنود FAC المرتبطة بها.',
        en: 'Complete review and closure of all enterprise-wide requirements and linked FAC validations.',
      },
      approvalOutcome: {
        ar: 'معلقة بانتظار المراحل السابقة.',
        en: 'Pending prior phases.',
      },
      deferredWork: {
        ar: 'تستقبل العديد من القيود المؤجلة من المراحل 4 و5 (مثل SLA وBI/Warehouse والتحقق من FAC-019..024).',
        en: 'Owns deferred validations from Phases 4 and 5 (SLAs, BI/Warehouse architecture, FAC-019..024 validation).',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 10\b/i.test(h),
        'Phase 10 — Enterprise-Wide Requirements'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-11',
      code: 'PHASE-11',
      kind: 'phase',
      originalTitle: 'Phase 11 — Scope Consolidation & Product Baseline',
      title: {
        ar: 'المرحلة 11 — توحيد النطاق وخط الأساس للمنتج',
        en: 'Phase 11 — Scope Consolidation & Product Baseline',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'تجميع القرارات المعتمدة، إزالة أي تكرار أو تعارض، حسم In Scope / Out of Scope والقدرات المؤجلة، واعتماد Product Baseline الرسمي.',
        en: 'Consolidate all approved decisions, eliminate overlap/conflicts, finalize In Scope / Out of Scope / Deferred capabilities, and adopt the official Product Baseline.',
      },
      scope: {
        ar: '7 بنود تجميعية إلزامية تنتهي باعتماد Product Baseline بعد استيفاء شرط O-2 من بوابة القرار A.',
        en: '7 consolidation items culminating in official Product Baseline adoption (subject to fulfilling Decision Gate A condition O-2).',
      },
      workItems: [
        '1. ⏳ تجميع القرارات المعتمدة',
        '2. ⏳ إزالة التكرار والتعارض',
        '3. ⏳ تحديد In Scope / Out of Scope',
        '4. ⏳ تحديد Deferred capabilities',
        '5. ⏳ تحديد Dependencies والمخاطر المفتوحة',
        '6. ⏳ مراجعة قابلية التنفيذ',
        '7. ⏳ اعتماد Product Baseline',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: ['Approved Product Baseline'],
      dependencies: {
        ar: 'تتطلب اكتمال المراحل 1–10 واستيفاء الشرط الميداني O-2 (5–10 مقابلات استعداد للدفع) قبل اعتماد Product Baseline.',
        en: 'Requires completion of Phases 1–10 and fulfillment of Decision Gate A condition O-2 before Product Baseline adoption.',
      },
      completionCondition: {
        ar: 'اعتماد Product Baseline خالٍ من التعارضات مع توثيق النطاق والمؤجلات والمخاطر.',
        en: 'Conflict-free Product Baseline approved with explicit scope, deferrals, and open risks.',
      },
      approvalOutcome: {
        ar: 'معلقة بانتظار المراحل السابقة وشرط O-2.',
        en: 'Pending prior phases and condition O-2.',
      },
      deferredWork: {
        ar: 'حسم الالتزام التجاري بـ On-Premises في V1 (OBS-1) ومراجعة FAC قبل خط الأساس.',
        en: 'Commercial V1 On-Premises commitment (OBS-1) and final FAC review before baseline.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 11\b/i.test(h),
        'Phase 11 — Scope Consolidation & Product Baseline'
      ),
      sourceDocumentSlug,
    },
    {
      id: 'phase-12',
      code: 'PHASE-12',
      kind: 'phase',
      originalTitle: 'Phase 12 — Teranoo Handoff Preparation',
      title: {
        ar: 'المرحلة 12 — التحضير للتسليم إلى دورة Teranoo الرسمية',
        en: 'Phase 12 — Teranoo Handoff Preparation',
      },
      status: 'pending',
      completedDate: null,
      purpose: {
        ar: 'تجهيز الحزمة النهائية المتكاملة والمراجعة الختامية قبل التسليم إلى دورة التطوير التنفيذية الرسمية لـ Teranoo.',
        en: 'Assemble the complete handoff package and conduct the final preparation review before transitioning into official Teranoo software engineering delivery.',
      },
      scope: {
        ar: '10 مخرجات تسليم نهائية تشمل الملخص التنفيذي والرؤية والنطاق وخريطة الوحدات ومتطلبات المنصة والمخططات الوظيفية ومتطلبات القطاعات والمخاطر المفتوحة.',
        en: '10 final handoff deliverables covering Executive Brief, Vision, Scope, Module Map, Platform Requirements, Functional Blueprints, Industry Requirements, Open Risks, and Final Review.',
      },
      workItems: [
        '1. ⏳ Executive Project Brief',
        '2. ⏳ Approved Product Vision',
        '3. ⏳ Approved Scope',
        '4. ⏳ Module Map & Dependencies',
        '5. ⏳ Platform Requirements',
        '6. ⏳ Functional Blueprints',
        '7. ⏳ Industry requirements',
        '8. ⏳ Open Decisions / Risks إن بقيت ضرورية',
        '9. ⏳ Final preparation review',
        '10. ⏳ التسليم إلى دورة Teranoo الرسمية',
      ],
      decisionRange: null,
      decisionCount: null,
      deliverables: ['Complete Official Teranoo Handoff Package'],
      dependencies: {
        ar: 'تعتمد على اعتماد Product Baseline في المرحلة 11.',
        en: 'Depends on approved Product Baseline from Phase 11.',
      },
      completionCondition: {
        ar: 'اجتياز المراجعة النهائية للتحضير وإتمام التسليم الرسمي لبدء التنفيذ البرمجي.',
        en: 'Pass final preparation review and execute formal handoff into engineering delivery.',
      },
      approvalOutcome: {
        ar: 'معلقة — لم يبدأ تنفيذ برمجة نظام ERP بعد.',
        en: 'Pending — ERP software implementation has not yet started.',
      },
      deferredWork: {
        ar: 'التنفيذ البرمجي الفعلي يبدأ فقط بعد إغلاق هذه المرحلة.',
        en: 'Actual ERP software implementation begins only after this handoff closes.',
      },
      sourceSectionAnchor: findHeadingAnchor(
        h1Anchors,
        (h) => /^Phase 12\b/i.test(h),
        'Phase 12 — Teranoo Handoff Preparation'
      ),
      sourceDocumentSlug,
    },
  ];

  const continuousTrack: ContinuousActivityTrack = {
    id: 'continuous-market-evidence',
    originalTitle: 'Continuous Market Evidence Collection — Non-Phase Track',
    title: {
      ar: 'جمع الأدلة السوقية المستمر — مسار موازٍ (ليس مرحلة مستقلة)',
      en: 'Continuous Market Evidence Collection — Non-Phase Track',
    },
    status: 'ongoing_track',
    purpose: {
      ar: 'مسار مستمر لجمع أدلة سوقية حقيقية مبكرًا (المشاكل المتكررة، الاستعداد للدفع، تعقيد التوطين، المنافسة، سهولة الوصول للعملاء، وعبء الدعم) دون فتح مرحلة معمارية موازية.',
      en: 'Ongoing non-phase activity collecting real market evidence early (recurring pains, willingness to pay, localization complexity, competition, customer access, support burden) without opening a parallel architecture phase.',
    },
    guardrails: [
      'لا قرار Primary Launch Market قبل Decision Gate A.',
      'القطاعات الأربعة Target Industries وليست V1 متزامنة.',
      'Evidence لا تتحول إلى Scope/Decision دون بوابة اعتماد.',
    ],
    sourceSectionAnchor: findHeadingAnchor(
      h1Anchors,
      (h) => /^Continuous Market Evidence Collection/i.test(h),
      'Continuous Market Evidence Collection — Non-Phase Track'
    ),
    isIndependentPlanningPhase: false,
  };

  const officialPhasesOnly = phases.filter((p) => p.kind === 'phase');
  const completedPhasesCount = officialPhasesOnly.filter(
    (p) => p.status === 'completed'
  ).length;

  return {
    sourceDocumentId,
    sourceDocumentSlug,
    sourceRevision,
    phases,
    continuousTrack,
    completedPhasesCount,
    totalOfficialPhasesCount: officialPhasesOnly.length,
    nextAuthorizedPhaseId: 'phase-6',
    hasStalePhase5CurrentLine,
    sourceDiscrepancyNote: {
      ar: 'توضيح التباين المصدري: يحتفظ قسم Current Position في النص الأصلي لملف PROJECT_WORK_PLAN.md بسطر قديم يصف المرحلة 5 بأنها Current (بُدئت 2026-10-02)، لكن بنود الحالة الختامية في نفس الملف وسجل القرارات الرسمي (DECISION_REGISTER.md) تؤكد اكتمال المرحلة 5 بالكامل (13/13 · D-PLAT-01..13) واعتماد بوابة القرار A مشروطًا (D-MKT-01)، وتحديد المرحلة 6 كخطوة تالية بانتظار تكليف منفصل. تم حفظ النص الأصلي حرفيًا دون تعديل مع عرض الحالة المعتمدة الأحدث هنا.',
      en: 'Source discrepancy notice: The Current Position header in the original PROJECT_WORK_PLAN.md retains a stale line labeling Phase 5 as Current, whereas the closing status bullets in the same file and DECISION_REGISTER.md confirm Phase 5 completion (13/13 · D-PLAT-01..13), conditional approval of Decision Gate A (D-MKT-01), and Phase 6 as the next step awaiting separate authorization. Both original statements are preserved verbatim in the full document while this curated roadmap displays the verified latest state.',
    },
  };
}

let cachedRoadmap: ExtractedRoadmap | null = null;

export function getExtractedRoadmap(): ExtractedRoadmap {
  if (cachedRoadmap) {
    return cachedRoadmap;
  }

  const registry = getContentRegistry();
  const doc = registry.getBySlug('project-work-plan');
  if (!doc) {
    throw new Error(
      'Published official PROJECT_WORK_PLAN.md document ("project-work-plan") is missing from the Content Registry.'
    );
  }

  cachedRoadmap = parseRoadmapMarkdown(doc.bodyMarkdown, {
    sourceDocumentId: doc.metadata.id,
    sourceDocumentSlug: doc.metadata.slug,
    sourceRevision:
      doc.metadata.source.kind === 'official-source'
        ? doc.metadata.source.commitSha ?? BATCH_001_SOURCE_REVISION.commitSha
        : BATCH_001_SOURCE_REVISION.commitSha,
  });

  return cachedRoadmap;
}

export function resetExtractedRoadmapCache(): void {
  cachedRoadmap = null;
}
