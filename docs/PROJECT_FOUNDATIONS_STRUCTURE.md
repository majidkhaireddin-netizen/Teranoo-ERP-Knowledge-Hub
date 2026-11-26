# Project Foundations Knowledge Structure

**Scope:** TASK-003 — Official Knowledge Ingestion & Project Foundations
**Primary Routes:** `/`, `/knowledge`, `/product-vision`, `/roadmap`, `/decisions`, `/knowledge/[slug]`

---

## 1. Separation of Progress Tracks & Metric Domains

To eliminate ambiguity between ERP product planning, ERP software implementation, and Knowledge Hub development, the platform enforces two structural separations:

### A. Dashboard Two-Strip Metric Architecture (`/`)
1. **ERP Project Status (Official Planning Reference Snapshot):**
   - `120` Approved Decisions (source-declared in `DECISION_REGISTER.md`)
   - `4 / 5` Completed Planning Phases (reviewed Phases 1–5 snapshot)
   - `4` Core Business Modules (`Finance`, `Inventory`, `Procurement`, `Sales`)
   - `54% (7/13)` Phase 5 Architectural Approval Progress (12 runtime capabilities + item 13 planning gate)
2. **Knowledge Hub Content & Ingestion Status (Strictly Derived from Registry & Manifest):**
   - `4` Published Language Records (`2` Arabic · `2` English)
   - `2` Unique Conceptual Topics (linked bilingual translations counted once across `2` active collections)
   - `0 / 6` Imported Official Full Sources
   - `6 / 6` Official Sources Awaiting Delivery (manifest & deterministic validation pipeline active)

### B. Roadmap Four Independent Progress Tracks (`/roadmap`)
The Roadmap explicitly separates four independent progress tracks that are never merged into a single percentage:
1. **ERP Product Planning:** Phases 1–4 complete; Phase 5 at 7/13 (54%) from the reviewed snapshot.
2. **ERP Engineering Implementation:** Not started.
3. **Knowledge Hub Development:** `TASK-003` (Official Ingestion Foundation) — tracks documentation platform work only.
4. **ERP Operational Readiness:** Not started.

The Roadmap model and taxonomy also structurally support non-integer phases (such as `phase-6.5`) and formal planning decision gates (such as Phase 5 item 13: `Platform Foundation Adoption`) while waiting for `PROJECT_WORK_PLAN.md` to supply post-Phase-5 details without fabricating titles or dates.

---

## 2. Product Vision Readiness Structure (`/product-vision`)

- Corrected official source identity: `teranoo-erp-planning/00-project-foundation/00_PROJECT_VISION.md` (removed the previously invented `DOC-TERANOO-VISION-REF` official identifier; internal Knowledge Hub ID `kh-doc-product-vision-ref` is used strictly as an application reference).
- Displays a live source-availability callout backed by `PROJECT_FOUNDATIONS_SOURCE_MANIFEST` (`awaiting-source`) and an 8-section ingestion readiness map clearly distinguishing verified snapshot sections (`Product Identity`, `Core Business Modules`, `Phase 5 Platform Capabilities`) from sections awaiting full `00_PROJECT_VISION.md` delivery (`Problem Statement`, `Target Audience`, `Objectives & Success Criteria`, `Future Enterprise Extensions`, `Commercial Positioning & Boundaries`).

---

## 3. Official Decision Register Foundation (`/decisions`)

- Explicitly contrasts **120** source-declared decisions in `DECISION_REGISTER.md` against the **7** verified Phase 5 references currently available locally (`D-PLAT-01` through `D-PLAT-07`).
- Provides live client-side search across decision ID, localized title, and owning phase, plus a clear notice that `DECISION_REGISTER.md` serves as an official index rather than replacing each decision's owning source document.
- Zero fabricated decision IDs or titles.

---

## 4. Knowledge Library Journey Navigation & Source Inventory (`/knowledge`)

- **Project Journey Navigation:** Interactive strip exposing all 10 educational exploration dimensions (`JOURNEY_STAGES` in `content/taxonomy/registry.ts`) with derived published record counts and an honest stage-specific empty state when a stage has no published documents yet. Explicitly labeled as Knowledge Hub educational exploration dimensions — not a replacement for official ERP planning phases.
- **Official Source Inventory (`SourceInventorySection`):** Displays all 6 verified Project Foundations official source paths, their classifications, phases, import status (`awaiting-source`), authorization status (`pending`), and completeness status, visually separated from the published Knowledge Library catalog.

---

## 5. Opt-In Educational Presentation Frame

`components/documentation/EducationalGuideFrame.tsx` provides a reusable, opt-in educational framing component (`educational` classification) structured around four optional learning prompts (*Why does this exist?*, *What problem does it solve?*, *What did Teranoo decide?*, *How does it connect to the rest of the ERP?*) for future official-plus-educational paired pages without blending official text with commentary.
