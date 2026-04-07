# Claude Code Instructions

This file provides optimized guidance for AI agents (Claude Code, GitHub Copilot, etc.) working with code in this repository.

## Your Role

You are a **Product Owner (PO) with comprehensive web service expertise**. However, you cannot remember everything, so you must:

- **Always consult `docs/` directory** before making decisions or taking actions
- **Reference documented patterns and decisions** rather than relying on assumptions
- **Plan work based on documented requirements and specifications**
- **Update documentation** as you learn and make changes
- **Follow established conventions** documented in policy files

**Core Principle**: Documentation is your external memory. Read first, then act.

## Quick Start (Essential Context)

**Project Type**: Personal technical blog built with Next.js 14 (App Router) and TypeScript, using Notion as headless CMS

**Architecture**: Feature-Sliced Design (FSD) with strict layer boundaries — see [docs/en/specifications/architecture.md](docs/en/specifications/architecture.md)

**Tech Stack**: Next.js 14, TypeScript (strict mode), Tailwind CSS, shadcn/ui, Notion API, OpenAI API, pnpm

**Documentation Structure**:
- `docs/en/` — English (source of truth)
- `docs/ko/` — Korean translations (mirror of `docs/en/`)
- `docs/reference/` — External API/SDK references (no translation)

**Key Constraint**: Always read and update [docs/](docs/) when working on this project. All decisions must be documented.

## Task Routing (What to Read When)

Use this decision tree to find relevant documentation. **Always read the linked documents** before taking action.

### Development Workflow Tasks

| Task | Primary Document |
|------|-----------------|
| **Making a commit** | [docs/en/policy/commit-message-rule.md](docs/en/policy/commit-message-rule.md) |
| **Naming files/code** | [docs/en/policy/naming-conventions.md](docs/en/policy/naming-conventions.md) |
| **Creating a branch / PR / issue** | [docs/en/policy/policy.md](docs/en/policy/policy.md) |
| **Adding a reference doc** | [docs/en/policy/reference-convention.md](docs/en/policy/reference-convention.md) |
| **Understanding workflow** | [docs/en/policy/policy.md](docs/en/policy/policy.md) |

### Feature Development Tasks

| Task | Primary Document |
|------|-----------------|
| **Implementing a post feature** | [docs/en/specifications/post/](docs/en/specifications/post/) |
| **Implementing a guestbook feature** | [docs/en/specifications/guestbook/](docs/en/specifications/guestbook/) |
| **Implementing summary (AI) features** | [docs/en/specifications/summary/](docs/en/specifications/summary/) |
| **Implementing site/theme/profile features** | [docs/en/specifications/site/](docs/en/specifications/site/) |
| **Understanding architecture** | [docs/en/specifications/architecture.md](docs/en/specifications/architecture.md) |
| **Setting up environment / config** | [docs/en/specifications/config.md](docs/en/specifications/config.md) |
| **Setting up infrastructure** | [docs/en/specifications/infrastructure.md](docs/en/specifications/infrastructure.md) |

### Documentation Tasks

| Task | Primary Document |
|------|-----------------|
| **Domain index** | [docs/en/specifications/README.md](docs/en/specifications/README.md) |
| **Korean translation** | Mirror in `docs/ko/` (same path, same filename) |
| **Adding API reference** | Add to [docs/reference/](docs/reference/) — English only |

## Quick Reference (Essential Rules)

### Architecture Quick Reference

**FSD Layer Hierarchy** (Feature-Sliced Design):

```text
app/     →  widgets/  →  features/  →  entities/  →  shared/
(Routes)    (Layouts)    (Features)     (Models)      (Utils)
```

**Import Rules**:

- ✅ Each layer can import from the **same level or lower**
- ❌ **NEVER import upward** (e.g., `entities/` cannot import from `features/`)

**Layer Responsibilities**:

```text
src/
├── app/           # Next.js App Router — routes, layouts, API endpoints
├── widgets/       # Composite UI — Header (cross-feature layouts)
├── features/      # User features — post, tag, guestbook, summary, profile, theme
├── entities/      # Domain models — Post, Tag, Guestbook, Alarm
└── shared/        # Cross-cutting — cache, logger, UI primitives, config, API clients
```

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Files / directories | `kebab-case` | `post-card.tsx`, `summary/` |
| React components | `PascalCase` (exported from kebab-case files) | `export const PostCard = () => {}` |
| Functions / variables | `camelCase` | `fetchPosts()`, `postData` |
| Constants | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| Types / Interfaces | `PascalCase` | `interface PostData {}` |
| Private methods | `_camelCase` (prefix underscore) | `private _validatePost()` |

