<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- Tech Stack: Next.js 14, TypeScript, OpenAI SDK, Ollama, Notion API -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [User Stories →](user-stories.md)

# Summary Domain — Requirements

## System Overview

The Summary domain handles AI-generated summaries for blog posts. It fetches post content from Notion, generates a 2-sentence Korean summary via an environment-selected LLM (OpenAI in production, Ollama in development), and stores the result back in the Notion `summary` property.

## Functional Requirements

### FR-SUMMARY-01: Generate AI Summary

| Field | Value |
|-------|-------|
| ID | FR-SUMMARY-01 |
| Priority | High |
| Description | Generate a 2-sentence Korean summary for a post via LLM |

**Acceptance Criteria**:
- Triggered via `PATCH /api/posts/[postId]/summary`
- Fetches post title and paragraph content from Notion via `getNotionPostContentForSummary()`
- Returns 400/error if post already has a summary
- Generates summary via `getSummary(title, content)` using `SUMMARY_MODEL_CONFIG`
- System prompt enforces: 2 sentences max, polite Korean, no exaggeration, no markdown
- Content truncated to ~8000 word-tokens via `safeSlice()`

### FR-SUMMARY-02: Store Summary in Notion

| Field | Value |
|-------|-------|
| ID | FR-SUMMARY-02 |
| Priority | High |
| Description | Persist generated summary back to Notion `summary` property |

**Acceptance Criteria**:
- Calls `patchNotionPostSummary(postId, summary)` after successful generation
- Invalidates caches: `revalidateTag("posts")`, `revalidatePath("/posts")`, `revalidatePath("/")`
- Returns 200 with `{ success, summary, message }`

### FR-SUMMARY-03: Environment-Based LLM Selection

| Field | Value |
|-------|-------|
| ID | FR-SUMMARY-03 |
| Priority | High |
| Description | Use OpenAI in production and Ollama in development for summary generation |

**Acceptance Criteria**:
- `getOpenAIClient()` selects provider based on `NODE_ENV`
- Production: `OPENAI_API_KEY`, model `gpt-4o-mini`
- Development: `LOCAL_AI_ENDPOINT` (default `http://localhost:11434`), model `LOCAL_AI_MODEL` or `gemma3:1b`
- Both use OpenAI SDK API surface (Ollama is OpenAI-compatible)

### FR-SUMMARY-04: Display Summary in UI

| Field | Value |
|-------|-------|
| ID | FR-SUMMARY-04 |
| Priority | Medium |
| Description | Show summary on post cards and provide a button to trigger generation |

**Acceptance Criteria**:
- `SummaryCard` displays the AI summary on `PostCard` when `aiSummarized` is true
- `SummaryButton` triggers `updatePostSummary(postId)` when summary is missing
- After successful generation, page revalidates and shows the new summary

### FR-SUMMARY-05: Error Handling

| Field | Value |
|-------|-------|
| ID | FR-SUMMARY-05 |
| Priority | High |
| Description | Map Notion and LLM errors to appropriate HTTP status codes |

**Acceptance Criteria**:

| Error | HTTP Status |
|-------|-------------|
| Already summarized | 500 (with message) |
| Notion `ObjectNotFound` | 404 |
| Notion `Unauthorized` | 403 |
| Notion `RateLimited` | 429 |
| Other Notion errors | 502 |
| `SummaryServiceError` | 502 |
| Unknown errors | 500 |

## Non-Functional Requirements

### NFR-SUMMARY-01: Performance

- Token-like content truncation (8000 words) prevents excessive LLM cost/latency
- Cache invalidation ensures fresh summaries appear immediately

### NFR-SUMMARY-02: Quality

- System prompt enforces consistent style (polite Korean, no markdown, factual)
- `temperature: 0.2` for deterministic output
- `max_tokens: 50` for concise summaries

## Constraints

| Type | Constraint |
|------|-----------|
| Technical | Notion `summary` property must exist on post pages |
| Technical | Ollama must be running locally for development |
| Business | Summaries are immutable once generated (no regeneration) |

## Requirements Traceability

| Requirement | User Stories | Use Cases |
|-------------|-------------|-----------|
| FR-SUMMARY-01 | US-01 | UC-SUMMARY-01 |
| FR-SUMMARY-02 | US-01 | UC-SUMMARY-01 |
| FR-SUMMARY-03 | US-02 | UC-SUMMARY-02 |
| FR-SUMMARY-04 | US-01, US-03 | UC-SUMMARY-03 |
| FR-SUMMARY-05 | US-01 | UC-SUMMARY-01 |

> **All Documents**
> **[Requirements]** | [User Stories](user-stories.md) | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [API Spec](../workflows/api-spec.md) | [Test Spec](../workflows/test-spec.md)
