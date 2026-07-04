---
name: ContainerCode Design System
colors:
  surface: '#0e1513'
  surface-dim: '#0e1513'
  surface-bright: '#343b39'
  surface-container-lowest: '#090f0e'
  surface-container-low: '#161d1b'
  surface-container: '#1a211f'
  surface-container-high: '#252b2a'
  surface-container-highest: '#2f3634'
  on-surface: '#dde4e1'
  on-surface-variant: '#bbcac6'
  inverse-surface: '#dde4e1'
  inverse-on-surface: '#2b3230'
  outline: '#859490'
  outline-variant: '#3c4947'
  surface-tint: '#4fdbc8'
  primary: '#4fdbc8'
  on-primary: '#003731'
  primary-container: '#14b8a6'
  on-primary-container: '#00423b'
  inverse-primary: '#006b5f'
  secondary: '#bec6e0'
  on-secondary: '#283044'
  secondary-container: '#3f465c'
  on-secondary-container: '#adb4ce'
  tertiary: '#ffb59e'
  on-tertiary: '#5e1800'
  tertiary-container: '#f38764'
  on-tertiary-container: '#6c2106'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#71f8e4'
  primary-fixed-dim: '#4fdbc8'
  on-primary-fixed: '#00201c'
  on-primary-fixed-variant: '#005048'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59e'
  on-tertiary-fixed: '#3a0b00'
  on-tertiary-fixed-variant: '#7c2d11'
  background: '#0e1513'
  on-background: '#dde4e1'
  surface-variant: '#2f3634'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system for this consultancy is rooted in technical excellence, security, and high-performance engineering. It is designed to evoke trust through precision, mimicking the efficient and "close-to-the-metal" aesthetic of modern cloud infrastructure providers.

The visual style is **Corporate / Modern** with a **Technical** edge. It prioritises clarity, rapid information processing, and a systematic approach to data density. The interface should feel fast, utilitarian, and unmistakably professional, using high-contrast scales and monospaced accents to signal a developer-centric focus.

**Key Principles:**
- **Clarity over Decoration:** Every element serves a functional purpose.
- **Precision:** Perfect alignment and consistent spacing to reflect code quality.
- **Authority:** A sophisticated dark-first palette that suggests a secure, enterprise-grade environment.

## Colors

The colour strategy employs a high-contrast relationship between the **Navy** foundation and the vibrant **Aqua** primary. This system is optimised for dark-mode by default, ensuring that technical content and code blocks are legible and easy on the eyes during long periods of focus.

**Navy Palette:** Used for the structural canvas. The 900 and 950 weights form the primary backgrounds, while lighter weights (300-500) are reserved for borders and secondary text.
**Aqua Palette:** Reserved for primary actions, success states, and highlighting key technical metrics. It serves as the "beacon" within the dark interface.
**Functional Colours:** 
- **Error:** High-chroma red for critical security alerts.
- **Warning:** Amber for non-critical infrastructure notices.
- **Surface:** Tiered Navy shades (800 for cards, 900 for background) create depth without relying on heavy shadows.

## Typography

The typography system balances modern sans-serif fonts with technical monospaced accents. 

**Geist** is utilised for headlines to provide a sharp, geometric, and "engineered" feel. **Inter** handles the heavy lifting for body copy, chosen for its exceptional readability and neutral tone. **JetBrains Mono** is the specialist font used for data labels, status badges, and code snippets, grounding the system in a developer-first context.

Large display headings should use tighter letter spacing to maintain a compact, high-performance appearance. For mobile devices, display sizes should scale down to 32px to ensure full-word visibility on narrow viewports.

## Layout & Spacing

The layout is built on a **Fluid Grid** system using a 4px base unit. This allows for the high information density required by technical dashboards and consultancy reports.

**Grid Architecture:**
- **Desktop:** 12-column grid with a 1280px max-width. Margins are fixed at 48px to provide breathing room for complex data.
- **Tablet:** 8-column grid with 24px margins.
- **Mobile:** 4-column grid with 16px margins.

Spacing follows a strict mathematical progression. Smaller units (4px, 8px) are used for internal component grouping, while larger units (48px, 64px) define distinct sections of content. This rhythm ensures that the technical density never feels cluttered.

## Elevation & Depth

This design system uses **Tonal Layers** combined with **Ambient Shadows** to define hierarchy. 

Because the primary mode is dark, traditional black shadows are ineffective. Instead, elevation is communicated through:
1.  **Surface Lightening:** As elements "rise" toward the user, their background colour shifts from Navy 950 to Navy 800.
2.  **Indigo-Tinted Shadows:** Shadows should use a dark indigo or navy tint (e.g., `rgba(2, 6, 23, 0.5)`) with a large blur radius and 0 spread to create a soft, natural lift.
3.  **Subtle Outlines:** Level 1 surfaces (cards) feature a 1px border of Navy 800 to ensure clear separation from the Navy 950 background, mimicking the clean, "glass-adjacent" look of modern cloud panels.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a subtle modern touch without sacrificing the professional, "engineered" rigidity expected of a consultancy.

- **Small Components:** Checkboxes, tags, and small buttons use a 4px (0.25rem) radius.
- **Containers:** Cards and modals use a 8px (0.5rem) radius for a more approachable but still structured feel.
- **Interactive States:** Focus states should follow the roundedness of the parent element, with a 2px offset for maximum clarity.

## Components

**Buttons:**
- **Primary:** Solid Aqua 500 background with Navy 950 text. Heavy font weight.
- **Secondary:** Navy 800 background with Navy 100 text. Subtle Aqua 500 border on hover.
- **Ghost:** No background, Aqua 500 text, JetBrains Mono font.

**Cards:**
Background Navy 900 with a 1px border of Navy 800. Use for technical summaries. For "featured" consultancy services, apply a subtle top-border accent in Aqua 500.

**Input Fields:**
Background Navy 950, 1px border of Navy 700. On focus, the border transitions to Aqua 500 with a faint Aqua outer glow.

**Status Chips:**
Small, using JetBrains Mono. Use Aqua for 'Active/Live', Navy 700 for 'Pending', and Red for 'Failed/Alert'.

**Technical Accents:**
Integrate code-like syntax (e.g., `[ 01 ]` or `// comment`) for section numbering and auxiliary metadata to reinforce the 'ContainerCode' identity.