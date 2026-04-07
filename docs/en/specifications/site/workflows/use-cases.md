<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [user-stories](../requirements/user-stories.md) | [sequence-diagram](sequence-diagram.md) -->

> [← User Stories](../requirements/user-stories.md) | [Sequence Diagram →](sequence-diagram.md)

# Site Domain — Use Cases

## Actors

| Actor | Type | Description |
|-------|------|-------------|
| Reader | Primary | Browses the site, switches theme |
| Search Engine | Primary | Crawls sitemap and robots.txt |
| Notion API | Secondary | Source of About page content and post URLs |

## UC-SITE-01: Toggle Theme

| Field | Value |
|-------|-------|
| ID | UC-SITE-01 |
| Actors | Reader |
| Related Requirements | FR-SITE-01, FR-SITE-07 |

### Main Flow

1. Reader loads any page → `ThemeProvider` wraps app
2. `ThemeProvider` reads stored theme or uses system default
3. `ThemeToggle` component mounts; until mounted, shows loading dot (avoids hydration mismatch)
4. Reader clicks `ThemeToggle`
5. `setTheme()` switches between "light" and "dark"
6. CSS variables update, theme applied site-wide
7. Theme preference persisted in storage

### Alternative Flows
- **AF-01**: Reader has no stored preference → system theme used

## UC-SITE-02: Navigate Site

| Field | Value |
|-------|-------|
| ID | UC-SITE-02 |
| Actors | Reader |
| Related Requirements | FR-SITE-02, FR-SITE-07 |

### Main Flow

1. Reader loads any page → root `layout.tsx` renders `Header` above content
2. Header shows logo (mascot + title), nav menu (소개, 방명록, 포스트), `ThemeToggle`
3. Reader clicks a menu link
4. Next.js navigates to the corresponding route

## UC-SITE-03: View Profile and About

| Field | Value |
|-------|-------|
| ID | UC-SITE-03 |
| Actors | Reader, Notion API |
| Related Requirements | FR-SITE-03, FR-SITE-04 |

### Main Flow

1. Reader visits `/` → `Hero` component renders mascot image, greeting, GitHub link
2. Reader clicks "소개" → navigates to `/about`
3. `AboutPage` server component fetches Notion content via `getNotionAboutPage()`
4. `ClientNotionRenderer` renders the page content
5. `Contact` component renders below with email and social links

### Alternative Flows
- **AF-01**: `NOTION_ABOUT_PAGE_ID` missing → throws error, error boundary shown

## UC-SITE-04: Serve SEO Resources

| Field | Value |
|-------|-------|
| ID | UC-SITE-04 |
| Actors | Search Engine, Notion API |
| Related Requirements | FR-SITE-05, FR-SITE-06 |

### Main Flow (Sitemap)

1. Crawler requests `/sitemap.xml`
2. Next.js rewrite redirects to `/api/sitemap`
3. Route handler fetches all posts via `getNotionPosts()`
4. Builds XML with hardcoded routes + dynamic post URLs
5. Returns XML response with `Content-Type: application/xml`

### Main Flow (Robots)

1. Crawler requests `/robots.txt`
2. `src/app/robots.ts` returns robots configuration
3. Allows `/`, disallows `/private/`, points to sitemap

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | **[Use Cases]** | [Sequence Diagram](sequence-diagram.md) | [Component Spec](component-spec.md) | [Test Spec](test-spec.md)
