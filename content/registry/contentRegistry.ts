import type { ContentClassificationType } from '@/content/models/types';
import type {
  CollectionNeighbors,
  ContentCompleteness,
  DocumentLanguage,
  KnowledgeDocument,
  KnowledgeRecordMetadata,
  ResolvedRelationship,
} from '@/content/models/knowledge';
import type {
  ApprovedCollectionDir,
  ContentTypeId,
  ControlledTopicId,
  EditorialStatus,
  JourneyStageId,
  KnowledgeDepth,
  OfficialApprovalStatus,
  PlatformDomainId,
} from '@/content/taxonomy/registry';
import {
  CONTENT_COLLECTIONS_ROOT,
  loadApprovedCollections,
} from '@/content/loaders/contentLoader';
import {
  ContentIntegrityError,
  isPubliclyPublishableRecord,
  validateLoadedEntries,
  type ValidationDiagnostic,
} from '@/content/validators/contentValidator';
import { OFFICIAL_SOURCE_MANIFEST } from '@/content/manifest/sourceManifest';

export interface KnowledgeFilterCriteria {
  readonly query?: string;
  readonly type?: ContentTypeId | 'all';
  readonly classification?: ContentClassificationType | 'all';
  readonly editorialStatus?: EditorialStatus | 'all';
  readonly approvalStatus?: OfficialApprovalStatus | 'all';
  readonly phaseRef?: string | 'all';
  readonly moduleRef?: string | 'all';
  readonly domainRef?: PlatformDomainId | 'all';
  readonly topic?: ControlledTopicId | 'all';
  readonly language?: DocumentLanguage | 'all';
  readonly depth?: KnowledgeDepth | 'all';
  readonly journeyStage?: JourneyStageId | 'all';
}

export interface ContentRegistryStats {
  /** Total published language records (e.g. Arabic + English variants). */
  readonly totalPublished: number;
  /** Unique conceptual topics counting linked translation pairs as one topic. */
  readonly uniqueConceptualTopics: number;
  /** Published records with source.kind="official-source" and completeness="complete". */
  readonly officialImportedCount: number;
  /** Number of distinct collection directories containing at least one published record. */
  readonly activeCollectionsCount: number;
  readonly byCollection: Partial<Record<ApprovedCollectionDir, number>>;
  readonly byCompleteness: Partial<Record<ContentCompleteness, number>>;
  readonly byClassification: Partial<Record<ContentClassificationType, number>>;
  readonly byType: Partial<Record<ContentTypeId, number>>;
  readonly byLanguage: Partial<Record<DocumentLanguage, number>>;
}

export interface ContentRegistry {
  getAllPublicDocuments(): readonly KnowledgeDocument[];
  getAllPublicMetadata(): readonly KnowledgeRecordMetadata[];
  getById(id: string): KnowledgeDocument | null;
  getBySlug(slug: string): KnowledgeDocument | null;
  getByOfficialId(officialId: string): readonly KnowledgeRecordMetadata[];
  filter(criteria: KnowledgeFilterCriteria): readonly KnowledgeRecordMetadata[];
  getRelationships(id: string): {
    readonly outgoing: readonly ResolvedRelationship[];
    readonly incoming: readonly ResolvedRelationship[];
  };
  getTranslations(id: string): readonly KnowledgeRecordMetadata[];
  getRevisions(id: string): readonly KnowledgeRecordMetadata[];
  getCollectionNeighbors(id: string): CollectionNeighbors;
  getStats(): ContentRegistryStats;
}

/**
 * Pure Content Registry factory.
 *
 * Integrity & Publication Boundary guarantees:
 * 1. Duplicate content IDs or duplicate canonical slugs throw ContentIntegrityError
 *    and NEVER silently overwrite one another.
 * 2. Valid records that are intentionally unpublished (draft, internal/private,
 *    or publicationAuthorization.authorized=false) and test fixtures are cleanly
 *    excluded from every public lookup, filter, relationship, and metadata index.
 */
