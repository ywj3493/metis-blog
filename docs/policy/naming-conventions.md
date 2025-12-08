# Naming Conventions

## TL;DR (Quick Reference)

| What | Convention | Example |
|------|-----------|---------|
| Files/dirs | `kebab-case` | `post-card.tsx`, `ai-summary/` |
| React components | `PascalCase` | `PostCard`, `AISummaryButton` |
| Functions/variables | `camelCase` | `fetchPosts`, `postData` |
| Constants | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| Types/Interfaces | `PascalCase` | `PostData`, `TagName` |
| Private methods | `_camelCase` | `_validatePost` |
| Boolean variables | `is/has/should + Noun` | `isLoading`, `hasError` |
| Event handlers | `handle + Event` | `handleClick`, `handleSubmit` |

**Golden Rule**: Descriptive names > short names. Code is read more than written.

---

## When to Use This Document

Use this document when you need to:

- **Naming a file or directory right now?** → See [TL;DR](#tldr-quick-reference) table above
- **Naming React components?** → See [React Components](#react-components-pascalcase)
- **Naming functions/variables?** → See [Functions and Variables](#functions-and-variables-camelcase)
- **Naming constants?** → See [Constants](#constants-upper_snake_case)
- **Working with environment variables?** → See [Environment Variable Naming](#environment-variable-naming)
- **Creating test files?** → See [Test File Naming](#test-file-naming)
- **Unsure about acronym handling?** → See [Acronym Handling](#acronym-handling)

**Related Documents**:

- Creating branches? → [branching-strategy.md](./branching-strategy.md) - Branch naming follows same types
- Making commits? → [commit-convention.md](./commit-convention.md) - Commit types used in branches

---

## Overview

Consistent naming makes code readable, searchable, and maintainable. This document defines naming rules for files, directories, code identifiers, and other project artifacts.

## File and Directory Naming

### Files: kebab-case

**Rule**: All files use lowercase with hyphens (kebab-case)

**Examples**:
```text
✅ post-card.tsx
✅ ai-summary-button.tsx
✅ guestbook-form.tsx
✅ use-theme-toggle.ts
✅ cache-config.ts

❌ PostCard.tsx
❌ AI_Summary_Button.tsx
❌ guestbookForm.tsx
❌ useThemeToggle.ts
```

**Rationale**:
- Consistent across platforms (case-sensitive vs case-insensitive filesystems)
- Easier to type and remember
- Matches URL patterns

### Directories: kebab-case

**Rule**: All directories use lowercase with hyphens

**Examples**:
```text
✅ src/features/ai-summary/
✅ src/entities/posts/
✅ src/shared/lib/
✅ docs/specifications/

❌ src/features/AISummary/
❌ src/entities/Posts/
❌ src/shared/Lib/
```

### Special Files

#### Configuration Files

Follow community conventions:

```text
✅ next.config.mjs
✅ tailwind.config.ts
✅ tsconfig.json
✅ .eslintrc.json
✅ biome.json
✅ package.json
```

#### Documentation Files

Use UPPERCASE for root-level docs:

```text
✅ README.md
✅ AGENTS.md
✅ LICENSE
✅ CHANGELOG.md
```

Use lowercase for nested docs:

```text
✅ docs/specifications/architecture.md
✅ docs/policy/commit-convention.md
✅ docs/issue/issue087.md
```

#### Korean Documentation

Add `.ko` suffix before `.md`:

```text
✅ architecture.ko.md
✅ commit-convention.ko.md
✅ requirements.ko.md
```

## Code Identifier Naming

### React Components: PascalCase

**Rule**: Component names use PascalCase (UpperCamelCase)

**Examples**:
```typescript
✅ export function PostCard() { }
✅ export function AIAssistantButton() { }
✅ export const ThemeProvider = () => { }

❌ export function postCard() { }
❌ export function ai_assistant_button() { }
❌ export const theme_provider = () => { }
```

**File vs Export**:
```typescript
// File: ai-summary-button.tsx
export function AISummaryButton() {
  // Component implementation
}
```

### Functions and Variables: camelCase

**Rule**: Functions, variables, parameters use camelCase (lowerCamelCase)

**Examples**:
```typescript
✅ function fetchPosts() { }
✅ const isPublished = true;
✅ const postId = '123';
✅ const handleSubmit = () => { };

❌ function FetchPosts() { }
❌ const IsPublished = true;
❌ const post_id = '123';
❌ const handle_submit = () => { };
```

### Constants: UPPER_SNAKE_CASE

**Rule**: Module-level constants use UPPER_SNAKE_CASE

**Examples**:
```typescript
✅ const ISR_REVALIDATE_TIME = 300;
✅ const MEMORY_CACHE_TTL = 300000;
✅ const DEFAULT_POST_LIMIT = 20;

❌ const isrRevalidateTime = 300;
❌ const memoryCacheTTL = 300000;
❌ const default-post-limit = 20;
```

**Exception**: Const objects use camelCase for property access:

```typescript
✅ const CACHE_CONFIG = {
  revalidateTime: 300,
  cacheTTL: 300000,
};

// Access with camelCase
const time = CACHE_CONFIG.revalidateTime;
```

### Classes: PascalCase

**Rule**: Class names use PascalCase

**Examples**:
```typescript
✅ class Post { }
✅ class NotionAPILogger { }
✅ class Tag { }

❌ class post { }
❌ class notionAPILogger { }
❌ class tag { }
```

### Interfaces and Types: PascalCase

**Rule**: TypeScript interfaces and types use PascalCase

**Examples**:
```typescript
✅ interface IPost { }
✅ type PostStatus = 'draft' | 'published';
✅ interface NotionDatabaseResponse { }

❌ interface iPost { }
❌ type post_status = 'draft' | 'published';
❌ interface notion_database_response { }
```

**Note**: Prefix interfaces with `I` to distinguish from classes:
```typescript
✅ interface IPost { }     // Interface
✅ class Post { }          // Class

// This makes it clear which is which
const post: IPost = new Post();
```

### Enums: PascalCase

**Rule**: Enum names use PascalCase, values use UPPER_SNAKE_CASE

**Examples**:
```typescript
✅ enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

❌ enum postStatus {
  draft = 'draft',
  published = 'published',
}
```

**Preference**: Use const objects or literal types instead of enums when possible:

```typescript
✅ const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

✅ type PostStatus = 'draft' | 'published';
```

### Private Members: _prefixed

**Rule**: Private class members prefixed with underscore (optional)

**Examples**:
```typescript
class Post {
  ✅ private _id: string;
  ✅ private _calculateSlug(): string { }

  // Also acceptable (TypeScript private keyword is sufficient)
  ✅ private id: string;
  ✅ private calculateSlug(): string { }
}
```

**Preference**: Use TypeScript `private` keyword, underscore optional for clarity

## Hook Naming

### Custom Hooks: use* prefix

**Rule**: Custom React hooks start with `use` + camelCase

**Examples**:
```typescript
✅ function useTheme() { }
✅ function usePostFilter() { }
✅ function useNotionData() { }

❌ function theme() { }
❌ function getPostFilter() { }
❌ function fetchNotionData() { }
```

**File naming**: Matches hook name in kebab-case
```text
File: use-theme.ts
Export: export function useTheme() { }
```

## API Route Naming

### Next.js App Router Routes

**Rule**: Route folders use kebab-case, files use Next.js conventions

**Structure**:
```text
app/
├── posts/
│   ├── page.tsx              ✅ Next.js page
│   ├── [slug]/
│   │   └── page.tsx          ✅ Dynamic route
│   └── route.ts              ✅ API route
├── api/
│   ├── posts/
│   │   ├── route.ts          ✅ /api/posts endpoint
│   │   └── [postId]/
│   │       └── summary/
│   │           └── route.ts  ✅ /api/posts/:postId/summary
```

**Files**:
- `page.tsx`: Page component
- `layout.tsx`: Layout component
- `route.ts`: API route handler
- `loading.tsx`: Loading UI
- `error.tsx`: Error UI

## Test File Naming

### Test Files

**Rule**: Test files match source file name with `.test` or `.spec` suffix

**Examples**:
```text
Source: post-card.tsx
Test:   post-card.test.tsx  ✅

Source: use-theme.ts
Test:   use-theme.spec.ts   ✅

❌ post-card.tests.tsx
❌ PostCard.test.tsx
❌ test-post-card.tsx
```

**Preference**: Use `.test` for consistency (already used in project)

## Environment Variable Naming

### Naming Pattern

**Rule**: UPPER_SNAKE_CASE with descriptive prefixes

**Examples**:
```bash
✅ NOTION_KEY=xxx
✅ NOTION_POST_DATABASE_ID=xxx
✅ OPENAI_API_KEY=xxx
✅ LOCAL_AI_ENDPOINT=xxx
✅ AUTH_USER=xxx
✅ BLOG_URL=xxx

❌ notionKey=xxx
❌ notion-key=xxx
❌ apiKey=xxx          # Too generic
❌ key=xxx             # Too vague
```

**Prefixes**:
- `NOTION_*`: Notion-related variables
- `OPENAI_*`: OpenAI-related variables
- `AUTH_*`: Authentication credentials
- `VERCEL_*`: Vercel-specific variables
- `GOOGLE_*`: Google services

### Next.js Public Variables

**Rule**: Prefix with `NEXT_PUBLIC_` for client-side access

**Examples**:
```bash
✅ NEXT_PUBLIC_BLOG_URL=https://example.com
✅ NEXT_PUBLIC_ANALYTICS_ID=xxx

❌ BLOG_URL=xxx                 # Not accessible in client
❌ NEXT_PUBLIC_API_KEY=xxx      # Never expose secrets!
```

**Warning**: Never use `NEXT_PUBLIC_` for secrets (API keys, tokens, passwords)

## Import Alias Naming

### Path Aliases

**Rule**: Use `@` for `src/` directory

**Examples**:
```typescript
✅ import { Post } from '@/entities/posts';
✅ import { Button } from '@/shared/ui/button';
✅ import { cn } from '@/shared/lib/utils';

❌ import { Post } from '../../entities/posts';
❌ import { Button } from '../../../shared/ui/button';
```

**Configuration** (in `tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Branch and Tag Naming

### Git Branches

**Rule**: `<type>/<issue-number>[-description]`

**Examples**:
```text
✅ feat/087-add-search
✅ fix/088-mobile-header
✅ chore/089-update-deps

❌ feature/add-search
❌ fix-mobile
❌ my-branch
```

See [branching-strategy.md](./branching-strategy.md) for details.

### Git Tags

**Rule**: Semantic versioning with `v` prefix

**Examples**:
```text
✅ v1.0.0
✅ v1.2.3
✅ v2.0.0-beta.1

❌ 1.0.0          # Missing v prefix
❌ version-1.0    # Wrong format
❌ release-1      # Not semantic
```

## Issue and Document Naming

### Issue Documents

**Rule**: `issue0XX.md` with zero-padded sequential numbering

**Examples**:
```text
✅ issue085.md
✅ issue086.md
✅ issue100.md

❌ issue85.md      # Missing leading zero
❌ issue-087.md    # Hyphen not needed
❌ issue_088.md    # Underscore not used
```

### Documentation Files

**Rule**: Descriptive kebab-case names

**Examples**:
```text
✅ architecture.md
✅ commit-convention.md
✅ naming-conventions.md
✅ infrastructure.md

❌ Architecture.md
❌ commit_convention.md
❌ namingConventions.md
```

## Co-location and Organization

### Feature-Based Organization

**Rule**: Group related files by feature, not by type

**Good (co-located)**:
```text
features/posts/
├── ai-summary/
│   ├── ai-summary-button.tsx
│   ├── ai-summary-display.tsx
│   └── use-ai-summary.ts
├── filter/
│   ├── post-filter.tsx
│   └── use-post-filter.ts
└── ui/
    ├── post-card.tsx
    └── post-list.tsx
```

**Bad (type-based)**:
```text
components/
├── AIAssistantButton.tsx
├── PostFilter.tsx
├── PostCard.tsx
└── PostList.tsx
hooks/
├── useAIAssistant.ts
└── usePostFilter.ts
```

### Index Files

**Rule**: Use `index.ts` for aggregating exports

**Example**:
```typescript
// features/posts/index.ts
export { PostCard } from './ui/post-card';
export { PostList } from './ui/post-list';
export { usePostFilter } from './filter/use-post-filter';
```

**Import**:
```typescript
✅ import { PostCard, PostList } from '@/features/posts';

❌ import { PostCard } from '@/features/posts/ui/post-card';
❌ import { PostList } from '@/features/posts/ui/post-list';
```

## Acronym Handling

### In Code

**Rule**: Treat acronyms as words (max 2 capitals)

**Examples**:
```typescript
✅ function parseHtml() { }
✅ const apiEndpoint = '...';
✅ class HttpClient { }
✅ interface ApiResponse { }

❌ function parseHTML() { }
❌ const APIEndpoint = '...';
❌ class HTTPClient { }
❌ interface APIResponse { }
```

**Exception**: Keep acronyms capitalized in constants

```typescript
✅ const DEFAULT_API_URL = '...';
✅ const HTML_PARSER_CONFIG = { };
```

### In File Names

**Rule**: Lowercase acronyms in file names

**Examples**:
```text
✅ api-client.ts
✅ html-parser.ts
✅ seo-metadata.ts
✅ ai-summary-button.tsx

❌ API-client.ts
❌ HTML-parser.ts
❌ SEO-metadata.ts
❌ AI-summary-button.tsx
```

## Boolean Naming

### Predicates

**Rule**: Use `is`, `has`, `should`, `can` prefixes

**Examples**:
```typescript
✅ const isPublished = true;
✅ const hasError = false;
✅ const shouldRedirect = true;
✅ const canEdit = false;

❌ const published = true;
❌ const error = false;
❌ const redirect = true;
❌ const edit = false;
```

### Functions Returning Booleans

**Rule**: Start with `is`, `has`, `should`, `can`

**Examples**:
```typescript
✅ function isValidPost(post: Post): boolean { }
✅ function hasPublishedStatus(post: Post): boolean { }
✅ function shouldShowSummary(): boolean { }

❌ function validatePost(post: Post): boolean { }
❌ function checkStatus(post: Post): boolean { }
```

## Anti-Patterns

### Don't Use

```typescript
❌ Abbreviations (except common ones like `id`, `url`, `api`)
   // Bad
   const usr = getUser();
   const cfg = getConfig();

   // Good
   const user = getUser();
   const config = getConfig();

❌ Single-letter variables (except loop indices)
   // Bad
   const p = getPosts();
   const r = await fetch(url);

   // Good
   const posts = getPosts();
   const response = await fetch(url);

   // Exception: loop indices
   for (let i = 0; i < posts.length; i++) { }

❌ Hungarian notation
   // Bad
   const strName = 'John';
   const intAge = 30;

   // Good (TypeScript provides types)
   const name = 'John';
   const age = 30;

❌ Redundant naming
   // Bad
   class PostClass { }
   interface IPostInterface { }
   const postObject = { };

   // Good
   class Post { }
   interface IPost { }
   const post = { };
```

## Summary

**Quick Reference**:

| Item | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `post-card.tsx` |
| Directories | kebab-case | `ai-summary/` |
| Components | PascalCase | `PostCard` |
| Functions | camelCase | `fetchPosts()` |
| Variables | camelCase | `postId` |
| Constants | UPPER_SNAKE_CASE | `ISR_REVALIDATE_TIME` |
| Classes | PascalCase | `Post` |
| Interfaces | PascalCase (I prefix) | `IPost` |
| Types | PascalCase | `PostStatus` |
| Hooks | use + camelCase | `useTheme()` |
| Env Vars | UPPER_SNAKE_CASE | `NOTION_KEY` |
| Branches | type/number-desc | `feat/087-search` |
| Issues | issue0XX.md | `issue087.md` |

Consistent naming reduces cognitive load and makes code easier to navigate and maintain.
