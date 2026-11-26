import path from 'node:path';

export interface MarkdownLinkContext {
  /**
   * Logical repository-relative path of the current source document
   * (e.g. "teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md").
   */
  readonly currentSourcePath?: string;
  /**
   * Map from normalized repository-relative source path -> published Knowledge Hub slug.
   */
  readonly publishedSourcePathToSlug?: ReadonlyMap<string, string>;
  /**
   * Map from normalized repository-relative image path -> governed public asset URL
   * strictly under "/assets/knowledge/...".
   */
  readonly governedAssetMap?: ReadonlyMap<string, string>;
}

export type ResolvedMarkdownLink =
  | { readonly kind: 'external'; readonly href: string }
  | { readonly kind: 'internal-route'; readonly href: string }
  | { readonly kind: 'fragment'; readonly rawFragment: string }
  | {
      readonly kind: 'resolved-published';
      readonly href: string;
      readonly normalizedSourcePath: string;
      readonly targetSlug: string;
      readonly fragment?: string;
    }
  | {
      readonly kind: 'deferred-source';
      readonly normalizedSourcePath: string;
      readonly fragment?: string;
    }
  | { readonly kind: 'unsafe'; readonly rawHref: string; readonly reason: string };

export type ResolvedMarkdownImage =
  | { readonly kind: 'allowed'; readonly src: string }
  | {
      readonly kind: 'deferred-asset';
      readonly normalizedSourcePath: string;
    }
  | { readonly kind: 'unsafe'; readonly rawSrc: string; readonly reason: string };

const CONTROL_CHAR_PATTERN = /[\u0000-\u001F\u007F]/;
const SCHEME_PATTERN = /^([a-zA-Z][a-zA-Z0-9+.-]*):/;
const SAFE_GOVERNED_ASSET_PREFIX = '/assets/knowledge/';
const SAFE_RASTER_IMAGE_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.gif',
  '.avif',
]);
const SAFE_MARKDOWN_EXTENSIONS = new Set(['.md', '.markdown']);

/**
 * Sanitizes a URL heading fragment, stripping unsafe characters and returning
 * an empty string if the fragment is malformed.
 */
export function sanitizeHeadingFragment(rawFragment: string): string {
  const stripped = rawFragment.replace(/^#/, '').trim();
  if (!stripped || CONTROL_CHAR_PATTERN.test(stripped)) return '';

  let decoded = stripped;
  try {
    decoded = decodeURIComponent(stripped);
  } catch {
    return '';
  }

  const cleaned = decoded
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}_-]/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return cleaned;
}

/**
 * Resolves a relative POSIX path against a logical repository source path.
 * Strictly blocks traversal escaping above the logical repository root,
 * null bytes, backslashes, and malformed percent encodings.
 */
export function normalizeRepoRelativePath(
  currentSourcePath: string | undefined,
  relativeTarget: string
): string | null {
  if (
    !relativeTarget ||
    CONTROL_CHAR_PATTERN.test(relativeTarget) ||
    relativeTarget.includes('\\')
  ) {
    return null;
  }

  let decodedTarget: string;
  try {
    decodedTarget = decodeURIComponent(relativeTarget);
  } catch {
    return null;
  }

  if (
    CONTROL_CHAR_PATTERN.test(decodedTarget) ||
    decodedTarget.includes('\\') ||
    decodedTarget.startsWith('/')
  ) {
    return null;
  }

  const baseSegments = currentSourcePath
    ? currentSourcePath.replace(/^\/+/, '').split('/').filter(Boolean).slice(0, -1)
    : [];

  const targetSegments = decodedTarget.split('/');
  const resolved: string[] = [...baseSegments];

  for (const segment of targetSegments) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      if (resolved.length === 0) {
        // Attempted escape above logical repository root
        return null;
      }
      resolved.pop();
    } else {
      resolved.push(segment);
    }
  }

  if (resolved.length === 0) return null;
  return resolved.join('/');
}

