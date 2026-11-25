# Teranoo ERP Knowledge Hub

**Subtitle:** Product Documentation & Architecture Center  
**Current Scope:** TASK-001 — Application Foundation & Design System

Teranoo ERP Knowledge Hub is a dedicated enterprise documentation, architecture, research, and knowledge management workspace for the **Teranoo ERP** product. It is not an operational ERP system, not a marketing website, and not a plain Markdown viewer.

---

## Technology Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS v4 + Centralized CSS Custom Properties (`/styles/tokens.css`)
- **Icons:** Lucide React (`lucide-react`)
- **Internationalization:** `next-intl` (Arabic default with RTL; English supported with LTR)
- **Theme Management:** `next-themes` (Light & Dark themes with local persistence)
- **Testing:** Node built-in test runner (`node:test`) executed via `tsx`

No database, Firebase, authentication system, Gemini API, AI chatbot, GitHub API, analytics, or external runtime services are included in TASK-001.

---

## Running Locally

```bash
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Run ESLint
npm run lint

# Run unit tests
npx --yes tsx --test content/repositories/projectRepository.test.ts

# Production build
npm run build
npm run start
```

---

## Project Structure

```text
app/                  # Next.js App Router layouts, global states, and all 18 routes
components/
  ui/                 # Core reusable primitives (Button, Card, Badge, DataTable, Modal, ...)
  layout/             # AppShell, AppSidebar, AppHeader, Breadcrumbs, TableOfContents, GlobalSearchModal
  documentation/      # DocumentationArticle, ContentClassification, MetadataPanel, Callouts, ...
  visualization/      # MetricCard, PhaseProgress, Timeline, ArchitectureNode/Group, DiagramContainer
config/               # Authoritative site & navigation definitions
content/
  models/             # Strict TypeScript domain models
  seed/               # Authorized TASK-001 reference snapshot & Product Vision seed
  repositories/       # Derived-metrics queries, search index, and unit tests
features/             # Feature-oriented views (dashboard, product-vision, platform, architecture, ...)
i18n/                 # Locale configuration & ar/en translation dictionaries
providers/            # AppProviders (next-themes, next-intl LocaleProvider, SidebarProvider)
styles/               # Centralized semantic design tokens (tokens.css)
docs/                 # Architecture, design system, content structure, and TASK-001 completion report
```

---

## Documentation Index

- [`docs/APPLICATION_ARCHITECTURE.md`](docs/APPLICATION_ARCHITECTURE.md)
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [`docs/CONTENT_STRUCTURE.md`](docs/CONTENT_STRUCTURE.md)
- [`docs/TASK-001-COMPLETION_REPORT.md`](docs/TASK-001-COMPLETION_REPORT.md)

---

## Privacy & Deployment Notice (TASK-001)

This TASK-001 deliverable operates exclusively on local structured reference snapshot data. It does not connect to private repositories or external services and is **not approved for public deployment with confidential project documentation** until server-side authentication and authorization are introduced in a subsequent authorized task.
