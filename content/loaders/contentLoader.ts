import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  APPROVED_COLLECTION_DIRS,
  type ApprovedCollectionDir,
} from '@/content/taxonomy/registry';
import type { KnowledgeDocument, KnowledgeRecordMetadata } from '@/content/models/knowledge';
import { frontmatterSchema } from '@/content/schemas/frontmatterSchema';
import { renderSafeMarkdown } from '@/content/loaders/markdownPipeline';

export class ContentPathSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ContentPathSecurityError';
  }
}

export const CONTENT_COLLECTIONS_ROOT = path.resolve(
  process.cwd(),
  'content',
  'collections'
);

export const CONTENT_FIXTURES_ROOT = path.resolve(
  process.cwd(),
  'content',
  'fixtures'
);

/**
 * Resolves a relative path strictly within an approved base directory.
 * Prevents path traversal (..), null bytes, and access outside baseDir.
 */
export function resolveSafeContentPath(
  baseDir: string,
  relativePath: string
): string {
  if (!relativePath || relativePath.includes('\0')) {
    throw new ContentPathSecurityError('Invalid content file path');
  }

  const normalizedBase = path.resolve(baseDir);
  const resolved = path.resolve(normalizedBase, relativePath);

  if (
    resolved !== normalizedBase &&
    !resolved.startsWith(normalizedBase + path.sep)
  ) {
    throw new ContentPathSecurityError(
      `Path traversal attempt blocked: ${relativePath}`
    );
  }

  return resolved;
}

export interface LoadedContentFailure {
  readonly ok: false;
  readonly sourceFileRelativePath: string;
  readonly collection: ApprovedCollectionDir | 'fixtures';
  readonly issues: readonly { field: string; message: string }[];
}

export interface LoadedContentSuccess {
  readonly ok: true;
  readonly document: KnowledgeDocument;
  readonly unsafeUrlsFound: readonly string[];
}

export type LoadedContentEntry = LoadedContentSuccess | LoadedContentFailure;

/**
 * Parses and validates a single Markdown document with YAML-only frontmatter.
 * JavaScript frontmatter execution engines are explicitly disabled.
 */
export function parseMarkdownDocument(
  rawContent: string,
  options: {
    sourceFileRelativePath: string;
    collection: ApprovedCollectionDir | 'fixtures';
    isFixture: boolean;
  }
): LoadedContentEntry {
  let parsedMatter: matter.GrayMatterFile<string>;
  try {
    parsedMatter = matter(rawContent, {
      language: 'yaml',
      engines: {
        js: () => {
          throw new Error('JavaScript frontmatter execution is prohibited');
        },
        javascript: () => {
          throw new Error('JavaScript frontmatter execution is prohibited');
        },
      },
    });
  } catch (err) {
    return {
      ok: false,
      sourceFileRelativePath: options.sourceFileRelativePath,
      collection: options.collection,
      issues: [
        {
          field: 'frontmatter',
          message:
            err instanceof Error ? err.message : 'Failed to parse YAML frontmatter',
        },
      ],
    };
  }

  const validation = frontmatterSchema.safeParse(parsedMatter.data);
  if (!validation.success) {
    return {
      ok: false,
      sourceFileRelativePath: options.sourceFileRelativePath,
      collection: options.collection,
      issues: validation.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? issue.path.join('.') : 'frontmatter',
        message: issue.message,
      })),
    };
  }

  const fm = validation.data;
  const rendered = renderSafeMarkdown(parsedMatter.content);

  const metadata: KnowledgeRecordMetadata = {
    id: fm.id,
    slug: fm.slug,
    title: fm.title,
    subtitle: fm.subtitle,
    description: fm.description,
    language: fm.language,
    translationGroupId: fm.translationGroupId,
    type: fm.type,
    classification: fm.classification,
    editorialStatus: fm.editorialStatus,
    publicationStatus: fm.publicationStatus,
    approvalStatus: fm.approvalStatus,
    implementationStatus: fm.implementationStatus,
    depth: fm.depth,
    journeyStages: fm.journeyStages,
    phaseRefs: fm.phaseRefs,
    moduleRefs: fm.moduleRefs,
    domainRefs: fm.domainRefs,
    topics: fm.topics,
    tags: fm.tags,
    traceability: fm.traceability,
    relationships: fm.relationships,
    source: fm.source,
    publicationAuthorization: fm.publicationAuthorization,
    versioning: fm.versioning,
    collectionSequence: fm.collectionSequence,
    collection: options.collection,
    isFixture: options.isFixture,
  };

  return {
    ok: true,
    unsafeUrlsFound: rendered.unsafeUrlsFound,
    document: {
      metadata,
      bodyMarkdown: parsedMatter.content,
      renderedHtml: rendered.html,
      headings: rendered.headings,
      readingTimeMinutes: rendered.readingTimeMinutes,
      sourceFileRelativePath: options.sourceFileRelativePath,
    },
  };
}

function collectMarkdownFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

/**
 * Loads Markdown documents exclusively from approved collection directories.
 * Never loads test fixtures or arbitrary paths outside content/collections.
 */
export function loadApprovedCollections(
  collectionsRoot: string = CONTENT_COLLECTIONS_ROOT
): readonly LoadedContentEntry[] {
  const results: LoadedContentEntry[] = [];
  const normalizedRoot = path.resolve(collectionsRoot);

  for (const collection of APPROVED_COLLECTION_DIRS) {
    const collectionDir = resolveSafeContentPath(normalizedRoot, collection);
    const mdFiles = collectMarkdownFiles(collectionDir);

    for (const filePath of mdFiles) {
      const relativeFromRoot = path.relative(normalizedRoot, filePath);
      const safePath = resolveSafeContentPath(normalizedRoot, relativeFromRoot);
      const raw = fs.readFileSync(safePath, 'utf8');

      results.push(
        parseMarkdownDocument(raw, {
          sourceFileRelativePath: path.join('content/collections', relativeFromRoot),
          collection,
          isFixture: false,
        })
      );
    }
  }

  return results;
}

/**
 * Loads deterministic test fixtures strictly for automated test suites.
 * Fixtures are always marked isFixture: true and excluded from production registries.
 */
export function loadTestFixtures(
  fixturesRoot: string = CONTENT_FIXTURES_ROOT
): readonly LoadedContentEntry[] {
  const results: LoadedContentEntry[] = [];
  const normalizedRoot = path.resolve(fixturesRoot);
  const mdFiles = collectMarkdownFiles(normalizedRoot);

  for (const filePath of mdFiles) {
    const relativeFromRoot = path.relative(normalizedRoot, filePath);
    const safePath = resolveSafeContentPath(normalizedRoot, relativeFromRoot);
    const raw = fs.readFileSync(safePath, 'utf8');

    results.push(
      parseMarkdownDocument(raw, {
        sourceFileRelativePath: path.join('content/fixtures', relativeFromRoot),
        collection: 'fixtures',
        isFixture: true,
      })
    );
  }

  return results;
}
