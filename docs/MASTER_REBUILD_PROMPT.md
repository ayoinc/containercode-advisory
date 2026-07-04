# ContainerCode Advisory — Full-Stack Rebuild Brief (Master Prompt)

> **How to use:** paste the short launcher prompt below into a Claude Code session opened on this
> repo, or hand this whole file to the agent. Every file path, binding ID, and defect listed here
> was verified against the codebase on 2026-07-04 — the agent should trust but re-verify before
> deleting anything.
>
> **Launcher prompt:**
> *"Execute `docs/MASTER_REBUILD_PROMPT.md` phase by phase, in order. One commit (or PR) per
> phase, verify each phase's acceptance checks before starting the next, and stop to ask only
> when a decision is marked `[DECIDE]`."*

---

## 0. Mission

Rebuild **containercode.club** (this repo) into a fast, fully in-house, Cloudflare-native
consultancy site:

1. **In-house design system** — one token source, one component library, zero third-party UI
   kits. Keep only: Tailwind, `class-variance-authority`, `clsx` + `tailwind-merge`,
   `lucide-react` (icons), `framer-motion` (animation).
2. **Signature landing hero** — a scroll-driven **image-split animation**: the hero image renders
   whole on load, and as the user scrolls it splits into vertical slices that separate with
   parallax to reveal the services section. Buttery 60fps, LCP-safe, reduced-motion fallback.
3. **Smooth & fast rendering** — static-first HTML, deterministic LCP image with preload,
   Lighthouse mobile ≥ 95 on `/`, enforced budgets in CI.
4. **Cloudflare full-stack** — one Worker, one wrangler config, one deploy command. Notion stays
   the CMS but is read through a KV/R2-cached pipeline; D1 persists subscribers/contacts; R2
   mirrors Notion images; secrets live in `wrangler secret`, never in git.

---

## 1. Ground truth (verified)

- **Stack:** Next.js ^14 App Router under `src/app`, React 18.3, TypeScript 5, Tailwind 3.3.
- **Deploy (the real one):** Cloudflare **Workers** via `@opennextjs/cloudflare` ^1.5.1.
  Live config is **`wrangler.jsonc`** (name `containercode`, main `.open-next/worker.js`,
  `nodejs_compat`, assets binding `STATIC_ASSETS`). Live at `https://containercode.club`
  (worker `containercode.ayoinc.workers.dev`). Everything else — root `wrangler.toml`,
  `wrangler.container.toml`, `wrangler.containers.toml`, `wrangler.toml.backup`, `functions/`,
  `_headers`, `_redirects`, Dockerfile/`server.js` container experiment, `wrangler pages deploy`
  scripts — is a **rival dead deploy path** to be removed (Phase 0).
- **Landing page:** `src/app/page.tsx` composes, in order: `ProfessionalHero` →
  `ProfessionalServicesOverview` → `FeatureSection` → `CapabilitiesShowcase` →
  `TestimonialSection` → `CtaSection`. The route is fully static; **no Notion on the landing
  page** (Notion feeds only `/blog`, `/blog/[slug]`, `/team`, and the sitemap via
  `src/lib/notion.ts`).
- **Already provisioned, mostly unused Cloudflare resources:** KV namespaces
  (`ca3f3cba…` bound as `KV_BINDING`, `137e4efd…` as `CACHE`), R2 buckets `blog-images`,
  `newsletter-assets`, `containercode`, three D1 databases (canonical schema:
  `database/schema.sql`), Workers AI binding, Analytics Engine, five Queues, and two cron
  Workers under `workers/` (daily article generator, weekly newsletter). The Next.js app itself
  calls **zero** bindings today (`getCloudflareContext` appears nowhere in `src/`).
- **Route inventory (preserve all):** pages `/`, `/about`, `/blog`, `/blog/[slug]`, `/contact`,
  `/contact/thank-you`, `/faq`, `/privacy`, `/resources`, `/services`, `/services/[slug]`,
  `/team`, `/terms`; API routes under `src/app/api/`: contact, newsletter, newsletter-subscribe,
  send-newsletter, generate-newsletter, deepseek, revalidate, health, sitemap, robots,
  security/csp-report, security/events, analytics/performance.

