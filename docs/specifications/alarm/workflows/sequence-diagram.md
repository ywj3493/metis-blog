# Alarm Domain Sequence Diagrams

This document contains detailed sequence diagrams for all backend workflows in the Alarm domain.

## 1. Send Email Notification

### Overview

Process a notification request and deliver email via Gmail SMTP.

### Actors

- **Client**: Calling feature (e.g., Guestbook API)
- **API Route**: `/api/alarm`
- **Service**: Email service (`sendEmail`)
- **Nodemailer**: SMTP client library
- **Gmail**: External SMTP server

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant A as /api/alarm
    participant V as Zod Validator
    participant S as sendEmail()
    participant NM as Nodemailer
    participant G as Gmail SMTP

    C->>A: POST { from, subject, message }

    A->>V: safeParse(body)

    alt Validation fails
        V-->>A: Error (missing/invalid fields)
        A-->>C: 400 "보내는이, 제목, 내용은 문자열만 가능합니다."
    else Validation passes
        V-->>A: { success: true, data }

        A->>S: sendEmail({ from, subject, message })

        S->>S: Compose mailData
        Note right of S: to: AUTH_USER<br/>subject: [BLOG] + subject<br/>html: formatted template

        S->>NM: transporter.sendMail(mailData)
        NM->>G: SMTP connection (port 465, SSL)

        alt SMTP success
            G-->>NM: 250 OK
            NM-->>S: Resolve
            S-->>A: Success
            A-->>C: 200 { message: "메일을 성공적으로 보냈음" }
        else SMTP failure
            G-->>NM: Error (auth, network, etc.)
            NM-->>S: Reject
            S-->>A: Error
            A-->>C: 500 { message: "메일 전송에 실패함", error }
        end
    end
```

### Request/Response Schema

**Request**:
```typescript
POST /api/alarm
Content-Type: application/json

{
  from: string;     // Sender identifier
  subject: string;  // Email subject
  message: string;  // Email body content
}
```

**Success Response** (200):
```typescript
{
  message: "메일을 성공적으로 보냈음"
}
```

**Validation Error Response** (400):
```typescript
"보내는이, 제목, 내용은 문자열만 가능합니다."
```

**Server Error Response** (500):
```typescript
{
  message: "메일 전송에 실패함",
  error: Error
}
```

---

## 2. Guestbook Notification Flow

### Overview

Backend flow from guestbook API to owner notification (triggered after successful guestbook submission).

### Actors

- **Guestbook API**: `/api/guestbooks` (caller)
- **Alarm API**: `/api/alarm`
- **Gmail**: SMTP server
- **Owner**: Email recipient

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant GA as /api/guestbooks
    participant AA as /api/alarm
    participant S as Gmail SMTP
    participant O as Owner

    Note over GA: After successful Notion entry creation

    GA->>AA: POST { from, subject, message }
    Note right of GA: Fire-and-forget call

    AA->>AA: Validate request (Zod)
    AA->>AA: Compose email

    AA->>S: sendMail()
    S-->>AA: 250 OK

    AA-->>GA: 200 Success (ignored)

    S->>O: Email delivery
    Note right of O: Receives notification<br/>in inbox
```

### Notification Payload

```typescript
// Constructed by Guestbook API
{
  from: "guestbook@blog.com",
  subject: `새로운 방명록: ${authorName}`,
  message: `
    이름: ${authorName}
    내용: ${content}
    공개여부: ${isPrivate ? "비공개" : "공개"}
  `
}
```

---

## 3. SMTP Connection Details

### Overview

Internal details of SMTP handshake and email delivery.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant NM as Nodemailer
    participant DNS as DNS Server
    participant G as Gmail SMTP

    NM->>DNS: Resolve smtp.gmail.com
    DNS-->>NM: IP address

    NM->>G: TCP connection (port 465)
    G-->>NM: 220 Service ready

    NM->>G: EHLO client
    G-->>NM: 250 Extensions list

    NM->>G: AUTH LOGIN
    Note right of NM: AUTH_USER<br/>AUTH_PASS (app password)
    G-->>NM: 235 Authentication successful

    NM->>G: MAIL FROM:<from>
    G-->>NM: 250 OK

    NM->>G: RCPT TO:<AUTH_USER>
    G-->>NM: 250 OK

    NM->>G: DATA
    G-->>NM: 354 Start mail input

    NM->>G: Email content + headers
    NM->>G: . (end of data)
    G-->>NM: 250 OK: queued

    NM->>G: QUIT
    G-->>NM: 221 Bye
