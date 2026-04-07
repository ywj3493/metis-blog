<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- Tech Stack: Next.js 14, next-themes, Tailwind, Notion API -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [User Stories →](user-stories.md)

# Site Domain — Requirements

## System Overview

The Site domain handles cross-cutting site-wide concerns: theme system (dark/light mode), navigation header, profile presentation (Hero and Contact components), the About page, SEO (sitemap, robots), and root layout. This domain encompasses what would otherwise be split across "theme", "profile", and "site" features in the codebase.

## Functional Requirements

### FR-SITE-01: Theme System

| Field | Value |
|-------|-------|
| ID | FR-SITE-01 |
| Priority | High |
| Description | Provide light/dark mode toggle with system theme detection |

**Acceptance Criteria**:
- `ThemeProvider` wraps the app via `next-themes`
- System theme is detected and used as default
- `ThemeToggle` button switches between "light" and "dark"
- Theme preference persists across page reloads
- Hydration mismatch is avoided via mounted check (loading dot during mount)

### FR-SITE-02: Site Navigation Header

| Field | Value |
|-------|-------|
| ID | FR-SITE-02 |
| Priority | High |
| Description | Display top navigation bar with logo, menu, and theme toggle |

**Acceptance Criteria**:
- Header shows mascot logo and blog title
- Navigation menu: 소개 (About), 방명록 (Guestbook), 포스트 (Posts)
- Theme toggle integrated on the right
- Header is rendered in root layout, visible on all pages

### FR-SITE-03: Profile Hero Section

| Field | Value |
|-------|-------|
| ID | FR-SITE-03 |
| Priority | Medium |
| Description | Display profile hero on the home page |

**Acceptance Criteria**:
- `Hero` component shows mascot image (240x240, prioritized loading)
- Korean greeting and blog description displayed
- GitHub link button with tooltip

### FR-SITE-04: About Page

| Field | Value |
|-------|-------|
| ID | FR-SITE-04 |
| Priority | Medium |
| Description | Display blog owner profile from Notion at `/about` |

**Acceptance Criteria**:
- Fetches About page content from Notion via `getNotionAboutPage()`
- Renders content via `ClientNotionRenderer`
- `Contact` component shown below (email + GitHub/LinkedIn/Notion links)
- ISR revalidation: 180 seconds

### FR-SITE-05: Dynamic Sitemap

| Field | Value |
|-------|-------|
| ID | FR-SITE-05 |
| Priority | Medium |
| Description | Generate XML sitemap dynamically from Notion posts |

**Acceptance Criteria**:
- `GET /api/sitemap` returns XML sitemap
- Includes all published post URLs from Notion
- Hardcoded routes: `/` (priority 1.0), `/about`, `/posts`, `/guestbooks` (priority 0.8)
- Daily change frequency
- Available at `/sitemap.xml` via Next.js rewrite

### FR-SITE-06: Robots.txt

| Field | Value |
|-------|-------|
| ID | FR-SITE-06 |
| Priority | Low |
| Description | Provide robots.txt for search engine crawler control |

**Acceptance Criteria**:
- `src/app/robots.ts` generates robots configuration
- Allow `/` for all user agents
- Disallow `/private/` path
- Points to sitemap.xml location

### FR-SITE-07: Root Layout and Metadata

| Field | Value |
|-------|-------|
| ID | FR-SITE-07 |
| Priority | High |
| Description | Provide app-wide layout with fonts, providers, and analytics |

**Acceptance Criteria**:
- Pretendard font loaded locally
- `ThemeProvider` and `TooltipProvider` wrap the app
- Header rendered above main content
- Vercel Analytics and Speed Insights enabled
- Default metadata title template and description set

## Non-Functional Requirements

### NFR-SITE-01: Performance

- Hero mascot image uses Next.js Image with `priority` flag
- About page uses ISR (180s)
- Pretendard font loaded as local font (no CDN latency)

### NFR-SITE-02: Accessibility

- Tooltips for icon-only links (GitHub, LinkedIn, Notion)
- Semantic HTML in header navigation

### NFR-SITE-03: SEO

- Metadata title template, description in root layout
- Dynamic sitemap with all posts
- robots.txt with sitemap reference

## Constraints

| Type | Constraint |
|------|-----------|
| Technical | `NOTION_ABOUT_PAGE_ID` required for About page |
| Technical | `BLOG_URL` env var required for sitemap and robots |
| Architecture | Theme: `src/features/theme/`, Profile: `src/features/profile/`, Layout: `src/widgets/`, Pages: `src/app/` |

## Requirements Traceability

| Requirement | User Stories | Use Cases |
|-------------|-------------|-----------|
| FR-SITE-01 | US-01 | UC-SITE-01 |
| FR-SITE-02 | US-02 | UC-SITE-02 |
| FR-SITE-03 | US-03 | UC-SITE-03 |
| FR-SITE-04 | US-03 | UC-SITE-03 |
| FR-SITE-05 | US-04 | UC-SITE-04 |
| FR-SITE-06 | US-04 | UC-SITE-04 |
| FR-SITE-07 | US-01, US-02 | UC-SITE-01, UC-SITE-02 |

> **All Documents**
> **[Requirements]** | [User Stories](user-stories.md) | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [Component Spec](../workflows/component-spec.md) | [Test Spec](../workflows/test-spec.md)
