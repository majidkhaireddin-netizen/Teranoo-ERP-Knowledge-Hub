import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type {
  DeferredMarkdownReference,
  RenderedHeading,
} from '@/content/models/knowledge';
import {
  resolveMarkdownImage,
  resolveMarkdownLink,
  type MarkdownLinkContext,
} from '@/content/loaders/relativeLinkResolver';

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

export const HEADING_ID_PREFIX = 'kh-h-';

/**
 * Generates deterministic, Unicode-safe heading slugs supporting Arabic,
 * English, and mixed-language headings.
 */
export function createHeadingSlug(text: string): string {
  const cleaned = text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned || 'section';
}

/**
 * Allocates a globally unique, DOM-clobbering-safe heading ID within a document.
 * Handles direct duplicates AND collisions with explicit numeric suffixes
 * (e.g. "Example", "Example", "Example-2", "Example" -> unique IDs every time).
 */
export function allocateUniqueHeadingId(
  baseSlug: string,
  usedIds: Set<string>
): string {
  const prefixedBase = `${HEADING_ID_PREFIX}${baseSlug}`;
  if (!usedIds.has(prefixedBase)) {
    usedIds.add(prefixedBase);
    return prefixedBase;
  }

  let suffix = 2;
  while (usedIds.has(`${prefixedBase}-${suffix}`)) {
    suffix += 1;
  }

  const candidate = `${prefixedBase}-${suffix}`;
  usedIds.add(candidate);
  return candidate;
}

function extractText(node: HastNode): string {
  if (node.type === 'text' && typeof node.value === 'string') {
    return node.value;
  }
  if (Array.isArray(node.children)) {
    return node.children.map(extractText).join('');
  }
  return '';
}

function walkTree(
  node: HastNode,
  visitor: (child: HastNode, index: number, parent: HastNode) => void
) {
  if (!Array.isArray(node.children)) return;
  for (let i = 0; i < node.children.length; i += 1) {
    const child = node.children[i];
    if (!child) continue;
    visitor(child, i, node);
    walkTree(child, visitor);
  }
}

/**
 * Strict HTML sanitization schema:
 * - Disallows raw HTML passthrough (allowDangerousHtml: false)
 * - Uses an explicit non-empty clobberPrefix ('kh-user-') so neither GFM
 *   footnotes nor user attributes can clobber window/document globals.
 * - Preserves relative href/src attributes strictly for post-sanitize
 *   validation and resolution through resolveMarkdownLink/resolveMarkdownImage.
 */
const STRICT_SANITIZE_SCHEMA = {
  ...defaultSchema,
  tagNames: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'strong',
    'em',
    'del',
    'blockquote',
    'ul',
    'ol',
    'li',
    'pre',
    'code',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'a',
    'img',
    'div',
    'span',
    'sup',
    'sub',
    'section',
  ],
  attributes: {
    '*': ['id', 'dir', 'lang'],
    a: [
      'href',
      'title',
      'ariaDescribedBy',
      'dataFootnoteRef',
      'dataFootnoteBackref',
      'ariaLabel',
    ],
    img: ['src', 'alt', 'title'],
    div: ['className'],
    section: ['className', 'dataFootnotes'],
    th: ['align'],
    td: ['align'],
    code: ['className'],
  },
  protocols: {
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
  clobberPrefix: 'kh-user-',
};

export interface MarkdownRenderResult {
  readonly html: string;
  readonly headings: readonly RenderedHeading[];
  readonly unsafeUrlsFound: readonly string[];
  readonly deferredReferences: readonly DeferredMarkdownReference[];
  readonly readingTimeMinutes: number;
}

