---
paths:
  - "src/shared/api/**"
  - "src/shared/lib/**"
  - "src/entities/**"
  - "src/features/**"
  - "src/app/api/**"
---

# Notion, Caching & LLM Data Patterns

Source: docs/en/specifications/config.md, docs/en/specifications/infrastructure.md

## Dual Notion Clients (do not mix them up)

| Client | Export | Use for | Env vars |
|--------|--------|---------|----------|
| `@notionhq/client` (official) | `notion` in `src/shared/api/notion.ts` | Database queries, property updates | `NOTION_KEY` |
| `notion-client` + `react-notion-x` (unofficial) | `notionApi` in `src/shared/api/notion.ts` | Rendering rich page content | `NOTION_TOKEN_V2`, `NOTION_USER_ID` |

## Notion Database Properties are Korean

Use the exact Korean property names: `제목` (Title), `날짜` (Date), `상태` (Status), `Tags`.

## Server-Side Caching

- All Notion fetches go through `nextServerCache()` from `src/shared/lib/cache.ts`.
- Revalidation: 30s (dev) / 300s (prod), configured in `src/shared/config/index.ts`.
- After ANY Notion mutation, invalidate the cache:

```typescript
import { revalidateTag, revalidatePath } from "next/cache";

revalidateTag("posts");
revalidatePath("/posts");
revalidatePath(`/posts/${postId}`);
```

Canonical example: `src/app/api/posts/[postId]/summary/route.ts`.

## Environment-Based LLM Selection

`src/shared/api/openai.ts` picks the provider by environment:

- Production: OpenAI API (`OPENAI_API_KEY`, model `gpt-4o-mini`)
- Development: Ollama via `LOCAL_AI_ENDPOINT` (model `gemma3:1b`), using the OpenAI SDK (Ollama is OpenAI-compatible)

Never hardcode a provider; keep both paths working.
