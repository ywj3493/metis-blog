# Guestbook Domain Use Cases (Backend)

This document describes the backend API use cases for the Guestbook domain.

## UC-API-010: Fetch Guestbook Entries

### Endpoint Details

| Property | Value |
|----------|-------|
| Method | `GET` |
| Path | `/api/guestbooks` |
| Auth | None (public) |
| Rate Limit | None |

### Purpose

Retrieve all guestbook entries from the Notion database for display.

### Request

```typescript
// Method
GET

// Headers
None required
```

### Response

**Success (200)**:
```typescript
{
  message: "게스트북을 성공적으로 가져왔습니다.",
  data: DatabaseObjectResponse[]  // Raw Notion response
}
```

**Error (500)**:
```typescript
{
  message: "게스트북 가져오기에 실패했습니다.",
  error: Error
}
```

### Implementation

```typescript
export async function GET() {
  return getNotionGuestbooks()
    .then((response) => {
      return new Response(
        JSON.stringify({
          message: "게스트북을 성공적으로 가져왔습니다.",
          data: response,
        }),
        { status: 200 }
      );
    })
    .catch((error) => {
      return new Response(
        JSON.stringify({
          message: "게스트북 가져오기에 실패했습니다.",
          error
        }),
        { status: 500 }
      );
    });
}
```

### Dependencies

**Repository Function**: `getNotionGuestbooks()`

```typescript
async function _getNotionGuestbooks() {
  const response = await notion.databases.query({
    database_id: notionGuestbookDatabaseId,
    sorts: [
      {
        property: "남긴날짜",
        direction: "descending",
      },
    ],
  });

  return response.results as DatabaseObjectResponse[];
}
```

### Notes

- Returns all entries (public and private)
- Client-side filtering should remove private entries
- No caching applied (fresh data each request)

---

## UC-API-011: Create Guestbook Entry

### Endpoint Details

| Property | Value |
|----------|-------|
| Method | `POST` |
| Path | `/api/guestbooks` |
| Auth | None (public) |
| Rate Limit | None |

### Purpose

Create a new guestbook entry in the Notion database.

### Request

```typescript
// Method
POST

// Headers
Content-Type: application/json

// Body
{
  name: string;       // Author name (required)
  content: string;    // Message content (required)
  isPrivate: boolean; // Visibility flag (required)
}
```

### Validation Schema

```typescript
const bodySchema = z.object({
  name: z.string({ required_error: "이름은 필수입니다." }),
  content: z.string({ required_error: "내용은 필수입니다." }),
  isPrivate: z.boolean(),
});
```

### Response

**Success (200)**:
```typescript
{
  message: "게스트북을 성공적으로 생성했습니다.",
  data: {
    id: string;        // Notion page ID
    name: string;      // Author name
    content: string;   // Message content
    isPrivate: boolean; // Visibility flag
  }
}
```

**Validation Error (400)**:
```typescript
"이름, 내용을 입력 해주세요."
```

**Server Error (500)**:
```typescript
{
  message: "게스트북 생성에 실패했습니다.",
  error: Error
}
```

### Implementation

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = bodySchema.safeParse(body);

  if (!parseResult.success) {
    return new Response("이름, 내용을 입력 해주세요.", {
      status: 400,
    });
  }

  return postNotionGuestbook(body)
    .then((response) => {
      return new Response(
        JSON.stringify({
          message: "게스트북을 성공적으로 생성했습니다.",
          data: response,
        }),
        { status: 200 }
      );
    })
    .catch((error) => {
      return new Response(
        JSON.stringify({
          message: "게스트북 생성에 실패했습니다.",
          error
        }),
        { status: 500 }
      );
    });
}
```

### Dependencies

**Repository Function**: `postNotionGuestbook()`

```typescript
async function _postNotionGuestbook({
  name,
  content,
  isPrivate,
}: GuestbookFormData) {
  const response = await notion.pages.create({
    parent: {
      database_id: notionGuestbookDatabaseId,
    },
    properties: {
      작성자: {
        title: [
          {
            text: {
              content: `${name} 님의 방명록`,
            },
          },
        ],
      },
      방명록: {
        rich_text: [
          {
            text: {
              content: content,
            },
          },
        ],
      },
      남긴날짜: {
        date: {
          start: new Date().toISOString(),
        },
      },
      상태: {
        status: {
          name: isPrivate ? "비공개" : "공개",
        },
      },
    },
  });

  return {
    id: response.id,
    name: name,
    content: content,
    isPrivate: isPrivate,
  };
}
```

### Notion Property Mapping

| Request Field | Notion Property | Transformation |
|---------------|-----------------|----------------|
| name | 작성자 (title) | `${name} 님의 방명록` |
| content | 방명록 (rich_text) | Direct mapping |
| - | 남긴날짜 (date) | Current ISO timestamp |
| isPrivate | 상태 (status) | `true` → "비공개", `false` → "공개" |

---

## Error Handling

### Validation Errors

| Field | Error Condition | Message |
|-------|-----------------|---------|
| name | Missing or empty | "이름은 필수입니다." |
| content | Missing or empty | "내용은 필수입니다." |
| isPrivate | Missing | Returns 400 (Zod validation) |

### Server Errors

| Error Type | Status | Response |
|------------|--------|----------|
| Notion API error | 500 | "게스트북 생성에 실패했습니다." |
| Notion API error | 500 | "게스트북 가져오기에 실패했습니다." |

---

## Security Considerations

### Input Sanitization

- Name and content are stored as-is in Notion
- Notion handles HTML escaping for display
- No executable code risk (plain text only)

### Spam Prevention

- Currently no rate limiting or CAPTCHA
- Consider adding for production:
  - Rate limiting per IP
  - CAPTCHA for submissions
  - Content length limits

### Privacy

- `isPrivate` flag controls visibility
- Private entries stored in Notion but not shown in public list
- Owner can see all entries in Notion dashboard

---

## Testing

### Unit Test Scenarios

```typescript
describe("GET /api/guestbooks", () => {
  it("should return all guestbook entries", async () => {
    // Mock Notion response
    // Assert 200 status
    // Assert data structure
  });

  it("should handle Notion API error", async () => {
    // Mock Notion error
    // Assert 500 status
    // Assert error message
  });
});

describe("POST /api/guestbooks", () => {
  it("should create entry with valid data", async () => {
    // Mock valid request body
    // Assert 200 status
    // Assert entry created
  });

  it("should reject missing name", async () => {
    // Mock request without name
    // Assert 400 status
    // Assert error message
  });

  it("should reject missing content", async () => {
    // Mock request without content
    // Assert 400 status
  });

  it("should handle private flag", async () => {
    // Mock request with isPrivate: true
    // Assert entry created with "비공개" status
  });
});
```

---

## Monitoring

### Recommended Metrics

| Metric | Description |
|--------|-------------|
| `guestbook_submissions_total` | Total submissions |
| `guestbook_submissions_private` | Private message count |
| `guestbook_errors_total` | Error count by type |
| `guestbook_fetch_duration` | List fetch latency |

### Logging

```typescript
// Current implementation logs errors
console.error("Guestbook error:", error);
```

### Alerting

| Condition | Severity | Action |
|-----------|----------|--------|
| Error rate > 10% | Warning | Check Notion API |
| Submission spike | Info | Potential spam |
