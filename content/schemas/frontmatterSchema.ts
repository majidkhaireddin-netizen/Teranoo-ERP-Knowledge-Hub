import { z } from 'zod';
import {
  CONTENT_CLASSIFICATION_VALUES,
  CONTENT_TYPE_VALUES,
  CONTROLLED_TOPIC_VALUES,
  EDITORIAL_STATUS_VALUES,
  IMPLEMENTATION_STATUS_VALUES,
  JOURNEY_STAGE_VALUES,
  KNOWLEDGE_DEPTH_VALUES,
  OFFICIAL_APPROVAL_STATUS_VALUES,
  PLATFORM_DOMAIN_VALUES,
  PUBLICATION_STATUS_VALUES,
  RELATIONSHIP_TYPE_VALUES,
  isValidOfficialPhaseRef,
} from '@/content/taxonomy/registry';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const INTERNAL_ID_PATTERN = /^[a-z][a-z0-9-]{2,64}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SHA_PATTERN = /^[0-9a-f]{7,40}$/i;

/**
 * Validates URLs strictly to block javascript:, data:, vbscript:, file:, and
 * protocol-relative injection while allowing https:, http:, mailto:, and
 * safe site-relative or fragment paths.
 */
export function isSafeUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Reject control characters or whitespace-smuggled protocols
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) return false;

  // Allow fragment links and single-leading-slash relative paths (not //host)
  if (trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return !trimmed.includes('..');
  }

  try {
    const parsed = new URL(trimmed);
    return (
      parsed.protocol === 'https:' ||
      parsed.protocol === 'http:' ||
      parsed.protocol === 'mailto:'
    );
  } catch {
    return false;
  }
}

export function isSafeExternalHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed || /[\u0000-\u001F\u007F]/.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

const localizedTextSchema = z.object({
  ar: z.string().trim().min(1, 'Arabic text is required'),
  en: z.string().trim().min(1, 'English text is required'),
});

const optionalDateSchema = z
  .union([z.string().regex(ISO_DATE_PATTERN, 'Expected ISO YYYY-MM-DD date'), z.null()])
  .optional();

const safeHttpUrlSchema = z
  .string()
  .trim()
  .refine(isSafeExternalHttpUrl, 'Must be a valid http(s) URL');

const sourceBaseFields = {
  attribution: z.string().trim().min(1, 'Source attribution is required'),
  sourceLanguage: z.enum(['ar', 'en', 'mixed']).optional(),
  sourceDocumentDate: optionalDateSchema,
  reviewDate: optionalDateSchema,
  publicationDate: optionalDateSchema,
  copyrightNotice: z.string().trim().min(1).optional(),
};

const sourceProvenanceSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('official-source'),
    repository: safeHttpUrlSchema,
    sourcePath: z.string().trim().min(1),
    sourceTitle: z.string().trim().min(1).optional(),
    commitSha: z.string().regex(SHA_PATTERN, 'Invalid SHA format').optional(),
    treeSha: z.string().regex(SHA_PATTERN, 'Invalid SHA format').optional(),
    ...sourceBaseFields,
  }),
  z.object({
    kind: z.literal('snapshot-derived'),
    repository: safeHttpUrlSchema,
    sourcePaths: z.array(z.string().trim().min(1)).min(1),
    sourceTitle: z.string().trim().min(1).optional(),
    treeSha: z.string().regex(SHA_PATTERN, 'Invalid tree SHA format'),
    ...sourceBaseFields,
  }),
  z.object({
    kind: z.literal('knowledge-hub-authored'),
    publisher: z.string().trim().min(1),
    ...sourceBaseFields,
  }),
  z.object({
    kind: z.literal('external-reference'),
    publisher: z.string().trim().min(1),
    sourceUrl: safeHttpUrlSchema,
    sourceTitle: z.string().trim().min(1),
    ...sourceBaseFields,
  }),
  z.object({
    kind: z.literal('illustrative'),
    disclaimer: localizedTextSchema.optional(),
    ...sourceBaseFields,
  }),
]);

