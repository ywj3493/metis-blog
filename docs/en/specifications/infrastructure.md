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

## Monitoring

| Tool | Purpose |
|------|---------|
| `@vercel/analytics` | Page views and web analytics |
| `@vercel/speed-insights` | Core Web Vitals monitoring |
| Pino logger | Server-side structured logging |

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
