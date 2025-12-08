# Alarm Domain Use Cases (Backend)

This document describes the backend API use cases for the Alarm domain.

## UC-API-020: Send Email Notification

### Endpoint Details

| Property | Value |
|----------|-------|
| Method | `POST` |
| Path | `/api/alarm` |
| Auth | None (internal use) |
| Rate Limit | None (relies on Gmail limits) |

### Purpose

Send an email notification to the blog owner for various events (guestbook submissions, contact messages, etc.).

### Request

```typescript
// Method
POST

// Headers
Content-Type: application/json

// Body
{
  from: string;     // Sender identifier (email or name)
  subject: string;  // Email subject line
  message: string;  // Email body content (plain text or HTML)
}
```

### Validation Schema

```typescript
const bodySchema = z.object({
  from: z.string(),
  subject: z.string(),
  message: z.string(),
});
```

### Response

**Success (200)**:
```typescript
{
  message: "메일을 성공적으로 보냈음"
}
```

**Validation Error (400)**:
```typescript
"보내는이, 제목, 내용은 문자열만 가능합니다."
```

**Server Error (500)**:
```typescript
{
  message: "메일 전송에 실패함",
  error: Error
}
```

### Implementation

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return new Response("보내는이, 제목, 내용은 문자열만 가능합니다.", {
      status: 400,
    });
  }

  return sendEamil(body)
    .then(() => {
      return new Response(
        JSON.stringify({ message: "메일을 성공적으로 보냈음" }),
        { status: 200 }
      );
    })
    .catch((error) => {
      return new Response(
        JSON.stringify({ message: "메일 전송에 실패함", error }),
        { status: 500 }
      );
    });
}
```

### Dependencies

**Service Function**: `sendEmail()`

```typescript
export async function sendEamil({ from, subject, message }: EmailForm) {
  const mailData = {
    to: process.env.AUTH_USER,
    subject: `[BLOG] ${subject}`,
    from,
    html: `
      <h1>${subject}</h1>
      <div>${message}</div>
      <br />
      <p>보낸사람: ${from}</p>
    `,
  };

  return transporter.sendMail(mailData);
}
```

**SMTP Transporter**:

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});
```

---

## Usage Patterns

### Pattern 1: Guestbook Notification

**Caller**: `GuestbookForm` component

**Trigger**: After successful guestbook submission

**Example**:
```typescript
// In GuestbookForm.onSubmit()
const guestbookResponse = await fetch('/api/guestbooks', {
  method: 'POST',
  body: JSON.stringify(formData),
});

if (guestbookResponse.ok) {
  // Fire-and-forget notification
  fetch('/api/alarm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'guestbook@blog.com',
      subject: `새로운 방명록: ${formData.name}`,
      message: `
        이름: ${formData.name}
        내용: ${formData.content}
        공개여부: ${formData.isPrivate ? '비공개' : '공개'}
      `,
    }),
  }); // Don't await - fire and forget
}
```

### Pattern 2: Contact Form Notification (Future)

**Caller**: `ContactForm` component (not yet implemented)

**Trigger**: After contact form submission

**Example**:
```typescript
// Future implementation
fetch('/api/alarm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: contactData.email,
    subject: `연락 문의: ${contactData.subject}`,
    message: contactData.message,
  }),
});
```

---

## Error Handling

### Validation Errors

| Field | Error Condition | Response |
|-------|-----------------|----------|
| from | Missing or not a string | 400 |
| subject | Missing or not a string | 400 |
| message | Missing or not a string | 400 |

### Server Errors

| Error Type | Cause | Response |
|------------|-------|----------|
| Auth failure | Invalid `AUTH_PASS` | 500 |
| Connection timeout | Network issues | 500 |
| Rate limit | Gmail daily limit exceeded | 500 |
| Invalid recipient | Incorrect `AUTH_USER` | 500 |

---

## Security Considerations

### Input Validation

- All fields validated as strings via Zod
- No specific length limits (Gmail handles)
- HTML in message is allowed (for formatting)

### Credential Protection

- SMTP credentials in environment variables
- App password instead of regular Gmail password
- Credentials never logged or returned in responses

### Access Control

- Endpoint is publicly accessible
- Relies on fire-and-forget pattern from internal callers
- Consider adding rate limiting for production

### Privacy

- Email content not stored in application
- Only error information may be logged
- Recipient is always the blog owner (not configurable via request)

---

## Testing

### Unit Test Scenarios

```typescript
describe("POST /api/alarm", () => {
  it("should send email with valid data", async () => {
    // Mock transporter.sendMail
    // Assert 200 status
    // Assert sendMail called with correct params
  });

  it("should reject missing from field", async () => {
    // POST without from
    // Assert 400 status
    // Assert error message
  });

  it("should reject missing subject field", async () => {
    // POST without subject
    // Assert 400 status
  });

  it("should reject missing message field", async () => {
    // POST without message
    // Assert 400 status
  });

  it("should handle SMTP failure", async () => {
    // Mock transporter.sendMail to reject
    // Assert 500 status
    // Assert error message
  });
});
```

### Integration Test Scenarios

```typescript
describe("Alarm Integration", () => {
  it("should deliver email to Gmail", async () => {
    // Real SMTP call (requires valid credentials)
    // Check inbox for test email
    // Clean up after test
  });
});
```

---

## Monitoring

### Recommended Metrics

| Metric | Description |
|--------|-------------|
| `alarm_requests_total` | Total notification requests |
| `alarm_success_total` | Successful deliveries |
| `alarm_failures_total` | Failed deliveries |
| `alarm_latency_ms` | Request processing time |

### Logging

```typescript
// Current implementation (implicit)
// Errors are returned in response, not explicitly logged

// Recommended addition
console.error("Alarm error:", error);
```

### Alerting

| Condition | Severity | Action |
|-----------|----------|--------|
| Multiple consecutive failures | High | Check SMTP credentials |
| Latency > 5 seconds | Medium | Check network/Gmail status |
| Error rate > 10% | High | Investigate root cause |

---

## Rate Limits

### Gmail Limits

| Limit Type | Value | Notes |
|------------|-------|-------|
| Daily sending limit | 500 emails | Free Gmail account |
| Per minute | ~20 emails | Approximate |
| Recipient limit | 500/day | Same as sending |

### Considerations

- Current blog traffic unlikely to hit limits
- No application-level rate limiting
- Consider implementing if traffic increases

---

## Future Enhancements

| Enhancement | Description | Priority |
|-------------|-------------|----------|
| Retry mechanism | Retry failed emails | Medium |
| Queue system | Decouple sending from request | Medium |
| Multiple providers | Failover to backup SMTP | Low |
| Template system | Configurable email templates | Low |
| Delivery tracking | Track open/click rates | Low |
