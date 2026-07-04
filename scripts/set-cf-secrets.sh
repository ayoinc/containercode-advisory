#!/usr/bin/env bash
# Set the app's runtime secrets as *encrypted Cloudflare Worker secrets*.
#
# Why: the site reads these via process.env at request time. They are NOT in
# wrangler.jsonc (that's a public repo). Plaintext dashboard "variables" get
# overwritten by `wrangler deploy`; Worker *secrets* persist. If the contact /
# newsletter forms return 500, RESEND_API_KEY is almost certainly missing here.
#
# Usage: export the values (rotate the leaked ones first!), then run:
#   export RESEND_API_KEY=... NOTION_TOKEN=... REVALIDATION_SECRET=...
#   bash scripts/set-cf-secrets.sh
# Requires an authenticated wrangler (`npx wrangler login`, or CLOUDFLARE_API_TOKEN).
set -euo pipefail

# RESEND_API_KEY is the one the contact + newsletter forms need.
SECRETS=(
  RESEND_API_KEY
  NOTION_TOKEN
  REVALIDATION_SECRET
  ADMIN_API_KEY
  DEEPSEEK_API_KEY
  GEMINI_API_KEY
  PEXELS_API_KEY
  BRAVE_API_KEY
)

for name in "${SECRETS[@]}"; do
  val="${!name:-}"
  if [ -z "$val" ]; then
    echo "skip  $name (not set in env)"
    continue
  fi
  echo "set   $name"
  printf '%s' "$val" | npx wrangler secret put "$name"
done

echo "Done. Verify with: npx wrangler secret list"
