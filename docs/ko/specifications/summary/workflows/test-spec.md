<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [api-spec](api-spec.md) | [requirements](../requirements/requirements.md) -->

> [← API 명세](api-spec.md)

# Summary 도메인 — 테스트 명세

## 테스트 유형 정의

| 유형 | 범위 | 목 전략 |
|------|------|---------|
| 단위 | `safeSlice`, `getSummary` 로직 | `getOpenAIClient` 목 |
| 통합 | API 라우트 end-to-end | OpenAI용 MSW, Notion용 MSW |
| E2E | UI 버튼 → API → Notion 업데이트 | 모든 외부용 MSW |

## 테스트 매트릭스

| 테스트 ID | 소스 | 참조 | 유형 | 설명 | 우선순위 |
|----------|------|------|------|------|---------|
| T-001 | FR-SUMMARY-01 | — | 단위 | `safeSlice()` N개 워드토큰까지 트런케이션 | P0 |
| T-002 | FR-SUMMARY-01 | — | 단위 | `safeSlice()` 한도 미만일 때 전체 텍스트 반환 | P1 |
| T-003 | FR-SUMMARY-01 | AC-US01-01 | 단위 | `getSummary()` LLM completion 텍스트 반환 | P0 |
| T-004 | FR-SUMMARY-01 | AC-US01-04 | 단위 | `getSummary()` LLM 실패 시 `SummaryServiceError` throw | P0 |
| T-005 | FR-SUMMARY-01 | — | 단위 | `getSummary()` 올바른 시스템 프롬프트 사용 | P1 |
| T-006 | FR-SUMMARY-03 | AC-US02-01 | 단위 | `getOpenAIClient()` development에서 `LOCAL_AI_ENDPOINT` 사용 | P0 |
| T-007 | FR-SUMMARY-03 | AC-US02-02 | 단위 | `getOpenAIClient()` production에서 `OPENAI_API_KEY` 사용 | P0 |
| T-008 | FR-SUMMARY-03 | — | 단위 | `getOpenAIClient()` 캐시된 싱글톤 반환 | P1 |
| T-009 | FR-SUMMARY-01 | AC-US01-01 | 통합 | `PATCH /api/posts/[postId]/summary` 요약과 함께 200 반환 | P0 |
| T-010 | FR-SUMMARY-02 | AC-US01-02 | 통합 | API가 Notion `summary` 속성 패치 | P0 |
| T-011 | FR-SUMMARY-01 | AC-US01-03 | 통합 | 포스트에 이미 요약 있을 때 API 500 반환 | P0 |
| T-012 | FR-SUMMARY-05 | — | 통합 | Notion `ObjectNotFound`에 API 404 반환 | P0 |
| T-013 | FR-SUMMARY-05 | — | 통합 | Notion `Unauthorized`에 API 403 반환 | P1 |
| T-014 | FR-SUMMARY-05 | — | 통합 | Notion `RateLimited`에 API 429 반환 | P1 |
| T-015 | FR-SUMMARY-05 | — | 통합 | 기타 Notion 에러에 API 502 반환 | P1 |
| T-016 | FR-SUMMARY-05 | AC-US01-04 | 통합 | `SummaryServiceError`에 API 502 반환 | P0 |
| T-017 | FR-SUMMARY-02 | — | 통합 | 성공 후 API가 `revalidateTag("posts")` 호출 | P1 |
| T-018 | FR-SUMMARY-04 | AC-US03-01 | E2E | `aiSummarized=true`일 때 `SummaryCard` 렌더링 | P1 |
| T-019 | FR-SUMMARY-04 | AC-US03-02 | E2E | `aiSummarized=false`일 때 `SummaryButton` 렌더링 | P1 |
| T-020 | FR-SUMMARY-04 | AC-US01-01 | E2E | `SummaryButton` 클릭 시 `updatePostSummary()` 트리거 | P1 |

## 우선순위 범례

| 우선순위 | 의미 |
|---------|------|
| P0 | 필수 통과 — 릴리스 차단 |
| P1 | 통과 권장 — 중요 기능 |
| P2 | 있으면 좋음 — 엣지 케이스 |

## 테스트 파일 구조

```
src/
├── features/summary/
│   └── api/
│       ├── get-summary.test.ts        # T-001 ~ T-005 (단위)
│       └── update-post-summary.test.ts
├── shared/api/
│   └── openai.test.ts                 # T-006 ~ T-008 (단위)
├── app/api/posts/[postId]/summary/
│   └── route.test.ts                  # T-009 ~ T-017 (통합)
└── features/summary/
    └── ui/
        ├── summary-card.test.tsx      # T-018 (E2E)
        └── summary-button.test.tsx    # T-019, T-020 (E2E)
```

## 목 경계

| 테스트 유형 | OpenAI/Ollama | Notion | next/cache |
|-----------|--------------|--------|-----------|
| 단위 | vi.mock | — | — |
| 통합 | MSW (OpenAI 호환 엔드포인트) | MSW | vi.mock |
| E2E | MSW | MSW | vi.mock |

## 테스트-요구사항 추적

| 요구사항 | 유저 스토리 | 유스케이스 | 테스트 ID | 커버리지 |
|---------|-----------|----------|----------|---------|
| FR-SUMMARY-01 | US-01 | UC-SUMMARY-01 | T-001 ~ T-005, T-009, T-011 | 전체 |
| FR-SUMMARY-02 | US-01 | UC-SUMMARY-01 | T-010, T-017 | 전체 |
| FR-SUMMARY-03 | US-02 | UC-SUMMARY-02 | T-006 ~ T-008 | 전체 |
| FR-SUMMARY-04 | US-01, US-03 | UC-SUMMARY-03 | T-018 ~ T-020 | 전체 |
| FR-SUMMARY-05 | US-01 | UC-SUMMARY-01 | T-012 ~ T-016 | 전체 |

## 에이전트 가이드라인

- 테스트 설명에 완료 기준 참조: `// AC-US01-01`
- `getSummary` 단위 테스트에 `vi.mock("@/shared/api/openai")` 사용
- API 라우트 통합 테스트에 MSW 핸들러 사용
- 에러 매핑을 신중하게 테스트 — 각 Notion `APIErrorCode`는 특정 HTTP 상태에 매핑

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | [시퀀스 다이어그램](sequence-diagram.md) | [API 명세](api-spec.md) | **[테스트 명세]**
