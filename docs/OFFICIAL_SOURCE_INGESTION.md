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

2. **Verbatim Wrapping, Git Blob Verification & Provenance Hashing (`content/ingestion/ingestionPipeline.ts` — KH-021 / KH-022)**
   - `verifySourceGitBlob(rawInput, expectedGitBlobSha)` computes the real Git blob SHA-1 (`sha1("blob " + byteLength + "\0" + bytes)`) on both raw received bytes and LF-normalized bytes (`\r\n` → `\n`), distinguishing `git-blob-verified`, `git-blob-verified-lf-normalized`, and `git-blob-mismatch` (fail-closed when `verifyExpectedGitBlob: true`).
   - Records both `rawSourceSha256` (exact received bytes) and `sourceFileHash` / `storedBodySha256` (canonical LF-normalized body) alongside `commitSha`, `treeSha`, and `gitBlobSha`.
   - `prepareCanonicalIngestionArtifact(input, linkContext)` wraps the verbatim official Markdown body inside a schema-compliant YAML frontmatter envelope (`source.kind: "official-source"`, optional `interpretationNote` when a verbatim body contains a known stale line).
   - **KH-022 `approvalStatus` Mapping:** Explicit `approvalStatus` is assigned per official document semantics (`approved` for closed approved artifacts, `reference` for active reference governance docs like `PROJECT_WORK_PLAN.md` / `WORKING_RULES.md` / `DECISION_REGISTER.md`, and strictly `not-applicable` for `classification: "future"` records such as `FUTURE_ARCHITECTURE_CONSIDERATIONS.md`).
   - **KH-023 Public Repository Security Policy (Critical):** Because this Knowledge Hub repository is public, **never commit unauthorized or confidential source bodies into this repository** — not even with `publicationStatus: "internal"` or `publicationAuthorization.authorized: false`. Non-public staging and review of unauthorized sources must occur **outside** this public repository. Application-level publication filtering (`isPubliclyPublishableRecord`) is a defense-in-depth safeguard, not a confidentiality boundary for a public Git repository. Any test fixtures committed under `content/fixtures/` must remain strictly synthetic and non-sensitive.

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
   - Fatal integrity errors (invalid frontmatter, duplicate IDs/slugs, unsafe URLs, broken internal links, unauthorized public exposure, `future` records marked `approved`, or manifest mismatches) fail the build and throw `ContentIntegrityError` in `getContentRegistry()` and `createContentRegistry()`.
   - Valid intentionally-unpublished documents remain distinct from invalid files and are cleanly excluded from public outputs.

5. **Standalone Deployment Packaging (`next.config.ts`)**
   - `outputFileTracingIncludes` explicitly traces `./content/collections/**/*` into `.next/standalone`.
   - `outputFileTracingExcludes` explicitly excludes `./content/fixtures/**/*` from `.next/standalone`.

---

## 3. Current Official Source Availability (TASK-004 — BATCH-001)

As of TASK-004 (`BATCH-001 — Project Foundations`, commit `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f`, tree `db531de6b2ab452578a550e07c5fd80e4bfe6b64`):

- **Registered Project Foundations official sources:** `6`
- **Full source bodies received & verified by Git blob SHA:** `6 / 6` (`git-blob-verified-lf-normalized`)
- **Full source bodies imported & published:** `6 / 6`
- **Official sources awaiting delivery in BATCH-001:** `0`
- **Total published Knowledge Library records:** `10` (`6` full official BATCH-001 sources + `2` superseded bilingual Product Vision historical summaries + `2` bilingual Knowledge Hub educational governance guides = `8` unique conceptual topics across `3` active collections).
- **Scheduled for future authorized batches:** Individual owning decision documents (126 architectural decisions), `DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md`, separate `FAC-019..FAC-024` detailed files, Phase 2 module dependency documents, research packages (`13`), and independent review notes (`57`).
