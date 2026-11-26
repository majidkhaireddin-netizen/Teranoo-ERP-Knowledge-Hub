# Official Source Batch Authoring & Import Guide

**Audience:** Project Owner, Documentation Maintainers, and Implementation Engineers
**Scope:** Repeatable procedure for ingesting authorized official Teranoo ERP Markdown batches into `content/collections/`.

---

## 1. Prerequisites Before Any Official Batch Import

Before adding an official Teranoo ERP document to `content/collections/`:

1. Confirm the file is registered in `content/manifest/sourceManifest.ts` with its exact repository-relative `sourcePath`.
2. Obtain the verbatim official Markdown file and its verified Git revision metadata (`commitSha`, `treeSha`, and `expectedGitBlobSha`) from an authorized handoff.
3. Verify explicit publication authorization **before committing any official body to this public repository (KH-023)**:
   - **CRITICAL PUBLIC REPOSITORY RULE:** Never commit unauthorized or confidential official source bodies into this public Git repository — even with `publicationStatus: "internal"`, `editorialStatus: "under-review"`, or `publicationAuthorization.authorized: false`.
   - Non-public staging and review of unauthorized files must occur strictly **outside** this public repository (for example, in a private staging workspace).
   - Application-level filtering (`authorizedForPublic: false` / `isPubliclyPublishableRecord`) is a defense-in-depth runtime/build safeguard, **not** a confidentiality mechanism for a public Git repository.
   - Only commit and publish official source bodies after explicit project-owner publication authorization (`authorizedForPublic: true`).
   - Any synthetic test fixtures committed under `content/fixtures/` must remain strictly non-sensitive.

---

## 2. Step-by-Step Repeatable Batch Workflow

1. **Verify Git Blob SHA & Generate Canonical Envelope (`KH-021` & `KH-022`)**
   - Pass the manifest entry, raw source bytes, `expectedGitBlobSha`, `verifyExpectedGitBlob: true`, and explicit `approvalStatus` (`approved`, `reference`, or `not-applicable` — never `approved` for `classification: "future"`) to `prepareCanonicalIngestionArtifact()` in `content/ingestion/ingestionPipeline.ts`.
   - Never summarize, rewrite, or silently edit the official Markdown body. If a verbatim source body contains a known stale line (such as `PROJECT_WORK_PLAN.md`), attach a separate `source.interpretationNote` in frontmatter rather than mutating the body.
   - Preserve all original official document identifiers, decision IDs (`D-*`), requirement IDs, research IDs (`R-*`), and future consideration IDs (`FAC-*`).

2. **Place Canonical Markdown Artifact in Approved Collection Directory**
   - Official documentation & approved decisions → `content/collections/official/`
   - Future architecture considerations → `content/collections/future/`
   - Research & comparative evidence → `content/collections/research/`
   - Independent reviews / advisory analyses → `content/collections/analysis/`
   - Educational guides authored by Knowledge Hub → `content/collections/educational/`
   - Never place test fixtures inside `content/collections/` (fixtures belong strictly in `content/fixtures/` and must stay synthetic and non-sensitive).

3. **Handle Relative Links and Local Images**
   - Leave original relative `.md` links intact inside official bodies; the two-pass loader automatically rewrites links to published siblings into `/knowledge/[slug]#kh-h-...` and safely marks unimported targets as non-navigating deferred references (`.kh-deferred-link`).
   - Place any authorized raster images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.avif`) strictly under `public/assets/knowledge/` and reference them via `/assets/knowledge/<filename>` or the `governedAssetMap`. Never embed raw `data:image/svg+xml` or relative paths escaping the repository root.

4. **Update the Source Manifest**
   - Update the matching entry in `content/manifest/sourceManifest.ts` with:
     - `sourceRevision` (verified commit SHA)
     - `expectedGitBlobSha` & `actualGitBlobSha` (40-char Git blob SHA-1)
     - `rawSourceSha256` (exact received raw file SHA-256) & `sourceFileHash` (canonical LF body SHA-256)
     - `lineEndingNormalization` (`none` or `crlf-to-lf`)
     - `importStatus` (`published` once authorized and committed)
     - `publicationAuthorizationStatus` (`authorized`)
     - `publishedContentId` (canonical Knowledge Hub `id`)
     - `completeness` (`complete` or `excerpt`)
     - `availableLanguages` (e.g. `['ar']` or `['ar', 'en']`)
     - `sourceVerificationStatus` (`git-blob-verified` or `git-blob-verified-lf-normalized`)

5. **Run Mandatory Verification Gate**
   ```bash
   NODE_ENV=production npm run verify
   ```
   This runs `typecheck`, `lint`, `content:validate`, all automated `node:test` suites, and the standalone Next.js production build (which re-executes `content:validate`).

---

## 3. Adding Educational Commentary Alongside Official Sources

When pairing educational explanation with an official source:

- Keep official source text visually and structurally separate from educational commentary.
- Use `components/documentation/EducationalGuideFrame.tsx` for optional structured Q&A framing ("Why does this exist?", "What problem does it solve?", "What did Teranoo decide?", "How does it connect to the rest of the ERP?") — explicitly labeled as `educational` (`تعليمي`) rather than `official`.
- Never alter or overwrite official decision text inside educational frames.
