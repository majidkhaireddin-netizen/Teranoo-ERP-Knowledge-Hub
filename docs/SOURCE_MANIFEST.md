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
| `sourceRevision` | commit/tree SHA (`>= 7` chars) or `null` | Verified Git revision where known. |
| `sourceFileHash` | 64-char SHA-256 hex or `null` | Deterministic SHA-256 hash of supplied source body once received. |
| `classification` | 8-value `ContentClassificationType` | Authoritative classification (`official`, `future`, etc.). |
| `expectedContentType` | 35-value `ContentTypeId` | Target Knowledge Hub content type upon ingestion. |
| `phaseRef` | `phase-N` or `phase-N.M` (supports `phase-6.5`) | Owning official planning phase. |
| `importStatus` | `SourceImportStatus` | Current ingestion lifecycle state. |
| `publicationAuthorizationStatus` | `pending` \| `authorized` \| `restricted` | Explicit public display authorization state. |
| `publishedContentId` | string or `null` | Canonical Knowledge Hub record ID (must be `null` until `importStatus === "published"`). |
| `referenceSummaryContentId` | string or `null` (optional) | Optional link to a snapshot-derived reference summary while awaiting the full file. |
| `completeness` | `not-imported` \| `reference-summary-only` \| `excerpt` \| `complete` | Honest completeness indicator. |
| `availableLanguages` | `('ar' \| 'en' \| 'mixed')[]` | Languages actually imported (`[]` when not yet imported). |
| `sourceVerificationStatus` | `path-verified-awaiting-body` \| `hash-verified` \| `verified` \| `unverified` | Provenance verification level. |
| `authorityNote` | `{ ar, en }` (optional) | Explicit boundary note (e.g., Decision Register index vs owning documents). |

---

## 3. Registered Project Foundations Inventory (`PROJECT_FOUNDATIONS_SOURCE_MANIFEST`)

| `sourceRefId` | Verified Official `sourcePath` | Classification | `importStatus` | `publicationAuthorizationStatus` | `publishedContentId` | `completeness` |
| --- | --- | --- | --- | --- | --- | --- |
| `src-pf-01-project-vision` | `teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md` | `official` | `awaiting-source` | `pending` | `null` | `reference-summary-only` |
| `src-pf-02-project-work-plan` | `teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md` | `official` | `awaiting-source` | `pending` | `null` | `not-imported` |
| `src-pf-03-working-rules` | `teranoo-erp-planning/00-project-foundation/WORKING_RULES.md` | `official` | `awaiting-source` | `pending` | `null` | `not-imported` |
| `src-pf-04-cross-phase-guardrails` | `teranoo-erp-planning/00-project-foundation/CROSS_PHASE_PRODUCT_GUARDRAILS.md` | `official` | `awaiting-source` | `pending` | `null` | `not-imported` |
| `src-pf-05-decision-register` | `teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md` | `official` | `awaiting-source` | `pending` | `null` | `not-imported` |
| `src-pf-06-future-architecture-considerations` | `teranoo-erp-planning/00-project-foundation/FUTURE_ARCHITECTURE_CONSIDERATIONS.md` | `future` | `awaiting-source` | `pending` | `null` | `not-imported` |

---

## 4. Automated Manifest Validation Rules (`validateSourceManifest`)

`validateSourceManifest()` enforces the following fatal checks during `npm run content:validate` and `npm run build`:

1. Schema compliance for every entry (`INVALID_MANIFEST_ENTRY`).
2. Unique `sourceRefId` (`DUPLICATE_SOURCE_REF_ID`).
3. Unique `repository::sourcePath` mapping (`DUPLICATE_SOURCE_PATH`).
4. Unique `publishedContentId` mapping (`DUPLICATE_PUBLISHED_MAPPING`).
5. Provenance completeness (`MISSING_SOURCE_PROVENANCE`, `INCONSISTENT_SOURCE_COMPLETENESS`) whenever `importStatus` is `source-received`, `validated`, `imported`, or `published`.
6. Strict publication gating (`UNAUTHORIZED_SOURCE_PUBLICATION`, `MISSING_PUBLISHED_CONTENT_ID`, `UNRESOLVED_PUBLISHED_CONTENT_ID`, `MISSING_AVAILABLE_LANGUAGES`, `UNPUBLISHED_SOURCE_HAS_CONTENT_ID`).
7. Non-blocking `SOURCE_AWAITING_DELIVERY` warnings for entries awaiting official file delivery.
