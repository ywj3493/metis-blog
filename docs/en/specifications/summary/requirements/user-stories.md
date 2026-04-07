<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [requirements](requirements.md) | [use-cases](../workflows/use-cases.md) -->

> [← Requirements](requirements.md) | [Use Cases →](../workflows/use-cases.md)

# Summary Domain — User Stories

## US-01: Generate Post Summary

**As a** blog owner,
**I want to** click a button on a post card to generate an AI summary,
**So that** readers can quickly understand what each post is about.

### Acceptance Criteria

- [ ] **AC-US01-01**: Given a post has no summary, When I click the summary button, Then the API generates a 2-sentence Korean summary
- [ ] **AC-US01-02**: Given the summary is generated, When the API completes, Then the summary is stored in Notion's `summary` property
- [ ] **AC-US01-03**: Given a post already has a summary, When I trigger generation, Then an error is returned
- [ ] **AC-US01-04**: Given the LLM fails, When generation errors, Then a 502 status is returned with a clear message

## US-02: Use Local LLM in Development

**As a** developer,
**I want to** use a local Ollama instance for summary generation in development,
**So that** I don't incur OpenAI API costs while testing.

### Acceptance Criteria

- [ ] **AC-US02-01**: Given `NODE_ENV=development`, When `getOpenAIClient()` is called, Then it points to `LOCAL_AI_ENDPOINT`
- [ ] **AC-US02-02**: Given `NODE_ENV=production`, When `getOpenAIClient()` is called, Then it uses `OPENAI_API_KEY`
- [ ] **AC-US02-03**: Given Ollama is not running locally, When generation is triggered, Then a `SummaryServiceError` is thrown

## US-03: Read Summary on Post Card

**As a** reader,
**I want to** see a summary on each post card,
**So that** I can quickly scan posts and find relevant ones.

### Acceptance Criteria

- [ ] **AC-US03-01**: Given a post has `aiSummarized=true`, When I view the post list, Then the summary is shown on the card
- [ ] **AC-US03-02**: Given a post has no summary, When I view the post list, Then a generate button is shown instead

## Story-Requirement Traceability

| User Story | Requirements | AC Count |
|-----------|-------------|----------|
| US-01 | FR-SUMMARY-01, FR-SUMMARY-02, FR-SUMMARY-05 | 4 |
| US-02 | FR-SUMMARY-03 | 3 |
| US-03 | FR-SUMMARY-04 | 2 |

> **All Documents**
> [Requirements](requirements.md) | **[User Stories]** | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [API Spec](../workflows/api-spec.md) | [Test Spec](../workflows/test-spec.md)
