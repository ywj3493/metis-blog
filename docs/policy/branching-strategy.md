# Branching Strategy

## TL;DR (Quick Reference)

**Pattern**: `<type>/<issue-number>[-description]`

**Examples**:

```bash
feat/087-add-search
fix/088-cache-invalidation
chore/86
```

**Rules**:

- Use commit types: feat, fix, chore, docs, etc.
- Include leading zero (085 not 85)
- Description optional but recommended
- Always create issue document in docs/issue/ first

**Workflow**:

1. Create docs/issue/issueXXX.md
2. Create branch: `git checkout -b <type>/<issue-number>[-desc]`
3. Work and commit following [commit-convention.md](commit-convention.md)
4. Push and create PR referencing issue document

---

## When to Use This Document

Use this document when you need to:

- **Creating a branch right now?** → See [TL;DR](#tldr-quick-reference) above
- **Understanding branch naming?** → See [Branch Naming Convention](#branch-naming-convention)
- **Creating a pull request?** → See [Pull Request Workflow](#pull-request-workflow)
- **Understanding PR templates?** → See [PR Description Template](#pr-description-template)
- **Learning merge strategies?** → See [Merge Strategies](#merge-strategies)
- **Dealing with merge conflicts?** → See [Handling Conflicts](#handling-conflicts)

**Related Documents**:

- Making commits? → [commit-convention.md](./commit-convention.md)
- Branch type matches commit type (e.g., `feat/` branch uses `feat:` commits)

---

## Branch Naming Convention

All feature and fix branches follow this pattern:

```text
<type>/<issue-number>[-description]
```

### Components

- **type**: Same types as commit messages (`feat`, `fix`, `chore`, etc.)
- **issue-number**: Issue document number (e.g., `085`, `086`, `087`)
- **description**: Optional short kebab-case description

### Examples

```text
feat/087-add-search
fix/088-cache-invalidation
chore/86
docs/089-update-architecture
perf/090-optimize-images
```

### Rules

- Use lowercase for type
- Include leading zero if issue number < 100 (e.g., `085` not `85`)
- Description is optional but recommended for clarity
- Use kebab-case for description (hyphens between words)
- Keep description short (2-4 words max)

## Branch Types

### Feature Branches

**Pattern**: `feat/<issue-number>[-description]`

**Purpose**: Develop new user-facing features

**Examples**:
```text
feat/091-guestbook-pagination
feat/092-search-functionality
feat/093-rss-feed
```

**Workflow**:
1. Create from `main` branch
2. Develop feature incrementally
3. Reference corresponding `docs/issue/issue0XX.md`
4. Create PR when ready for review

### Fix Branches

**Pattern**: `fix/<issue-number>[-description]`

**Purpose**: Resolve bugs and issues

**Examples**:
```text
fix/094-mobile-header
fix/095-notion-api-error
fix/096-dark-mode-flash
```

**Workflow**:
1. Document bug in issue document
2. Create branch from `main`
3. Fix and add regression test
4. Create PR with fix validation

### Chore Branches

**Pattern**: `chore/<issue-number>[-description]`

**Purpose**: Maintenance tasks, dependency updates, refactoring

**Examples**:
```text
chore/86
chore/097-update-deps
chore/098-refactor-cache
```

**Workflow**:
1. Create for non-user-facing changes
2. May or may not require issue document (use judgment)
3. Ensure all tests pass after changes

### Documentation Branches

**Pattern**: `docs/<issue-number>[-description]`

**Purpose**: Documentation-only changes

**Examples**:
```text
docs/089-update-architecture
docs/099-add-api-reference
```

**Workflow**:
1. Create when updating substantial documentation
2. May skip for minor typo fixes (commit directly to `main` or use fix/)

## Main Branch

### `main` Branch

**Purpose**: Production-ready code

**Protection Rules**:
- Requires pull request for changes (no direct commits)
- CI checks must pass (Biome formatting)
- Deployed automatically to production (Vercel)

**Deployment**:
- Every merge to `main` triggers production deployment
- Vercel builds and deploys automatically
- Monitor deployment for errors

## Pull Request Workflow

### Creating Pull Requests

1. **Ensure branch is up to date**:
   ```bash
   git checkout main
   git pull
   git checkout <your-branch>
   git rebase main  # or merge main into your branch
   ```

2. **Push branch to remote**:
   ```bash
   git push -u origin <your-branch>
   ```

3. **Create PR on GitHub**:
   - Base: `main`
   - Compare: `<your-branch>`
   - Title: Brief description of changes
   - Description: Link to issue document, summarize changes

### PR Title Format

Use same format as commit messages:

```text
<type>: <summary>
```

**Examples**:
```text
feat: add guestbook pagination
fix: resolve mobile header layout issue
docs: update architecture specification
```

### PR Description Template

```markdown
## Issue Reference

refs [docs/issue/issue0XX.md](../docs/issue/issue0XX.md)

## Summary

Brief description of what this PR does.

## Changes

- Bullet list of main changes
- Include file/component changes
- Note any breaking changes

## Validation

How this was tested:
- [ ] Unit tests pass (`pnpm test`)
- [ ] Manual testing completed
- [ ] Build succeeds (`pnpm build`)
- [ ] Lint and format checks pass

## Screenshots (if UI changes)

Before/after screenshots or video

## Notes

Any additional context, risks, or follow-up items
```

### PR Size Guidelines

**Prefer small PRs**:
- Easier to review
- Faster to merge
- Lower risk of conflicts
- Clearer purpose

**Target**: ~200-400 lines changed per PR

**If PR is large**:
- Split into multiple PRs if possible
- Clearly explain why size is necessary
- Provide detailed description and validation

### Linking to Issue Documents

Always reference the corresponding issue document:

**In PR description**:
```markdown
refs [docs/issue/issue087.md](../docs/issue/issue087.md)
```

**In commits**:
```text
feat: add search functionality (refs issue087)
```

## Branch Lifecycle

### 1. Create Branch

```bash
# From main branch
git checkout main
git pull
git checkout -b feat/087-add-search
```

### 2. Develop

```bash
# Make changes
git add .
git commit -m "feat: implement search index generation"

# Continue working
git add .
git commit -m "feat: add search UI component"
```

### 3. Keep Updated

Regularly sync with `main` to avoid conflicts:

```bash
git fetch origin
git rebase origin/main  # or merge origin/main
```

### 4. Push and Create PR

```bash
git push -u origin feat/087-add-search
# Create PR on GitHub
```

### 5. Address Review Feedback

```bash
# Make requested changes
git add .
git commit -m "fix: address PR feedback on search validation"
git push
```

### 6. Merge

Once approved:
- Merge via GitHub (squash and merge preferred)
- Delete branch after merge (automatic via GitHub setting)

### 7. Cleanup

```bash
git checkout main
git pull
git branch -d feat/087-add-search  # Delete local branch
```

## Branch Protection

### Required Status Checks

Before merging to `main`:
- [ ] Biome CI check passes (GitHub Actions)
- [ ] All commits follow commit convention
- [ ] PR description includes issue reference

### GitHub Actions

Current workflows:

**`pull_request.yml`**:
- Trigger: PR to `main`
- Steps: Install deps, run Biome formatting check
- Purpose: Ensure code quality

**`cleanup.yml`**:
- Trigger: PR merged or closed
- Steps: Delete associated Vercel preview deployment
- Purpose: Clean up resources

## Hotfix Workflow

For urgent production fixes:

### Option 1: Fast-Track PR

1. Create `fix/XXX-hotfix-description` branch
2. Implement minimal fix
3. Create PR with "HOTFIX" label
4. Fast-track review and merge
5. Document in issue document afterwards

### Option 2: Direct Fix (Emergency Only)

For critical production issues:

1. Fix directly in `main` (with justification)
2. Document fix immediately in issue document
3. Note deviation from normal workflow
4. Create follow-up PR with tests

**Use sparingly**: Only for truly critical issues (site down, security vulnerability)

## Stale Branches

### Branch Cleanup

Delete branches after:
- PR merged
- PR closed without merging
- 30 days of inactivity

### Automatic Cleanup

GitHub settings:
- Enable "Automatically delete head branches" after PR merge
- Vercel preview deployments cleaned up via GitHub Action

### Manual Cleanup

```bash
# List merged branches
git branch --merged main

# Delete local merged branches
git branch -d <branch-name>

# Delete remote branch
git push origin --delete <branch-name>
```

## Merge Strategies

### Squash and Merge (Preferred)

**When to use**: Most feature PRs

**Benefits**:
- Clean, linear history
- Single commit per PR
- Easier to revert

**How**:
- Use GitHub "Squash and merge" button
- Edit commit message if needed

### Rebase and Merge

**When to use**: Multiple logical commits that should be preserved

**Benefits**:
- Maintains individual commit history
- Linear history without merge commit

**How**:
- Use GitHub "Rebase and merge" button
- Ensure commits are clean and well-formatted

### Merge Commit

**When to use**: Rarely (only for complex multi-branch merges)

**Drawback**: Creates merge commits that clutter history

## Collaboration

### Working with Others

If multiple people work on same feature:

1. **Create shared branch**: `feat/087-add-search`
2. **Coordinate commits**: Communicate before pushing
3. **Pull frequently**: Stay in sync with team
4. **Use sub-branches if needed**: `feat/087-search-ui`, `feat/087-search-backend`

### Handling Conflicts

If merge conflicts occur:

```bash
git fetch origin
git rebase origin/main

# Resolve conflicts in editor
git add <resolved-files>
git rebase --continue

git push --force-with-lease
```

**Note**: Use `--force-with-lease` instead of `--force` for safety

## Branch Naming Anti-Patterns

### Don't Do This

```text
❌ feature/new-stuff
❌ fix-bug
❌ my-branch
❌ test
❌ temp
❌ wip
❌ feat/add-search-no-issue
```

### Do This Instead

```text
✅ feat/087-add-search
✅ fix/088-mobile-header
✅ chore/089-update-deps
✅ docs/090-architecture
```

## Summary

**Quick Reference**:

- Pattern: `<type>/<issue-number>[-description]`
- Types: `feat`, `fix`, `chore`, `docs`, `perf`, `seo`, `style`, `lint`, `config`, `test`
- Always create from `main` branch
- Reference issue document in PR
- Keep PRs small and focused
- Use "Squash and merge" for clean history
- Delete branches after merge

Following this strategy ensures predictable, reviewable, and traceable development workflow.
