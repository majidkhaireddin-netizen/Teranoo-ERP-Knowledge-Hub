import crypto from 'node:crypto';
import type { LocalizedText } from '@/content/models/types';
import type {
  CollectionSequenceInfo,
  ContentRelationship,
  DocumentLanguage,
  KnowledgeDocument,
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

// ============================================================================
// KH-030 (FIX-02-R03) — Mandatory Canonical Stored-Body Integrity Verification
// ============================================================================

export interface StoredBodyIntegrityIssue {
  readonly code:
    | 'MISSING_STORED_BODY_DIGEST'
    | 'MISSING_RAW_SOURCE_DIGEST'
    | 'MISSING_GIT_BLOB_SHA'
    | 'MISSING_SOURCE_REVISION'
    | 'STORED_BODY_DIGEST_MISMATCH'
    | 'STORED_BODY_GIT_BLOB_MISMATCH'
    | 'STORED_BODY_REVISION_MISMATCH'
    | 'STORED_BODY_CRLF_DRIFT';
  readonly field: string;
  readonly message: string;
}

export interface StoredBodyIntegrityVerificationResult {
  readonly ok: boolean;
  /** (1) Original received-byte SHA-256 recorded at ingestion time (before CRLF -> LF). */
  readonly recordedRawSourceSha256: string | null;
  /** (2) Canonical LF-normalized source SHA-256 recorded in OFFICIAL_SOURCE_MANIFEST. */
  readonly manifestSourceFileHash: string | null;
  /** (3) Stored canonical document-body SHA-256 recorded in frontmatter vs recomputed now. */
  readonly recordedStoredBodySha256: string | null;
  readonly actualStoredBodySha256: string;
  /** (4) Reproducible Git blob SHA-1 recorded vs recomputed directly from stored canonical body bytes. */
  readonly expectedGitBlobSha: string | null;
  readonly recordedGitBlobSha: string | null;
  readonly actualStoredGitBlobSha1: string;
  readonly issues: readonly StoredBodyIntegrityIssue[];
}

/**
 * Extracts the exact canonical stored Markdown body from a `gray-matter` parsed body string.
 *
 * Documented Permitted Normalization Rules (KH-030):
 * 1. At ingestion time only: lossless Windows CRLF (`\r\n`) -> LF (`\n`) conversion is recorded
 *    explicitly (`lineEndingNormalization: 'crlf-to-lf'`, preserving `rawSourceSha256` separately
 *    from `storedBodySha256` / `sourceFileHash`).
 * 2. At validation time: `prepareCanonicalIngestionArtifact()` emits `---\n<yaml>\n---\n\n<body>`,
 *    so `gray-matter` retains the single envelope separator newline (`\n`) immediately following
 *    the closing `---` delimiter. Only that exact single leading separator `\n` is stripped.
 * 3. PROHIBITED: `.trim()`, trailing-newline stripping, whitespace collapsing, or silent CRLF
 *    conversion at validation time — any substantive or whitespace edit to the stored body
 *    changes the canonical byte sequence and fails SHA-256 and Git blob SHA-1 verification.
 */
export function extractCanonicalStoredBody(parsedBodyMarkdown: string): string {
  return parsedBodyMarkdown.startsWith('\n')
    ? parsedBodyMarkdown.slice(1)
    : parsedBodyMarkdown;
}

/**
 * Computes the exact SHA-256 digest of a stored canonical document body after stripping
 * only the single YAML frontmatter envelope separator newline (no `.trim()`).
 */
export function computeCanonicalStoredBodySha256(
  parsedBodyMarkdown: string
): string {
  const canonicalBody = extractCanonicalStoredBody(parsedBodyMarkdown);
  return computeRawBytesSha256(Buffer.from(canonicalBody, 'utf8'));
}

/**
 * Verifies a stored official KnowledgeDocument body directly against its recorded
 * frontmatter digests and (when linked) its OFFICIAL_SOURCE_MANIFEST entry —
 * completely independent of raw attachment copies under `/files/`.
 *
 * KH-035: Missing required source revision, Git blob identity, raw source digest, or
 * canonical stored-body digest MUST fail validation rather than bypass verification.
 */
export function verifyStoredOfficialDocumentIntegrity(
  doc: Pick<KnowledgeDocument, 'metadata' | 'bodyMarkdown'>,
  manifestEntry?: SourceManifestEntry
): StoredBodyIntegrityVerificationResult {
  const issues: StoredBodyIntegrityIssue[] = [];
  const source = doc.metadata.source;

  const canonicalBody = extractCanonicalStoredBody(doc.bodyMarkdown);
  const canonicalBytes = Buffer.from(canonicalBody, 'utf8');
  const actualStoredBodySha256 = computeRawBytesSha256(canonicalBytes);
  const actualStoredGitBlobSha1 = computeGitBlobSha1(canonicalBytes);

  const recordedRawSourceSha256 =
    source.kind === 'official-source' ? (source.rawSourceSha256 ?? null) : null;
  const recordedStoredBodySha256 =
    source.kind === 'official-source' ? (source.storedBodySha256 ?? null) : null;
  const recordedGitBlobSha =
    source.kind === 'official-source' ? (source.gitBlobSha ?? null) : null;
  const recordedCommitSha =
    source.kind === 'official-source' ? (source.commitSha ?? null) : null;

  const manifestSourceFileHash = manifestEntry?.sourceFileHash ?? null;
  const manifestRawSourceSha256 = manifestEntry?.rawSourceSha256 ?? null;
  const manifestSourceRevision = manifestEntry?.sourceRevision ?? null;
  const manifestExpectedGitBlobSha = manifestEntry?.expectedGitBlobSha ?? null;
  const manifestActualGitBlobSha = manifestEntry?.actualGitBlobSha ?? null;
  const expectedGitBlobSha = manifestExpectedGitBlobSha ?? recordedGitBlobSha;

  // Reject unexpected CRLF line endings inside canonical LF-stored official files
  if (canonicalBody.includes('\r\n')) {
    issues.push({
      code: 'STORED_BODY_CRLF_DRIFT',
      field: 'body',
      message:
        'Canonical stored official document body contains CRLF (\\r\\n) line endings; canonical published files must remain LF-only.',
    });
  }

  // KH-035: Mandatory frontmatter provenance fields on official-source documents
  if (!recordedCommitSha) {
    issues.push({
      code: 'MISSING_SOURCE_REVISION',
      field: 'source.commitSha',
      message: `Official-source document "${doc.metadata.id}" is missing required frontmatter source.commitSha.`,
    });
  }
  if (!recordedGitBlobSha) {
    issues.push({
      code: 'MISSING_GIT_BLOB_SHA',
      field: 'source.gitBlobSha',
      message: `Official-source document "${doc.metadata.id}" is missing required frontmatter source.gitBlobSha.`,
    });
  }
  if (!recordedRawSourceSha256) {
    issues.push({
      code: 'MISSING_RAW_SOURCE_DIGEST',
      field: 'source.rawSourceSha256',
      message: `Official-source document "${doc.metadata.id}" is missing required frontmatter source.rawSourceSha256.`,
    });
  }
  if (!recordedStoredBodySha256) {
    issues.push({
      code: 'MISSING_STORED_BODY_DIGEST',
      field: 'source.storedBodySha256',
      message: `Official-source document "${doc.metadata.id}" is missing required frontmatter source.storedBodySha256.`,
    });
  }

  // KH-035: Mandatory manifest provenance alignment when linked to a manifest entry
  if (manifestEntry) {
    if (!manifestSourceRevision) {
      issues.push({
        code: 'MISSING_SOURCE_REVISION',
        field: 'manifest.sourceRevision',
        message: `Manifest entry "${manifestEntry.sourceRefId}" is missing required sourceRevision.`,
      });
    }
    if (!manifestExpectedGitBlobSha) {
      issues.push({
        code: 'MISSING_GIT_BLOB_SHA',
        field: 'manifest.expectedGitBlobSha',
        message: `Manifest entry "${manifestEntry.sourceRefId}" is missing required expectedGitBlobSha.`,
      });
    }
    if (!manifestActualGitBlobSha) {
      issues.push({
        code: 'MISSING_GIT_BLOB_SHA',
        field: 'manifest.actualGitBlobSha',
        message: `Manifest entry "${manifestEntry.sourceRefId}" is missing required actualGitBlobSha.`,
      });
    }
    if (!manifestRawSourceSha256) {
      issues.push({
        code: 'MISSING_RAW_SOURCE_DIGEST',
        field: 'manifest.rawSourceSha256',
        message: `Manifest entry "${manifestEntry.sourceRefId}" is missing required rawSourceSha256.`,
      });
    }
    if (!manifestSourceFileHash) {
      issues.push({
        code: 'MISSING_STORED_BODY_DIGEST',
        field: 'manifest.sourceFileHash',
        message: `Manifest entry "${manifestEntry.sourceRefId}" is missing required canonical sourceFileHash.`,
      });
    }

    if (
      recordedStoredBodySha256 &&
      manifestSourceFileHash &&
      recordedStoredBodySha256 !== manifestSourceFileHash
    ) {
      issues.push({
        code: 'STORED_BODY_DIGEST_MISMATCH',
        field: 'source.storedBodySha256',
        message: `Frontmatter source.storedBodySha256 (${recordedStoredBodySha256}) does not match OFFICIAL_SOURCE_MANIFEST sourceFileHash (${manifestSourceFileHash}).`,
      });
    }
    if (
      recordedRawSourceSha256 &&
      manifestRawSourceSha256 &&
      recordedRawSourceSha256 !== manifestRawSourceSha256
    ) {
      issues.push({
        code: 'STORED_BODY_DIGEST_MISMATCH',
        field: 'source.rawSourceSha256',
        message: `Frontmatter source.rawSourceSha256 (${recordedRawSourceSha256}) does not match OFFICIAL_SOURCE_MANIFEST rawSourceSha256 (${manifestRawSourceSha256}).`,
      });
    }
    if (
      manifestSourceRevision &&
      recordedCommitSha &&
      recordedCommitSha !== manifestSourceRevision
    ) {
      issues.push({
        code: 'STORED_BODY_REVISION_MISMATCH',
        field: 'source.commitSha',
        message: `Frontmatter source.commitSha (${recordedCommitSha}) does not match manifest sourceRevision (${manifestSourceRevision}).`,
      });
    }
    if (
      manifestExpectedGitBlobSha &&
      recordedGitBlobSha &&
      recordedGitBlobSha !== manifestExpectedGitBlobSha
    ) {
      issues.push({
        code: 'STORED_BODY_GIT_BLOB_MISMATCH',
        field: 'source.gitBlobSha',
        message: `Frontmatter source.gitBlobSha (${recordedGitBlobSha}) does not match manifest expectedGitBlobSha (${manifestExpectedGitBlobSha}).`,
      });
    }
    if (
      manifestExpectedGitBlobSha &&
      manifestActualGitBlobSha &&
      manifestActualGitBlobSha !== manifestExpectedGitBlobSha
    ) {
      issues.push({
        code: 'STORED_BODY_GIT_BLOB_MISMATCH',
        field: 'manifest.actualGitBlobSha',
        message: `Manifest actualGitBlobSha (${manifestActualGitBlobSha}) does not match expectedGitBlobSha (${manifestExpectedGitBlobSha}).`,
      });
    }
  }

  // Verify recomputed stored body SHA-256 against frontmatter recorded digest
  if (
    recordedStoredBodySha256 &&
    actualStoredBodySha256 !== recordedStoredBodySha256
  ) {
    issues.push({
      code: 'STORED_BODY_DIGEST_MISMATCH',
      field: 'body',
      message: `Stored canonical document body SHA-256 (${actualStoredBodySha256}) does not match recorded source.storedBodySha256 (${recordedStoredBodySha256}). Official source bodies must not be modified in place.`,
    });
  }

  // Verify recomputed stored body SHA-256 against manifest canonical sourceFileHash
  if (
    manifestSourceFileHash &&
    actualStoredBodySha256 !== manifestSourceFileHash
  ) {
    issues.push({
      code: 'STORED_BODY_DIGEST_MISMATCH',
      field: 'body',
      message: `Stored canonical document body SHA-256 (${actualStoredBodySha256}) does not match OFFICIAL_SOURCE_MANIFEST sourceFileHash (${manifestSourceFileHash}).`,
    });
  }

  // Verify reproducible Git blob SHA-1 against expectedGitBlobSha & recorded frontmatter gitBlobSha
  if (expectedGitBlobSha && actualStoredGitBlobSha1 !== expectedGitBlobSha) {
    issues.push({
      code: 'STORED_BODY_GIT_BLOB_MISMATCH',
      field: 'body',
      message: `Recomputed Git blob SHA-1 (${actualStoredGitBlobSha1}) from stored canonical body does not match expected Git blob SHA (${expectedGitBlobSha}).`,
    });
  }
  if (recordedGitBlobSha && actualStoredGitBlobSha1 !== recordedGitBlobSha) {
    issues.push({
      code: 'STORED_BODY_GIT_BLOB_MISMATCH',
      field: 'source.gitBlobSha',
      message: `Recomputed Git blob SHA-1 (${actualStoredGitBlobSha1}) from stored canonical body does not match frontmatter source.gitBlobSha (${recordedGitBlobSha}).`,
    });
  }

  return {
    ok: issues.length === 0,
    recordedRawSourceSha256,
    manifestSourceFileHash,
    recordedStoredBodySha256,
    actualStoredBodySha256,
    expectedGitBlobSha,
    recordedGitBlobSha,
    actualStoredGitBlobSha1,
    issues,
  };
}

