<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [component-spec](component-spec.md) | [requirements](../requirements/requirements.md) -->

> [← 컴포넌트 명세](component-spec.md)

# Post 도메인 — 테스트 명세

## 테스트 유형 정의

| 유형 | 범위 | 목 전략 |
|------|------|---------|
| 단위 | 도메인 모델, 타입 가드, 유틸리티 함수 | 목 불필요 |
| 통합 | Notion 클라이언트가 포함된 API 레이어 함수 | Notion API용 MSW |
| E2E | 전체 페이지 렌더링 및 사용자 인터랙션 | 모든 외부 API용 MSW |

## 테스트 매트릭스

| 테스트 ID | 소스 | 참조 | 유형 | 설명 | 우선순위 |
|----------|------|------|------|------|---------|
| T-001 | FR-POST-01 | AC-US01-01 | 단위 | `Post.create()` — `DatabaseObjectResponse` 입력 | P0 |
| T-002 | FR-POST-01 | AC-US01-01 | 단위 | `Post.create()` — `IPost` 일반 객체 입력 | P0 |
| T-003 | FR-POST-01 | — | 단위 | `Post.create()` — 잘못된 입력 시 throw | P0 |
| T-004 | FR-POST-01 | — | 단위 | `Tag.create()` — `TagDatabaseResponse` 입력 | P0 |
| T-005 | FR-POST-01 | — | 단위 | `Tag.create()` — `ITag` 일반 객체 입력 | P0 |
| T-006 | FR-POST-01 | — | 단위 | `isPostDatabaseResponse()` 타입 가드 | P0 |
| T-007 | FR-POST-01 | — | 단위 | `isIPost()` 타입 가드 | P0 |
| T-008 | FR-POST-01 | — | 단위 | `isITag()` / `isTagDatabaseResponse()` 타입 가드 | P0 |
| T-009 | FR-POST-01 | — | 단위 | `Post.slugifiedTitle` 올바른 slug 생성 | P1 |
| T-010 | FR-POST-01 | — | 단위 | `Post.aiSummarized` 요약 존재 시 true 반환 | P1 |
| T-011 | FR-POST-01 | AC-US01-01 | 통합 | `getNotionPosts()` 공개 포스트 날짜순 반환 | P0 |
| T-012 | FR-POST-03 | — | 통합 | `getNotionPostDatabaseTags()` 전체 태그 반환 | P1 |
| T-013 | FR-POST-02 | AC-US02-03 | 통합 | `getSlugMap()` 올바른 slug-ID 매핑 빌드 | P1 |
| T-014 | FR-POST-02 | — | 통합 | `getNotionPage()` `ExtendedRecordMap` 반환 | P1 |
| T-015 | FR-POST-03 | AC-US03-01 | E2E | 태그 필터 클릭 시 매칭 포스트 표시 | P1 |
| T-016 | FR-POST-03 | AC-US03-02 | E2E | 다중 태그 선택 시 OR 로직 사용 | P1 |
| T-017 | FR-POST-03 | AC-US03-03 | E2E | 매칭 포스트 없을 때 빈 상태 표시 | P2 |
| T-018 | FR-POST-04 | AC-US04-01 | 통합 | `PostNavigator` 공유 태그 기반 관련 포스트 반환 | P2 |

## 우선순위 범례

| 우선순위 | 의미 |
|---------|------|
| P0 | 필수 통과 — 릴리스 차단 |
| P1 | 통과 권장 — 중요 기능 |
| P2 | 있으면 좋음 — 엣지 케이스 |

## 테스트 파일 구조

```
src/
├── entities/post/
│   ├── model/
│   │   └── index.test.ts          # T-001 ~ T-010 (단위)
│   └── api/
│       └── index.test.ts          # T-011 ~ T-014 (통합)
├── features/post/
│   └── ui/
│       └── filterable-post.test.tsx  # T-015 ~ T-017 (E2E)
│       └── post-navigator.test.tsx   # T-018 (통합)
```

## 목 경계

| 테스트 유형 | Notion 공식 | Notion 비공식 | 캐시 |
|-----------|-----------|-------------|------|
| 단위 | 사용 안 함 | 사용 안 함 | 사용 안 함 |
| 통합 | MSW 핸들러 | MSW 핸들러 | 바이패스 |
| E2E | MSW 핸들러 | MSW 핸들러 | 바이패스 |

## 테스트-요구사항 추적

| 요구사항 | 유저 스토리 | 유스케이스 | 테스트 ID | 커버리지 |
|---------|-----------|----------|----------|---------|
| FR-POST-01 | US-01 | UC-POST-01 | T-001 ~ T-012 | 전체 |
| FR-POST-02 | US-02 | UC-POST-02 | T-013, T-014 | 전체 |
| FR-POST-03 | US-03 | UC-POST-03 | T-015 ~ T-017 | 전체 |
| FR-POST-04 | US-04 | UC-POST-04 | T-018 | 부분 |
| FR-POST-05 | US-01 | UC-POST-01 | T-011 | 부분 |

## 에이전트 가이드라인

- 테스트 ID는 `T-NNN` 형식, 도메인 내 T-001부터 시작
- 테스트 설명에 완료 기준 참조: `// AC-US01-01`
- API 모킹에 `src/mocks/handlers.ts`의 MSW 핸들러 사용
- 딥 테스트 (`pnpm test:deep`) 시 MSW 건너뛰고 실제 Notion 인증 사용

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | [시퀀스 다이어그램](sequence-diagram.md) | [컴포넌트 명세](component-spec.md) | **[테스트 명세]**
