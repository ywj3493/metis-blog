# Posts Domain Requirements

This document specifies the functional requirements for the Posts domain, which encompasses blog post browsing, filtering, AI-powered summaries, and navigation features.

## Overview

The Posts domain is the core content delivery system of the blog. It manages the display of blog posts sourced from Notion, provides tag-based filtering for content discovery, generates AI summaries on demand, and enables seamless navigation between posts.

## Functional Requirements

### FR-POSTS-001: Post List Display

**Description**: Display all published blog posts in an organized, browsable format.

**Acceptance Criteria**:
- Fetch posts from Notion database where status (상태) equals "공개"
- Sort posts by date (날짜) in descending order (newest first)
- Display post metadata: title, date, tags, cover image, icon
- Show AI summary if available, otherwise show content excerpt
- Implement responsive grid layout (adaptive to screen size)
- Apply ISR caching with configurable revalidation period

**Data Source**:
- Notion Post Database via `getNotionPosts()`
- Cache tag: `posts`

**Related Components**:
- `src/features/posts/ui/posts-grid.tsx`
- `src/entities/posts/ui/post-card.tsx`

---

### FR-POSTS-002: Tag-Based Filtering

**Description**: Enable visitors to filter posts by selecting one or more tags.

**Acceptance Criteria**:
- Display all available tags from Notion database schema
- Allow multiple tag selection (toggle on/off)
- Filter posts using OR logic (show post if it has ANY selected tag)
- Update URL query parameters for shareable filtered views
- Show empty state when no posts match filter criteria
- Preserve filter state across page navigation (within session)

**Filter Logic**:
```
IF no tags selected:
  SHOW all posts
ELSE:
  SHOW posts WHERE post.tags INTERSECT selectedTags IS NOT EMPTY
```

**Data Source**:
- Tag options via `getNotionPostDatabaseTags()`
- Cache tag: `tags`

**Related Components**:
- `src/features/tags/ui/tag-filter.tsx`
- `src/features/posts/ui/filterable-post.tsx`

---

### FR-POSTS-003: Post Detail Rendering

**Description**: Render full blog post content with rich formatting from Notion.

**Acceptance Criteria**:
- Map URL slug to Notion page ID via slug map
- Render complete Notion page content preserving:
  - Text formatting (bold, italic, underline, strikethrough)
  - Headings (H1, H2, H3)
  - Code blocks with syntax highlighting
  - Images and embedded media
  - Tables, callouts, toggles
  - Links (internal and external)
- Display post metadata (title, date, tags)
- Show AI summary card if summary exists
- Provide "Generate Summary" button if no summary exists
- Implement proper SEO metadata (title, description, Open Graph)

**Slug Mapping**:
- Title converted to URL-safe slug via `github-slugger`
- Bidirectional mapping maintained in `getSlugMap()`

**Dual Client Architecture**:
| Client | Purpose | Token |
|--------|---------|-------|
| Official (`@notionhq/client`) | Metadata, database queries | `NOTION_KEY` |
| Unofficial (`notion-client`) | Rich content rendering | `NOTION_TOKEN_V2` |

**Related Components**:
- `src/entities/posts/ui/client-notion-renderer.tsx`
- `src/entities/posts/ui/ai-summary-card.tsx`
- `src/features/posts/ui/ai-summary-button.tsx`

---

### FR-POSTS-004: AI Summary Generation

**Description**: Generate AI-powered summaries of blog posts on user request.

**Acceptance Criteria**:
- Display "Generate Summary" button on posts without existing summary
- Show loading state during summary generation
- Generate 2-sentence summary capturing main points
- Store generated summary in Notion "summary" property
- Display summary in dedicated card component after generation
- Invalidate relevant caches after successful generation
- Handle errors gracefully with user-friendly messages
- Prevent duplicate generation (check `isSummarized` flag)

**LLM Configuration**:
| Environment | Provider | Endpoint |
|-------------|----------|----------|
| Production | OpenAI | `api.openai.com` |
| Development | Local LLM | `LOCAL_AI_ENDPOINT` (e.g., Ollama) |

