# Repository Guidelines

## Project Structure & Module Organization
- `server/`: Hono API (TypeScript), Lucia auth, Drizzle ORM schemas under `server/db/schema/`.
- `frontend/`: Vite + React + Tailwind UI. App code in `frontend/src/`.
- `shared/`: Types and Zod schemas reused by server and frontend.
- `drizzle/`: SQL migrations (managed by drizzle‑kit).
- Root config: `tsconfig.json` (path aliases `@/*` → `server/*`, `@/shared/*` → `shared/*`), Prettier/ESLint configs.

## Build, Test, and Development Commands
- Install deps: `bun install` (run at repo root and in `frontend/` if needed).
- Run API: `bun run dev` (hot‑reloads `server/index.ts`).
- Run frontend: `cd frontend && bun run dev` (Vite on port 3001).
- Lint: `bun run lint:server` and `bun run lint:frontend`.
- Format: `bun run format:check` or `bun run format:write`.
- Build frontend: `cd frontend && bun run build`.
- Database (Docker): `docker compose up -d` using `compose.yml`.
- Migrations: `bunx drizzle-kit push` to apply, `bunx drizzle-kit generate` after schema changes.

## Coding Style & Naming Conventions
- TypeScript, strict mode. 2‑space indent, Prettier enforced with sorted imports.
- File names: kebab‑case (`site-header.tsx`, `posts.ts`).
- Components/types: PascalCase. Variables/functions: camelCase.
- DB columns/tables: snake_case defined via Drizzle models.
- Use path aliases (`@/lib/...`, `@/shared/...`) instead of relative chains.

## Testing Guidelines
- No formal test suite yet. If adding tests:
  - Frontend: Vitest + React Testing Library; name `*.test.ts(x)` near sources.
  - Server: Bun test or Hono request tests; name `*.test.ts` in `server/`.
  - Keep units pure; mock network and DB.

## Commit & Pull Request Guidelines
- Commits: imperative, scoped steps (e.g., `Step 7: comment route`). Keep them small and descriptive.
- PRs: include purpose, linked issue, migration notes, and screenshots for UI changes.
- CI hygiene: run `lint` and `format:check`; ensure app starts (`bun run dev`, `frontend dev`).

## Security & Configuration
- Env: set `DATABASE_URL` in `.env`. Example: `postgres://user:password@localhost:5432/hackernewclonedb` (see `compose.yml`).
- Cookies: Lucia uses secure cookies in production; test with `http://localhost` only.
- Never commit secrets; `.env` is git‑ignored.
