import { z } from 'zod';
import {
  CONTENT_CLASSIFICATION_VALUES,
  CONTENT_TYPE_VALUES,
  isValidOfficialPhaseRef,
} from '@/content/taxonomy/registry';
import { isSafeExternalHttpUrl } from '@/content/schemas/frontmatterSchema';
import type {
  SourceManifestEntry,
  SourceManifestSummary,
  SourceReadinessReport,
} from '@/content/models/knowledge';

export const OFFICIAL_ERP_REPOSITORY_URL =
  'https://github.com/Alabasi1980/TeranooErp';

export const KNOWLEDGE_HUB_REPOSITORY_URL =
  'https://github.com/majidkhaireddin-netizen/Teranoo-ERP-Knowledge-Hub';

export const SOURCE_IMPORT_STATUS_VALUES = [
  'expected',
  'awaiting-source',
  'source-received',
  'validated',
  'imported',
  'published',
  'rejected',
] as const;

export const SOURCE_AUTHORIZATION_STATUS_VALUES = [
  'pending',
  'authorized',
  'restricted',
] as const;

export const SOURCE_VERIFICATION_STATUS_VALUES = [
  'path-verified-awaiting-body',
  'hash-verified',
  'verified',
  'unverified',
] as const;

export const SOURCE_COMPLETENESS_STATUS_VALUES = [
  'not-imported',
  'reference-summary-only',
  'excerpt',
  'complete',
] as const;

const localizedTextSchema = z.object({
  ar: z.string().trim().min(1),
  en: z.string().trim().min(1),
});

export const sourceManifestEntrySchema = z.object({
  sourceRefId: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'sourceRefId must be lowercase kebab-case'),
  repository: z
    .string()
    .trim()
    .refine(isSafeExternalHttpUrl, 'repository must be a valid http(s) URL'),
  sourcePath: z
    .string()
    .trim()
    .min(1)
    .refine(
      (p) => !p.startsWith('/') && !p.includes('..') && !p.includes('\\'),
      'sourcePath must be a normalized repository-relative POSIX path'
    ),
  title: localizedTextSchema,
  purpose: localizedTextSchema,
  sourceRevision: z.string().trim().min(7).nullable().optional(),
  sourceFileHash: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{64}$/i, 'sourceFileHash must be a SHA-256 hex digest')
    .nullable()
    .optional(),
  classification: z.enum(CONTENT_CLASSIFICATION_VALUES),
  expectedContentType: z.enum(CONTENT_TYPE_VALUES),
  phaseRef: z.string().trim().refine(isValidOfficialPhaseRef, 'Invalid official phase ref'),
  importStatus: z.enum(SOURCE_IMPORT_STATUS_VALUES),
  publicationAuthorizationStatus: z.enum(SOURCE_AUTHORIZATION_STATUS_VALUES),
  publishedContentId: z.string().trim().min(1).nullable(),
  referenceSummaryContentId: z.string().trim().min(1).nullable().optional(),
  completeness: z.enum(SOURCE_COMPLETENESS_STATUS_VALUES),
  availableLanguages: z.array(z.enum(['ar', 'en', 'mixed'])),
  sourceVerificationStatus: z.enum(SOURCE_VERIFICATION_STATUS_VALUES),
  authorityNote: localizedTextSchema.optional(),
});

/**
 * Verified Project Foundations Official Source Inventory (TASK-003 Section 5).
 *
 * IMPORTANT: All 6 paths are verified in the official ERP repository, but their
 * full document bodies have NOT been delivered to the Knowledge Hub yet.
 * Therefore every entry is honestly marked "awaiting-source" with
 * publicationAuthorizationStatus="pending" and publishedContentId=null.
 */
