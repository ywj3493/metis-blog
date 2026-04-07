<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [api-spec](api-spec.md) | [requirements](../requirements/requirements.md) -->

> [← API Spec](api-spec.md)

# Guestbook Domain — Test Specification

## Test Type Definitions

| Type | Scope | Mock Strategy |
|------|-------|---------------|
| Unit | Domain models, type guards | No mocks |
| Integration | API routes with Notion + Nodemailer | MSW + nodemailer mock |
| E2E | Form submission and list rendering | MSW for API |

## Test Matrix

| Test ID | Source | Reference | Type | Description | Priority |
|---------|--------|-----------|------|-------------|----------|
| T-001 | FR-GB-01 | — | Unit | `Guestbook.create()` from `GuestbookDatabaseResponse` | P0 |
| T-002 | FR-GB-01 | — | Unit | `Guestbook.create()` from `IGuestbook` | P0 |
| T-003 | FR-GB-01 | — | Unit | `Guestbook.create()` throws on invalid input | P0 |
| T-004 | FR-GB-01 | — | Unit | `Guestbook.isPublic` is true when status is "공개" | P0 |
| T-005 | FR-GB-01 | — | Unit | `isGuestbookDatabaseResponse()` type guard | P0 |
| T-006 | FR-GB-01 | — | Unit | `isIGuestbook()` type guard | P0 |
| T-007 | FR-GB-01 | AC-US01-01 | Integration | `GET /api/guestbooks` returns sorted entries | P0 |
| T-008 | FR-GB-01 | — | Integration | `GET /api/guestbooks` returns 500 on Notion failure | P1 |
| T-009 | FR-GB-02 | AC-US02-01 | Integration | `POST /api/guestbooks` creates entry on valid input | P0 |
| T-010 | FR-GB-02 | AC-US02-02 | Integration | `POST /api/guestbooks` sets 비공개 when isPrivate=true | P0 |
| T-011 | FR-GB-02 | AC-US02-03 | Integration | `POST /api/guestbooks` returns 400 on missing fields | P0 |
| T-012 | FR-GB-02 | — | Integration | `POST /api/guestbooks` returns 500 on Notion failure | P1 |
| T-013 | FR-GB-03 | AC-US03-01 | Integration | `POST /api/alarm` sends email with valid payload | P1 |
| T-014 | FR-GB-03 | — | Integration | `POST /api/alarm` returns 400 on invalid input | P1 |
| T-015 | FR-GB-03 | AC-US03-02 | Integration | `POST /api/alarm` returns 500 on SMTP failure | P2 |
| T-016 | FR-GB-01 | AC-US01-02 | E2E | Private entries show placeholder text | P1 |
| T-017 | FR-GB-02 | AC-US02-04 | E2E | Loading spinner shown during submission | P2 |
| T-018 | FR-GB-02 | AC-US02-01 | E2E | List refreshes after successful submission | P1 |

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P0 | Must pass — blocks release |
| P1 | Should pass — important functionality |
| P2 | Nice to have — edge cases |

## Test File Structure

```
src/
├── entities/guestbook/
│   └── model/
│       └── index.test.ts          # T-001 ~ T-006 (unit)
├── entities/alarm/
│   └── model/
│       └── index.test.ts          # T-013 ~ T-015 (integration)
├── app/api/guestbooks/
│   └── route.test.ts              # T-007 ~ T-012 (integration)
├── app/api/alarm/
│   └── route.test.ts              # T-013 ~ T-015 (integration)
└── features/guestbook/
    └── ui/
        ├── guestbook-list.test.tsx  # T-016, T-018 (E2E)
        └── guestbook-form.test.tsx  # T-017, T-018 (E2E)
```

## Mocking Boundaries

| Test Type | Notion | Nodemailer | Network |
|-----------|--------|-----------|---------|
| Unit | — | — | — |
| Integration | MSW handler | vi.mock | — |
| E2E | MSW handler | MSW handler | MSW |

## Test-Requirement Traceability

| Requirement | User Story | Use Case | Test IDs | Coverage |
|-------------|-----------|----------|----------|----------|
| FR-GB-01 | US-01 | UC-GB-01 | T-001 ~ T-008, T-016 | Full |
| FR-GB-02 | US-02 | UC-GB-02 | T-009 ~ T-012, T-017, T-018 | Full |
| FR-GB-03 | US-03 | UC-GB-03 | T-013 ~ T-015 | Full |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | [Sequence Diagram](sequence-diagram.md) | [API Spec](api-spec.md) | **[Test Spec]**