### Verified defects the rebuild must fix (severity order)

1. **Invisible sections.** `navy-*` and `aqua-*` classes are used in six live files but defined
   nowhere in `tailwind.config.js`, so they emit no CSS. `FeatureSection`
   (`src/components/sections/feature-section.tsx:44`) and `CtaSection`
   (`src/components/sections/cta-section.tsx:6`) rely on `from-navy-900 to-navy-800 text-white`
   — they render **white text on a white page**. Also hit: `testimonial-section.tsx:87`,
   `src/components/ui/page-header.tsx:13` (every page header), blog chips, Notion block
   renderer links. `shadow-elevated` (cta-section.tsx:59) is likewise undefined.
2. **Broken LCP pipeline.** The hero image src is picked **client-side, at random, in a
   `useEffect`** (`src/components/ui/images/smart-image.tsx`): it fetches an 81-image JSON
   manifest, the category lookup always misses (default key `technology` doesn't exist in
   `usageMap.hero`), and the fallback picks a random `hero-cloud-computing-{1,2,3}.jpeg`. Users
   see a gray spinner before a non-deterministic image; `priority` can't preload; the image is
   absent from server HTML. On mobile the hero image is `hidden lg:block` — not shown at all.
3. **Secrets committed in plaintext** across seven config files (`wrangler.jsonc`,
   `wrangler.toml`(+backup), `workers/*.toml`): Notion token, Resend, DeepSeek, Gemini, Pexels,
   Brave keys, revalidation secret. All must be **rotated** and moved to `wrangler secret`.
4. **Cache-header chaos.** `next.config.js headers()` stamps
   `CDN-Cache-Control: s-maxage=31536000` on **every path including HTML**; `middleware.ts` adds
   `Vary: User-Agent` (destroys edge cache reuse), preloads a nonexistent
   `/fonts/inter-var.woff2` (guaranteed 404 each navigation), and sets security headers that
   conflict with next.config's (`X-Frame-Options` SAMEORIGIN vs DENY). `next-pwa` adds a
   catch-all 24h NetworkFirst service worker on top, with stale generated `public/sw.js`
   committed to git.
5. **Dead weight.** 13+ dependencies with zero live imports: `@nextui-org/react`,
   `@headlessui/react`, `@heroicons/react`, all 7 `@radix-ui/*`, `react-spring`,
   `@react-spring/web`, `react-hook-form` + `@hookform/resolvers` (their only importer,
   `smart-form.tsx`, is itself dead), `prisma` + `@prisma/client` (PrismaClient imported
   nowhere), `workbox-webpack-plugin`, `node-fetch`. `puppeteer`, `sharp`, `dotenv`, `critters`,
   `@next/bundle-analyzer` sit in prod deps but belong in devDeps or scripts-only. Baseline
   First-Load JS on `/` is ~206 KB.
6. **Notion layer duplication + silent filter bug.** Three parallel Notion layers exist; only
   `src/lib/notion.ts` is live. Its `safeQueryDatabase()` **silently drops `filter`/`sorts`**,
   so the `Status=Published` filter is never applied. `notion-cms.ts`,
   `src/lib/notion/database.ts`, `src/components/notion/*` (all except
   `notion-block-renderer.tsx`), and `src/lib/isr.ts` are dead (note:
   `src/app/api/revalidate/route.ts:8` imports `CACHE_TAGS` from isr.ts — edit that import
   before deleting). Notion-hosted images are emitted into static pages with **~1-hour signed
   S3 URLs** that expire. `/api/revalidate` checks `REVALIDATION_TOKEN` but deploys set
   `REVALIDATION_SECRET` — on-demand revalidation is effectively unauthenticated/broken.
