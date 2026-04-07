<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- Tech Stack: Next.js 14, TypeScript, OpenAI SDK, Ollama, Notion API -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [유저 스토리 →](user-stories.md)

# Summary 도메인 — 요구사항

## 시스템 개요

Summary 도메인은 블로그 포스트에 대한 AI 생성 요약을 담당합니다. Notion에서 포스트 콘텐츠를 가져와 환경 기반으로 선택된 LLM(프로덕션은 OpenAI, 개발은 Ollama)을 통해 한국어 2문장 요약을 생성하고, 결과를 Notion `summary` 속성에 저장합니다.

## 기능 요구사항

### FR-SUMMARY-01: AI 요약 생성

| 항목 | 값 |
|------|---|
| ID | FR-SUMMARY-01 |
| 우선순위 | 높음 |
| 설명 | LLM을 통해 포스트의 한국어 2문장 요약 생성 |

**완료 기준**:
- `PATCH /api/posts/[postId]/summary`로 트리거
- `getNotionPostContentForSummary()`로 Notion에서 포스트 제목과 단락 콘텐츠 조회
- 이미 요약이 있는 포스트는 400/에러 반환
- `SUMMARY_MODEL_CONFIG`로 `getSummary(title, content)` 호출하여 요약 생성
- 시스템 프롬프트 강제: 최대 2문장, 정중한 한국어, 과장 금지, 마크다운 금지
- 콘텐츠는 `safeSlice()`로 약 8000 워드토큰까지 잘림

### FR-SUMMARY-02: Notion에 요약 저장

| 항목 | 값 |
|------|---|
| ID | FR-SUMMARY-02 |
| 우선순위 | 높음 |
| 설명 | 생성된 요약을 Notion `summary` 속성에 영속화 |

**완료 기준**:
- 생성 성공 후 `patchNotionPostSummary(postId, summary)` 호출
- 캐시 무효화: `revalidateTag("posts")`, `revalidatePath("/posts")`, `revalidatePath("/")`
- 200과 함께 `{ success, summary, message }` 반환

### FR-SUMMARY-03: 환경 기반 LLM 선택

| 항목 | 값 |
|------|---|
| ID | FR-SUMMARY-03 |
| 우선순위 | 높음 |
| 설명 | 프로덕션은 OpenAI, 개발은 Ollama로 요약 생성 |

**완료 기준**:
- `getOpenAIClient()`가 `NODE_ENV`에 따라 제공자 선택
- 프로덕션: `OPENAI_API_KEY`, 모델 `gpt-4o-mini`
- 개발: `LOCAL_AI_ENDPOINT` (기본 `http://localhost:11434`), 모델 `LOCAL_AI_MODEL` 또는 `gemma3:1b`
- 둘 다 OpenAI SDK API 사용 (Ollama는 OpenAI 호환)

### FR-SUMMARY-04: UI에 요약 표시

| 항목 | 값 |
|------|---|
| ID | FR-SUMMARY-04 |
| 우선순위 | 중간 |
| 설명 | 포스트 카드에 요약 표시 및 생성 트리거 버튼 제공 |

**완료 기준**:
- `SummaryCard`는 `aiSummarized`가 true일 때 `PostCard`에 AI 요약 표시
- `SummaryButton`은 요약이 없을 때 `updatePostSummary(postId)` 트리거
- 생성 성공 후 페이지 재검증되고 새 요약 표시

### FR-SUMMARY-05: 에러 처리

| 항목 | 값 |
|------|---|
| ID | FR-SUMMARY-05 |
| 우선순위 | 높음 |
| 설명 | Notion 및 LLM 에러를 적절한 HTTP 상태 코드로 매핑 |

**완료 기준**:

| 에러 | HTTP 상태 |
|------|----------|
| 이미 요약됨 | 500 (메시지와 함께) |
| Notion `ObjectNotFound` | 404 |
| Notion `Unauthorized` | 403 |
| Notion `RateLimited` | 429 |
| 기타 Notion 에러 | 502 |
| `SummaryServiceError` | 502 |
| 알 수 없는 에러 | 500 |

## 비기능 요구사항

### NFR-SUMMARY-01: 성능

- 토큰 유사 콘텐츠 트런케이션 (8000 단어)으로 LLM 비용/지연 방지
- 캐시 무효화로 새 요약이 즉시 표시되도록 보장

### NFR-SUMMARY-02: 품질

- 시스템 프롬프트로 일관된 스타일 강제 (정중한 한국어, 마크다운 없음, 사실 기반)
- 결정론적 출력을 위한 `temperature: 0.2`
- 간결한 요약을 위한 `max_tokens: 50`

## 제약사항

| 유형 | 제약 |
|------|------|
| 기술 | Notion `summary` 속성이 포스트 페이지에 존재해야 함 |
| 기술 | 개발 시 Ollama가 로컬에서 실행 중이어야 함 |
| 비즈니스 | 요약은 한 번 생성되면 불변 (재생성 없음) |

## 요구사항 추적 매트릭스

| 요구사항 | 유저 스토리 | 유스케이스 |
|---------|-----------|----------|
| FR-SUMMARY-01 | US-01 | UC-SUMMARY-01 |
| FR-SUMMARY-02 | US-01 | UC-SUMMARY-01 |
| FR-SUMMARY-03 | US-02 | UC-SUMMARY-02 |
| FR-SUMMARY-04 | US-01, US-03 | UC-SUMMARY-03 |
| FR-SUMMARY-05 | US-01 | UC-SUMMARY-01 |

> **전체 문서**
> **[요구사항]** | [유저 스토리](user-stories.md) | [유스케이스](../workflows/use-cases.md) | [시퀀스 다이어그램](../workflows/sequence-diagram.md) | [API 명세](../workflows/api-spec.md) | [테스트 명세](../workflows/test-spec.md)