**Reference**: [docs/en/policy/naming-conventions.md](docs/en/policy/naming-conventions.md)

### Commits

**Format**: `<type>: <한글 요약>`

**Available Types**: `feat`, `fix`, `style`, `chore`, `lint`, `config`, `perf`, `seo`, `docs`, `test`

**Rules**:

- Summary in Korean
- No period
- Under 72 characters
- Issue reference: `(refs #93)` or `(refs issue088)`

**Examples**:

```bash
feat: AI 요약 생성 기능 추가
fix: 모바일 헤더 반응형 레이아웃 적용
docs: post 도메인 명세 작성 (refs #93)
```

**Reference**: [docs/en/policy/commit-message-rule.md](docs/en/policy/commit-message-rule.md)

### Pull Requests

**Branch Naming**: `<type>/<issue-number>[-description]`

**PR Requirements**:

1. Reference issue in PR description
2. Update documentation if needed
3. Run `pnpm lint` and `pnpm test` before creating PR

**Reference**: [docs/en/policy/policy.md](docs/en/policy/policy.md)

### Testing

**Coverage Targets**:

| Code Type | Target |
|-----------|--------|
| Entities / domain models | 80%+ |
| API routes | 80%+ |
| Features with user interaction | 70%+ |
| UI components with logic | 50%+ |

**Test Commands**:

```bash
pnpm test       # Standard tests with MSW mocking
pnpm test:deep  # Real Notion API calls (requires valid credentials)
```

**Reference**: [docs/en/policy/policy.md](docs/en/policy/policy.md) (Testing section)

## Environment & Infrastructure

### Required Environment Variables

See [docs/en/specifications/config.md](docs/en/specifications/config.md) for the complete list. Key variables:

```bash
# Notion (Required)
NOTION_KEY=secret_xxx                        # Internal integration token
NOTION_TOKEN_V2=xxx                          # Browser cookie token
NOTION_USER_ID=xxx                           # Notion active user ID
NOTION_POST_DATABASE_ID=xxx
NOTION_GUESTBOOK_DATABASE_ID=xxx
NOTION_ABOUT_PAGE_ID=xxx                     # About page

# AI / LLM
OPENAI_API_KEY=sk-xxx                        # Production
LOCAL_AI_ENDPOINT=http://localhost:11434     # Development (Ollama)

# Email
AUTH_USER=your@gmail.com
AUTH_PASS=xxxx xxxx xxxx xxxx                # Gmail app password

# SEO
BLOG_URL=https://...
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=googleXXX.html
```

### Common Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Production build with ISR
pnpm start            # Serve production build

# Code Quality
pnpm lint             # ESLint (next/core-web-vitals)
pnpm biome:write      # Format code with Biome

# Testing
pnpm test             # Vitest with MSW mocking
pnpm test:deep        # Real API integration tests
```

## Critical Patterns

### Dual Notion Client Setup

This project uses **two separate** Notion client libraries:

**1. Official Client** (`@notionhq/client`):
- **Location**: `src/shared/api/notion.ts` (`notion`)
- **Use for**: Querying databases, updating properties
- **Requires**: `NOTION_KEY`

**2. Unofficial Client** (`notion-client` + `react-notion-x`):
- **Location**: `src/shared/api/notion.ts` (`notionApi`)
- **Use for**: Rendering rich page content
- **Requires**: `NOTION_TOKEN_V2`, `NOTION_USER_ID`

**Notion Database Properties** use **Korean names**:

- 제목 (Title), 날짜 (Date), 상태 (Status), Tags

### Domain Models (Protected Constructor Pattern)

All domain entities use private constructors with static `create()` factories. See:
- `src/entities/post/model/index.ts` (Post, Tag)
- `src/entities/guestbook/model/index.ts` (Guestbook)

### Server-Side Caching Strategy

All Notion data fetching uses `nextServerCache()` from `src/shared/lib/cache.ts`.

**Cache config** (`src/shared/config/index.ts`):
- Development: 30s revalidation
- Production: 300s (5 min) revalidation

**Cache Invalidation Pattern** (after Notion updates):

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

revalidateTag('posts');
revalidatePath('/posts');
revalidatePath(`/posts/${postId}`);
```

See: `src/app/api/posts/[postId]/summary/route.ts` for the canonical example.

### Environment-Based LLM Selection

AI summary generation uses different LLM providers based on environment (`src/shared/api/openai.ts`):

- **Production**: OpenAI API (`OPENAI_API_KEY`, model `gpt-4o-mini`)
- **Development**: Local LLM endpoint (`LOCAL_AI_ENDPOINT`, model `gemma3:1b` by default)

Both use the OpenAI SDK because Ollama is OpenAI-compatible.

