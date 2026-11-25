# Design System — Teranoo ERP Knowledge Hub

## 1. Visual Identity & Philosophy

**Direction:** Enterprise Knowledge Workspace — structured, high-clarity, restrained, and information-dense.

Design rules enforced across all views:
- Crisp flat surfaces (`bg-surface`) separated by 1px hairline borders (`border-border`) rather than heavy shadows or nested card-within-card stacks.
- Architectural border radii (`4px`, `6px`, `8px`) avoiding oversized rounded containers.
- Zero decorative gradients, zero glassmorphism clutter, zero decorative pulsing dots, zero emojis, and zero fake header controls.
- Full parity between **Light Theme** and **Dark Theme** with WCAG AA text contrast.

---

## 2. Semantic Design Tokens (`/styles/tokens.css`)

All components consume semantic Tailwind tokens mapped via `@theme inline` in `app/globals.css` to CSS Custom Properties in `styles/tokens.css`. Direct hex values are prohibited inside components.

### Light Theme Core Tokens

| Semantic Role | CSS Variable | Value |
|---|---|---|
| Primary | `--color-primary` | `#244B73` |
| Primary Deep | `--color-primary-deep` | `#14283E` |
| Accent | `--color-accent` | `#C5A46D` |
| App Background | `--color-bg-app` | `#F3F5F8` |
| Surface | `--color-surface` | `#FFFFFF` |
| Surface Secondary | `--color-surface-secondary` | `#E9EEF4` |
| Border | `--color-border` | `#DCE3EB` |
| Text Primary | `--color-text-primary` | `#182636` |
| Text Secondary | `--color-text-secondary` | `#516173` (AA contrast-tuned) |
| Success | `--color-success` | `#217351` (AA contrast-tuned) |
| Warning | `--color-warning` | `#946A22` (AA contrast-tuned) |
| Danger | `--color-danger` | `#B53D3D` (AA contrast-tuned) |
| Info | `--color-info` | `#316493` (AA contrast-tuned) |

### Dark Theme Core Tokens (`.dark`)

| Semantic Role | CSS Variable | Value |
|---|---|---|
| Primary | `--color-primary` | `#7FA8D3` |
| Accent | `--color-accent` | `#D7B577` |
| App Background | `--color-bg-app` | `#0D1622` |
| Surface | `--color-surface` | `#142233` |
| Surface Secondary | `--color-surface-secondary` | `#1B2B3F` |
| Border | `--color-border` | `#293B50` |
| Text Primary | `--color-text-primary` | `#E5ECF5` |
| Text Secondary | `--color-text-secondary` | `#99ACC1` |
| Success | `--color-success` | `#54BA8D` |
| Warning | `--color-warning` | `#DDB66C` |
| Danger | `--color-danger` | `#EF7777` |
| Info | `--color-info` | `#78AFE4` |

---

## 3. Content Classification Tokens

Four distinct semantic visual treatments prevent confusion between approved ERP decisions and advisory or exploratory materials:

1. **Official Documentation (`official`)**: Deep Primary Blue (`--color-class-official*`) + `ShieldCheck` icon.
2. **Research & Evidence (`research`)**: Slate Info Blue (`--color-class-research*`) + `FlaskConical` icon.
3. **Independent Analysis (`independent`)**: Muted Gold/Amber (`--color-class-independent*`) + `ClipboardCheck` icon.
4. **Future Considerations (`future`)**: Neutral Cool Slate (`--color-class-future*`) + `Telescope` icon.

Every status and classification indicator pairs color with an explicit icon and localized text label (never color-only signaling).

---

## 4. Typography System

Loaded via `next/font/google` in `app/layout.tsx`:
- **Arabic Primary:** `IBM Plex Sans Arabic` (`400`, `500`, `600`, `700`) — active first when `html[lang="ar"]`.
- **English Primary:** `Inter` (`400`, `500`, `600`, `700`) — active first when `html[lang="en"]`.
- **Technical Monospace:** `IBM Plex Mono` (`400`, `500`, `600`) — used for official decision IDs (`D-PLAT-01`..`D-PLAT-07`), provenance SHAs, metrics, and code blocks.

Typography standards:
- Body copy: `15px` with `1.65`–`1.75` line-height and `780px` max reading measure in `DocumentationArticle`.
- Page headings: `24px`–`28px` SemiBold with `text-wrap: balance`.
- Tabular numerals (`font-variant-numeric: tabular-nums`) enforced on all counts, percentages, and table indices.
- Bidirectional isolation (`.bidi-ltr`) applied to inline English identifiers and codes inside Arabic text.

---

## 5. Accessibility & Interaction Standards

- Native semantic landmarks (`<aside>`, `<header>`, `<nav>`, `<main>`, `<article>`, `<figure>`, `<table>`).
- Skip-to-main-content link in `AppShell`.
- Visible `2px solid var(--color-focus-ring)` focus indicators via `:focus-visible`.
- Reduced-motion media query (`@media (prefers-reduced-motion: reduce)`) disables transitions cleanly.
- Keyboard shortcuts: `Ctrl+K` / `Cmd+K` opens Global Search; `Escape` closes modals and drawers.
- **Hardened Modal & Drawer Accessibility (`/components/ui/Modal.tsx`, `/lib/focusTrap.ts`):**
  - Rendered via `createPortal` into `document.body` while marking `#app-shell-root` with `inert` and `aria-hidden="true"` so background elements cannot receive keyboard focus or assistive-technology interaction.
  - Places initial focus onto `[data-autofocus]` (e.g., Global Search input) or the first focusable element inside the dialog.
  - Traps `Tab` and `Shift+Tab` cyclically strictly within the open modal/drawer.
  - Restores focus to the triggering element upon close, preserves `aria-labelledby` dialog naming, and supports both `dialog` and `drawer` variants across RTL and LTR.
