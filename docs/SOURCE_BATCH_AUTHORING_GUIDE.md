# Official Source Batch Authoring & Import Guide

**Audience:** Project Owner, Documentation Maintainers, and Implementation Engineers
**Scope:** Repeatable procedure for ingesting authorized official Teranoo ERP Markdown batches into `content/collections/`.

---

## 1. Prerequisites Before Any Official Batch Import

Before adding an official Teranoo ERP document to `content/collections/`:

1. Confirm the file is registered in `content/manifest/sourceManifest.ts` with its exact repository-relative `sourcePath`.
2. Obtain the verbatim official Markdown file and its Git revision metadata (`commitSha` or `treeSha`) from an authorized handoff.
3. Verify explicit publication authorization:
   - If **not yet authorized for public display**, import with `authorizedForPublic: false` (`publicationStatus: "internal"`, `editorialStatus: "under-review"`, `publicationAuthorization.authorized: false`). It will be validated but excluded from public routes, catalogs, and search.
   - Only set `authorizedForPublic: true` when explicitly approved for public Knowledge Hub display.

---

## 2. Step-by-Step Repeatable Batch Workflow

1. **Compute Source Provenance & Generate Canonical Envelope**
   - Pass the manifest entry and verbatim official Markdown body to `prepareCanonicalIngestionArtifact()` in `content/ingestion/ingestionPipeline.ts`.
   - Never summarize, rewrite, or silently edit the official Markdown body.
   - Preserve all original official document identifiers, decision IDs (`D-*`), requirement IDs, research IDs (`R-*`), and future consideration IDs (`FAC-*`).

2. **Place Canonical Markdown Artifact in Approved Collection Directory**
   - Official documentation & approved decisions → `content/collections/official/`
   - Future architecture considerations → `content/collections/future/`
   - Research & comparative evidence → `content/collections/research/`
   - Independent reviews / advisory analyses → `content/collections/analysis/`
   - Educational guides authored by Knowledge Hub → `content/collections/educational/`
   - Never place test fixtures inside `content/collections/` (fixtures belong strictly in `content/fixtures/`).

3. **Handle Relative Links and Local Images**
   - Leave original relative `.md` links intact inside official bodies; the two-pass loader automatically rewrites links to published siblings into `/knowledge/[slug]#kh-h-...` and safely marks unimported targets as non-navigating deferred references (`.kh-deferred-link`).
   - Place any authorized raster images (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.avif`) strictly under `public/assets/knowledge/` and reference them via `/assets/knowledge/<filename>` or the `governedAssetMap`. Never embed raw `data:image/svg+xml` or relative paths escaping the repository root.

4. **Update the Source Manifest**
   - Update the matching entry in `content/manifest/sourceManifest.ts` with:
     - `sourceFileHash` (from `computeSourceSha256`)
     - `sourceRevision` (verified commit/tree SHA)
     - `importStatus` (`validated` if internal-only, or `published` if publicly authorized)
     - `publicationAuthorizationStatus` (`pending` or `authorized`)
     - `publishedContentId` (`null` if internal, or the canonical Knowledge Hub `id` if published)
     - `completeness` (`complete` or `excerpt`)
     - `availableLanguages` (e.g. `['ar']` or `['ar', 'en']`)
     - `sourceVerificationStatus` (`hash-verified` or `verified`)

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
