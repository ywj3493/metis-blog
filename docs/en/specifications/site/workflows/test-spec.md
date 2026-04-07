<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [component-spec](component-spec.md) | [requirements](../requirements/requirements.md) -->

> [← Component Spec](component-spec.md)

# Site Domain — Test Specification

## Test Type Definitions

| Type | Scope | Mock Strategy |
|------|-------|---------------|
| Unit | `robots.ts` config, sitemap XML builder | No mocks |
| Integration | API routes (sitemap), About page data fetch | MSW for Notion |
| E2E | Theme toggle, navigation, About page rendering | MSW for externals |

## Test Matrix

| Test ID | Source | Reference | Type | Description | Priority |
|---------|--------|-----------|------|-------------|----------|
| T-001 | FR-SITE-01 | AC-US01-01 | E2E | `ThemeToggle` switches theme on click | P0 |
| T-002 | FR-SITE-01 | AC-US01-02 | E2E | Theme persists across page reloads | P1 |
| T-003 | FR-SITE-01 | AC-US01-03 | E2E | System theme used when no preference is set | P1 |
| T-004 | FR-SITE-01 | AC-US01-04 | Unit | `ThemeToggle` shows loading dot before mount | P0 |
| T-005 | FR-SITE-02 | AC-US02-01 | E2E | `Header` renders logo, nav, theme toggle | P0 |
| T-006 | FR-SITE-02 | AC-US02-02 | E2E | Nav links navigate to correct routes | P0 |
| T-007 | FR-SITE-03 | AC-US03-01 | E2E | `Hero` renders mascot, greeting, GitHub link | P1 |
| T-008 | FR-SITE-04 | AC-US03-02 | Integration | `AboutPage` fetches and renders Notion content | P0 |
| T-009 | FR-SITE-04 | AC-US03-03 | E2E | `Contact` shows email and social links | P1 |
| T-010 | FR-SITE-05 | AC-US04-01 | Integration | `GET /api/sitemap` returns valid XML with all post URLs | P0 |
| T-011 | FR-SITE-05 | — | Integration | Sitemap includes hardcoded routes with correct priorities | P1 |
| T-012 | FR-SITE-05 | — | Integration | Sitemap response uses `Content-Type: application/xml` | P1 |
| T-013 | FR-SITE-06 | AC-US04-02 | Unit | `robots.ts` allows `/`, disallows `/private/` | P0 |
| T-014 | FR-SITE-06 | — | Unit | `robots.ts` includes sitemap reference | P1 |
| T-015 | FR-SITE-07 | — | Integration | `RootLayout` wraps children in `ThemeProvider` and `TooltipProvider` | P1 |
| T-016 | FR-SITE-07 | — | Integration | `RootLayout` renders `Header` above main | P1 |

## Priority Legend

| Priority | Meaning |
|----------|---------|
| P0 | Must pass — blocks release |
| P1 | Should pass — important functionality |
| P2 | Nice to have — edge cases |

## Test File Structure

```
src/
├── features/theme/ui/
│   └── theme-toggle.test.tsx          # T-001 ~ T-004 (E2E + unit)
├── widgets/ui/
│   └── header.test.tsx                # T-005, T-006 (E2E)
├── features/profile/ui/
│   ├── hero.test.tsx                  # T-007 (E2E)
│   └── contact.test.tsx               # T-009 (E2E)
├── app/about/
│   └── page.test.tsx                  # T-008 (integration)
├── app/api/sitemap/
│   └── route.test.ts                  # T-010 ~ T-012 (integration)
├── app/
│   ├── robots.test.ts                 # T-013, T-014 (unit)
│   └── layout.test.tsx                # T-015, T-016 (integration)
```

## Mocking Boundaries

| Test Type | Notion | next-themes | Network |
|-----------|--------|-------------|---------|
| Unit | — | — | — |
| Integration | MSW handler | — | — |
| E2E | MSW handler | Real (next-themes) | MSW |

## Test-Requirement Traceability

| Requirement | User Story | Use Case | Test IDs | Coverage |
|-------------|-----------|----------|----------|----------|
| FR-SITE-01 | US-01 | UC-SITE-01 | T-001 ~ T-004 | Full |
| FR-SITE-02 | US-02 | UC-SITE-02 | T-005, T-006 | Full |
| FR-SITE-03 | US-03 | UC-SITE-03 | T-007 | Partial |
| FR-SITE-04 | US-03 | UC-SITE-03 | T-008, T-009 | Full |
| FR-SITE-05 | US-04 | UC-SITE-04 | T-010 ~ T-012 | Full |
| FR-SITE-06 | US-04 | UC-SITE-04 | T-013, T-014 | Full |
| FR-SITE-07 | US-01, US-02 | UC-SITE-01, UC-SITE-02 | T-015, T-016 | Partial |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | [Sequence Diagram](sequence-diagram.md) | [Component Spec](component-spec.md) | **[Test Spec]**
