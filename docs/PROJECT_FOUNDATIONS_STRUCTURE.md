# Project Foundations Knowledge Structure

**Scope:** TASK-004 — Official Knowledge Population (`BATCH-001 — Project Foundations`)  
**Primary Routes:** `/`, `/knowledge`, `/product-vision`, `/roadmap`, `/architecture`, `/decisions`, `/future-considerations`, `/knowledge/[slug]`

---

## 1. Separation of Progress Tracks & Metric Domains

To eliminate ambiguity between ERP product planning, ERP software implementation, and Knowledge Hub development, the platform enforces two structural separations:

### A. Dashboard Two-Strip Metric Architecture (`/`)
1. **ERP Project Status (Official BATCH-001 Extracted & Reference Snapshot — `2026-11-26`):**
   - `126` Approved Architectural Decisions (`D-*`, extracted deterministically from `DECISION_REGISTER.md` — `0/126` owning decision docs imported yet; conditional `D-MKT-01` tracked separately outside the 126 counter)
   - `5 / 13` Completed Official Planning Phases (`Phases 1–5` closed; `Decision Gate A` conditionally approved; `Phase 6` next awaiting authorization)
   - `4` Core Business Modules (`Finance`, `Inventory`, `Procurement`, `Sales`)
   - `100% (13/13)` Phase 5 Architectural Approval Progress (`12` runtime capability frameworks `D-PLAT-01..12` + item 13 consolidated adoption gate `D-PLAT-13`, explicitly not counted as a 13th runtime capability)
   - `24` Non-Approved Future Architecture Considerations (`FAC-001..024`, extracted deterministically from `FUTURE_ARCHITECTURE_CONSIDERATIONS.md`)
   - **Historical Snapshot Continuity:** Preserves the earlier `2026-11-25` reference snapshot (`120` decisions, Phase 5 `7/13`, tree SHA `a922a69b54bc0cc611ae46d8e7434907cde0046a`) in `HISTORICAL_REFERENCE_SNAPSHOT` and surfaces the verified delta (`120 -> 126`, `7/13 -> 13/13`) explicitly without rewriting historical reports.
2. **Knowledge Hub Content & Ingestion Status (Strictly Derived from Registry & Manifest):**
   - `20` Published Records (`6` full official BATCH-001 sources + `10` full official BATCH-002 Core Module & Dependency sources + `2` superseded historical Product Vision summaries + `2` bilingual Knowledge Hub educational governance guides)
   - `18` Unique Conceptual Topics across `3` active collections (`official`, `future`, `educational`)
   - `16 / 16` Imported & Published Official Sources across `OFFICIAL_SOURCE_MANIFEST` (`6/6` BATCH-001 + `10/10` BATCH-002, all verified by Git blob SHA-1)

### B. Roadmap Four Independent Progress Tracks (`/roadmap`)
The Roadmap explicitly separates four independent progress tracks that are never merged into a single percentage:
1. **ERP Product Planning:** Phases 1–5 complete (`13/13`), Decision Gate A (`D-MKT-01`) approved conditionally, Phase 6 awaiting explicit authorization.
2. **ERP Engineering Implementation:** Not started.
3. **Knowledge Hub Development:** `TASK-005` (`BATCH-002 — Business Core Architecture`) building upon `TASK-004` (`BATCH-001 — Project Foundations`) — tracks documentation platform work only.
4. **ERP Operational Readiness:** Not started.

The `/roadmap` view renders all **14 official stages** (`Phase 1` through `Phase 12`, `Decision Gate A`, and mandatory exit gate `Phase 6.5`), preserves the verbatim stale-line discrepancy callout for `PROJECT_WORK_PLAN.md`, displays `Continuous Market Evidence Collection` separately as an ongoing track (`isIndependentPlanningPhase: false`), presents the official planning methodology from `WORKING_RULES.md`, discloses the `KH-025` curated projection pinned to `PROJECT_WORK_PLAN.md` canonical body SHA-256 (`df43786d50640c5574b28b7930c068697a78cecf3422b69a8ff8058e6109fa06`) with deterministic drift detection (`verified-current` vs `review-required-source-changed`), and links Phase 2 directly to published BATCH-002 evidence (`/modules`, `/dependencies`, `/knowledge/phase-2-closure-review`).