export function createContentRegistry(
  documents: readonly KnowledgeDocument[]
): ContentRegistry {
  // Enforce global ID and slug uniqueness across all supplied documents
  const seenIds = new Map<string, string>();
  const seenSlugs = new Map<string, string>();
  const integrityErrors: ValidationDiagnostic[] = [];

  for (const doc of documents) {
    const prevIdFile = seenIds.get(doc.metadata.id);
    if (prevIdFile) {
      integrityErrors.push({
        severity: 'error',
        code: 'DUPLICATE_ID',
        file: doc.sourceFileRelativePath,
        field: 'id',
        message: `Duplicate content ID "${doc.metadata.id}" (already declared in ${prevIdFile})`,
      });
    } else {
      seenIds.set(doc.metadata.id, doc.sourceFileRelativePath);
    }

    const prevSlugFile = seenSlugs.get(doc.metadata.slug);
    if (prevSlugFile) {
      integrityErrors.push({
        severity: 'error',
        code: 'DUPLICATE_SLUG',
        file: doc.sourceFileRelativePath,
        field: 'slug',
        message: `Duplicate canonical slug "${doc.metadata.slug}" (already declared in ${prevSlugFile})`,
      });
    } else {
      seenSlugs.set(doc.metadata.slug, doc.sourceFileRelativePath);
    }
  }

  if (integrityErrors.length > 0) {
    throw new ContentIntegrityError(
      `Content Registry integrity failure: ${integrityErrors.map((e) => e.message).join('; ')}`,
      integrityErrors
    );
  }

  const publicDocs = documents
    .filter(isPubliclyPublishableRecord)
    .sort((a, b) => a.metadata.id.localeCompare(b.metadata.id));

  const byId = new Map<string, KnowledgeDocument>();
  const bySlug = new Map<string, KnowledgeDocument>();

  for (const doc of publicDocs) {
    byId.set(doc.metadata.id, doc);
    bySlug.set(doc.metadata.slug, doc);
  }

  const publicMetadata = publicDocs.map((doc) => doc.metadata);

  function getById(id: string): KnowledgeDocument | null {
    return byId.get(id) ?? null;
  }

  function getBySlug(slug: string): KnowledgeDocument | null {
    return bySlug.get(slug) ?? null;
  }

  function getByOfficialId(
    officialId: string
  ): readonly KnowledgeRecordMetadata[] {
    const normalized = officialId.trim().toLowerCase();
    if (!normalized) return [];

    return publicMetadata.filter((meta) => {
      const refs = [
        meta.traceability.officialDocumentId ?? '',
        ...meta.traceability.decisionIds,
        ...meta.traceability.requirementIds,
        ...meta.traceability.researchIds,
        ...meta.traceability.futureConsiderationIds,
        ...meta.traceability.independentReviewIds,
      ];
      return refs.some((ref) => ref.toLowerCase() === normalized);
    });
  }

  function filter(
    criteria: KnowledgeFilterCriteria
  ): readonly KnowledgeRecordMetadata[] {
    const normalizedQuery = criteria.query?.trim().toLowerCase() ?? '';

    return publicMetadata.filter((meta) => {
      if (criteria.type && criteria.type !== 'all' && meta.type !== criteria.type) {
        return false;
      }
      if (
        criteria.classification &&
        criteria.classification !== 'all' &&
        meta.classification !== criteria.classification
      ) {
        return false;
      }
      if (
        criteria.editorialStatus &&
        criteria.editorialStatus !== 'all' &&
        meta.editorialStatus !== criteria.editorialStatus
      ) {
        return false;
      }
      if (
        criteria.approvalStatus &&
        criteria.approvalStatus !== 'all' &&
        meta.approvalStatus !== criteria.approvalStatus
      ) {
        return false;
      }
      if (
        criteria.phaseRef &&
        criteria.phaseRef !== 'all' &&
        !meta.phaseRefs.includes(criteria.phaseRef)
      ) {
        return false;
      }
      if (
        criteria.moduleRef &&
        criteria.moduleRef !== 'all' &&
        !meta.moduleRefs.includes(criteria.moduleRef)
      ) {
        return false;
      }
      if (
        criteria.domainRef &&
        criteria.domainRef !== 'all' &&
        !meta.domainRefs.includes(criteria.domainRef)
      ) {
        return false;
      }
      if (
        criteria.topic &&
        criteria.topic !== 'all' &&
        !meta.topics.includes(criteria.topic)
      ) {
        return false;
      }
      if (
        criteria.language &&
        criteria.language !== 'all' &&
        meta.language !== criteria.language
      ) {
        return false;
      }
      if (
        criteria.depth &&
        criteria.depth !== 'all' &&
        meta.depth !== criteria.depth
      ) {
        return false;
      }
      if (
        criteria.journeyStage &&
        criteria.journeyStage !== 'all' &&
        !meta.journeyStages.includes(criteria.journeyStage)
      ) {
        return false;
      }

      if (normalizedQuery) {
        const haystack = [
          meta.id,
          meta.slug,
          meta.title.ar,
          meta.title.en,
          meta.subtitle?.ar ?? '',
          meta.subtitle?.en ?? '',
          meta.description.ar,
          meta.description.en,
          meta.type,
          meta.classification,
          ...meta.topics,
          ...meta.tags,
          ...meta.moduleRefs,
          ...meta.domainRefs,
          ...meta.phaseRefs,
          meta.traceability.officialDocumentId ?? '',
          ...meta.traceability.decisionIds,
          ...meta.traceability.requirementIds,
          ...meta.traceability.researchIds,
          ...meta.traceability.futureConsiderationIds,
          ...meta.traceability.independentReviewIds,
        ]
          .join(' ')
          .toLowerCase();

        if (!haystack.includes(normalizedQuery)) {
          return false;
        }
      }

      return true;
    });
  }

  function getRelationships(id: string): {
    readonly outgoing: readonly ResolvedRelationship[];
    readonly incoming: readonly ResolvedRelationship[];
  } {
    const sourceDoc = byId.get(id);
    if (!sourceDoc) {
      return { outgoing: [], incoming: [] };
    }

    const outgoing: ResolvedRelationship[] = sourceDoc.metadata.relationships.map(
      (rel) => {
        if (rel.targetId) {
          const target = byId.get(rel.targetId);
          if (target) {
            return {
              type: rel.type,
              direction: 'outgoing',
              status: 'resolved',
              targetId: target.metadata.id,
              targetSlug: target.metadata.slug,
              targetTitle: target.metadata.title,
              targetClassification: target.metadata.classification,
              customLabel: rel.label,
            };
          }
          return {
            type: rel.type,
            direction: 'outgoing',
            status: 'missing',
            targetId: rel.targetId,
            customLabel: rel.label,
          };
        }

        if (rel.externalUrl) {
          return {
            type: rel.type,
            direction: 'outgoing',
            status: 'external',
            externalUrl: rel.externalUrl,
            customLabel: rel.label,
          };
        }

        return {
          type: rel.type,
          direction: 'outgoing',
          status: 'deferred',
          deferredRef: rel.deferredRef,
          customLabel: rel.label,
        };
      }
    );

    const incoming: ResolvedRelationship[] = [];
    for (const candidate of publicDocs) {
      if (candidate.metadata.id === id) continue;
      for (const rel of candidate.metadata.relationships) {
        if (rel.targetId === id) {
          incoming.push({
            type: rel.type,
            direction: 'incoming',
            status: 'resolved',
            targetId: candidate.metadata.id,
            targetSlug: candidate.metadata.slug,
            targetTitle: candidate.metadata.title,
            targetClassification: candidate.metadata.classification,
            customLabel: rel.label,
          });
        }
      }
    }

    return { outgoing, incoming };
  }

  function getTranslations(id: string): readonly KnowledgeRecordMetadata[] {
    const doc = byId.get(id);
    if (!doc || !doc.metadata.translationGroupId) return [];

    return publicMetadata.filter(
      (meta) =>
        meta.id !== id &&
        meta.translationGroupId === doc.metadata.translationGroupId
    );
  }

  function getRevisions(id: string): readonly KnowledgeRecordMetadata[] {
    const doc = byId.get(id);
    if (!doc) return [];

    const relatedIds = new Set<string>();
    if (doc.metadata.versioning.previousRevisionId) {
      relatedIds.add(doc.metadata.versioning.previousRevisionId);
    }
    if (doc.metadata.versioning.supersedesId) {
      relatedIds.add(doc.metadata.versioning.supersedesId);
    }

    for (const candidate of publicMetadata) {
      if (
        candidate.versioning.previousRevisionId === id ||
        candidate.versioning.supersedesId === id
      ) {
        relatedIds.add(candidate.id);
      }
    }

    return publicMetadata
      .filter((meta) => relatedIds.has(meta.id))
      .sort((a, b) => a.versioning.revision - b.versioning.revision);
  }

  function getCollectionNeighbors(id: string): CollectionNeighbors {
    const doc = byId.get(id);
    const seq = doc?.metadata.collectionSequence;
    if (!doc || !seq) {
      return { previous: null, next: null };
    }

    const sameCollection = publicMetadata
      .filter(
        (meta) =>
          meta.collectionSequence?.collectionId === seq.collectionId &&
          meta.language === doc.metadata.language
      )
      .sort(
        (a, b) =>
          (a.collectionSequence?.order ?? 0) -
          (b.collectionSequence?.order ?? 0)
      );

    const currentIdx = sameCollection.findIndex((meta) => meta.id === id);
    if (currentIdx === -1) {
      return { previous: null, next: null };
    }

    return {
      previous: sameCollection[currentIdx - 1] ?? null,
      next: sameCollection[currentIdx + 1] ?? null,
    };
  }

  function getStats(): ContentRegistryStats {
    const byClassification: Partial<Record<ContentClassificationType, number>> = {};
    const byType: Partial<Record<ContentTypeId, number>> = {};
    const byLanguage: Partial<Record<DocumentLanguage, number>> = {};
    const byCollection: Partial<Record<ApprovedCollectionDir, number>> = {};
    const byCompleteness: Partial<Record<ContentCompleteness, number>> = {};
    const conceptualTopicKeys = new Set<string>();
    let officialImportedCount = 0;

    for (const meta of publicMetadata) {
      byClassification[meta.classification] =
        (byClassification[meta.classification] ?? 0) + 1;
      byType[meta.type] = (byType[meta.type] ?? 0) + 1;
      byLanguage[meta.language] = (byLanguage[meta.language] ?? 0) + 1;
      if (meta.collection !== 'fixtures') {
        byCollection[meta.collection] =
          (byCollection[meta.collection] ?? 0) + 1;
      }
      const comp = meta.publicationAuthorization.completeness;
      byCompleteness[comp] = (byCompleteness[comp] ?? 0) + 1;

      conceptualTopicKeys.add(meta.translationGroupId ?? meta.id);

      if (meta.source.kind === 'official-source' && comp === 'complete') {
        officialImportedCount += 1;
      }
    }

    return {
      totalPublished: publicMetadata.length,
      uniqueConceptualTopics: conceptualTopicKeys.size,
      officialImportedCount,
      activeCollectionsCount: Object.keys(byCollection).length,
      byCollection,
      byCompleteness,
      byClassification,
      byType,
      byLanguage,
    };
  }

  return {
    getAllPublicDocuments: () => publicDocs,
    getAllPublicMetadata: () => publicMetadata,
    getById,
    getBySlug,
    getByOfficialId,
    filter,
    getRelationships,
    getTranslations,
    getRevisions,
    getCollectionNeighbors,
    getStats,
  };
}

