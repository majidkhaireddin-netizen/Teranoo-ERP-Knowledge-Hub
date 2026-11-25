# Content Structure & Data Governance — Teranoo ERP Knowledge Hub

## 1. Separation of Content and Presentation

Documentation and reference data are strictly decoupled from React UI components:

- **Models:** `/content/models/types.ts` defines strict TypeScript interfaces (`ProjectReferenceSnapshot`, `CoreBusinessModule`, `PlanningPhase`, `PlatformCapability`, `DocumentMetadata`, `TocHeading`, `SearchableItem`).
- **Seed Data:**
  - `/content/seed/projectSnapshot.ts`: Stores the verified TASK-001 Section 13 reference snapshot.
  - `/content/seed/productVisionDoc.ts`: Stores metadata, Table of Contents structure, and related links for the foundational Product Vision page.
- **Repository Layer:** `/content/repositories/projectRepository.ts` exposes pure read and derivation functions consumed by feature views:
  - `deriveDashboardMetrics()`
  - `derivePhase5Progress()`
  - `derivePlanningSummary()`
  - `filterPhase5Capabilities()`
  - `buildSearchIndex()` & `searchKnowledgeHub()`

UI components never hardcode counts (`120`, `4`, `7/13`, `54%`) or duplicate project entity lists.

---

## 2. Content Classification Model

All knowledge artifacts belong to one of four mandatory classifications (`ContentClassificationType`):

| Classification Key | Arabic Label | English Label | Meaning |
|---|---|---|---|
| `official` | وثيقة رسمية معتمدة | Official Documentation | Approved Teranoo ERP documents and architectural decisions |
| `research` | أبحاث وأدلة مرجعية | Research & Evidence | Research packages, benchmarks, and reference sources |
| `independent` | تحليل استشاري مستقل | Independent Analysis | Independent advisory reviews and notes |
| `future` | اعتبارات معمارية مستقبلية | Future Considerations | Unapproved future architectural topics |

---

## 3. Adding New Content in Future Tasks

The foundation is designed to grow without altering layout or shell architecture:

1. **Adding a New Phase 5 Capability or Approving an Existing One:**
   Update `/content/seed/projectSnapshot.ts` (`phase5Capabilities` array) by changing `status` to `'approved'` and setting `decisionId`. Dashboard progress bars, percentage badges, filter tab counts, architecture diagram nodes, and global search update automatically via `projectRepository.ts`.
2. **Adding a New Planning Phase:**
   Append a `PlanningPhase` entry in `projectSnapshot.ts`; `derivePlanningSummary()` recalculates completed/total phases automatically.
3. **Populating a Planned Section (e.g., Decision Register, Research Center, Glossary):**
   - Add strongly typed collection files under `/content/seed/` (or a future structured loader under `/content/repositories/`).
   - Replace the section's `PlannedSectionView` inside its corresponding `/features/<domain>/` view while keeping the existing route under `/app/<route>/page.tsx` untouched.
4. **Adding New Documentation Articles:**
   Compose `PageHeader`, `ContentLayout`, `TableOfContents`, `DocumentationArticle`, `MetadataPanel`, `DocumentationSection`, `ComparisonTable`, `DecisionReference`, `SourceReference`, and `RelatedContent`.

---

## 4. Authorized TASK-001 Snapshot Inventory

Only the explicitly authorized reference facts from TASK-001 Section 13 exist in the codebase:
- Product identity (`Teranoo ERP`, `Enterprise-Grade Modular ERP`, `Medium & Large Enterprises`, `Commercial, Modular, Configurable ERP`, `SaaS-first`, future `Connected On-Premises`, `PostgreSQL`).
- 4 Core Business Modules (`Finance`, `Inventory & Warehouse Management`, `Procurement`, `Sales & Order Management`).
- 5 Planning Phases (Phases 1–4 Completed, Phase 5 In Progress).
- 13 Phase 5 Shared Platform Capabilities (7 Approved with `D-PLAT-01`..`D-PLAT-07`, 6 Pending with `null`).
- Reference snapshot totals: `120` Approved Architectural Decisions, `24` Future Architecture Considerations, `13` Architectural Research Packages, `57` Independent Review Notes.

No additional decision IDs, dates, research conclusions, or review notes were invented.
