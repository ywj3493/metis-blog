<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [component-spec](component-spec.md) | [requirements](../requirements/requirements.md) -->

> [← 컴포넌트 명세](component-spec.md)

# Site 도메인 — 테스트 명세

## 테스트 유형 정의

| 유형 | 범위 | 목 전략 |
|------|------|---------|
| 단위 | `robots.ts` 설정, 사이트맵 XML 빌더 | 목 없음 |
| 통합 | API 라우트 (사이트맵), About 페이지 데이터 페치 | Notion용 MSW |
| E2E | 테마 토글, 네비게이션, About 페이지 렌더링 | 외부용 MSW |

## 테스트 매트릭스

| 테스트 ID | 소스 | 참조 | 유형 | 설명 | 우선순위 |
|----------|------|------|------|------|---------|
| T-001 | FR-SITE-01 | AC-US01-01 | E2E | `ThemeToggle` 클릭 시 테마 전환 | P0 |
| T-002 | FR-SITE-01 | AC-US01-02 | E2E | 페이지 새로고침 후 테마 유지 | P1 |
| T-003 | FR-SITE-01 | AC-US01-03 | E2E | 설정 없을 때 시스템 테마 사용 | P1 |
| T-004 | FR-SITE-01 | AC-US01-04 | 단위 | 마운트 전 `ThemeToggle` 로딩 점 표시 | P0 |
| T-005 | FR-SITE-02 | AC-US02-01 | E2E | `Header` 로고, 네비, 테마 토글 렌더링 | P0 |
| T-006 | FR-SITE-02 | AC-US02-02 | E2E | 네비 링크가 올바른 라우트로 이동 | P0 |
| T-007 | FR-SITE-03 | AC-US03-01 | E2E | `Hero` 마스코트, 인사말, GitHub 링크 렌더링 | P1 |
| T-008 | FR-SITE-04 | AC-US03-02 | 통합 | `AboutPage` Notion 콘텐츠 페치 및 렌더링 | P0 |
| T-009 | FR-SITE-04 | AC-US03-03 | E2E | `Contact` 이메일 및 소셜 링크 표시 | P1 |
| T-010 | FR-SITE-05 | AC-US04-01 | 통합 | `GET /api/sitemap` 모든 포스트 URL 포함된 유효 XML 반환 | P0 |
| T-011 | FR-SITE-05 | — | 통합 | 사이트맵에 올바른 우선순위와 함께 하드코딩 라우트 포함 | P1 |
| T-012 | FR-SITE-05 | — | 통합 | 사이트맵 응답이 `Content-Type: application/xml` 사용 | P1 |
| T-013 | FR-SITE-06 | AC-US04-02 | 단위 | `robots.ts` `/` 허용, `/private/` 차단 | P0 |
| T-014 | FR-SITE-06 | — | 단위 | `robots.ts` 사이트맵 참조 포함 | P1 |
| T-015 | FR-SITE-07 | — | 통합 | `RootLayout` children을 `ThemeProvider`와 `TooltipProvider`로 래핑 | P1 |
| T-016 | FR-SITE-07 | — | 통합 | `RootLayout` 메인 위에 `Header` 렌더링 | P1 |

## 우선순위 범례

| 우선순위 | 의미 |
|---------|------|
| P0 | 필수 통과 — 릴리스 차단 |
| P1 | 통과 권장 — 중요 기능 |
| P2 | 있으면 좋음 — 엣지 케이스 |

## 테스트 파일 구조

```
src/
├── features/theme/ui/
│   └── theme-toggle.test.tsx          # T-001 ~ T-004 (E2E + 단위)
├── widgets/ui/
│   └── header.test.tsx                # T-005, T-006 (E2E)
├── features/profile/ui/
│   ├── hero.test.tsx                  # T-007 (E2E)
│   └── contact.test.tsx               # T-009 (E2E)
├── app/about/
│   └── page.test.tsx                  # T-008 (통합)
├── app/api/sitemap/
│   └── route.test.ts                  # T-010 ~ T-012 (통합)
├── app/
│   ├── robots.test.ts                 # T-013, T-014 (단위)
│   └── layout.test.tsx                # T-015, T-016 (통합)
```

## 목 경계

| 테스트 유형 | Notion | next-themes | 네트워크 |
|-----------|--------|-------------|---------|
| 단위 | — | — | — |
| 통합 | MSW 핸들러 | — | — |
| E2E | MSW 핸들러 | 실제 (next-themes) | MSW |

## 테스트-요구사항 추적

| 요구사항 | 유저 스토리 | 유스케이스 | 테스트 ID | 커버리지 |
|---------|-----------|----------|----------|---------|
| FR-SITE-01 | US-01 | UC-SITE-01 | T-001 ~ T-004 | 전체 |
| FR-SITE-02 | US-02 | UC-SITE-02 | T-005, T-006 | 전체 |
| FR-SITE-03 | US-03 | UC-SITE-03 | T-007 | 부분 |
| FR-SITE-04 | US-03 | UC-SITE-03 | T-008, T-009 | 전체 |
| FR-SITE-05 | US-04 | UC-SITE-04 | T-010 ~ T-012 | 전체 |
| FR-SITE-06 | US-04 | UC-SITE-04 | T-013, T-014 | 전체 |
| FR-SITE-07 | US-01, US-02 | UC-SITE-01, UC-SITE-02 | T-015, T-016 | 부분 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | [시퀀스 다이어그램](sequence-diagram.md) | [컴포넌트 명세](component-spec.md) | **[테스트 명세]**