let cachedServerRegistry: ContentRegistry | null = null;

/**
 * Controlled server-side registry accessor.
 * Validates all loaded collection entries before building the registry:
 * - Fatal integrity errors (invalid frontmatter, duplicate IDs/slugs, unsafe URLs,
 *   broken internal links, unauthorized public records) throw ContentIntegrityError
 *   and are NEVER silently discarded.
 * - Valid intentionally-unpublished documents remain excluded from public outputs.
 */
export function getContentRegistry(
  collectionsRoot: string = CONTENT_COLLECTIONS_ROOT
): ContentRegistry {
  if (
    collectionsRoot === CONTENT_COLLECTIONS_ROOT &&
    cachedServerRegistry !== null
  ) {
    return cachedServerRegistry;
  }

  const entries = loadApprovedCollections(collectionsRoot);
  const validation = validateLoadedEntries(entries, {
    manifestEntries:
      collectionsRoot === CONTENT_COLLECTIONS_ROOT
        ? OFFICIAL_SOURCE_MANIFEST
        : undefined,
  });

  if (!validation.ok) {
    const summary = validation.errors
      .map((e) => `[${e.code}] ${e.file} (${e.field}): ${e.message}`)
      .join('\n');
    throw new ContentIntegrityError(
      `Content integrity validation failed with ${validation.errors.length} fatal error(s):\n${summary}`,
      validation.errors
    );
  }

  const validDocs: KnowledgeDocument[] = [];
  for (const entry of entries) {
    if (entry.ok) {
      validDocs.push(entry.document);
    }
  }

  const registry = createContentRegistry(validDocs);
  if (collectionsRoot === CONTENT_COLLECTIONS_ROOT) {
    cachedServerRegistry = registry;
  }
  return registry;
}

export function resetContentRegistryCache(): void {
  cachedServerRegistry = null;
}
