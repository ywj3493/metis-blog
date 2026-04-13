<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->
<!-- @reference: [architecture](architecture.md) | [config](config.md) -->

> [← Config](config.md) | [Domains →](README.md)

# Infrastructure

## Tech Stack

| Category | Technology | Version/Notes |
|----------|-----------|---------------|
| Framework | Next.js 14 | App Router, ISR |
| Language | TypeScript | Strict mode |
| Styling | Tailwind CSS | + tailwindcss-animate |
| UI Library | shadcn/ui | Radix UI primitives, installed to `src/shared/ui/` |
| CMS | Notion | Dual client (@notionhq/client + react-notion-x) |
| AI | OpenAI / Ollama | Environment-based selection |
| Email | Nodemailer | Gmail SMTP |
| Runtime | Node.js 22.x | Enforced via `.nvmrc` and `engines` |
| Package Manager | pnpm 10.x | Workspace catalogs |
| Formatter | Biome | `pnpm biome:write` |
| Linter | ESLint | next/core-web-vitals config |
| Test Framework | Vitest | + MSW for API mocking |
| Testing Library | @testing-library/react | + jest-dom, user-event |
| Logging | Pino | + pino-pretty (dev) |
| Analytics | Vercel Analytics | + Speed Insights |
| Hosting | Vercel | Automatic deployments |

## Development Setup

### Prerequisites

- Node.js 22.x (see `.nvmrc`)
- pnpm 10.x (see `packageManager` in `package.json`)

### Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build with ISR
pnpm start            # Serve production build

# Code Quality
pnpm lint             # ESLint (next/core-web-vitals)
pnpm biome:write      # Format with Biome

# Testing
pnpm test             # Vitest with MSW mocking
pnpm test:deep        # Real Notion API integration tests (requires credentials)
```

## Build & Deployment

### Vercel Deployment

- **Platform**: Vercel
- **Build**: ISR (Incremental Static Regeneration)
- **Revalidation**: 300 seconds in production
- **CI Mock**: When `CI_MOCK=true`, Notion API calls use mock data from `src/shared/api/notion-mock.ts`

### ISR Caching Strategy

All Notion data fetching uses `nextServerCache()` wrapper:

```
Request → ISR Cache Check → Cache Hit → Serve cached page
                          → Cache Miss / Stale → Fetch from Notion → Rebuild page → Cache
```

**Cache Invalidation** (after data mutations):

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

revalidateTag('posts');              // Invalidate all post queries
revalidatePath('/posts');            // Invalidate post list page
revalidatePath(`/posts/${postId}`);  // Invalidate specific post page
```

## External Services

### Notion Integration

| Integration | Client | Auth Token | Usage |
|------------|--------|------------|-------|
| Official API | `@notionhq/client` | `NOTION_KEY` | Database queries, property updates |
| Unofficial API | `notion-client` | `NOTION_TOKEN_V2` | Page content rendering |

### Gmail SMTP

- **Library**: Nodemailer
- **Service**: Gmail
- **Auth**: App password (not regular password)
- **Trigger**: New guestbook entry → email notification to blog owner

### LLM Providers

| Environment | Provider | Configuration |
|-------------|----------|--------------|
| Development | Ollama | Local endpoint, configurable model |
| Production | OpenAI | `gpt-4o-mini`, API key required |

## CI/CD Pipeline

### Pull Request CI (`.github/workflows/pull_request.yml`)

Runs on every PR to `main`:

1. **Code Quality** — `biome ci .` (Biome 2.4.2)
2. **Lint** — `pnpm lint` (ESLint)
3. **Test** — `pnpm test --run` (Vitest with MSW)
4. **Build** — `pnpm build` with `CI_MOCK=true` (Notion API mocked)

CI build uses mock env vars for all Notion credentials.

### Production Deploy (`.github/workflows/deploy.yml`)

Triggered by `v*` tags (e.g., `v1.0.0`):

1. Verify tag is on `main` branch
2. Install dependencies (`pnpm install --frozen-lockfile`)
3. Pull Vercel environment (`vercel pull --environment=production`)
4. Build with Vercel CLI (`vercel build --prod`)
5. Deploy to Vercel (`vercel deploy --prebuilt --prod`)

**Required secrets**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## Monitoring & Logging

| Tool | Purpose |
|------|---------|
| `@vercel/analytics` | Page views and web analytics |
| `@vercel/speed-insights` | Core Web Vitals monitoring |
| Pino logger | Server-side structured logging |

### Notion API Logger

**Source**: `src/shared/lib/logger.ts`

- `NotionAPILogger` (singleton) — tracks API call count, success/failure, response times
- `withPinoLogger(fn, name)` — higher-order function wrapping any async function with automatic logging
- `setupBuildEndLogger()` — registers process exit handlers to print final build statistics
- Development: pretty logs to `logs/notion-api.log` via `pino-pretty`
- Production: JSON structured logs to stdout

## Mock System (Testing & CI)

**Source**: `src/mocks/`

| Module | Purpose |
|--------|---------|
| `src/mocks/server.ts` | MSW server for Vitest tests |
| `src/mocks/browser.ts` | MSW browser for dev/storybook |
| `src/mocks/handlers.ts` | Request handler definitions |
| `src/shared/api/notion-mock.ts` | Static mock data for CI builds (`MOCK_POSTS`, `MOCK_TAGS`, `MOCK_PAGE_RECORD_MAP`) |

> **All Documents**
> [Architecture](architecture.md) | [Config](config.md) | **[Infrastructure]** | [Domains](README.md)
