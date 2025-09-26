# Development Guide

## Overview
The project is a Next.js App Router application that sources content from Notion, adds AI-powered enhancements, and serves a personal blog experience. The codebase follows Feature-Sliced Design (FSD) to keep domain logic, UI composition, and shared utilities well separated.

## Repository Layout & Responsibilities
- `src/app/`: App Router routes, layouts, and API routes. Treat this layer as composition only.
- `src/entities/`: Domain models, data mappers, and low-level UI components tied to a specific entity (posts, Notion, guestbooks, theme, OpenAI).
- `src/features/`: User-facing capabilities that combine entities to solve a task (filtering posts, guestbook submission, AI summary button, alarm emails).
- `src/widgets/`: Larger layout blocks reused across screens (header, footer).
- `src/shared/`: Cross-cutting utilities, configuration, UI primitives, logging, caching.
- `src/mocks/` & `src/__test__/`: MSW handlers, testing components, and Vitest suites.

Always add new behaviour at the correct layer: entities for pure domain logic, features for task logic, widgets for layout composition, and app for route wiring.

## File & Folder Naming
- Directories and files use `kebab-case` (e.g., `ai-summary-button.tsx`, `guestbook-form.tsx`).
- Co-locate files by feature; if a component belongs to posts, keep it under `features/posts` or `entities/posts` depending on responsibility.
- Name React components in PascalCase even if the file name stays kebab-case.
- Export aggregation files use `index.ts` to keep import paths succinct.

## Commit Message Style
`git log` shows a conventional-commit-inspired format:
```
<type>: <present-tense summary>
```
Common types include `feat`, `fix`, `style`, `chore`, `lint`, `config`, `perf`, and `seo`. Follow this pattern so automated tooling and history remain consistent.

## Branching & Pull Requests
- Develop changes on a topic branch named after the issue document (e.g., `issue-012-ai-summary-cache`).
- Reference the corresponding `docs/issue/issue0XX.md` file in the pull request description.
- Keep branches focused; split unrelated work into new issues.

## Local Environment
- Node.js `22.x` and `pnpm` are required (see `package.json`).
- Install dependencies with `pnpm install`.
- Create `.env.local` by copying required keys from the policy: Notion IDs/tokens, `OPENAI_API_KEY`, `LOCAL_AI_ENDPOINT`, Gmail SMTP credentials, `BLOG_URL`, etc. Never commit secrets.
- Run the development server via `pnpm dev` (Next.js defaults to `http://localhost:3000`).
- Vitest is configured with jsdom; tests pick up env vars from `.env.local` through `vitest.config.ts`.

## Tooling & Scripts
- `pnpm lint`: Next.js ESLint rules.
- `pnpm biome:write`: Applies Biome formatting under `src/`.
- `pnpm test`: Runs Vitest suites.
- `pnpm test:deep`: Enables `DEEP_TEST` flag for extended tests.
- `pnpm build` / `pnpm start`: Production build and runtime.

Run linting and tests before pushing to ensure CI parity.

## Build & Deployment
- Production builds rely on `next build`; output is optimised for Vercel.
- ISR revalidation defaults to 30 seconds in development and 5 minutes in production (`shared/config/CACHE_CONFIG`).
- After deployment, Next.js revalidation ensures fresh post lists; manual invalidation is handled by `revalidateTag`/`revalidatePath` in the AI summary API route.
- Store secrets in the Vercel project configuration rather than `.env` files.

## Data & Integrations
- Notion: `entities/notion` wraps both the official `@notionhq/client` and unofficial `notion-client` for full page rendering.
- Posts: `entities/posts` maps raw Notion responses into typed `Post`/`Tag` models. `features/posts` composes UI such as `FeaturedPosts`, `FilterablePosts`, and `PostNavigator`.
- AI summaries: `entities/openai` chooses between OpenAI and a local endpoint depending on `NODE_ENV`.
- Email alarm: `features/alarm` uses Gmail SMTP through `nodemailer`.

## Logging, Caching, & Observability
- `shared/lib/cache.ts` exposes `nextServerCache` to wrap async functions with consistent cache tags and revalidation intervals.
- `shared/lib/logger.ts` provides `withPinoLogger` and a `NotionAPILogger` singleton that records call statistics and writes to `logs/notion-api.log` in development.
- Keep logging lightweight in production to avoid leaking sensitive data.

## Testing Philosophy
- UI tests live in `src/__test__` and rely on Testing Library user interactions (`mock.test.tsx` is an example snapshot + interaction test).
- Use MSW (`src/mocks/`) to simulate network calls without hitting Notion/OpenAI during tests.
- Add regression tests when modifying entities, caches, or API routes to avoid breaking ISR or third-party integrations.

## Documentation Updates
Whenever workflow, architecture, or build steps change, update the relevant doc:
- Policies → `docs/policy/README.md`
- Development practices → this guide
- Feature behaviour → files under `docs/feature/`
- Issue planning → `docs/issue/issue0XX.md`

Keeping documentation current is part of the definition of done for each issue.
