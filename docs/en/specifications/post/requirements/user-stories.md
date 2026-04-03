<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->
<!-- @reference: [requirements](requirements.md) | [use-cases](../workflows/use-cases.md) -->

> [← Requirements](requirements.md) | [Use Cases →](../workflows/use-cases.md)

# Post Domain — User Stories

## US-01: Browse Posts

**As a** reader,
**I want to** see a grid of blog posts on the home and posts pages,
**So that** I can discover content that interests me.

### Acceptance Criteria

- [ ] **AC-US01-01**: Given published posts exist in Notion, When I visit the home page, Then I see all posts in a responsive grid sorted by date
- [ ] **AC-US01-02**: Given a post has a cover image, When the post card renders, Then the cover image is displayed with proper aspect ratio
- [ ] **AC-US01-03**: Given a post has an AI summary, When the post card renders, Then the summary is shown on the card

| NFR | Metric |
|-----|--------|
| Page load | < 3s on 3G |
| ISR | 180s revalidation |

## US-02: Read a Post

**As a** reader,
**I want to** click on a post card and see the full Notion content,
**So that** I can read the complete article with proper formatting.

### Acceptance Criteria

- [ ] **AC-US02-01**: Given I click a post card, When the detail page loads, Then the full Notion content is rendered with code blocks, images, and equations
- [ ] **AC-US02-02**: Given I have dark mode enabled, When viewing a post, Then the content renders in dark theme
- [ ] **AC-US02-03**: Given the post URL uses a slug, When I access `/posts/<slug>`, Then the correct post is resolved and displayed

| NFR | Metric |
|-----|--------|
| SSG | All posts pre-rendered at build time |
| SEO | Title and description in metadata |

## US-03: Filter Posts by Tag

**As a** reader,
**I want to** filter posts by selecting one or more tags,
**So that** I can find posts about specific topics.

### Acceptance Criteria

- [ ] **AC-US03-01**: Given I am on the posts page, When I click a tag in the sidebar, Then only posts with that tag are shown
- [ ] **AC-US03-02**: Given I select multiple tags, When filtering is applied, Then posts matching ANY selected tag are shown (OR logic)
- [ ] **AC-US03-03**: Given no posts match my selected tags, When filtering is applied, Then an empty state message is displayed
- [ ] **AC-US03-04**: Given I deselect all tags, When filtering is applied, Then all posts are shown again

| NFR | Metric |
|-----|--------|
| UX | Instant filtering (no network request) |

## US-04: Navigate Between Posts

**As a** reader,
**I want to** see related posts at the bottom of a post detail page,
**So that** I can continue reading similar content.

### Acceptance Criteria

- [ ] **AC-US04-01**: Given I am reading a post, When I scroll to the bottom, Then I see up to 4 related posts sharing similar tags
- [ ] **AC-US04-02**: Given related posts are shown, When I click one, Then I navigate to that post's detail page

| NFR | Metric |
|-----|--------|
| Relevance | Posts with shared tags, sorted by date proximity |

## Story-Requirement Traceability

| User Story | Requirements | AC Count |
|-----------|-------------|----------|
| US-01 | FR-POST-01, FR-POST-05 | 3 |
| US-02 | FR-POST-02 | 3 |
| US-03 | FR-POST-03 | 4 |
| US-04 | FR-POST-04 | 2 |

> **All Documents**
> [Requirements](requirements.md) | **[User Stories]** | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [Component Spec](../workflows/component-spec.md) | [Test Spec](../workflows/test-spec.md)
