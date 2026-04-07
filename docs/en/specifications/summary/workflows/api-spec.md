<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [sequence-diagram](sequence-diagram.md) | [test-spec](test-spec.md) -->

> [← Sequence Diagram](sequence-diagram.md) | [Test Spec →](test-spec.md)

# Summary Domain — API Specification

## API Basic Information

| Field | Value |
|-------|-------|
| Base URL | `/api` |
| Protocol | HTTPS |
| Auth | None (consider adding for production) |
| Format | JSON |

## Endpoint Catalog

| Method | Path | Auth | Summary | Related UC |
|--------|------|------|---------|-----------|
| PATCH | `/api/posts/[postId]/summary` | None | Generate AI summary for a post | UC-SUMMARY-01 |

---

## PATCH /api/posts/[postId]/summary

**Source**: `src/app/api/posts/[postId]/summary/route.ts`

### Request

**Path Parameters**:
| Name | Type | Description |
|------|------|-------------|
| `postId` | string | Notion page ID of the post |

No body or query parameters.

### Response — 200 Success

```json
{
  "success": true,
  "summary": "이 글은 Next.js 14의 App Router 도입 사례를 다룹니다. ISR과 캐싱 전략을 통해 정적 사이트와 동적 API의 균형을 보여줍니다.",
  "message": "AI 요약이 성공적으로 생성되었습니다."
}
```

### Response — 404 Not Found

```json
{ "success": false, "error": "포스트를 찾을 수 없습니다." }
```

Trigger: Notion `APIErrorCode.ObjectNotFound`

### Response — 403 Forbidden

```json
{ "success": false, "error": "Notion API 권한이 부족합니다." }
```

Trigger: Notion `APIErrorCode.Unauthorized`

### Response — 429 Rate Limited

```json
{ "success": false, "error": "요청 제한에 걸렸습니다. 잠시 후 다시 시도해주세요." }
```

Trigger: Notion `APIErrorCode.RateLimited`

### Response — 502 Bad Gateway

```json
{ "success": false, "error": "Notion API 요청에 실패했습니다." }
```

OR

```json
{ "success": false, "error": "요약 서비스에 문제가 발생했습니다." }
```

Trigger: Other Notion error or `SummaryServiceError`

### Response — 500 Internal Server Error

```json
{ "success": false, "error": "이미 요약이 생성된 포스트입니다." }
```

OR

```json
{ "success": false, "error": "<unknown error message>" }
```

### Example

```bash
curl -X PATCH https://blog.example.com/api/posts/abc123/summary
```

```typescript
import { updatePostSummary } from '@/features/summary/api';

const result = await updatePostSummary('abc123');
// { success: true, summary: "...", message: "..." }
```

---

## Internal Functions

### `getSummary(postTitle, plainText): Promise<string>`

**Source**: `src/features/summary/api/get-summary.ts`

| Parameter | Type | Description |
|-----------|------|-------------|
| `postTitle` | string | Post title |
| `plainText` | string | Plain-text content extracted from Notion paragraphs |

**Returns**: Generated summary string (trimmed)

**Throws**: `SummaryServiceError` on LLM failure

**Behavior**:
- Truncates content via `safeSlice(plainText, 8000)` (word-token approximation)
- Calls `getOpenAIClient().chat.completions.create()` with:
  - `model`: from `SUMMARY_MODEL_CONFIG.model`
  - `temperature: 0.2`
  - `max_tokens: 50`
  - `top_p: 0.9`
  - System prompt enforcing 2 sentences, polite Korean, no markdown, no exaggeration

### `updatePostSummary(postId: string): Promise<{ success, summary, message }>`

**Source**: `src/features/summary/api/update-post-summary.ts`

Client-side fetcher that calls `PATCH /api/posts/[postId]/summary`. Throws `Error` with the API error message on non-200 responses.

## Cache Invalidation

After successful generation, the API route invalidates these caches:

| Operation | Target |
|-----------|--------|
| `revalidateTag("posts")` | All `getNotionPosts()` cache entries |
| `revalidatePath("/posts")` | Posts list page |
| `revalidatePath("/")` | Home page |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | [Sequence Diagram](sequence-diagram.md) | **[API Spec]** | [Test Spec](test-spec.md)
