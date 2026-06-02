# Deploy runbook — minimal-so on Cloudflare Workers

Copy-paste commands to provision and deploy the Worker. App name is `minimal-so`
(from `wrangler.jsonc`). Run everything from the repo root.

## 0. Prerequisites (one-time)

```sh
bun install
bunx wrangler login          # authenticate the Cloudflare account
bunx wrangler whoami         # confirm the right account is selected
```

## 1. Create the R2 bucket

The `AVATARS` binding in `wrangler.jsonc` points at a bucket named
`minimal-so-avatars`. Create it once:

```sh
bunx wrangler r2 bucket create minimal-so-avatars
```

> The two rate-limit bindings (`API_RATELIMIT`, `WRITE_RATELIMIT`) are
> **config-only** — they're declared inline in `wrangler.jsonc` and need no
> CLI command. Their `namespace_id`s (`1001`/`1002`) only need to be unique
> within this Worker; leave them as-is unless you add more limiters.

> The `EMAIL` binding (`send_email` in `wrangler.jsonc`) is also config-only —
> no CLI command and no secret. Transactional email goes through Cloudflare
> Email Sending; the sender domain (`mail.minimal.so`) must be onboarded once
> via `wrangler email sending enable mail.minimal.so`.

## 2. Set server secrets

These are read via `process.env.*` in the Worker (auto-populated from secrets
because `nodejs_compat` + `compatibility_date 2025-11-01` are set). Each command
prompts for the value. On the first one, wrangler may ask to create the Worker
— answer yes.

**Required:**

```sh
bunx wrangler secret put TURSO_DATABASE_URL
bunx wrangler secret put TURSO_AUTH_TOKEN
bunx wrangler secret put BETTER_AUTH_SECRET
```

**Optional — Google OAuth** (login falls back to email-only if unset):

```sh
bunx wrangler secret put GOOGLE_CLIENT_ID
bunx wrangler secret put GOOGLE_CLIENT_SECRET
```

**Optional — Polar billing** (pricing/checkout disabled if unset):

```sh
bunx wrangler secret put POLAR_ACCESS_TOKEN
bunx wrangler secret put POLAR_WEBHOOK_SECRET
bunx wrangler secret put POLAR_PRO_MONTHLY_PRODUCT_ID
bunx wrangler secret put POLAR_PRO_YEARLY_PRODUCT_ID
```

**Optional — misc:**

```sh
bunx wrangler secret put ADMIN_EMAIL          # enables /admin for this email
bunx wrangler secret put CHROME_EXTENSION_ID  # extension CORS allow-list
```

**Non-sensitive Polar config** — these are read from `process.env` too, but
since they aren't secret you can instead add them to a `vars` block in
`wrangler.jsonc` (no rebuild of secrets needed):

```jsonc
// wrangler.jsonc
"vars": {
  "POLAR_SERVER": "production",          // or "sandbox"
  "POLAR_CREATE_CUSTOMER_ON_SIGN_UP": "false"
}
```

Or set them as secrets if you prefer keeping all server config in one place:

```sh
bunx wrangler secret put POLAR_SERVER
bunx wrangler secret put POLAR_CREATE_CUSTOMER_ON_SIGN_UP
```

> **Bulk alternative:** put all the above into a JSON file `{ "NAME": "value" }`
> and run `bunx wrangler secret bulk secrets.json` (delete the file after).

## 3. Local dev secrets — `.dev.vars`

`@cloudflare/vite-plugin` loads `.dev.vars` into the local Worker (and into
`process.env`) for `vite dev` / `vite preview`. It's git-ignored. Create it
with the **server** vars only:

```sh
# .dev.vars  (server-side, local values — NOT committed)
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=...
BETTER_AUTH_SECRET=...

# optional
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
POLAR_ACCESS_TOKEN=...
POLAR_WEBHOOK_SECRET=...
POLAR_SERVER=sandbox
POLAR_CREATE_CUSTOMER_ON_SIGN_UP=false
POLAR_PRO_MONTHLY_PRODUCT_ID=...
POLAR_PRO_YEARLY_PRODUCT_ID=...
ADMIN_EMAIL=you@example.com
CHROME_EXTENSION_ID=...
```

> For a purely local SQLite file instead of Turso, you can set
> `DATABASE_URL=file:./dev.db` — the DB layer falls back to it when
> `TURSO_DATABASE_URL` is unset.

## 4. Client (build-time) vars — `.env`

`VITE_*` vars are **inlined into the client bundle at build time** by Vite
(`import.meta.env.VITE_*`). They are not secrets and do **not** go in
`.dev.vars` or `wrangler secret`. Put them in `.env` (git-ignored):

```sh
# .env  (client-exposed, inlined at build)
VITE_APP_URL=https://minimal.so
VITE_CHROME_EXTENSION_ID=
VITE_DEFAULT_BILLING_CYCLE=yearly
VITE_POLAR_DISCOUNT_ID=
```

## 5. Deploy

```sh
bun run deploy        # = vite build && wrangler deploy
```

For a local production-runtime smoke test before deploying:

```sh
bun run build && bunx wrangler dev    # runs the built worker on real workerd
```

## 6. Post-deploy

- **Custom domain:** Cloudflare dashboard → Workers & Pages → `minimal-so` →
  Settings → Domains & Routes → add `minimal.so`. (Or add a `routes` entry to
  `wrangler.jsonc` and redeploy.)
- **Polar webhook:** point the Polar webhook at
  `https://minimal.so/api/auth/polar/webhooks` and confirm the signing secret
  matches `POLAR_WEBHOOK_SECRET`.
- **Regenerate Worker types** after changing bindings:
  `bun run cf-typegen` (writes `worker-configuration.d.ts`).

## 7. Smoke test (deployed worker)

1. Auth: signup → verification email → verify → login → logout; sessions
   persist (confirm `Set-Cookie` on the deployed worker).
2. Dashboard: SSR loads, then create/move/delete bookmarks via oRPC.
3. Public profile `/u/<username>`, OG image `/api/og?username=…`, RSS/Atom feeds.
4. Avatar: upload → resizes to webp → stored in R2 → served at `/avatars/<key>`.
5. Public API: `/api/openapi.json`, a Bearer-authed call, and a 429 from the
   rate-limit binding (now `Retry-After` only — no `X-RateLimit-*` headers).
6. Billing: Polar checkout + a test webhook to the URL above.