export const PROJECT_FOUNDATIONS_SOURCE_MANIFEST: readonly SourceManifestEntry[] = [
  {
    sourceRefId: 'src-pf-01-project-vision',
    repository: OFFICIAL_ERP_REPOSITORY_URL,
    sourcePath: 'teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md',
    title: {
      ar: 'رؤية المنتج (\u206600_PROJECT_VISION.md\u2069)',
      en: 'Product Vision (00_PROJECT_VISION.md)',
    },
    purpose: {
      ar: 'رؤية المنتج، الأهداف، العملاء المستهدفون، التموضع التجاري، الأنظمة الأساسية، الامتدادات المستقبلية، حدود المنتج، ومعايير النجاح.',
      en: 'Product vision, goals, target customers, positioning, core ERP modules, enterprise extensions, product boundaries, and success criteria.',
    },
    sourceRevision: null,
    sourceFileHash: null,
    classification: 'official',
    expectedContentType: 'product-vision',
    phaseRef: 'phase-1',
    importStatus: 'awaiting-source',
    publicationAuthorizationStatus: 'pending',
    publishedContentId: null,
    referenceSummaryContentId: 'kh-doc-product-vision-ref-ar',
    completeness: 'reference-summary-only',
    availableLanguages: [],
    sourceVerificationStatus: 'path-verified-awaiting-body',
    authorityNote: {
      ar: 'يتوفر حاليًا ملخص مرجعي مشتق من اللقطة التخطيطية فقط؛ بانتظار تسليم الملف الرسمي الكامل.',
      en: 'Only a snapshot-derived reference summary is currently published; awaiting full official source file delivery.',
    },
  },
  {
    sourceRefId: 'src-pf-02-project-work-plan',
    repository: OFFICIAL_ERP_REPOSITORY_URL,
    sourcePath: 'teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md',
    title: {
      ar: 'خطة عمل المشروع (PROJECT_WORK_PLAN.md)',
      en: 'Project Work Plan (PROJECT_WORK_PLAN.md)',
    },
    purpose: {
      ar: 'خارطة الطريق التخطيطية الكاملة، المراحل وبوابات الاعتماد، الحالة الحالية، المخرجات، الأعمال المؤجلة، والتخطيط المستقبلي بما في ذلك المراحل الوسيطة مثل المرحلة 6.5.',
      en: 'Complete official planning roadmap, phases and gates, current status, deliverables, approved outcomes, deferred activities, and future phases including Phase 6.5.',
    },
    sourceRevision: 'a922a69b54bc0cc611ae46d8e7434907cde0046a',
    sourceFileHash: null,
    classification: 'official',
    expectedContentType: 'roadmap',
    phaseRef: 'phase-1',
    importStatus: 'awaiting-source',
    publicationAuthorizationStatus: 'pending',
    publishedContentId: null,
    referenceSummaryContentId: null,
    completeness: 'not-imported',
    availableLanguages: [],
    sourceVerificationStatus: 'path-verified-awaiting-body',
    authorityNote: {
      ar: 'تعتمد اللقطة المرجعية على مراجعة محدودة للمراحل 1–5 فقط؛ تفاصيل بقية المراحل بانتظار تسليم الملف الكامل.',
      en: 'The reference snapshot reflects reviewed Phases 1–5 counts only; remaining phases await delivery of the full file.',
    },
  },
  {
    sourceRefId: 'src-pf-03-working-rules',
    repository: OFFICIAL_ERP_REPOSITORY_URL,
    sourcePath: 'teranoo-erp-planning/00-project-foundation/WORKING_RULES.md',
    title: {
      ar: 'قواعد العمل والتخطيط (WORKING_RULES.md)',
      en: 'Working Rules (WORKING_RULES.md)',
    },
    purpose: {
      ar: 'قواعد تخطيط مشروع ERP، انضباط القرارات، حدود الأبحاث، التدرج المرحلي، حوكمة التأجيل، ومنع التنفيذ المبكر أو تضخم التخطيط.',
      en: 'ERP project planning rules, decision discipline, research boundaries, phase progression, deferral governance, and prevention of premature implementation.',
    },
    sourceRevision: null,
    sourceFileHash: null,
    classification: 'official',
    expectedContentType: 'architecture-document',
    phaseRef: 'phase-1',
    importStatus: 'awaiting-source',
    publicationAuthorizationStatus: 'pending',
    publishedContentId: null,
    referenceSummaryContentId: null,
    completeness: 'not-imported',
    availableLanguages: [],
    sourceVerificationStatus: 'path-verified-awaiting-body',
  },
  {
    sourceRefId: 'src-pf-04-cross-phase-guardrails',
    repository: OFFICIAL_ERP_REPOSITORY_URL,
    sourcePath:
      'teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md',
    title: {
      ar: 'ضوابط المنتج العابرة للمراحل (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
      en: 'Cross-Phase Product Guardrails (CROSS_PHASE_PRODUCT_GUARDRAILS.md)',
    },
    purpose: {
      ar: 'المبادئ المعمارية العابرة للمراحل: نواة المنتج الموحدة، التخصيص الآمن للترقية، حوكمة التهيئة، توافق عقود التكامل، الترحيل وخروج البيانات، المعالجة الخلفية، حدود أمان الذكاء الاصطناعي، والمعاملات المتصلة فقط.',
      en: 'Cross-phase architectural principles: single product core, upgrade-safe customization, configuration governance, integration compatibility, data exit, background processing, AI safety boundaries, and online-only transactions.',
    },
    sourceRevision: null,
    sourceFileHash: null,
    classification: 'official',
    expectedContentType: 'architecture-document',
    phaseRef: 'phase-1',
    importStatus: 'awaiting-source',
    publicationAuthorizationStatus: 'pending',
    publishedContentId: null,
    referenceSummaryContentId: null,
    completeness: 'not-imported',
    availableLanguages: [],
    sourceVerificationStatus: 'path-verified-awaiting-body',
  },
  {
    sourceRefId: 'src-pf-05-decision-register',
    repository: OFFICIAL_ERP_REPOSITORY_URL,
    sourcePath: 'teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md',
    title: {
      ar: 'سجل القرارات الرسمي (DECISION_REGISTER.md)',
      en: 'Official Decision Register (DECISION_REGISTER.md)',
    },
    purpose: {
      ar: 'فهرس القرارات الرسمي (معرفات القرارات، عناوينها، الوثائق المصدر، المراحل المالكة، والأثر). يمثّل هذا الملف فهرسًا وليس النص المرجعي الكامل لكل قرار.',
      en: 'Official decision index (IDs, titles, source documents, owning phases, and impact). Serves as an index; each decision’s authoritative full text remains in its owning document.',
    },
    sourceRevision: 'a922a69b54bc0cc611ae46d8e7434907cde0046a',
    sourceFileHash: null,
    classification: 'official',
    expectedContentType: 'architectural-decision',
    phaseRef: 'phase-1',
    importStatus: 'awaiting-source',
    publicationAuthorizationStatus: 'pending',
    publishedContentId: null,
    referenceSummaryContentId: null,
    completeness: 'not-imported',
    availableLanguages: [],
    sourceVerificationStatus: 'path-verified-awaiting-body',
    authorityNote: {
      ar: 'سجل القرارات فهرس رسمي فقط وليس بديلًا عن الوثيقة المالكة لكل قرار. يعلن المصدر عن 120 قرارًا، بينما تتوفر محليًا 7 مراجع موثّقة من المرحلة 5 فقط.',
      en: 'The Decision Register is an official index, not the full authoritative text of every decision. The source declares 120 decisions while 7 verified Phase 5 references exist locally.',
    },
  },
  {
    sourceRefId: 'src-pf-06-future-architecture-considerations',
    repository: OFFICIAL_ERP_REPOSITORY_URL,
    sourcePath:
      'teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md',
    title: {
      ar: 'الاعتبارات المعمارية المستقبلية (FUTURE_ARCHITECTURE_CONSIDERATIONS.md)',
      en: 'Future Architecture Considerations (FUTURE_ARCHITECTURE_CONSIDERATIONS.md)',
    },
    purpose: {
      ar: 'الجرد الرسمي للاعتبارات المعمارية المستقبلية، الموضوعات التي تتطلب أبحاثًا، أسئلة التصميم المؤجلة، القدرات المستقبلية، والمخاطر المعمارية المحتملة.',
      en: 'Official inventory of future architecture considerations, research-required topics, deferred design questions, future capabilities, and potential architectural risks.',
    },
    sourceRevision: null,
    sourceFileHash: null,
    classification: 'future',
    expectedContentType: 'future-consideration',
    phaseRef: 'phase-1',
    importStatus: 'awaiting-source',
    publicationAuthorizationStatus: 'pending',
    publishedContentId: null,
    referenceSummaryContentId: null,
    completeness: 'not-imported',
    availableLanguages: [],
    sourceVerificationStatus: 'path-verified-awaiting-body',
    authorityNote: {
      ar: 'الاعتبارات المعمارية المستقبلية ليست قرارات ERP معتمدة تلقائيًا.',
      en: 'Future architecture considerations are not automatically approved ERP decisions.',
    },
  },
];

