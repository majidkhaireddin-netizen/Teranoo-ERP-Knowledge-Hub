# Application Architecture — Teranoo ERP Knowledge Hub

## 1. Architectural Pattern

Teranoo ERP Knowledge Hub uses a **Feature-Oriented Modular Architecture** built on the **Next.js 15 App Router** with strict TypeScript typing.

Key architectural boundaries:

1. **Routing Layer (`app/`)**: Thin route files (`page.tsx`) export page metadata and render the corresponding feature view. Global App Router states (`loading.tsx`, `error.tsx`, `not-found.tsx`) provide consistent feedback across all routes.
2. **Feature Layer (`features/`)**: Self-contained domain views (`dashboard`, `product-vision`, `roadmap`, `architecture`, `modules`, `platform`, `decisions`, `research`, `future-considerations`, `independent-reviews`, `business-scenarios`, `glossary`, `change-history`, `about`). Feature views read data exclusively through repository functions and compose reusable UI, layout, documentation, and visualization components.
3. **Content & Repository Layer (`content/`)**:
   - `content/models/types.ts`: Domain contracts for snapshot provenance, identity, modules, planning phases, Phase 5 capabilities vs. planning gates (`Phase5ItemKind`), content classifications, document metadata, and search items.
   - `content/seed/`: Authoritative local static reference snapshot (`projectSnapshot.ts`, `productVisionDoc.ts`).
   - `content/repositories/projectRepository.ts`: Pure query and derived-calculation layer. Dashboard metrics (`120` approved decisions, `4/5` completed planning phases, `4` core modules, `7/13` Phase 5 planning progress = `54%`), runtime architecture capability counts (`12` runtime capabilities: `7` approved, `5` pending), and search results are always computed from structured data rather than hardcoded inside UI components.
4. **Presentation Layer (`components/`)**:
   - `components/ui/`: Domain-agnostic enterprise primitives, including the accessibility-hardened portal `Modal` (dialog & drawer variants).
   - `components/layout/`: Application Shell (`AppShell`, `AppSidebar`, `AppHeader`, `Breadcrumbs`, `PageContainer`, `PageHeader`, `SectionHeader`, `ContentLayout`, `TableOfContents`, `GlobalSearchModal`).
   - `components/documentation/`: Long-form reading, classification banners, callouts, references, metadata panels, comparison tables, and planned-section templates.
   - `components/visualization/`: Metric cards, phase progress bars, timelines, and composable layered architecture diagram blocks.
5. **Configuration, Utilities & Providers (`config/`, `lib/`, `providers/`, `i18n/`)**: Centralized navigation tree (`config/navigation.ts`), site constants (`config/site.ts`), pure focus-trap helpers (`lib/focusTrap.ts`), theme management (`next-themes`), and localization (`next-intl`).

---

## 2. Environment, Dependency, and Build Governance

- **App Router Root:** Next.js App Router resides at `/app` at project root (matching `tsconfig.json` `"@/*": ["./*"]`).
- **Platform-Retained Configuration:**
  - `next.config.ts` preserves `output: 'standalone'` and the `DISABLE_HMR` webpack watch guard required by Google AI Studio, while enforcing TypeScript and ESLint validation during builds (no `eslint.ignoreDuringBuilds` bypass and no unused remote image host allowlists).
  - `postcss.config.mjs` references `@tailwindcss/postcss` and `autoprefixer`, so `postcss` and `autoprefixer` remain declared in `package.json`.
  - `eslint.config.mjs` uses ESLint 9 flat config with `eslint-config-next@16.0.8` (which declares `peerDependencies: { eslint: ">=9.0.0", typescript: ">=3.3.1" }` and runs cleanly alongside Next.js `15.5.x`); redundant legacy `.eslintrc.json` has been removed.
  - `metadata.json` retains AI Studio platform metadata without introducing any runtime Gemini dependency or API key requirement (`.env.example` requires no `GEMINI_API_KEY`).
- **Package Manager Consistency:** `bun.lock` is kept synchronized with `package.json`. All quality checks are exposed via `package.json` scripts (`dev`, `build`, `start`, `lint`, `typecheck`, `test`, `verify`) using a locally declared `tsx` devDependency.

---

## 3. Internationalization & RTL/LTR Strategy (`next-intl`)

- **Default Locale:** Arabic (`ar`, `dir="rtl"`).
- **Supported Locales:** Arabic (`ar`, `rtl`) and English (`en`, `ltr`).
- **SSR & Hydration Alignment:** `app/layout.tsx` reads the `TERANOO_LOCALE` cookie on the server to render `<html lang="..." dir="...">` immediately without direction flash.
- **Client Switching & Persistence:** `LocaleProvider` wraps `NextIntlClientProvider` (`next-intl`), updating React state, `document.documentElement.lang`, `document.documentElement.dir`, `localStorage` (`teranoo-locale`), and cookie (`TERANOO_LOCALE`).
- **Dictionary Governance:** All reusable UI controls, headers, table captions, status notes, and provenance labels are sourced from `i18n/locales/ar.json` and `i18n/locales/en.json`, with automated unit-test enforcement of recursive key parity.
- **Logical Styling & Mixed-Direction Isolation:** CSS logical properties (`ps-*`, `pe-*`, `border-e`, `border-s`, `start-0`, `end-0`) handle RTL/LTR mirroring automatically, while `.bidi-ltr` (`direction: ltr; unicode-bidi: isolate`) protects official decision identifiers (`D-PLAT-01`..`D-PLAT-07`), SHAs, URLs, and English technical terms inside Arabic text.

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

## 6. Approved Public Knowledge Platform Direction & Scope Boundaries

By explicit approval of the project owner, **Teranoo ERP Knowledge Hub** operates as a **publicly accessible read-only knowledge-sharing platform**:

- Public read-only access to authorized knowledge content is intentional; authentication is not required for public read-only documentation.
- Source repository visibility and deployed application access control remain separate security boundaries; public repository visibility does not grant an open-source software license.
- Publishing project documents still requires explicit owner authorization, strict exclusion of secrets/credentials/customer data/sensitive operational details, and preservation of source attribution and intellectual property notices.

Deferred to future authorized tasks by design:

- Database persistence or backend APIs.
- GitHub repository live synchronization or automated document ingestion.
- Full Markdown/MDX authoring pipeline and full ingestion of all 120 decisions, 13 research packages, 57 independent review notes, and 24 future considerations.
- Interactive business scenario simulators.
