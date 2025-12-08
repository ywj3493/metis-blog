# Development Policy

## Purpose

This document defines how developers (human and AI assistants like Claude) collaborate on this repository. It establishes expectations for planning, documentation, code quality, and day-to-day development workflows.

## When to Use This Document

Use this document when you need to:

- **Understand documentation workflow** → See [Documentation Structure](#documentation-structure)
- **Create or organize documentation** → See [Documentation Responsibilities](#documentation-responsibilities)
- **Start new work** → See [Issue-Driven Workflow](#issue-driven-workflow)
- **Determine language conventions** → See [Language Convention](#2-language-convention)
- **Understand code quality standards** → See [Code Quality Standards](#code-quality-standards)
- **Learn review process** → See [Review & Quality Gates](#review--quality-gates)

**Related Documents**:

- Making commits? → [commit-convention.md](./commit-convention.md)
- Creating branches/PRs? → [branching-strategy.md](./branching-strategy.md)
- Naming files/code? → [naming-conventions.md](./naming-conventions.md)
- Writing tests? → [testing-policy.md](./testing-policy.md)

## Core Principles

### 1. Documentation-Driven Development

- **All work is documented**: Every significant change, decision, and feature must be documented in `docs/`
- **Documentation is living**: Update docs as the codebase evolves, not as an afterthought
- **Claude references docs first**: Before implementing any feature, Claude must read relevant documentation
- **Issue-driven workflow**: All planned work starts with an issue document in `docs/issue/`

### 2. Language Convention

#### English for Code and Documentation

- **Code**: All code, comments, variable names, function names in English
- **Documentation**: All documentation under `docs/` (except `docs/dev/`) written in English
- **Communication**: Git commits, PR descriptions, and issue documents in English

#### Korean for Developer Communication

- **Location**: `docs/dev/` folder contains Korean translations
- **Naming**: Korean files use `.ko.md` suffix (e.g., `architecture.ko.md`)
- **Purpose**: Enable communication with Korean developers
- **Maintenance**: Claude creates English docs first, then Korean translations

### 3. Security and Privacy

- **No secrets in code**: Never commit API keys, passwords, or tokens
- **Use environment variables**: Store sensitive data in `.env.local` (local) or Vercel settings (production)
- **No PII in documentation**: Avoid personally identifiable information in docs or commits
- **Rotate credentials**: Periodically update API keys and access tokens

## Documentation Structure

### Folder Organization

```text
docs/
├── specifications/    # Technical specs, architecture, requirements
├── issue/            # Issue planning documents (issue0XX.md)
├── reference/        # External API/SDK docs (user-added only)
├── policy/           # Development policies and conventions
└── dev/              # Korean translations of all documentation
```

### Documentation Responsibilities

#### When to Create Documentation

1. **New Feature**: Create issue document first, then update specifications/requirements.md
2. **Architecture Change**: Update specifications/architecture.md
3. **New Integration**: Document in specifications/infrastructure.md and add references to reference/
4. **Policy Change**: Update relevant policy document
5. **Bug Fix**: Update issue document with root cause and fix

#### What to Document

**Do Document**:
- Architectural decisions and rationale
- Non-obvious implementation patterns
- Integration setup and configuration
- Workflow changes
- Known limitations and workarounds

**Don't Document**:
- Obvious code behavior (self-documenting code preferred)
- Redundant information (link instead of duplicate)
- Temporary implementation details
- Personal opinions without technical basis

### Cross-Linking

- Use relative markdown links: `[architecture](../specifications/architecture.md)`
- Link to specific sections: `[FSD Layers](../specifications/architecture.md#layer-responsibilities)`
- Link from code comments to docs when explaining complex patterns

## Issue-Driven Workflow

### Issue Document Format

All work items tracked as markdown documents in `docs/issue/`:

- **Naming**: `issue0XX.md` with zero-padded sequential numbering (starts at 085)
- **Template**: Use `docs/issue/issue085.md` as template
- **Lifecycle**: Draft → In Progress → Ready for Review → Done

### Creating New Issues

1. **Identify next number**: Check `docs/issue/` for latest issue number
2. **Copy template**: Duplicate `issue085.md` structure
3. **Fill sections**:
   - **Summary**: Brief description of problem/feature
   - **Background**: Context and motivation
   - **Goals**: Clear success criteria
   - **Proposed Approach**: Technical solution outline
   - **Implementation Checklist**: Step-by-step tasks
   - **Validation Plan**: How to verify completion
   - **Rollout**: Deployment and monitoring plan
   - **Status Log**: Running record of progress

4. **Link to issue**: Reference in branch name, commits, and PRs

### Issue Lifecycle

```text
Draft
  ↓ (Planning complete, approach agreed)
In Progress
  ↓ (Implementation complete, validation done)
Ready for Review
  ↓ (Review approved, merged)
Done
```

**Status Updates**: Maintain Status Log section with dated entries

## Code Quality Standards

### Type Safety

- **TypeScript strict mode**: Enabled in `tsconfig.json`
- **No `any` types**: Use proper types or `unknown` with guards
- **Runtime validation**: Use type guards for external data (Notion API responses)
- **No unused variables**: Enforced by TypeScript compiler

### Code Style

- **Formatter**: Biome (`pnpm biome:write`)
- **Linter**: ESLint with Next.js rules (`pnpm lint`)
- **Run before commit**: Ensure formatting and linting pass
- **No style debates**: Tooling decisions are final

### Architecture Adherence

- **Follow FSD layers**: See [architecture.md](../specifications/architecture.md)
- **Respect import rules**: Never import upward in FSD hierarchy
- **Correct layer placement**: Domain logic in entities, task logic in features
- **No circular dependencies**: Design to avoid circular imports

### Testing Requirements

- **Critical paths**: Test entities, features, API routes
- **MSW for mocking**: Use MSW for external API calls
- **Regression tests**: Add tests when fixing bugs
- **Test before PR**: Run `pnpm test` before requesting review

See [testing-policy.md](./testing-policy.md) for detailed testing standards.

## Change Planning & Execution

### Workflow

1. **Draft Issue**: Create or update issue document with context and goals
2. **Clarify Requirements**: Resolve open questions, document assumptions
3. **Agree on Approach**: Review proposed solution, adjust if needed
4. **Implement**: Follow architecture guidelines and coding standards
5. **Validate**: Run tests, manual verification per validation plan
6. **Update Docs**: Reflect changes in relevant documentation
7. **Request Review**: Submit PR referencing issue document
8. **Iterate**: Address feedback, update issue log
9. **Merge & Deploy**: Complete issue, update status to Done

### Pull Request Guidelines

- **Small PRs preferred**: Focus on single issue, avoid scope creep
- **Reference issue**: Link to `docs/issue/issue0XX.md` in description
- **Describe changes**: Summarize what changed and why
- **Include validation**: Note how changes were tested
- **Document risks**: Call out areas needing extra review

See [branching-strategy.md](./branching-strategy.md) for branch naming and PR workflow details.

## Review & Quality Gates

### Pre-Merge Checklist

Before merging any PR:

- [ ] Linting passes (`pnpm lint`)
- [ ] Formatting applied (`pnpm biome:write`)
- [ ] Tests pass (`pnpm test`)
- [ ] Build succeeds (`pnpm build`)
- [ ] Manual testing completed (per issue validation plan)
- [ ] Documentation updated (if applicable)
- [ ] Issue document updated with status

### Code Review Focus

**Reviewers should check**:
- Architecture adherence (FSD layers)
- Type safety and error handling
- Security concerns (no leaked secrets)
- Performance implications
- Test coverage for changes
- Documentation accuracy

**Review is not for**:
- Style nitpicks (handled by tooling)
- Personal preferences
- Unrelated refactoring suggestions

## Maintenance of Documentation

### Keeping Docs Current

- **Part of definition of done**: Issue not complete until docs updated
- **Update, don't duplicate**: Revise existing docs rather than creating redundant files
- **Archive outdated info**: Note deprecation and link to replacement
- **Cross-reference changes**: Update links when moving/renaming docs

### Korean Translation Workflow

When creating or updating English documentation:

1. **Write English first**: Complete English version in appropriate `docs/` folder
2. **Create Korean mirror**: Translate to Korean in `docs/dev/` with `.ko.md` suffix
3. **Maintain structure**: Keep same folder structure (e.g., `docs/specifications/architecture.md` → `docs/dev/specifications/architecture.ko.md`)
4. **Update both versions**: When updating, modify both English and Korean

## Granular Policy References

This document provides high-level policy overview. For specific topics, see:

- **[commit-convention.md](./commit-convention.md)**: Commit message format and types
- **[branching-strategy.md](./branching-strategy.md)**: Branch naming and PR workflow
- **[naming-conventions.md](./naming-conventions.md)**: File, directory, and code naming
- **[testing-policy.md](./testing-policy.md)**: Testing approach and standards

## Collaboration Between Human and AI

### Claude's Responsibilities

1. **Read documentation first**: Always consult `docs/` before implementing
2. **Update documentation**: Keep docs current with code changes
3. **Create issue documents**: Draft issue0XX.md for new work
4. **Follow conventions**: Adhere to all policies in this folder
5. **Ask when unclear**: Request clarification rather than assume

### Human Developer's Responsibilities

1. **Review Claude's work**: Verify implementations align with intent
2. **Provide context**: Share domain knowledge and requirements
3. **Update reference docs**: Add external API documentation to `docs/reference/`
4. **Make final decisions**: Resolve ambiguities and approve approaches

### Communication Protocol

- **English in docs and code**: Keep public artifacts in English
- **Korean translations**: Enable communication with Korean team members
- **Issue documents**: Single source of truth during implementation
- **Status updates**: Maintain issue logs for transparency

## Exceptions and Flexibility

### When to Deviate

Policies are guidelines, not absolute rules. Deviate when:

- **Emergency hotfix**: Document deviation and reason in issue
- **Experimental feature**: Note experimental status clearly
- **External constraints**: Third-party integration requires different approach

### How to Request Exception

1. **Document in issue**: Explain why deviation needed
2. **Propose alternative**: Show how you'll mitigate risks
3. **Get agreement**: Discuss with team before proceeding
4. **Update policy**: If pattern repeats, update policy document

## Policy Evolution

This policy document evolves with the project:

- **Propose changes**: Open issue with rationale for policy update
- **Discuss impact**: Consider how change affects existing work
- **Update policy**: Revise this document and related policy files
- **Communicate**: Ensure all collaborators aware of changes

Maintaining predictable, well-documented policies keeps collaboration effective and auditable.