/**
 * Classifies and resolves a Markdown link href safely:
 * - External http(s)/mailto links are allowed.
 * - Safe site-relative paths (/...) without traversal or protocol-relative // are allowed.
 * - Fragment links (#...) are preserved for in-document anchor mapping.
 * - Relative Markdown links (./file.md, ../dir/file.md#heading) resolve to canonical
 *   /knowledge/[slug] when published, or become non-navigating deferred references
 *   when not yet imported (never exposing arbitrary server files).
 * - Unsafe protocols (javascript:, data:, vbscript:, file:), traversal above repo root,
 *   arbitrary non-Markdown relative paths, and malformed links are blocked.
 */
export function resolveMarkdownLink(
  rawHref: string,
  context: MarkdownLinkContext = {}
): ResolvedMarkdownLink {
  const trimmed = rawHref.trim();
  if (!trimmed || CONTROL_CHAR_PATTERN.test(trimmed)) {
    return { kind: 'unsafe', rawHref, reason: 'Empty or control-character URL' };
  }

  if (trimmed.startsWith('//') || trimmed.includes('\\')) {
    return {
      kind: 'unsafe',
      rawHref,
      reason: 'Protocol-relative or backslash URL is prohibited',
    };
  }

  // Same-document fragment
  if (trimmed.startsWith('#')) {
    const cleanFrag = sanitizeHeadingFragment(trimmed);
    if (!cleanFrag) {
      return { kind: 'unsafe', rawHref, reason: 'Malformed fragment identifier' };
    }
    return { kind: 'fragment', rawFragment: cleanFrag };
  }

  // Explicit URL scheme check
  const schemeMatch = SCHEME_PATTERN.exec(trimmed);
  if (schemeMatch) {
    const scheme = schemeMatch[1]?.toLowerCase();
    if (scheme === 'http' || scheme === 'https' || scheme === 'mailto') {
      try {
        const parsed = new URL(trimmed);
        if (
          parsed.protocol === 'http:' ||
          parsed.protocol === 'https:' ||
          parsed.protocol === 'mailto:'
        ) {
          return { kind: 'external', href: trimmed };
        }
      } catch {
        return { kind: 'unsafe', rawHref, reason: 'Malformed external URL' };
      }
    }
    return {
      kind: 'unsafe',
      rawHref,
      reason: `Disallowed URL protocol "${scheme}:"`,
    };
  }

  // Site-relative route (/knowledge/..., /roadmap, etc.)
  if (trimmed.startsWith('/')) {
    if (trimmed.includes('..')) {
      return {
        kind: 'unsafe',
        rawHref,
        reason: 'Path traversal inside site-relative URL is prohibited',
      };
    }
    return { kind: 'internal-route', href: trimmed };
  }

  // Relative source link (split path and optional #fragment, reject query strings)
  const hashIdx = trimmed.indexOf('#');
  const rawPathPart = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
  const rawFragPart = hashIdx >= 0 ? trimmed.slice(hashIdx + 1) : '';

  if (rawPathPart.includes('?')) {
    return {
      kind: 'unsafe',
      rawHref,
      reason: 'Query parameters in relative source links are not permitted',
    };
  }

  const normalizedSourcePath = normalizeRepoRelativePath(
    context.currentSourcePath,
    rawPathPart
  );
  if (!normalizedSourcePath) {
    return {
      kind: 'unsafe',
      rawHref,
      reason: 'Relative link escapes repository boundary or is malformed',
    };
  }

  const ext = path.posix.extname(normalizedSourcePath).toLowerCase();
  if (!SAFE_MARKDOWN_EXTENSIONS.has(ext)) {
    return {
      kind: 'unsafe',
      rawHref,
      reason: `Relative link target "${normalizedSourcePath}" is not an authorized Markdown source file`,
    };
  }

  let safeFragment: string | undefined;
  if (rawFragPart) {
    const cleaned = sanitizeHeadingFragment(rawFragPart);
    if (!cleaned) {
      return {
        kind: 'unsafe',
        rawHref,
        reason: 'Malformed heading fragment on relative source link',
      };
    }
    safeFragment = cleaned;
  }

  const targetSlug = context.publishedSourcePathToSlug?.get(normalizedSourcePath);
  if (targetSlug) {
    const hashSuffix = safeFragment
      ? `#${safeFragment.startsWith('kh-h-') ? safeFragment : `kh-h-${safeFragment}`}`
      : '';
    return {
      kind: 'resolved-published',
      href: `/knowledge/${targetSlug}${hashSuffix}`,
      normalizedSourcePath,
      targetSlug,
      fragment: safeFragment,
    };
  }

  return {
    kind: 'deferred-source',
    normalizedSourcePath,
    fragment: safeFragment,
  };
}

