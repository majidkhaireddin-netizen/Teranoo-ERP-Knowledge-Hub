import crypto from 'node:crypto';
import type { LocalizedText } from '@/content/models/types';
import type {
  CollectionSequenceInfo,
  ContentRelationship,
  DocumentLanguage,
  LineEndingNormalization,
  SourceManifestEntry,
  SourceVerificationStatus,
} from '@/content/models/knowledge';
import type {
  ApprovedCollectionDir,
  ControlledTopicId,
  JourneyStageId,
  KnowledgeDepth,
  OfficialApprovalStatus,
  PlatformDomainId,
} from '@/content/taxonomy/registry';
import {
  parseMarkdownDocument,
  type LoadedContentEntry,
} from '@/content/loaders/contentLoader';
import type { MarkdownLinkContext } from '@/content/loaders/relativeLinkResolver';

export interface SourceIntegrityVerificationResult {
  readonly rawByteLength: number;
  readonly normalizedLfByteLength: number;
  readonly crlfCount: number;
  readonly lineEndingNormalization: LineEndingNormalization;
  readonly rawSha256: string;
  readonly normalizedLfSha256: string;
  readonly rawGitBlobSha1: string;
  readonly normalizedLfGitBlobSha1: string;
  readonly expectedGitBlobSha: string | null;
  readonly matchedGitBlobSha: string | null;
  readonly verificationStatus: SourceVerificationStatus;
}

export interface SourceIngestionEnvelopeInput {
  readonly manifestEntry: SourceManifestEntry;
  readonly internalContentId: string;
  readonly slug: string;
  readonly language: DocumentLanguage;
  readonly sourceLanguage?: DocumentLanguage;
  readonly subtitle?: LocalizedText;
  readonly description: LocalizedText;
  readonly rawBodyMarkdown: string;
  /** Optional raw original bytes as received from the source before any UTF-8/line-ending normalization. */
  readonly rawSourceBytes?: Buffer;
  /** Explicit official approval status supplied from verified source evidence (KH-022: never inferred from classification). */
  readonly approvalStatus: OfficialApprovalStatus;
  readonly expectedGitBlobSha?: string | null;
  readonly sourceCommitSha?: string;
  readonly sourceTreeSha?: string;
  readonly sourceDocumentDate?: string | null;
  readonly reviewDate: string;
  readonly publicationDate?: string | null;
  readonly authorizedForPublic: boolean;
  readonly authorizedBy?: string;
  readonly scopeNote?: LocalizedText;
  readonly interpretationNote?: LocalizedText;
  readonly depth?: KnowledgeDepth;
  readonly journeyStages?: readonly JourneyStageId[];
  readonly phaseRefs?: readonly string[];
  readonly moduleRefs?: readonly string[];
  readonly domainRefs?: readonly PlatformDomainId[];
  readonly topics?: readonly ControlledTopicId[];
  readonly tags?: readonly string[];
  readonly decisionIds?: readonly string[];
  readonly requirementIds?: readonly string[];
  readonly futureConsiderationIds?: readonly string[];
  readonly relationships?: readonly ContentRelationship[];
  readonly supersedesId?: string;
  readonly collectionSequence?: CollectionSequenceInfo;
  readonly collectionDir?: ApprovedCollectionDir;
  /** When true (default) and expectedGitBlobSha is supplied, a mismatch rejects publication. */
  readonly rejectOnGitBlobMismatch?: boolean;
}

export interface PreparedIngestionArtifact {
  readonly integrity: SourceIntegrityVerificationResult;
  /** Stored LF-normalized body SHA-256 digest. */
  readonly sourceSha256: string;
  /** Original received raw bytes SHA-256 digest (distinct when CRLF -> LF normalization occurred). */
  readonly rawSourceSha256: string;
  readonly canonicalMarkdown: string;
  readonly parsedEntry: LoadedContentEntry;
  readonly updatedManifestEntry: SourceManifestEntry;
}

/**
 * Computes a SHA-256 digest of exact raw bytes without any transformation.
 */