export function estimateReadingTimeMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_`>|[\]()-]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 180));
}

/**
 * Safely renders Markdown into sanitized HTML:
 * 1. Parses GFM Markdown with allowDangerousHtml: false.
 * 2. Inspects raw href/src pre-sanitization to capture unsafe URL schemes
 *    (javascript:, data:, vbscript:, traversal) and resolve relative source links.
 * 3. Runs rehype-sanitize with strict allowlist and DOM-clobbering prefix.
 * 4. Post-sanitization assigns globally unique kh-h-* heading IDs matching TOC
 *    entries 1:1, resolves same-document fragments, enforces safe external link
 *    attributes, and wraps tables in .kh-table-wrap.
 */
export function renderSafeMarkdown(
  markdown: string,
  linkContext: MarkdownLinkContext = {}
): MarkdownRenderResult {
  const headings: RenderedHeading[] = [];
  const usedHeadingIds = new Set<string>();
  const baseSlugToFirstId = new Map<string, string>();
  const unsafeUrlsFound: string[] = [];
  const deferredReferences: DeferredMarkdownReference[] = [];

  // Pre-sanitize pass: capture unsafe links/images BEFORE rehype-sanitize strips them
  // so validation diagnostics always surface unsafe URL attempts, and resolve relative
  // source links & governed local assets safely.
  const rehypePreSanitizeInspect = () => (tree: HastNode) => {
    walkTree(tree, (node) => {
      if (node.type !== 'element' || !node.tagName || !node.properties) return;

      if (node.tagName === 'a') {
        const rawHref =
          typeof node.properties.href === 'string' ? node.properties.href : '';
        if (!rawHref) return;

        // Preserve GFM footnote references
        if (
          rawHref.startsWith('#user-content-fn') ||
          rawHref.startsWith('#fn')
        ) {
          return;
        }

        const resolved = resolveMarkdownLink(rawHref, linkContext);
        if (resolved.kind === 'unsafe') {
          unsafeUrlsFound.push(rawHref);
          delete node.properties.href;
          return;
        }

        if (resolved.kind === 'resolved-published') {
          node.properties.href = resolved.href;
          return;
        }

        if (resolved.kind === 'deferred-source') {
          deferredReferences.push({
            kind: 'link',
            rawRef: rawHref,
            normalizedSourcePath: resolved.normalizedSourcePath,
            fragment: resolved.fragment,
          });
          // Mark safely for post-sanitize deferred badge rendering (never points to server file)
          const labelText = extractText(node).trim() || resolved.normalizedSourcePath;
          node.tagName = 'span';
          node.properties = {
            className: ['kh-deferred-link'],
            title: resolved.normalizedSourcePath,
          };
          node.children = [
            { type: 'text', value: labelText },
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [
                {
                  type: 'text',
                  value: resolved.fragment
                    ? `${resolved.normalizedSourcePath}#${resolved.fragment}`
                    : resolved.normalizedSourcePath,
                },
              ],
            },
          ];
        }
      }

      if (node.tagName === 'img') {
        const rawSrc =
          typeof node.properties.src === 'string' ? node.properties.src : '';
        const altText =
          typeof node.properties.alt === 'string' ? node.properties.alt.trim() : '';

        if (!rawSrc) {
          node.tagName = 'span';
          node.properties = {};
          node.children = [];
          return;
        }

        const resolved = resolveMarkdownImage(rawSrc, linkContext);
        if (resolved.kind === 'allowed') {
          node.properties.src = resolved.src;
          return;
        }

        if (resolved.kind === 'deferred-asset') {
          deferredReferences.push({
            kind: 'asset',
            rawRef: rawSrc,
            normalizedSourcePath: resolved.normalizedSourcePath,
          });
          node.tagName = 'span';
          node.properties = {
            className: ['kh-deferred-asset'],
          };
          node.children = [
            {
              type: 'text',
              value: altText
                ? `${altText} — `
                : '',
            },
            {
              type: 'element',
              tagName: 'code',
              properties: {},
              children: [{ type: 'text', value: resolved.normalizedSourcePath }],
            },
          ];
          return;
        }

        // Unsafe image URL
        unsafeUrlsFound.push(rawSrc);
        node.tagName = 'span';
        node.properties = {};
        node.children = [];
      }
    });
  };

  // Post-sanitize pass: assign globally unique, clobber-safe kh-h-* heading IDs,
  // align same-document fragment links, enforce rel/target on external links,
  // and wrap tables in .kh-table-wrap.
  const rehypePostSanitizeFinalize = () => (tree: HastNode) => {
    // Pass 1: Heading IDs (assign kh-h-* IDs to h1, h2, h3; include h1 in TOC
    // when a document uses multiple top-level H1 sections such as PROJECT_WORK_PLAN.md)
    let h1Count = 0;
    walkTree(tree, (node) => {
      if (node.type === 'element' && node.tagName === 'h1') {
        h1Count += 1;
      }
    });
    const isMultiH1Document = h1Count > 1;

    walkTree(tree, (node) => {
      if (node.type !== 'element' || !node.tagName) return;
      if (
        node.tagName === 'h1' ||
        node.tagName === 'h2' ||
        node.tagName === 'h3'
      ) {
        const title = extractText(node).trim();
        const baseSlug = createHeadingSlug(title);
        const uniqueId = allocateUniqueHeadingId(baseSlug, usedHeadingIds);

        if (!baseSlugToFirstId.has(baseSlug)) {
          baseSlugToFirstId.set(baseSlug, uniqueId);
        }

        node.properties = {
          ...(node.properties ?? {}),
          id: uniqueId,
        };

        if (isMultiH1Document) {
          if (node.tagName === 'h1') {
            headings.push({ id: uniqueId, title, level: 2 });
          } else if (node.tagName === 'h2') {
            headings.push({ id: uniqueId, title, level: 3 });
          }
        } else if (node.tagName === 'h2' || node.tagName === 'h3') {
          headings.push({
            id: uniqueId,
            title,
            level: node.tagName === 'h2' ? 2 : 3,
          });
        }
      }
    });

    // Pass 2: Finalize links, deferred spans, and table wrappers
    walkTree(tree, (node, index, parent) => {
      if (node.type !== 'element' || !node.tagName) return;

      // Restore className on deferred spans (span className is stripped by strict schema)
      if (
        node.tagName === 'span' &&
        Array.isArray(node.children) &&
        node.children.length === 2 &&
        node.children[1]?.tagName === 'code'
      ) {
        const codeVal = extractText(node.children[1]);
        const matchingDeferred = deferredReferences.find(
          (ref) =>
            codeVal === ref.normalizedSourcePath ||
            codeVal === `${ref.normalizedSourcePath}#${ref.fragment ?? ''}`
        );
        if (matchingDeferred) {
          node.properties = {
            ...(node.properties ?? {}),
            className: [
              matchingDeferred.kind === 'link'
                ? 'kh-deferred-link'
                : 'kh-deferred-asset',
            ],
            'data-deferred-source': matchingDeferred.normalizedSourcePath,
          };
        }
      }

      if (node.tagName === 'a' && node.properties) {
        const href =
          typeof node.properties.href === 'string' ? node.properties.href : '';

        if (href.startsWith('http://') || href.startsWith('https://')) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        } else if (href.startsWith('#')) {
          const frag = href.slice(1);
          if (usedHeadingIds.has(frag)) {
            node.properties.href = `#${frag}`;
          } else if (baseSlugToFirstId.has(frag)) {
            node.properties.href = `#${baseSlugToFirstId.get(frag)}`;
          } else if (usedHeadingIds.has(`${HEADING_ID_PREFIX}${frag}`)) {
            node.properties.href = `#${HEADING_ID_PREFIX}${frag}`;
          }
        }
      }

      if (
        node.tagName === 'table' &&
        parent.children &&
        !(
          parent.tagName === 'div' &&
          Array.isArray(parent.properties?.className) &&
          parent.properties.className.includes('kh-table-wrap')
        )
      ) {
        parent.children[index] = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['kh-table-wrap'] },
          children: [node],
        };
      }
    });
  };

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: false })
    .use(rehypePreSanitizeInspect)
    .use(rehypeSanitize, STRICT_SANITIZE_SCHEMA)
    .use(rehypePostSanitizeFinalize)
    .use(rehypeStringify);

  const file = processor.processSync(markdown);

  return {
    html: String(file),
    headings,
    unsafeUrlsFound,
    deferredReferences,
    readingTimeMinutes: estimateReadingTimeMinutes(markdown),
  };
}
