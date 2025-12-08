# Guestbook Domain Sequence Diagrams

This document contains detailed sequence diagrams for all backend workflows in the Guestbook domain.

## 1. Submit Guestbook Entry

### Overview

Submit a new guestbook entry with validation and optional email notification.

### Actors

- **Client**: Browser UI (GuestbookForm)
- **API Route**: `/api/guestbooks`
- **Repository**: Notion client wrapper
- **Alarm API**: Email notification service
- **Notion**: External Notion API

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant F as GuestbookForm
    participant V as Zod Validator
    participant A as /api/guestbooks
    participant R as Repository
    participant N as Notion API
    participant AL as /api/alarm
    participant S as Gmail SMTP

    U->>F: Fill form (name, content, isPrivate)
    U->>F: Click Submit

    F->>V: Client-side validation
    alt Validation fails
        V-->>F: Error
        F-->>U: Show error message
    else Validation passes
        F->>F: setIsSubmitting(true)
        F->>A: POST { name, content, isPrivate }

        A->>V: Server-side safeParse
        alt Server validation fails
            V-->>A: Error
            A-->>F: 400 Bad Request
            F-->>U: Show error
        else Server validation passes
            A->>R: postNotionGuestbook(formData)
            R->>N: pages.create()
            Note right of N: Create page in<br/>guestbook database

            N-->>R: Created page
            R-->>A: { id, name, content, isPrivate }
            A-->>F: 200 { message, data }

            F->>F: reset()
            F-->>U: Show success toast

            par Refresh list
                F->>F: refetchGuestbooks()
            and Send notification (async)
                F->>AL: POST notification
                AL->>S: sendMail()
                S-->>AL: Sent
            end
        end
    end
```

### Request/Response Schema

**Request**:
```typescript
POST /api/guestbooks
Content-Type: application/json

{
  name: string;      // Author name
  content: string;   // Message content
  isPrivate: boolean; // Visibility flag
}
```

**Success Response** (200):
```typescript
{
  message: "게스트북을 성공적으로 생성했습니다.",
  data: {
    id: string;        // Notion page ID
    name: string;
    content: string;
    isPrivate: boolean;
  }
}
```

**Validation Error Response** (400):
```typescript
"이름, 내용을 입력 해주세요."
```

**Server Error Response** (500):
```typescript
{
  message: "게스트북 생성에 실패했습니다.",
  error: Error
}
```

### Notion Page Creation

```typescript
// Data stored in Notion
await notion.pages.create({
  parent: { database_id: GUESTBOOK_DATABASE_ID },
  properties: {
    작성자: {
      title: [{ text: { content: `${name} 님의 방명록` } }]
    },
    방명록: {
      rich_text: [{ text: { content: content } }]
    },
    남긴날짜: {
      date: { start: new Date().toISOString() }
    },
    상태: {
      status: { name: isPrivate ? "비공개" : "공개" }
    }
  }
});
```

---

## 2. Fetch Guestbook Entries

### Overview

Fetch all guestbook entries from Notion database.

### Actors

- **Client**: Browser UI (GuestbookList)
- **API Route**: `/api/guestbooks`
- **Repository**: Notion client wrapper
- **Notion**: External Notion API

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant C as GuestbookList
    participant A as /api/guestbooks
    participant R as Repository
    participant N as Notion API
    participant M as Guestbook Model

    C->>C: Component mount
    C->>A: GET /api/guestbooks

    A->>R: getNotionGuestbooks()
    R->>N: databases.query()
    Note right of N: Sort by 남긴날짜 descending<br/>No filter (return all)
    N-->>R: QueryResponse

    R-->>A: DatabaseObjectResponse[]
    A-->>C: { message, data }

    C->>M: data.map(Guestbook.create)
    M-->>C: Guestbook[]

    C->>C: Filter isPublic === true
    C->>C: Sort by date descending
    C->>C: setGuestbooks(filtered)
    C-->>C: Render cards
```

### Request/Response Schema

**Request**:
```typescript
GET /api/guestbooks
```

**Success Response** (200):
```typescript
{
  message: "게스트북을 성공적으로 가져왔습니다.",
  data: DatabaseObjectResponse[]  // Raw Notion data
}
```

