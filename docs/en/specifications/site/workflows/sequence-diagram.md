<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [component-spec](component-spec.md) -->

> [← Use Cases](use-cases.md) | [Component Spec →](component-spec.md)

# Site Domain — Sequence Diagrams

## Flow 1: Theme Toggle (UC-SITE-01)

```mermaid
sequenceDiagram
  participant Reader
  participant Layout as RootLayout
  participant Provider as ThemeProvider (next-themes)
  participant Toggle as ThemeToggle (client)
  participant Storage as localStorage

  Reader->>Layout: GET /
  Layout->>Provider: wrap children
  Provider->>Storage: read stored theme
  alt Stored theme exists
    Storage-->>Provider: theme
  else No stored theme
    Provider->>Provider: detect system theme
  end
  Provider-->>Reader: render with theme

  Note over Toggle: useEffect(() => setMounted(true))
  Toggle->>Toggle: mounted=false → render LoadingDot
  Toggle->>Toggle: mounted=true → render moon/sun icon

  Reader->>Toggle: click
  Toggle->>Provider: setTheme("dark")
  Provider->>Storage: persist theme
  Provider->>Provider: apply CSS class
  Provider-->>Reader: re-render with new theme
```

## Flow 2: About Page (UC-SITE-03)

```mermaid
sequenceDiagram
  participant Reader
  participant AboutPage as about/page.tsx (server)
  participant PostAPI as entities/post/api
  participant NotionX as notion-client (unofficial)
  participant Renderer as ClientNotionRenderer
  participant Contact as Contact

  Reader->>AboutPage: GET /about
  AboutPage->>PostAPI: getNotionAboutPage()
  PostAPI->>NotionX: notionApi.getPage(NOTION_ABOUT_PAGE_ID)
  NotionX-->>PostAPI: ExtendedRecordMap
  PostAPI-->>AboutPage: recordMap
  AboutPage->>Renderer: render(recordMap)
  Renderer-->>Reader: rich Notion content
  AboutPage->>Contact: render Contact
  Contact-->>Reader: email + social links
```

## Flow 3: Sitemap Generation (UC-SITE-04)

```mermaid
sequenceDiagram
  participant Crawler
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
  Sitemap->>Sitemap: build XML (hardcoded routes + post URLs)
  Sitemap-->>Crawler: XML response (Content-Type: application/xml)
```

## Flow 4: Robots.txt (UC-SITE-04)

```mermaid
sequenceDiagram
  participant Crawler
  participant Robots as src/app/robots.ts

  Crawler->>Robots: GET /robots.txt
  Robots->>Robots: build MetadataRoute.Robots config
  Robots-->>Crawler: { rules: { allow: "/", disallow: "/private/" }, sitemap }
```

## Flow 5: Initial Page Load (UC-SITE-02 + UC-SITE-07)

```mermaid
sequenceDiagram
  participant Reader
  participant Layout as RootLayout
  participant ThemeProvider
  participant TooltipProvider
  participant Header
  participant Page as Page Content
  participant Analytics as Vercel Analytics

  Reader->>Layout: GET /
  Layout->>ThemeProvider: wrap
  ThemeProvider->>TooltipProvider: wrap
  TooltipProvider->>Header: render
  Header-->>Reader: logo + nav + theme toggle
  TooltipProvider->>Page: render children (Hero + FeaturedPosts)
  Page-->>Reader: page content
  Layout->>Analytics: load <Analytics />
  Layout->>Analytics: load <SpeedInsights />
```

## Performance Notes

| Aspect | Strategy |
|--------|----------|
| Hero image | `priority` flag for Next.js Image (LCP optimization) |
| About page | ISR 180s revalidation |
| Pretendard font | Local font (no CDN, no FOUT) |
| Theme hydration | Mounted check prevents mismatch |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | **[Sequence Diagram]** | [Component Spec](component-spec.md) | [Test Spec](test-spec.md)