export interface ManifestValidationIssue {
  readonly severity: 'error' | 'warning';
  readonly code: string;
  readonly sourceRefId: string;
  readonly field: string;
  readonly message: string;
}

export interface SourceManifestValidationResult {
  readonly ok: boolean;
  readonly errors: readonly ManifestValidationIssue[];
  readonly warnings: readonly ManifestValidationIssue[];
}

/**
 * Validates a source manifest for schema integrity, unique sourceRefId,
 * unique repository+sourcePath, unique publishedContentId mapping,
 * provenance completeness, and publication authorization discipline.
 */
export function validateSourceManifest(
  entries: readonly SourceManifestEntry[] = PROJECT_FOUNDATIONS_SOURCE_MANIFEST,
  publishedContentIds?: ReadonlySet<string>
): SourceManifestValidationResult {
  const errors: ManifestValidationIssue[] = [];
  const warnings: ManifestValidationIssue[] = [];

  const seenRefIds = new Set<string>();
  const seenSourcePaths = new Set<string>();
  const seenPublishedIds = new Set<string>();

  for (const rawEntry of entries) {
    const parsed = sourceManifestEntrySchema.safeParse(rawEntry);
    const refId =
      typeof rawEntry?.sourceRefId === 'string' && rawEntry.sourceRefId
        ? rawEntry.sourceRefId
        : 'unknown-source';

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        errors.push({
          severity: 'error',
          code: 'INVALID_MANIFEST_ENTRY',
          sourceRefId: refId,
          field: issue.path.join('.') || 'entry',
          message: issue.message,
        });
      }
      continue;
    }

    const entry = parsed.data;

    if (seenRefIds.has(entry.sourceRefId)) {
      errors.push({
        severity: 'error',
        code: 'DUPLICATE_SOURCE_REF_ID',
        sourceRefId: entry.sourceRefId,
        field: 'sourceRefId',
        message: `Duplicate sourceRefId "${entry.sourceRefId}" in source manifest.`,
      });
    } else {
      seenRefIds.add(entry.sourceRefId);
    }

    const repoPathKey = `${entry.repository}::${entry.sourcePath}`;
    if (seenSourcePaths.has(repoPathKey)) {
      errors.push({
        severity: 'error',
        code: 'DUPLICATE_SOURCE_PATH',
        sourceRefId: entry.sourceRefId,
        field: 'sourcePath',
        message: `Duplicate source path "${entry.sourcePath}" mapped in source manifest.`,
      });
    } else {
      seenSourcePaths.add(repoPathKey);
    }

    if (entry.publishedContentId) {
      if (seenPublishedIds.has(entry.publishedContentId)) {
        errors.push({
          severity: 'error',
          code: 'DUPLICATE_PUBLISHED_MAPPING',
          sourceRefId: entry.sourceRefId,
          field: 'publishedContentId',
          message: `Published content ID "${entry.publishedContentId}" is mapped to multiple source manifest entries.`,
        });
      } else {
        seenPublishedIds.add(entry.publishedContentId);
      }
    }

    // Provenance required once a real source body is received/validated/imported/published
    const requiresBodyProvenance =
      entry.importStatus === 'source-received' ||
      entry.importStatus === 'validated' ||
      entry.importStatus === 'imported' ||
      entry.importStatus === 'published';

    if (requiresBodyProvenance) {
      if (!entry.sourceRevision && !entry.sourceFileHash) {
        errors.push({
          severity: 'error',
          code: 'MISSING_SOURCE_PROVENANCE',
          sourceRefId: entry.sourceRefId,
          field: 'sourceRevision',
          message: `Source "${entry.sourcePath}" with status "${entry.importStatus}" must record a verified sourceRevision or SHA-256 sourceFileHash.`,
        });
      }
      if (entry.completeness === 'not-imported') {
        errors.push({
          severity: 'error',
          code: 'INCONSISTENT_SOURCE_COMPLETENESS',
          sourceRefId: entry.sourceRefId,
          field: 'completeness',
          message: `Source "${entry.sourcePath}" marked "${entry.importStatus}" cannot have completeness="not-imported".`,
        });
      }
    }

    // Publication governance enforcement
    if (entry.importStatus === 'published') {
      if (entry.publicationAuthorizationStatus !== 'authorized') {
        errors.push({
          severity: 'error',
          code: 'UNAUTHORIZED_SOURCE_PUBLICATION',
          sourceRefId: entry.sourceRefId,
          field: 'publicationAuthorizationStatus',
          message: `Source "${entry.sourcePath}" cannot be marked "published" unless publicationAuthorizationStatus="authorized".`,
        });
      }
      if (!entry.publishedContentId) {
        errors.push({
          severity: 'error',
          code: 'MISSING_PUBLISHED_CONTENT_ID',
          sourceRefId: entry.sourceRefId,
          field: 'publishedContentId',
          message: `Published source "${entry.sourcePath}" must reference its canonical publishedContentId.`,
        });
      } else if (
        publishedContentIds &&
        !publishedContentIds.has(entry.publishedContentId)
      ) {
        errors.push({
          severity: 'error',
          code: 'UNRESOLVED_PUBLISHED_CONTENT_ID',
          sourceRefId: entry.sourceRefId,
          field: 'publishedContentId',
          message: `Published source "${entry.sourcePath}" points to content ID "${entry.publishedContentId}" which is not publicly published in the registry.`,
        });
      }
      if (entry.availableLanguages.length === 0) {
        errors.push({
          severity: 'error',
          code: 'MISSING_AVAILABLE_LANGUAGES',
          sourceRefId: entry.sourceRefId,
          field: 'availableLanguages',
          message: `Published source "${entry.sourcePath}" must list at least one available language.`,
        });
      }
    }

    if (
      entry.importStatus !== 'published' &&
      entry.publishedContentId !== null
    ) {
      errors.push({
        severity: 'error',
        code: 'UNPUBLISHED_SOURCE_HAS_CONTENT_ID',
        sourceRefId: entry.sourceRefId,
        field: 'publishedContentId',
        message: `Source "${entry.sourcePath}" with status "${entry.importStatus}" must keep publishedContentId=null until published.`,
      });
    }

    if (entry.importStatus === 'awaiting-source') {
      warnings.push({
        severity: 'warning',
        code: 'SOURCE_AWAITING_DELIVERY',
        sourceRefId: entry.sourceRefId,
        field: 'importStatus',
        message: `Official source "${entry.sourcePath}" is registered in inventory and awaiting full source file delivery.`,
      });
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

export function deriveSourceManifestSummary(
  entries: readonly SourceManifestEntry[] = PROJECT_FOUNDATIONS_SOURCE_MANIFEST
): SourceManifestSummary {
  let expectedCount = 0;
  let awaitingSourceCount = 0;
  let sourceReceivedCount = 0;
  let validatedCount = 0;
  let importedCount = 0;
  let publishedCount = 0;
  let rejectedCount = 0;

  for (const entry of entries) {
    switch (entry.importStatus) {
      case 'expected':
        expectedCount += 1;
        break;
      case 'awaiting-source':
        awaitingSourceCount += 1;
        break;
      case 'source-received':
        sourceReceivedCount += 1;
        break;
      case 'validated':
        validatedCount += 1;
        break;
      case 'imported':
        importedCount += 1;
        break;
      case 'published':
        publishedCount += 1;
        break;
      case 'rejected':
        rejectedCount += 1;
        break;
    }
  }

  return {
    totalSources: entries.length,
    expectedCount,
    awaitingSourceCount,
    sourceReceivedCount,
    validatedCount,
    importedCount,
    publishedCount,
    rejectedCount,
  };
}

export function getSourceManifestEntryByPath(
  sourcePath: string,
  entries: readonly SourceManifestEntry[] = PROJECT_FOUNDATIONS_SOURCE_MANIFEST
): SourceManifestEntry | undefined {
  return entries.find((entry) => entry.sourcePath === sourcePath);
}

export function getSourceManifestEntryByRefId(
  sourceRefId: string,
  entries: readonly SourceManifestEntry[] = PROJECT_FOUNDATIONS_SOURCE_MANIFEST
): SourceManifestEntry | undefined {
  return entries.find((entry) => entry.sourceRefId === sourceRefId);
}

export function generateSourceReadinessReport(
  entries: readonly SourceManifestEntry[] = PROJECT_FOUNDATIONS_SOURCE_MANIFEST
): SourceReadinessReport {
  const summary = deriveSourceManifestSummary(entries);
  const awaitingDelivery = entries
    .filter(
      (entry) =>
        entry.importStatus === 'expected' ||
        entry.importStatus === 'awaiting-source'
    )
    .map((entry) => ({
      sourceRefId: entry.sourceRefId,
      sourcePath: entry.sourcePath,
      expectedContentType: entry.expectedContentType,
      phaseRef: entry.phaseRef,
      importStatus: entry.importStatus,
    }));

  const readyForPublicDisplay = entries
    .filter(
      (entry) =>
        entry.importStatus === 'published' &&
        entry.publicationAuthorizationStatus === 'authorized' &&
        entry.publishedContentId !== null
    )
    .map((entry) => entry.publishedContentId as string);

  return {
    generatedFromManifest: 'PROJECT_FOUNDATIONS_SOURCE_MANIFEST',
    officialRepository: OFFICIAL_ERP_REPOSITORY_URL,
    summary,
    awaitingDelivery,
    readyForPublicDisplay,
  };
}
