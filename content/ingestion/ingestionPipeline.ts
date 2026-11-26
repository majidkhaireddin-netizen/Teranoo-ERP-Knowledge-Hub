import crypto from 'node:crypto';
import type { LocalizedText } from '@/content/models/types';
import type {
  DocumentLanguage,
  SourceManifestEntry,
} from '@/content/models/knowledge';
import {
  parseMarkdownDocument,
  type LoadedContentEntry,
} from '@/content/loaders/contentLoader';
import type { MarkdownLinkContext } from '@/content/loaders/relativeLinkResolver';
import type { ApprovedCollectionDir } from '@/content/taxonomy/registry';

export interface SourceIngestionEnvelopeInput {
  readonly manifestEntry: SourceManifestEntry;
  readonly internalContentId: string;
  readonly slug: string;
  readonly language: DocumentLanguage;
  readonly description: LocalizedText;
  readonly rawBodyMarkdown: string;
  readonly sourceCommitSha?: string;
  readonly sourceTreeSha?: string;
  readonly sourceDocumentDate?: string | null;
  readonly reviewDate: string;
  readonly publicationDate?: string | null;
  readonly authorizedForPublic: boolean;
  readonly authorizedBy?: string;
  readonly decisionIds?: readonly string[];
  readonly requirementIds?: readonly string[];
  readonly collectionDir?: ApprovedCollectionDir;
}

export interface PreparedIngestionArtifact {
  readonly sourceSha256: string;
  readonly canonicalMarkdown: string;
  readonly parsedEntry: LoadedContentEntry;
  readonly updatedManifestEntry: SourceManifestEntry;
}

/**
 * Computes a deterministic SHA-256 digest of a supplied source Markdown body
 * (with normalized LF line endings) for source provenance verification.
 */
export function computeSourceSha256(rawBody: string): string {
  const normalized = rawBody.replace(/\r\n/g, '\n');
  return crypto.createHash('sha256').update(normalized, 'utf8').digest('hex');
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

/**
 * Repeatable, deterministic ingestion helper (TASK-003 Section 3 & Section 8):
 * Wraps an authorized, verbatim official Markdown source body in a validated
 * YAML frontmatter envelope WITHOUT modifying or summarizing the original body.
 *
 * Publication remains explicitly gated: authorizedForPublic=false produces a
 * valid non-public record (publicationStatus='internal', editorialStatus='under-review').
 */
export function prepareCanonicalIngestionArtifact(
  input: SourceIngestionEnvelopeInput,
  linkContext: MarkdownLinkContext = {}
): PreparedIngestionArtifact {
  const sourceSha256 = computeSourceSha256(input.rawBodyMarkdown);
  const collectionDir: ApprovedCollectionDir =
    input.collectionDir ??
    (input.manifestEntry.classification === 'future'
      ? 'future'
      : input.manifestEntry.classification === 'research'
        ? 'research'
        : input.manifestEntry.classification === 'independent'
          ? 'analysis'
          : 'official');

  const isPublic = input.authorizedForPublic === true;
  const editorialStatus = isPublic ? 'published' : 'under-review';
  const publicationStatus = isPublic ? 'public' : 'internal';
  const approvalStatus =
    input.manifestEntry.classification === 'official' ||
    input.manifestEntry.classification === 'approved-decision'
      ? 'approved'
      : 'not-applicable';

  const commitLine = input.sourceCommitSha
    ? `  commitSha: ${input.sourceCommitSha}\n`
    : '';
  const treeLine = input.sourceTreeSha
    ? `  treeSha: ${input.sourceTreeSha}\n`
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

  const decisionIdsYaml =
    input.decisionIds && input.decisionIds.length > 0
      ? input.decisionIds.map((id) => `    - ${id}`).join('\n')
      : '    []';
  const requirementIdsYaml =
    input.requirementIds && input.requirementIds.length > 0
      ? input.requirementIds.map((id) => `    - ${id}`).join('\n')
      : '    []';

  const frontmatter = `---
id: ${input.internalContentId}
slug: ${input.slug}
title:
  ar: ${yamlString(input.manifestEntry.title.ar)}
  en: ${yamlString(input.manifestEntry.title.en)}
description:
  ar: ${yamlString(input.description.ar)}
  en: ${yamlString(input.description.en)}
language: ${input.language}
type: ${input.manifestEntry.expectedContentType}
classification: ${input.manifestEntry.classification}
editorialStatus: ${editorialStatus}
publicationStatus: ${publicationStatus}
approvalStatus: ${approvalStatus}
implementationStatus: not-applicable
depth: L2
journeyStages:
  - product-discovery
  - architecture
phaseRefs:
  - ${input.manifestEntry.phaseRef}
moduleRefs: []
domainRefs: []
topics:
  - governance
  - documentation
tags:
  - teranoo-erp
  - project-foundations
traceability:
  decisionIds:${input.decisionIds && input.decisionIds.length > 0 ? `\n${decisionIdsYaml}` : ' []'}
  requirementIds:${input.requirementIds && input.requirementIds.length > 0 ? `\n${requirementIdsYaml}` : ' []'}
  researchIds: []
  futureConsiderationIds: []
  independentReviewIds: []
relationships: []
source:
  kind: official-source
  repository: ${input.manifestEntry.repository}
  sourcePath: ${input.manifestEntry.sourcePath}
  sourceTitle: ${yamlString(input.manifestEntry.title.en)}
${commitLine}${treeLine}  attribution: "Teranoo ERP Official Planning Sources"
  sourceLanguage: ${input.language}
${sourceDocDateLine}  reviewDate: ${yamlString(input.reviewDate)}
${pubDateLine}publicationAuthorization:
  authorized: ${isPublic ? 'true' : 'false'}
${authorizedByLine}  completeness: complete
versioning:
  revision: 1
  sourceVersion: ${yamlString(input.sourceCommitSha ?? input.sourceTreeSha ?? `sha256-${sourceSha256.slice(0, 12)}`)}
  lastVerifiedDate: ${yamlString(input.reviewDate)}
---

`;

  const canonicalMarkdown = `${frontmatter}${input.rawBodyMarkdown.replace(/^\n+/, '')}`;

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
      input.sourceCommitSha ?? input.sourceTreeSha ?? input.manifestEntry.sourceRevision ?? null,
    sourceFileHash: sourceSha256,
    importStatus: !parsedEntry.ok
      ? 'rejected'
      : isPublic
        ? 'published'
        : 'validated',
    publicationAuthorizationStatus: isPublic ? 'authorized' : 'pending',
    publishedContentId: parsedEntry.ok && isPublic ? input.internalContentId : null,
    completeness: parsedEntry.ok ? 'complete' : input.manifestEntry.completeness,
    availableLanguages: parsedEntry.ok ? [input.language] : [],
    sourceVerificationStatus: 'hash-verified',
  };

  return {
    sourceSha256,
    canonicalMarkdown,
    parsedEntry,
    updatedManifestEntry,
  };
}
