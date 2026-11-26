# Content Validation & Security Checks

Authoritative implementation: `content/validators/contentValidator.ts`, `content/validators/validateCli.ts`, `content/loaders/contentLoader.ts`, `content/loaders/markdownPipeline.ts`.

## 1. Running Validation

```bash
npm run content:validate
```

Content validation is enforced automatically during every production build (`npm run build` executes `npm run content:validate && next build`) and inside the full quality gate:

```bash
NODE_ENV=production npm run verify
```

In addition, `createContentRegistry()` and `getContentRegistry()` enforce fatal integrity checks at runtime by throwing `ContentIntegrityError` on duplicate IDs, duplicate slugs, invalid frontmatter, unsafe URLs, broken internal references, or unauthorized public records — while continuing to exclude valid intentionally-unpublished documents cleanly.

## 2. Blocking Error Checks (Exit Code 1)

| Error Code | Trigger Condition |
| --- | --- |
| `INVALID_FRONTMATTER` | YAML parse error, blocked `js`/`javascript` frontmatter engine, missing required fields, or Zod schema mismatch. |
| `UNSAFE_URL` | Any Markdown link or image using disallowed URL protocols (`javascript:`, `data:`, `vbscript:`, `file:`), protocol-relative `//`, path traversal escaping repository root, non-Markdown relative links, or non-governed local image paths. |
| `OFFICIAL_ID_COLLISION` | Internal `id` using official ERP prefixes (`D-`, `R-`, `IR-`, `FAC-`). |
| `DUPLICATE_ID` | Two records sharing the same internal `id`. |
| `DUPLICATE_SLUG` | Two records sharing the same canonical `/knowledge/[slug]` slug. |
| `INVALID_STATUS_COMBINATION` | `editorialStatus: "draft"` combined with `publicationStatus: "public"`. |
| `UNAUTHORIZED_PUBLICATION` | `publicationStatus: "public"` without `publicationAuthorization.authorized: true`. |
| `INCONSISTENT_APPROVAL_STATUS` | `classification: "approved-decision"` with `approvalStatus` other than `approved` or `superseded`. |
| `INCONSISTENT_SOURCE_ATTRIBUTION` | `official` or `approved-decision` record using `source.kind: "illustrative"`. |
| `INVALID_TAXONOMY_REF` | Unknown `moduleRefs` entry not registered in `content/taxonomy/registry.ts`. |
| `DUPLICATE_TRANSLATION_VARIANT` | Duplicate `language` inside the same `translationGroupId`. |
| `DUPLICATE_COLLECTION_SEQUENCE` | Duplicate `order` inside the same `(collectionId, language)` track. |
| `SELF_RELATIONSHIP` | Record declaring a relationship targeting its own `id`. |
| `BROKEN_INTERNAL_REFERENCE` | Relationship `targetId` pointing to a nonexistent record. |
| `PUBLIC_TO_UNPUBLISHED_REFERENCE` | Publicly published record referencing an unpublished/draft/unauthorized internal target. |
| `INVALID_MANIFEST_ENTRY` / `DUPLICATE_SOURCE_*` / `MISSING_SOURCE_PROVENANCE` / `UNAUTHORIZED_SOURCE_PUBLICATION` / `UNRESOLVED_PUBLISHED_CONTENT_ID` | Source Manifest schema, uniqueness, provenance, or publication-gating failures validated by `validateSourceManifest()`. |

## 3. Non-Blocking Warnings (Exit Code 0)

- `DEFERRED_REFERENCE`: Explicitly declared frontmatter `deferredRef` pointing to a real artifact scheduled for a future ingestion task.
- `DEFERRED_MARKDOWN_LINK`: Relative Markdown link inside a document body pointing to an unimported official source file (safely neutralized into `.kh-deferred-link`).
- `DEFERRED_MARKDOWN_ASSET`: Relative image path inside a document body pointing to an unimported source image (safely neutralized into `.kh-deferred-asset`).
- `SOURCE_AWAITING_DELIVERY`: Official source file registered in `PROJECT_FOUNDATIONS_SOURCE_MANIFEST` whose full body has not yet been delivered.
- `UNRESOLVED_PREVIOUS_REVISION`: `versioning.previousRevisionId` referencing an earlier revision not present in local collections.

## 4. Runtime Security Invariants

- **Path Confinement:** `resolveSafeContentPath` enforces `path.resolve` + trailing `path.sep` boundary checks and rejects `..`, absolute escapes, and null bytes with `ContentPathSecurityError`.
- **Safe Markdown Pipeline & DOM-Clobbering Prevention:** `remark-rehype` runs with `allowDangerousHtml: false`, `rehype-sanitize` uses strict allowlisting with `clobberPrefix: 'kh-user-'`, and all heading anchors are allocated globally unique `kh-h-*` IDs (`allocateUniqueHeadingId`).
- **Safe Relative Links & Governed Assets:** `content/loaders/relativeLinkResolver.ts` maps published sibling `.md` links to `/knowledge/[slug]#kh-h-...`, neutralizes unimported relative references, restricts local raster images strictly to `/assets/knowledge/*`, and blocks traversal or unsafe schemes.
- **YAML-Only Frontmatter:** `gray-matter` explicitly overrides `js` and `javascript` engines to throw an error if invoked.

