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
| `INCONSISTENT_APPROVAL_STATUS` | `classification: "approved-decision"` with `approvalStatus` other than `approved` or `superseded`; or `classification: "future"` with `approvalStatus: "approved"` (KH-022). |
| `INCONSISTENT_SOURCE_ATTRIBUTION` | `official` or `approved-decision` record using `source.kind: "illustrative"`. |
| `INVALID_TAXONOMY_REF` | Unknown `moduleRefs` entry not registered in `content/taxonomy/registry.ts`. |
| `DUPLICATE_TRANSLATION_VARIANT` | Duplicate `language` inside the same `translationGroupId`. |
| `DUPLICATE_COLLECTION_SEQUENCE` | Duplicate `order` inside the same `(collectionId, language)` track. |
| `SELF_RELATIONSHIP` | Record declaring a relationship targeting its own `id`. |
| `BROKEN_INTERNAL_REFERENCE` | Relationship `targetId` pointing to a nonexistent record. |
| `PUBLIC_TO_UNPUBLISHED_REFERENCE` | Publicly published record referencing an unpublished/draft/unauthorized internal target. |
| `INVALID_MANIFEST_ENTRY` / `DUPLICATE_SOURCE_*` / `MISSING_SOURCE_PROVENANCE` / `UNAUTHORIZED_SOURCE_PUBLICATION` / `UNRESOLVED_PUBLISHED_CONTENT_ID` | Source Manifest schema, uniqueness, provenance, Git blob verification, or publication-gating failures validated by `validateSourceManifest()`. |
| `MISSING_STORED_BODY_DIGEST` | Published official document missing recorded `storedBodySha256` / manifest `sourceFileHash` or `expectedGitBlobSha` / `gitBlobSha` required for mandatory body verification (`KH-030`). |
| `STORED_BODY_DIGEST_MISMATCH` | Stored canonical Markdown body SHA-256 under `content/collections/` diverges from frontmatter `storedBodySha256` or manifest `sourceFileHash` (even a single-character or trailing-whitespace edit). |
| `STORED_BODY_GIT_BLOB_MISMATCH` | Reproducible Git blob SHA-1 computed from the stored canonical Markdown body diverges from manifest `expectedGitBlobSha` or frontmatter `gitBlobSha`. |
| `STORED_BODY_REVISION_MISMATCH` | Frontmatter `source.commitSha` diverges from the authoritative manifest `commitSha`. |
| `STORED_BODY_CRLF_DRIFT` | Stored canonical official document body contains raw `\r` / `\r\n` carriage returns instead of canonical LF line endings. |

## 3. Non-Blocking Warnings (Exit Code 0)

- `DEFERRED_REFERENCE`: Explicitly declared frontmatter `deferredRef` pointing to a real artifact scheduled for a future ingestion task (for example, `DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md`).
- `DEFERRED_MARKDOWN_LINK`: Relative Markdown link inside a document body pointing to an unimported official source file (safely neutralized into `.kh-deferred-link`).
- `DEFERRED_MARKDOWN_ASSET`: Relative image path inside a document body pointing to an unimported source image (safely neutralized into `.kh-deferred-asset`).
- `SOURCE_AWAITING_DELIVERY`: Official source file registered in `OFFICIAL_SOURCE_MANIFEST` (`16/16` currently published across BATCH-001 and BATCH-002, out of `20` total published Knowledge Hub records) whose full body has not yet been delivered.
- `UNRESOLVED_PREVIOUS_REVISION`: `versioning.previousRevisionId` referencing an earlier revision not present in local collections.

## 4. Runtime & Repository Security Invariants

- **Public Repository Staging Boundary (KH-023 / KH-029):** Canonical published sources live solely under `content/collections/`; redundant raw attachment copies under `files/` are removed from tracking and excluded via `.gitignore` and `next.config.ts`. Never commit unauthorized or confidential official source bodies to this public repository — even with `publicationStatus: "internal"` or `authorized: false`. Non-public staging must live outside this public repository; application-level filtering is defense-in-depth only. Test fixtures in `content/fixtures/` must remain strictly synthetic and non-sensitive.
- **Mandatory Stored-Body SHA-256 & Git Blob SHA-1 Verification (KH-021 / KH-030):** Every official document stored in `content/collections/` is verified unconditionally inside `validateLoadedEntries()` (without requiring raw `/files/` copies) against its canonical stored body SHA-256 (`storedBodySha256` / `sourceFileHash`) and reproducible 40-character Git blob SHA-1 (`expectedGitBlobSha` / `gitBlobSha`), preserving `rawSourceSha256` separately for pre-normalization ingestion bytes. Only the exact single leading `\n` envelope separator after YAML frontmatter `---\n` is stripped (`extractCanonicalStoredBody`); broad `.trim()` is strictly prohibited.
- **Path Confinement:** `resolveSafeContentPath` enforces `path.resolve` + trailing `path.sep` boundary checks and rejects `..`, absolute escapes, and null bytes with `ContentPathSecurityError`.
- **Safe Markdown Pipeline & DOM-Clobbering Prevention:** `remark-rehype` runs with `allowDangerousHtml: false`, `rehype-sanitize` uses strict allowlisting with `clobberPrefix: 'kh-user-'`, and all heading anchors are allocated globally unique `kh-h-*` IDs (`allocateUniqueHeadingId`).
- **Safe Relative Links & Governed Assets:** `content/loaders/relativeLinkResolver.ts` maps published sibling `.md` links to `/knowledge/[slug]#kh-h-...`, neutralizes unimported relative references, restricts local raster images strictly to `/assets/knowledge/*`, and blocks traversal or unsafe schemes.
- **YAML-Only Frontmatter:** `gray-matter` explicitly overrides `js` and `javascript` engines to throw an error if invoked.

