<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->
<!-- Tech Stack: Next.js 14, TypeScript, Notion API, react-notion-x -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [User Stories →](user-stories.md)

# Post Domain — Requirements

## System Overview

The Post domain handles displaying blog posts fetched from a Notion database. It covers post listing, detail rendering, tag-based filtering, and navigation between posts. Tags are part of this domain.

### Stakeholders

| Role | Interest |
|------|----------|
| Reader | Browse, filter, and read blog posts |
| Blog Owner | Write posts in Notion, see them rendered on the blog |
| AI Agent | Maintain post-related features following FSD patterns |

## Functional Requirements

### FR-POST-01: Post List Display

| Field | Value |
|-------|-------|
| ID | FR-POST-01 |
| Priority | High |
| Description | Display a grid of published posts fetched from Notion, sorted by publish date descending |

**Acceptance Criteria**:
- Posts with status "공개" (published) are shown
- Posts are sorted by "날짜" (date) descending
- Each post card shows: cover image, title, publish date, tags, AI summary (if available)
- Responsive grid: 1 column (mobile) → 4 columns (desktop)

### FR-POST-02: Post Detail Page

| Field | Value |
|-------|-------|
| ID | FR-POST-02 |
| Priority | High |
| Description | Render full Notion page content with rich formatting at `/posts/[slug]` |

**Acceptance Criteria**:
- URL uses slugified title (via `github-slugger`)
- Notion content rendered via `react-notion-x` with code blocks, collections, equations
- Theme-aware rendering (dark/light mode)
- Static params pre-generated for all published posts (SSG)
- Metadata (title, description) generated from post data

### FR-POST-03: Tag-Based Filtering

| Field | Value |
|-------|-------|
| ID | FR-POST-03 |
| Priority | Medium |
| Description | Client-side multi-select tag filtering on the posts list page |

**Acceptance Criteria**:
- Tag filter sidebar displays all available tags from the Notion database
- Multiple tags can be selected (OR condition — post matches if it has ANY selected tag)
- Filtering happens client-side without page reload
- Empty state shown when no posts match selected tags
- Only tags that exist on published posts are shown as active

### FR-POST-04: Post Navigation

| Field | Value |
|-------|-------|
| ID | FR-POST-04 |
| Priority | Medium |
| Description | Navigate between related posts on the detail page |

**Acceptance Criteria**:
- Show up to 4 related posts (sharing tags, closest by publish date)
- Display in a 2-column grid below the post content
- Each related post shows icon, title, and tags

### FR-POST-05: Featured Posts (Home Page)

| Field | Value |
|-------|-------|
| ID | FR-POST-05 |
| Priority | Medium |
| Description | Display all posts in a grid on the home page |

**Acceptance Criteria**:
- Home page shows `FeaturedPosts` component with all published posts
- ISR revalidation at 180 seconds

## Non-Functional Requirements

### NFR-POST-01: Performance

- ISR revalidation: 180s for list pages, configurable for detail pages
- Server-side caching via `nextServerCache()` for Notion API calls
- Static generation of all post detail pages at build time

### NFR-POST-02: Data Integrity

- Post and Tag domain models use protected constructors with type guards
- Invalid Notion responses throw descriptive errors
- Slug mapping supports both slugified titles and raw Notion IDs

## Constraints

| Type | Constraint |
|------|-----------|
| Technical | Notion database properties use Korean names (제목, 날짜, 상태, Tags) |
| Technical | Two Notion clients required: official for queries, unofficial for rendering |
| Architecture | Post entity in `src/entities/post/`, post features in `src/features/post/` + `src/features/tag/` |

## Requirements Traceability

| Requirement | User Stories | Use Cases |
|-------------|-------------|-----------|
| FR-POST-01 | US-01 | UC-POST-01 |
| FR-POST-02 | US-02 | UC-POST-02 |
| FR-POST-03 | US-03 | UC-POST-03 |
| FR-POST-04 | US-04 | UC-POST-04 |
| FR-POST-05 | US-01 | UC-POST-01 |

> **All Documents**
> **[Requirements]** | [User Stories](user-stories.md) | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [Component Spec](../workflows/component-spec.md) | [Test Spec](../workflows/test-spec.md)
