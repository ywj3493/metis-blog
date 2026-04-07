<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [requirements](requirements.md) | [use-cases](../workflows/use-cases.md) -->

> [← Requirements](requirements.md) | [Use Cases →](../workflows/use-cases.md)

# Site Domain — User Stories

## US-01: Toggle Theme

**As a** reader,
**I want to** switch between light and dark mode,
**So that** I can read the blog comfortably regardless of ambient lighting.

### Acceptance Criteria

- [ ] **AC-US01-01**: Given the page is loaded, When I click the theme toggle, Then the theme changes immediately
- [ ] **AC-US01-02**: Given I refresh the page, When the page loads, Then my last theme choice is preserved
- [ ] **AC-US01-03**: Given I have not chosen a theme, When the page loads, Then the system theme is used as default
- [ ] **AC-US01-04**: Given the component is mounting, When hydration runs, Then a loading dot is shown to prevent mismatch

## US-02: Navigate the Site

**As a** reader,
**I want to** access the main sections from a top navigation bar,
**So that** I can quickly move between About, Posts, and Guestbook.

### Acceptance Criteria

- [ ] **AC-US02-01**: Given any page, When I look at the top, Then I see logo, navigation menu, and theme toggle
- [ ] **AC-US02-02**: Given I click "소개", "방명록", or "포스트", When the link is followed, Then I navigate to the correct page

## US-03: View Profile and About

**As a** reader,
**I want to** learn about the blog owner via the home hero and About page,
**So that** I understand who is writing the content.

### Acceptance Criteria

- [ ] **AC-US03-01**: Given I visit `/`, When the page loads, Then I see the Hero with mascot, greeting, and GitHub link
- [ ] **AC-US03-02**: Given I visit `/about`, When the page loads, Then I see the Notion-rendered profile content
- [ ] **AC-US03-03**: Given I am on `/about`, When I scroll, Then I see the Contact section with email and social links

## US-04: SEO and Discovery

**As a** search engine,
**I want to** discover all blog content via sitemap and follow robots rules,
**So that** the blog is properly indexed.

### Acceptance Criteria

- [ ] **AC-US04-01**: Given a crawler requests `/sitemap.xml`, When the route resolves, Then it returns XML with all post URLs
- [ ] **AC-US04-02**: Given a crawler requests `/robots.txt`, When the route resolves, Then it returns rules pointing to the sitemap

## Story-Requirement Traceability

| User Story | Requirements | AC Count |
|-----------|-------------|----------|
| US-01 | FR-SITE-01, FR-SITE-07 | 4 |
| US-02 | FR-SITE-02, FR-SITE-07 | 2 |
| US-03 | FR-SITE-03, FR-SITE-04 | 3 |
| US-04 | FR-SITE-05, FR-SITE-06 | 2 |

> **All Documents**
> [Requirements](requirements.md) | **[User Stories]** | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [Component Spec](../workflows/component-spec.md) | [Test Spec](../workflows/test-spec.md)