export function computeRawBytesSha256(bytes: Buffer): string {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

/**
 * Computes a deterministic SHA-256 digest of a supplied source Markdown body
 * after normalizing CRLF line endings to LF (stored canonical body digest).
 */
export function computeSourceSha256(rawBody: string): string {
  const normalized = rawBody.replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

/**
 * Computes an exact Git blob SHA-1 using Git's object hashing specification:
 *   SHA1("blob " + byteLength + "\0" + bytes)
 */
export function computeGitBlobSha1(bytes: Buffer): string {
  const header = Buffer.from(`blob ${bytes.byteLength}\0`, 'utf8');
  return crypto.createHash('sha1').update(header).update(bytes).digest('hex');
}

/**
 * Verifies source identity and integrity against an optional trusted Git blob SHA (KH-021).
 *
 * Strictly distinguishes:
 * - digest-calculated: local SHA-256/blob digests calculated, but no trusted expected Git blob SHA supplied.
 * - git-blob-verified: raw received bytes match the trusted Git blob SHA byte-for-byte.
 * - git-blob-verified-lf-normalized: received bytes used Windows CRLF line endings and match the trusted
 *   Git blob SHA byte-for-byte after lossless CRLF -> LF canonicalization (explicitly recorded).
 * - git-blob-mismatch: neither raw bytes nor LF-normalized bytes match the trusted Git blob SHA.
 */
export function verifySourceIntegrity(
  rawInput: Buffer | string,
  expectedGitBlobSha?: string | null
): SourceIntegrityVerificationResult {
  const rawBytes = Buffer.isBuffer(rawInput)
    ? rawInput
    : Buffer.from(rawInput, 'utf8');
  const rawText = rawBytes.toString('utf8');
  const crlfMatches = rawText.match(/\r\n/g);
  const crlfCount = crlfMatches ? crlfMatches.length : 0;
  const normalizedText = crlfCount > 0 ? rawText.replace(/\r\n/g, '\n') : rawText;
  const normalizedBytes = Buffer.from(normalizedText, 'utf8');

  const rawSha256 = computeRawBytesSha256(rawBytes);
  const normalizedLfSha256 = computeRawBytesSha256(normalizedBytes);
  const rawGitBlobSha1 = computeGitBlobSha1(rawBytes);
  const normalizedLfGitBlobSha1 = computeGitBlobSha1(normalizedBytes);

  const expected = expectedGitBlobSha?.trim().toLowerCase() || null;

  let verificationStatus: SourceVerificationStatus;
  let matchedGitBlobSha: string | null = null;

  if (!expected) {
    verificationStatus = 'digest-calculated';
  } else if (rawGitBlobSha1 === expected) {
    verificationStatus = 'git-blob-verified';
    matchedGitBlobSha = rawGitBlobSha1;
  } else if (crlfCount > 0 && normalizedLfGitBlobSha1 === expected) {
    verificationStatus = 'git-blob-verified-lf-normalized';
    matchedGitBlobSha = normalizedLfGitBlobSha1;
  } else {
    verificationStatus = 'git-blob-mismatch';
  }

  return {
    rawByteLength: rawBytes.byteLength,
    normalizedLfByteLength: normalizedBytes.byteLength,
    crlfCount,
    lineEndingNormalization: crlfCount > 0 ? 'crlf-to-lf' : 'none',
    rawSha256,
    normalizedLfSha256,
    rawGitBlobSha1,
    normalizedLfGitBlobSha1,
    expectedGitBlobSha: expected,
    matchedGitBlobSha,
    verificationStatus,
  };
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function yamlStringArray(items: readonly string[], indent = '  '): string {
  if (items.length === 0) return ' []';
  return '\n' + items.map((item) => `${indent}- ${item}`).join('\n');
}

function yamlRelationships(relationships: readonly ContentRelationship[]): string {
  if (relationships.length === 0) return ' []';
  const blocks = relationships.map((rel) => {
    const lines = [`  - type: ${rel.type}`];
    if (rel.targetId) lines.push(`    targetId: ${rel.targetId}`);
    if (rel.externalUrl) lines.push(`    externalUrl: ${yamlString(rel.externalUrl)}`);
    if (rel.deferredRef) lines.push(`    deferredRef: ${yamlString(rel.deferredRef)}`);
    if (rel.label) {
      lines.push(`    label:`);
      lines.push(`      ar: ${yamlString(rel.label.ar)}`);
      lines.push(`      en: ${yamlString(rel.label.en)}`);
    }
    return lines.join('\n');
  });
  return '\n' + blocks.join('\n');
}

/**
 * Repeatable, deterministic ingestion helper (TASK-003 + KH-021/KH-022):
 * Wraps an authorized, verbatim official Markdown source body in a validated
 * YAML frontmatter envelope WITHOUT modifying or summarizing the original body.
 *
 * Governance guarantees:
 * - KH-021: Distinguishes local digest calculation from trusted Git blob SHA verification
 *   and records both raw source SHA-256 and LF-normalized stored body SHA-256.
 * - KH-022: Official approvalStatus MUST be supplied explicitly from verified source evidence;
 *   it is never inferred from content classification.
 * - Publication remains explicitly gated on authorizedForPublic === true AND non-mismatched integrity.
 */
export function prepareCanonicalIngestionArtifact(
  input: SourceIngestionEnvelopeInput,
  linkContext: MarkdownLinkContext = {}
): PreparedIngestionArtifact {
  const expectedBlob =
    input.expectedGitBlobSha !== undefined
      ? input.expectedGitBlobSha
      : input.manifestEntry.expectedGitBlobSha ?? null;

  const integrity = verifySourceIntegrity(
    input.rawSourceBytes ?? input.rawBodyMarkdown,
    expectedBlob
  );

  const rejectOnMismatch = input.rejectOnGitBlobMismatch !== false;
  const hasBlockingMismatch =
    rejectOnMismatch && integrity.verificationStatus === 'git-blob-mismatch';

  const collectionDir: ApprovedCollectionDir =
    input.collectionDir ??
    (input.manifestEntry.classification === 'future'
      ? 'future'
      : input.manifestEntry.classification === 'research'
        ? 'research'
        : input.manifestEntry.classification === 'independent'
          ? 'analysis'
          : 'official');

  const isPublic = input.authorizedForPublic === true && !hasBlockingMismatch;
  const editorialStatus = isPublic ? 'published' : 'under-review';
  const publicationStatus = isPublic ? 'public' : 'internal';

  const commitLine = input.sourceCommitSha
    ? `  commitSha: ${input.sourceCommitSha}\n`
    : '';
  const treeLine = input.sourceTreeSha
    ? `  treeSha: ${input.sourceTreeSha}\n`
    : '';
  const gitBlobLine = integrity.matchedGitBlobSha
    ? `  gitBlobSha: ${integrity.matchedGitBlobSha}\n`
    : '';
  const authorizedByLine = input.authorizedBy
    ? `  authorizedBy: ${yamlString(input.authorizedBy)}\n`
    : '';
  const pubDateLine =
    isPublic && input.publicationDate
      ? `  publicationDate: ${yamlString(input.publicationDate)}\n`
      : `  publicationDate: null\n`;
  const sourceDocDateLine = input.sourceDocumentDate
    ? `  sourceDocumentDate: ${yamlString(input.sourceDocumentDate)}\n`
    : `  sourceDocumentDate: null\n`;

  const subtitleBlock = input.subtitle
    ? `subtitle:\n  ar: ${yamlString(input.subtitle.ar)}\n  en: ${yamlString(input.subtitle.en)}\n`
    : '';

  const scopeNoteBlock = input.scopeNote
    ? `  scopeNote:\n    ar: ${yamlString(input.scopeNote.ar)}\n    en: ${yamlString(input.scopeNote.en)}\n`
    : '';

  const interpretationNoteBlock = input.interpretationNote
    ? `  interpretationNote:\n    ar: ${yamlString(input.interpretationNote.ar)}\n    en: ${yamlString(input.interpretationNote.en)}\n`
    : '';

  const supersedesLine = input.supersedesId
    ? `  supersedesId: ${input.supersedesId}\n`
    : '';

  const sequenceBlock = input.collectionSequence
    ? `collectionSequence:\n  collectionId: ${input.collectionSequence.collectionId}\n  order: ${input.collectionSequence.order}\n`
    : '';

  const journeyStages = input.journeyStages ?? ['product-discovery', 'architecture'];
  const phaseRefs = input.phaseRefs ?? [input.manifestEntry.phaseRef];
  const moduleRefs = input.moduleRefs ?? [];
  const domainRefs = input.domainRefs ?? [];
  const topics = input.topics ?? ['governance', 'documentation'];
  const tags = input.tags ?? ['teranoo-erp', 'project-foundations'];
  const decisionIds = input.decisionIds ?? [];
  const requirementIds = input.requirementIds ?? [];
  const futureConsiderationIds = input.futureConsiderationIds ?? [];
  const relationships = input.relationships ?? [];

  const frontmatter = `---
id: ${input.internalContentId}
slug: ${input.slug}
title:
  ar: ${yamlString(input.manifestEntry.title.ar)}
  en: ${yamlString(input.manifestEntry.title.en)}
${subtitleBlock}description:
  ar: ${yamlString(input.description.ar)}
  en: ${yamlString(input.description.en)}
language: ${input.language}
type: ${input.manifestEntry.expectedContentType}
classification: ${input.manifestEntry.classification}
editorialStatus: ${editorialStatus}
publicationStatus: ${publicationStatus}
approvalStatus: ${input.approvalStatus}
implementationStatus: not-applicable
depth: ${input.depth ?? 'L2'}
journeyStages:${yamlStringArray(journeyStages)}
phaseRefs:${yamlStringArray(phaseRefs)}
moduleRefs:${yamlStringArray(moduleRefs)}
domainRefs:${yamlStringArray(domainRefs)}
topics:${yamlStringArray(topics)}
tags:${yamlStringArray(tags)}
traceability:
  decisionIds:${yamlStringArray(decisionIds, '    ')}
  requirementIds:${yamlStringArray(requirementIds, '    ')}
  researchIds: []
  futureConsiderationIds:${yamlStringArray(futureConsiderationIds, '    ')}
  independentReviewIds: []
relationships:${yamlRelationships(relationships)}
source:
  kind: official-source
  repository: ${input.manifestEntry.repository}
  sourcePath: ${input.manifestEntry.sourcePath}
  sourceTitle: ${yamlString(input.manifestEntry.title.en)}
${commitLine}${treeLine}${gitBlobLine}  rawSourceSha256: ${integrity.rawSha256}
  storedBodySha256: ${integrity.normalizedLfSha256}
  verificationStatus: ${integrity.verificationStatus}
  lineEndingNormalization: ${integrity.lineEndingNormalization}
${interpretationNoteBlock}  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: ${input.sourceLanguage ?? input.language}
${sourceDocDateLine}  reviewDate: ${yamlString(input.reviewDate)}
${pubDateLine}publicationAuthorization:
  authorized: ${isPublic ? 'true' : 'false'}
${authorizedByLine}${scopeNoteBlock}  completeness: complete
versioning:
  revision: 1
  sourceVersion: ${yamlString(input.sourceCommitSha ?? input.sourceTreeSha ?? `sha256-${integrity.normalizedLfSha256.slice(0, 12)}`)}
${supersedesLine}  lastVerifiedDate: ${yamlString(input.reviewDate)}
${sequenceBlock}---

`;

  // Preserve the complete original Markdown body verbatim (LF-normalized for POSIX storage, documented above)
  const normalizedBody = input.rawBodyMarkdown.replace(/\r\n/g, '\n');
  const canonicalMarkdown = `${frontmatter}${normalizedBody}`;

  const parsedEntry = parseMarkdownDocument(canonicalMarkdown, {
    sourceFileRelativePath: `content/collections/${collectionDir}/${input.slug}.${input.language}.md`,
    collection: collectionDir,
    isFixture: false,
    linkContext: {
      ...linkContext,
      currentSourcePath: input.manifestEntry.sourcePath,
    },
  });

  const updatedManifestEntry: SourceManifestEntry = {
    ...input.manifestEntry,
    sourceRevision:
      input.sourceCommitSha ??
      input.sourceTreeSha ??
      input.manifestEntry.sourceRevision ??
      null,
    expectedGitBlobSha: integrity.expectedGitBlobSha,
    actualGitBlobSha:
      integrity.matchedGitBlobSha ?? integrity.normalizedLfGitBlobSha1,
    rawSourceSha256: integrity.rawSha256,
    sourceFileHash: integrity.normalizedLfSha256,
    lineEndingNormalization: integrity.lineEndingNormalization,
    importStatus:
      hasBlockingMismatch || !parsedEntry.ok
        ? 'rejected'
        : isPublic
          ? 'published'
          : 'validated',
    publicationAuthorizationStatus: isPublic ? 'authorized' : 'pending',
    publishedContentId:
      !hasBlockingMismatch && parsedEntry.ok && isPublic
        ? input.internalContentId
        : null,
    completeness:
      !hasBlockingMismatch && parsedEntry.ok
        ? 'complete'
        : input.manifestEntry.completeness,
    availableLanguages:
      !hasBlockingMismatch && parsedEntry.ok ? [input.language] : [],
    sourceVerificationStatus: integrity.verificationStatus,
  };

  return {
    integrity,
    sourceSha256: integrity.normalizedLfSha256,
    rawSourceSha256: integrity.rawSha256,
    canonicalMarkdown,
    parsedEntry,
    updatedManifestEntry,
  };
}
