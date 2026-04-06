<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [user-stories](../requirements/user-stories.md) | [sequence-diagram](sequence-diagram.md) -->

> [← User Stories](../requirements/user-stories.md) | [Sequence Diagram →](sequence-diagram.md)

# Guestbook Domain — Use Cases

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Reader | Primary | Views and creates guestbook entries |
| Blog Owner | Primary | Receives email notifications |
| Notion API | Secondary | Stores guestbook data |
| Gmail SMTP | Secondary | Sends email notifications |

## UC-GB-01: View Guestbook Entries

| Field | Value |
|-------|-------|
| ID | UC-GB-01 |
| Actors | Reader, Notion API |
| Related Requirements | FR-GB-01 |

### Main Flow

1. Reader navigates to `/guestbooks`
2. `GuestbookList` component mounts, calls `getGuestbooks()` (client-side fetch)
3. `GET /api/guestbooks` queries Notion database sorted by 남긴날짜 desc
4. Response mapped to `Guestbook` domain models via `Guestbook.create()`
5. Each entry rendered as `GuestbookCard`
6. Private entries show placeholder text

### Alternative Flows
- **AF-01**: Notion API failure → 500 response, error state shown

## UC-GB-02: Create Guestbook Entry

| Field | Value |
|-------|-------|
| ID | UC-GB-02 |
| Actors | Reader, Notion API |
| Related Requirements | FR-GB-02 |

### Main Flow

1. Reader fills in name, content, and optionally checks isPrivate
2. Reader submits form
3. `GuestbookForm` calls `createGuestbook()` → `POST /api/guestbooks`
4. API validates input via Zod schema
5. `postNotionGuestbook()` creates page in Notion database
6. API returns 200 with created entry
7. Form resets, `refetch()` called to reload list

### Alternative Flows
- **AF-01**: Invalid input (missing name/content) → 400 response
- **AF-02**: Notion API failure → 500 response, form shows error

## UC-GB-03: Send Email Notification

| Field | Value |
|-------|-------|
| ID | UC-GB-03 |
| Actors | Blog Owner, Gmail SMTP |
| Related Requirements | FR-GB-03 |

### Main Flow

1. After successful guestbook creation (UC-GB-02 step 6)
2. `GuestbookForm` calls `POST /api/alarm` with sender name, subject, and message
3. API validates input via Zod schema
4. `sendEmail()` sends via Gmail SMTP (Nodemailer)
5. Email delivered to `AUTH_USER`

### Alternative Flows
- **AF-01**: Email validation fails → 400 response (but guestbook already saved)
- **AF-02**: SMTP failure → 500 response (guestbook already saved, no rollback)

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | **[Use Cases]** | [Sequence Diagram](sequence-diagram.md) | [API Spec](api-spec.md) | [Test Spec](test-spec.md)
