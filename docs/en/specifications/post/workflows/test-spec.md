<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [component-spec](component-spec.md) | [requirements](../requirements/requirements.md) -->

> [← Component Spec](component-spec.md)

# Post Domain — Test Specification

## Test Type Definitions

| Type | Scope | Mock Strategy |
|------|-------|---------------|
| Unit | Domain models, type guards, utility functions | No mocks needed |
| Integration | API layer functions with Notion client | MSW for Notion API |
| E2E | Full page rendering and user interaction | MSW for all external APIs |

## Test Matrix

| Test ID | Source | Reference | Type | Description | Priority |
|---------|--------|-----------|------|-------------|----------|
| T-001 | FR-POST-01 | AC-US01-01 | Unit | `Post.create()` from `DatabaseObjectResponse` | P0 |
| T-002 | FR-POST-01 | AC-US01-01 | Unit | `Post.create()` from `IPost` plain object | P0 |
| T-003 | FR-POST-01 | — | Unit | `Post.create()` throws on invalid input | P0 |
| T-004 | FR-POST-01 | — | Unit | `Tag.create()` from `TagDatabaseResponse` | P0 |
| T-005 | FR-POST-01 | — | Unit | `Tag.create()` from `ITag` plain object | P0 |
| T-006 | FR-POST-01 | — | Unit | `isPostDatabaseResponse()` type guard | P0 |
| T-007 | FR-POST-01 | — | Unit | `isIPost()` type guard | P0 |
| T-008 | FR-POST-01 | — | Unit | `isITag()` / `isTagDatabaseResponse()` type guards | P0 |
| T-009 | FR-POST-01 | — | Unit | `Post.slugifiedTitle` generates correct slug | P1 |
| T-010 | FR-POST-01 | — | Unit | `Post.aiSummarized` returns true when summary exists | P1 |
| T-011 | FR-POST-01 | AC-US01-01 | Integration | `getNotionPosts()` returns published posts sorted by date | P0 |
| T-012 | FR-POST-03 | — | Integration | `getNotionPostDatabaseTags()` returns all tags | P1 |
| T-013 | FR-POST-02 | AC-US02-03 | Integration | `getSlugMap()` builds correct slug-to-ID mapping | P1 |
| T-014 | FR-POST-02 | — | Integration | `getNotionPage()` returns `ExtendedRecordMap` | P1 |
| T-015 | FR-POST-03 | AC-US03-01 | E2E | Tag filter shows matching posts on click | P1 |
| T-016 | FR-POST-03 | AC-US03-02 | E2E | Multiple tag selection uses OR logic | P1 |
| T-017 | FR-POST-03 | AC-US03-03 | E2E | Empty state shown when no posts match | P2 |
| T-018 | FR-POST-04 | AC-US04-01 | Integration | `PostNavigator` returns related posts with shared tags | P2 |

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P0 | Must pass — blocks release |
| P1 | Should pass — important functionality |
| P2 | Nice to have — edge cases |

## Test File Structure

```
src/
├── entities/post/
│   ├── model/
│   │   └── index.test.ts          # T-001 ~ T-010 (unit)
│   └── api/
│       └── index.test.ts          # T-011 ~ T-014 (integration)
├── features/post/
│   └── ui/
│       └── filterable-post.test.tsx  # T-015 ~ T-017 (E2E)
│       └── post-navigator.test.tsx   # T-018 (integration)
```

## Mocking Boundaries

| Test Type | Notion Official | Notion Unofficial | Cache |
|-----------|----------------|-------------------|-------|
| Unit | Not used | Not used | Not used |
| Integration | MSW handler | MSW handler | Bypassed |
| E2E | MSW handler | MSW handler | Bypassed |

## Test-Requirement Traceability

| Requirement | User Story | Use Case | Test IDs | Coverage |
|-------------|-----------|----------|----------|----------|
| FR-POST-01 | US-01 | UC-POST-01 | T-001 ~ T-012 | Full |
| FR-POST-02 | US-02 | UC-POST-02 | T-013, T-014 | Full |
| FR-POST-03 | US-03 | UC-POST-03 | T-015 ~ T-017 | Full |
| FR-POST-04 | US-04 | UC-POST-04 | T-018 | Partial |
| FR-POST-05 | US-01 | UC-POST-01 | T-011 | Partial |

## Agent Guidelines

- Test IDs follow `T-NNN` format, starting from T-001 within this domain
- Reference acceptance criteria in test descriptions: `// AC-US01-01`
- Use MSW handlers from `src/mocks/handlers.ts` for API mocking
- For deep tests (`pnpm test:deep`), skip MSW and use real Notion credentials

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | [Sequence Diagram](sequence-diagram.md) | [Component Spec](component-spec.md) | **[Test Spec]**
