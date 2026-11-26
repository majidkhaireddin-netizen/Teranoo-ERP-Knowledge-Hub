import type {
  ContentClassificationType,
  LocalizedText,
  ProjectReferenceSnapshot,
  SearchableItem,
} from '@/content/models/types';
import type { KnowledgeRecordMetadata } from '@/content/models/knowledge';
import { PROJECT_REFERENCE_SNAPSHOT } from '@/content/seed/projectSnapshot';
import { buildSearchIndex } from '@/content/repositories/projectRepository';
import {
  BUSINESS_MODULES_TAXONOMY,
  CONTROLLED_TOPICS,
  getContentTypeDefinition,
  getTaxonomyLabel,
} from '@/content/taxonomy/registry';

export interface KnowledgeSearchEntry {
  readonly id: string;
  readonly href: string;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly category: 'navigation' | 'module' | 'capability' | 'decision' | 'document';
  readonly classification: ContentClassificationType;
  readonly code?: string;
  readonly searchTokens: readonly string[];
}

export function knowledgeRecordToSearchEntry(
  record: KnowledgeRecordMetadata
): KnowledgeSearchEntry {
  const typeDef = getContentTypeDefinition(record.type);
  const topicLabels = record.topics.flatMap((topic) => {
    const label = getTaxonomyLabel(CONTROLLED_TOPICS, topic);
    return label ? [topic, label.ar, label.en] : [topic];
  });
  const moduleLabels = record.moduleRefs.flatMap((mod) => {
    const label = getTaxonomyLabel(BUSINESS_MODULES_TAXONOMY, mod);
    return label ? [mod, label.ar, label.en] : [mod];
  });

  const primaryOfficialCode =
    record.traceability.decisionIds[0] ??
    record.traceability.requirementIds[0] ??
    record.traceability.officialDocumentId ??
    undefined;

  return {
    id: `doc-${record.id}`,
    href: `/knowledge/${record.slug}`,
    title: record.title,
    subtitle: record.description,
    category: 'document',
    classification: record.classification,
    code: primaryOfficialCode,
    searchTokens: [
      record.id,
      record.slug,
      record.type,
      typeDef?.label.ar ?? '',
      typeDef?.label.en ?? '',
      record.classification,
      record.language,
      ...topicLabels,
      ...record.tags,
      ...moduleLabels,
      ...record.domainRefs,
      ...record.phaseRefs,
      record.traceability.officialDocumentId ?? '',
      ...record.traceability.decisionIds,
      ...record.traceability.requirementIds,
      ...record.traceability.researchIds,
      ...record.traceability.futureConsiderationIds,
      ...record.traceability.independentReviewIds,
    ].filter(Boolean),
  };
}

function baseItemToSearchEntry(item: SearchableItem): KnowledgeSearchEntry {
  return {
    ...item,
    searchTokens: [item.code ?? '', item.href].filter(Boolean),
  };
}

/**
 * Combines published Content Registry metadata with existing TASK-001 navigation
 * and snapshot search items. Only explicitly published, non-fixture records
 * should ever be passed into publishedRecords.
 */
export function buildUnifiedSearchIndex(
  publishedRecords: readonly KnowledgeRecordMetadata[],
  snapshot: ProjectReferenceSnapshot = PROJECT_REFERENCE_SNAPSHOT
): readonly KnowledgeSearchEntry[] {
  const safePublished = publishedRecords.filter(
    (rec) =>
      !rec.isFixture &&
      rec.publicationStatus === 'public' &&
      rec.editorialStatus !== 'draft' &&
      rec.publicationAuthorization.authorized === true
  );

  const documentEntries = safePublished.map(knowledgeRecordToSearchEntry);
  const baseEntries = buildSearchIndex(snapshot).map(baseItemToSearchEntry);

  // Place exact published knowledge documents first so canonical document routes take precedence
  return [...documentEntries, ...baseEntries];
}

export function searchUnifiedKnowledge(
  query: string,
  index: readonly KnowledgeSearchEntry[]
): readonly KnowledgeSearchEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return index.slice(0, 12);
  }

  return index.filter((item) => {
    const haystack = [
      item.title.ar,
      item.title.en,
      item.subtitle.ar,
      item.subtitle.en,
      item.code ?? '',
      item.href,
      ...item.searchTokens,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
