import { BUSINESS_MODULES_TAXONOMY } from '@/content/taxonomy/registry';
import type { KnowledgeDocument, SourceManifestEntry } from '@/content/models/knowledge';
import {
  CONTENT_COLLECTIONS_ROOT,
  loadApprovedCollections,
  type LoadedContentEntry,
} from '@/content/loaders/contentLoader';
import {
  OFFICIAL_SOURCE_MANIFEST,
  validateSourceManifest,
} from '@/content/manifest/sourceManifest';
import { verifyStoredOfficialDocumentIntegrity } from '@/content/ingestion/ingestionPipeline';

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationDiagnostic {
  readonly severity: ValidationSeverity;
  readonly code: string;
  readonly file: string;
  readonly field: string;
  readonly message: string;
}

export interface ContentValidationReport {
  readonly ok: boolean;
  readonly errors: readonly ValidationDiagnostic[];
  readonly warnings: readonly ValidationDiagnostic[];
  readonly totalFilesScanned: number;
  readonly validRecordsCount: number;
  readonly publishedRecordsCount: number;
  readonly unpublishedValidRecordsCount: number;
}

export class ContentIntegrityError extends Error {
  readonly diagnostics: readonly ValidationDiagnostic[];

  constructor(message: string, diagnostics: readonly ValidationDiagnostic[]) {
    super(message);
    this.name = 'ContentIntegrityError';
    this.diagnostics = diagnostics;
  }
}

const OFFICIAL_ID_PREFIX_PATTERN = /^(d|r|ir|fac)-[a-z0-9-]+$/i;
const VALID_MODULE_IDS = new Set(BUSINESS_MODULES_TAXONOMY.map((m) => m.id));

export function isPubliclyPublishableRecord(
  doc: Pick<KnowledgeDocument, 'metadata'>
): boolean {
  const { metadata } = doc;
  return (
    !metadata.isFixture &&
    metadata.publicationStatus === 'public' &&
    metadata.editorialStatus !== 'draft' &&
    metadata.publicationAuthorization.authorized === true
  );
}

/**
 * Validates a collection of loaded Markdown entries for schema integrity,
 * unique IDs/slugs, publication governance, taxonomy membership, URL safety,
 * deferred relative source links, translation uniqueness, relationship
 * referential integrity, and optional source manifest alignment.
 */
