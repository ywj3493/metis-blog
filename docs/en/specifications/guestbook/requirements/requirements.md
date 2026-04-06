<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- Tech Stack: Next.js 14, TypeScript, Notion API, Zod, Nodemailer -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [User Stories →](user-stories.md)

# Guestbook Domain — Requirements

## System Overview

The Guestbook domain handles guest message CRUD operations via Notion database, form submission with validation, privacy controls, and email notifications to the blog owner when new entries are created. The Alarm (email) subsystem is included in this domain.

## Functional Requirements

### FR-GB-01: View Guestbook Entries

| Field | Value |
|-------|-------|
| ID | FR-GB-01 |
| Priority | High |
| Description | Display all guestbook entries sorted by date descending |

**Acceptance Criteria**:
- Entries fetched from Notion database via `GET /api/guestbooks`
- Sorted by "남긴날짜" (date) descending
- Public entries show name, date, and content
- Private entries show placeholder message "비공개 방명록 입니다."

### FR-GB-02: Create Guestbook Entry

| Field | Value |
|-------|-------|
| ID | FR-GB-02 |
| Priority | High |
| Description | Submit a new guestbook entry with name, content, and privacy option |

**Acceptance Criteria**:
- Form fields: name (required), content (required), isPrivate (boolean)
- Input validated via Zod schema on API route
- Entry created in Notion database via `POST /api/guestbooks`
- Status set to "공개" or "비공개" based on isPrivate flag
- Form resets and list refreshes on success
- Loading spinner shown during submission

### FR-GB-03: Email Notification on New Entry

| Field | Value |
|-------|-------|
| ID | FR-GB-03 |
| Priority | Medium |
| Description | Send email notification to blog owner when a new guestbook entry is created |

**Acceptance Criteria**:
- After successful guestbook creation, `POST /api/alarm` is called
- Email sent via Gmail SMTP (Nodemailer) to `AUTH_USER`
- Email contains: sender name, subject, guestbook content as HTML
- Email failure does not block guestbook creation (fire-and-forget)

## Non-Functional Requirements

### NFR-GB-01: Validation

- Zod schema validation on API route for all inputs
- Name and content are required strings
- isPrivate is required boolean

### NFR-GB-02: Security

- No authentication required (public guestbook)
- Private entries are server-side filtered by status

## Constraints

| Type | Constraint |
|------|-----------|
| Technical | Notion database properties: 작성자, 방명록, 남긴날짜, 상태 |
| Technical | Gmail SMTP requires app password (not regular password) |
| Architecture | `src/entities/guestbook/` + `src/entities/alarm/` + `src/features/guestbook/` |

## Requirements Traceability

| Requirement | User Stories | Use Cases |
|-------------|-------------|-----------|
| FR-GB-01 | US-01 | UC-GB-01 |
| FR-GB-02 | US-02 | UC-GB-02 |
| FR-GB-03 | US-03 | UC-GB-03 |

> **All Documents**
> **[Requirements]** | [User Stories](user-stories.md) | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [API Spec](../workflows/api-spec.md) | [Test Spec](../workflows/test-spec.md)
