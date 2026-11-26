# Dependency Explorer & Activation Simulator Specification

**Scope:** `TASK-005 — Core Module Architecture & Dependencies (BATCH-002)`  
**Primary Route:** `/dependencies`  
**Extractor Module:** `content/extractors/dependencyArchitectureExtractor.ts`  
**Simulator Module:** `content/simulators/moduleActivationSimulator.ts`  
**Feature Views:** `features/dependencies/` (`DependenciesArchitectureView.tsx`, `DependencyMatrixExplorer.tsx`, `ModuleActivationSimulatorView.tsx`, `DataOwnershipAndScenariosView.tsx`, `LifecycleExtensionsReviewsView.tsx`)

---

## 1. Architecture Overview

The Dependencies & Integration Architecture Center (`/dependencies`) transforms six official Phase 2 governance documents into a structured, interactive architectural workspace backed 100% by deterministic extraction from verbatim ingested Markdown:

- `DEPENDENCY_MODEL.md` (`kh-doc-dependency-model-ar`)
- `MODULE_DEPENDENCY_MATRIX.md` (`kh-doc-module-dependency-matrix-ar`)
- `MODULE_LIFECYCLE_RULES.md` (`kh-doc-module-lifecycle-rules-ar`)
- `FUTURE_MODULE_EXTENSION_RULES.md` (`kh-doc-future-module-extension-rules-ar`)
- `PHASE_2_ASSUMPTION_SAFETY_REVIEW.md` (`kh-doc-phase-2-assumption-safety-review-ar`)
- `PHASE_2_CLOSURE_REVIEW.md` (`kh-doc-phase-2-closure-review-ar`)

### Supported URL Query Deep-Linking
- `?tab=<matrix|model|simulator|ownership|scenarios|lifecycle|extensions|reviews>` — selects active workspace tab directly.
- `?cic=<CIC-ID>` — focuses and opens the exact Cross-Module Integration Contract detail panel inside the Matrix tab (e.g., `?tab=matrix&cic=CIC-CORE-INV-FIN-001`).
- `?type=<HBMD|PCD|CIC|FLD>` — highlights a specific dependency classification in the Model tab.

---

## 2. Eight Workspace Tabs

| Tab ID | Official Backing Document(s) | Extracted Structured Artifacts |
| --- | --- | --- |
| `matrix` | `MODULE_DEPENDENCY_MATRIX.md` | 4×4 interactive module matrix (`0 HBMD`, `0 cycles`, `12` verified absence rows), all **6 Core CICs** (`CIC-CORE-*`) with full **16-field contract metadata** (ID + 15 official attributes), **5 Future Link Definitions (`FLD`)**, and **21 Platform Capability Dependencies (`PCD`)**. |
| `model` | `DEPENDENCY_MODEL.md` | **4 formal dependency classifications** (`HBMD`, `PCD`, `CIC`, `FLD`), **12 architectural governance rules**, and allowed vs prohibited dependency patterns. |
| `simulator` | `MODULE_DEPENDENCY_MATRIX.md` + `MODULE_LIFECYCLE_RULES.md` | Interactive **Module Activation & Integration Simulator** covering all **16 (`2⁴`)** Core Module combinations plus **6 Platform PCD availability toggles** and preset deployment profiles. |
| `ownership` | `MODULE_DEPENDENCY_MATRIX.md` | **15 authoritative Data Ownership rows** mapping owning module, read consumers, write exclusivity, and **4 explicitly deferred ownership boundaries**. |
| `scenarios` | `MODULE_DEPENDENCY_MATRIX.md` | **10 end-to-end architectural consistency & cross-module scenario checks** verifying standalone and integrated behavior. |
| `lifecycle` | `MODULE_LIFECYCLE_RULES.md` | **3 formal module lifecycle states** (`Inactive`, `Active`, `Frozen`), **`Freeze, not Delete`** historical integrity principle, activation/freeze/reactivation rules, and **8 compatibility review checks**. |
| `extensions` | `FUTURE_MODULE_EXTENSION_RULES.md` | Extension isolation rules, zero-core-modification rule, future module onboarding contract rules, and FLD activation prerequisites. |
| `reviews` | `PHASE_2_ASSUMPTION_SAFETY_REVIEW.md` + `PHASE_2_CLOSURE_REVIEW.md` | **7 Assumption Safety Guardrails (`G-ASSUMP-01..07`)**, **12 Phase 3 architectural handoffs**, and **13 Phase 2 closure exit criteria**. |

---

## 3. Interactive Module Activation Simulator Specification

### Deterministic Rules (`content/simulators/moduleActivationSimulator.ts`)
1. **Zero Hard Business Module Dependencies (`0 HBMD`):** Every non-empty subset of `{Finance, Inventory, Procurement, Sales}` is architecturally **activatable** provided required Platform Capability Dependencies (`PCD`) are available. No Core Business Module blocks another Core Business Module from activating.
2. **Exact Combinatorial Coverage (`16` States):** Evaluates all `2⁴ = 16` combinations (`0` to `4` active modules), returning per-module status (`activatable`, `blocked-by-pcd`, `inactive`), active vs inactive CIC list (among the `6` Core CICs), operating mode (standalone vs integrated), and disabled cross-module flows.
3. **Platform Capability Dependency (`PCD`) Simulation:** Allows toggling 6 shared platform foundations (e.g., Identity/Tenant, Master Data, Document Numbering, Audit/Events, Currency/Tax, Workflow/Approvals) to demonstrate why **PCD** is a true structural dependency while business modules remain mutually independent.
4. **Mandatory Educational Disclaimer:** Every simulator view renders an explicit, non-dismissible badge and notice stating that this is an **Illustrative Architectural Simulation** derived from Phase 2 rules — **not** an operational ERP tenant configuration tool or live runtime deployment engine.

---

## 4. Unified Global Search Integration

`content/search/knowledgeSearch.ts` indexes all BATCH-002 structured entities alongside BATCH-001 records:
- All **4** Core Business Modules
- All **34** Phase 2 Source-Local Decisions (`D-FIN-*`, `D-INV-*`, `D-PRC-*`, `D-SLS-*`)
- All **6** Core CICs (`CIC-CORE-*`) & **5** FLDs (`FLD-*`)
- All **4** Dependency Types (`HBMD`, `PCD`, `CIC`, `FLD`)
- Module Lifecycle states & **`Freeze, not Delete`** principle
- All **15** Data Ownership objects
- All **7** Phase 2 Assumption Safety Guardrails (`G-ASSUMP-01..07`)
- Exact-ID structured entity hits score `110` (above multi-entity document hits at `100`) so exact ID queries such as `D-FIN-01` or `CIC-CORE-INV-FIN-001` rank first deterministically.