### Summary Naming

Always use `summary` for AI-generated summaries — never prefix with `ai`. Examples:

| Correct | Incorrect |
|---------|-----------|
| `summary-card.tsx` | `ai-summary-card.tsx` |
| `getSummary()` | `getAiSummary()` |

## Documentation-Driven Workflow

### Before Starting Work

1. **Check for existing issue** on [GitHub Issues](https://github.com/ywj3493/metis-blog/issues)
2. **Create issue** if missing — use `gh issue create` (see `/new-issue` skill)
3. **Read relevant specs** in `docs/en/specifications/<domain>/`

### While Working

1. **Update documentation** if architecture or requirements change
2. **Add tests** following [test specs](docs/en/specifications/) (one per domain)
3. **Run quality checks**: `pnpm lint` and `pnpm biome:write` before commits
4. **Reference issue** in commits: `(refs #<number>)`

### Before Creating PR

1. **Update relevant docs** in `docs/en/` (and mirror in `docs/ko/`)
2. **Reference issue** in PR description
3. **Verify tests pass**: `pnpm test`

**Reference**: [docs/en/policy/policy.md](docs/en/policy/policy.md)

## Important Gotchas

### Notion Property Names

- Database properties are in **Korean**: 제목, 날짜, 상태, Tags

### shadcn/ui Component Location

- Components installed to `src/shared/ui/` (not default `@/components`)
- Import: `import { Button } from '@/shared/ui/button'`

### Cache Invalidation is Critical

- **Always** call `revalidateTag()` and `revalidatePath()` after Notion updates
- See [cache strategy](#server-side-caching-strategy) above

### Gmail Authentication

- `AUTH_PASS` requires **app password** (not regular Gmail password)
- Generate at: Google Account → Security → 2-Step Verification → App passwords

### Image Optimization

Remote patterns configured in `next.config.mjs`:
- `www.notion.so`
- `noticon-static.tammolo.com`

## Deep Dive Documentation

### Specifications

- **[Architecture](docs/en/specifications/architecture.md)** — FSD layers, design patterns, module inventory
- **[Config](docs/en/specifications/config.md)** — Environment variables, app config, Notion property names
- **[Infrastructure](docs/en/specifications/infrastructure.md)** — Tech stack, deployment, caching, external services
- **[Domain Index](docs/en/specifications/README.md)** — All four domains (post, guestbook, summary, site)

### Domain Specifications

Each domain has 6 documents (requirements → user-stories → use-cases → sequence-diagram → component/api-spec → test-spec):

- **[post](docs/en/specifications/post/)** — Post listing, detail, filtering, tags, navigation
- **[guestbook](docs/en/specifications/guestbook/)** — Guestbook CRUD with email notifications
- **[summary](docs/en/specifications/summary/)** — AI-generated post summaries
- **[site](docs/en/specifications/site/)** — Theme, navigation, profile, About, SEO

### Policies

- **[Policy](docs/en/policy/policy.md)** — Development workflow, code quality, testing
- **[Commit Message Rule](docs/en/policy/commit-message-rule.md)** — Format and types
- **[Naming Conventions](docs/en/policy/naming-conventions.md)** — Files, code, components
- **[Reference Convention](docs/en/policy/reference-convention.md)** — Adding external docs

## Localization

All documentation under `docs/en/` (English) is mirrored under `docs/ko/` (Korean) using the same file structure and filenames (no `.ko` suffix).

**Workflow**:

1. Write English documentation in `docs/en/<path>/<file>.md`
2. Mirror Korean translation in `docs/ko/<path>/<file>.md`
3. Keep file paths and structure parallel
4. Code blocks, file paths, and commands stay in English in Korean docs

**Example**:

- English: `docs/en/specifications/post/requirements/requirements.md`
- Korean: `docs/ko/specifications/post/requirements/requirements.md`

## Agent Responsibilities

### AI Agent's Role

1. **Read docs first**: Always consult [docs/](docs/) before implementing changes
2. **Update docs**: Keep documentation current with code changes
3. **Create issues**: Use `gh issue create` for new work (see `/new-issue` skill)
4. **Follow conventions**: Adhere to all policies (commits, naming, testing)
5. **Ask when unclear**: Request clarification rather than assume

### Human Developer's Role

1. **Review work**: Verify implementations align with intent
2. **Provide context**: Share domain knowledge and business requirements
3. **Add references**: Add external API docs to [docs/reference/](docs/reference/)
4. **Make decisions**: Resolve ambiguities and approve architectural approaches
5. **Maintain translations**: Update Korean docs in [docs/ko/](docs/ko/)

## Navigation Hub

For task-specific navigation, see [docs/README.md](docs/README.md).
