# Teranoo ERP Knowledge Hub

**Subtitle:** The Complete Journey of Building an Enterprise ERP System (`الرحلة الكاملة لبناء نظام ERP مؤسسي`)  
**Current Scope:** TASK-002 (Comprehensive Knowledge Architecture & Content Foundation) building upon approved TASK-001 & TASK-001-FIX-01

Teranoo ERP Knowledge Hub is a dedicated enterprise documentation, encyclopedia, engineering guide, living architecture, research library, and build-in-public knowledge platform for the **Teranoo ERP** product. It is not an operational ERP system, not a marketing website, and not a plain Markdown viewer.

---

## Technology Stack

- **Framework:** Next.js 15 (`^15.4.9`, App Router) + React 19
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 + Centralized CSS Custom Properties (`/styles/tokens.css`)
- **Icons:** Lucide React (`lucide-react`)
- **Internationalization:** `next-intl` (Arabic default with RTL; English supported with LTR)
- **Theme Management:** `next-themes` (Light & Dark themes with local persistence)
- **Linting:** ESLint 9 flat config (`eslint.config.mjs`) with `eslint-config-next`
- **Testing:** Node built-in test runner (`node:test`) executed via locally declared `tsx`

No database, Firebase, authentication system, Gemini API, AI chatbot, GitHub API, analytics, or external runtime services are included.

---

## Reproducible Quality Commands

Dependencies are locked in `bun.lock` (matching the Google AI Studio environment) and all quality scripts run reproducibly without downloading undeclared tools:

```bash
# Install dependencies (use bun install in AI Studio or npm install locally)
npm install

# Run development server (port 3000)
npm run dev

# Run TypeScript type check
npm run typecheck

# Run ESLint
npm run lint

# Validate all local Markdown content collections, schemas, URLs, and relationships
npm run content:validate

# Run unit tests (uses local tsx devDependency)
npm run test

# Production build (runs Next.js compilation, type validation, and linting)
npm run build

# Start production server
npm run start

# Combined quality verification (typecheck + lint + content:validate + test + build)
NODE_ENV=production npm run verify
```

---

## Project Structure

```text
app/                  # Next.js App Router layouts, global states, 20 nav routes + dynamic /knowledge/[slug]
components/
  ui/                 # Core reusable primitives (Button, Card, Badge, DataTable, hardened Modal, ...)
  layout/             # AppShell, AppSidebar, AppHeader, Breadcrumbs, TableOfContents, GlobalSearchModal
  documentation/      # DocumentationArticle, MarkdownContent, ContentClassification (8 tiers), MetadataPanel, ...
  visualization/      # MetricCard, PhaseProgress, Timeline, ArchitectureNode/Group, DiagramContainer
config/               # Authoritative site & navigation definitions
content/
  collections/        # Authorized local Markdown collections (official, research, analysis, future, educational, engineering)
  fixtures/           # Deterministic test fixtures (strictly excluded from production registry & routes)
  taxonomy/           # Controlled taxonomy (8 classifications, 35 types, 15 relationships, 5 discovery dimensions)
  models/             # Strict TypeScript domain & knowledge record contracts
  schemas/            # Zod frontmatter schema & URL protocol validators
  loaders/            # Path-confined YAML-only Markdown loader & safe sanitized remark/rehype pipeline
  validators/         # Content integrity validator & CLI (`npm run content:validate`)
  registry/           # Centralized Content Registry enforcing the Publication Boundary
  search/             # Unified deterministic search (published records + navigation + snapshot)
  renderers/          # Extensible specialized viewer descriptor registry
  seed/               # Authorized static reference snapshot & Product Vision seed
  repositories/       # Derived-metrics queries, runtime-capability selectors, and unit tests
features/             # Feature-oriented views (dashboard, knowledge, engineering-journal, product-vision, about, ...)
i18n/                 # Locale configuration & ar/en translation dictionaries (100% key parity tested)
lib/                  # Shared utilities (cn helper, pure modal focusTrap helper + unit tests)
providers/            # AppProviders (next-themes, next-intl LocaleProvider, SidebarProvider)
public/               # Static assets (favicon.ico)
styles/               # Centralized semantic design tokens (tokens.css)
docs/                 # Vision, architecture, schema, authoring, relationships, publication policy, validation & reports
```

---

## Documentation Index

- [`docs/KNOWLEDGE_PLATFORM_VISION.md`](docs/KNOWLEDGE_PLATFORM_VISION.md)
- [`docs/KNOWLEDGE_ARCHITECTURE.md`](docs/KNOWLEDGE_ARCHITECTURE.md)
- [`docs/CONTENT_SCHEMA.md`](docs/CONTENT_SCHEMA.md)
- [`docs/CONTENT_AUTHORING_GUIDE.md`](docs/CONTENT_AUTHORING_GUIDE.md)
- [`docs/CONTENT_RELATIONSHIPS.md`](docs/CONTENT_RELATIONSHIPS.md)
- [`docs/CONTENT_PUBLICATION_POLICY.md`](docs/CONTENT_PUBLICATION_POLICY.md)
- [`docs/CONTENT_VALIDATION.md`](docs/CONTENT_VALIDATION.md)
- [`docs/APPLICATION_ARCHITECTURE.md`](docs/APPLICATION_ARCHITECTURE.md)
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [`docs/CONTENT_STRUCTURE.md`](docs/CONTENT_STRUCTURE.md)
- [`docs/TASK-001-COMPLETION_REPORT.md`](docs/TASK-001-COMPLETION_REPORT.md)
- [`docs/TASK-001-FIX-01-COMPLETION_REPORT.md`](docs/TASK-001-FIX-01-COMPLETION_REPORT.md)
- [`docs/TASK-002-COMPLETION_REPORT.md`](docs/TASK-002-COMPLETION_REPORT.md)

---

## Approved Product Direction & Publishing Governance

By explicit decision of the project owner, **Teranoo ERP Knowledge Hub** is approved as a **publicly accessible read-only knowledge-sharing platform**:

- Public read-only access to authorized architectural and documentation content is intentional; user authentication is not required for public read-only documentation.
- Both the deployed read-only application and the application source repository may remain public.
- Publication of project documents still requires explicit authorization and review against the approved publishing scope.
- Never publish secrets, API keys, credentials, access tokens, customer data, or sensitive operational information.
- Preserve source attribution and intellectual property notices across all published material.
- **Repository visibility and deployed application access control are separate security concerns.**
- **Public repository visibility does not automatically grant an open-source software license.** All rights remain reserved unless an explicit license is separately authorized and adopted by the project owner.
