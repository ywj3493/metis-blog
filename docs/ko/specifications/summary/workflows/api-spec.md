<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [sequence-diagram](sequence-diagram.md) | [test-spec](test-spec.md) -->

> [← 시퀀스 다이어그램](sequence-diagram.md) | [테스트 명세 →](test-spec.md)

# Summary 도메인 — API 명세

## API 기본 정보

| 항목 | 값 |
|------|---|
| Base URL | `/api` |
| 프로토콜 | HTTPS |
| 인증 | 없음 (프로덕션에서 추가 고려) |
| 포맷 | JSON |

## 엔드포인트 목록

| 메서드 | 경로 | 인증 | 설명 | 관련 UC |
|--------|------|------|------|--------|
| PATCH | `/api/posts/[postId]/summary` | 없음 | 포스트의 AI 요약 생성 | UC-SUMMARY-01 |

---

## PATCH /api/posts/[postId]/summary

**소스**: `src/app/api/posts/[postId]/summary/route.ts`

### 요청

**경로 파라미터**:
| 이름 | 타입 | 설명 |
|------|------|------|
| `postId` | string | 포스트의 Notion 페이지 ID |

본문 또는 쿼리 파라미터 없음.

### 응답 — 200 성공

```json
{
  "success": true,
  "summary": "이 글은 Next.js 14의 App Router 도입 사례를 다룹니다. ISR과 캐싱 전략을 통해 정적 사이트와 동적 API의 균형을 보여줍니다.",
  "message": "AI 요약이 성공적으로 생성되었습니다."
}
```

### 응답 — 404 Not Found

```json
{ "success": false, "error": "포스트를 찾을 수 없습니다." }
```

트리거: Notion `APIErrorCode.ObjectNotFound`

### 응답 — 403 Forbidden

```json
{ "success": false, "error": "Notion API 권한이 부족합니다." }
```

트리거: Notion `APIErrorCode.Unauthorized`

### 응답 — 429 Rate Limited

```json
{ "success": false, "error": "요청 제한에 걸렸습니다. 잠시 후 다시 시도해주세요." }
```

트리거: Notion `APIErrorCode.RateLimited`

### 응답 — 502 Bad Gateway

```json
{ "success": false, "error": "Notion API 요청에 실패했습니다." }
```

또는

```json
{ "success": false, "error": "요약 서비스에 문제가 발생했습니다." }
```

트리거: 기타 Notion 에러 또는 `SummaryServiceError`

### 응답 — 500 Internal Server Error

```json
{ "success": false, "error": "이미 요약이 생성된 포스트입니다." }
```

또는

```json
{ "success": false, "error": "<unknown error message>" }
```

### 예시

```bash
curl -X PATCH https://blog.example.com/api/posts/abc123/summary
```

```typescript
import { updatePostSummary } from '@/features/summary/api';

const result = await updatePostSummary('abc123');
// { success: true, summary: "...", message: "..." }
```

---

## 내부 함수

### `getSummary(postTitle, plainText): Promise<string>`

**소스**: `src/features/summary/api/get-summary.ts`

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `postTitle` | string | 포스트 제목 |
| `plainText` | string | Notion 단락에서 추출한 평문 콘텐츠 |

**반환**: 생성된 요약 문자열 (trimmed)

**Throws**: LLM 실패 시 `SummaryServiceError`

**동작**:
- `safeSlice(plainText, 8000)`로 콘텐츠 트런케이션 (워드 토큰 근사)
- `getOpenAIClient().chat.completions.create()` 호출:
  - `model`: `SUMMARY_MODEL_CONFIG.model`에서
  - `temperature: 0.2`
  - `max_tokens: 50`
  - `top_p: 0.9`
  - 시스템 프롬프트로 2문장, 정중한 한국어, 마크다운 없음, 과장 없음 강제

### `updatePostSummary(postId: string): Promise<{ success, summary, message }>`

**소스**: `src/features/summary/api/update-post-summary.ts`

`PATCH /api/posts/[postId]/summary`를 호출하는 클라이언트 사이드 fetcher. 200이 아닌 응답 시 API 에러 메시지와 함께 `Error` throw.

## 캐시 무효화

생성 성공 후 API 라우트가 다음 캐시를 무효화:

| 작업 | 대상 |
|------|------|
| `revalidateTag("posts")` | 모든 `getNotionPosts()` 캐시 항목 |
| `revalidatePath("/posts")` | 포스트 목록 페이지 |
| `revalidatePath("/")` | 홈 페이지 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | [시퀀스 다이어그램](sequence-diagram.md) | **[API 명세]** | [테스트 명세](test-spec.md)
