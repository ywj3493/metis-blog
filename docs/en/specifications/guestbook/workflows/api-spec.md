<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [sequence-diagram](sequence-diagram.md) | [test-spec](test-spec.md) -->

> [← Sequence Diagram](sequence-diagram.md) | [Test Spec →](test-spec.md)

# Guestbook Domain — API Specification

## API Basic Information

| Field | Value |
|-------|-------|
| Base URL | `/api` |
| Protocol | HTTPS |
| Auth | None (public) |
| Validation | Zod schema |
| Format | JSON |

## Endpoint Catalog

| Method | Path | Auth | Summary | Related UC |
|--------|------|------|---------|-----------|
| GET | `/api/guestbooks` | None | List all guestbook entries | UC-GB-01 |
| POST | `/api/guestbooks` | None | Create a new guestbook entry | UC-GB-02 |
| POST | `/api/alarm` | None | Send email notification | UC-GB-03 |

---

## GET /api/guestbooks

**Source**: `src/app/api/guestbooks/route.ts`

### Request

No body or query parameters.

### Response — 200 Success

```json
{
  "message": "게스트북을 성공적으로 가져왔습니다.",
  "data": [
    {
      "id": "<notion-page-id>",
      "properties": {
        "작성자": { "title": [{ "plain_text": "홍길동 님의 방명록" }] },
        "방명록": { "rich_text": [{ "plain_text": "안녕하세요!" }] },
        "남긴날짜": { "date": { "start": "2026-04-07T10:00:00.000Z" } },
        "상태": { "status": { "name": "공개" } }
      }
    }
  ]
}
```

### Response — 500 Error

```json
{
  "message": "게스트북 가져오기에 실패했습니다.",
  "error": "<error-details>"
}
```

### Example

```bash
curl -X GET https://blog.example.com/api/guestbooks
```

```typescript
const response = await fetch('/api/guestbooks');
const { data } = await response.json();
```

---

## POST /api/guestbooks

**Source**: `src/app/api/guestbooks/route.ts`

### Request

**Headers**:
| Name | Value |
|------|-------|
| `Content-Type` | `application/json` |

**Body Schema** (Zod):

```typescript
{
  name: string;       // required
  content: string;    // required
  isPrivate: boolean; // required
}
```

### Response — 200 Success

```json
{
  "message": "게스트북을 성공적으로 생성했습니다.",
  "data": {
    "id": "<notion-page-id>",
    "name": "홍길동",
    "content": "안녕하세요!",
    "isPrivate": false
  }
}
```

### Response — 400 Validation Error

```
이름, 내용을 입력 해주세요.
```

### Response — 500 Error

```json
{
  "message": "게스트북 생성에 실패했습니다.",
  "error": "<error-details>"
}
```

### Example

```bash
curl -X POST https://blog.example.com/api/guestbooks \
  -H "Content-Type: application/json" \
  -d '{"name":"홍길동","content":"안녕하세요!","isPrivate":false}'
```

```typescript
await fetch('/api/guestbooks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: '홍길동', content: '안녕하세요!', isPrivate: false }),
});
```

---

## POST /api/alarm

**Source**: `src/app/api/alarm/route.ts`

### Request

**Headers**:
| Name | Value |
|------|-------|
| `Content-Type` | `application/json` |

**Body Schema** (Zod):

```typescript
{
  from: string;     // sender name
  subject: string;  // email subject
  message: string;  // email body (HTML safe)
}
```

### Response — 200 Success

```json
{ "message": "메일을 성공적으로 보냈음" }
```

### Response — 400 Validation Error

```
보내는이, 제목, 내용은 문자열만 가능합니다.
```

### Response — 500 Error

```json
{ "message": "메일 전송에 실패함", "error": "<error-details>" }
```

### Example

```bash
curl -X POST https://blog.example.com/api/alarm \
  -H "Content-Type: application/json" \
  -d '{"from":"홍길동","subject":"새 방명록","message":"안녕하세요"}'
```

---

## Data Models

### Guestbook (domain)

```typescript
interface IGuestbook {
  id: string;
  name: string;
  content: string;
  date: string;     // YYYY-MM-DD
  status: string;   // "공개" | "비공개"
}
```

### EmailForm

```typescript
type EmailForm = {
  from: string;
  subject: string;
  message: string;
};
```

## Error Response Standard

| HTTP Status | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Use `data` field |
| 400 | Validation error | Show input error to user |
| 500 | Server/external error | Show generic error, retry possible |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | [Sequence Diagram](sequence-diagram.md) | **[API Spec]** | [Test Spec](test-spec.md)
