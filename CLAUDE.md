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

**Architecture**: Feature-Sliced Design (FSD) with strict layer boundaries - see [docs/specifications/architecture.md](docs/specifications/architecture.md)

**Tech Stack**: Next.js 14, TypeScript (strict mode), Tailwind CSS, shadcn/ui, Notion API, OpenAI API, pnpm workspaces

**Key Constraint**: Always read and update [docs/](docs/) when working on this project. All decisions must be documented.

## Task Routing (What to Read When)

Use this decision tree to find relevant documentation. **Always read the linked documents** before taking action.

### Development Workflow Tasks

| Task | Primary Document | Supporting Documents |
|------|-----------------|---------------------|
| **Making a commit** | [docs/policy/commit-convention.md](docs/policy/commit-convention.md) | Check TL;DR section for quick reference |
| **Creating a branch** | [docs/policy/branching-strategy.md](docs/policy/branching-strategy.md) | Must create issue document first |
| **Creating a PR** | [docs/policy/branching-strategy.md](docs/policy/branching-strategy.md) | Link to issue document in PR description |
| **Naming files/code** | [docs/policy/naming-conventions.md](docs/policy/naming-conventions.md) | See TL;DR table for quick lookup |
| **Writing tests** | [docs/policy/testing-policy.md](docs/policy/testing-policy.md) | Focus on sections 1-3 for essentials |
| **Understanding workflow** | [docs/policy/policy.md](docs/policy/policy.md) | Meta-policy for all development practices |

### Feature Development Tasks

| Task | Primary Document | Supporting Documents |
|------|-----------------|---------------------|
| **Implementing new feature** | [docs/specifications/requirements.md](docs/specifications/requirements.md) | Check [docs/specifications/architecture.md](docs/specifications/architecture.md) for patterns |
| **Understanding architecture** | [docs/specifications/architecture.md](docs/specifications/architecture.md) | FSD layers, module boundaries, design patterns |
| **Setting up infrastructure** | [docs/specifications/infrastructure.md](docs/specifications/infrastructure.md) | Environment vars, caching, deployment |
| **Planning work** | Create [docs/issue/issueXXX.md](docs/issue/) first | Use [docs/issue/issue085.md](docs/issue/issue085.md) as template |

### Bug Fixing & Maintenance

| Task | Primary Document | Supporting Documents |
|------|-----------------|---------------------|
| **Fixing a bug** | Check [docs/issue/](docs/issue/) for existing issue | Create new issue document if needed |
| **Understanding existing code** | [docs/specifications/architecture.md](docs/specifications/architecture.md) | See Critical Patterns section below |
| **Reviewing dependencies** | [docs/specifications/infrastructure.md](docs/specifications/infrastructure.md) | Check tech stack and integration details |

### Documentation Tasks

