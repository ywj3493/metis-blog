# Commit Message Convention

## TL;DR (Quick Reference)

**Format**: `<type>: <한글 요약>`

**Common Types**: `feat`, `fix`, `style`, `chore`, `docs`, `test`, `seo`, `perf`

**Rules**:

- 요약은 한글로 작성
- 72자 이하, 마침표 없음
- 이슈 참조: `(refs issue087)`

**Examples**:

```bash
feat: AI 요약 생성 기능 추가
fix: 모바일 헤더 반응형 레이아웃 적용
chore: AI 스타일 요약으로 업데이트
```

---

## When to Use This Document

Use this document when you need to:

- **Making a commit right now?** → See [TL;DR](#tldr-quick-reference) above
- **Choosing the right commit type?** → See [Commit Types](#commit-types)
- **Writing multi-line commit messages?** → See [Multi-line Commit Messages](#multi-line-commit-messages)
- **Referencing issues in commits?** → See [Issue References](#issue-references)
- **Unsure what makes a good commit?** → See [What Not to Commit](#what-not-to-commit)
- **Learning commit best practices?** → See [Commit Atomicity](#commit-atomicity)

**Related Documents**:

- Creating branches/PRs? → [branching-strategy.md](./branching-strategy.md)
- Need to know branch naming? → Format matches commit type (e.g., `feat/086-description`)

---

## Format

All commit messages follow a conventional commit-inspired format:

```text
<type>: <present-tense summary>
```

**Rules**:
- Use lowercase for type
- One space after colon
- Present tense in summary (e.g., "add" not "added", "fix" not "fixed")
- Summary should complete the sentence: "This commit will..."
- Keep summary under 72 characters for readability
- No period at end of summary

## Commit Types

### `feat`: New Feature

Adding new user-facing functionality or capability.

**Examples**:
```text
feat: add AI summary generation for blog posts
feat: implement tag filtering on posts page
feat: create guestbook submission form
```

**When to use**:
- New UI component that users interact with
- New API endpoint
- New page or route
- Feature that appears in release notes

### `fix`: Bug Fix

Correcting incorrect behavior or resolving an issue.

**Examples**:
```text
fix: apply mobile header responsive styling
fix: resolve cache invalidation after summary update
fix: correct Notion property name for Korean tags
```

**When to use**:
- Fixing broken functionality
- Resolving runtime errors
- Correcting visual bugs
- Patching security vulnerabilities

### `style`: Visual/UI Changes

Modifying appearance without changing functionality.

**Examples**:
```text
style: update post card hover effect
style: adjust spacing in guestbook form
style: improve dark mode contrast ratios
```

**When to use**:
- CSS/styling adjustments
- Layout refinements
- Theme improvements
- Visual polish (shadows, borders, colors)

**Not for**: Code formatting (use `chore` instead)

### `chore`: Maintenance Tasks

Internal tasks that don't affect user-facing behavior.

**Examples**:
```text
chore: update dependencies to latest versions
chore: clean up unused imports
chore: format code with Biome
chore: reorganize component file structure
```

**When to use**:
- Dependency updates
- Code formatting/cleanup
- File reorganization
- Removing unused code
- Refactoring without behavior change

### `lint`: Linting Fixes

Addressing linter errors or warnings.

**Examples**:
```text
lint: fix ESLint warnings in post components
lint: resolve TypeScript strict mode errors
lint: apply Biome formatting rules
```

**When to use**:
- Fixing linter errors
- Resolving type errors
- Applying auto-fixes from linting tools

**Note**: Often combined with `chore` if part of larger cleanup

### `config`: Configuration Changes

Modifying project configuration files.

**Examples**:
```text
config: add environment variable for local LLM
config: update Tailwind safelist for dynamic colors
config: enable SWC minification in Next.js
```

**When to use**:
- Changing `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json`
- Updating `.env` templates
- Modifying build tool configuration
- Adjusting linter/formatter settings

### `perf`: Performance Improvements

Optimizing code or resource usage without changing functionality.

**Examples**:
```text
perf: implement ISR caching for post queries
perf: optimize image loading with Next.js Image
perf: reduce bundle size by lazy loading components
```

**When to use**:
- Caching improvements
- Database query optimization
- Bundle size reduction
- Rendering performance enhancements

### `seo`: SEO Improvements

Enhancing search engine optimization.

**Examples**:
```text
seo: add Open Graph meta tags to post pages
seo: generate dynamic sitemap from Notion posts
seo: implement structured data for blog posts
seo: permanent redirect for renamed post URL
```

**When to use**:
- Meta tag additions/updates
- Sitemap changes
- Structured data (JSON-LD)
- URL redirects
- robots.txt modifications

### `docs`: Documentation Updates

Changes to documentation files only.

**Examples**:
```text
docs: add architecture specification document
docs: update README with environment variables
docs: align issue numbering baseline to 085
docs: create testing policy document
```

**When to use**:
- Adding/updating markdown docs
- README changes
- Code comments (if significant)
- Documentation corrections

**Not for**: Code changes (even if updating related comments)

### `test`: Testing Changes

Adding or modifying tests.

**Examples**:
```text
test: add unit tests for Post model creation
test: implement MSW handlers for Notion API
test: add regression test for cache invalidation
```

**When to use**:
- New test files
- Updating existing tests
- Test configuration changes
- Mock/fixture updates

## Multi-Scope Commits

If a commit touches multiple areas, choose the **primary** type:

**Example**: Adding feature with tests and docs
```text
feat: add AI summary generation
```
Not: ~~`feat+test+docs: add AI summary generation`~~

**Guideline**: Choose the type that best describes the **main purpose** of the commit.

## Issue References

When working on an issue document, reference it in the commit message:

**Format**:
```text
<type>: <summary> (refs issue0XX)
```

**Examples**:
```text
feat: add AI summary cache (refs issue085)
fix: resolve mobile header layout (refs issue086)
docs: update architecture specification (refs issue087)
```

**Note**: Use `(refs issue0XX)` not `#XX` to clearly identify issue document vs. GitHub issue number.

## Breaking Changes

For breaking changes (rare in this project), add `!` after type:

```text
feat!: migrate to new Notion API version
config!: change environment variable naming scheme
```

Add explanation in commit body (see Multi-line Messages below).

## Multi-line Commit Messages

For complex commits, use body and footer:

```text
<type>: <summary>

<body: detailed explanation>

<footer: references, breaking changes>
```

**Example**:
```text
feat: add AI summary generation

Implement on-demand AI summary generation for blog posts using
OpenAI in production and local LLM in development. Summaries are
stored in Notion "요약" property for persistence.

refs issue085
```

**When to use**:
- Complex features requiring explanation
- Breaking changes (explain migration path)
- Non-obvious implementation decisions

## What Not to Commit

Avoid these patterns:

**Bad: Vague summary**
```text
fix: fix bug
chore: update stuff
feat: improvements
```

**Good: Specific summary**
```text
fix: resolve cache invalidation after AI summary update
chore: update dependencies to patch security vulnerabilities
feat: add tag filtering to posts page
```

**Bad: Past tense**
```text
feat: added AI summary button
fix: fixed mobile header
```

**Good: Present tense**
```text
feat: add AI summary button
fix: resolve mobile header layout issue
```

**Bad: Multiple unrelated changes**
```text
feat: add guestbook and fix header and update deps
```

**Good: Separate commits**
```text
feat: add interactive guestbook form
fix: resolve mobile header responsive layout
chore: update dependencies to latest versions
```

## Commit Atomicity

### One Logical Change Per Commit

Each commit should represent a single logical change:

**Good example** (atomic commits):
1. `feat: add guestbook form component`
2. `feat: implement guestbook API route`
3. `feat: create guestbook display page`
4. `test: add guestbook submission tests`

**Bad example** (non-atomic):
1. `feat: add entire guestbook feature with tests and styling`

### Commit Frequently

Prefer smaller, focused commits over large, monolithic ones:

- Easier to review
- Simpler to revert if needed
- Clearer history
- Better git bisect for debugging

## Reviewing Commit History

Use `git log` to verify commit message quality before pushing:

```bash
git log --oneline
```

**Expected format**:
```text
f1e7a2a docs: align issue numbering baseline
1e77a36 chore: fix post card style
a1f3ccb chore: update to more AI-style summary
2a24861 seo: permanent redirect for b2b post
2e5fb71 fix: apply mobile header
```

## Amending Commits

If you make a mistake in the most recent commit (not yet pushed):

```bash
# Fix the mistake in code
git add .
git commit --amend --no-edit  # Keep same message
```

Or update the message:

```bash
git commit --amend  # Opens editor to revise message
```

**Warning**: Never amend commits that have been pushed to shared branches.

## Examples from Project History

Real examples from this project's git history:

```text
f1e7a2a docs: align issue numbering baseline
1e77a36 chore: fix post card style
a1f3ccb chore: update to more AI-style summary
2a24861 seo: permanent redirect for b2b post
2e5fb71 fix: apply mobile header
```

Follow this established pattern for consistency.

## Tools and Automation

### Git Hooks (Future)

Consider adding commit-msg hook to validate format:
- Check type is valid
- Enforce character limit
- Verify present tense

### Commitlint (Optional)

For stricter enforcement, add `@commitlint/config-conventional`:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

Configure in `.commitlintrc.json` to match these rules.

## Summary

**Quick Reference**:
- Format: `<type>: <present-tense summary>`
- Types: `feat`, `fix`, `style`, `chore`, `lint`, `config`, `perf`, `seo`, `docs`, `test`
- Present tense, lowercase type, concise summary
- Reference issues: `(refs issue0XX)`
- Keep commits atomic and focused

Good commit messages make collaboration easier and history more valuable.