7. **Data never persisted.** Both live newsletter forms POST to `/api/newsletter`, which only
   sends a Resend welcome email — subscribers are stored **nowhere**. `/api/contact` likewise
   only sends email. `/api/generate-newsletter` always returns 401 (`ADMIN_API_KEY` set
   nowhere). The daily cron worker publishes AI articles into the `GENERATED_ARTICLES` Notion
   DB, which **the site never reads**, and never triggers revalidation.
8. **Domain split.** JSON-LD, `metadataBase`, robots fallback, and one CI job hardcode
   `containercode.com`; the site is `containercode.club`. Structured data emits the wrong
   domain unconditionally (`src/components/seo/structured-data.tsx`).
9. **Build ships every image twice.** `npm run build` runs `scripts/copy-static-files.js`,
   copying all 11 MB of `public/images` into `.next/static/images` — deploys carry each asset
   at two URLs.
10. **Misc:** no `error.tsx` / `not-found.tsx` / `loading.tsx` anywhere; `@vercel/analytics` +
    `@vercel/speed-insights` mounted on a Cloudflare-only site; stat counters render literal
    `0+`/`0★` in served HTML until JS runs; `CtaSection` embeds a form with no
    `onSubmit`/`action` and a placeholder phone number; JetBrains Mono is downloaded via
    `next/font` but its CSS variable is consumed by nothing; four orphaned hero/services
    section variants; landing stats contradict each other ("500+ Clients Served" vs "100+
    Enterprise Clients").

---

## 2. Non-negotiable constraints

- Deploy target is **Cloudflare Workers via OpenNext** (`opennextjs-cloudflare build` →
  `wrangler deploy`). No Vercel, no Cloudflare Pages, no containers.
- `sharp` cannot run in the Worker at request time — image variants are produced at build time
  or via Cloudflare Image Resizing (`/cdn-cgi/image/`), never at the edge with Node libs.
- Notion remains the CMS for blog/team content. Landing-page copy stays in the repo (it is
  hardcoded today; do not move it into Notion as part of this rebuild).
- All existing public routes and API routes keep working. The two cron Workers
  (`workers/article-generator.js`, `workers/newsletter-generator.js`) keep running.
- Never commit a secret. Anything that was in a `[vars]` block goes through `wrangler secret`
  and `.dev.vars` (already gitignored).
- Honor `prefers-reduced-motion` for every animation added.
- British English in all user-facing copy (existing convention).

---

## 3. Phase 0 — Security & single deploy path

1. **Rotate every leaked key** (Notion, Resend, DeepSeek, Gemini, Pexels, Brave, revalidation
   secret) in their dashboards. Set replacements via `wrangler secret put` and document names
   (values omitted) in `.env.example`. `.dev.vars` holds local values.
2. Collapse to **one config: `wrangler.jsonc`**. Delete `wrangler.toml`,
   `wrangler.toml.backup`, `wrangler.container.toml`, `wrangler.containers.toml`, `Dockerfile`,
   `docker-compose.yml`, `server.js`, `deploy-container.sh`, `src/cloudflare/`, `functions/`,
   `_headers`, `_redirects`, `prisma/`. Pin one current `compatibility_date`. Add
   `routes`/custom-domain config for `containercode.club` so the domain binding is reproducible
   from code.
3. Fix `package.json` scripts: `deploy` = OpenNext build + `wrangler deploy` only; delete all
   `wrangler pages deploy` scripts. Fix `.github/workflows/ci-cd.yml` to a single
   wrangler-action Workers deploy (it currently deploys the same commit to Pages **and**
   Workers; the staging job deploys into the empty `functions/` dir).
4. Standardise env names: `NOTION_TOKEN` everywhere (scripts currently mix `NOTION_API_KEY`);
   one `REVALIDATION_SECRET` checked by `/api/revalidate`; define `ADMIN_API_KEY` so
   `/api/generate-newsletter` can actually authenticate.
5. **Acceptance:** fresh clone + `npm ci` + `npm run deploy` (with secrets set) is the only
   deploy path; `git grep` finds no API key material; CI has exactly one deploy job.

## 4. Phase 1 — Broken-visual triage (ship same day)

1. Define the missing scales in the token source (Phase 2 formalises it): add **`navy`**
   (deep blue-slate for dark sections) and **`aqua`** (accent) full 50–950 scales, plus
   `shadow-elevated` — or consciously replace those classes; `[DECIDE]` only if you want to
   drop the navy/aqua look entirely. This un-breaks `FeatureSection`, `CtaSection`,
   `TestimonialSection` stats, `page-header`, blog chips.
2. Resolve the **primary colour conflict**: `tailwind.config.js` says `#14b8c6`,
   `globals.css` custom properties say `#14b8a6`, `ui/design-system.tsx` says HSL blue. Pick
   one brand primary (recommend the teal already dominant in production), define it once.
3. Fix the stat counters to render **final values in server HTML** (SEO/no-JS correctness) and
   animate only as progressive enhancement. Reconcile the contradictory stats into one set.
4. Wire or drop JetBrains Mono; remove the redundant Google Fonts preconnects in
   `src/app/layout.tsx` (fonts are self-hosted by `next/font`).
5. Fix `CtaSection`'s dead form (point it at `/api/contact`) and placeholder phone; standardise
   contact email addresses.
6. Add `src/app/error.tsx`, `not-found.tsx`, `loading.tsx`, `global-error.tsx` styled with the
   design system.
7. Replace every `containercode.com` literal with the canonical
   `NEXT_PUBLIC_SITE_URL=https://containercode.club` (metadataBase, JSON-LD in
   `structured-data.tsx`, robots fallback, CI env).
8. **Acceptance:** every page visually inspected (local `next dev` + Playwright screenshots) —
   no white-on-white sections, JSON-LD emits `.club`, counters show real values with JS
   disabled.

## 5. Phase 2 — Fully in-house design system

1. **One token source.** Make the `:root` custom properties in `src/app/globals.css` the single
   source of truth (colour scales incl. navy/aqua, spacing, radii, shadows, type scale, motion
   durations/easings) and point `tailwind.config.js` at them
   (`colors: { primary: { 500: 'rgb(var(--color-primary-500) / <alpha-value>)' } }` pattern).
   Delete every hardcoded hex duplicated between the two files.
2. **One component library.** Keep and polish the cva primitives in `src/components/ui/`
   (`button.tsx`, `card.tsx`, `input.tsx`, `textarea.tsx`, `section.tsx` + `Container`) as the
   canonical set; extend with the primitives the site actually needs (Badge, NavLink, Toast
   wrapper, Form field). Delete the parallel CSS-class system in `globals.css`
   (`.btn*`, `.card`, `.badge*`, `.form-*`, `.nav-link`, `.feature-card`, `.testimonial-card`)
   after migrating its few consumers, and delete the contradictory 496-line
   `src/components/ui/design-system.tsx`.
3. **Purge dead code** (verify zero importers first — the deletion manifest in §11 was verified
   but re-check): 4 orphaned section variants, `dynamic-ui.tsx`, `contact-form-wrapper.tsx` +
   `smart-form.tsx` + the `features/` barrel, `ui/advanced/*`, 7 of 8 `src/components/notion/*`
   components, `notion-cms.ts`, `notion/database.ts`, `isr.ts` (fix the `CACHE_TAGS` import in
   the revalidate route first), `website-content-mapping.json`, `src/utils/dynamic-imports.tsx`,
   dead monitoring libs, 0-byte `test-*.js` files, `analyze/nodejs.html`, `log.txt`.
4. **Uninstall** the dead dependencies listed in §1-defect-5; move build/test-only packages to
   devDependencies. Strip `next.config.js` of the now-dead `splitChunks` cacheGroups and
   `optimizePackageImports` entries that reference removed packages.
5. **One image component.** Collapse the four image components into a single `SmartImage` that
   takes an explicit `src` (no client-side manifest fetch, no randomness), with an art-direction
   variant for hero use.
6. **Acceptance:** `npm run build` clean; `npx depcheck` (or equivalent) shows no unused UI
   deps; grep proves no `@nextui|@headlessui|@heroicons|@radix|react-spring|react-hook-form`
   imports; every rendered page uses only `src/components/ui` primitives + Tailwind tokens.

## 6. Phase 3 — Scroll-driven image-split hero

**Creative spec.** On load, the hero shows a full-bleed cinematic image (containers/cloud
infrastructure motif) behind the headline. As the user scrolls the first ~150vh, the image
**splits into 3–5 vertical slices** that slide apart at different speeds (center slices slower,
outer slices faster + slight y-parallax and outward drift), gaps revealing the page background,
easing the visitor into the services section. Headline and CTAs fade/translate up and pin
briefly. Think "panels of a container door opening".

**Implementation requirements.**
- Container: `position: sticky` hero inside a `~250vh` scroll track;
  `framer-motion` `useScroll({ target, offset })` + `useTransform` mapping progress →
  per-slice `x`/`y`/`clipPath`. **Compositor-only properties** (transform, opacity,
  clip-path); no width/height/top animation; `will-change: transform` on slices only while the
  effect is active.
- **One image download, N slices**: each slice is a `div` showing a region of the *same* image
  (`object-fit: cover` + per-slice `object-position`, or `background-position` math) — do not
  ship N separate images.
- **LCP-safe**: deterministic `src` rendered in server HTML through the Phase-2 `SmartImage`
  with `priority` → real `<link rel="preload" as="image" fetchpriority="high">`; explicit
  aspect ratio reserved (zero CLS); AVIF with WebP fallback, ≤ 120 KB at 1600w desktop /
  ≤ 60 KB at 828w mobile.
- **Mobile** (< lg, where today's hero image is hidden entirely): show the image; use a
  simplified 2-slice split or a scale+fade reveal — no heavy parallax on touch.
- **Reduced motion**: `useReducedMotion()` → static hero with a simple crossfade; the existing
  `prefers-reduced-motion` CSS block in `globals.css` stays authoritative.
- Wrap framer-motion usage in `LazyMotion` + `domAnimation` (`m.` components) across the site
  to cut the motion bundle.
- Rebuild `professional-hero.tsx` around this; keep headline copy and CTAs; below-the-fold
  sections switch from time-based `animate` (they currently fire invisibly at mount, delays up
  to 1.4s) to `whileInView` entrances.
- **Acceptance:** Chrome DevTools performance trace of the scroll shows no layout/paint storms
  (transform-only), 60fps on a mid-tier device profile (4× CPU throttle ≥ 30fps); LCP element
  is the hero `<img>` server-side; reduced-motion verified; mobile shows the hero image.

## 7. Phase 4 — Rendering performance

1. **Images.** Remove `scripts/copy-static-files.js` from the build (defect 9). Replace the
   dead sharp scripts with one build step that emits AVIF/WebP responsive variants for the
   ~15 images actually referenced (11 MB / 211 files in `public/images` is mostly unused —
   prune to what pages reference). `[DECIDE]` between (a) build-time variants + `<picture>`
   (zero runtime deps, works today) or (b) a custom `next/image` loader on Cloudflare Image
   Resizing `/cdn-cgi/image/` (needs the zone plan to support it). Default to (a).
2. **Kill the cache chaos.** Scope immutable `Cache-Control`/`CDN-Cache-Control` to hashed
   static assets only; HTML gets `s-maxage` measured in minutes with SWR. Remove
   `Vary: User-Agent`, the 404 font preload, and dead preconnects from `middleware.ts`. One
   source of security headers (recommend next.config for static policy, middleware only for
   per-request logic); resolve the X-Frame-Options conflict.
3. **Remove `next-pwa`** and the committed `public/sw.js` / `public/workbox-*.js` (plus an
   unregister snippet for existing clients). No offline requirement exists; if one appears
   later, use `@serwist/next`.
4. **Shrink client JS.** De-clientify `testimonial-section.tsx` (uses only `cn()`), audit the
   49 `'use client'` files, drop `PerformanceProvider`'s 30-second polling loop, replace
   `@vercel/analytics`/`@vercel/speed-insights` with **Cloudflare Web Analytics** (one beacon
   script). Budget: **First-Load JS on `/` ≤ 150 KB** (baseline 206 KB).
5. **Slim the middleware** (16.7 KB running on every request): keep CSP/security logic that is
   genuinely per-request, move rate limiting to KV (or drop to Cloudflare WAF rules — its
   in-memory `Map` + `setInterval` don't work on Workers anyway), delete the bot-blocking that
   403s curl/monitoring UAs.
6. **One perf-budget source.** Delete the dead `performance.budgets` key and
   `check-bundle-size.js`'s warning-only logic; wire **LHCI** (`lighthouse.config.js` asserts,
   tightened: perf ≥ 0.95, LCP ≤ 2.0s lab, CLS ≤ 0.05, TBT ≤ 200ms) plus a size-limit check
   that **fails CI**, into the pipeline.
7. **Acceptance:** LHCI green on `/`, `/services`, `/blog` mobile; First-Load JS ≤ 150 KB;
   `curl -I` shows sane cache headers on HTML vs assets; no service worker registered.

## 8. Phase 5 — Cloudflare full-stack data plane + Notion pipeline

1. **Enable OpenNext incremental cache**: uncomment/configure `r2IncrementalCache` in
   `open-next.config.ts` (R2 bucket `containercode` or a new `cache` bucket) so ISR persists
   across isolates. Add `export const revalidate = 3600` (or per-route values) to
   `/blog`, `/blog/[slug]`, `/team`.
2. **Notion read layer** (single file: `src/lib/notion.ts`): fix `safeQueryDatabase` so
   filters/sorts are actually passed; add pagination; add `AbortSignal.timeout(5000)` to every
   call; cache reads in **KV** (`KV_BINDING`) via `getCloudflareContext()` with
   stale-while-revalidate semantics and cache tags. Set the missing
   `NOTION_DATABASE_TEAM_MEMBERS` var so `/team` stops silently serving fallback content.
3. **Fix on-demand revalidation end-to-end**: `/api/revalidate` authenticates against
   `REVALIDATION_SECRET`; the cron article worker publishes into **BLOG_POSTS** (retire the
   never-read `GENERATED_ARTICLES` split — `[DECIDE]` if the two DBs must stay separate) and
   then calls `/api/revalidate`. Optionally add a Notion webhook → revalidate route.
4. **Mirror Notion images to R2**: at fetch/revalidate time, copy cover images and block images
   to the `blog-images` R2 bucket (binding `IMAGES`) and rewrite URLs — Notion's signed S3 URLs
   expire after ~1 hour and are currently baked into static pages.
5. **Persist data in D1** (`database/schema.sql` is canonical): `/api/newsletter` writes
   subscribers to D1 (and optionally syncs to the Notion SUBSCRIBERS db), `/api/contact` stores
   submissions, both via `getCloudflareContext().env.DB`. Fix the D1 binding drift: the main
   app and `workers/*` currently point the same `DB` binding at **two different databases** —
   pick one, migrate, delete the other two.
6. Consolidate the `workers/` sub-project: fix `wrangler-queues.toml` (main points at the wrong
   file for its Durable Object exports), align wrangler versions with root, deploy workers from
   their configs (the current `workers/deploy.sh` ignores the tomls, so deployed workers lack
   every binding they depend on, and calls a nonexistent `wrangler triggers deploy`).
7. **Acceptance:** publish a Notion blog post → appears on `/blog` within the revalidate window
   without a redeploy; blog images survive > 1 hour; a newsletter signup appears in D1; cold
   isolate requests to `/blog` don't hit Notion synchronously (KV hit).

## 9. Phase 6 — CI/CD + verification

- One pipeline: lint + typecheck + unit → build (OpenNext) → LHCI + size budget (hard fail) →
  Playwright smoke (all 13 pages render, no console errors, hero split animates) → deploy via
  wrangler-action → post-deploy `/api/health` check against `containercode.club`.
- Remove CI references to nonexistent files (`jest.integration.config.js`,
  `scripts/generate-sitemap.js`) and unset-secret steps (Snyk/Slack) or add the secrets.
- Update `README.md` to describe the one true architecture; delete stale status docs
  (`CONTAINER_STATUS.md`, `CONTAINER_DEPLOYMENT_GUIDE.md`, `WORKER_PIPELINE_ARCHITECTURE.md`)
  or move to `docs/archive/`.

## 10. Asset generation (Higgsfield + open-source)

- **Hero master image:** generate with the **Higgsfield CLI** (authenticated on the owner's
  machine — not available in CI/agent containers, so generated assets get committed to
  `public/images/`). Brief: cinematic wide shot, container/cloud-infrastructure motif in the
  brand teal/navy palette, high detail across the full width (the split animation exposes every
  slice), key subject in the central 60% (slices 1 and N drift off-canvas first), no text baked
  in. Deliver ≥ 2400px wide; export AVIF/WebP at 1600w and 828w within the §6 weight budgets.
- **Open-source photography intertwined where authenticity matters** (services, team, about):
  Pexels/Unsplash — the repo already has a Pexels API key (rotate it first, §3). Keep
  attribution metadata in a manifest; run everything through the same variant pipeline.
- Regenerate the **0-byte `public/og-image.jpg`** (referenced by OpenGraph/Twitter metadata)
  from the new hero art, 1200×630.

## 11. Appendix — deletion manifest (verified zero live importers, re-verify before deleting)

- **Configs/infra:** `wrangler.toml`, `wrangler.toml.backup`, `wrangler.container.toml`,
  `wrangler.containers.toml`, `Dockerfile`, `docker-compose.yml`, `server.js`,
  `deploy-container.sh`, `functions/`, `_headers`, `_redirects`, `prisma/`, `src/cloudflare/`.
- **Components:** `src/components/sections/{hero,modern-hero,services-overview,modern-services-overview}.tsx`,
  `src/components/ui/{design-system,dynamic-ui,pexels-image,optimized-image}.tsx`,
  `src/components/ui/advanced/`, `src/components/features/` (barrel + smart-form +
  pwa-install-prompt), `src/app/contact/contact-form-wrapper.tsx`,
  `src/components/notion/*` except `notion-block-renderer.tsx`,
  `src/components/forms/newsletter-subscription.tsx` (fold its Notion write into the new
  D1-backed route first).
- **Libs:** `src/lib/notion-cms.ts`, `src/lib/notion/database.ts`, `src/lib/isr.ts` (fix
  `api/revalidate` import), `src/lib/pexels.ts` + `media-downloader.ts` (script-only → move or
  drop), `src/utils/dynamic-imports.tsx`, `src/lib/subscriber-segmentation.ts`, redundant
  monitoring libs under `src/lib/monitoring/` (keep one thin web-vitals reporter or none).
- **Deps to uninstall:** `@nextui-org/react`, `@headlessui/react`, `@heroicons/react`, all
  `@radix-ui/*`, `react-spring`, `@react-spring/web`, `react-hook-form`,
  `@hookform/resolvers`, `prisma`, `@prisma/client`, `workbox-webpack-plugin`, `node-fetch`,
  `next-pwa`, `@vercel/analytics`, `@vercel/speed-insights`, `notion-client`,
  `@cloudflare/containers`, `pexels` (if lib moves to scripts). **Move to devDeps:**
  `puppeteer`, `sharp`, `dotenv`, `critters` (or drop with `optimizeCss`),
  `@next/bundle-analyzer`, `web-vitals` (if kept).
- **Artifacts:** `public/sw.js`, `public/workbox-*.js`, `analyze/nodejs.html`, `log.txt`,
  0-byte `test-*.js` files at root, `website-content-mapping.json` (archive its copy as seed
  data if wanted).
