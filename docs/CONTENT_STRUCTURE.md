# Content Structure & Data Governance — Teranoo ERP Knowledge Hub

## 1. Separation of Content and Presentation

Documentation and reference data are strictly decoupled from React UI components:

- **Models:** `/content/models/types.ts` defines strict TypeScript interfaces (`SnapshotProvenance`, `ProjectReferenceSnapshot`, `CoreBusinessModule`, `PlanningPhase`, `PlatformCapability`, `Phase5ItemKind`, `DocumentMetadata`, `TocHeading`, `SearchableItem`).
- **Seed Data:**
  - `/content/seed/projectSnapshot.ts`: Stores the static local reference snapshot with explicit source provenance metadata.
  - `/content/seed/productVisionDoc.ts`: Stores metadata, Table of Contents structure, and related links for the foundational Product Vision page.
- **Repository Layer:** `/content/repositories/projectRepository.ts` exposes pure read and derivation functions consumed by feature views:
  - `getSnapshotProvenance()`
  - `deriveDashboardMetrics()`
  - `derivePhase5Progress()` (all 13 Phase 5 planning items: `7/13` = `54%`)
  - `getRuntimePlatformCapabilities()` & `deriveRuntimeCapabilitiesSummary()` (strictly the 12 runtime platform capabilities: `7` approved, `5` pending — excluding item 13 planning gate)
  - `derivePlanningSummary()`
  - `filterPhase5Capabilities()`
  - `buildSearchIndex()` & `searchKnowledgeHub()`

UI components never hardcode counts (`120`, `4`, `7/13`, `54%`, `12` runtime capabilities) or duplicate project entity lists.

---

## 2. Reference Snapshot Provenance

Every snapshot metric is explicitly anchored to verifiable provenance metadata in `/content/seed/projectSnapshot.ts`:

- **Source Repository:** `https://github.com/Alabasi1980/TeranooErp`
- **Official Planning Sources:**
  - `teranoo-erp-planning/00-project-foundation/PROJECT_WORK_PLAN.md`
  - `teranoo-erp-planning/00-project-foundation/DECISION_REGISTER.md`
- **Reviewed Source Tree SHA:** `a922a69b54bc0cc611ae46d8e7434907cde0046a`
- **Independent Reference Review Date:** `2026-11-25` (explicitly labeled as the independent review date of this snapshot, not the approval date of each individual source document)
- **Snapshot Nature:** Static local reference snapshot (`isLiveSynced: false`) — not live-synced with the source repository.
- **Metrics Source Distinction:**
  - **Official source-derived metrics:** `120` approved architectural decisions and Phase 5 planning progress (`7` of `13` items approved).
  - **Independent review statistics:** `57` independent review notes and `24` future architecture considerations are explicitly distinguished from official approved decisions.

---

## 3. Architecture Diagram vs. Planning Progress Semantics

Phase 5 contains **13 planning items** in `PROJECT_WORK_PLAN.md`:

- **Items 1–12 (`kind: 'runtime_capability'`):** Twelve shared runtime platform capabilities (`7` approved with official decision IDs `D-PLAT-01`..`D-PLAT-07`, and `5` pending).
- **Item 13 (`kind: 'planning_gate'` — `Platform Foundation Adoption`):** A planning review and approval gate rather than a runtime platform capability.

Semantic separation rules enforced in both the repository layer and UI:
1. **Planning views & progress bars** (`Phase5CapabilitiesSection`, `derivePhase5Progress`) include all **13** Phase 5 planning items (`7/13` = `54%`), with item 13 explicitly annotated as a planning approval gate.
2. **Architecture diagrams** (`ArchitectureOverviewDiagram`, `getRuntimePlatformCapabilities`) render ONLY the **12 runtime platform capabilities** (`7` approved + `5` pending) and exclude `Platform Foundation Adoption`.
3. **Identifier integrity:** Only genuine official decision identifiers (`D-PLAT-01`..`D-PLAT-07`) are displayed as decision codes. Non-official UI codes (such as `MOD-*` or `P5-*`) are never presented as official ERP decision identifiers.

---

## 4. Content Classification Model

All knowledge artifacts belong to one of four mandatory classifications (`ContentClassificationType`):

| Classification Key | Arabic Label | English Label | Meaning |
|---|---|---|---|
| `official` | وثيقة رسمية معتمدة | Official Documentation | Approved Teranoo ERP documents and architectural decisions |
| `research` | أبحاث وأدلة مرجعية | Research & Evidence | Research packages, benchmarks, and reference sources |
| `independent` | تحليل استشاري مستقل | Independent Analysis | Independent advisory reviews and notes |
| `future` | اعتبارات معمارية مستقبلية | Future Considerations | Unapproved future architectural topics |

---

## 5. Publishing Governance (Public Read-Only Knowledge Platform)

Teranoo ERP Knowledge Hub is approved as a **publicly accessible read-only knowledge-sharing platform**:

- Publication of any new project document requires explicit authorization and verification against approved scope.
- Secrets, credentials, tokens, customer records, and sensitive operational data must never enter `content/` or public assets.
- Source attribution and intellectual property notices must remain preserved.

---

## 6. Adding New Content in Future Tasks

1. **Updating Phase 5 Capabilities:** Update `/content/seed/projectSnapshot.ts` (`phase5Capabilities`) with `status: 'approved'` and official `decisionId`. Dashboard metrics, progress bars, filter counts, runtime architecture diagram counts, and global search recalculate automatically.
2. **Populating Planned Sections:** Add typed datasets under `/content/seed/` and replace `PlannedSectionView` inside the matching `/features/<domain>/` view while keeping `/app/<route>/page.tsx` routes stable.
