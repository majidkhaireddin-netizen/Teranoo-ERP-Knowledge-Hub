# BATCH-002 Official Source Ingestion Report — Business Core Architecture

**Task Identifier:** `TASK-005 — Core Module Architecture & Dependencies`  
**Knowledge Collection:** `BATCH-002 — Business Core Architecture`  
**Official Repository:** `https://github.com/Alabasi1980/TeranooErp`  
**Verified Commit SHA:** `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f`  
**Verified Tree SHA:** `db531de6b2ab452578a550e07c5fd80e4bfe6b64`  
**Ingestion & Verification Date:** `2026-11-26`  
**Source Manifest Module:** `content/manifest/sourceManifest.ts` (`CORE_MODULE_ARCHITECTURE_SOURCE_MANIFEST`, merged into `OFFICIAL_SOURCE_MANIFEST`)

---

## 1. Ingestion Summary

All **10 / 10** authorized official source documents in `BATCH-002 — Business Core Architecture` were ingested verbatim into `content/collections/official/*.ar.md` from the verified repository revision (`397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f` — the exact same official commit as `BATCH-001`).

- **Body Preservation:** Every Markdown body was stored verbatim without rewriting, summarizing, renumbering, or altering official headings, tables, identifiers, or disclaimers.
- **Line-Ending Normalization:** All 10 files arrived with Windows CRLF line endings and underwent lossless `crlf-to-lf` normalization before storage. Both the raw received SHA-256 digest and the stored canonical LF SHA-256 digest are recorded in the manifest.
- **Git Blob SHA-1 Verification (KH-021):** Every raw source file was verified against its exact 40-character Git blob SHA-1 digest from tree `db531de6b2ab452578a550e07c5fd80e4bfe6b64` (`sourceVerificationStatus: "git-blob-verified-lf-normalized"`).
- **Combined Official Inventory:** Together with `BATCH-001` (`6 / 6`), the Knowledge Hub now publishes **`16 / 16`** verified official Teranoo ERP planning sources (`20` total published records when including the `2` superseded historical Product Vision summaries and `2` bilingual Knowledge Hub governance guides).
- **Governing Artifacts Completion:** All **`6 / 6`** Governing Artifacts referenced in `DECISION_REGISTER.md` (without `D-*` register IDs) are now locally published (`00_PROJECT_VISION.md` and `CROSS_PHASE_PRODUCT_GUARDRAILS.md` from BATCH-001; `FINANCE_MODULE_MODEL.md`, `INVENTORY_MODULE_MODEL.md`, `PROCUREMENT_MODULE_MODEL.md`, and `SALES_ORDER_MANAGEMENT_MODULE_MODEL.md` from BATCH-002).

---

## 2. Verified BATCH-002 Source Digest Table

