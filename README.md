# GO MO Group — Senior Full Stack Developer Assignment

CMS-driven, pixel-perfect rebuild of the provided Figma homepage. Every piece of user-facing
content (headings, CTAs, images, footer, SEO metadata) is managed through a headless CMS with a
dynamic, reorderable page-builder — not hardcoded in the frontend.

## Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS + TypeScript, deployed on Vercel
- **CMS:** Strapi (Dynamic Zones as the page-builder mechanism), deployed on Railway
- **Monorepo:** npm workspaces

## Project Structure

```
apps/
  web/   Next.js frontend
  cms/   Strapi backend
```

## Status

Implementation is being delivered in milestones; current progress:

- [x] **Milestone 1** — Project scaffold (Next.js, Tailwind, TypeScript, ESLint, Prettier, folder
      structure, env template)
- [x] **Milestone 2** — Strapi CMS setup (content-types, dynamic zones, admin user)
- [ ] Milestone 3 — Design system primitives & layout shell (header, footer, mobile nav)
- [ ] Milestone 4 — Homepage sections & dynamic PageBuilder
- [ ] Milestone 5 — CMS data fetching, SEO metadata, loading/error states
- [ ] Milestone 6 — Newsletter API route + external weather API integration
- [ ] Milestone 7 — On-demand ISR revalidation, responsive QA, accessibility pass
- [ ] Milestone 8 — Deployment (Vercel + Railway) & README finalization

## Getting Started

```bash
npm install

# Frontend
cp apps/web/.env.example apps/web/.env.local
npm run dev              # http://localhost:3000

# CMS (separate terminal)
cp apps/cms/.env.example apps/cms/.env   # fill in secrets — see apps/cms/README.md
npm run cms:dev          # http://localhost:1337/admin
```

See [apps/cms/README.md](apps/cms/README.md) for the content model, environment variables, and how
to create the read-only API token `apps/web` needs to fetch content.

## Scripts (root)

| Script                 | Description                         |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | Start the Next.js dev server        |
| `npm run build`        | Production build of the Next.js app |
| `npm run lint`         | Lint the Next.js app                |
| `npm run format`       | Format the repo with Prettier       |
| `npm run format:check` | Check formatting without writing    |
| `npm run cms:dev`      | Start the Strapi CMS in watch mode  |
| `npm run cms:build`    | Build the Strapi admin panel        |

## Notes

- This project was scaffolded with Next.js 16 / React 19, which introduced breaking changes
  relative to earlier versions — implementation follows the framework's current App Router
  conventions rather than older patterns.
- `npm audit` currently reports high-severity advisories that are transitive, build-time-only
  dependencies bundled inside `next`/`eslint-config-next` itself (not runtime/application code).
  `npm audit fix --force` would downgrade Next.js to an unrelated major version and is not a valid
  fix here; tracked for re-check against upstream releases before final submission.
- The root `package.json` has an `overrides` entry pinning `ajv-draft-04`'s `ajv` peer to `^8.17.1`.
  This resolves a real monorepo dependency-hoisting conflict between `apps/web` (eslint needs
  `ajv@6`) and Strapi's CLI tooling (needs `ajv@8`) — see
  [apps/cms/README.md](apps/cms/README.md#notes-on-non-obvious-fixes) for the full explanation.
