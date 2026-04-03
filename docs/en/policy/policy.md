<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# Development Policy

## TL;DR

| Rule | Summary |
|------|---------|
| Language | English for docs/code, Korean for commit messages and translations |
| Docs location | `docs/en/` (English), `docs/ko/` (Korean mirror) |
| Workflow | Issue → Branch → Implementation → PR → Review → Merge |
| Code quality | TypeScript strict, Biome formatting, ESLint linting |
| Testing | Vitest + MSW; entities 80%+, API routes 80%+, features 70%+ |
| Branching | `<type>/<issue-number>[-description]` from `main` |

## Documentation Structure

```
docs/
├── en/                     # English (source of truth)
│   ├── specifications/     # Technical specifications
│   ├── issue/              # Issue tracking documents
│   └── policy/             # Development policies
├── ko/                     # Korean translations (mirror of en/)
│   ├── specifications/
│   ├── issue/
│   └── policy/
└── reference/              # External API docs (no translation)
```

### Principles

1. **English first**: Write all documentation in English under `docs/en/`
2. **Korean mirror**: Maintain translations in `docs/ko/` with identical file structure and names
3. **Single source of truth**: One document per topic, no duplication
4. **Code references stay in English**: File paths, commands, code blocks remain in English in Korean translations

## Development Workflow

### Issue-Driven Development

1. **Create issue**: GitHub Issue via `gh issue create` or local `docs/en/issue/issueNNN.md`
2. **Create branch**: `<type>/<issue-number>[-description]` (e.g., `feat/93-docs-refactor`)
3. **Implement**: Follow policies, commit incrementally
4. **Create PR**: Draft PR linked to issue, `Resolves #<number>` in body
5. **Review**: Verify against acceptance criteria
6. **Merge**: Squash or merge into `main`

### Branch Naming

| Type | Usage | Example |
|------|-------|---------|
| `feat/` | New feature | `feat/93-docs-refactor` |
| `fix/` | Bug fix | `fix/94-mobile-header` |
| `docs/` | Documentation only | `docs/95-update-readme` |
| `chore/` | Maintenance | `chore/96-deps-update` |

### Pull Request Checklist

- [ ] All commits follow [commit message rules](commit-message-rule.md)
- [ ] `pnpm lint` passes
- [ ] `pnpm biome:write` applied
- [ ] `pnpm test` passes
- [ ] Issue referenced in PR body
- [ ] Documentation updated if needed

## Code Quality Standards

### TypeScript

- **Strict mode**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- **Type guards**: Use for domain model validation
- **No `any`**: Prefer `unknown` with type narrowing

### Formatting & Linting

- **Biome**: Primary formatter (`pnpm biome:write`)
- **ESLint**: Linter with `next/core-web-vitals` config (`pnpm lint`)
- Run both before committing

### Testing

| Code Type | Coverage Target |
|-----------|----------------|
| Entities / domain models | 80%+ |
| API routes | 80%+ |
| Features with user interaction | 70%+ |
| UI components with logic | 50%+ |

**What NOT to test**: Simple presentational components, type definitions, config files, third-party wrappers without custom logic.

**Test commands**:
- `pnpm test` — Standard tests with MSW mocking
- `pnpm test:deep` — Real Notion API calls (requires credentials)

## Collaboration: Human + AI Agent

### AI Agent Responsibilities

1. Read `docs/` before implementing changes
2. Follow all policies (commits, naming, testing)
3. Create issue documents for new work
4. Update documentation when code changes
5. Ask when unclear — don't assume

### Human Responsibilities

1. Review implementations
2. Provide domain knowledge and business context
3. Add external API docs to `docs/reference/`
4. Make architectural decisions
5. Approve PRs
