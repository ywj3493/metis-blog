<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [user-stories](../requirements/user-stories.md) | [sequence-diagram](sequence-diagram.md) -->

> [← User Stories](../requirements/user-stories.md) | [Sequence Diagram →](sequence-diagram.md)

# Summary Domain — Use Cases

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Blog Owner | Primary | Triggers summary generation |
| Reader | Primary | Sees generated summaries on post cards |
| Notion API | Secondary | Source of post content, target for summary update |
| LLM Provider | Secondary | OpenAI (prod) / Ollama (dev) |

## UC-SUMMARY-01: Generate and Store Summary

| Field | Value |
|-------|-------|
| ID | UC-SUMMARY-01 |
| Actors | Blog Owner, Notion API, LLM Provider |
| Related Requirements | FR-SUMMARY-01, FR-SUMMARY-02, FR-SUMMARY-05 |

### Main Flow

1. Blog Owner clicks `SummaryButton` on a post card
2. `updatePostSummary(postId)` calls `PATCH /api/posts/[postId]/summary`
3. API fetches post via `getNotionPostContentForSummary(postId)`
4. If `isSummarized=true`, throw error → 500 response
5. API calls `getSummary(title, content)`:
   - Truncate content to 8000 word-tokens
   - Call LLM with system prompt and user prompt
   - Return generated summary
6. API calls `patchNotionPostSummary(postId, summary)` to update Notion
7. Cache invalidation: `revalidateTag("posts")`, `revalidatePath("/posts")`, `revalidatePath("/")`
8. Return 200 with `{ success: true, summary, message }`

### Alternative Flows
- **AF-01**: Notion `ObjectNotFound` → 404
- **AF-02**: Notion `Unauthorized` → 403
- **AF-03**: Notion `RateLimited` → 429
- **AF-04**: Other Notion error → 502
- **AF-05**: `SummaryServiceError` (LLM failure) → 502
- **AF-06**: Already summarized → 500

## UC-SUMMARY-02: Environment-Based LLM Selection

| Field | Value |
|-------|-------|
| ID | UC-SUMMARY-02 |
| Actors | LLM Provider |
| Related Requirements | FR-SUMMARY-03 |

### Main Flow

1. `getOpenAIClient()` is called for the first time (lazy singleton)
2. Check `process.env.NODE_ENV`
3. If `development`:
   - `apiKey: "ollama"` (placeholder)
   - `baseURL: ${LOCAL_AI_ENDPOINT}/v1` (defaults to `http://localhost:11434/v1`)
4. If `production`:
   - `apiKey: process.env.OPENAI_API_KEY`
   - `baseURL: undefined` (uses OpenAI default)
5. Cache client instance for subsequent calls

## UC-SUMMARY-03: Display Summary in UI

| Field | Value |
|-------|-------|
| ID | UC-SUMMARY-03 |
| Actors | Reader |
| Related Requirements | FR-SUMMARY-04 |

### Main Flow

1. Reader views post list (home or `/posts`)
2. For each post, `PostCard` checks `post.aiSummarized`
3. If true, render `SummaryCard` with `post.aiSummary`
4. If false, render `SummaryButton` (visible to blog owner)

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | **[Use Cases]** | [Sequence Diagram](sequence-diagram.md) | [API Spec](api-spec.md) | [Test Spec](test-spec.md)