export function validateLoadedEntries(
  entries: readonly LoadedContentEntry[],
  options?: {
    readonly manifestEntries?: readonly SourceManifestEntry[];
  }
): ContentValidationReport {
  const errors: ValidationDiagnostic[] = [];
  const warnings: ValidationDiagnostic[] = [];
  const validDocs: KnowledgeDocument[] = [];

  for (const entry of entries) {
    if (!entry.ok) {
      for (const issue of entry.issues) {
        errors.push({
          severity: 'error',
          code: 'INVALID_FRONTMATTER',
          file: entry.sourceFileRelativePath,
          field: issue.field,
          message: issue.message,
        });
      }
      continue;
    }

    validDocs.push(entry.document);

    // Unsafe URLs inside Markdown content (fatal)
    for (const unsafeUrl of entry.unsafeUrlsFound) {
      errors.push({
        severity: 'error',
        code: 'UNSAFE_URL',
        file: entry.document.sourceFileRelativePath,
        field: 'body',
        message: `Unsafe link or image protocol/path rejected: "${unsafeUrl}"`,
      });
    }

    // Explicitly deferred relative source links or unimported local assets (non-blocking warnings)
    for (const ref of entry.document.deferredReferences) {
      warnings.push({
        severity: 'warning',
        code:
          ref.kind === 'link'
            ? 'DEFERRED_MARKDOWN_LINK'
            : 'DEFERRED_MARKDOWN_ASSET',
        file: entry.document.sourceFileRelativePath,
        field: 'body',
        message:
          ref.kind === 'link'
            ? `Relative source link "${ref.rawRef}" resolves to "${ref.normalizedSourcePath}" which is not yet published in the Knowledge Hub.`
            : `Relative source image "${ref.rawRef}" resolves to "${ref.normalizedSourcePath}" which is not yet packaged under /assets/knowledge/.`,
      });
    }
  }

  const byId = new Map<string, KnowledgeDocument>();
  const bySlug = new Map<string, KnowledgeDocument>();
  const byTranslationLang = new Map<string, string>();
  const byCollectionOrder = new Map<string, string>();

  for (const doc of validDocs) {
    const fm = doc.metadata;
    const file = doc.sourceFileRelativePath;

    // 1. Internal ID must not masquerade as an official ERP identifier
    if (OFFICIAL_ID_PREFIX_PATTERN.test(fm.id)) {
      errors.push({
        severity: 'error',
        code: 'OFFICIAL_ID_COLLISION',
        file,
        field: 'id',
        message: `Internal content ID "${fm.id}" uses an official ERP prefix (D-/R-/IR-/FAC-); use an internal Knowledge Hub ID such as kh-...`,
      });
    }

    // 2. Duplicate IDs (fatal)
    const existingById = byId.get(fm.id);
    if (existingById) {
      errors.push({
        severity: 'error',
        code: 'DUPLICATE_ID',
        file,
        field: 'id',
        message: `Duplicate content ID "${fm.id}" (already declared in ${existingById.sourceFileRelativePath})`,
      });
    } else {
      byId.set(fm.id, doc);
    }

    // 3. Duplicate canonical slugs (fatal)
    const existingBySlug = bySlug.get(fm.slug);
    if (existingBySlug) {
      errors.push({
        severity: 'error',
        code: 'DUPLICATE_SLUG',
        file,
        field: 'slug',
        message: `Duplicate canonical slug "${fm.slug}" (already declared in ${existingBySlug.sourceFileRelativePath})`,
      });
    } else {
      bySlug.set(fm.slug, doc);
    }

    // 4. Invalid status & publication authorization combinations
    if (fm.publicationStatus === 'public' && fm.editorialStatus === 'draft') {
      errors.push({
        severity: 'error',
        code: 'INVALID_STATUS_COMBINATION',
        file,
        field: 'editorialStatus',
        message: 'A draft record cannot have publicationStatus="public".',
      });
    }

    if (
      fm.publicationStatus === 'public' &&
      !fm.publicationAuthorization.authorized
    ) {
      errors.push({
        severity: 'error',
        code: 'UNAUTHORIZED_PUBLICATION',
        file,
        field: 'publicationAuthorization.authorized',
        message:
          'Record is marked publicationStatus="public" without explicit publicationAuthorization.authorized=true.',
      });
    }

    if (
      fm.classification === 'approved-decision' &&
      fm.approvalStatus !== 'approved' &&
      fm.approvalStatus !== 'superseded'
    ) {
      errors.push({
        severity: 'error',
        code: 'INCONSISTENT_APPROVAL_STATUS',
        file,
        field: 'approvalStatus',
        message:
          'Records classified as "approved-decision" must have approvalStatus="approved" or "superseded".',
      });
    }

    if (
      fm.classification === 'future' &&
      fm.approvalStatus === 'approved'
    ) {
      errors.push({
        severity: 'error',
        code: 'INCONSISTENT_APPROVAL_STATUS',
        file,
        field: 'approvalStatus',
        message:
          'KH-022: Future consideration records (classification="future") cannot have approvalStatus="approved".',
      });
    }

    // 5. Source attribution consistency
    if (
      (fm.classification === 'official' ||
        fm.classification === 'approved-decision') &&
      fm.source.kind === 'illustrative'
    ) {
      errors.push({
        severity: 'error',
        code: 'INCONSISTENT_SOURCE_ATTRIBUTION',
        file,
        field: 'source.kind',
        message:
          'Official documentation or approved decisions cannot use source.kind="illustrative".',
      });
    }

    // 6. Module taxonomy membership
    for (const moduleRef of fm.moduleRefs) {
      if (!VALID_MODULE_IDS.has(moduleRef)) {
        errors.push({
          severity: 'error',
          code: 'INVALID_TAXONOMY_REF',
          file,
          field: 'moduleRefs',
          message: `Unknown business module reference "${moduleRef}". Register it in content/taxonomy/registry.ts first.`,
        });
      }
    }

    // 7. Translation group / language collision
    if (fm.translationGroupId) {
      const key = `${fm.translationGroupId}::${fm.language}`;
      const existingTrans = byTranslationLang.get(key);
      if (existingTrans) {
        errors.push({
          severity: 'error',
          code: 'DUPLICATE_TRANSLATION_VARIANT',
          file,
          field: 'translationGroupId',
          message: `Duplicate language "${fm.language}" inside translationGroupId "${fm.translationGroupId}" (conflicts with ${existingTrans}).`,
        });
      } else {
        byTranslationLang.set(key, file);
      }
    }

    // 8. Explicit collection sequence uniqueness (scoped per language track)
    if (fm.collectionSequence) {
      const seqKey = `${fm.collectionSequence.collectionId}::${fm.language}::${fm.collectionSequence.order}`;
      const existingSeq = byCollectionOrder.get(seqKey);
      if (existingSeq) {
        errors.push({
          severity: 'error',
          code: 'DUPLICATE_COLLECTION_SEQUENCE',
          file,
          field: 'collectionSequence',
          message: `Duplicate collection sequence order ${fm.collectionSequence.order} (${fm.language}) in "${fm.collectionSequence.collectionId}" (conflicts with ${existingSeq}).`,
        });
      } else {
        byCollectionOrder.set(seqKey, file);
      }
    }
  }

  // 9. Relationship referential integrity
  for (const doc of validDocs) {
    const fm = doc.metadata;
    const file = doc.sourceFileRelativePath;
    const sourceIsPublic = isPubliclyPublishableRecord(doc);

    for (const rel of fm.relationships) {
      if (rel.targetId) {
        if (rel.targetId === fm.id) {
          errors.push({
            severity: 'error',
            code: 'SELF_RELATIONSHIP',
            file,
            field: 'relationships',
            message: `Document "${fm.id}" cannot declare a relationship pointing to itself.`,
          });
          continue;
        }

        const targetDoc = byId.get(rel.targetId);
        if (!targetDoc) {
          errors.push({
            severity: 'error',
            code: 'BROKEN_INTERNAL_REFERENCE',
            file,
            field: 'relationships',
            message: `Broken internal relationship (${rel.type}) pointing to missing content ID "${rel.targetId}".`,
          });
        } else if (sourceIsPublic && !isPubliclyPublishableRecord(targetDoc)) {
          errors.push({
            severity: 'error',
            code: 'PUBLIC_TO_UNPUBLISHED_REFERENCE',
            file,
            field: 'relationships',
            message: `Public record "${fm.id}" references unpublished internal record "${rel.targetId}".`,
          });
        }
      } else if (rel.deferredRef) {
        warnings.push({
          severity: 'warning',
          code: 'DEFERRED_REFERENCE',
          file,
          field: 'relationships',
          message: `Explicitly deferred reference (${rel.type} -> "${rel.deferredRef}") is not yet locally imported.`,
        });
      }
    }

    if (
      fm.versioning.previousRevisionId &&
      !byId.has(fm.versioning.previousRevisionId)
    ) {
      warnings.push({
        severity: 'warning',
        code: 'UNRESOLVED_PREVIOUS_REVISION',
        file,
        field: 'versioning.previousRevisionId',
        message: `Previous revision "${fm.versioning.previousRevisionId}" is not present in the local collection.`,
      });
    }
  }

  const publishedDocs = validDocs.filter(isPubliclyPublishableRecord);
  const publishedIds = new Set(publishedDocs.map((d) => d.metadata.id));

  // 10. Official Source Manifest & Mandatory Stored-Body Integrity (KH-030 — independent of raw /files copies)
  const manifestByPublishedId = new Map<string, SourceManifestEntry>();
  const manifestBySourcePath = new Map<string, SourceManifestEntry>();

  if (options?.manifestEntries) {
    const manifestReport = validateSourceManifest(
      options.manifestEntries,
      publishedIds
    );
    for (const err of manifestReport.errors) {
      errors.push({
        severity: 'error',
        code: err.code,
        file: `content/manifest/sourceManifest.ts (${err.sourceRefId})`,
        field: err.field,
        message: err.message,
      });
    }
    for (const warn of manifestReport.warnings) {
      warnings.push({
        severity: 'warning',
        code: warn.code,
        file: `content/manifest/sourceManifest.ts (${warn.sourceRefId})`,
        field: warn.field,
        message: warn.message,
      });
    }

    for (const entry of options.manifestEntries) {
      if (entry.publishedContentId) {
        manifestByPublishedId.set(entry.publishedContentId, entry);
      }
      manifestBySourcePath.set(entry.sourcePath, entry);
    }
  }

  for (const doc of validDocs) {
    if (doc.metadata.source.kind !== 'official-source') {
      continue;
    }

    const matchedManifest =
      manifestByPublishedId.get(doc.metadata.id) ??
      manifestBySourcePath.get(doc.metadata.source.sourcePath);

    const hasRecordedIntegrityDigests = Boolean(
      doc.metadata.source.storedBodySha256 || doc.metadata.source.gitBlobSha
    );

    if (matchedManifest || hasRecordedIntegrityDigests) {
      const integrityCheck = verifyStoredOfficialDocumentIntegrity(
        doc,
        matchedManifest
      );
      if (!integrityCheck.ok) {
        for (const issue of integrityCheck.issues) {
          errors.push({
            severity: 'error',
            code: issue.code,
            file: doc.sourceFileRelativePath,
            field: issue.field,
            message: issue.message,
          });
        }
      }
    } else if (options?.manifestEntries && isPubliclyPublishableRecord(doc)) {
      errors.push({
        severity: 'error',
        code: 'MISSING_STORED_BODY_DIGEST',
        file: doc.sourceFileRelativePath,
        field: 'source.storedBodySha256',
        message: `Published official-source document "${doc.metadata.id}" is neither linked to OFFICIAL_SOURCE_MANIFEST nor carrying recorded storedBodySha256/gitBlobSha integrity digests.`,
      });
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    totalFilesScanned: entries.length,
    validRecordsCount: validDocs.length,
    publishedRecordsCount: publishedDocs.length,
    unpublishedValidRecordsCount: validDocs.length - publishedDocs.length,
  };
}

export function validateApprovedCollections(
  collectionsRoot: string = CONTENT_COLLECTIONS_ROOT,
  manifestEntries: readonly SourceManifestEntry[] | undefined =
    collectionsRoot === CONTENT_COLLECTIONS_ROOT
      ? OFFICIAL_SOURCE_MANIFEST
      : undefined
): ContentValidationReport {
  const entries = loadApprovedCollections(collectionsRoot);
  return validateLoadedEntries(entries, { manifestEntries });
}
