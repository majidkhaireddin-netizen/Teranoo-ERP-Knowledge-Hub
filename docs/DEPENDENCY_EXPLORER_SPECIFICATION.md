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
| `matrix` | `MODULE_DEPENDENCY_MATRIX.md` | 4×4 interactive module matrix (`0 HBMD`, `0 cycles`, `12` verified absence rows), all **6 Core CICs** (`CIC-CORE-*`) with full **16-field contract metadata** (ID + 15 official attributes), **5 Feature-Level Dependencies (`FLD`)**, and **21 Platform Capability Dependencies (`PCD`)**. |
| `model` | `DEPENDENCY_MODEL.md` | **4 formal dependency classifications** (`HBMD`, `PCD`, `CIC`, `FLD`), **12 architectural governance rules**, and allowed vs prohibited dependency patterns. |
| `simulator` | `MODULE_DEPENDENCY_MATRIX.md` + `MODULE_LIFECYCLE_RULES.md` | Source-backed **Module Activation & Dependency Simulator** (`TASK-005-FIX-01`) covering all **16 (`2⁴`)** Core Module combinations, **21-row PCD Matrix** gating, tri-state CIC readiness controls (§6), and 4-dimensional FLD checks (§5). |
| `ownership` | `MODULE_DEPENDENCY_MATRIX.md` | **15 authoritative Data Ownership rows** mapping owning module, read consumers, write exclusivity, and **4 explicitly deferred ownership boundaries**. |
| `scenarios` | `MODULE_DEPENDENCY_MATRIX.md` | **10 end-to-end architectural consistency & cross-module scenario checks** verifying standalone and integrated behavior. |
| `lifecycle` | `MODULE_LIFECYCLE_RULES.md` | **3 formal module lifecycle states** (`Inactive`, `Active`, `Frozen`), **`Freeze, not Delete`** historical integrity principle, activation/freeze/reactivation rules, and **8 compatibility review checks**. |
| `extensions` | `FUTURE_MODULE_EXTENSION_RULES.md` | Extension isolation rules, zero-core-modification rule, future module onboarding contract rules, and FLD activation prerequisites. |
| `reviews` | `PHASE_2_ASSUMPTION_SAFETY_REVIEW.md` + `PHASE_2_CLOSURE_REVIEW.md` | **7 Assumption Safety Guardrails (`G-ASSUMP-01..07`)**, **12 Phase 3 architectural handoffs**, and **13 Phase 2 closure exit criteria**. |

---

## 3. Interactive Module Activation Simulator Specification (`TASK-005-FIX-01`)

### Authoritative Input & Semantic Rules (`content/simulators/moduleActivationSimulator.ts`)
1. **Zero Duplicated Dependency Catalogs (`FIX-01-R01`):** The simulator is pure and client-safe (no `fs` imports). It consumes `DependencySimulationCatalog` directly from the validated `ExtractedDependencyArchitecture['matrix']` passed by the `/dependencies` Server Component and executes `validateSimulatorCatalogConsistency()` on every run to fail loud on any CIC, FLD, PCD, or HBMD drift.
2. **Base Activation & Explicit Scope Boundary (`FIX-01-R02`):** Preserves `0 Core HBMD` standalone module activation while gating base activation directly from `R` (Required) rows in the official 21-row PCD Matrix (`MODULE_DEPENDENCY_MATRIX.md §7.2`). Explicitly separates evaluated conditions (`PCD: Required`, `0 HBMD`, `CIC/FLD` non-blocking) from out-of-scope activation conditions (`MODULE_LIFECYCLE_RULES.md §4`: Entitlement, Phase 3 org/context references, runtime Security/Roles/Audit provisioning, and minimum module configuration baseline).
3. **Multi-State CIC Readiness (`FIX-01-R03`):** Never marks a CIC "Ready" merely because both participating modules are active. Explicitly distinguishes `modulePrerequisiteStatus` (`participating-modules-unavailable` vs `architectural-module-prerequisites-satisfied`) from `readinessStatus` (`participating-modules-unavailable`, `contract-or-scenario-not-enabled`, `contract-prerequisites-not-satisfied`, `readiness-not-established-insufficient-info`, `evaluated-conceptual-prerequisites-satisfied`) using verbatim official `Required Preconditions`, `Activation Condition`, `Contract Owner` (`TBD — Phase 5`), and deferred functional boundaries.
4. **4-Dimensional FLD Evaluation (`FIX-01-R04`):** Evaluates each of the 5 Core FLDs across four separate dimensions (`requiredModulesAvailable`, `featureDependencyPrerequisitesSatisfied` including conditional PCDs and linked CICs per `§5`, `featureConfiguredState`, and constant `fullFunctionalBehaviorSpecified: false` for Phase 2), preserving `Feature Owner: Deferred` on `Three-Way Match` (`FLD-CORE-05`) and the deferred invoice generation boundary on `Customer Billing` (`FLD-CORE-02`).
5. **UI Accuracy & Traceability (`FIX-01-R05`):** Renders conservative defaults (`Unknown` + deferred boundaries treated as unresolved), zero unqualified `Ready` / `Available` / `جاهز` / `متاحة` badges, clickable links to `MODULE_DEPENDENCY_MATRIX.md` and `MODULE_LIFECYCLE_RULES.md`, verbatim official excerpts, official Decision IDs (`Evidence`), and a non-dismissible educational simulation disclaimer.

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
