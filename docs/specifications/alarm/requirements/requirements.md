# Alarm Domain Requirements

This document specifies the functional requirements for the Alarm domain, which handles email notification delivery for various blog events.

## Overview

The Alarm domain is a background service that sends email notifications to the blog owner when specific events occur. It currently supports notifications for guestbook submissions but is designed to be extensible for other event types.

## Functional Requirements

### FR-ALARM-001: Email Notification Service

**Description**: Provide a centralized email notification service that can be triggered by various blog events.

**Acceptance Criteria**:
- Accept notification requests via API endpoint
- Validate required fields (from, subject, message)
- Send email via Gmail SMTP
- Return success/failure status
- Process asynchronously (non-blocking to caller)

**Technical Details**:
- SMTP Host: `smtp.gmail.com`
- SMTP Port: `465` (SSL)
- Authentication: Gmail app password
- Recipient: Blog owner (configured via environment variable)

**API Endpoint**: `POST /api/alarm`

**Related Components**:
- `src/app/api/alarm/route.ts`
- `src/features/alarm/model/index.ts`

---

### FR-ALARM-002: Guestbook Notification Trigger

**Description**: Automatically notify the blog owner when a new guestbook entry is submitted.

**Acceptance Criteria**:
- Trigger notification after successful guestbook submission
- Include author name, message content, and visibility status
- Fire-and-forget pattern (don't block form submission)
- Handle notification failures gracefully (log but don't fail submission)

**Notification Content**:
| Field | Source |
|-------|--------|
| From | "guestbook@blog.com" (or configurable) |
| Subject | `새로운 방명록: ${authorName}` |
| Message | Author name, content, public/private status |

**Trigger Point**: `GuestbookForm.onSubmit()` after successful API response

**Related Components**:
- `src/features/guestbooks/ui/guestbook-form.tsx`

---

### FR-ALARM-003: Contact Form Notification (Future)

**Description**: Notify the blog owner when a contact form message is submitted.

**Status**: Not implemented (future enhancement)

**Acceptance Criteria**:
- Trigger notification on contact form submission
- Include sender email, subject, and message
- Support reply-to header for easy response

---

## Data Model

### EmailForm Type

```typescript
type EmailForm = {
  from: string;     // Sender identifier (email or name)
  subject: string;  // Email subject line
  message: string;  // Email body content (HTML supported)
};
```

### Email Template Structure

```typescript
// Generated email HTML
{
  to: process.env.AUTH_USER,    // Blog owner's email
  subject: `[BLOG] ${subject}`, // Prefixed for filtering
  from: from,
  html: `
    <h1>${subject}</h1>
    <div>${message}</div>
    <br />
    <p>보낸사람: ${from}</p>
  `
}
```

---

## Non-Functional Requirements

### NFR-ALARM-001: Reliability

- Email delivery should succeed > 99% of the time
- Failed deliveries should be logged for debugging
- No retry mechanism currently (fire-and-forget)

### NFR-ALARM-002: Performance

- Email sending should not block user interactions
- API response time < 5 seconds (typical SMTP handshake)
- Asynchronous processing from caller's perspective

### NFR-ALARM-003: Security

- SMTP credentials stored in environment variables
- Gmail app password (not regular password)
- No sensitive data in email subjects (for transit security)

### NFR-ALARM-004: Monitoring

- Log errors on email failure
- No current metrics collection
- Consider adding alerting for repeated failures

---

## Dependencies

### External Services

| Service | Purpose | Configuration |
|---------|---------|---------------|
| Gmail SMTP | Email delivery | `AUTH_USER`, `AUTH_PASS` |

### Internal Modules

| Module | Purpose |
|--------|---------|
| `nodemailer` | SMTP client library |
| `zod` | Request validation |

---

## Error Handling

### Validation Errors

| Error | HTTP Status | Response |
|-------|-------------|----------|
| Missing fields | 400 | "보내는이, 제목, 내용은 문자열만 가능합니다." |
| Invalid types | 400 | "보내는이, 제목, 내용은 문자열만 가능합니다." |

### Server Errors

| Error | HTTP Status | Response |
|-------|-------------|----------|
| SMTP connection failed | 500 | "메일 전송에 실패함" |
| Authentication failed | 500 | "메일 전송에 실패함" |
| Recipient rejected | 500 | "메일 전송에 실패함" |

---

## Environment Configuration

### Required Variables

```bash
# Gmail SMTP Authentication
AUTH_USER=your@gmail.com           # Gmail address (also used as recipient)
AUTH_PASS=xxxx xxxx xxxx xxxx      # Gmail app password (16 characters)
```

### Gmail App Password Setup

1. Enable 2-Step Verification on Gmail account
2. Navigate to Google Account → Security → App passwords
3. Generate new app password for "Mail"
4. Use generated password (with spaces) as `AUTH_PASS`

---

## Out of Scope

- Email queuing and retry mechanism
- Multiple recipient support
- Email templates management
- Delivery tracking/receipts
- Unsubscribe functionality
- Rate limiting
