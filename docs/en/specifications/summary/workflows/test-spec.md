<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [api-spec](api-spec.md) | [requirements](../requirements/requirements.md) -->

> [← API Spec](api-spec.md)

# Summary Domain — Test Specification

## Test Type Definitions

| Type | Scope | Mock Strategy |
|------|-------|---------------|
| Unit | `safeSlice`, `getSummary` logic | Mock `getOpenAIClient` |
| Integration | API route end-to-end | MSW for OpenAI, MSW for Notion |
| E2E | UI button → API → Notion update | MSW for all externals |

## Test Matrix

| Test ID | Source | Reference | Type | Description | Priority |
|---------|--------|-----------|------|-------------|----------|
| T-001 | FR-SUMMARY-01 | — | Unit | `safeSlice()` truncates content to N word-tokens | P0 |
| T-002 | FR-SUMMARY-01 | — | Unit | `safeSlice()` returns full text when under limit | P1 |
| T-003 | FR-SUMMARY-01 | AC-US01-01 | Unit | `getSummary()` returns LLM completion text | P0 |
| T-004 | FR-SUMMARY-01 | AC-US01-04 | Unit | `getSummary()` throws `SummaryServiceError` on LLM failure | P0 |
| T-005 | FR-SUMMARY-01 | — | Unit | `getSummary()` uses correct system prompt | P1 |
| T-006 | FR-SUMMARY-03 | AC-US02-01 | Unit | `getOpenAIClient()` uses `LOCAL_AI_ENDPOINT` in development | P0 |
| T-007 | FR-SUMMARY-03 | AC-US02-02 | Unit | `getOpenAIClient()` uses `OPENAI_API_KEY` in production | P0 |
| T-008 | FR-SUMMARY-03 | — | Unit | `getOpenAIClient()` returns cached singleton | P1 |
| T-009 | FR-SUMMARY-01 | AC-US01-01 | Integration | `PATCH /api/posts/[postId]/summary` returns 200 with summary | P0 |
| T-010 | FR-SUMMARY-02 | AC-US01-02 | Integration | API patches Notion `summary` property | P0 |
| T-011 | FR-SUMMARY-01 | AC-US01-03 | Integration | API returns 500 when post already has summary | P0 |
| T-012 | FR-SUMMARY-05 | — | Integration | API returns 404 on Notion `ObjectNotFound` | P0 |
| T-013 | FR-SUMMARY-05 | — | Integration | API returns 403 on Notion `Unauthorized` | P1 |
| T-014 | FR-SUMMARY-05 | — | Integration | API returns 429 on Notion `RateLimited` | P1 |
| T-015 | FR-SUMMARY-05 | — | Integration | API returns 502 on other Notion errors | P1 |
| T-016 | FR-SUMMARY-05 | AC-US01-04 | Integration | API returns 502 on `SummaryServiceError` | P0 |
| T-017 | FR-SUMMARY-02 | — | Integration | API calls `revalidateTag("posts")` after success | P1 |
| T-018 | FR-SUMMARY-04 | AC-US03-01 | E2E | `SummaryCard` renders when `aiSummarized=true` | P1 |
| T-019 | FR-SUMMARY-04 | AC-US03-02 | E2E | `SummaryButton` renders when `aiSummarized=false` | P1 |
| T-020 | FR-SUMMARY-04 | AC-US01-01 | E2E | Click `SummaryButton` triggers `updatePostSummary()` | P1 |

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P0 | Must pass — blocks release |
| P1 | Should pass — important functionality |
| P2 | Nice to have — edge cases |

## Test File Structure

```
src/
├── features/summary/
│   └── api/
│       ├── get-summary.test.ts        # T-001 ~ T-005 (unit)
│       └── update-post-summary.test.ts
├── shared/api/
│   └── openai.test.ts                 # T-006 ~ T-008 (unit)
├── app/api/posts/[postId]/summary/
│   └── route.test.ts                  # T-009 ~ T-017 (integration)
└── features/summary/
    └── ui/
        ├── summary-card.test.tsx      # T-018 (E2E)
        └── summary-button.test.tsx    # T-019, T-020 (E2E)
```

## Mocking Boundaries

| Test Type | OpenAI/Ollama | Notion | next/cache |
|-----------|--------------|--------|-----------|
| Unit | vi.mock | — | — |
| Integration | MSW (OpenAI-compatible endpoint) | MSW | vi.mock |
| E2E | MSW | MSW | vi.mock |

## Test-Requirement Traceability

| Requirement | User Story | Use Case | Test IDs | Coverage |
|-------------|-----------|----------|----------|----------|
| FR-SUMMARY-01 | US-01 | UC-SUMMARY-01 | T-001 ~ T-005, T-009, T-011 | Full |
| FR-SUMMARY-02 | US-01 | UC-SUMMARY-01 | T-010, T-017 | Full |
| FR-SUMMARY-03 | US-02 | UC-SUMMARY-02 | T-006 ~ T-008 | Full |
| FR-SUMMARY-04 | US-01, US-03 | UC-SUMMARY-03 | T-018 ~ T-020 | Full |
| FR-SUMMARY-05 | US-01 | UC-SUMMARY-01 | T-012 ~ T-016 | Full |

## Agent Guidelines

- Reference acceptance criteria in test descriptions: `// AC-US01-01`
- Use `vi.mock("@/shared/api/openai")` for unit tests of `getSummary`
- Use MSW handlers for integration tests of API routes
- Test error mapping carefully — each Notion `APIErrorCode` maps to a specific HTTP status

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | [Sequence Diagram](sequence-diagram.md) | [API Spec](api-spec.md) | **[Test Spec]**