**API Endpoint**: `PATCH /api/posts/[postId]/summary`

**Cache Invalidation**:
- `revalidateTag('posts')`
- `revalidatePath('/posts')`
- `revalidatePath('/')`

**Related Components**:
- `src/features/posts/ui/ai-summary-button.tsx`
- `src/entities/posts/ui/ai-summary-card.tsx`
- `src/app/api/posts/[postId]/summary/route.ts`
- `src/entities/openai/model/index.ts`

---

### FR-POSTS-005: Featured Posts Display

**Description**: Showcase selected posts on the home page to highlight notable content.

**Acceptance Criteria**:
- Display featured posts grid on home page
- Show post cards with: title, summary/excerpt, date, tags, cover image
- Limit display to reasonable count (e.g., 6-9 posts)
- Link each card to full post detail page
- Maintain visual consistency with posts list page

**Current Implementation**: All published posts are shown (no selection criteria).

**Related Components**:
- `src/features/posts/ui/featured-post.tsx`
- `src/entities/posts/ui/post-card.tsx`
- `src/entities/posts/ui/small-post-card.tsx`

---

### FR-POSTS-006: Post Navigation

**Description**: Enable navigation between posts for continuous reading experience.

**Acceptance Criteria**:
- Show previous/next post links on post detail page
- Display related posts based on shared tags
- Sort navigation suggestions by:
  1. Tag similarity (more shared tags = higher priority)
  2. Date proximity (closer dates = higher priority)
- Handle edge cases (first post has no previous, last has no next)

**Related Components**:
- `src/features/posts/ui/post-navigator.tsx`

---

## Data Model

### Post Entity

```typescript
interface IPost {
  id: string;              // Notion page ID
  title: string;           // Post title (제목)
  slugifiedTitle: string;  // URL-safe slug
  tags: ITag[];            // Associated tags
  cover: string;           // Cover image URL
  icon: string;            // Icon image URL (default: /mascot.png)
  publishTime: string;     // Publication date (날짜)
  lastEditedTime: string;  // Last modification timestamp
  aiSummary: string;       // AI-generated summary (empty if not generated)
}
```

### Tag Entity

```typescript
interface ITag {
  id: string;          // Notion tag ID
  name: string;        // Tag display name
  color: string;       // Notion color value
  description?: string; // Optional description
}
```

### Notion Property Mapping

| Domain Property | Notion Property (Korean) | Notion Type |
|-----------------|--------------------------|-------------|
| title | 제목 | title |
| tags | Tags | multi_select |
| publishTime | 날짜 | date |
| status | 상태 | status |
| aiSummary | summary | rich_text |
| cover | cover | external URL |
| icon | icon | external URL |

---

## Non-Functional Requirements

### NFR-POSTS-001: Performance

- Post list page load < 2 seconds
- Post detail page load < 3 seconds (includes rich content)
- ISR revalidation: 30s (dev) / 300s (prod)
- Client-side filtering response < 100ms

### NFR-POSTS-002: Caching Strategy

- Server-side: Next.js `unstable_cache` with tags
- Cache tags: `posts`, `tags`
- Manual invalidation after data mutations

### NFR-POSTS-003: SEO

- Unique meta titles and descriptions per post
- Open Graph images from post cover
- Structured data (JSON-LD) for blog posts
- Sitemap inclusion for all published posts

### NFR-POSTS-004: Accessibility

- Keyboard navigation for tag filter
- Alt text for cover images
- Semantic heading hierarchy in post content
- ARIA labels for interactive elements

---

## Dependencies

### External Services
- Notion API (official and unofficial clients)
- OpenAI API (production) / Local LLM (development)

### Internal Modules
- `src/shared/lib/cache.ts` - Caching wrapper
- `src/shared/config/index.ts` - ISR configuration

---

## Out of Scope

- Full-text search across posts
- Post reactions/likes
- Comment system
- RSS feed generation
- Multi-author attribution
