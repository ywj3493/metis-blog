<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [requirements](requirements.md) | [use-cases](../workflows/use-cases.md) -->

> [← 요구사항](requirements.md) | [유스케이스 →](../workflows/use-cases.md)

# Summary 도메인 — 유저 스토리

## US-01: 포스트 요약 생성

**블로그 소유자로서**,
**포스트 카드의 버튼을 클릭하여 AI 요약을 생성하고 싶습니다**,
**독자가 각 포스트의 내용을 빠르게 파악할 수 있도록**.

### 완료 기준

- [ ] **AC-US01-01**: 포스트에 요약이 없을 때, 요약 버튼을 클릭하면, API가 한국어 2문장 요약을 생성
- [ ] **AC-US01-02**: 요약이 생성되면, API가 완료될 때, 요약이 Notion `summary` 속성에 저장됨
- [ ] **AC-US01-03**: 포스트에 이미 요약이 있을 때, 생성을 트리거하면, 에러 반환
- [ ] **AC-US01-04**: LLM이 실패하면, 생성 에러 시, 명확한 메시지와 함께 502 상태 반환

## US-02: 개발 환경에서 로컬 LLM 사용

**개발자로서**,
**개발 시 요약 생성에 로컬 Ollama 인스턴스를 사용하고 싶습니다**,
**테스트하면서 OpenAI API 비용을 발생시키지 않도록**.

### 완료 기준

- [ ] **AC-US02-01**: `NODE_ENV=development`일 때, `getOpenAIClient()`가 호출되면, `LOCAL_AI_ENDPOINT`를 가리킴
- [ ] **AC-US02-02**: `NODE_ENV=production`일 때, `getOpenAIClient()`가 호출되면, `OPENAI_API_KEY` 사용
- [ ] **AC-US02-03**: Ollama가 로컬에서 실행되지 않을 때, 생성이 트리거되면, `SummaryServiceError` throw

## US-03: 포스트 카드에서 요약 읽기

**독자로서**,
**각 포스트 카드에서 요약을 보고 싶습니다**,
**포스트를 빠르게 훑어보고 관련된 것을 찾을 수 있도록**.

### 완료 기준

- [ ] **AC-US03-01**: 포스트가 `aiSummarized=true`일 때, 포스트 목록을 볼 때, 카드에 요약 표시
- [ ] **AC-US03-02**: 포스트에 요약이 없을 때, 포스트 목록을 볼 때, 생성 버튼이 대신 표시됨

## 스토리-요구사항 추적

| 유저 스토리 | 요구사항 | AC 수 |
|-----------|---------|-------|
| US-01 | FR-SUMMARY-01, FR-SUMMARY-02, FR-SUMMARY-05 | 4 |
| US-02 | FR-SUMMARY-03 | 3 |
| US-03 | FR-SUMMARY-04 | 2 |

> **전체 문서**
> [요구사항](requirements.md) | **[유저 스토리]** | [유스케이스](../workflows/use-cases.md) | [시퀀스 다이어그램](../workflows/sequence-diagram.md) | [API 명세](../workflows/api-spec.md) | [테스트 명세](../workflows/test-spec.md)
