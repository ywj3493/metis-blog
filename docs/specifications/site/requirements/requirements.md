# Site Domain Requirements

This document specifies the functional requirements for the Site domain, which encompasses theme management, profile display, about page, contact information, SEO optimization, and analytics integration.

## Overview

The Site domain handles cross-cutting concerns that affect the entire blog experience. Unlike feature-specific domains (Posts, Guestbook), this domain manages global UI elements, user preferences, and technical optimizations that improve discoverability and performance.

## Functional Requirements

### FR-SITE-001: Theme System

**Description**: Support light and dark themes with automatic detection and manual toggle.

**Acceptance Criteria**:
- Detect system theme preference on first visit
- Provide accessible theme toggle control in header
- Persist theme choice in browser storage
- Apply smooth transition between themes (no flash)
- Ensure all UI elements are theme-aware

**Theme States**:
| State | Trigger | Persistence |
|-------|---------|-------------|
| System default | First visit | None |
| Light | User selection | localStorage |
| Dark | User selection | localStorage |

**Technical Implementation**:
- Library: `next-themes`
- Provider: `ThemeProvider` in root layout
- Toggle: `ThemeToggle` component in header
- CSS: Tailwind `dark:` modifiers

**Related Components**:
- `src/entities/theme/hooks/theme-provider.tsx`
- `src/entities/theme/ui/theme-toggle.tsx`

---

### FR-SITE-002: Profile/Hero Section

**Description**: Display blog owner introduction on the home page.

**Acceptance Criteria**:
- Show profile image (mascot)
- Display greeting message
- Include brief blog description
- Provide link to GitHub repository
- Responsive layout for all screen sizes

**Content**:
| Element | Content |
|---------|---------|
| Image | `/mascot.png` (240x240) |
| Greeting | "안녕하세요. 메티입니다." |
| Description | Blog purpose explanation |
| CTA | GitHub repository link |

**Related Components**:
- `src/features/profile/ui/hero.tsx`

---

### FR-SITE-003: About Page

**Description**: Provide detailed information about the blog owner with rich content from Notion.

**Acceptance Criteria**:
- Render full Notion page content
- Preserve all rich formatting (text, images, code blocks)
- Display contact information
- Keep content synchronized with Notion source
- Apply ISR caching for performance

**Data Source**:
- Notion page via `NOTION_ABOUT_PAGE_ID`
- Unofficial Notion client for rich rendering

**Related Components**:
- `src/app/about/page.tsx`
- `src/entities/notion/model/index.ts` (`getNotionAboutPage`)

---

### FR-SITE-004: Contact Display

**Description**: Show contact information and social links for visitors to reach the blog owner.

**Acceptance Criteria**:
- Display email address
- Show social media links (GitHub, etc.)
- Accessible and clearly visible placement
- Links open in new tab

**Contact Methods**:
| Method | Location | Link |
|--------|----------|------|
| GitHub | Header, Hero | https://github.com/ywj3493 |
| Repository | Hero | https://github.com/ywj3493/metis-blog |

**Related Components**:
- `src/features/profile/ui/contact.tsx`

---

### FR-SITE-005: SEO Optimization

**Description**: Optimize the blog for search engine discoverability.

**Acceptance Criteria**:
- Generate unique meta tags for each page
- Provide Open Graph tags for social sharing
- Create dynamic sitemap with all published posts
- Submit structured data (JSON-LD) for blog posts
- Configure Google Search Console verification

**Meta Tag Configuration**:
| Page | Title | Description |
|------|-------|-------------|
| Home | "Meti's Blog" | Blog introduction |
| Posts | "Posts - Meti's Blog" | All blog posts |
| Post Detail | "{Post Title} - Meti's Blog" | Post AI summary or excerpt |
| About | "About - Meti's Blog" | About page description |
| Guestbook | "Guestbook - Meti's Blog" | Guestbook description |

**Sitemap Structure**:
- Home page (priority: 1.0)
- About page (priority: 0.8)
- Posts list page (priority: 0.8)
- Guestbook page (priority: 0.8)
- Individual post pages (priority: 0.8)

**Related Components**:
- `src/app/api/sitemap/route.ts`
- Page-level `generateMetadata` exports

---

### FR-SITE-006: Analytics Integration

**Description**: Track site performance and visitor behavior.

**Acceptance Criteria**:
- Integrate Vercel Analytics for traffic tracking
- Enable Speed Insights for Core Web Vitals
- Privacy-friendly (no invasive tracking)
- Minimal performance impact

**Analytics Configuration**:
| Service | Purpose | Component |
|---------|---------|-----------|
| Vercel Analytics | Page views, referrers | `@vercel/analytics` |
| Speed Insights | Core Web Vitals | `@vercel/speed-insights` |
| Google Analytics | Extended tracking (optional) | `NEXT_PUBLIC_GA_ID` |

**Related Components**:
- `src/app/layout.tsx` (analytics providers)

---

## Data Model

### Theme Configuration

```typescript
// ThemeProvider configuration
type ThemeProviderProps = {
  attribute: "class";          // Apply theme via CSS class
  defaultTheme: "system";      // Respect system preference
  enableSystem: true;          // Allow system theme detection
  disableTransitionOnChange: false; // Enable smooth transitions
};
```

### Sitemap Entry

```typescript
type SitemapEntry = {
  url: string;              // Full URL
  lastModified: Date;       // Last modification date
  changeFrequency: ChangeFrequency; // Update frequency hint
  priority: number;         // Crawl priority (0.0 - 1.0)
};

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
```

---

## Non-Functional Requirements

### NFR-SITE-001: Performance

- Lighthouse score > 90 for all metrics
- First Contentful Paint < 1.5 seconds
- Theme switch should not cause layout shift
- Analytics script should not block rendering

### NFR-SITE-002: Accessibility

- Theme toggle is keyboard accessible
- Sufficient color contrast in both themes (WCAG AA)
- ARIA labels for interactive elements
- Semantic HTML structure

### NFR-SITE-003: SEO Performance

- All pages indexed within 7 days of publication
- Sitemap automatically updates with new posts
- Open Graph images display correctly on social platforms
- No duplicate content issues

### NFR-SITE-004: Privacy

- No personally identifiable information collected
- Analytics respect Do Not Track preference
- No third-party advertising trackers
- Cookie consent not required (no tracking cookies)

---

## Dependencies

### External Libraries

| Library | Purpose | Version |
|---------|---------|---------|
| `next-themes` | Theme management | ^0.2.1 |
| `@vercel/analytics` | Traffic analytics | ^1.0.0 |
| `@vercel/speed-insights` | Performance metrics | ^1.0.0 |

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NOTION_ABOUT_PAGE_ID` | About page content | Yes |
| `BLOG_URL` | Base URL for sitemap | Yes |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | No |

---

## Out of Scope

- User authentication
- Personalized content
- Multiple language support (i18n)
- Cookie consent banner
- Newsletter subscription
- Social media auto-posting
- Admin dashboard
