# Imagery & Brand Assets

The redesign ships **code-generated, on-brand placeholder art** so the site
looks intentional today, with a clean path to swap in Higgsfield photorealistic
renders and open-source photography.

## Generated assets

`scripts/generate-brand-assets.mjs` builds everything from code (no external
services) using `sharp`:

```bash
node scripts/generate-brand-assets.mjs
```

Outputs:
| File | Size | Use |
|------|------|-----|
| `public/images/hero/hero-master.webp` | 1600w | scroll-split hero background |
| `public/images/hero/hero-master-828.webp` | 828w | mobile |
| `public/images/hero/hero-master.jpg` | 1600w | fallback |
| `public/images/hero/hero-master.svg` | vector | source of truth |
| `public/og-image.jpg` | 1200×630 | OpenGraph / Twitter card (was 0 bytes) |

The hero is a stylised data-centre of **five vertical "container columns"**
spaced to line up with the hero's five split slices — so each slice reveals a
column as it parts. Colours come straight from the design tokens (navy canvas,
aqua accents).

## Swapping in a Higgsfield hero (photorealistic)

The Higgsfield CLI is authenticated on the owner's machine (not in CI). Generate
locally, drop the file in, done — the component reads one constant.

1. Generate a **≥2400px-wide** master. Suggested prompt:

   > Cinematic wide shot of a modern cloud data-centre / server-rack corridor,
   > deep teal-and-near-black palette (#0e1513 background, #14b8a6/#4fdbc8
   > accents), volumetric aqua rim-light, high detail evenly across the **full
   > width** of the frame, strong **vertical structure** (rack columns) so the
   > image reads well when split into vertical slices, key subject kept within
   > the central 60%, no text or logos, photoreal, 16:10, ultra-detailed.

   Export AVIF/WebP at **1600w (≤120 KB)** and **828w (≤60 KB)**.

2. Save as `public/images/hero/hero-master.webp` (+ `-828.webp`), replacing the
   generated placeholders. Keep the same filenames and no code change is needed;
   otherwise update `HERO_SRC` in
   `src/components/sections/scroll-split-hero.tsx`.

3. Regenerate the OG card from the new art if desired (edit `ogSVG()` in the
   script, or composite the render).

## Open-source photography (services / team / about)

Where authentic photos matter, use Pexels/Unsplash (the repo already has a
Pexels key — rotate it first, see the rebuild brief). Keep attribution in a
manifest and run everything through the same `sharp` variant step. The current
service cards are icon-forward (no photos) by design; add photography only if it
raises quality.

## Notes

- `images.unoptimized: true` (Cloudflare Workers), so ship pre-sized variants —
  do not rely on Next's optimizer. `sharp` runs at build time, never at the edge.
- Fonts available for rasterising in CI are DejaVu only; the OG card uses DejaVu
  Sans. For pixel-perfect Geist wordmarks, generate the OG locally where Geist
  is installed, or composite the brand logo SVG.
