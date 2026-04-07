<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [user-stories](../requirements/user-stories.md) | [sequence-diagram](sequence-diagram.md) -->

> [← 유저 스토리](../requirements/user-stories.md) | [시퀀스 다이어그램 →](sequence-diagram.md)

# Site 도메인 — 유스케이스

## 액터

| 액터 | 유형 | 설명 |
|------|------|------|
| 독자 | 주 | 사이트 탐색, 테마 전환 |
| 검색 엔진 | 주 | 사이트맵 및 robots.txt 크롤링 |
| Notion API | 보조 | About 페이지 콘텐츠 및 포스트 URL 소스 |

## UC-SITE-01: 테마 전환

| 항목 | 값 |
|------|---|
| ID | UC-SITE-01 |
| 액터 | 독자 |
| 관련 요구사항 | FR-SITE-01, FR-SITE-07 |

### 주요 흐름

1. 독자가 페이지 로드 → `ThemeProvider`가 앱 래핑
2. `ThemeProvider`가 저장된 테마 또는 시스템 기본값 읽기
3. `ThemeToggle` 컴포넌트 마운트; 마운트 전까지 로딩 점 표시 (하이드레이션 미스매치 방지)
4. 독자가 `ThemeToggle` 클릭
5. `setTheme()`이 "light"와 "dark" 사이 전환
6. CSS 변수 업데이트, 사이트 전반에 테마 적용
7. 테마 설정이 저장소에 영속화

### 대안 흐름
- **AF-01**: 독자에게 저장된 설정 없음 → 시스템 테마 사용

## UC-SITE-02: 사이트 네비게이션

| 항목 | 값 |
|------|---|
| ID | UC-SITE-02 |
| 액터 | 독자 |
| 관련 요구사항 | FR-SITE-02, FR-SITE-07 |

### 주요 흐름

1. 독자가 페이지 로드 → 루트 `layout.tsx`가 콘텐츠 위에 `Header` 렌더링
2. 헤더는 로고 (마스코트 + 제목), 네비 메뉴 (소개, 방명록, 포스트), `ThemeToggle` 표시
3. 독자가 메뉴 링크 클릭
4. Next.js가 해당 라우트로 네비게이션

## UC-SITE-03: 프로필 및 About 조회

| 항목 | 값 |
|------|---|
| ID | UC-SITE-03 |
| 액터 | 독자, Notion API |
| 관련 요구사항 | FR-SITE-03, FR-SITE-04 |

### 주요 흐름

1. 독자가 `/` 방문 → `Hero` 컴포넌트가 마스코트 이미지, 인사말, GitHub 링크 렌더링
2. 독자가 "소개" 클릭 → `/about`으로 네비게이션
3. `AboutPage` 서버 컴포넌트가 `getNotionAboutPage()`로 Notion 콘텐츠 조회
4. `ClientNotionRenderer`가 페이지 콘텐츠 렌더링
5. 하단에 `Contact` 컴포넌트가 이메일과 소셜 링크와 함께 렌더링

### 대안 흐름
- **AF-01**: `NOTION_ABOUT_PAGE_ID` 누락 → 에러 throw, 에러 바운더리 표시

## UC-SITE-04: SEO 리소스 제공

| 항목 | 값 |
|------|---|
| ID | UC-SITE-04 |
| 액터 | 검색 엔진, Notion API |
| 관련 요구사항 | FR-SITE-05, FR-SITE-06 |

### 주요 흐름 (사이트맵)

1. 크롤러가 `/sitemap.xml` 요청
2. Next.js rewrite가 `/api/sitemap`으로 리다이렉트
3. 라우트 핸들러가 `getNotionPosts()`로 모든 포스트 조회
4. 하드코딩 라우트 + 동적 포스트 URL로 XML 빌드
5. `Content-Type: application/xml`로 XML 응답 반환

### 주요 흐름 (Robots)

1. 크롤러가 `/robots.txt` 요청
2. `src/app/robots.ts`가 robots 설정 반환
3. `/` 허용, `/private/` 차단, 사이트맵 가리킴

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | **[유스케이스]** | [시퀀스 다이어그램](sequence-diagram.md) | [컴포넌트 명세](component-spec.md) | [테스트 명세](test-spec.md)
