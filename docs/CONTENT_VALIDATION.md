# Content Validation & Security Checks

Authoritative implementation: `content/validators/contentValidator.ts`, `content/validators/validateCli.ts`, `content/loaders/contentLoader.ts`, `content/loaders/markdownPipeline.ts`.

## 1. Running Validation

```bash
npm run content:validate
```

Content validation is also integrated directly into the full quality gate:

```bash
NODE_ENV=production npm run verify
```

## 2. Blocking Error Checks (Exit Code 1)

| Error Code | Trigger Condition |
| --- | --- |
| `INVALID_FRONTMATTER` | YAML parse error, blocked `js`/`javascript` frontmatter engine, missing required fields, or Zod schema mismatch. |
| `UNSAFE_URL` | Any Markdown link or image using disallowed URL protocols (`javascript:`, `data:`, `vbscript:`, `file:`, etc.). |
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

## 3. Non-Blocking Warnings (Exit Code 0)

- `DEFERRED_REFERENCE`: Explicitly declared `deferredRef` pointing to a real artifact scheduled for a future ingestion task.
- `UNRESOLVED_PREVIOUS_REVISION`: `versioning.previousRevisionId` referencing an earlier revision not present in local collections.

## 4. Runtime Security Invariants

- **Path Confinement:** `resolveSafeContentPath` enforces `path.resolve` + trailing `path.sep` boundary checks and rejects `..`, absolute escapes, and null bytes with `ContentPathSecurityError`.
- **Safe Markdown Pipeline:** `remark-rehype` runs with `allowDangerousHtml: false`, followed by URL protocol filtering and `rehype-sanitize` strict allowlist sanitization before `rehype-stringify`.
- **YAML-Only Frontmatter:** `gray-matter` explicitly overrides `js` and `javascript` engines to throw an error if invoked.