| Task | Primary Document | Supporting Documents |
|------|-----------------|---------------------|
| **Creating documentation** | [docs/policy/policy.md](docs/policy/policy.md#documentation-structure) | Follow folder organization rules |
| **Korean translation** | [docs/policy/policy.md](docs/policy/policy.md#korean-translation-workflow) | Create in docs/dev/ with .ko.md suffix |
| **API reference** | Add to [docs/reference/](docs/reference/) | User-added external documentation only |

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
- ✅ Example: `features/post-filtering` can import from `entities/posts` and `shared/lib`
- ❌ Example: `entities/posts` CANNOT import from `features/post-filtering`

**Layer Responsibilities**:

```text
src/
├── app/           # Next.js App Router - routes, layouts, API endpoints
├── widgets/       # Composite UI - Header, Footer (cross-feature layouts)
├── features/      # User features - post filtering, guestbook, AI summary
├── entities/      # Domain models - Post, Tag, Notion client
└── shared/        # Cross-cutting - cache, logger, UI primitives, config
```

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Files/directories | `kebab-case` | `post-card.tsx`, `ai-summary/` |
| React components | `PascalCase` (exported from kebab-case files) | `export const PostCard = () => {}` |
| Functions/variables | `camelCase` | `fetchPosts()`, `postData` |
| Constants | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| Types/Interfaces | `PascalCase` | `interface PostData {}`, `type TagName = string` |
| Private methods | `_camelCase` (prefix underscore) | `private _validatePost()` |

**Reference**: Full details in [docs/policy/naming-conventions.md](docs/policy/naming-conventions.md)

### Commits

**Format**: `<type>: <한글 요약>`

**Available Types**:

- `feat` - 새로운 기능
- `fix` - 버그 수정
- `style` - 코드 스타일/포맷팅 (로직 변경 없음)
- `chore` - 유지보수 작업
- `lint` - 린팅 수정
- `config` - 설정 변경
- `perf` - 성능 개선
- `seo` - SEO 최적화
- `docs` - 문서만 변경
- `test` - 테스트 추가/수정

**Rules**:

- 요약은 한글로 작성
- 마침표 없음
- 72자 이하 유지
- 이슈 참조 시: `(refs issue087)`

**Examples**:

```bash
feat: AI 요약 생성 기능 추가
fix: 모바일 헤더 반응형 레이아웃 적용
chore: AI 스타일 요약으로 업데이트
seo: b2b 포스트 영구 리다이렉트 추가
```

**Reference**: Full details in [docs/policy/commit-convention.md](docs/policy/commit-convention.md)

### Pull Requests

**Branch Naming**: `<type>/<issue-number>[-description]`

**Examples**:

- `chore/86` - Minimal, just issue number
- `feat/87-add-search` - With description
- `fix/88-mobile-header` - Bug fix

**PR Requirements**:

1. Create corresponding [docs/issue/issueXXX.md](docs/issue/) before starting work
2. Reference issue document in PR description
3. Update issue document with validation results
4. Follow commit conventions for all commits in PR
5. Run `pnpm lint` and `pnpm test` before creating PR

**Reference**: Full details in [docs/policy/branching-strategy.md](docs/policy/branching-strategy.md)

### Testing

**What to Test** (priority order):

| Code Type | Coverage Target | Rationale |
|-----------|----------------|-----------|
| Entities/domain models | 80%+ | Core business logic |
| API routes | 80%+ | Critical user-facing endpoints |
| Features with user interaction | 70%+ | User experience integrity |
| UI components with logic | 50%+ | Conditional rendering, state |

**What NOT to Test**:

- ❌ Simple presentational components (no logic)
- ❌ Type definitions
- ❌ Configuration files
- ❌ Third-party library wrappers without custom logic

**Test Commands**:

```bash
pnpm test       # Standard tests with MSW mocking (default)
pnpm test:deep  # Real Notion API calls (requires valid credentials)
```

**Reference**: Full details in [docs/policy/testing-policy.md](docs/policy/testing-policy.md)

## Environment & Infrastructure

### Required Environment Variables

Create `.env.local` with these variables:

```bash
# Notion (Required)
NOTION_KEY=secret_xxx                        # Internal integration token
NOTION_TOKEN_V2=xxx                          # Browser cookie token (for react-notion-x)
NOTION_POST_DATABASE_ID=xxx                  # Post database ID
NOTION_GUESTBOOK_DATABASE_ID=xxx            # Guestbook database ID

# AI LLM (Choose based on NODE_ENV)
OPENAI_API_KEY=sk-xxx                       # Production only
LOCAL_AI_ENDPOINT=http://localhost:11434    # Development only (e.g., Ollama)

# Email (Required for guestbook notifications)
AUTH_USER=your@gmail.com
AUTH_PASS=xxxx xxxx xxxx xxxx              # Gmail app password (NOT regular password)

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX             # Google Analytics
```

**Reference**: Complete list in [docs/specifications/infrastructure.md](docs/specifications/infrastructure.md)

### Common Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:3000
pnpm build            # Production build with ISR optimization
pnpm start            # Serve production build

# Code Quality
pnpm lint             # Run ESLint (next/core-web-vitals)
pnpm biome:write      # Format code with Biome

# Testing
pnpm test             # Vitest with MSW mocking
pnpm test:deep        # Real API integration tests
```

## Critical Patterns

### Dual Notion Client Setup

This project uses **two separate** Notion client libraries:

**1. Official Client** (`@notionhq/client`):

- **Location**: [src/entities/notion/api/server-side.ts](src/entities/notion/api/server-side.ts)
- **Use for**: Querying databases, updating properties
- **Requires**: `NOTION_KEY` (internal integration token)
- **Example**: Fetching posts, updating AI summaries

**2. Unofficial Client** (`notion-client` + `react-notion-x`):

- **Location**: [src/entities/notion/api/react-notion-x.ts](src/entities/notion/api/react-notion-x.ts)
- **Use for**: Rendering rich page content with proper formatting
- **Requires**: `NOTION_TOKEN_V2` (browser cookie token)
- **Example**: Displaying blog post content with images/embeds

**Why Two Clients?**

- Official API doesn't support complex content rendering
- Unofficial client provides better UI but requires browser token
- Both are needed for full functionality

**Important**: Notion database properties use **Korean names**:

- "제목" (Title)
- "날짜" (Date)
- "상태" (Status)
- "태그" (Tags)

### Domain Models (Protected Constructor Pattern)

All domain entities follow this pattern for type safety:

```typescript
export class Post {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    // ... other properties
  ) {}

  static create(page: DatabaseObjectResponse): Post {
    if (!isPostDatabaseResponse(page)) {
      throw new Error('Invalid post page structure');
    }

    // Extract and validate properties
    return new Post(
      page.id,
      extractTitle(page),
      // ...
    );
  }
}
```

**Benefits**:

- Centralized validation logic
- Immutable instances
- Type-safe construction
- Clear error messages

**Examples**: [src/entities/posts/model/post.ts](src/entities/posts/model/post.ts)

### Server-Side Caching Strategy

All Notion data fetching uses unified caching wrapper: `nextServerCache` in [src/shared/lib/cache.ts](src/shared/lib/cache.ts)

**Cache Configuration** (in [src/shared/config/index.ts](src/shared/config/index.ts)):

- **Development**: 30 seconds ISR revalidation
- **Production**: 300 seconds (5 minutes) ISR revalidation

**Cache Invalidation Pattern**:

After updating Notion data, you **must** invalidate affected caches:

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

// Update data
await updatePostSummary(postId, summary);

// Invalidate caches
revalidateTag('posts');           // Invalidate all post queries
revalidatePath('/posts');         // Invalidate specific route
revalidatePath(`/posts/${postId}`); // Invalidate specific post
```

**Reference**: See [src/app/api/posts/[postId]/summary/route.ts](src/app/api/posts/[postId]/summary/route.ts) for complete pattern

### Environment-Based LLM Selection

AI summary generation uses different LLM providers based on environment:

- **Production** (`NODE_ENV=production`): OpenAI API (requires `OPENAI_API_KEY`)
- **Development** (`NODE_ENV=development`): Local LLM endpoint (requires `LOCAL_AI_ENDPOINT`)

**Implementation**: Check [src/entities/openai/](src/entities/openai/) for provider selection logic

**Example Local Setup**:

```bash
# Start Ollama locally
ollama serve

# In .env.local
LOCAL_AI_ENDPOINT=http://localhost:11434
```

## Documentation-Driven Workflow

### Before Starting Work

1. **Check for existing issue**: Look in [docs/issue/](docs/issue/) for `issueXXX.md`
2. **Create issue if missing**: Use [docs/issue/issue085.md](docs/issue/issue085.md) as template
3. **Document approach**: Write problem statement, goals, proposed solution
4. **Get agreement**: Discuss with team/maintainer before implementing

### While Working

1. **Update issue status**: Log progress in issue document
2. **Keep docs in sync**: Update [docs/specifications/](docs/specifications/) or [docs/policy/](docs/policy/) if architectural changes occur
3. **Add tests**: Cover critical paths (see [Testing](#testing))
4. **Run quality checks**: `pnpm lint` and `pnpm biome:write` before commits

### Before Creating PR

1. **Update issue with results**: Add validation section to issue document
2. **Update relevant docs**: Reflect any spec/policy changes in [docs/](docs/)
3. **Reference issue in commits**: Use `(refs issue087)` in commit messages
4. **Create PR with context**: Link to [docs/issue/issueXXX.md](docs/issue/) in PR description

**Reference**: Full workflow in [docs/policy/policy.md](docs/policy/policy.md)

## Important Gotchas

### Issue Numbering

- **Starts at 085** (not 001)
- New issues: 086, 087, 088, etc.
- **Reference**: See [docs/issue/](docs/issue/) for current numbering

### Notion Property Names

- Database properties are in **Korean**
- "제목" = Title
- "날짜" = Date
- "상태" = Status
- "태그" = Tags

### shadcn/ui Component Location

- Components installed to `src/shared/ui/` (not default `@/components`)
- **Configuration**: [components.json](components.json)
- Import: `import { Button } from '@/shared/ui/button'`

### Cache Invalidation is Critical

- **Always** call `revalidateTag()` and `revalidatePath()` after Notion updates
- Forgetting this causes stale data in production
- See [Cache Strategy](#server-side-caching-strategy)

### Gmail Authentication

- `AUTH_PASS` requires **app password** (not regular Gmail password)
- Generate at: Google Account → Security → 2-Step Verification → App passwords
- Format: `xxxx xxxx xxxx xxxx` (16 characters with spaces)

### Image Optimization

Remote patterns configured for:

- Notion CDN: `s3.us-west-2.amazonaws.com`
- noticon-static: `noticon-static.tammolo.com`

Add new patterns to [next.config.js](next.config.js) if needed

## Deep Dive Documentation

For comprehensive details, consult these documents:

### Specifications

- **[Architecture](docs/specifications/architecture.md)**: FSD layers, design patterns, module boundaries
- **[Infrastructure](docs/specifications/infrastructure.md)**: Environment setup, deployment, integrations, caching
- **[Requirements](docs/specifications/requirements.md)**: Functional requirements (FR-001 to FR-009)

### Policies

- **[Policy Overview](docs/policy/policy.md)**: Documentation structure, workflows, meta-policies
- **[Commit Convention](docs/policy/commit-convention.md)**: Detailed commit message rules and examples
- **[Branching Strategy](docs/policy/branching-strategy.md)**: Git workflow, branch naming, PR guidelines
- **[Naming Conventions](docs/policy/naming-conventions.md)**: Comprehensive naming rules for all code elements
- **[Testing Policy](docs/policy/testing-policy.md)**: Testing philosophy, coverage targets, practices

### Issues

- **[Issue Directory](docs/issue/)**: All planned and ongoing work
- **[Issue Template](docs/issue/issue085.md)**: Template for new issue documents

### Reference

- **[Reference Directory](docs/reference/)**: External API documentation, SDK guides (user-added)

## Localization (Korean Documentation)

All documentation under [docs/](docs/) (except [docs/dev/](docs/dev/)) is written in **English**.

Korean translations are maintained in [docs/dev/](docs/dev/) with `.ko.md` suffix.

**Workflow**:

1. Write English documentation first
2. Translate to Korean in [docs/dev/](docs/dev/)
3. Keep structure parallel between English and Korean versions

**Example**:

- English: [docs/policy/policy.md](docs/policy/policy.md)
- Korean: [docs/dev/policy/policy.ko.md](docs/dev/policy/policy.ko.md)

## Agent Responsibilities

### AI Agent's Role (Claude Code, etc.)

1. **Read docs first**: Always consult [docs/](docs/) before implementing changes
2. **Update docs**: Keep documentation current with code changes
3. **Create issues**: Draft `issueXXX.md` for new work in [docs/issue/](docs/issue/)
4. **Follow conventions**: Adhere to all policies (commits, naming, testing)
5. **Ask when unclear**: Request clarification rather than assume

### Human Developer's Role

1. **Review work**: Verify implementations align with intent
2. **Provide context**: Share domain knowledge and business requirements
3. **Update references**: Add external API docs to [docs/reference/](docs/reference/)
4. **Make decisions**: Resolve ambiguities and approve architectural approaches
5. **Maintain translations**: Update Korean docs in [docs/dev/](docs/dev/)

## Navigation Hub

For task-specific navigation and detailed documentation structure, see [docs/README.md](docs/README.md).
