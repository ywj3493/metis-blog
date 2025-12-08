# Functional Requirements

This document specifies the user-facing capabilities and functional requirements of Meti's personal technical blog.

## Overview

The blog is a content-focused platform that integrates Notion as a CMS, provides AI-powered enhancements, and offers an interactive visitor experience. All content is managed through Notion and automatically synchronized with the public website.

## Feature Requirements

### FR-001: Blog Home Page

**Description**: Greet visitors with a welcoming home page that showcases featured content and introduces the blog owner.

**User Stories**:
- As a visitor, I want to see an introduction to Meti so I understand whose blog I'm reading
- As a visitor, I want to see featured posts so I can quickly discover interesting content

**Acceptance Criteria**:
- Display hero/profile section with Meti's introduction
- Show grid of featured posts selected from Notion database
- Featured posts include title, summary, date, and tags
- Responsive design for mobile and desktop
- Theme-aware styling (light/dark mode)

**Implementation Notes**:
- Featured posts determined by specific Notion property or manual selection
- Profile content sourced from Notion "About" page

---

### FR-002: Post Browsing & Filtering

**Description**: Provide comprehensive post browsing with tag-based filtering for content discovery.

**User Stories**:
- As a visitor, I want to see all published posts so I can browse available content
- As a visitor, I want to filter posts by tag so I can find content on specific topics
- As a visitor, I want to read individual posts so I can consume the content

**Acceptance Criteria**:

**Post List Page**:
- Display all posts with "Published" status from Notion
- Show post metadata: title, date, tags, summary (if available)
- Implement tag filtering UI (select/deselect tags)
- Filter updates URL parameters for shareable links
- Responsive grid/list layout

**Post Detail Page**:
- Render full Notion page content with proper formatting
- Preserve rich content (images, code blocks, tables, etc.)
- Display post metadata (title, date, tags)
- Show AI-generated summary if available
- Provide navigation to previous/next posts
- Include share functionality

**Implementation Notes**:
- Filtering happens client-side for performance
- Uses unofficial Notion client (`react-notion-x`) for rich rendering
- ISR revalidation ensures fresh content

---

### FR-003: AI-Powered Post Summaries

**Description**: Allow readers to generate instant AI summaries of blog posts on demand.

**User Stories**:
- As a visitor, I want to request an AI summary of a post so I can quickly understand the main points
- As a returning visitor, I want to see pre-generated summaries so I don't wait for regeneration
- As the blog owner, I want summaries stored in Notion so they're accessible across platforms

**Acceptance Criteria**:
- Display "Generate Summary" button on post detail pages
- Show loading state during summary generation
- Display generated summary prominently on page
- Store summary in Notion "요약" property for persistence
- Cache summaries to avoid redundant API calls
- Handle errors gracefully with user-friendly messages

**Technical Requirements**:
- Environment-based LLM selection (OpenAI prod, local dev)
- Summary generation via API route
- Cache invalidation after summary creation
- Rate limiting to prevent abuse

**Implementation Notes**:
- Summary generation is asynchronous
- Updates Notion database via official API
- Triggers cache revalidation for immediate display

---

### FR-004: About Page

**Description**: Provide detailed information about the blog owner with contact options.

**User Stories**:
- As a visitor, I want to learn about Meti so I can understand their background and expertise
- As a visitor, I want to find contact information so I can reach out

**Acceptance Criteria**:
- Display Notion-powered "About Me" content
- Render rich content from Notion page
- Show contact links and social media
- Keep content synchronized with Notion source
- Responsive layout for all devices

**Implementation Notes**:
- Content sourced from `NOTION_ABOUT_PAGE_ID`
- Uses unofficial Notion client for rich rendering
- ISR revalidation keeps content fresh

---

### FR-005: Interactive Guestbook

**Description**: Enable visitors to leave public or private messages for the blog owner.

**User Stories**:
- As a visitor, I want to leave a message so I can share feedback or thoughts
- As a visitor, I want to choose message visibility (public/private) so I can control who sees it
- As a visitor, I want to see existing public messages so I can read others' thoughts
- As the blog owner, I want messages stored in Notion so I can manage them centrally

**Acceptance Criteria**:

**Guestbook Form**:
- Input fields: name, email (optional), message, visibility (public/private)
- Client-side validation with clear error messages
- Submit button with loading state
- Success confirmation after submission
- Form reset after successful submission

**Guestbook Display**:
- Show all public messages in chronological order
- Display message author, date, and content
- Responsive card/list layout
- Pagination or infinite scroll for many messages

**Data Storage**:
- Messages submitted to Notion guestbook database
- Store: name, email, message, visibility, timestamp
- Validate data before storage

**Implementation Notes**:
- Uses `react-hook-form` + `zod` for validation
- API route handles Notion database insertion
- Cache revalidation after submission

---

### FR-006: Contact & Email Notifications

**Description**: Provide contact options and email notifications for important interactions.

