import type { ContentClassificationType, LocalizedText } from '@/content/models/types';
import type {
  ApprovedCollectionDir,
  ContentTypeId,
  ControlledTopicId,
  EditorialStatus,
  ImplementationStatus,
  JourneyStageId,
  KnowledgeDepth,
  OfficialApprovalStatus,
  PlatformDomainId,
  PublicationStatus,
  RelationshipTypeId,
} from '@/content/taxonomy/registry';

export type DocumentLanguage = 'ar' | 'en' | 'mixed';

export type ContentCompleteness = 'complete' | 'excerpt' | 'reference-summary';

export interface PublicationAuthorization {
  readonly authorized: boolean;
  readonly authorizedBy?: string;
  readonly scopeNote?: LocalizedText;
  readonly completeness: ContentCompleteness;
}

interface SourceProvenanceBase {
  readonly attribution: string;
  readonly sourceLanguage?: DocumentLanguage;
  readonly sourceDocumentDate?: string | null;
  readonly reviewDate?: string | null;
  readonly publicationDate?: string | null;
  readonly copyrightNotice?: string;
}

export type LineEndingNormalization = 'none' | 'crlf-to-lf';

export interface OfficialSourceProvenance extends SourceProvenanceBase {
  readonly kind: 'official-source';
  readonly repository: string;
  readonly sourcePath: string;
  readonly sourceTitle?: string;
  readonly commitSha?: string;
  readonly treeSha?: string;
  readonly gitBlobSha?: string;
  readonly rawSourceSha256?: string;
  readonly storedBodySha256?: string;
  readonly verificationStatus?: SourceVerificationStatus;
  readonly lineEndingNormalization?: LineEndingNormalization;
  readonly interpretationNote?: LocalizedText;
}

export interface SnapshotDerivedProvenance extends SourceProvenanceBase {
  readonly kind: 'snapshot-derived';
  readonly repository: string;
  readonly sourcePaths: readonly string[];
  readonly sourceTitle?: string;
  readonly treeSha: string;
}

export interface KnowledgeHubAuthoredProvenance extends SourceProvenanceBase {
  readonly kind: 'knowledge-hub-authored';
  readonly publisher: string;
}

export interface ExternalReferenceProvenance extends SourceProvenanceBase {
  readonly kind: 'external-reference';
  readonly publisher: string;
  readonly sourceUrl: string;
  readonly sourceTitle: string;
}

export interface IllustrativeSourceProvenance extends SourceProvenanceBase {
  readonly kind: 'illustrative';
  readonly disclaimer?: LocalizedText;
}

export type SourceProvenanceRecord =
  | OfficialSourceProvenance
  | SnapshotDerivedProvenance
  | KnowledgeHubAuthoredProvenance
  | ExternalReferenceProvenance
  | IllustrativeSourceProvenance;

export interface ContentRelationship {
  readonly type: RelationshipTypeId;
  readonly targetId?: string;
  readonly externalUrl?: string;
  readonly deferredRef?: string;
  readonly label?: LocalizedText;
}

export interface ContentRevisionInfo {
  readonly revision: number;
  readonly sourceVersion?: string;
  readonly previousRevisionId?: string;
  readonly supersedesId?: string;
  readonly lastVerifiedDate?: string | null;
  readonly correctionNote?: LocalizedText;
}

export interface CollectionSequenceInfo {
  readonly collectionId: string;
  readonly order: number;
}

export interface OfficialTraceabilityRefs {
  readonly officialDocumentId?: string;
  readonly decisionIds: readonly string[];
  readonly requirementIds: readonly string[];
  readonly researchIds: readonly string[];
  readonly futureConsiderationIds: readonly string[];
  readonly independentReviewIds: readonly string[];
}

/**
 * Compact, serializable knowledge record metadata.
 * Safely passed to client catalogs and search indexes without document bodies.
 */
export interface KnowledgeRecordMetadata {
  readonly id: string;
  readonly slug: string;
  readonly title: LocalizedText;
  readonly subtitle?: LocalizedText;
  readonly description: LocalizedText;
  readonly language: DocumentLanguage;
  readonly translationGroupId?: string;

  readonly type: ContentTypeId;
  readonly classification: ContentClassificationType;
  readonly editorialStatus: EditorialStatus;
  readonly publicationStatus: PublicationStatus;
  readonly approvalStatus: OfficialApprovalStatus;
  readonly implementationStatus: ImplementationStatus;
  readonly depth?: KnowledgeDepth;

  readonly journeyStages: readonly JourneyStageId[];
  readonly phaseRefs: readonly string[];
  readonly moduleRefs: readonly string[];
  readonly domainRefs: readonly PlatformDomainId[];
  readonly topics: readonly ControlledTopicId[];
  readonly tags: readonly string[];

  readonly traceability: OfficialTraceabilityRefs;
  readonly relationships: readonly ContentRelationship[];
  readonly source: SourceProvenanceRecord;
  readonly publicationAuthorization: PublicationAuthorization;
  readonly versioning: ContentRevisionInfo;
  readonly collectionSequence?: CollectionSequenceInfo;

  readonly collection: ApprovedCollectionDir | 'fixtures';
  readonly isFixture: boolean;
}

export interface RenderedHeading {
  readonly id: string;
  readonly title: string;
  readonly level: 2 | 3;
}

export interface DeferredMarkdownReference {
  readonly kind: 'link' | 'asset';
  readonly rawRef: string;
  readonly normalizedSourcePath: string;
  readonly fragment?: string;
}

