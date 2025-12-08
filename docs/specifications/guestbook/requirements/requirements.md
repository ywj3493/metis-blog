# Guestbook Domain Requirements

This document specifies the functional requirements for the Guestbook domain, which enables visitors to leave messages for the blog owner.

## Overview

The Guestbook domain provides an interactive communication channel between visitors and the blog owner. Visitors can leave public or private messages, which are stored in a Notion database. The system supports form validation, visibility control, and email notifications.

## Functional Requirements

### FR-GB-001: Guestbook Submission

**Description**: Allow visitors to submit messages through a form with validation.

**Acceptance Criteria**:
- Provide form fields: name (required), content (required), visibility toggle (public/private)
- Validate input using Zod schema before submission
- Display clear error messages for invalid input
- Show loading state during submission
- Display success confirmation after submission
- Reset form after successful submission
- Store submission in Notion guestbook database

**Form Validation Schema**:
```typescript
{
  name: z.string({ required_error: "이름은 필수입니다." }),
  content: z.string({ required_error: "내용은 필수입니다." }),
  isPrivate: z.boolean()
}
```

**API Endpoint**: `POST /api/guestbooks`

**Related Components**:
- `src/entities/guestbooks/ui/guestbook-form.tsx`
- `src/app/api/guestbooks/route.ts`

---

### FR-GB-002: Guestbook Display

**Description**: Display all public guestbook entries in a readable format.

**Acceptance Criteria**:
- Fetch all guestbook entries from Notion database
- Filter to show only public entries (status = "공개")
- Sort entries by date (newest first)
- Display entry metadata: author name, date, content
- Implement responsive card layout
- Handle empty state gracefully
- Support pagination or infinite scroll for many entries

**API Endpoint**: `GET /api/guestbooks`

**Related Components**:
- `src/features/guestbooks/ui/guestbook-list.tsx`
- `src/entities/guestbooks/ui/guestbook-card.tsx`

---

### FR-GB-003: Email Notification Trigger

**Description**: Trigger email notification when a new guestbook entry is submitted.

**Acceptance Criteria**:
- Send email notification after successful guestbook submission
- Include entry details in notification (author, content, visibility)
- Non-blocking execution (don't delay user response)
- Handle email failures gracefully (don't affect submission success)

**Integration**: Calls `/api/alarm` endpoint

**Related Components**:
- `src/features/guestbooks/ui/guestbook-list.tsx`
- `src/features/alarm/api/index.ts`

---

## Data Model

### Guestbook Entity

```typescript
interface IGuestbook {
  id: string;        // Notion page ID
  name: string;      // Author name (작성자)
  content: string;   // Message content (방명록)
  date: string;      // Submission date (남긴날짜)
  status: string;    // Visibility status (상태: "공개" | "비공개")
}
```

### Guestbook Form Data

```typescript
interface GuestbookFormData {
  name: string;
  content: string;
  isPrivate: boolean;
}
```

### Notion Property Mapping

| Domain Property | Notion Property (Korean) | Notion Type |
|-----------------|--------------------------|-------------|
| name | 작성자 | title |
| content | 방명록 | rich_text |
| date | 남긴날짜 | date |
| status | 상태 | status |

### Status Values

| Status | Korean | Visibility |
|--------|--------|------------|
| Public | 공개 | Visible to all visitors |
| Private | 비공개 | Visible only to blog owner (in Notion) |

---

## Non-Functional Requirements

### NFR-GB-001: Performance

- Form submission response < 3 seconds
- Guestbook list load < 2 seconds
- Email notification async (non-blocking)

### NFR-GB-002: Validation

- Client-side validation before API call
- Server-side validation with Zod schema
- Clear error messages in Korean

### NFR-GB-003: User Experience

- Loading indicators during async operations
- Success/error feedback messages
- Form auto-reset after successful submission
- Responsive design for all devices

### NFR-GB-004: Privacy

- Private messages not exposed in public API response
- Client-side filtering as additional layer
- Notification includes privacy status

---

## Dependencies

### External Services
- Notion API (read/write guestbook database)
- Email service (via `/api/alarm`)

### Internal Modules
- `src/entities/notion/model/index.ts` - Notion operations
- `src/features/alarm/api/index.ts` - Email notification

---

## Out of Scope

- User authentication for submissions
- Edit/delete functionality for visitors
- Threaded replies or conversations
- Rich text formatting in messages
- File attachments
- Spam filtering/CAPTCHA
