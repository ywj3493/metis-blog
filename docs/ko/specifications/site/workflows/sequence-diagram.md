<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [component-spec](component-spec.md) -->

> [← 유스케이스](use-cases.md) | [컴포넌트 명세 →](component-spec.md)

# Site 도메인 — 시퀀스 다이어그램

## 흐름 1: 테마 전환 (UC-SITE-01)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant Layout as RootLayout
  participant Provider as ThemeProvider (next-themes)
  participant Toggle as ThemeToggle (클라이언트)
  participant Storage as localStorage

  Reader->>Layout: GET /
  Layout->>Provider: children 래핑
  Provider->>Storage: 저장된 테마 읽기
  alt 저장된 테마 있음
    Storage-->>Provider: 테마
  else 저장된 테마 없음
    Provider->>Provider: 시스템 테마 감지
  end
  Provider-->>Reader: 테마와 함께 렌더링

  Note over Toggle: useEffect(() => setMounted(true))
  Toggle->>Toggle: mounted=false → LoadingDot 렌더링
  Toggle->>Toggle: mounted=true → moon/sun 아이콘 렌더링

  Reader->>Toggle: 클릭
  Toggle->>Provider: setTheme("dark")
  Provider->>Storage: 테마 영속화
  Provider->>Provider: CSS 클래스 적용
  Provider-->>Reader: 새 테마로 재렌더링
```

## 흐름 2: About 페이지 (UC-SITE-03)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant AboutPage as about/page.tsx (서버)
  participant PostAPI as entities/post/api
  participant NotionX as notion-client (비공식)
  participant Renderer as ClientNotionRenderer
  participant Contact as Contact

  Reader->>AboutPage: GET /about
  AboutPage->>PostAPI: getNotionAboutPage()
  PostAPI->>NotionX: notionApi.getPage(NOTION_ABOUT_PAGE_ID)
  NotionX-->>PostAPI: ExtendedRecordMap
  PostAPI-->>AboutPage: recordMap
  AboutPage->>Renderer: render(recordMap)
  Renderer-->>Reader: 리치 Notion 콘텐츠
  AboutPage->>Contact: Contact 렌더링
  Contact-->>Reader: 이메일 + 소셜 링크
```

## 흐름 3: 사이트맵 생성 (UC-SITE-04)

```mermaid
sequenceDiagram
  participant Crawler as 크롤러
  participant Rewrite as Next.js rewrite
  participant Sitemap as api/sitemap/route.ts
  participant PostAPI as entities/post/api
  participant Notion as Notion API

  Crawler->>Rewrite: GET /sitemap.xml
  Rewrite->>Sitemap: GET /api/sitemap
  Sitemap->>PostAPI: getNotionPosts()
  PostAPI->>Notion: databases.query
  Notion-->>PostAPI: posts[]
  PostAPI-->>Sitemap: posts[]
  Sitemap->>Sitemap: XML 빌드 (하드코딩 라우트 + 포스트 URL)
  Sitemap-->>Crawler: XML 응답 (Content-Type: application/xml)
```

## 흐름 4: Robots.txt (UC-SITE-04)

```mermaid
sequenceDiagram
  participant Crawler as 크롤러
  participant Robots as src/app/robots.ts

  Crawler->>Robots: GET /robots.txt
  Robots->>Robots: MetadataRoute.Robots 설정 빌드
  Robots-->>Crawler: { rules: { allow: "/", disallow: "/private/" }, sitemap }
```

## 흐름 5: 초기 페이지 로드 (UC-SITE-02 + UC-SITE-07)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant Layout as RootLayout
  participant ThemeProvider
  participant TooltipProvider
  participant Header
  participant Page as 페이지 콘텐츠
  participant Analytics as Vercel Analytics

  Reader->>Layout: GET /
  Layout->>ThemeProvider: 래핑
  ThemeProvider->>TooltipProvider: 래핑
  TooltipProvider->>Header: 렌더링
  Header-->>Reader: 로고 + 네비 + 테마 토글
  TooltipProvider->>Page: children 렌더링 (Hero + FeaturedPosts)
  Page-->>Reader: 페이지 콘텐츠
  Layout->>Analytics: <Analytics /> 로드
  Layout->>Analytics: <SpeedInsights /> 로드
```

## 성능 노트

| 측면 | 전략 |
|------|------|
| Hero 이미지 | Next.js Image의 `priority` 플래그 (LCP 최적화) |
| About 페이지 | ISR 180초 재검증 |
| Pretendard 폰트 | 로컬 폰트 (CDN 없음, FOUT 없음) |
| 테마 하이드레이션 | Mounted 체크로 미스매치 방지 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | **[시퀀스 다이어그램]** | [컴포넌트 명세](component-spec.md) | [테스트 명세](test-spec.md)
