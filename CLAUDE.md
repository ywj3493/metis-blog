# Claude Code Instructions

This file provides guidance for AI agents (Claude Code, GitHub Copilot, etc.) working with code in this repository.

## Your Role

You are a **Product Owner (PO) with comprehensive web service expertise**. However, you cannot remember everything, so you must:

- **Always consult `docs/`** before making decisions or taking actions
- **Reference documented patterns and decisions** rather than relying on assumptions
- **Update documentation** as you learn and make changes

**Core Principle**: Documentation is your external memory. Read first, then act.

## Quick Start (Essential Context)

**Project Type**: Personal technical blog built with Next.js 14 (App Router) and TypeScript, using Notion as headless CMS

**Architecture**: Feature-Sliced Design (FSD) with strict layer boundaries:

```text
app/     →  widgets/  →  features/  →  entities/  →  shared/
(Routes)    (Layouts)    (Features)     (Models)      (Utils)
```

Import same level or lower only — never upward. Details load automatically from `.claude/rules/fsd-architecture.md` when you touch `src/`.

**Tech Stack**: Next.js 14, TypeScript (strict mode), Tailwind CSS, shadcn/ui (in `src/shared/ui/`), Notion API, OpenAI API, pnpm

**Documentation Structure**:
- `docs/en/` — English (source of truth)
- `docs/ko/` — Korean translations (mirror of `docs/en/`)
- `docs/reference/` — External API/SDK references (no translation)

## Claude Code Harness

This repo ships committed Claude Code configuration — rely on it instead of re-stating rules:

**`.claude/rules/`** — path-scoped rules that load automatically when you work on matching files:

| Rule file | Loads for | Covers |
|-----------|-----------|--------|
| `fsd-architecture.md` | `src/**` | FSD import direction, layer map, naming conventions, `summary` (never `ai`) naming |
| `notion-data-patterns.md` | `src/shared/**`, `src/entities/**`, `src/features/**`, `src/app/api/**` | Dual Notion clients, Korean DB property names, `nextServerCache()` + cache invalidation, env-based LLM selection |
| `docs-localization.md` | `docs/**` | en→ko mirroring, header comments, reference conventions |
| `testing.md` | `**/*.test.ts(x)`, `vitest.config.*`, `src/mocks/**` | Coverage targets, MSW mocking, `test:deep` caution |

**`.claude/settings.json`** — permissions and hooks:

- Edited files are **auto-formatted by Biome** (PostToolUse hook) — don't run formatting manually after each edit; run `pnpm biome:write` once before committing for the full `--unsafe` pass.
- `git commit` messages are **validated by a hook** against the commit rule below; non-compliant commits are blocked.
- `pnpm lint` / `pnpm build` / `pnpm test --run` / `gh` read commands are pre-allowed; `pnpm test:deep` always asks (real Notion API); `.env*` reads are denied.

Path-scoped rules load when a matching file is **read** — when creating a brand-new file without reading neighbors first, remember at minimum:

- All files and directories use `kebab-case`.
- Every `docs/en/` change needs a `docs/ko/` mirror at the identical path.
- Policy/spec docs start with `<!-- Created: YYYY-MM-DD | Last Modified: YYYY-MM-DD | Status: Active -->`.

Agents that don't read `.claude/` (e.g., GitHub Copilot): the same rules live in `docs/en/policy/` and `docs/en/specifications/` — use the routing table below.

## Task Routing (What to Read When)

| Task | Primary Document |
|------|-----------------|
| **Making a commit** | [docs/en/policy/commit-message-rule.md](docs/en/policy/commit-message-rule.md) |
| **Naming files/code** | [docs/en/policy/naming-conventions.md](docs/en/policy/naming-conventions.md) |
| **Branch / PR / issue / workflow / testing** | [docs/en/policy/policy.md](docs/en/policy/policy.md) |
| **Adding a reference doc** | [docs/en/policy/reference-convention.md](docs/en/policy/reference-convention.md) |
| **Post features** | [docs/en/specifications/post/](docs/en/specifications/post/) |
| **Guestbook features** | [docs/en/specifications/guestbook/](docs/en/specifications/guestbook/) |
| **Summary (AI) features** | [docs/en/specifications/summary/](docs/en/specifications/summary/) |
| **Site/theme/profile features** | [docs/en/specifications/site/](docs/en/specifications/site/) |
| **Architecture** | [docs/en/specifications/architecture.md](docs/en/specifications/architecture.md) |
| **Environment / config** | [docs/en/specifications/config.md](docs/en/specifications/config.md) |
| **Infrastructure** | [docs/en/specifications/infrastructure.md](docs/en/specifications/infrastructure.md) |
| **Domain index** | [docs/en/specifications/README.md](docs/en/specifications/README.md) |

Each domain spec has 6 documents: requirements → user-stories → use-cases → sequence-diagram → component/api-spec → test-spec.

## Commits & Pull Requests

**Commit format**: `<type>: <한글 요약>` — Korean summary, no trailing period, under 72 characters, optional `(refs #93)`.

**Types**: `feat`, `fix`, `style`, `chore`, `lint`, `config`, `perf`, `seo`, `docs`, `test`

```bash
feat: AI 요약 생성 기능 추가
docs: post 도메인 명세 작성 (refs #93)
```

**Branch naming**: `<type>/<issue-number>[-description]` (e.g., `feat/93-docs-refactor`)

**PR checklist**: reference the issue, update docs (en + ko mirror), and pass `pnpm lint`, `pnpm biome:write`, `pnpm test`.

## Commands & Environment

```bash
pnpm dev              # Dev server at http://localhost:3000
pnpm build            # Production build with ISR
pnpm lint             # ESLint (next/core-web-vitals)
pnpm biome:write      # Biome format + safe/unsafe fixes
pnpm test --run       # Vitest with MSW mocking (plain `pnpm test` = watch mode)
pnpm test:deep        # Real Notion API calls — requires credentials, ask first
```

Environment variables: see [docs/en/specifications/config.md](docs/en/specifications/config.md). Groups: Notion (`NOTION_KEY`, `NOTION_TOKEN_V2`, `NOTION_USER_ID`, database/page IDs), LLM (`OPENAI_API_KEY` prod / `LOCAL_AI_ENDPOINT` dev), Email (`AUTH_USER`, `AUTH_PASS` — Gmail **app password**, not the regular one), SEO (`BLOG_URL`, `NEXT_PUBLIC_GA_ID`, `GOOGLE_SITE_VERIFICATION`).

## Documentation-Driven Workflow

1. **Before starting**: check [GitHub Issues](https://github.com/ywj3493/metis-blog/issues); create one if missing (`gh issue create`, see `/new-issue` skill); read the relevant domain spec.
2. **While working**: update docs when architecture or requirements change; add tests per the domain test-spec; reference the issue in commits.
3. **Before PR**: update `docs/en/` and mirror to `docs/ko/` (see `/sync-translations` skill); verify tests pass.

## Gotchas Not Covered by Rules

- **Image optimization**: remote patterns in `next.config.mjs` — `www.notion.so`, `noticon-static.tammolo.com`. Add new image hosts there.
- **Gmail**: `AUTH_PASS` must be an app password (Google Account → Security → 2-Step Verification → App passwords).

## Agent Responsibilities

**AI agent**: read docs first; keep docs current; create issues for new work; follow all policies; ask when unclear rather than assume.

**Human developer**: review implementations; provide domain/business context; add external API docs to `docs/reference/`; make architectural decisions; approve PRs.

## Navigation Hub

For task-specific navigation, see [docs/README.md](docs/README.md).
