import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import type { RenderedHeading } from '@/content/models/knowledge';
import { isSafeUrl } from '@/content/schemas/frontmatterSchema';

interface HastNode {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/**
 * Generates deterministic, Unicode-safe heading slugs supporting Arabic and English.
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
    a: ['href', 'title', 'target', 'rel', 'ariaDescribedBy', 'dataFootnoteRef', 'dataFootnoteBackref', 'ariaLabel'],
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
  clobberPrefix: '',
};

export interface MarkdownRenderResult {
  readonly html: string;
  readonly headings: readonly RenderedHeading[];
  readonly unsafeUrlsFound: readonly string[];
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
 * Safely renders Markdown into sanitized HTML, extracts deterministic headings
 * (supporting Arabic + duplicate deduplication), validates all URL protocols,
 * and wraps tables for horizontal scrolling.
 *
 * Raw HTML inside Markdown is disabled (allowDangerousHtml: false) and output
 * is additionally sanitized through an explicit allowlist policy.
 */
export function renderSafeMarkdown(markdown: string): MarkdownRenderResult {
  const headings: RenderedHeading[] = [];
  const slugCounts = new Map<string, number>();
  const unsafeUrlsFound: string[] = [];

  const rehypeKnowledgeTransform = () => (tree: HastNode) => {
    walkTree(tree, (node, index, parent) => {
      if (node.type !== 'element' || !node.tagName) return;

      // 1. Heading anchors & TOC extraction (H2 & H3)
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        const title = extractText(node).trim();
        const baseSlug = createHeadingSlug(title);
        const existingCount = slugCounts.get(baseSlug) ?? 0;
        const nextCount = existingCount + 1;
        slugCounts.set(baseSlug, nextCount);

        const uniqueId = nextCount === 1 ? baseSlug : `${baseSlug}-${nextCount}`;
        node.properties = {
          ...(node.properties ?? {}),
          id: uniqueId,
        };

        headings.push({
          id: uniqueId,
          title,
          level: node.tagName === 'h2' ? 2 : 3,
        });
      }

      // 2. Link protocol validation & safe external attributes
      if (node.tagName === 'a' && node.properties) {
        const rawHref =
          typeof node.properties.href === 'string' ? node.properties.href : '';
        if (rawHref && !isSafeUrl(rawHref)) {
          unsafeUrlsFound.push(rawHref);
          delete node.properties.href;
        } else if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }

      // 3. Image src protocol validation
      if (node.tagName === 'img' && node.properties) {
        const rawSrc =
          typeof node.properties.src === 'string' ? node.properties.src : '';
        if (!rawSrc || !isSafeUrl(rawSrc)) {
          if (rawSrc) unsafeUrlsFound.push(rawSrc);
          // Neutralize unsafe image into plain empty span
          node.tagName = 'span';
          node.properties = {};
          node.children = [];
        }
      }

      // 4. Wrap tables in horizontally scrollable container
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
    .use(rehypeKnowledgeTransform)
    .use(rehypeSanitize, STRICT_SANITIZE_SCHEMA)
    .use(rehypeStringify);

  const file = processor.processSync(markdown);

  return {
    html: String(file),
    headings,
    unsafeUrlsFound,
    readingTimeMinutes: estimateReadingTimeMinutes(markdown),
  };
}
