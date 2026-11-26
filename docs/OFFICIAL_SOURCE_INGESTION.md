# Official Source Ingestion Workflow

**Application:** Teranoo ERP Knowledge Hub
**Introduced in:** TASK-003 — Official Knowledge Ingestion & Project Foundations
**Official Planning Source Repository:** `https://github.com/Alabasi1980/TeranooErp` (read-only reference authority; never mutated by the Knowledge Hub)
**Knowledge Hub Repository:** `https://github.com/majidkhaireddin-netizen/Teranoo-ERP-Knowledge-Hub`

---

## 1. Purpose and Authority Boundaries

The Official Source Ingestion Pipeline enables repeatable, auditable, deterministic import of authorized official Teranoo ERP documentation into the Knowledge Hub **without**:

- Connecting directly to private GitHub repositories at runtime.
- Requiring GitHub tokens, API keys, or external CMS infrastructure.
- Rewriting, summarizing, or altering the meaning of official ERP documentation.
- Fabricating missing files, sections, decision entries, or future phases.
- Automatically exposing imported files publicly before explicit publication authorization.

All official Teranoo ERP planning artifacts remain owned by the official ERP repository. The Knowledge Hub wraps supplied official Markdown bodies inside validated YAML frontmatter envelopes and enforces strict build-time integrity checks.

---

## 2. Deterministic Ingestion Architecture

The ingestion architecture consists of five strictly decoupled stages:

1. **Source Registration (`content/manifest/sourceManifest.ts`)**
   - Every expected official source file is declared in the validated Source Manifest with its repository URL, normalized repository-relative POSIX path, expected content type, official authority classification, phase reference, completeness state, and publication authorization status.
   - Sources whose full bodies have not yet been supplied remain marked `importStatus: "awaiting-source"`, `publicationAuthorizationStatus: "pending"`, and `publishedContentId: null`.

2. **Verbatim Wrapping & Provenance Hashing (`content/ingestion/ingestionPipeline.ts`)**
   - `computeSourceSha256(rawBodyMarkdown)` normalizes line endings (`\r\n` → `\n`) and computes a deterministic 64-character SHA-256 hex digest.
   - `prepareCanonicalIngestionArtifact(input, linkContext)` wraps the verbatim official Markdown body inside a schema-compliant YAML frontmatter envelope (`source.kind: "official-source"`, exact `repository`, `sourcePath`, `commitSha`/`treeSha`, `reviewDate`, and `versioning.sourceVersion`).
   - **Authorization Gate:** Setting `authorizedForPublic: false` generates a valid non-public record (`editorialStatus: "under-review"`, `publicationStatus: "internal"`, `publicationAuthorization.authorized: false`) and sets manifest status to `validated` with `publishedContentId: null`. Only explicit `authorizedForPublic: true` produces a `public` / `published` record.

3. **Two-Pass Safe Loading & Relative Reference Resolution (`content/loaders/contentLoader.ts` & `relativeLinkResolver.ts`)**
   - **Pass 1:** Scans approved `content/collections/*` directories, parses YAML-only frontmatter (`js`/`javascript` engines disabled), and indexes every publicly publishable official document's `source.sourcePath → slug`.
   - **Pass 2:** Renders Markdown through the unified/remark/rehype pipeline (`content/loaders/markdownPipeline.ts`) with:
     - Globally unique DOM-clobbering-safe heading IDs (`kh-h-*` prefix + `clobberPrefix: "kh-user-"`).
     - Automatic resolution of relative `.md` links between published official documents to `/knowledge/[slug]#kh-h-...`.
     - Safe conversion of relative `.md` links targeting unimported official files into non-navigating deferred references (`.kh-deferred-link`) with non-blocking `DEFERRED_MARKDOWN_LINK` warnings.
     - Safe conversion of unimported relative source images into `.kh-deferred-asset` indicators while allowing governed local raster assets strictly under `/assets/knowledge/*`.
     - Fatal rejection of path traversal (`..` escaping repository root), unsafe URL schemes (`javascript:`, `data:`, `vbscript:`, `file:`), protocol-relative URLs (`//...`), and arbitrary non-Markdown relative paths.

4. **Build-Time Validation Enforcement (`content/validators/contentValidator.ts` & `validateCli.ts`)**
   - Executed via `npm run content:validate` and enforced automatically inside `npm run build` (`npm run content:validate && next build`).
   - Fatal integrity errors (invalid frontmatter, duplicate IDs/slugs, unsafe URLs, broken internal links, unauthorized public exposure, or manifest mismatches) fail the build and throw `ContentIntegrityError` in `getContentRegistry()` and `createContentRegistry()`.
   - Valid intentionally-unpublished documents remain distinct from invalid files and are cleanly excluded from public outputs.

5. **Standalone Deployment Packaging (`next.config.ts`)**
   - `outputFileTracingIncludes` explicitly traces `./content/collections/**/*` into `.next/standalone`.
   - `outputFileTracingExcludes` explicitly excludes `./content/fixtures/**/*` from `.next/standalone`.

---

## 3. Current Official Source Availability (TASK-003)

As of TASK-003 completion:

- **Registered Project Foundations official sources:** `6`
- **Full source bodies received:** `0`
- **Full source bodies imported:** `0`
- **Official full sources publicly published:** `0`
- **Official sources awaiting delivery:** `6`

Only the two existing bilingual snapshot-derived reference summaries (`teranoo-product-vision-reference` AR/EN) and two bilingual Knowledge Hub educational articles (`knowledge-classification-governance` AR/EN) are published (`4` total language records = `2` unique conceptual topics).
