<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [user-stories](../requirements/user-stories.md) | [sequence-diagram](sequence-diagram.md) -->

> [← 유저 스토리](../requirements/user-stories.md) | [시퀀스 다이어그램 →](sequence-diagram.md)

# Summary 도메인 — 유스케이스

## 액터

| 액터 | 유형 | 설명 |
|------|------|------|
| 블로그 소유자 | 주 | 요약 생성 트리거 |
| 독자 | 주 | 포스트 카드에서 생성된 요약 확인 |
| Notion API | 보조 | 포스트 콘텐츠 소스, 요약 업데이트 대상 |
| LLM 제공자 | 보조 | OpenAI (prod) / Ollama (dev) |

## UC-SUMMARY-01: 요약 생성 및 저장

| 항목 | 값 |
|------|---|
| ID | UC-SUMMARY-01 |
| 액터 | 블로그 소유자, Notion API, LLM 제공자 |
| 관련 요구사항 | FR-SUMMARY-01, FR-SUMMARY-02, FR-SUMMARY-05 |

### 주요 흐름

1. 블로그 소유자가 포스트 카드의 `SummaryButton` 클릭
2. `updatePostSummary(postId)`가 `PATCH /api/posts/[postId]/summary` 호출
3. API가 `getNotionPostContentForSummary(postId)`로 포스트 조회
4. `isSummarized=true`이면 에러 throw → 500 응답
5. API가 `getSummary(title, content)` 호출:
   - 콘텐츠를 8000 단어 토큰까지 잘림
   - 시스템 프롬프트와 사용자 프롬프트로 LLM 호출
   - 생성된 요약 반환
6. API가 `patchNotionPostSummary(postId, summary)`로 Notion 업데이트
7. 캐시 무효화: `revalidateTag("posts")`, `revalidatePath("/posts")`, `revalidatePath("/")`
8. 200과 함께 `{ success: true, summary, message }` 반환

### 대안 흐름
- **AF-01**: Notion `ObjectNotFound` → 404
- **AF-02**: Notion `Unauthorized` → 403
- **AF-03**: Notion `RateLimited` → 429
- **AF-04**: 기타 Notion 에러 → 502
- **AF-05**: `SummaryServiceError` (LLM 실패) → 502
- **AF-06**: 이미 요약됨 → 500

## UC-SUMMARY-02: 환경 기반 LLM 선택

| 항목 | 값 |
|------|---|
| ID | UC-SUMMARY-02 |
| 액터 | LLM 제공자 |
| 관련 요구사항 | FR-SUMMARY-03 |

### 주요 흐름

1. `getOpenAIClient()`가 처음 호출됨 (지연 싱글톤)
2. `process.env.NODE_ENV` 확인
3. `development`일 때:
   - `apiKey: "ollama"` (플레이스홀더)
   - `baseURL: ${LOCAL_AI_ENDPOINT}/v1` (기본 `http://localhost:11434/v1`)
4. `production`일 때:
   - `apiKey: process.env.OPENAI_API_KEY`
   - `baseURL: undefined` (OpenAI 기본값 사용)
5. 후속 호출을 위해 클라이언트 인스턴스 캐시

## UC-SUMMARY-03: UI에 요약 표시

| 항목 | 값 |
|------|---|
| ID | UC-SUMMARY-03 |
| 액터 | 독자 |
| 관련 요구사항 | FR-SUMMARY-04 |

### 주요 흐름

1. 독자가 포스트 목록 (홈 또는 `/posts`) 조회
2. 각 포스트마다 `PostCard`가 `post.aiSummarized` 확인
3. true이면 `post.aiSummary`로 `SummaryCard` 렌더링
4. false이면 `SummaryButton` 렌더링 (블로그 소유자에게 표시)

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | **[유스케이스]** | [시퀀스 다이어그램](sequence-diagram.md) | [API 명세](api-spec.md) | [테스트 명세](test-spec.md)
