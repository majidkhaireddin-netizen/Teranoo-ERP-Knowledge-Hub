# Teranoo ERP Knowledge Hub

**Subtitle:** Product Documentation & Architecture Center  
**Current Scope:** TASK-001 (Application Foundation & Design System) + TASK-001-FIX-01 (Foundation Quality & Architecture Hardening)

Teranoo ERP Knowledge Hub is a dedicated enterprise documentation, architecture, research, and knowledge management workspace for the **Teranoo ERP** product. It is not an operational ERP system, not a marketing website, and not a plain Markdown viewer.

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

# Run unit tests (uses local tsx devDependency)
npm run test

# Production build (runs Next.js compilation, type validation, and linting)
npm run build

# Start production server
npm run start

# Combined quality verification (typecheck + lint + test + build)
npm run verify
```

---

## Project Structure

```text
app/                  # Next.js App Router layouts, global states, and all 18 routes
components/
  ui/                 # Core reusable primitives (Button, Card, Badge, DataTable, hardened Modal, ...)
  layout/             # AppShell, AppSidebar, AppHeader, Breadcrumbs, TableOfContents, GlobalSearchModal
  documentation/      # DocumentationArticle, ContentClassification, MetadataPanel, Callouts, ...
  visualization/      # MetricCard, PhaseProgress, Timeline, ArchitectureNode/Group, DiagramContainer
config/               # Authoritative site & navigation definitions
content/
  models/             # Strict TypeScript domain models & SnapshotProvenance contracts
  seed/               # Authorized static reference snapshot & Product Vision seed
  repositories/       # Derived-metrics queries, runtime-capability selectors, search index, and unit tests
features/             # Feature-oriented views (dashboard, product-vision, platform, architecture, ...)
i18n/                 # Locale configuration & ar/en translation dictionaries (100% key parity tested)
lib/                  # Shared utilities (cn helper, pure modal focusTrap helper + unit tests)
providers/            # AppProviders (next-themes, next-intl LocaleProvider, SidebarProvider)
public/               # Static assets (favicon.ico)
styles/               # Centralized semantic design tokens (tokens.css)
docs/                 # Architecture, design system, content structure, and task completion reports
```

---

## Documentation Index

- [`docs/APPLICATION_ARCHITECTURE.md`](docs/APPLICATION_ARCHITECTURE.md)
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md)
- [`docs/CONTENT_STRUCTURE.md`](docs/CONTENT_STRUCTURE.md)
- [`docs/TASK-001-COMPLETION_REPORT.md`](docs/TASK-001-COMPLETION_REPORT.md)
- [`docs/TASK-001-FIX-01-COMPLETION_REPORT.md`](docs/TASK-001-FIX-01-COMPLETION_REPORT.md)

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
