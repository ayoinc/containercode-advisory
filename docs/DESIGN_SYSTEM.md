# ContainerCode Design System

Dark-first, technical, "close-to-the-metal" — sourced from the Stitch `DESIGN.md`
export and implemented in-house (no third-party UI kit). This document is the
map between the design spec and the code.

## Where the tokens live

- **`src/app/globals.css` `:root`** — the single source of truth. Every colour is a
  space-separated RGB triplet (e.g. `--color-navy-900: 14 21 19;`) so Tailwind can
  apply `<alpha-value>` (`bg-navy-900/80`, `text-aqua-400/60`).
- **`tailwind.config.js`** — reads those vars via `rgb(var(--color-…) / <alpha-value>)`
  and exposes the scales as utilities. `primary` is aliased to `aqua`, so existing
  `primary-*` usages across the codebase adopt the brand automatically.

## Palette

| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Page background / surface | `navy-900` | `#0e1513` | body background |
| Deepest surface | `navy-950` | `#090f0e` | footer, insets, alternating sections |
| Card surface | `navy-850` | `#161d1b` | cards, panels |
| Raised surface | `navy-800` | `#1a211f` | secondary buttons, chips |
| Border | `navy-700` | `#2f3634` | 1px card/section borders |
| Muted text / icons | `navy-300` | `#859490` | captions, meta |
| Secondary text | `navy-200` | `#bbcac6` | body copy on dark |
| Primary text | `navy-100` | `#dde4e1` | headings, emphasis |
| **Beacon (primary)** | `aqua-400` | `#4fdbc8` | links, highlights, live metrics |
| Solid action | `aqua-500` | `#14b8a6` | button fills (text = `navy-950`) |
| Accent (periwinkle) | `secondary-300` | `#bec6e0` | rare accents |
| Accent (coral) | `tertiary-400` | `#ffb59e` | warnings, warmth |
| Error | `error-400/500` | `#ffb4ab` / `#dc4140` | critical alerts |

## Typography

- **Geist** (`font-display`) — headlines. Self-hosted via the `geist` package
  (`--font-geist-sans`); no external font fetch at runtime.
- **Inter** (`font-sans`) — body copy (`next/font/google`).
- **JetBrains Mono** (`font-mono`) — data labels, status chips, the `// comment`
  and `[ 01 ]` section-number accents, cloud-platform strips.

Display headings use tight tracking (`-0.02em`) and scale down on mobile.

## Shape & elevation

- Soft radii: `0.25rem` default, `0.5rem` (`rounded-lg`) for cards/panels.
- Dark elevation uses **navy-tinted ambient shadows** (`shadow-card`, `shadow-elevated`,
  `--shadow-glow` for aqua focus glow) plus a 1px `navy-700` outline — never black drop
  shadows, which are invisible on a dark canvas.

## Component conventions (see `globals.css` `@layer components`)

- **Buttons** — primary = solid `aqua-500` on `navy-950` text; secondary = `navy-800`
  with aqua-on-hover border; ghost = mono aqua.
- **Cards** — `navy-850` + `navy-700` border; `.card-featured` adds a 2px aqua top accent.
- **Inputs** — `navy-950` field, aqua focus border + `aqua-500/30` glow ring.
- **Status chips** (`.badge`) — mono, uppercase; aqua = live/active, navy = pending,
  error = failed.
- **`.tech-label`** — the mono uppercase `[ 0n ] — Section` / `// comment` accent used
  to number landing sections and reinforce the developer-first identity.
- **`.bg-tech-grid` / `.bg-tech-dots`** — subtle technical canvas textures.

## What this replaced

- The undefined `navy-*` / `aqua-*` Tailwind classes (which were silently emitting no
  CSS and rendering two landing sections white-on-white) are now first-class scales.
- The old light theme (`bg-white` / `text-gray-900`), the duplicated CSS `.btn/.card`
  class system, and the conflicting primary-colour definitions were consolidated into
  the single token layer above.

## Follow-ups (not in this pass)

Inner pages (`/about`, `/services`, `/blog`, `/contact`, `/team`, `/faq`, …) still carry
hardcoded light-theme classes and inherit the dark shell but need per-section conversion.
The scroll-driven image-split hero animation (see `docs/MASTER_REBUILD_PROMPT.md`, Phase 3)
is scoped as a follow-up on top of the now-static themed hero.
