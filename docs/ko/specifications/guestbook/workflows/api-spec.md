<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [sequence-diagram](sequence-diagram.md) | [test-spec](test-spec.md) -->

> [← 시퀀스 다이어그램](sequence-diagram.md) | [테스트 명세 →](test-spec.md)

# Guestbook 도메인 — API 명세

## API 기본 정보

| 항목 | 값 |
|------|---|
| Base URL | `/api` |
| 프로토콜 | HTTPS |
| 인증 | 없음 (공개) |
| 검증 | Zod 스키마 |
| 포맷 | JSON |

## 엔드포인트 목록

| 메서드 | 경로 | 인증 | 설명 | 관련 UC |
|--------|------|------|------|--------|
| GET | `/api/guestbooks` | 없음 | 모든 방명록 항목 조회 | UC-GB-01 |
| POST | `/api/guestbooks` | 없음 | 새 방명록 항목 생성 | UC-GB-02 |
| POST | `/api/alarm` | 없음 | 이메일 알림 전송 | UC-GB-03 |

---

## GET /api/guestbooks

**소스**: `src/app/api/guestbooks/route.ts`

### 요청

본문 또는 쿼리 파라미터 없음.

### 응답 — 200 성공

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

### 응답 — 500 에러

```json
{
  "message": "게스트북 가져오기에 실패했습니다.",
  "error": "<error-details>"
}
```

### 예시

```bash
curl -X GET https://blog.example.com/api/guestbooks
```

```typescript
const response = await fetch('/api/guestbooks');
const { data } = await response.json();
```

---

## POST /api/guestbooks

**소스**: `src/app/api/guestbooks/route.ts`

### 요청

**헤더**:
| 이름 | 값 |
|------|---|
| `Content-Type` | `application/json` |

**바디 스키마** (Zod):

```typescript
{
  name: string;       // 필수
  content: string;    // 필수
  isPrivate: boolean; // 필수
}
```

### 응답 — 200 성공

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

### 응답 — 400 검증 에러

```
이름, 내용을 입력 해주세요.
```

### 응답 — 500 에러

```json
{
  "message": "게스트북 생성에 실패했습니다.",
  "error": "<error-details>"
}
```

### 예시

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

**소스**: `src/app/api/alarm/route.ts`

### 요청

**헤더**:
| 이름 | 값 |
|------|---|
| `Content-Type` | `application/json` |

**바디 스키마** (Zod):

```typescript
{
  from: string;     // 보낸 사람 이름
  subject: string;  // 이메일 제목
  message: string;  // 이메일 본문 (HTML safe)
}
```

### 응답 — 200 성공

```json
{ "message": "메일을 성공적으로 보냈음" }
```

### 응답 — 400 검증 에러

```
보내는이, 제목, 내용은 문자열만 가능합니다.
```

### 응답 — 500 에러

```json
{ "message": "메일 전송에 실패함", "error": "<error-details>" }
```

### 예시

```bash
curl -X POST https://blog.example.com/api/alarm \
  -H "Content-Type: application/json" \
  -d '{"from":"홍길동","subject":"새 방명록","message":"안녕하세요"}'
```

---

## 데이터 모델

### Guestbook (도메인)

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

## 에러 응답 표준

| HTTP 상태 | 의미 | 조치 |
|----------|------|------|
| 200 | 성공 | `data` 필드 사용 |
| 400 | 검증 에러 | 사용자에게 입력 에러 표시 |
| 500 | 서버/외부 에러 | 일반 에러 표시, 재시도 가능 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | [시퀀스 다이어그램](sequence-diagram.md) | **[API 명세]** | [테스트 명세](test-spec.md)
