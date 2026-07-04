# Deployment — Cloudflare Workers Builds

The site deploys to **Cloudflare Workers** via OpenNext. Deployment is owned by
**Cloudflare Workers Builds** (Cloudflare's Git-connected CI/CD), _not_ GitHub
Actions — so there are no Cloudflare API tokens to store or rotate in GitHub.

## One-time setup (Cloudflare dashboard)

1. **Workers & Pages → `containercode` → Settings → Build → Connect to Git**,
   select `ayoinc/containercode-advisory`, production branch **`main`**.
2. **Build configuration**:
   - Build command: `npx opennextjs-cloudflare build`
   - Deploy command: `npx wrangler deploy`
   - Node version: **22** (read automatically from `.nvmrc` = `22.11.0`)
   - Root directory: `/`
3. Cloudflare Workers Builds runs pre-authenticated — **no `CLOUDFLARE_API_TOKEN`
   is needed**.

On every push to `main`, Cloudflare runs the OpenNext build and deploys the
worker (`.open-next/worker.js`, per `wrangler.jsonc`).

## Runtime secrets — set before the first deploy

The app reads these at request time; set them as **encrypted Worker secrets**
(never plaintext `vars`):

`NOTION_TOKEN`, `RESEND_API_KEY`, `DEEPSEEK_API_KEY`, `GEMINI_API_KEY`,
`PEXELS_API_KEY`, `BRAVE_API_KEY`, `REVALIDATION_SECRET`, `ADMIN_API_KEY`.

```bash
npx wrangler secret put NOTION_TOKEN
npx wrangler secret put RESEND_API_KEY
# …repeat for each
```

(or dashboard → worker → **Settings → Variables and Secrets**).

### ⚠️ CRITICAL — rotate the leaked keys

Those keys are currently committed **in plaintext** in `wrangler.jsonc` `vars`
in this **public** repo, so they are compromised. For each one:

1. **Rotate** it in the provider's dashboard (Notion, Resend, DeepSeek, Gemini,
   Pexels, Brave).
2. Set the new value as a **Worker secret** (above).
3. **Delete** it from `wrangler.jsonc` `vars`, keeping only non-secret vars
   (`NEXT_PUBLIC_SITE_URL`, `RESEND_DOMAIN`, `RESEND_EMAIL_FROM`, `ADMIN_EMAIL`,
   Notion database IDs).

## Bindings

`wrangler.jsonc` already declares the KV, R2, D1, and Workers AI bindings plus
the `STATIC_ASSETS` asset binding. Cloudflare Workers Builds uses this config
as-is.

## GitHub Actions

`.github/workflows/ci.yml` still runs on pull requests (type-check · lint ·
build) as a fast quality gate. The GitHub **deploy** workflow was removed —
Cloudflare Workers Builds owns deployment, so GitHub never needs Cloudflare
credentials.

## Recommended follow-ups

- Bump `compatibility_date` in `wrangler.jsonc` (currently `2024-12-30`) to a
  recent date to pick up the latest workerd features/fixes.
- Add a `routes` / `custom_domain` entry so the `containercode.club` mapping is
  reproducible from code rather than dashboard-only.