export interface KnowledgeDocument {
  readonly metadata: KnowledgeRecordMetadata;
  readonly bodyMarkdown: string;
  readonly renderedHtml: string;
  readonly headings: readonly RenderedHeading[];
  readonly deferredReferences: readonly DeferredMarkdownReference[];
  readonly readingTimeMinutes: number;
  readonly sourceFileRelativePath: string;
}

export interface ResolvedRelationship {
  readonly type: RelationshipTypeId;
  readonly direction: 'outgoing' | 'incoming';
  readonly status: 'resolved' | 'deferred' | 'external' | 'missing';
  readonly targetId?: string;
  readonly targetSlug?: string;
  readonly targetTitle?: LocalizedText;
  readonly targetClassification?: ContentClassificationType;
  readonly externalUrl?: string;
  readonly deferredRef?: string;
  readonly customLabel?: LocalizedText;
}

export interface CollectionNeighbors {
  readonly previous: KnowledgeRecordMetadata | null;
  readonly next: KnowledgeRecordMetadata | null;
}

/**
 * Source Inventory & Import Manifest contracts (TASK-003 Sections 5–7).
 * Strictly separates source import status from official ERP approval status.
 */
export type SourceImportStatus =
  | 'expected'
  | 'awaiting-source'
  | 'source-received'
  | 'validated'
  | 'imported'
  | 'published'
  | 'rejected';

export type SourceAuthorizationStatus =
  | 'pending'
  | 'authorized'
  | 'restricted';

export type SourceVerificationStatus =
  | 'path-verified-awaiting-body'
  | 'source-received'
  | 'digest-calculated'
  | 'git-blob-verified'
  | 'git-blob-verified-lf-normalized'
  | 'git-blob-mismatch'
  | 'unverified';

export type SourceCompletenessStatus =
  | 'not-imported'
  | 'reference-summary-only'
  | 'excerpt'
  | 'complete';

export interface SourceManifestEntry {
  readonly sourceRefId: string;
  readonly batchId?: string;
  readonly repository: string;
  readonly sourcePath: string;
  readonly title: LocalizedText;
  readonly purpose: LocalizedText;
  readonly sourceRevision?: string | null;
  readonly expectedGitBlobSha?: string | null;
  readonly actualGitBlobSha?: string | null;
  readonly rawSourceSha256?: string | null;
  readonly sourceFileHash?: string | null;
  readonly lineEndingNormalization?: LineEndingNormalization;
  readonly classification: ContentClassificationType;
  readonly expectedContentType: ContentTypeId;
  readonly phaseRef: string;
  readonly importStatus: SourceImportStatus;
  readonly publicationAuthorizationStatus: SourceAuthorizationStatus;
  readonly publishedContentId: string | null;
  readonly referenceSummaryContentId?: string | null;
  readonly completeness: SourceCompletenessStatus;
  readonly availableLanguages: readonly DocumentLanguage[];
  readonly sourceVerificationStatus: SourceVerificationStatus;
  readonly authorityNote?: LocalizedText;
}

export interface SourceManifestSummary {
  readonly totalSources: number;
  readonly expectedCount: number;
  readonly awaitingSourceCount: number;
  readonly sourceReceivedCount: number;
  readonly validatedCount: number;
  readonly importedCount: number;
  readonly publishedCount: number;
  readonly rejectedCount: number;
}

export interface SourceReadinessReport {
  readonly generatedFromManifest: string;
  readonly officialRepository: string;
  readonly summary: SourceManifestSummary;
  readonly awaitingDelivery: readonly {
    readonly sourceRefId: string;
    readonly sourcePath: string;
    readonly expectedContentType: ContentTypeId;
    readonly phaseRef: string;
    readonly importStatus: SourceImportStatus;
  }[];
  readonly readyForPublicDisplay: readonly string[];
}

/**
 * Reusable foundation structures for future full Roadmap and Decision Register
 * ingestion (TASK-003 Sections 11 & 13).
 */
export interface DecisionRegisterEntryModel {
  readonly decisionId: string;
  readonly title: LocalizedText;
  readonly owningPhase: string;
  readonly classification: ContentClassificationType;
  readonly status: OfficialApprovalStatus;
  readonly sourceDocumentPath: string;
  readonly primaryImpact?: LocalizedText;
  readonly relatedDecisions: readonly string[];
  readonly relatedRequirements: readonly string[];
  readonly rationale?: LocalizedText;
  readonly canonicalHref?: string;
}

/**
 * Lightweight future specialized extension contracts (Section 18).
 * Not populated with fabricated records; allows typed viewer extensions
 * without redesigning KnowledgeRecordMetadata.
 */
export interface ScreenSpecificationExtension {
  readonly kind: 'screen-specification';
  readonly screenCode?: string;
  readonly moduleRef: string;
  readonly fieldCount?: number;
}

export interface DataModelExtension {
  readonly kind: 'data-model';
  readonly schemaScope: string;
  readonly entityNames: readonly string[];
}

export interface EngineeringJournalExtension {
  readonly kind: 'engineering-journal';
  readonly projectScope: 'teranoo-erp';
  readonly workItemRef?: string;
  readonly verifiedCommits?: readonly string[];
}

export interface TestSpecificationExtension {
  readonly kind: 'test-record';
  readonly executionStatus: 'not-executed' | 'passed' | 'failed' | 'blocked';
  readonly requirementRefs: readonly string[];
}

export type SpecializedContentExtension =
  | ScreenSpecificationExtension
  | DataModelExtension
  | EngineeringJournalExtension
  | TestSpecificationExtension;
