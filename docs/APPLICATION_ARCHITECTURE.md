# Application Architecture — Teranoo ERP Knowledge Hub

## 1. Architectural Pattern

Teranoo ERP Knowledge Hub uses a **Feature-Oriented Modular Architecture** built on the **Next.js 15 App Router** with strict TypeScript typing.

Key architectural boundaries:

1. **Routing Layer (`app/`)**: Thin route files (`page.tsx`) export page metadata and render the corresponding feature view. Global App Router states (`loading.tsx`, `error.tsx`, `not-found.tsx`) provide consistent feedback across all routes.
2. **Feature Layer (`features/`)**: Self-contained domain views (`dashboard`, `product-vision`, `roadmap`, `architecture`, `modules`, `platform`, `decisions`, `research`, `future-considerations`, `independent-reviews`, `business-scenarios`, `glossary`, `change-history`, `about`). Feature views read data exclusively through repository functions and compose reusable UI, layout, documentation, and visualization components.
3. **Content & Repository Layer (`content/`)**:
   - `content/models/types.ts`: Domain contracts for identity, modules, planning phases, Phase 5 capabilities, content classifications, document metadata, and search items.
   - `content/seed/`: Authoritative local structured data (`projectSnapshot.ts`, `productVisionDoc.ts`).
   - `content/repositories/projectRepository.ts`: Pure query and derived-calculation layer. Dashboard metrics (Phase 5 completion percentage, completed planning phases, core module count) and search results are always computed from structured data rather than hardcoded inside UI components.
4. **Presentation Layer (`components/`)**:
   - `components/ui/`: Domain-agnostic enterprise primitives.
   - `components/layout/`: Application Shell (`AppShell`, `AppSidebar`, `AppHeader`, `Breadcrumbs`, `PageContainer`, `PageHeader`, `SectionHeader`, `ContentLayout`, `TableOfContents`, `GlobalSearchModal`).
   - `components/documentation/`: Long-form reading, classification banners, callouts, references, metadata panels, comparison tables, and planned-section templates.
   - `components/visualization/`: Metric cards, phase progress bars, timelines, and composable layered architecture diagram blocks.
5. **Configuration & Providers (`config/`, `providers/`, `i18n/`)**: Centralized navigation tree (`config/navigation.ts`), site constants (`config/site.ts`), theme management (`next-themes`), and localization (`next-intl`).

---

## 2. Adaptation for Next.js App Router & AI Studio Environment

The reference directory layout from TASK-001 Section 5 was adapted cleanly to fit the existing Next.js 15 root structure in this workspace:

- Next.js App Router resides at `/app` at project root (matching the preconfigured `tsconfig.json` path alias `"@/*": ["./*"]` and workspace entry points) rather than nested under `src/app/`.
- All domain directories (`components/`, `features/`, `content/`, `config/`, `providers/`, `i18n/`, `styles/`, `hooks/`, `lib/`) follow the exact separation of concerns specified in Section 5.
- HMR is disabled in this environment (`DISABLE_HMR=true` in `next.config.ts`), which is preserved without modification.

---

## 3. Internationalization & RTL/LTR Strategy (`next-intl`)

- **Default Locale:** Arabic (`ar`, `dir="rtl"`).
- **Supported Locales:** Arabic (`ar`, `rtl`) and English (`en`, `ltr`).
- **SSR & Hydration Alignment:** `app/layout.tsx` reads the `TERANOO_LOCALE` cookie on the server to render `<html lang="..." dir="...">` immediately without direction flash.
- **Client Switching & Persistence:** `LocaleProvider` wraps `NextIntlClientProvider` (`next-intl`), updating React state, `document.documentElement.lang`, `document.documentElement.dir`, `localStorage` (`teranoo-locale`), and cookie (`TERANOO_LOCALE`).
- **Logical Styling:** Components use CSS logical properties (`ps-*`, `pe-*`, `border-e`, `border-s`, `start-0`, `end-0`) so the sidebar, drawers, breadcrumbs, and icons mirror automatically between RTL and LTR.
- **Mixed-Direction Isolation:** Technical identifiers (`D-PLAT-01`..`D-PLAT-07`, `MOD-FIN`, `PostgreSQL`, `SaaS-first`) use `.bidi-ltr` (`direction: ltr; unicode-bidi: isolate`) to prevent bidirectional character reordering inside Arabic prose.

---

## 4. Theme Management (`next-themes`)

- Managed via `ThemeProvider` from `next-themes` using `attribute="class"`, `defaultTheme="light"`, and `storageKey="teranoo-theme"`.
- Tailwind v4 is configured with `@custom-variant dark (&:where(.dark, .dark *));` in `app/globals.css`, paired with semantic CSS Custom Properties in `styles/tokens.css`.

---

## 5. Information Architecture (18 Routes across 5 Groups)

- **Overview:** `/`, `/product-vision`, `/roadmap`
- **Architecture:** `/architecture`, `/modules`, `/dependencies`, `/platform`, `/tenancy`, `/deployment`
- **Knowledge & Decisions:** `/decisions`, `/research`, `/future-considerations`, `/independent-reviews`
- **Exploration:** `/business-scenarios`, `/diagrams`, `/glossary`
- **Project:** `/change-history`, `/about`

---

## 6. Explicit TASK-001 Boundaries & Deferred Capabilities

Not implemented in TASK-001 by design:

- Database persistence or backend APIs.
- Authentication / authorization / server-side access protection.
- GitHub repository synchronization or live document ingestion.
- Full Markdown/MDX authoring pipeline and complete project document ingestion.
- Interactive business scenario simulators and full decision register filtering/search across all 120 decisions.
- AI features or external analytics/telemetry.
