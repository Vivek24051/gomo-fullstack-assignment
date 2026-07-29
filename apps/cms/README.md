# apps/cms — Strapi CMS

Headless CMS for the GO MO Group homepage rebuild. Every homepage section, the header, the footer,
and all SEO metadata are modeled here as CMS content — the Next.js frontend (`apps/web`) never
hardcodes copy, images, or ordering.

## Content model

- **`page`** (collection type) — `slug`, `title`, `seo` (shared component), and `sections`: a
  **Dynamic Zone** listing an ordered mix of the section components below. Reordering or removing
  a block in the admin changes the API response order/contents immediately — no frontend code
  change needed. The homepage is the `page` entry with `slug: "home"`; any future page reuses the
  same content-type and the same Dynamic Zone.
- **Section components** (`src/components/sections/`): `hero`, `intro-stats`,
  `industry-showcase`, `why-choose-us`, `case-studies-carousel`, `insights-grid`, `cta-banner` —
  one per homepage section in the design. `intro-stats`, `industry-showcase`,
  `case-studies-carousel`, and `insights-grid` reference the collections below via relations
  (not duplicated data), so a brand/industry/case-study/insight is managed once and reused.
- **Collections**: `industry`, `case-study`, `insight`, `brand`, `newsletter-signup` (the last one
  is the target of the frontend's custom newsletter API route, not editorial content).
- **Site-wide singles**: `header`, `footer`, `global` (default SEO fallback + title template).
- **Shared component**: `shared.seo` (metaTitle, metaDescription, ogImage), reused on both `page`
  and `global`.

## Local setup

```bash
# from the repo root
npm install
cp apps/cms/.env.example apps/cms/.env   # then fill in APP_KEYS/secrets — see below
npm run cms:dev
```

Admin panel: http://localhost:1337/admin · REST API base: http://localhost:1337/api

**Generating secrets**: the six `APP_KEYS`/`*_SECRET`/`*_SALT` values in `.env.example` are
placeholders (`tobemodified`). Strapi's scaffolder normally generates real random values into
`.env` directly — if setting this up from `.env.example` fresh, generate your own (e.g.
`node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"` run four times for
`APP_KEYS`, once each for the rest).

## Environment variables

| Variable                               | Purpose                                                                                  | Default                 |
| -------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------- |
| `DATABASE_CLIENT`                      | `sqlite` (dev) or `postgres` (prod)                                                      | `sqlite`                |
| `DATABASE_URL`                         | Postgres connection string (Railway provides this directly)                              | —                       |
| `DATABASE_FILENAME`                    | sqlite file path, relative to `apps/cms`                                                 | `.tmp/data.db`          |
| `CLOUDINARY_NAME` / `_KEY` / `_SECRET` | If all three are set, media uploads switch to Cloudinary. Leave blank to use local disk. | blank (local disk)      |
| `CORS_ORIGIN`                          | Comma-separated list of origins allowed to call the API                                  | `http://localhost:3000` |

Local disk uploads are fine for development, but **must** switch to Cloudinary before deploying —
Railway's filesystem is ephemeral and local uploads won't survive a redeploy.

## CMS admin access

Strapi has no seeded admin account — the **first person to visit `/admin` registers the first
admin user** directly in the browser (name, email, password). There's nothing to configure and no
credentials are stored anywhere in this repo.

1. Start the CMS (`npm run cms:dev`) and open `http://localhost:1337/admin`.
2. If no admin exists yet, Strapi shows a registration form instead of a login form — fill it in
   to create the first admin account.
3. On any later run, the same URL shows a normal login form for that account.

Note on the assignment's literal `gomoadmin` / `gomoadmin` credential pair: Strapi's admin
identity is email-based (not a free-text username) and enforces a password policy (8+ characters,
upper + lower case, a number), so that exact pair can't be used as-is — use any email/password
that satisfies the policy when registering.

## API access for the frontend

The `Public` role is left closed (Strapi's secure default) rather than opening `find`/`findOne` on
every content-type. Instead, `apps/web` authenticates with a scoped **read-only API token**:

1. In the admin, go to **Settings → API Tokens → Create new API Token**.
2. Name it (e.g. `web-frontend-readonly`), set **Token type: Read-only**, no expiration (or your
   preference).
3. Copy the generated token into `apps/web/.env.local` as `STRAPI_API_TOKEN`.

## Notes on non-obvious fixes

A few things here aren't what Strapi's own scaffolder generates by default — worth knowing if you
touch `config/database.ts`:

- **sqlite path resolution**: Strapi's generated default resolves the sqlite file relative to
  `__dirname` with `../..`, which assumes `config/` sits directly under the project root. That
  breaks inside this monorepo (`apps/cms` is nested one level deeper), so it's resolved from
  `process.cwd()` instead.
- **Missing `.tmp` directory**: `better-sqlite3` throws an opaque "unable to open database file" if
  its parent directory doesn't already exist — it won't create it. `database.ts` now creates it
  with `fs.mkdirSync(..., { recursive: true })` before opening, so a fresh clone boots with no
  manual step.
- **`ajv-draft-04` hoisting conflict**: Strapi's own CLI tooling transitively depends on
  `ajv-draft-04`, which declares `ajv` only as a peer dependency. In this workspace, npm hoisted a
  single root `ajv@6` (pinned there by `eslint`, for `apps/web`), which doesn't satisfy that peer
  and crashes the boot with `Cannot find module 'ajv/dist/core'`. Fixed via an `overrides` entry in
  the root `package.json` — `apps/web`'s own eslint/ajv resolution is unaffected (npm nests its own
  `ajv@6` copy under `eslint` once the root version moves to v8).

## Commands

| Command                                                 | Description                          |
| ------------------------------------------------------- | ------------------------------------ |
| `npm run cms:dev` (repo root)                           | Start Strapi in watch mode           |
| `npm run cms:build` (repo root)                         | Build the admin panel for production |
| `npm run develop` / `npm run build` (inside `apps/cms`) | Same, run directly in this workspace |
