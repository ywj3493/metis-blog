<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- Tech Stack: Next.js 14, next-themes, Tailwind, Notion API -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [유저 스토리 →](user-stories.md)

# Site 도메인 — 요구사항

## 시스템 개요

Site 도메인은 사이트 전반의 횡단 관심사를 담당합니다: 테마 시스템 (다크/라이트 모드), 네비게이션 헤더, 프로필 표시 (Hero 및 Contact 컴포넌트), About 페이지, SEO (사이트맵, robots), 루트 레이아웃. 이 도메인은 코드베이스에서 "theme", "profile", "site"로 나뉜 기능들을 포괄합니다.

## 기능 요구사항

### FR-SITE-01: 테마 시스템

| 항목 | 값 |
|------|---|
| ID | FR-SITE-01 |
| 우선순위 | 높음 |
| 설명 | 시스템 테마 감지가 포함된 라이트/다크 모드 토글 |

**완료 기준**:
- `ThemeProvider`가 `next-themes`로 앱을 래핑
- 시스템 테마를 감지하여 기본값으로 사용
- `ThemeToggle` 버튼이 "light"와 "dark" 사이 전환
- 페이지 새로고침 후에도 테마 설정 유지
- 하이드레이션 미스매치 방지 (마운트 중 로딩 점 표시)

### FR-SITE-02: 사이트 네비게이션 헤더

| 항목 | 값 |
|------|---|
| ID | FR-SITE-02 |
| 우선순위 | 높음 |
| 설명 | 로고, 메뉴, 테마 토글이 있는 상단 네비게이션 바 표시 |

**완료 기준**:
- 헤더에 마스코트 로고와 블로그 제목 표시
- 네비게이션 메뉴: 소개, 방명록, 포스트
- 우측에 테마 토글 통합
- 헤더는 루트 레이아웃에서 렌더링되어 모든 페이지에 표시

### FR-SITE-03: 프로필 Hero 섹션

| 항목 | 값 |
|------|---|
| ID | FR-SITE-03 |
| 우선순위 | 중간 |
| 설명 | 홈 페이지에 프로필 hero 표시 |

**완료 기준**:
- `Hero` 컴포넌트가 마스코트 이미지 표시 (240x240, 우선 로딩)
- 한국어 인사말과 블로그 설명 표시
- 툴팁이 있는 GitHub 링크 버튼

### FR-SITE-04: About 페이지

| 항목 | 값 |
|------|---|
| ID | FR-SITE-04 |
| 우선순위 | 중간 |
| 설명 | `/about`에 Notion에서 가져온 블로그 소유자 프로필 표시 |

**완료 기준**:
- `getNotionAboutPage()`로 Notion에서 About 페이지 콘텐츠 조회
- `ClientNotionRenderer`로 콘텐츠 렌더링
- 하단에 `Contact` 컴포넌트 표시 (이메일 + GitHub/LinkedIn/Notion 링크)
- ISR 재검증: 180초

### FR-SITE-05: 동적 사이트맵

| 항목 | 값 |
|------|---|
| ID | FR-SITE-05 |
| 우선순위 | 중간 |
| 설명 | Notion 포스트로부터 XML 사이트맵 동적 생성 |

**완료 기준**:
- `GET /api/sitemap`이 XML 사이트맵 반환
- Notion의 모든 공개 포스트 URL 포함
- 하드코딩 라우트: `/` (우선순위 1.0), `/about`, `/posts`, `/guestbooks` (우선순위 0.8)
- 일일 변경 빈도
- Next.js rewrite로 `/sitemap.xml`에서 사용 가능

### FR-SITE-06: Robots.txt

| 항목 | 값 |
|------|---|
| ID | FR-SITE-06 |
| 우선순위 | 낮음 |
| 설명 | 검색 엔진 크롤러 제어용 robots.txt 제공 |

**완료 기준**:
- `src/app/robots.ts`가 robots 설정 생성
- 모든 user agent에 대해 `/` 허용
- `/private/` 경로 차단
- sitemap.xml 위치 지정

### FR-SITE-07: 루트 레이아웃 및 메타데이터

| 항목 | 값 |
|------|---|
| ID | FR-SITE-07 |
| 우선순위 | 높음 |
| 설명 | 폰트, 프로바이더, 분석이 포함된 앱 전반 레이아웃 제공 |

**완료 기준**:
- Pretendard 폰트 로컬 로드
- `ThemeProvider`와 `TooltipProvider`가 앱 래핑
- 메인 콘텐츠 위에 헤더 렌더링
- Vercel Analytics 및 Speed Insights 활성화
- 기본 메타데이터 title 템플릿 및 설명 설정

## 비기능 요구사항

### NFR-SITE-01: 성능

- Hero 마스코트 이미지는 Next.js Image의 `priority` 플래그 사용
- About 페이지는 ISR (180초) 사용
- Pretendard 폰트는 로컬 폰트로 로드 (CDN 지연 없음)

### NFR-SITE-02: 접근성

- 아이콘 전용 링크에 툴팁 (GitHub, LinkedIn, Notion)
- 헤더 네비게이션의 시맨틱 HTML

### NFR-SITE-03: SEO

- 루트 레이아웃의 메타데이터 title 템플릿, 설명
- 모든 포스트가 포함된 동적 사이트맵
- 사이트맵 참조가 있는 robots.txt

## 제약사항

| 유형 | 제약 |
|------|------|
| 기술 | About 페이지에 `NOTION_ABOUT_PAGE_ID` 필요 |
| 기술 | 사이트맵과 robots에 `BLOG_URL` 환경 변수 필요 |
| 아키텍처 | 테마: `src/features/theme/`, 프로필: `src/features/profile/`, 레이아웃: `src/widgets/`, 페이지: `src/app/` |

## 요구사항 추적 매트릭스

| 요구사항 | 유저 스토리 | 유스케이스 |
|---------|-----------|----------|
| FR-SITE-01 | US-01 | UC-SITE-01 |
| FR-SITE-02 | US-02 | UC-SITE-02 |
| FR-SITE-03 | US-03 | UC-SITE-03 |
| FR-SITE-04 | US-03 | UC-SITE-03 |
| FR-SITE-05 | US-04 | UC-SITE-04 |
| FR-SITE-06 | US-04 | UC-SITE-04 |
| FR-SITE-07 | US-01, US-02 | UC-SITE-01, UC-SITE-02 |

> **전체 문서**
> **[요구사항]** | [유저 스토리](user-stories.md) | [유스케이스](../workflows/use-cases.md) | [시퀀스 다이어그램](../workflows/sequence-diagram.md) | [컴포넌트 명세](../workflows/component-spec.md) | [테스트 명세](../workflows/test-spec.md)
