<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->
<!-- @reference: [architecture](architecture.md) | [infrastructure](infrastructure.md) -->

> [← Architecture](architecture.md) | [Infrastructure →](infrastructure.md)

# Configuration

## Environment Variables

Create `.env.local` with the following variables:

### Notion (Required)

| Variable | Description | Example |
|----------|-------------|---------|
| `NOTION_KEY` | Internal integration token (Official API) | `secret_xxx` |
| `NOTION_TOKEN_V2` | Browser cookie token (react-notion-x renderer) | `v02%3Auser_token_or_...` |
| `NOTION_USER_ID` | Notion active user ID (react-notion-x) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `NOTION_POST_DATABASE_ID` | Post database ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `NOTION_GUESTBOOK_DATABASE_ID` | Guestbook database ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

### AI / LLM

| Variable | Environment | Description | Example |
|----------|-------------|-------------|---------|
| `OPENAI_API_KEY` | Production only | OpenAI API key | `sk-xxx` |
| `LOCAL_AI_ENDPOINT` | Development only | Local LLM endpoint (e.g., Ollama) | `http://localhost:11434` |
| `LOCAL_AI_MODEL` | Development only | Override default local model | `gemma3:1b` (default) |

### Email (Required for guestbook notifications)

| Variable | Description | Example |
|----------|-------------|---------|
| `AUTH_USER` | Gmail sender address | `your@gmail.com` |
| `AUTH_PASS` | Gmail app password (NOT regular password) | `xxxx xxxx xxxx xxxx` |

### Optional

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | `G-XXXXXXXXXX` |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console verification file name | `googleXXXXX.html` |

### CI / Build

| Variable | Description | Example |
|----------|-------------|---------|
| `CI_MOCK` | Enable mock data for Notion API in CI builds | `true` |

## Application Configuration

### Cache Configuration

**Source**: `src/shared/config/index.ts`

```typescript
export const CACHE_CONFIG = {
  ISR_REVALIDATE_TIME: process.env.NODE_ENV === "development" ? 30 : 300, // seconds
  get MEMORY_CACHE_TTL() { return this.ISR_REVALIDATE_TIME * 1000; },     // milliseconds
};
```

| Environment | ISR Revalidation | Memory Cache TTL |
|-------------|-----------------|------------------|
| Development | 30 seconds | 30,000 ms |
| Production | 300 seconds (5 min) | 300,000 ms |

### Summary Model Configuration

**Source**: `src/shared/config/index.ts`

```typescript
export const SUMMARY_MODEL_CONFIG = {
  model: process.env.NODE_ENV === "development"
    ? (process.env.LOCAL_AI_MODEL ?? "gemma3:1b")
    : "gpt-4o-mini",
  temperature: 0.2,
  max_tokens: 50,
  top_p: 0.9,
};
```

### Next.js Configuration

**Source**: `next.config.mjs`

| Setting | Value | Notes |
|---------|-------|-------|
| `swcMinify` | `true` | SWC-based minification |
| `reactStrictMode` | `true` | React strict mode enabled |
| Image remote patterns | `www.notion.so`, `noticon-static.tammolo.com` | Allowed remote image hosts |
| Rewrite: `/sitemap.xml` | → `/api/sitemap` | Sitemap served via API route |

### TypeScript Configuration

**Source**: `tsconfig.json`

| Setting | Value |
|---------|-------|
| `strict` | `true` |
| `noUnusedLocals` | `true` |
| `noUnusedParameters` | `true` |
| Path alias `@/*` | `src/*` |

### Notion Database Properties

Database properties use **Korean names**:

| Korean | English | Type |
|--------|---------|------|
| 제목 | Title | Title |
| 날짜 | Date | Date |
| 상태 | Status | Select (`공개` = Published) |
| 태그 | Tags | Multi-select |

> **All Documents**
> [Architecture](architecture.md) | **[Config]** | [Infrastructure](infrastructure.md) | [Domains](README.md)