/**
 * Governed local & external Markdown image resolution strategy (Section 2D):
 * - Allows verified http(s) URLs.
 * - Allows governed local public images strictly inside "/assets/knowledge/..."
 *   with safe raster image extensions (no path traversal, no raw untrusted SVG).
 * - Maps safe relative source images via governedAssetMap if packaged, or converts
 *   unimported relative source images into safe deferred asset notices.
 * - Blocks unsafe protocols (javascript:, data:, file:), path traversal, and arbitrary paths.
 */
export function resolveMarkdownImage(
  rawSrc: string,
  context: MarkdownLinkContext = {}
): ResolvedMarkdownImage {
  const trimmed = rawSrc.trim();
  if (!trimmed || CONTROL_CHAR_PATTERN.test(trimmed)) {
    return { kind: 'unsafe', rawSrc, reason: 'Empty or control-character image src' };
  }

  if (trimmed.startsWith('//') || trimmed.includes('\\')) {
    return {
      kind: 'unsafe',
      rawSrc,
      reason: 'Protocol-relative or backslash image path is prohibited',
    };
  }

  const schemeMatch = SCHEME_PATTERN.exec(trimmed);
  if (schemeMatch) {
    const scheme = schemeMatch[1]?.toLowerCase();
    if (scheme === 'http' || scheme === 'https') {
      try {
        const parsed = new URL(trimmed);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
          return { kind: 'allowed', src: trimmed };
        }
      } catch {
        return { kind: 'unsafe', rawSrc, reason: 'Malformed image URL' };
      }
    }
    return {
      kind: 'unsafe',
      rawSrc,
      reason: `Disallowed image protocol "${scheme}:"`,
    };
  }

  // Site-relative governed public knowledge asset
  if (trimmed.startsWith('/')) {
    if (
      !trimmed.startsWith(SAFE_GOVERNED_ASSET_PREFIX) ||
      trimmed.includes('..') ||
      trimmed.includes('?') ||
      trimmed.includes('#')
    ) {
      return {
        kind: 'unsafe',
        rawSrc,
        reason: `Local images must reside strictly under ${SAFE_GOVERNED_ASSET_PREFIX}`,
      };
    }
    const ext = path.posix.extname(trimmed).toLowerCase();
    if (!SAFE_RASTER_IMAGE_EXTENSIONS.has(ext)) {
      return {
        kind: 'unsafe',
        rawSrc,
        reason: `Unsupported local image extension "${ext || 'none'}"`,
      };
    }
    return { kind: 'allowed', src: trimmed };
  }

  // Relative image path inside official source document
  if (trimmed.includes('?') || trimmed.includes('#')) {
    return {
      kind: 'unsafe',
      rawSrc,
      reason: 'Query or fragment components are prohibited in relative image paths',
    };
  }

  const normalizedSourcePath = normalizeRepoRelativePath(
    context.currentSourcePath,
    trimmed
  );
  if (!normalizedSourcePath) {
    return {
      kind: 'unsafe',
      rawSrc,
      reason: 'Relative image path escapes repository boundary or is malformed',
    };
  }

  const ext = path.posix.extname(normalizedSourcePath).toLowerCase();
  if (!SAFE_RASTER_IMAGE_EXTENSIONS.has(ext)) {
    return {
      kind: 'unsafe',
      rawSrc,
      reason: `Unsupported relative image extension "${ext || 'none'}"`,
    };
  }

  const governedUrl = context.governedAssetMap?.get(normalizedSourcePath);
  if (governedUrl && governedUrl.startsWith(SAFE_GOVERNED_ASSET_PREFIX)) {
    return { kind: 'allowed', src: governedUrl };
  }

  return {
    kind: 'deferred-asset',
    normalizedSourcePath,
  };
}
