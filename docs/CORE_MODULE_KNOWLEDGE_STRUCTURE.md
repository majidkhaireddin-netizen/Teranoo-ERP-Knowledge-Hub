# Core Business Module Knowledge Structure

**Scope:** `TASK-005 — Core Module Architecture & Dependencies (BATCH-002)`  
**Primary Routes:** `/modules`, `/modules/[moduleId]` (`finance`, `inventory-warehouse`, `procurement`, `sales-order-management`), `/decisions`  
**Extractor Module:** `content/extractors/moduleModelsExtractor.ts`

---

## 1. Authoritative Scope & Boundary

The Core Business Modules Explorer documents the **4 approved Phase 2 Core Business Module architectural models** in Teranoo ERP:

1. **Finance** (`finance`) — `kh-doc-finance-module-model-ar` (`FINANCE_MODULE_MODEL.md`)
2. **Inventory & Warehouse** (`inventory-warehouse`) — `kh-doc-inventory-module-model-ar` (`INVENTORY_MODULE_MODEL.md`)
3. **Procurement** (`procurement`) — `kh-doc-procurement-module-model-ar` (`PROCUREMENT_MODULE_MODEL.md`)
4. **Sales & Order Management** (`sales-order-management`) — `kh-doc-sales-order-management-module-model-ar` (`SALES_ORDER_MANAGEMENT_MODULE_MODEL.md`)

All four models are strictly **architectural & business-capability models**. They do not define database schemas, API payloads, UI wireframes, or operational ERP workflows — those remain deferred to later phases (`Phase 4+` / `Phase 7+`) and are explicitly surfaced as deferred boundaries inside each module page.

---

## 2. Reusable 17-Section Core Module Lifecycle Blueprint

Every Core Business Module page (`/modules/[moduleId]`) follows a unified **17-section structured knowledge blueprint** parsed deterministically from the official Arabic Markdown source document (preserving original headings, tables, identifiers, and non-fabricated gaps):

1. **Module Identity & Core Purpose** (domain identity, role in ERP, primary business problem solved)
2. **Core Business Capabilities** (in-scope operational domains)
3. **Key Domain Concepts & Entities** (business concepts — e.g., GL/Subledgers, Stock Movements, PO/GRN, Sales Orders — strictly conceptual, not DB tables)
4. **Procurement Concept Distinctions (Educational Clarification — Procurement Only)** — renders the official 6-concept distinction table (`Purchase Request`, `RFQ`, `Purchase Order`, `Goods Receipt`, `Supplier Invoice`, `Landed Cost`) with explicit separation between official definitions and educational commentary
5. **Architectural Boundaries & Out-of-Scope Exclusions** (what the module explicitly does NOT own)
6. **Data Ownership Summary** (cross-linked to `/dependencies?tab=ownership`)
7. **Platform Capability Dependencies (`PCD`)** (required vs optional platform foundations)
8. **Cross-Module Integration Contracts (`CIC`) & Future Link Definitions (`FLD`)** (deep-linked to `/dependencies?tab=matrix&cic=<ID>`)
9. **Standalone Operation Profile** (how the module behaves when activated alone or with subsets — cross-linked to `/dependencies?tab=simulator`)
10. **Source-Local Phase 2 Architectural Decisions** (`D-FIN-01..06`, `D-INV-01..08`, `D-PROC-01..09`, `D-SALES-01..11`)
11. **Activation, Freeze & Lifecycle Behavior** (cross-linked to `MODULE_LIFECYCLE_RULES.md`)
12. **Future Extension Readiness** (cross-linked to `FUTURE_MODULE_EXTENSION_RULES.md`)
13. **Deferred Design Items** (items intentionally postponed to Phase 3 / Phase 4 / Phase 5 / Phase 7+)
14. **Cross-Phase Guardrail Alignment** (`CROSS_PHASE_PRODUCT_GUARDRAILS.md` & `G-ASSUMP-01..07`)
15. **Related Official Documents & Governing Artifacts**
16. **Complete Verbatim Official Source Access** (direct link to `/knowledge/[slug]`)
17. **Source Provenance & Verification Metadata** (commit SHA, Git blob SHA-1, SHA-256 digest, verification status)

---

## 3. Phase 2 Source-Local Decisions Separation (`KH-024`)

To protect the integrity of the centralized Decision Register (`DECISION_REGISTER.md`), the Knowledge Hub enforces an explicit numeric and visual boundary between two distinct decision scopes:

| Scope | Source | Verified Count | Breakdown |
| --- | --- | --- | --- |
| **Centralized Architectural Decision Register** | `DECISION_REGISTER.md` (Phases 3–5) | **126** | Phase 3 (`103`), Phase 4 (`10`), Phase 5 (`13`) — owning docs `0/126` imported yet |
| **Conditional Market Gate Decision** | `DECISION_REGISTER.md` (Decision Gate A) | **1** (`D-MKT-01`) | Tracked separately outside the `126` architectural counter |
| **Phase 2 Source-Local Module Decisions** | 4 Module Models (`BATCH-002`) | **34** | Finance `D-FIN-01..06` (`6`), Inventory `D-INV-01..08` (`8`), Procurement `D-PROC-01..09` (`9`), Sales `D-SALES-01..11` (`11`) |

