<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# Naming Conventions

## TL;DR

| Target | Convention | Example |
|--------|-----------|---------|
| Files / directories | `kebab-case` | `post-card.tsx`, `ai-summary/` |
| React components | `PascalCase` (export) | `export const PostCard = () => {}` |
| Functions / variables | `camelCase` | `fetchPosts()`, `postData` |
| Constants | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| Types / Interfaces | `PascalCase` | `interface PostData {}`, `type TagName = string` |
| Private methods | `_camelCase` | `private _validatePost()` |
| Branches | `<type>/<issue>[-desc]` | `feat/93-docs-refactor` |

## File & Directory Naming

- **All files**: `kebab-case` — lowercase with hyphens
- **React component files**: `kebab-case.tsx` (component export is `PascalCase`)
- **Test files**: `<name>.test.ts` or `<name>.test.tsx`
- **Type definition files**: `type.d.ts`
- **Index files**: `index.ts` for barrel exports

### Examples

```
src/features/post/ui/post-card.tsx        → export const PostCard
src/entities/post/model/type.d.ts         → interface IPost
src/shared/lib/cache.ts                   → export const nextServerCache
src/shared/config/index.ts                → export const CACHE_CONFIG
```

## Code Naming

### React Components

```typescript
// File: src/features/post/ui/featured-post.tsx
export const FeaturedPost = () => { ... }
```

### Functions & Variables

```typescript
const fetchPosts = async () => { ... }
const postData = await fetchPosts();
```

### Constants

```typescript
export const CACHE_CONFIG = { ... };
export const SUMMARY_MODEL_CONFIG = { ... };
```

### Types & Interfaces

```typescript
interface IPost { ... }
interface IGuestbook { ... }
type PostDatabaseResponse = ...;
type TagName = string;
```

### Domain Models (Class Names)

```typescript
export class Post { ... }
export class Tag { ... }
export class Guestbook { ... }
```

## FSD Layer Naming

| Layer | Directory Pattern | Example |
|-------|------------------|---------|
| Features | `src/features/<feature-name>/` | `src/features/post/` |
| Entities | `src/entities/<entity-name>/` | `src/entities/post/` |
| Shared | `src/shared/<category>/` | `src/shared/ui/`, `src/shared/lib/` |

### Feature Internal Structure

```
src/features/<name>/
├── ui/          # UI components
├── api/         # API calls and business logic
├── hooks/       # Custom React hooks
└── index.ts     # Public exports
```

## Summary Naming

When naming anything related to AI-generated summaries, always use `summary` — never prefix with `ai`.

| Correct | Incorrect |
|---------|-----------|
| `summary-card.tsx` | `ai-summary-card.tsx` |
| `getSummary()` | `getAiSummary()` |
| `SummaryButton` | `AiSummaryButton` |
