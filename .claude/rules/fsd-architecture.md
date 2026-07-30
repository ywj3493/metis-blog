---
paths:
  - "src/**"
---

# FSD Architecture & Code Naming Rules

Source: docs/en/specifications/architecture.md, docs/en/policy/naming-conventions.md

## Import Direction (strict)

Layers may only import from the same level or lower:

```text
app/ → widgets/ → features/ → entities/ → shared/
```

- NEVER import upward (e.g., `entities/` must not import from `features/`).
- Cross-imports between slices on the same layer are also discouraged — go through a lower layer instead.

## Feature Internal Structure

```text
src/features/<name>/
├── ui/          # UI components
├── api/         # API calls and business logic
├── hooks/       # Custom React hooks
└── index.ts     # Public exports (import features only via this barrel)
```

## Naming

| Target | Convention | Example |
|--------|-----------|---------|
| Files / directories | `kebab-case` | `post-card.tsx` |
| React components | `PascalCase` export from kebab-case file | `export const PostCard` |
| Functions / variables | `camelCase` | `fetchPosts()` |
| Constants | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| Types / interfaces | `PascalCase` (domain interfaces use `I` prefix: `IPost`) | `type TagName = string` |
| Private methods | `_camelCase` | `private _validatePost()` |
| Test files | `<name>.spec.ts(x)` | `post.spec.ts` |

- Domain models (Post, Tag, Guestbook) use private constructors with static `create()` factories.
- shadcn/ui components live in `src/shared/ui/` — import as `@/shared/ui/<component>`.
- Anything about AI summaries is named `summary`, never `ai`-prefixed (`summary-card.tsx`, `getSummary()`, `SummaryButton`).

## TypeScript

- Strict mode; no `any` — prefer `unknown` with type narrowing.
- Use type guards for domain model validation.
