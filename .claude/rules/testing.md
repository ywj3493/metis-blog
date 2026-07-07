---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "vitest.config.*"
  - "src/mocks/**"
---

# Testing Rules

Source: docs/en/policy/policy.md (Testing section), docs/en/specifications/*/test-spec

## Coverage Targets

| Code type | Target |
|-----------|--------|
| Entities / domain models | 80%+ |
| API routes | 80%+ |
| Features with user interaction | 70%+ |
| UI components with logic | 50%+ |

Do NOT test: simple presentational components, type definitions, config files, third-party wrappers without custom logic.

## Commands

- `pnpm test --run` — Vitest with MSW mocking (default; plain `pnpm test` starts watch mode).
- `pnpm test:deep` — hits the real Notion API; requires credentials and costs quota. Never run it casually — ask the user first.

## Conventions

- Test files: `<name>.test.ts` / `<name>.test.tsx`, colocated with the code under test.
- Mock external APIs (Notion, OpenAI, email) with MSW — tests must pass offline.
- Each domain has a test-spec in `docs/en/specifications/<domain>/`; keep test IDs traceable to it.
