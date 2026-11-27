# Curated Content Maintainability Architecture (`KH-041`)

**Task Context:** `TASK-005-QA` (`R04`) — Architectural specification for resolving independent review finding **KH-041** (long-form curated bilingual prose embedded inside TypeScript extractor modules).  
**Execution Status in `TASK-005-QA`:** Architectural Design & Migration Plan Documented Only (**Migration NOT executed in `TASK-005-QA`**, per task scope boundary; all existing extractors and tests remain fully operational).

---

## 1. Problem Statement (`KH-041`)

During `TASK-005` (`FIX-03A`, `FIX-03B`, and `TASK-004` roadmap provenance), rich bilingual educational projections were authored alongside deterministic parsers inside TypeScript source files:

| Module | Current Size / Lines | Mixed Responsibilities |
| :--- | :--- | :--- |
| `content/extractors/moduleEducationalContent.ts` | ~173 KB / 2,293 lines | Bilingual (`ar` / `en`) curated prose for 4 Core Modules (`whyModuleExists`, business problems, design reasoning, absent-peer scenarios, ownership rows, deferred rationales, and 34 decision explanations) + source anchor references |
| `content/extractors/dependencyEducationalContent.ts` | ~75 KB / 1,068 lines | Bilingual classification guide, 6 Core CIC educational notes, 5 Data Ownership design distinctions, 4 conceptual examples + 8-source pin table (`CURATED_DEPENDENCY_PROJECTION_PINS`) |
| `content/extractors/roadmapExtractor.ts` | ~63 KB / 1,159 lines | Deterministic Markdown table/section parsing of `PROJECT_WORK_PLAN.md` combined with static bilingual `phaseNarrative` / curated roadmap descriptions (`PHASE_METADATA_CATALOG`) |

### Maintainability Risks of TypeScript-Embedded Prose

1. **Code vs. Editorial Coupling:** Editing a single Arabic or English educational paragraph requires modifying TypeScript code rather than structured content files, complicating editorial review and Git diff inspection.
2. **Schema & Validation Separation:** Content-level checks (bilingual parity, required `sourceRef` anchors, pin freshness) are enforced inside extractor unit tests rather than unified content pipeline validation (`npm run content:validate`).
3. **Scale Bottleneck for `BATCH-003+`:** Expanding to Phases 3–7 architectural documents (126+ `D-*` owning documents, platform capability models, future modules) would cause TypeScript bundle and AST maintenance bloat if long-form educational prose remained inline in `.ts` files.
4. **Translator / Subject-Matter Reviewer Ergonomics:** Bilingual Arabic/English editors benefit from structured Markdown/YAML files rather than multi-level TypeScript object literals with escape characters.

---

## 2. Non-Negotiable Architectural Invariants

Any future migration away from inline TypeScript prose MUST preserve these invariants:

1. **Strict Separation from Verbatim Official Sources:**
   - Official documents under `content/collections/official/` remain immutable verbatim copies verified via Git blob SHA-1 and canonical body SHA-256 (`KH-030`, `KH-035`).
   - Curated educational content MUST reside in a **separate collection** (never mixed into `content/collections/official/`).
2. **Zero Silent Drift (Fail-Closed Provenance Pinning):**
   - Every curated entry MUST declare `pinnedSources[]` with `documentSlug`, `mappedSourceRevision`, `mappedSourceBodySha256`, and `lastCuratedReviewDate`.
   - At build/validation time, if any pinned official document's revision or canonical body SHA-256 diverges, `mappingFreshnessStatus` MUST flip to `'review-required-source-changed'` (`KH-028`, `KH-037`).
3. **Deterministic Structural Parsing Remains Pure TypeScript:**
   - Deterministic extractors (`decisionRegisterExtractor.ts`, `facRegisterExtractor.ts`, `guardrailsExtractor.ts`, deterministic parts of `moduleModelsExtractor.ts`, `dependencyArchitectureExtractor.ts`, `roadmapExtractor.ts`) MUST continue parsing authoritative Markdown directly with zero hardcoded business counts or fabricated claims.
4. **Verified Section Anchor Integrity:**
   - Every `sectionAnchor` (`#kh-h-*`) referenced in curated content MUST continue to validate against `renderSafeMarkdown(doc.bodyMarkdown).headings` during `npm run content:validate` and automated tests.
5. **Client-Side Safety:**
   - Server-only `fs` loading MUST remain inside `content/loaders/` and `content/registry/`. UI components continue receiving serializable view props only.

---

## 3. Target Content Architecture

### 3.1 Proposed Directory Layout

