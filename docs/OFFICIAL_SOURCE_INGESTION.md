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

2. **Verbatim Wrapping, Git Blob Verification & Provenance Hashing (`content/ingestion/ingestionPipeline.ts` — KH-021 / KH-022 / KH-030)**
   - `verifySourceGitBlob(rawInput, expectedGitBlobSha)` computes the real Git blob SHA-1 (`sha1("blob " + byteLength + "\0" + bytes)`) on both raw received bytes and LF-normalized bytes (`\r\n` → `\n`), distinguishing `git-blob-verified`, `git-blob-verified-lf-normalized`, and `git-blob-mismatch` (fail-closed when `verifyExpectedGitBlob: true`).
   - Preserves the exact four-way provenance distinction:
     1. `rawSourceSha256` — SHA-256 of the raw supplied bytes prior to ingestion line-ending normalization.
     2. `sourceFileHash` (manifest) — SHA-256 of the canonical LF-normalized Markdown body.
     3. `storedBodySha256` (frontmatter) — SHA-256 of the canonical stored Markdown body inside `content/collections/`.
     4. `expectedGitBlobSha` (manifest) / `gitBlobSha` (frontmatter) — 40-character Git blob SHA-1 (`sha1("blob " + byteLength + "\0" + utf8Bytes)`) reproducible directly from the canonical stored body.
   - **Exact Permitted Normalization Rules (KH-030 — No Broad `.trim()`):**
     - At ingestion time: `\r\n` and standalone `\r` are normalized to `\n` before writing the canonical frontmatter envelope (`---\n<yaml>\n---\n\n<body>`).
     - At build-time validation (`extractCanonicalStoredBody`): strips **only** the single leading `\n` envelope separator emitted by `prepareCanonicalIngestionArtifact()` after `---\n`. Leading/trailing spaces, trailing newlines, internal blank lines, and Unicode characters are **never** trimmed or silently normalized. Even a 1-character or trailing-whitespace edit in a stored official document body fails `npm run content:validate` and `npm run build`.
   - `prepareCanonicalIngestionArtifact(input, linkContext)` wraps the verbatim official Markdown body inside a schema-compliant YAML frontmatter envelope (`source.kind: "official-source"`, optional `interpretationNote` when a verbatim body contains a known stale line).
   - **KH-022 `approvalStatus` Mapping:** Explicit `approvalStatus` is assigned per official document semantics (`approved` for closed approved artifacts, `reference` for active reference governance docs like `PROJECT_WORK_PLAN.md` / `WORKING_RULES.md` / `DECISION_REGISTER.md`, and strictly `not-applicable` for `classification: "future"` records such as `FUTURE_ARCHITECTURE_CONSIDERATIONS.md`).
   - **KH-023 & KH-029 Public Repository Staging Policy (Critical):**
     - Canonical published documents live exclusively under `content/collections/`. Redundant raw source attachment copies under `files/` have been removed from the tracked repository (`KH-029`).
     - Temporary staging directories (`files/`, `.ingestion-staging/`, `tmp/ingestion/`) are excluded in `.gitignore` and `next.config.ts` (`outputFileTracingExcludes`).
     - Ingestion scripts (such as `scripts/ingest-batch-001.ts`) fail closed unless an explicit staging directory is provided via `--source-dir <path>` or `TERANOO_INGESTION_SOURCE_DIR`.
     - Never commit unauthorized or confidential source bodies into this public repository — not even with `publicationStatus: "internal"` or `publicationAuthorization.authorized: false`. Non-public staging must occur outside this public repository. Any test fixtures committed under `content/fixtures/` must remain strictly synthetic and non-sensitive.

3. **Two-Pass Safe Loading & Relative Reference Resolution (`content/loaders/contentLoader.ts` & `relativeLinkResolver.ts`)**
   - **Pass 1:** Scans approved `content/collections/*` directories, parses YAML-only frontmatter (`js`/`javascript` engines disabled), and indexes every publicly publishable official document's `source.sourcePath → slug`.
   - **Pass 2:** Renders Markdown through the unified/remark/rehype pipeline (`content/loaders/markdownPipeline.ts`) with:
     - Globally unique DOM-clobbering-safe heading IDs (`kh-h-*` prefix + `clobberPrefix: "kh-user-"`).
     - Automatic resolution of relative `.md` links between published official documents to `/knowledge/[slug]#kh-h-...`.
     - Safe conversion of relative `.md` links targeting unimported official files into non-navigating deferred references (`.kh-deferred-link`) with non-blocking `DEFERRED_MARKDOWN_LINK` warnings.
     - Safe conversion of unimported relative source images into `.kh-deferred-asset` indicators while allowing governed local raster assets strictly under `/assets/knowledge/*`.
     - Fatal rejection of path traversal (`..` escaping repository root), unsafe URL schemes (`javascript:`, `data:`, `vbscript:`, `file:`), protocol-relative URLs (`//...`), and arbitrary non-Markdown relative paths.

4. **Mandatory Build-Time Validation & Stored-Body Integrity (`content/validators/contentValidator.ts` & `validateCli.ts` — KH-030)**
   - Executed via `npm run content:validate` and enforced automatically inside `npm run build` (`npm run content:validate && next build`).
   - Independently verifies every official stored Markdown body under `content/collections/` against its recorded `storedBodySha256`, manifest `sourceFileHash`, `expectedGitBlobSha` / `gitBlobSha`, and pinned `commitSha` — completely without relying on any raw `/files/` copies.
   - Fatal integrity errors (invalid frontmatter, duplicate IDs/slugs, unsafe URLs, broken internal links, unauthorized public exposure, `future` records marked `approved`, manifest mismatches, or stored-body digest/Git-blob drift) fail the build and throw `ContentIntegrityError` in `getContentRegistry()` and `createContentRegistry()`.
   - Valid intentionally-unpublished documents remain distinct from invalid files and are cleanly excluded from public outputs.

5. **Standalone Deployment Packaging (`next.config.ts`)**
   - `outputFileTracingIncludes` explicitly traces `./content/collections/**/*` into `.next/standalone`.
   - `outputFileTracingExcludes` explicitly excludes `./content/fixtures/**/*`, `./files/**/*`, `./.ingestion-staging/**/*`, and `./tmp/ingestion/**/*` from `.next/standalone`.

---

## 3. Current Official Source Availability (`TASK-005-FIX-02` — BATCH-001 + BATCH-002)

As of `TASK-005-FIX-02` (official repository commit `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f`, tree `db531de6b2ab452578a550e07c5fd80e4bfe6b64`):

- **Registered official sources across BATCH-001 + BATCH-002:** `16` (`6` BATCH-001 Project Foundations + `10` BATCH-002 Core Modules & Dependency Governance)
- **Full stored canonical bodies verified by mandatory SHA-256 & Git blob SHA-1 checks:** `16 / 16` (`100%`, independent of any external `/files/` staging copies)
- **Full source bodies imported & published:** `16 / 16`
- **Total published Knowledge Library records:** `20` (`16` full official sources + `2` superseded bilingual Product Vision historical summaries + `2` bilingual Knowledge Hub educational governance guides = `18` unique conceptual topics across `3` active collections).
- **Scheduled for future authorized batches:** Individual owning decision documents (`126` architectural decisions across Phases 3–5), `DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md`, separate `FAC-019..FAC-024` detailed files, Phase 3–5 platform capability specifications, research packages (`13`), and independent review notes (`57`).
