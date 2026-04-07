<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->

# Specifications

Technical specifications for the Metis Blog project. Each domain follows the [dev-planning](../../README.md) pipeline: requirements → user stories → use cases → sequence diagrams → domain-specific spec → test spec.

## Global Specifications

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | FSD layers, design patterns, module inventory, data flow |
| [Config](config.md) | Environment variables, app config, Notion property names |
| [Infrastructure](infrastructure.md) | Tech stack, deployment, caching, external services |

## Domain Specifications

### post

End-user facing post features: list, detail, filtering, tags, navigation, rendering.

| Stage | Document |
|-------|----------|
| Requirements | [requirements.md](post/requirements/requirements.md) |
| User Stories | [user-stories.md](post/requirements/user-stories.md) |
| Use Cases | [use-cases.md](post/workflows/use-cases.md) |
| Sequence Diagram | [sequence-diagram.md](post/workflows/sequence-diagram.md) |
| Component Spec | [component-spec.md](post/workflows/component-spec.md) |
| Test Spec | [test-spec.md](post/workflows/test-spec.md) |

**Source code**: `src/features/post/`, `src/features/tag/`, `src/entities/post/`, `src/app/posts/`

### guestbook

Guestbook CRUD with email notifications.

| Stage | Document |
|-------|----------|
| Requirements | [requirements.md](guestbook/requirements/requirements.md) |
| User Stories | [user-stories.md](guestbook/requirements/user-stories.md) |
| Use Cases | [use-cases.md](guestbook/workflows/use-cases.md) |
| Sequence Diagram | [sequence-diagram.md](guestbook/workflows/sequence-diagram.md) |
| API Spec | [api-spec.md](guestbook/workflows/api-spec.md) |
| Test Spec | [test-spec.md](guestbook/workflows/test-spec.md) |

**Source code**: `src/features/guestbook/`, `src/entities/guestbook/`, `src/entities/alarm/`, `src/app/api/guestbooks/`, `src/app/api/alarm/`

### summary

AI-generated post summaries via OpenAI/Ollama.

| Stage | Document |
|-------|----------|
| Requirements | [requirements.md](summary/requirements/requirements.md) |
| User Stories | [user-stories.md](summary/requirements/user-stories.md) |
| Use Cases | [use-cases.md](summary/workflows/use-cases.md) |
| Sequence Diagram | [sequence-diagram.md](summary/workflows/sequence-diagram.md) |
| API Spec | [api-spec.md](summary/workflows/api-spec.md) |
| Test Spec | [test-spec.md](summary/workflows/test-spec.md) |

**Source code**: `src/features/summary/`, `src/app/api/posts/[postId]/summary/`, `src/shared/api/openai.ts`

### site

Theme system, navigation, profile, About page, SEO (sitemap, robots).

| Stage | Document |
|-------|----------|
| Requirements | [requirements.md](site/requirements/requirements.md) |
| User Stories | [user-stories.md](site/requirements/user-stories.md) |
| Use Cases | [use-cases.md](site/workflows/use-cases.md) |
| Sequence Diagram | [sequence-diagram.md](site/workflows/sequence-diagram.md) |
| Component Spec | [component-spec.md](site/workflows/component-spec.md) |
| Test Spec | [test-spec.md](site/workflows/test-spec.md) |

**Source code**: `src/features/theme/`, `src/features/profile/`, `src/widgets/`, `src/app/about/`, `src/app/api/sitemap/`, `src/app/robots.ts`, `src/app/layout.tsx`

## ID System

| Document | ID Format | Example |
|----------|-----------|---------|
| Requirements | `FR-<DOMAIN>-NN`, `NFR-<DOMAIN>-NN` | `FR-POST-01`, `NFR-SITE-02` |
| User Stories | `US-NN`, `AC-USNN-NN` | `US-01`, `AC-US01-01` |
| Use Cases | `UC-<DOMAIN>-NN` | `UC-GB-01` |
| Tests | `T-NNN` | `T-001` |

## Cross-References

- All requirements link to related use cases
- All user stories link to requirements
- All use cases link to sequence diagrams
- Test specs derive test IDs from all previous documents (FR-, US-, AC-, UC-)
