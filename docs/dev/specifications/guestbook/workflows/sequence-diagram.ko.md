# Guestbook 도메인 시퀀스 다이어그램

이 문서는 Guestbook 도메인의 모든 백엔드 워크플로우에 대한 상세 시퀀스 다이어그램을 포함합니다.

## 1. 방명록 항목 제출

### 개요

유효성 검증과 선택적 이메일 알림을 포함한 새로운 방명록 항목을 제출합니다.

### 액터

- **Client**: 브라우저 UI (GuestbookForm)
- **API Route**: `/api/guestbooks`
- **Repository**: Notion 클라이언트 래퍼
- **Alarm API**: 이메일 알림 서비스
- **Notion**: 외부 Notion API

### 시퀀스

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

### 요청/응답 스키마

**요청**:
```typescript
POST /api/guestbooks
Content-Type: application/json

{
  name: string;      // 작성자 이름
  content: string;   // 메시지 내용
  isPrivate: boolean; // 공개 여부 플래그
}
```

**성공 응답** (200):
```typescript
{
  message: "게스트북을 성공적으로 생성했습니다.",
  data: {
    id: string;        // Notion 페이지 ID
    name: string;
    content: string;
    isPrivate: boolean;
  }
}
```

**유효성 검증 오류 응답** (400):
```typescript
"이름, 내용을 입력 해주세요."
```

**서버 오류 응답** (500):
```typescript
{
  message: "게스트북 생성에 실패했습니다.",
  error: Error
}
```

### Notion 페이지 생성

```typescript
// Notion에 저장되는 데이터
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

## 2. 방명록 항목 조회

### 개요

Notion 데이터베이스에서 모든 방명록 항목을 조회합니다.

### 액터

- **Client**: 브라우저 UI (GuestbookList)
- **API Route**: `/api/guestbooks`
- **Repository**: Notion 클라이언트 래퍼
- **Notion**: 외부 Notion API

### 시퀀스

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

### 요청/응답 스키마

**요청**:
```typescript
GET /api/guestbooks
```

**성공 응답** (200):
```typescript
{
  message: "게스트북을 성공적으로 가져왔습니다.",
  data: DatabaseObjectResponse[]  // Raw Notion 데이터
}
```

**오류 응답** (500):
```typescript
{
  message: "게스트북 가져오기에 실패했습니다.",
  error: Error
}
```

### Notion 쿼리

```typescript
await notion.databases.query({
  database_id: GUESTBOOK_DATABASE_ID,
  sorts: [
    {
      property: "남긴날짜",
      direction: "descending"
    }
  ]
  // 필터 없음 - 모든 항목 반환
  // 클라이언트 사이드에서 공개 항목 필터링
});
```

---

## 3. 이메일 알림 플로우

### 개요

방명록 제출 후 블로그 소유자에게 이메일 알림을 전송합니다.

### 액터

- **Client**: GuestbookForm (성공적인 제출 후)
- **Alarm API**: `/api/alarm`
- **Nodemailer**: 이메일 라이브러리
- **SMTP**: Gmail SMTP 서버

### 시퀀스

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

### 알림 페이로드

```typescript
// 제출 후 GuestbookForm에서 전송
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

## 4. 전체 제출 워크플로우

### 개요

사용자 제출부터 알림까지의 엔드투엔드 플로우입니다.

### 시퀀스

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

## 오류 처리 매트릭스

| 플로우 | 오류 유형 | HTTP 상태 | 복구 방법 |
|--------|----------|-----------|----------|
| 제출 | 유효성 검증 실패 | 400 | 필드 오류 표시 |
| 제출 | Notion API 오류 | 500 | 제출 재시도 |
| 조회 | Notion API 오류 | 500 | 재시도 버튼 |
| 알림 | 이메일 실패 | 500 | 오류 로깅 (논블로킹) |

---

## 데이터 변환

### Notion 응답에서 도메인 모델로

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

### 속성 추출

```typescript
// Guestbook.create() 내부
if (isGuestbookDatabaseResponse(data)) {
  const id = data.id;
  const name = data.properties.작성자.title[0].plain_text;
  const content = data.properties.방명록.rich_text[0].plain_text;
  const date = data.properties.남긴날짜.date.start.split("T")[0];
  const status = data.properties.상태.status.name;

  return new Guestbook({ id, name, content, date, status });
}
```