const relationshipSchema = z
  .object({
    type: z.enum(RELATIONSHIP_TYPE_VALUES),
    targetId: z.string().regex(INTERNAL_ID_PATTERN).optional(),
    externalUrl: safeHttpUrlSchema.optional(),
    deferredRef: z.string().trim().min(1).optional(),
    label: localizedTextSchema.optional(),
  })
  .refine(
    (rel) => {
      const count = [rel.targetId, rel.externalUrl, rel.deferredRef].filter(
        Boolean
      ).length;
      return count === 1;
    },
    {
      message:
        'Each relationship must specify exactly one of targetId, externalUrl, or deferredRef',
    }
  );

const publicationAuthorizationSchema = z.object({
  authorized: z.boolean(),
  authorizedBy: z.string().trim().min(1).optional(),
  scopeNote: localizedTextSchema.optional(),
  completeness: z
    .enum(['complete', 'excerpt', 'reference-summary'])
    .default('complete'),
});

const versioningSchema = z.object({
  revision: z.number().int().positive(),
  sourceVersion: z.string().trim().min(1).optional(),
  previousRevisionId: z.string().regex(INTERNAL_ID_PATTERN).optional(),
  supersedesId: z.string().regex(INTERNAL_ID_PATTERN).optional(),
  lastVerifiedDate: optionalDateSchema,
  correctionNote: localizedTextSchema.optional(),
});

const traceabilitySchema = z.object({
  officialDocumentId: z.string().trim().min(1).optional(),
  decisionIds: z.array(z.string().trim().min(1)).default([]),
  requirementIds: z.array(z.string().trim().min(1)).default([]),
  researchIds: z.array(z.string().trim().min(1)).default([]),
  futureConsiderationIds: z.array(z.string().trim().min(1)).default([]),
  independentReviewIds: z.array(z.string().trim().min(1)).default([]),
});

export const frontmatterSchema = z.object({
  id: z
    .string()
    .trim()
    .regex(
      INTERNAL_ID_PATTERN,
      'Internal content ID must be lowercase kebab-case (e.g. kh-doc-product-vision-ref-ar)'
    ),
  slug: z
    .string()
    .trim()
    .regex(SLUG_PATTERN, 'Slug must be lowercase kebab-case'),
  title: localizedTextSchema,
  subtitle: localizedTextSchema.optional(),
  description: localizedTextSchema,
  language: z.enum(['ar', 'en', 'mixed']),
  translationGroupId: z.string().regex(INTERNAL_ID_PATTERN).optional(),

  type: z.enum(CONTENT_TYPE_VALUES),
  classification: z.enum(CONTENT_CLASSIFICATION_VALUES),
  editorialStatus: z.enum(EDITORIAL_STATUS_VALUES),
  publicationStatus: z.enum(PUBLICATION_STATUS_VALUES),
  approvalStatus: z.enum(OFFICIAL_APPROVAL_STATUS_VALUES),
  implementationStatus: z
    .enum(IMPLEMENTATION_STATUS_VALUES)
    .default('not-applicable'),
  depth: z.enum(KNOWLEDGE_DEPTH_VALUES).optional(),

  journeyStages: z.array(z.enum(JOURNEY_STAGE_VALUES)).default([]),
  phaseRefs: z
    .array(
      z
        .string()
        .trim()
        .refine(
          isValidOfficialPhaseRef,
          'Phase reference must match phase-<number> or phase-<number>.<decimal> (e.g. phase-5, phase-6.5)'
        )
    )
    .default([]),
  moduleRefs: z.array(z.string().trim().min(1)).default([]),
  domainRefs: z.array(z.enum(PLATFORM_DOMAIN_VALUES)).default([]),
  topics: z.array(z.enum(CONTROLLED_TOPIC_VALUES)).default([]),
  tags: z.array(z.string().trim().min(1)).default([]),

  traceability: traceabilitySchema.default({
    decisionIds: [],
    requirementIds: [],
    researchIds: [],
    futureConsiderationIds: [],
    independentReviewIds: [],
  }),
  relationships: z.array(relationshipSchema).default([]),
  source: sourceProvenanceSchema,
  publicationAuthorization: publicationAuthorizationSchema,
  versioning: versioningSchema,
  collectionSequence: z
    .object({
      collectionId: z.string().regex(INTERNAL_ID_PATTERN),
      order: z.number().int().positive(),
    })
    .optional(),
});

export type ValidatedFrontmatter = z.infer<typeof frontmatterSchema>;