```text
content/
  collections/
    official/                          # Immutable verbatim ERP documents (unchanged)
    curated/                           # NEW controlled collection (future task)
      modules/
        finance.curated.yaml           # or .md with structured YAML frontmatter
        inventory-warehouse.curated.yaml
        procurement.curated.yaml
        sales-order-management.curated.yaml
      dependencies/
        classification-guide.curated.yaml
        cic-guidance.curated.yaml
        ownership-guide.curated.yaml
        educational-examples.curated.yaml
      roadmap/
        phase-narratives.curated.yaml
  schemas/
    curatedProjectionSchema.ts         # Zod schemas enforcing bilingual parity, pins & anchors
  loaders/
    curatedProjectionLoader.ts         # Server-side loader + SHA-256 drift evaluator
```

*(Note: Structured YAML or Frontmatter-pinned Markdown files are preferred over arbitrary free-form Markdown when entries map 1:1 to typed UI slots such as `decisionDetails[decisionId]` or `cicGuidanceByContractId[contractId]`, while Markdown body sections may hold longer multi-paragraph narratives.)*

### 3.2 Target Frontmatter / Manifest Schema (`CuratedProjectionDocument`)

Each curated projection file will declare:

```yaml
id: kh-curated-module-finance
kind: curated-projection
targetDomain: core-module
targetEntityId: finance
lastCuratedReviewDate: "2026-11-26"
pinnedSources:
  - key: financeModuleModel
    documentSlug: finance-module-model
    sourcePath: "teranoo-erp-planning/02-core-modules/FINANCE_MODULE_MODEL.md"
    mappedSourceRevision: "397a94e0d82fe9afc99bc5f0dddd7cfef1438f5f"
    mappedSourceBodySha256: "<64-hex-sha256>"
```

### 3.3 Separation of Responsibilities

| Layer | Responsibility |
| :--- | :--- |
| **Deterministic Extractors** (`content/extractors/*`) | Parse authoritative headings, Markdown tables, `D-*` decision IDs, verbatim `> **القرار...**` blocks, `CIC-*` contracts, `OWN-CORE-*` rows, and PCD matrices directly from `content/collections/official/`. |
| **Curated Collection** (`content/collections/curated/*`) | Store bilingual educational explanations, architectural implications, common mistakes, and conceptual scenarios pinned to exact official source revisions & body hashes. |
| **Unified Validation** (`content/validators/`) | Extend `npm run content:validate` to validate curated YAML/Markdown schemas, verify 100% of `pinnedSources` against live `contentRegistry`, verify 100% of `#kh-h-*` anchors, and ensure every `decisionId` / `contractId` in official docs has matching curated coverage where required. |
| **Composition Layer** (`content/registry/` or extractor builders) | Join deterministic records with curated records at runtime/build time without exposing `fs` to Client Components. |

---

## 4. Controlled Phased Migration Plan (Future Task — Not Part of `TASK-005-QA`)

When authorized in a dedicated future maintainability task:

1. **Step 1 — Schema & Loader Foundation:** Introduce `curatedProjectionSchema.ts` and `curatedProjectionLoader.ts` with strict Zod validation and pin-drift evaluation, tested via `node:test`.
2. **Step 2 — Roadmap Narratives Extraction:** Move static narrative fields (`PHASE_METADATA_CATALOG` editorial descriptions) out of `roadmapExtractor.ts` into `content/collections/curated/roadmap/`, preserving exact output equality with existing `roadmapExtractor` snapshots.
3. **Step 3 — Dependency Educational Guidance Migration:** Export `dependencyEducationalContent.ts` structures to `content/collections/curated/dependencies/`, preserving all 8 `CURATED_DEPENDENCY_PROJECTION_PINS` and identical `DependencyEducationalGuidance` TypeScript return shapes.
4. **Step 4 — Core Module Educational Depth Migration:** Export `MODULE_EDUCATIONAL_DEPTH_BUNDLES` from `moduleEducationalContent.ts` into per-module files under `content/collections/curated/modules/`, preserving exact `CoreModuleProfile` output and anchor checks.
5. **Step 5 — Content Validator Integration & Parity Verification:** Add curated collection checks to `validateCli.ts` and assert byte/structural equivalence against pre-migration test fixtures before removing inline prose arrays.

---

## 5. Boundary Confirmation

- **Not Executed Here:** Per `TASK-005-QA` (`R04`), no files were migrated out of `moduleEducationalContent.ts`, `dependencyEducationalContent.ts`, or `roadmapExtractor.ts` in this task.
- **Preserved Stability:** All existing `TASK-005`, `FIX-01`, `FIX-02`, `FIX-03A`, and `FIX-03B` APIs, UI views, and tests continue to operate unchanged on the approved TypeScript modules until the future migration task is explicitly authorized.
