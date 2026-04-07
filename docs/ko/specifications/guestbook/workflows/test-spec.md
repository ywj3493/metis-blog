<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [api-spec](api-spec.md) | [requirements](../requirements/requirements.md) -->

> [← API 명세](api-spec.md)

# Guestbook 도메인 — 테스트 명세

## 테스트 유형 정의

| 유형 | 범위 | 목 전략 |
|------|------|---------|
| 단위 | 도메인 모델, 타입 가드 | 목 없음 |
| 통합 | Notion + Nodemailer가 포함된 API 라우트 | MSW + nodemailer 목 |
| E2E | 폼 제출 및 목록 렌더링 | API용 MSW |

## 테스트 매트릭스

| 테스트 ID | 소스 | 참조 | 유형 | 설명 | 우선순위 |
|----------|------|------|------|------|---------|
| T-001 | FR-GB-01 | — | 단위 | `Guestbook.create()` — `GuestbookDatabaseResponse` 입력 | P0 |
| T-002 | FR-GB-01 | — | 단위 | `Guestbook.create()` — `IGuestbook` 입력 | P0 |
| T-003 | FR-GB-01 | — | 단위 | `Guestbook.create()` — 잘못된 입력 시 throw | P0 |
| T-004 | FR-GB-01 | — | 단위 | `Guestbook.isPublic`은 상태 "공개"일 때 true | P0 |
| T-005 | FR-GB-01 | — | 단위 | `isGuestbookDatabaseResponse()` 타입 가드 | P0 |
| T-006 | FR-GB-01 | — | 단위 | `isIGuestbook()` 타입 가드 | P0 |
| T-007 | FR-GB-01 | AC-US01-01 | 통합 | `GET /api/guestbooks` 정렬된 항목 반환 | P0 |
| T-008 | FR-GB-01 | — | 통합 | `GET /api/guestbooks` Notion 실패 시 500 반환 | P1 |
| T-009 | FR-GB-02 | AC-US02-01 | 통합 | `POST /api/guestbooks` 유효 입력 시 항목 생성 | P0 |
| T-010 | FR-GB-02 | AC-US02-02 | 통합 | `POST /api/guestbooks` isPrivate=true 시 비공개 설정 | P0 |
| T-011 | FR-GB-02 | AC-US02-03 | 통합 | `POST /api/guestbooks` 필드 누락 시 400 반환 | P0 |
| T-012 | FR-GB-02 | — | 통합 | `POST /api/guestbooks` Notion 실패 시 500 반환 | P1 |
| T-013 | FR-GB-03 | AC-US03-01 | 통합 | `POST /api/alarm` 유효 페이로드로 이메일 전송 | P1 |
| T-014 | FR-GB-03 | — | 통합 | `POST /api/alarm` 잘못된 입력 시 400 반환 | P1 |
| T-015 | FR-GB-03 | AC-US03-02 | 통합 | `POST /api/alarm` SMTP 실패 시 500 반환 | P2 |
| T-016 | FR-GB-01 | AC-US01-02 | E2E | 비공개 항목은 플레이스홀더 텍스트 표시 | P1 |
| T-017 | FR-GB-02 | AC-US02-04 | E2E | 제출 중 로딩 스피너 표시 | P2 |
| T-018 | FR-GB-02 | AC-US02-01 | E2E | 제출 성공 후 목록 새로고침 | P1 |

## 우선순위 범례

| 우선순위 | 의미 |
|---------|------|
| P0 | 필수 통과 — 릴리스 차단 |
| P1 | 통과 권장 — 중요 기능 |
| P2 | 있으면 좋음 — 엣지 케이스 |

## 테스트 파일 구조

```
src/
├── entities/guestbook/
│   └── model/
│       └── index.test.ts          # T-001 ~ T-006 (단위)
├── entities/alarm/
│   └── model/
│       └── index.test.ts          # T-013 ~ T-015 (통합)
├── app/api/guestbooks/
│   └── route.test.ts              # T-007 ~ T-012 (통합)
├── app/api/alarm/
│   └── route.test.ts              # T-013 ~ T-015 (통합)
└── features/guestbook/
    └── ui/
        ├── guestbook-list.test.tsx  # T-016, T-018 (E2E)
        └── guestbook-form.test.tsx  # T-017, T-018 (E2E)
```

## 목 경계

| 테스트 유형 | Notion | Nodemailer | 네트워크 |
|-----------|--------|-----------|---------|
| 단위 | — | — | — |
| 통합 | MSW 핸들러 | vi.mock | — |
| E2E | MSW 핸들러 | MSW 핸들러 | MSW |

## 테스트-요구사항 추적

| 요구사항 | 유저 스토리 | 유스케이스 | 테스트 ID | 커버리지 |
|---------|-----------|----------|----------|---------|
| FR-GB-01 | US-01 | UC-GB-01 | T-001 ~ T-008, T-016 | 전체 |
| FR-GB-02 | US-02 | UC-GB-02 | T-009 ~ T-012, T-017, T-018 | 전체 |
| FR-GB-03 | US-03 | UC-GB-03 | T-013 ~ T-015 | 전체 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | [시퀀스 다이어그램](sequence-diagram.md) | [API 명세](api-spec.md) | **[테스트 명세]**