- Every Phase 2 decision is extracted deterministically by `extractCoreModuleModels()` and linked bidirectionally between `/modules/[moduleId]`, `/decisions?decision=<ID>`, and Global Search (`Ctrl+K`).
- The centralized `126` counter is never inflated to `160` (`126 + 34`) or `127` (`126 + D-MKT-01`).

---

## 4. Roadmap Continuity & Phase 2 Evidence (`KH-025`)

- `content/extractors/roadmapExtractor.ts` pins the curated roadmap projection to commit `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f` and the canonical LF-normalized body SHA-256 of `PROJECT_WORK_PLAN.md` (`df43786d50640c5574b28b7930c068697a78cecf3422b69a8ff8058e6109fa06`).
- If the official `PROJECT_WORK_PLAN.md` body or revision changes, `mappingFreshnessStatus` deterministically flips from `verified-current` to `review-required-source-changed` and renders an explicit drift banner on `/roadmap`.
- Phase 2 on `/roadmap` links directly to the published BATCH-002 evidence (`/modules`, `/dependencies`, `/knowledge/phase-2-closure-review`, `/knowledge/phase-2-assumption-safety-review`).

---

## 5. Curated Module Projection Provenance & Drift Detection (`KH-028` / `FIX-02-R01`)

`content/extractors/moduleModelsExtractor.ts` strictly separates **deterministic source extraction** from **manually curated educational projections** inside `CORE_MODULE_CONFIGS`:

- **Deterministic Official Extraction (`DETERMINISTIC_MODULE_EXTRACTION_FIELDS`):** `decisions`, `requiredPcds`, `conditionalPcds`, `explicitExclusions`, and `deferredDesignItems` are parsed verbatim from each official module Markdown body on every load.
- **Curated Educational Projections (`CURATED_MODULE_PROJECTION_FIELDS`):** Bilingual summaries (`identitySummary`, `standaloneSummary`, `criticalLimitation`, `responsibilities`, `standaloneCapabilities`, `ownedDataDomains`, `sharedReferencesConsumed`, `educationalComparisonRows`) are explicitly pinned in `CURATED_MODULE_PROJECTION_PINS` to commit `397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f` and the exact canonical stored-body SHA-256 of each authoritative module model document.
- **Automatic Drift Detection:** If an authoritative module document's revision or canonical body SHA-256 changes, `projectionMetadata.mappingFreshnessStatus` deterministically flips from `verified-current` to `review-required-source-changed`, populates `reviewWarning`, and surfaces a prominent danger-styled freshness alert on `/modules` and `/modules/[moduleId]` so stale curated projections never silently present themselves as verified current knowledge.
- **UI Provenance Separation:** `/modules/[moduleId]` explicitly badges deterministic verbatim sections (`Official Extraction` / `Deterministic Verbatim Source Extraction`) separately from curated educational summaries (`Curated Educational Projection` / `Curated Educational Table`).

---

## 6. Official ERP vs. Knowledge Hub Internal Identifier Classification (`KH-032` / `FIX-02-R05`)

| Identifier Pattern | Scope (`IdentifierScope`) | Origin & Governance Rule |
| --- | --- | --- |
| `D-*` (`D-FIN-*`, `D-INV-*`, `D-PROC-*`, `D-SALES-*`, `D-MKT-01`, Phase 3–5 `D-*`) | `official-erp` | Official Teranoo ERP decision identifiers defined verbatim in authoritative planning documents. |
| `CIC-CORE-*` (`CIC-CORE-INV-FIN-001`, etc.) | `official-erp` | Official Core Conditional Integration Contract IDs defined in `MODULE_DEPENDENCY_MATRIX.md §5`. |
| `FAC-001..024`, `G-ASSUMP-01..07` | `official-erp` | Official Future Architecture Consideration and Assumption Safety Guardrail identifiers. |
| `MOD-FIN`, `MOD-INV`, `MOD-PROC`, `MOD-SALES` | `knowledge-hub-internal` | Knowledge Hub internal display codes for Core Business Modules (not official ERP IDs). |
| `FLD-CORE-01..05` | `knowledge-hub-internal` | Knowledge Hub internal row reference identifiers for `MODULE_DEPENDENCY_MATRIX.md §6` (the official table defines no `FLD-*` IDs). |
| `OWN-CORE-01..15` | `knowledge-hub-internal` | Knowledge Hub internal row reference identifiers for `MODULE_DEPENDENCY_MATRIX.md §8` Data Ownership rows. |
| `kh-*` (`kh-doc-*`, `kh-src-*`, `kh-h-*`) | `knowledge-hub-internal` | Knowledge Hub internal document, manifest, and heading-anchor identifiers. |