| `sourceRefId` | Official `sourcePath` | `publishedContentId` | Route (`/knowledge/[slug]`) | Git Blob SHA-1 | Raw SHA-256 | Stored LF SHA-256 |
| --- | --- | --- | --- | --- | --- | --- |
| `src-cm-01-finance-module-model` | `teranoo-erp-planning/03-modules/finance/FINANCE_MODULE_MODEL.md` | `kh-doc-finance-module-model-ar` | `/knowledge/finance-module-model` | `6b76307065d851377b8e4e08cf2c2e18fc6e909e` | `88e02ca63f2181d7157b5cc07adcfa3d7561530e1b936bba0e581a005b3a6c1d` | `4638fa9334a96274a7c5ddf5ebbd2642ac435d84a00b6f1ff71877fa4399ad2b` |
| `src-cm-02-inventory-module-model` | `teranoo-erp-planning/03-modules/inventory/INVENTORY_MODULE_MODEL.md` | `kh-doc-inventory-module-model-ar` | `/knowledge/inventory-module-model` | `f440331ab3867da3cece30b55dcac2e5194a4b0a` | `185e4c862b9f46ab0fac09325294b117b46e5a532dd7d97e681c4b0ccb2c2a43` | `c28df337e23ca9cc1cb086e69b0e1a60de86a25ba55a31818881598630d66729` |
| `src-cm-03-procurement-module-model` | `teranoo-erp-planning/03-modules/procurement/PROCUREMENT_MODULE_MODEL.md` | `kh-doc-procurement-module-model-ar` | `/knowledge/procurement-module-model` | `2b45dbccfc654ccacc148a98da6bb49c838cdc50` | `ebb36396c6746c7b72bd4c2583c43972ee6adf59aa60ec5bff3f48533de5fb36` | `89c207dd693b93fae802b1b55e8424e5bcae00c0b1b67a5c28ffe5507a7e46f9` |
| `src-cm-04-sales-order-management-module-model` | `teranoo-erp-planning/03-modules/sales/SALES_ORDER_MANAGEMENT_MODULE_MODEL.md` | `kh-doc-sales-order-management-module-model-ar` | `/knowledge/sales-order-management-module-model` | `ee1a312cc856d593fe13959e9e97e3a9abfa2123` | `6d38e84dfc80421c15066128ff3d8289cadc06431eb45cb2e81a082921c4ea97` | `331bcac1def77d6114e5114d25e6c22b80adabca2246e9c2a2ea21c4544528c1` |
| `src-cm-05-dependency-model` | `teranoo-erp-planning/03-modules/DEPENDENCY_MODEL.md` | `kh-doc-dependency-model-ar` | `/knowledge/dependency-model` | `0c61cc300c7fe44f84e20dbac3a09df6d4760075` | `afefabc79219c08270c287c60bf1e9bf4800f66db4fe2653630b427d4b37e3d4` | `6ca9bff934962b679d43a881ddd343a04fe2fbe250550440bc6db982dc83d629` |
| `src-cm-06-module-dependency-matrix` | `teranoo-erp-planning/03-modules/MODULE_DEPENDENCY_MATRIX.md` | `kh-doc-module-dependency-matrix-ar` | `/knowledge/module-dependency-matrix` | `20d935eadc1680a5ad04395094ff7eaad7fbe02f` | `765fc6592febba4b48f4f510414b680e51785537fb8006bbd2614741f987765f` | `34700c3027731399dd8a3276cf41f1fa3f5bc9234453502901589f8a46c55c43` |
| `src-cm-07-module-lifecycle-rules` | `teranoo-erp-planning/03-modules/MODULE_LIFECYCLE_RULES.md` | `kh-doc-module-lifecycle-rules-ar` | `/knowledge/module-lifecycle-rules` | `ee58a40b83d6aa9bfda6a37914812bf90fbe9b54` | `5c83a4b71fbc8817ccb739674edf2de05687e7ece452ed0593abc7bedf106d87` | `48b2e498841e8f97ea88837ff249359200e8abc8531f350fe3bddfc218f07658` |
| `src-cm-08-future-module-extension-rules` | `teranoo-erp-planning/03-modules/FUTURE_MODULE_EXTENSION_RULES.md` | `kh-doc-future-module-extension-rules-ar` | `/knowledge/future-module-extension-rules` | `06b67a051b8ed749b77d385f037b3c6dd0678f74` | `98c4a1ef0e3dd40d40b5775ae3cd641530187d6bac994007ead208ad76034990` | `ed8bb75a5b227661cab1dde61607e2c125c674912bab7d63ce27ae0d89102313` |
| `src-cm-09-phase-2-assumption-safety-review` | `teranoo-erp-planning/00-project-foundation/PHASE_2_ASSUMPTION_SAFETY_REVIEW.md` | `kh-doc-phase-2-assumption-safety-review-ar` | `/knowledge/phase-2-assumption-safety-review` | `4ab31d9cf4eab595d089c256ddeeab3cec665fd0` | `64db0da5ba72ddfe9e0908280e681f4770d5136a6d5232b2131774e6254a3f45` | `e2c966713ad8970b4bd2db6ae9e30bdbdcb549d732cbfc59fcfc43848484eb26` |
| `src-cm-10-phase-2-closure-review` | `teranoo-erp-planning/00-project-foundation/PHASE_2_CLOSURE_REVIEW.md` | `kh-doc-phase-2-closure-review-ar` | `/knowledge/phase-2-closure-review` | `bee2682ad79ad9cba80a008fa44342f40d9ec1e9` | `2fd365b66cffcc07cfdc8120a4bcf017573ce8af9c0a3ce0d82f27e8dcc09cab` | `eb1a9b11debd223aae17480cc05e2c352de8fe14509dadc37de84e0234717c4b` |

---

## 3. Classification & Governance Verification

- **Document Classifications:** All 10 files carry `classification: "official"`, `approvalStatus: "approved"`, `editorialStatus: "published"`, `publicationStatus: "public"`, `publicationAuthorization.authorized: true`, and `language: "ar"` (official source bodies are written in Arabic with English technical terms and identifiers).
- **Zero Fabrication & Authority Boundary:**
  - The 34 Phase 2 source-local module decisions (`6` Finance, `8` Inventory, `9` Procurement, `11` Sales) are extracted deterministically from the 4 ingested module models and displayed separately from the `126` centralized `DECISION_REGISTER.md` architectural decisions (`KH-024`).
  - Individual Phase 3–5 owning decision documents (`0/126`) and `DECISION_GATE_A_PRIMARY_LAUNCH_MARKET.md` remain explicitly marked as awaiting later batches (`BATCH-003+`).
  - Relative Markdown links pointing to unimported Phase 3 / Phase 4 / Phase 5 files (e.g., `02-platform-architecture/*`, `01-research/*`) are safely neutralized by `content/loaders/relativeLinkResolver.ts` as non-blocking `DEFERRED_MARKDOWN_LINK` warnings while sibling BATCH-001 and BATCH-002 links resolve live to `/knowledge/[slug]`.
- **No Raw Source Attachments Exposed Publicly:** Source ingestion reads official Markdown files strictly from local ingestion workspaces; `public/` does not store raw source copies or private credentials.
