# Knowledge Architecture (`TASK-002`)

## 1. Layered Content Pipeline

The Knowledge Architecture decouples authoritative content files from presentation UI through six clean server-side modules under `content/`:

```
content/collections/{official,research,analysis,future,educational,engineering}/*.md
        │
        ▼  content/loaders/contentLoader.ts       (Path confinement + YAML-only gray-matter + Zod)
        ▼  content/loaders/markdownPipeline.ts    (remark/rehype, allowDangerousHtml:false, rehype-sanitize)
        ▼  content/validators/contentValidator.ts (Schema, IDs, slugs, statuses, URLs, referential integrity)
        ▼  content/registry/contentRegistry.ts    (Publication Boundary enforcement + lookups + backlinks)
        ▼  content/search/knowledgeSearch.ts      (Unified deterministic search index)
        ▼  content/renderers/rendererRegistry.ts  (Extensible specialized viewer descriptors)
        │
        ▼  Next.js Server Components (/knowledge, /knowledge/[slug], app/layout.tsx)
```

## 2. Server-Side Loading & Client Bundle Boundary

- Markdown parsing, YAML frontmatter validation, HTML sanitization, and directory traversal execute **exclusively on the server**.
- Client views receive only compact serialized projections:
  - `app/layout.tsx` passes `KnowledgeSearchEntry[]` to `AppShell` -> `GlobalSearchModal`.
  - `app/knowledge/page.tsx` passes `KnowledgeRecordMetadata[]` (no Markdown/HTML bodies) to `KnowledgeLibraryView`.
  - `app/knowledge/[slug]/page.tsx` passes one resolved, sanitized `KnowledgeDocument` and its relationships/translations/neighbors to `DocumentReaderView`.
- Unpublished drafts, internal records, unauthorized documents, and `content/fixtures/` files never enter the production registry, client bundles, search index, or static route params.

## 3. Taxonomy & Five Discovery Dimensions

Defined centrally in `content/taxonomy/registry.ts`:

1. **Journey Stages** (10 stages from `product-discovery` through `continuous-evolution`).
2. **Official Phases** (string-based pattern `^phase-\d+(?:\.\d+)?$` supporting non-integer phases such as `phase-6.5`).
3. **Business Modules** (extensible registry starting with `finance`, `inventory-warehouse`, `procurement`, `sales-order-management`).
4. **Platform Domains** (14 shared platform domains such as `identity-access`, `workflow-approvals`, `audit-trail`, `localization`, `tax`, `currency`, `calendar`, etc.).
5. **Controlled Topics + Flexible Tags** (13 controlled topics plus free-form tags).

## 4. Eight Authority Classifications & 35 Content Types

- **8 Authority Classifications:** `official`, `approved-decision`, `research`, `independent`, `future`, `educational`, `illustrative`, `engineering`.
- **35 Content Types:** Spanning strategy, architecture, decisions, requirements, research, reviews, business processes/rules, functional/screen specs, data models, APIs/contracts, implementation guides/code examples, engineering journal/issues/solutions/lessons, tests, deployment/releases, glossary entries, and educational explanations.

## 5. Specialized Viewer Extension Mechanism

`content/renderers/rendererRegistry.ts` maps every `ContentTypeId` to a `DocumentRendererDescriptor`:
- `generic` (implemented) — unified document reader.
- `research` (implemented) — unified reader with mandatory non-binding authority disclaimer banner.
- `screen-specification`, `data-model`, `engineering-journal`, `test-record` — pre-registered extension slots ready for future structured viewers while gracefully rendering via the unified Markdown reader today.
- Forward-compatible TypeScript payload interfaces (`ScreenSpecificationExtension`, `DataModelExtension`, `EngineeringJournalExtension`, `TestRecordExtension`) are defined in `content/models/knowledge.ts`.