```

### SMTP Configuration

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,  // Use SSL
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});
```

---

## 4. Error Handling Flow

### Overview

How different error scenarios are handled.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant A as /api/alarm
    participant S as sendEmail()
    participant G as Gmail SMTP

    rect rgb(255, 220, 220)
        Note over C,G: Scenario 1: Validation Error
        C->>A: POST { from: "", subject, message }
        A->>A: safeParse fails
        A-->>C: 400 Bad Request
    end

    rect rgb(255, 240, 200)
        Note over C,G: Scenario 2: Auth Error
        C->>A: POST { from, subject, message }
        A->>S: sendEmail()
        S->>G: AUTH LOGIN (invalid credentials)
        G-->>S: 535 Authentication failed
        S-->>A: Error
        A-->>C: 500 "메일 전송에 실패함"
    end

    rect rgb(255, 200, 200)
        Note over C,G: Scenario 3: Network Error
        C->>A: POST { from, subject, message }
        A->>S: sendEmail()
        S->>G: TCP connect
        G--xS: Connection timeout
        S-->>A: Error
        A-->>C: 500 "메일 전송에 실패함"
    end

    rect rgb(200, 255, 200)
        Note over C,G: Scenario 4: Success
        C->>A: POST { from, subject, message }
        A->>S: sendEmail()
        S->>G: Send email
        G-->>S: 250 OK
        S-->>A: Success
        A-->>C: 200 { message: "메일을 성공적으로 보냈음" }
    end
```

---

## 5. Email Template Generation

### Overview

How email content is composed from request data.

### Data Flow

```mermaid
flowchart TD
    REQ[Request Body] --> COMPOSE[Compose mailData]
    ENV[Environment Variables] --> COMPOSE

    subgraph "Request Fields"
        REQ --> FROM[from]
        REQ --> SUBJ[subject]
        REQ --> MSG[message]
    end

    subgraph "Environment"
        ENV --> USER[AUTH_USER]
    end

    subgraph "Mail Composition"
        COMPOSE --> TO[to: AUTH_USER]
        COMPOSE --> SUBJECT2[subject: BLOG + subject]
        COMPOSE --> HTML[html: formatted template]
    end

    TO --> MAIL[Final mailData]
    SUBJECT2 --> MAIL
    HTML --> MAIL
    FROM --> MAIL
```

### Template Code

```typescript
const mailData = {
  to: process.env.AUTH_USER,        // Blog owner
  subject: `[BLOG] ${subject}`,     // Prefixed for filtering
  from,                              // Sender identifier
  html: `
    <h1>${subject}</h1>
    <div>${message}</div>
    <br />
    <p>보낸사람: ${from}</p>
  `,
};
```

---

## Error Handling Matrix

| Scenario | Error Source | HTTP Status | User Impact | Recovery |
|----------|-------------|-------------|-------------|----------|
| Missing fields | Zod validation | 400 | None (caller handles) | Fix request |
| Invalid types | Zod validation | 400 | None (caller handles) | Fix request |
| Auth failure | Gmail SMTP | 500 | No notification | Fix AUTH_PASS |
| Network timeout | Nodemailer | 500 | No notification | Retry (not auto) |
| Rate limit | Gmail | 500 | Delayed notification | Wait & retry |
| Invalid recipient | Gmail | 500 | No notification | Fix AUTH_USER |

---

## Performance Characteristics

### Timing Breakdown

| Phase | Typical Duration | Notes |
|-------|------------------|-------|
| Validation | < 1ms | Synchronous |
| SMTP connection | 100-500ms | DNS + TCP + TLS |
| Authentication | 50-100ms | SMTP handshake |
| Email transmission | 50-200ms | Depends on size |
| **Total** | **200-800ms** | Normal conditions |

### Bottlenecks

| Bottleneck | Impact | Mitigation |
|------------|--------|------------|
| Cold SMTP connection | First email slower | Persistent connection (future) |
| Gmail rate limits | 500 emails/day | Batch or upgrade account |
| Network latency | Variable timing | Async pattern (current) |
