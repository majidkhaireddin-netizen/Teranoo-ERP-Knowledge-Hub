# Official Source Manifest Specification

**Module:** `content/manifest/sourceManifest.ts`
**Types:** `content/models/knowledge.ts`
**Validation Hook:** Integrated into `validateApprovedCollections()` and `npm run content:validate`

---

## 1. Purpose

The Source Manifest provides an authoritative, machine-validated inventory of official Teranoo ERP planning sources expected by the Knowledge Hub. It strictly separates **Source Import Status** (`expected`, `awaiting-source`, `source-received`, `validated`, `imported`, `published`, `rejected`) from **Official ERP Approval Status** and **Publication Authorization Status** (`pending`, `authorized`, `restricted`).

---

## 2. Manifest Entry Schema (`sourceManifestEntrySchema`)

Each entry is validated by Zod (`sourceManifestEntrySchema`):

| Field | Type / Constraint | Purpose |
| --- | --- | --- |
| `sourceRefId` | lowercase kebab-case string (unique) | Stable manifest inventory identifier (e.g., `src-pf-01-project-vision`). |
| `repository` | safe `http(s)` URL | Official source repository URL (`https://github.com/Alabasi1980/TeranooErp`). |
| `sourcePath` | normalized repo-relative POSIX path (unique per repo) | Exact verified path inside the official repository (no leading `/`, no `..`, no `\`). |
| `title` | `{ ar, en }` | Localized display title for inventory tables and status banners. |
| `purpose` | `{ ar, en }` | Concise verified scope description of the official source file. |
| `sourceRevision` | commit SHA (`397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f`) or `null` | Verified official Git commit SHA. |
| `expectedGitBlobSha` / `actualGitBlobSha` | 40-char Git blob SHA-1 hex or `null` | Exact Git blob SHA-1 digest verified against the official repository tree (`db531de6b2ab452578a550e07c5fd80e4bfe6b64`). |
| `rawSourceSha256` | 64-char SHA-256 hex or `null` | Deterministic SHA-256 hash of exact received source bytes. |
| `sourceFileHash` | 64-char SHA-256 hex or `null` | Deterministic SHA-256 hash of stored canonical LF-normalized body. |
| `lineEndingNormalization` | `none` \| `crlf-to-lf` | Explicit record of lossless CRLF → LF normalization during ingestion. |
| `classification` | 8-value `ContentClassificationType` | Authoritative classification (`official`, `future`, etc.). |
| `expectedContentType` | 35-value `ContentTypeId` | Target Knowledge Hub content type upon ingestion. |
| `phaseRef` | `phase-N` or `phase-N.M` (supports `phase-6.5`) | Owning official planning phase. |
| `importStatus` | `SourceImportStatus` | Current ingestion lifecycle state (`published` for all 16 BATCH-001 + BATCH-002 files). |
| `publicationAuthorizationStatus` | `pending` \| `authorized` \| `restricted` | Explicit public display authorization state. |
| `publishedContentId` | string or `null` | Canonical Knowledge Hub record ID (must be `null` until `importStatus === "published"`). |
| `referenceSummaryContentId` | string or `null` (optional) | Optional link to superseded historical snapshot-derived reference summary. |
| `completeness` | `not-imported` \| `reference-summary-only` \| `excerpt` \| `complete` | Honest completeness indicator. |
| `availableLanguages` | `('ar' \| 'en' \| 'mixed')[]` | Languages actually imported. |
| `sourceVerificationStatus` | `path-verified-awaiting-body` \| `source-received` \| `digest-calculated` \| `git-blob-verified` \| `git-blob-verified-lf-normalized` \| `git-blob-mismatch` \| `unverified` | KH-021 granular provenance verification level. |
| `authorityNote` | `{ ar, en }` (optional) | Explicit boundary note (e.g., Decision Register index vs owning documents; stale line note). |

---

## 3. Registered Project Foundations Inventory (`PROJECT_FOUNDATIONS_SOURCE_MANIFEST` — BATCH-001)

Reference Commit SHA: `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f`  
Reference Tree SHA: `db531de6b2ab452578a550e07c5fd80e4bfe6b64`

| `sourceRefId` | Verified Official `sourcePath` | Classification | `importStatus` | `publishedContentId` | Verified Git Blob SHA-1 | `sourceVerificationStatus` |
| --- | --- | --- | --- | --- | --- | --- |
| `src-pf-01-project-vision` | `teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md` | `official` | `published` | `kh-doc-project-vision-ar` | `7206f4d747e8befc0d47400a666850aa259b7055` | `git-blob-verified-lf-normalized` |
| `src-pf-02-project-work-plan` | `teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md` | `official` | `published` | `kh-doc-project-work-plan-ar` | `14e0b4a2068d10d2ecb07d7e9bcf4364e824fd43` | `git-blob-verified-lf-normalized` |
| `src-pf-03-working-rules` | `teranoo-erp-planning/00-project-foundation/WORKING_RULES.md` | `official` | `published` | `kh-doc-working-rules-ar` | `e943101df8f21092d685fdda2af2e5bdad0166e5` | `git-blob-verified-lf-normalized` |
| `src-pf-04-cross-phase-guardrails` | `teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md` | `official` | `published` | `kh-doc-cross-phase-guardrails-ar` | `05dc98f61b79f0436c395de8c06650c723476e48` | `git-blob-verified-lf-normalized` |
| `src-pf-05-decision-register` | `teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md` | `official` | `published` | `kh-doc-decision-register-ar` | `0260f1469825ee45777be4bfd6460a45960108ea` | `git-blob-verified-lf-normalized` |
| `src-pf-06-future-architecture-considerations` | `teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md` | `future` | `published` | `kh-doc-future-architecture-considerations-ar` | `f8158524f5cb44bd79f1f4c6d6e8bcc59853d7d5` | `git-blob-verified-lf-normalized` |

---

## 4. Registered Core Module Architecture Inventory (`CORE_MODULE_ARCHITECTURE_SOURCE_MANIFEST` — BATCH-002)

Reference Commit SHA: `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f`  
Reference Tree SHA: `db531de6b2ab452578a550e07c5fd80e4bfe6b64`  
Combined Authoritative Manifest: `OFFICIAL_SOURCE_MANIFEST` (`16 / 16` verified official sources = `6` BATCH-001 + `10` BATCH-002)

| `sourceRefId` | Verified Official `sourcePath` | Classification | `importStatus` | `publishedContentId` | Verified Git Blob SHA-1 | `sourceVerificationStatus` |
| --- | --- | --- | --- | --- | --- | --- |
| `src-cm-01-finance-module-model` | `teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md` | `official` | `published` | `kh-doc-finance-module-model-ar` | `6b76307065d851377b8e4e08cf2c2e18fc6e909e` | `git-blob-verified-lf-normalized` |
| `src-cm-02-inventory-module-model` | `teranoo-erp-planning/03-modules/inventory/INVENTORY_MODULE_MODEL.md` | `official` | `published` | `kh-doc-inventory-module-model-ar` | `f440331ab3867da3cece30b55dcac2e5194a4b0a` | `git-blob-verified-lf-normalized` |
| `src-cm-03-procurement-module-model` | `teranoo-erp-planning/03-modules/procurement/PROCUREMENT_MODULE_MODEL.md` | `official` | `published` | `kh-doc-procurement-module-model-ar` | `2b45dbccfc654ccacc148a98da6bb49c838cdc50` | `git-blob-verified-lf-normalized` |
| `src-cm-04-sales-order-management-module-model` | `teranoo-erp-planning/03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md` | `official` | `published` | `kh-doc-sales-order-management-module-model-ar` | `ee1a312cc856d593fe13959e9e97e3a9abfa2123` | `git-blob-verified-lf-normalized` |
| `src-cm-05-dependency-model` | `teranoo-erp-planning/03-modules/DEPENDENCY_MODEL.md` | `official` | `published` | `kh-doc-dependency-model-ar` | `0c61cc300c7fe44f84e20dbac3a09df6d4760075` | `git-blob-verified-lf-normalized` |
| `src-cm-06-module-dependency-matrix` | `teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md` | `official` | `published` | `kh-doc-module-dependency-matrix-ar` | `20d935eadc1680a5ad04395094ff7eaad7fbe02f` | `git-blob-verified-lf-normalized` |
| `src-cm-07-module-lifecycle-rules` | `teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md` | `official` | `published` | `kh-doc-module-lifecycle-rules-ar` | `ee58a40b83d6aa9bfda6a37914812bf90fbe9b54` | `git-blob-verified-lf-normalized` |
| `src-cm-08-future-module-extension-rules` | `teranoo-erp-planning/03-modules/FUTURE_MODULE_EXTENSION_RULES.md` | `official` | `published` | `kh-doc-future-module-extension-rules-ar` | `06b67a051b8ed749b77d385f037b3c6dd0678f74` | `git-blob-verified-lf-normalized` |
| `src-cm-09-phase-2-assumption-safety-review` | `teranoo-erp-planning/00-project-foundation/PHASE_2_ASSUMPTION_SAFETY_REVIEW.md` | `official` | `published` | `kh-doc-phase-2-assumption-safety-review-ar` | `4ab31d9cf4eab595d089c256ddeeab3cec665fd0` | `git-blob-verified-lf-normalized` |
| `src-cm-10-phase-2-closure-review` | `teranoo-erp-planning/00-project-foundation/PHASE_2_CLOSURE_REVIEW.md` | `official` | `published` | `kh-doc-phase-2-closure-review-ar` | `bee2682ad79ad9cba80a008fa44342f40d9ec1e9` | `git-blob-verified-lf-normalized` |

---

## 5. Automated Manifest Validation Rules (`validateSourceManifest`)

`validateSourceManifest()` enforces the following fatal checks across `OFFICIAL_SOURCE_MANIFEST` during `npm run content:validate` and `npm run build`:

1. Schema compliance for every entry (`INVALID_MANIFEST_ENTRY`).
2. Unique `sourceRefId` (`DUPLICATE_SOURCE_REF_ID`).
3. Unique `repository::sourcePath` mapping (`DUPLICATE_SOURCE_PATH`).
4. Unique `publishedContentId` mapping (`DUPLICATE_PUBLISHED_MAPPING`).
5. Provenance completeness (`MISSING_SOURCE_PROVENANCE`, `INCONSISTENT_SOURCE_COMPLETENESS`) whenever `importStatus` is `source-received`, `validated`, `imported`, or `published`.
6. Strict publication gating (`UNAUTHORIZED_SOURCE_PUBLICATION`, `MISSING_PUBLISHED_CONTENT_ID`, `UNRESOLVED_PUBLISHED_CONTENT_ID`, `MISSING_AVAILABLE_LANGUAGES`, `UNPUBLISHED_SOURCE_HAS_CONTENT_ID`).
7. Non-blocking `SOURCE_AWAITING_DELIVERY` warnings for entries awaiting official file delivery.