**User Stories**:
- As a visitor, I want to find contact links so I can reach Meti through my preferred channel
- As the blog owner, I want email notifications so I never miss important visitor feedback

**Acceptance Criteria**:

**Contact Section**:
- Display email, social media, GitHub links
- Quick contact form for direct messages
- Clear call-to-action for reaching out

**Email Notifications**:
- Send email alert when contact form submitted
- Send email alert for new guestbook entries (configurable)
- Include relevant message details in email
- Reliable delivery via Gmail SMTP

**Implementation Notes**:
- Email service uses `nodemailer` with Gmail
- Notifications triggered via API route
- Async processing to avoid blocking user experience

---

### FR-007: Theme System

**Description**: Support light and dark themes with automatic detection and manual toggle.

**User Stories**:
- As a visitor, I want the theme to match my system preference so it's comfortable to read
- As a visitor, I want to manually switch themes so I can override the default
- As a visitor, I want my theme choice persisted so it remains on subsequent visits

**Acceptance Criteria**:
- Detect system theme preference on first visit
- Provide theme toggle control (accessible location)
- Persist theme choice in browser storage
- Smooth transition between themes (no flash)
- All UI elements theme-aware (consistent styling)

**Theme Coverage**:
- Text colors (readable contrast ratios)
- Background colors
- Component borders and shadows
- Code block syntax highlighting
- Image backgrounds (where applicable)

**Implementation Notes**:
- Uses `next-themes` library
- Theme provider in root layout
- CSS variables for color tokens
- Tailwind `dark:` modifiers for styling

---

### FR-008: SEO & Analytics

**Description**: Optimize for search engines and track site performance.

**User Stories**:
- As the blog owner, I want organic traffic from search engines so my content reaches more readers
- As the blog owner, I want to track traffic and performance so I can understand visitor behavior
- As a visitor, I want fast page loads so I have a good reading experience

**Acceptance Criteria**:

**SEO Optimization**:
- Meta tags for each page (title, description, Open Graph)
- Canonical URLs to prevent duplicate content
- Dynamic sitemap.xml with all published posts
- Structured data for blog posts (JSON-LD)
- Google Search Console verification
- Descriptive URLs (slug-based)

**Analytics**:
- Vercel Analytics integration for traffic tracking
- Speed Insights for Core Web Vitals
- Privacy-friendly (no invasive tracking)

**Performance**:
- Lighthouse score > 90 for all metrics
- Fast initial page load (< 2s)
- Optimized images (Next.js Image component)
- Minimal JavaScript bundle size

**Implementation Notes**:
- Sitemap generated dynamically via API route
- Meta tags in page metadata exports
- Analytics components in root layout

---

### FR-009: UI Consistency & Polish

**Description**: Ensure consistent, polished user interface across all pages and features.

**User Stories**:
- As a visitor, I want a consistent look and feel so the site feels cohesive
- As a visitor, I want smooth interactions so the experience feels professional
- As a visitor on mobile, I want the site to work well on my device

**Acceptance Criteria**:

**Visual Consistency**:
- Shared UI components (buttons, tooltips, cards)
- Consistent spacing and typography
- Unified color system via CSS variables
- Icon consistency (same library throughout)

**Responsive Design**:
- Mobile-first approach
- Breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
- Touch-friendly controls on mobile
- Readable text sizes on all devices

**Accessibility**:
- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Sufficient color contrast (WCAG AA)

**Implementation Notes**:
- Tailwind CSS for consistent styling
- shadcn/ui components in `src/shared/ui/`
- Responsive design tested on real devices

---

## Non-Functional Requirements

### NFR-001: Performance

- Initial page load < 2 seconds
- Time to Interactive (TTI) < 3 seconds
- Core Web Vitals in "Good" range
- Efficient ISR caching (5-minute revalidation)

### NFR-002: Reliability

- 99.9% uptime (Vercel SLA)
- Graceful error handling (no blank pages)
- Fallback for failed API calls
- Data integrity in Notion database

### NFR-003: Security

- No exposed secrets in client code
- Environment variable validation
- HTTPS enforced for all traffic
- Safe email handling (no injection)

### NFR-004: Maintainability

- Clean FSD architecture
- Comprehensive documentation
- Type safety with TypeScript strict mode
- Automated testing for critical paths

### NFR-005: Scalability

- Support for 100+ posts without degradation
- Client-side filtering (no backend bottleneck)
- CDN caching via Vercel Edge
- Efficient image optimization

## Out of Scope

The following features are explicitly **not** included in the current requirements:

- User authentication and accounts
- Multi-author support
- Comments system (separate from guestbook)
- Full-text search across posts
- RSS feed generation
- Newsletter subscriptions
- Post reactions/likes
- Social media auto-posting
- Admin dashboard for content management (Notion serves this purpose)

These may be considered for future iterations based on user feedback and blog growth.