**Error Response** (500):
```typescript
{
  message: "게스트북 가져오기에 실패했습니다.",
  error: Error
}
```

### Notion Query

```typescript
await notion.databases.query({
  database_id: GUESTBOOK_DATABASE_ID,
  sorts: [
    {
      property: "남긴날짜",
      direction: "descending"
    }
  ]
  // No filter - all entries returned
  // Client-side filtering for public entries
});
```

---

## 3. Email Notification Flow

### Overview

Send email notification to blog owner after guestbook submission.

### Actors

- **Client**: GuestbookForm (after successful submission)
- **Alarm API**: `/api/alarm`
- **Nodemailer**: Email library
- **SMTP**: Gmail SMTP server

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant F as GuestbookForm
    participant AL as /api/alarm
    participant V as Zod Validator
    participant NM as Nodemailer
    participant S as Gmail SMTP

    Note over F: After successful guestbook submission
    F->>AL: POST { from, subject, message }
    Note right of F: Fire and forget<br/>(non-blocking)

    AL->>V: safeParse(body)
    alt Validation fails
        V-->>AL: Error
        AL-->>F: 400 Bad Request
    else Validation passes
        AL->>NM: sendMail(mailData)
        NM->>S: SMTP connection

        alt SMTP success
            S-->>NM: Email sent
            NM-->>AL: Success
            AL-->>F: 200 { message: "메일을 성공적으로 보냈음" }
        else SMTP failure
            S-->>NM: Error
            NM-->>AL: Error
            AL-->>F: 500 Error response
        end
    end
```

### Notification Payload

```typescript
// Sent from GuestbookForm after submission
{
  from: "guestbook@blog.com",
  subject: `새로운 방명록: ${formData.name}`,
  message: `
    이름: ${formData.name}
    내용: ${formData.content}
    공개여부: ${formData.isPrivate ? "비공개" : "공개"}
  `
}
```

---

## 4. Complete Submission Workflow

### Overview

End-to-end flow from user submission to notification.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant F as GuestbookForm
    participant GA as /api/guestbooks
    participant N as Notion
    participant AA as /api/alarm
    participant S as Gmail SMTP
    participant L as GuestbookList

    U->>F: Submit form
    F->>GA: POST guestbook

    GA->>N: Create page
    N-->>GA: Success
    GA-->>F: 200 Response

    F-->>U: Success toast
    F->>F: Reset form

    par Notification (async)
        F->>AA: Send notification
        AA->>S: Send email
        S-->>AA: Sent
        Note over AA: Owner notified
    and Refresh list
        F->>L: Trigger refetch
        L->>GA: GET guestbooks
        GA->>N: Query entries
        N-->>GA: All entries
        GA-->>L: Entry list
        L->>L: Filter public
        L-->>U: Updated list
    end
```

---

## Error Handling Matrix

| Flow | Error Type | HTTP Status | Recovery |
|------|-----------|-------------|----------|
| Submit | Validation failed | 400 | Show field errors |
| Submit | Notion API error | 500 | Retry submission |
| Fetch | Notion API error | 500 | Retry button |
| Notification | Email failed | 500 | Log error (non-blocking) |

---

## Data Transformation

### Notion Response to Domain Model

```mermaid
flowchart LR
    A[DatabaseObjectResponse] --> B[Guestbook.create]
    B --> C[Guestbook Instance]

    subgraph "Transformation"
        B --> D[Extract 작성자]
        B --> E[Extract 방명록]
        B --> F[Extract 남긴날짜]
        B --> G[Extract 상태]
        D --> H[name: string]
        E --> I[content: string]
        F --> J[date: string]
        G --> K[status: string]
        G --> L[isPublic: boolean]
    end
```

### Property Extraction

```typescript
// In Guestbook.create()
if (isGuestbookDatabaseResponse(data)) {
  const id = data.id;
  const name = data.properties.작성자.title[0].plain_text;
  const content = data.properties.방명록.rich_text[0].plain_text;
  const date = data.properties.남긴날짜.date.start.split("T")[0];
  const status = data.properties.상태.status.name;

  return new Guestbook({ id, name, content, date, status });
}
```
