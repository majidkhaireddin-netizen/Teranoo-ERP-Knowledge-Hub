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

export const BATCH_001_SOURCE_REVISION = {
  batchId: 'BATCH-001',
  commitSha: '397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f',
  treeSha: 'db531de6b2ab452578a550e07c5fd80e4bfe6b64',
  reviewDate: '2026-11-26',
  publicationDate: '2026-11-26',
} as const;

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
  'source-received',
  'digest-calculated',
  'git-blob-verified',
  'git-blob-verified-lf-normalized',
  'git-blob-mismatch',
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
  expectedGitBlobSha: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{40}$/i, 'expectedGitBlobSha must be a 40-character Git blob SHA-1')
    .nullable()
    .optional(),
  actualGitBlobSha: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{40}$/i, 'actualGitBlobSha must be a 40-character Git blob SHA-1')
    .nullable()
    .optional(),
  rawSourceSha256: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{64}$/i, 'rawSourceSha256 must be a SHA-256 hex digest')
    .nullable()
    .optional(),
  sourceFileHash: z
    .string()
    .trim()
    .regex(/^[0-9a-f]{64}$/i, 'sourceFileHash must be a SHA-256 hex digest')
    .nullable()
    .optional(),
  lineEndingNormalization: z.enum(['none', 'crlf-to-lf']).optional(),
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
 * Verified Project Foundations Official Source Inventory — BATCH-001 (TASK-004).
 *
 * All six authorized official source files were supplied by the project owner,
 * verified byte-for-byte against their trusted Git blob SHAs (after lossless
 * CRLF -> LF normalization explicitly documented per KH-021), wrapped verbatim
 * in canonical frontmatter envelopes, and published through the Content Registry.
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
      ar: 'رؤية المنتج الكاملة، المشاكل المستهدفة، العملاء والقطاعات الأربعة، التموضع التجاري، الأنظمة الأساسية الأربعة والمنصة المشتركة، الامتدادات المستقبلية، المبادئ السبع، حدود المنتج، ومعايير النجاح.',
      en: 'Complete product vision, target problems, customers and four industries, commercial positioning, four core modules and platform foundation, future extensions, seven core principles, anti-goals, and success criteria.',
    },
    sourceRevision: BATCH_001_SOURCE_REVISION.commitSha,
    expectedGitBlobSha: '7206f4d747e8befc0d47400a666850aa259b7055',
    actualGitBlobSha: '7206f4d747e8befc0d47400a666850aa259b7055',
    rawSourceSha256: '64bc2e1a6333ae4d109101a3c1cdd202015b4c9cd29db7476bb2574a5db61fa7',
    sourceFileHash: '69bce606580f28a6fc7a90bd743416ffc45ab26fe487c7630d5905c2a6e75aad',
    lineEndingNormalization: 'crlf-to-lf',
    classification: 'official',
    expectedContentType: 'product-vision',
    phaseRef: 'phase-1',
    importStatus: 'published',
    publicationAuthorizationStatus: 'authorized',
    publishedContentId: 'kh-doc-project-vision-ar',
    referenceSummaryContentId: 'kh-doc-product-vision-ref-ar',
    completeness: 'complete',
    availableLanguages: ['ar'],
    sourceVerificationStatus: 'git-blob-verified-lf-normalized',
    authorityNote: {
      ar: 'وثيقة رسمية معتمدة (Approved / Phase 1 Closed — محدثة بتاريخ 2026-10-02). يحل هذا الملف الكامل محل الملخص المرجعي التاريخي السابق مع الاحتفاظ بسجله.',
      en: 'Approved official document (Approved / Phase 1 Closed — updated 2026-10-02). Supersedes the earlier snapshot-derived reference summary while preserving its history.',
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
      ar: 'خارطة الطريق التخطيطية الكاملة (المراحل 1 إلى 12 شاملة المرحلة 6.5 وبوابة القرار A ومسار جمع الأدلة السوقية المستمر)، المخرجات، الأعمال المؤجلة، والوضع الحالي.',
      en: 'Complete official planning roadmap (Phases 1–12 including Phase 6.5, Decision Gate A, and Continuous Market Evidence Collection), deliverables, deferred activities, and current position.',
    },
    sourceRevision: BATCH_001_SOURCE_REVISION.commitSha,
    expectedGitBlobSha: '14e0b4a2068d10d2ecb07d7e9bcf4364e824fd43',
    actualGitBlobSha: '14e0b4a2068d10d2ecb07d7e9bcf4364e824fd43',
    rawSourceSha256: 'cc4610cb685b679799bd09366171727787405ceaeedf0e1e28ff799485252ca9',
    sourceFileHash: 'df43786d50640c5574b28b7930c068697a78cecf3422b69a8ff8058e6109fa06',
    lineEndingNormalization: 'crlf-to-lf',
    classification: 'official',
    expectedContentType: 'roadmap',
    phaseRef: 'phase-1',
    importStatus: 'published',
    publicationAuthorizationStatus: 'authorized',
    publishedContentId: 'kh-doc-project-work-plan-ar',
    referenceSummaryContentId: null,
    completeness: 'complete',
    availableLanguages: ['ar'],
    sourceVerificationStatus: 'git-blob-verified-lf-normalized',
    authorityNote: {
      ar: 'خطة عمل رسمية نشطة (Active Reference). يُحفظ السطر القديم الذي يذكر Phase 5 كـ Current حرفيًا في النص الأصلي مع ملاحظة توضيحية لأن الأقسام الختامية وسجل القرارات تؤكد اكتمال المرحلة 5 (13/13) واعتماد بوابة القرار A مشروطًا.',
      en: 'Active official project work plan (reference). Preserves a stale line labeling Phase 5 as Current verbatim in the original body, alongside an explicit interpretation note because closing sections and DECISION_REGISTER.md confirm Phase 5 completion (13/13) and Decision Gate A conditional approval.',
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
      ar: 'منهجية التخطيط وقواعد العمل: التدرج المرحلي، دورة البحث ثم القرار ثم التوثيق ثم المراجعة، القاعدة العليا، اختبار الحاجة للقرار الآن، تصنيف A/B/C/D، ومنع تضخم التخطيط.',
      en: 'Planning methodology and working rules: sequential phases, Research -> Decision -> Documentation -> Review cycle, Supreme Rule, Need-to-Decide-Now gate, A/B/C/D triage, and preventing planning inflation.',
    },
    sourceRevision: BATCH_001_SOURCE_REVISION.commitSha,
    expectedGitBlobSha: 'e943101df8f21092d685fdda2af2e5bdad0166e5',
    actualGitBlobSha: 'e943101df8f21092d685fdda2af2e5bdad0166e5',
    rawSourceSha256: '3c29def6bb336784e2969df0ae9359de9560311174a4e6f3d55e648fbb31a21f',
    sourceFileHash: 'e3919a78039d5f4135b5549c91133eb94a6bdc7612b2d4f810938262eebbd752',
    lineEndingNormalization: 'crlf-to-lf',
    classification: 'official',
    expectedContentType: 'architecture-document',
    phaseRef: 'phase-1',
    importStatus: 'published',
    publicationAuthorizationStatus: 'authorized',
    publishedContentId: 'kh-doc-working-rules-ar',
    referenceSummaryContentId: null,
    completeness: 'complete',
    availableLanguages: ['ar'],
    sourceVerificationStatus: 'git-blob-verified-lf-normalized',
    authorityNote: {
      ar: 'وثيقة قواعد عمل ومنهجية تخطيطية رسمية نشطة (Active Reference) — ليست قرارًا معماريًا فرديًا.',
      en: 'Active official working methodology and planning governance document (reference) — not a standalone architectural decision.',
    },
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
      ar: 'الضوابط الثمانية المعتمدة العابرة لجميع المراحل: خط المنتج الموحد والتوسعات الآمنة للترقية، نقل التهيئة، عقود التكامل المرقّمة، ترحيل وخروج البيانات، المعالجة الخلفية، أمان وحوكمة الذكاء الاصطناعي، المعاملات المتصلة فقط، والتحكم بالتهيئة والميزات.',
      en: 'Eight approved cross-phase product guardrails: Single Product Line & Upgrade-Safe Extensions, Configuration Transport, Versioned Public Contracts, Controlled Data Migration & Exit, Shared Background Processing, AI Safety & Governance, Online-Only Transactions, and Product Configuration & Feature Control.',
    },
    sourceRevision: BATCH_001_SOURCE_REVISION.commitSha,
    expectedGitBlobSha: '05dc98f61b79f0436c395de8c06650c723476e48',
    actualGitBlobSha: '05dc98f61b79f0436c395de8c06650c723476e48',
    rawSourceSha256: '839b15aef92b9a654a1d84ce539101d68e3b757f77aba6facef2cc9f63bc6081',
    sourceFileHash: '9500f4d735d0f4c1abba2b648b883bcf515c11be86c22ca7b47c8d45334af1cd',
    lineEndingNormalization: 'crlf-to-lf',
    classification: 'official',
    expectedContentType: 'architecture-document',
    phaseRef: 'phase-1',
    importStatus: 'published',
    publicationAuthorizationStatus: 'authorized',
    publishedContentId: 'kh-doc-cross-phase-guardrails-ar',
    referenceSummaryContentId: null,
    completeness: 'complete',
    availableLanguages: ['ar'],
    sourceVerificationStatus: 'git-blob-verified-lf-normalized',
    authorityNote: {
      ar: 'وثيقة حاكمة معتمدة (Approved — Governing Artifact بدون معرفات D-* منفصلة). تطبق عبر جميع مراحل التخطيط والمعمارية.',
      en: 'Approved governing artifact without standalone D-* IDs. Applies across all remaining planning and architecture phases.',
    },
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
      ar: 'فهرس القرارات الرسمي الذي يفهرس 126 قرارًا معماريًا معتمدًا (المراحل 3 و4 و5)، بالإضافة إلى قرار بوابة السوق D-MKT-01 المنفصل والمشروط، والوثائق الحاكمة الست بدون معرفات D-*، والضوابط التفسيرية.',
      en: 'Authoritative governance index of 126 approved architectural D-* decisions (Phases 3, 4, and 5), separate conditional market decision D-MKT-01, six governing artifacts without D-* IDs, and interpretive guardrails.',
    },
    sourceRevision: BATCH_001_SOURCE_REVISION.commitSha,
    expectedGitBlobSha: '0260f1469825ee45777be4bfd6460a45960108ea',
    actualGitBlobSha: '0260f1469825ee45777be4bfd6460a45960108ea',
    rawSourceSha256: '03996acde5d773d45df5907f1c346a88bdd105a3168ebea64482cdf39d64ff95',
    sourceFileHash: '32f2586d1f757ffb9793872ffe4ddf42fdde7252e4100ca1e6b03389c639f32a',
    lineEndingNormalization: 'crlf-to-lf',
    classification: 'official',
    expectedContentType: 'architecture-document',
    phaseRef: 'phase-1',
    importStatus: 'published',
    publicationAuthorizationStatus: 'authorized',
    publishedContentId: 'kh-doc-decision-register-ar',
    referenceSummaryContentId: null,
    completeness: 'complete',
    availableLanguages: ['ar'],
    sourceVerificationStatus: 'git-blob-verified-lf-normalized',
    authorityNote: {
      ar: 'فهرس حوكمة رسمي (Governance Index — Reference) وليس النص المرجعي الكامل لكل قرار؛ النصوص التفصيلية والمبررات الكاملة تبقى في الوثائق المالكة بانتظار دفعات استيراد لاحقة.',
      en: 'Authoritative governance index (reference), not the full authoritative text or rationale of every decision; full owning decision documents await future authorized batches.',
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
      ar: 'السجل الرسمي للـ 24 اعتبارًا معماريًا مستقبليًا (FAC-001 إلى FAC-024) بحالاتها المعتمدة من المصدر (RESEARCH REQUIRED / REVIEW LATER / WATCH) والأفكار السبع التي رُقّيت بالفعل إلى ضوابط رسمية.',
      en: 'Official inventory of 24 Future Architecture Considerations (FAC-001 through FAC-024) with source-defined statuses (RESEARCH REQUIRED / REVIEW LATER / WATCH) and seven ideas already promoted to official guardrails.',
    },
    sourceRevision: BATCH_001_SOURCE_REVISION.commitSha,
    expectedGitBlobSha: 'f8158524f5cb44bd79f1f4c6d6e8bcc59853d7d5',
    actualGitBlobSha: 'f8158524f5cb44bd79f1f4c6d6e8bcc59853d7d5',
    rawSourceSha256: '247d5403057f25bc7ef9aafd4a5b4718d8cae46ee86c69be82416ddd739da8ea',
    sourceFileHash: '127b56b9f6a5a230fc02ed3ccb46c6d4555ae12ddd201bfe982395448c682a25',
    lineEndingNormalization: 'crlf-to-lf',
    classification: 'future',
    expectedContentType: 'future-consideration',
    phaseRef: 'phase-1',
    importStatus: 'published',
    publicationAuthorizationStatus: 'authorized',
    publishedContentId: 'kh-doc-future-architecture-considerations-ar',
    referenceSummaryContentId: null,
    completeness: 'complete',
    availableLanguages: ['ar'],
    sourceVerificationStatus: 'git-blob-verified-lf-normalized',
    authorityNote: {
      ar: 'سجل اعتبارات مستقبلية غير معتمدة كقرارات ERP بعد (Not Approved Decisions). الملفات التفصيلية المنفصلة لـ FAC-019..FAC-024 غير مشمولة في BATCH-001 وتنتظر دفعة مستقبلية.',
      en: 'Register of non-approved forward-looking considerations (not approved ERP decisions). Separate detailed files for FAC-019..FAC-024 are not included in BATCH-001 and await a future authorized batch.',
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
 * provenance completeness, Git blob verification integrity (KH-021),
 * and publication authorization discipline.
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

    // KH-021: Never publish a source whose Git blob SHA mismatched the trusted reference
    if (
      entry.importStatus === 'published' &&
      entry.sourceVerificationStatus === 'git-blob-mismatch'
    ) {
      errors.push({
        severity: 'error',
        code: 'SOURCE_GIT_BLOB_MISMATCH',
        sourceRefId: entry.sourceRefId,
        field: 'sourceVerificationStatus',
        message: `Source "${entry.sourcePath}" failed Git blob verification and cannot be marked "published".`,
      });
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