---

## 2. Product Vision Knowledge Guide (`/product-vision`)

- Backed directly by the published official document `00_PROJECT_VISION.md` (`kh-doc-project-vision-ar` -> `/knowledge/project-vision`).
- Covers all 10 official sections (identity, market problem, target customers & 4 industries, commercial positioning, 4 core modules + platform foundation, future enterprise & industry extensions, 7 core principles, product anti-goals, 10 success criteria, and historical §7.3 tenant-isolation evolution resolved in Phase 3) with explicit separation between official source facts and educational interpretation.
- Earlier bilingual reference summaries (`teranoo-product-vision-reference`, `teranoo-product-vision-reference-en`) remain preserved as `editorialStatus: "superseded"` with `supersedes` / `superseded-by` links to `kh-doc-project-vision-ar`.

---

## 3. Architecture & Cross-Phase Product Guardrails (`/architecture`)

- Combines the verified layered architecture diagram (`4` Core Business Modules over `12` approved Shared Platform Runtime Capability Frameworks — excluding gate #13 `D-PLAT-13`) with an interactive explorer for all **8 official Cross-Phase Product Guardrails** (`CROSS_PHASE_PRODUCT_GUARDRAILS.md`).
- Preserves exact official numbering (`1.` through `8.`) and titles without inventing artificial IDs like `G-01`, separates approved rules, prohibited approaches, deferred details, and labeled educational commentary, and includes 3 clearly badged **Conceptual Illustrative Diagrams** (Single-Core Customization Hierarchy, Configuration Promotion Pipeline, and AI Safety & ERP Control Boundary).
- Cross-links directly to `/modules` (Core Business Module Architecture) and `/dependencies` (Dependency Matrix, 6 CICs, 5 FLDs, 21 PCDs, and 16-combination Activation Simulator).

---

## 4. Official Decision Register (`/decisions`)

- Deterministically extracted from `DECISION_REGISTER.md` (with `KH-024` strict scope separation):
  - All **126** approved architectural `D-*` decisions (`Phase 3: 103`, `Phase 4: 10`, `Phase 5: 13`) searchable and filterable by phase and 11 decision families, with detail drawer and `?decision=<ID>` deep-linking.
  - Separate conditional market decision panel for **`D-MKT-01`** (`Approved Conditional`, outside the `126` architectural counter).
  - Separate searchable section and `?decision=<ID>` detail panel for all **34 Phase 2 Source-Local Module Decisions** (`D-FIN-01..06`, `D-INV-01..08`, `D-PRC-01..09`, `D-SLS-01..11`) extracted from BATCH-002 module models and explicitly tracked outside the centralized `126` register.
  - All **`6 / 6` Governing Artifacts** without `D-*` IDs are now locally published and live-linked (`00_PROJECT_VISION.md`, `CROSS_PHASE_PRODUCT_GUARDRAILS.md`, `FINANCE_MODULE_MODEL.md`, `INVENTORY_MODULE_MODEL.md`, `PROCUREMENT_MODULE_MODEL.md`, `SALES_ORDER_MANAGEMENT_MODULE_MODEL.md`).
  - Explicit authority boundary: `0 / 126` individual Phase 3–5 owning decision documents imported yet; zero fabricated rationales.

---

## 5. Future Architecture Considerations (`/future-considerations`)

- Deterministically extracted from `FUTURE_ARCHITECTURE_CONSIDERATIONS.md` (`classification: "future"`, `approvalStatus: "not-applicable"`):
  - Prominent mandatory non-approved banner distinguishing FAC considerations from approved ERP decisions.
  - All **24** FAC records (`FAC-001` through `FAC-024`) searchable and filterable by source status (`RESEARCH REQUIRED: 14`, `REVIEW LATER: 7`, `WATCH: 3`) with `?fac=<ID>` deep-linking.
  - Explicit indicators that separate detailed files for `FAC-019..FAC-024` are not yet imported.
  - All **7 Promoted Guardrails** (linking to `/knowledge/cross-phase-product-guardrails`) and **6 Review Rules**.
