# Guestbook 도메인 유즈케이스 (백엔드)

이 문서는 Guestbook 도메인의 백엔드 API 유즈케이스를 설명합니다.

## UC-API-010: 방명록 항목 조회

### 엔드포인트 상세

| 속성 | 값 |
|------|-----|
| 메소드 | `GET` |
| 경로 | `/api/guestbooks` |
| 인증 | 없음 (공개) |
| 속도 제한 | 없음 |

### 목적

표시를 위해 Notion 데이터베이스에서 모든 방명록 항목을 조회합니다.

### 요청

```typescript
// 메소드
GET

// 헤더
필수 없음
```

### 응답

**성공 (200)**:
```typescript
{
  message: "게스트북을 성공적으로 가져왔습니다.",
  data: DatabaseObjectResponse[]  // Raw Notion 응답
}
```

**오류 (500)**:
```typescript
{
  message: "게스트북 가져오기에 실패했습니다.",
  error: Error
}
```

### 구현

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

### 의존성

**Repository 함수**: `getNotionGuestbooks()`

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

### 참고사항

- 모든 항목 반환 (공개 및 비공개)
- 클라이언트 사이드 필터링으로 비공개 항목 제거 필요
- 캐싱 미적용 (매 요청마다 최신 데이터)

---

## UC-API-011: 방명록 항목 생성

### 엔드포인트 상세

| 속성 | 값 |
|------|-----|
| 메소드 | `POST` |
| 경로 | `/api/guestbooks` |
| 인증 | 없음 (공개) |
| 속도 제한 | 없음 |

### 목적

Notion 데이터베이스에 새로운 방명록 항목을 생성합니다.

### 요청

```typescript
// 메소드
POST

// 헤더
Content-Type: application/json

// 본문
{
  name: string;       // 작성자 이름 (필수)
  content: string;    // 메시지 내용 (필수)
  isPrivate: boolean; // 공개 여부 플래그 (필수)
}
```

### 유효성 검증 스키마

```typescript
const bodySchema = z.object({
  name: z.string({ required_error: "이름은 필수입니다." }),
  content: z.string({ required_error: "내용은 필수입니다." }),
  isPrivate: z.boolean(),
});
```

### 응답

**성공 (200)**:
```typescript
{
  message: "게스트북을 성공적으로 생성했습니다.",
  data: {
    id: string;        // Notion 페이지 ID
    name: string;      // 작성자 이름
    content: string;   // 메시지 내용
    isPrivate: boolean; // 공개 여부 플래그
  }
}
```

**유효성 검증 오류 (400)**:
```typescript
"이름, 내용을 입력 해주세요."
```

**서버 오류 (500)**:
```typescript
{
  message: "게스트북 생성에 실패했습니다.",
  error: Error
}
```

### 구현

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

### 의존성

**Repository 함수**: `postNotionGuestbook()`

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

### Notion 속성 매핑

| 요청 필드 | Notion 속성 | 변환 |
|----------|------------|------|
| name | 작성자 (title) | `${name} 님의 방명록` |
| content | 방명록 (rich_text) | 직접 매핑 |
| - | 남긴날짜 (date) | 현재 ISO 타임스탬프 |
| isPrivate | 상태 (status) | `true` → "비공개", `false` → "공개" |

---

## 오류 처리

### 유효성 검증 오류

| 필드 | 오류 조건 | 메시지 |
|-----|---------|--------|
| name | 누락 또는 빈 값 | "이름은 필수입니다." |
| content | 누락 또는 빈 값 | "내용은 필수입니다." |
| isPrivate | 누락 | 400 반환 (Zod 유효성 검증) |

### 서버 오류

| 오류 유형 | 상태 | 응답 |
|----------|------|------|
| Notion API 오류 | 500 | "게스트북 생성에 실패했습니다." |
| Notion API 오류 | 500 | "게스트북 가져오기에 실패했습니다." |

---

## 보안 고려사항

### 입력 정제

- 이름과 내용은 그대로 Notion에 저장됨
- Notion이 표시를 위한 HTML 이스케이핑 처리
- 실행 가능한 코드 위험 없음 (순수 텍스트만)

### 스팸 방지

- 현재 속도 제한 또는 CAPTCHA 없음
- 프로덕션을 위해 고려할 사항:
  - IP당 속도 제한
  - 제출 시 CAPTCHA
  - 콘텐츠 길이 제한

### 개인정보

- `isPrivate` 플래그가 가시성 제어
- 비공개 항목은 Notion에 저장되지만 공개 목록에 표시되지 않음
- 소유자는 Notion 대시보드에서 모든 항목 확인 가능

---

## 테스트

### 단위 테스트 시나리오

```typescript
describe("GET /api/guestbooks", () => {
  it("should return all guestbook entries", async () => {
    // Notion 응답 모킹
    // 200 상태 검증
    // 데이터 구조 검증
  });

  it("should handle Notion API error", async () => {
    // Notion 오류 모킹
    // 500 상태 검증
    // 오류 메시지 검증
  });
});

describe("POST /api/guestbooks", () => {
  it("should create entry with valid data", async () => {
    // 유효한 요청 본문 모킹
    // 200 상태 검증
    // 항목 생성 검증
  });

  it("should reject missing name", async () => {
    // 이름 없는 요청 모킹
    // 400 상태 검증
    // 오류 메시지 검증
  });

  it("should reject missing content", async () => {
    // 내용 없는 요청 모킹
    // 400 상태 검증
  });

  it("should handle private flag", async () => {
    // isPrivate: true 요청 모킹
    // "비공개" 상태로 항목 생성 검증
  });
});
```

---

## 모니터링

### 권장 메트릭

| 메트릭 | 설명 |
|--------|------|
| `guestbook_submissions_total` | 총 제출 수 |
| `guestbook_submissions_private` | 비공개 메시지 수 |
| `guestbook_errors_total` | 유형별 오류 수 |
| `guestbook_fetch_duration` | 목록 조회 지연 시간 |

### 로깅

```typescript
// 현재 구현에서 오류 로깅
console.error("Guestbook error:", error);
```

### 알림

| 조건 | 심각도 | 조치 |
|-----|--------|------|
| 오류율 > 10% | 경고 | Notion API 확인 |
| 제출 급증 | 정보 | 잠재적 스팸 |
