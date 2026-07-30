---
paths:
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "vitest.config.*"
  - "playwright.config.*"
  - "src/mocks/**"
  - "e2e/**"
---

# Testing Rules

Source: docs/en/policy/policy.md (Testing section), docs/en/specifications/*/test-spec

## Coverage Gate

The suite enforces **100%** statements/branches/functions/lines via `coverage.thresholds` in `vitest.config.ts`. `pnpm test:coverage` fails below 100%. The tiered numbers below are historical minimums, kept for context.

| Code type | Historical minimum |
|-----------|--------------------|
| Entities / domain models | 80%+ |
| API routes | 80%+ |
| Features with user interaction | 70%+ |
| UI components with logic | 50%+ |

**Excluded from coverage** (`vitest.config.ts`): `*.d.ts`, test files, `src/mocks/**`, and `src/shared/api/notion-mock.ts`. For a genuinely unreachable defensive branch, add a `/* v8 ignore next */` comment with a one-line justification rather than lowering the gate. Prefer reaching the branch first (e.g. non-object inputs with string props via `Object.defineProperties`).

## Commands

- `pnpm test --run` — Vitest with MSW mocking (plain `pnpm test` = watch mode).
- `pnpm test:coverage` — single run + coverage report; fails below the 100% gate.
- `pnpm test:e2e` — Playwright E2E. Its `webServer` starts `pnpm dev` with `CI_MOCK=true`, so the Notion data layer serves `src/shared/api/notion-mock.ts` fixtures and no real credentials are needed. Specs live in `e2e/`. Chromium must be installed once via `npx playwright install chromium`.
- `pnpm test:deep` — hits the real Notion API; requires credentials and costs quota. Never run it casually — ask the user first.

## Test-environment gotchas (already wired in `vitest.config.ts` / `vitest.setup.ts`)

- All `.css` imports are stubbed to empty (a `stubCssPlugin`) — Tailwind directives and optional-peer CSS (prismjs/katex) never break imports.
- `next/font/local` is aliased to `src/mocks/stubs/next-font-local.ts` so `app/layout.tsx` imports cleanly.
- MSW `server` (`src/mocks/server.ts`) is started in setup (`listen`/`resetHandlers`/`close`).
- For code that branches on `process.env` at import time (config, openai, notion, robots, layout), cover both branches with `vi.resetModules()` + `vi.stubEnv(...)` + dynamic `await import(...)`.
- Mock external boundaries with `vi.mock`: `@notionhq/client`, `notion-client`, `nodemailer`, `openai`, `next/cache`, `react-notion-x`.

## Conventions

- Test files: `<name>.spec.ts` / `<name>.spec.tsx`, colocated with the code under test; E2E specs in `e2e/<name>.spec.ts` (Vitest owns `src/**`, Playwright owns `e2e/**` — Vitest excludes `**/e2e/**`).
- Mock external APIs (Notion, OpenAI, email) — unit/integration tests must pass offline.
- Each domain has a test-spec in `docs/en/specifications/<domain>/`; keep test IDs traceable to it.
