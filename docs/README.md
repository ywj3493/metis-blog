# Documentation Hub

Welcome to the metis-blog documentation. This hub helps you quickly navigate to the right documentation for your task.

## Quick Start

**New to the project?** Start with [../AGENTS.md](../AGENTS.md) for a task-oriented quick reference.

**Looking for specific details?** Use the task-based navigation below to find the right document.

## Navigation by Task

### Planning and Architecture

| What are you doing? | Read this |
|---------------------|-----------|
| Understanding the project structure | [specifications/architecture.md](specifications/architecture.md) |
| Checking functional requirements | [specifications/requirements.md](specifications/requirements.md) |
| Setting up environment/deployment | [specifications/infrastructure.md](specifications/infrastructure.md) |
| Planning new work | [issue/README.md](issue/README.md) → Create new issueXXX.md |

### Development Workflow

| What are you doing? | Read this |
|---------------------|-----------|
| Making a commit | [policy/commit-convention.md](policy/commit-convention.md) (TL;DR section) |
| Creating a branch | [policy/branching-strategy.md](policy/branching-strategy.md) (TL;DR section) |
| Naming files/variables/components | [policy/naming-conventions.md](policy/naming-conventions.md) (TL;DR section) |
| Writing tests | [policy/testing-policy.md](policy/testing-policy.md) (TL;DR section) |
| Understanding documentation workflow | [policy/policy.md](policy/policy.md) |

### Implementation Details

| What are you doing? | Read this |
|---------------------|-----------|
| Working with Notion API | [../AGENTS.md](../AGENTS.md#dual-notion-client-setup) |
| Implementing caching | [specifications/infrastructure.md](specifications/infrastructure.md#server-side-caching-strategy) |
| Understanding FSD layers | [specifications/architecture.md](specifications/architecture.md#layer-responsibilities) |
| Adding AI/LLM features | [../AGENTS.md](../AGENTS.md#environment-based-llm-selection) |
| Setting up email notifications | [specifications/infrastructure.md](specifications/infrastructure.md#email-service) |

## Documentation Structure

```
docs/
├── README.md                    # This file - Navigation hub
├── specifications/              # Technical architecture and requirements
│   ├── architecture.md         # FSD layers, design patterns, module boundaries
│   ├── infrastructure.md       # Environment, deployment, integrations, caching
│   └── requirements.md         # Functional requirements (FR-001 to FR-009)
├── policy/                     # Development policies and conventions
│   ├── policy.md              # Documentation structure, workflows, meta-policies
│   ├── commit-convention.md   # Commit message rules with TL;DR
│   ├── branching-strategy.md  # Git workflow, branch naming with TL;DR
│   ├── naming-conventions.md  # File and code naming rules with TL;DR
│   └── testing-policy.md      # Testing standards with TL;DR
├── issue/                      # Issue tracking and planning
│   ├── README.md              # Issue workflow overview
│   └── issueXXX.md            # Individual issue documents (085, 086, 087...)
├── reference/                  # External API documentation (user-added)
│   └── README.md              # Guidelines for adding reference docs
└── dev/                        # Korean translations
    ├── development-guide.md   # Korean development overview
    ├── issue/                 # Korean issue translations
    ├── policy/                # Korean policy translations
    └── specifications/        # Korean specification translations
```

## Documentation by Category

### Specifications (Technical Details)

**[specifications/architecture.md](specifications/architecture.md)**
- Feature-Sliced Design (FSD) layer hierarchy
- Import rules and boundaries
- Common patterns (protected constructors, type guards)
- Directory structure and responsibilities

**[specifications/infrastructure.md](specifications/infrastructure.md)**
- Environment variables and configuration
- Notion API setup (dual client approach)
- Server-side caching strategy
- AI/LLM integration (OpenAI vs local)
- Email service configuration
- Deployment and monitoring

**[specifications/requirements.md](specifications/requirements.md)**
- FR-001 to FR-009: All functional requirements
- Feature descriptions and acceptance criteria
- System capabilities and constraints

### Policies (Development Rules)

**[policy/policy.md](policy/policy.md)**
- Documentation structure and language rules
- Issue-driven development workflow
- Update and maintenance guidelines

**[policy/commit-convention.md](policy/commit-convention.md)**
- Commit message format: `<type>: <summary>`
- Available types: feat, fix, style, chore, etc.
- Examples and anti-patterns
- **TL;DR section at top for quick reference**

**[policy/branching-strategy.md](policy/branching-strategy.md)**
- Branch naming: `<type>/<issue-number>[-description]`
- Workflow from branch creation to PR
- Examples and rules
- **TL;DR section at top for quick reference**

**[policy/naming-conventions.md](policy/naming-conventions.md)**
- File naming (kebab-case)
- Component naming (PascalCase)
- Variable/function naming (camelCase)
- Constants (UPPER_SNAKE_CASE)
- **TL;DR table at top for quick reference**

**[policy/testing-policy.md](policy/testing-policy.md)**
- Testing philosophy and framework (Vitest + MSW)
- What to test (priority order and coverage targets)
- Test location and structure
- Commands: `pnpm test` vs `pnpm test:deep`
- **TL;DR section at top for quick reference**

### Issues (Work Planning)

**[issue/README.md](issue/README.md)**
- Issue workflow overview
- When to create issue documents
- Issue numbering (starts at 085)

**[issue/issueXXX.md](issue/)**
- Individual issue planning documents
- Template: [issue085.md](issue/issue085.md)
- Each issue includes: problem, goals, approach, validation

### Reference (External Documentation)

**[reference/README.md](reference/README.md)**
- Guidelines for adding external API docs
- SDK guides and integration references
- Currently empty - add as needed

### Korean Translations

**[dev/](dev/)**
- All English docs translated to Korean
- Parallel structure with `.ko.md` suffix
- Examples:
  - [dev/policy/policy.ko.md](dev/policy/policy.ko.md)
  - [dev/specifications/architecture.ko.md](dev/specifications/architecture.ko.md)

## Documentation Principles

### TL;DR First

All major policy and specification documents now include a **TL;DR (Quick Reference)** section at the top:
- Essential rules in table or bullet format
- Quick examples
- Links to full details below

This helps agents and developers find information quickly without reading entire documents.

### Task-Oriented

Documentation is organized by what you're trying to accomplish, not by technical category. Use the "Navigation by Task" tables above to find what you need.

### Single Source of Truth

- [../AGENTS.md](../AGENTS.md): Quick reference and task routing (400 lines)
- [docs/](./): Comprehensive details and rationale (3,500+ lines)
- No duplication - AGENTS.md links to docs/ for deep dives

### Living Documentation

Documentation should evolve with code:
- Update docs/ when making architectural changes
- Add new issues before starting work
- Keep TL;DR sections synchronized with detailed content

## For AI Agents

**Start here**: [../AGENTS.md](../AGENTS.md)

**AGENTS.md provides**:
- Task-based routing ("If you need to... → Read:")
- Quick reference tables (naming, commits, testing)
- Critical patterns (caching, dual Notion clients)
- Links to deep dive docs

**Use this README for**:
- Understanding documentation structure
- Finding specific topics
- Navigating between related documents

## For Human Developers

**Korean speakers**: Start with [dev/development-guide.md](dev/development-guide.md)

**English speakers**: Start with [../AGENTS.md](../AGENTS.md)

**Contributing**:
1. Read [policy/policy.md](policy/policy.md) for documentation workflow
2. Create issue in [issue/](issue/) before major work
3. Follow conventions in [policy/](policy/)
4. Keep English and Korean docs in sync

## Getting Help

- **Questions about conventions?** Check [policy/](policy/) TL;DR sections
- **Architectural questions?** See [specifications/architecture.md](specifications/architecture.md)
- **Setup issues?** Check [specifications/infrastructure.md](specifications/infrastructure.md)
- **Working on something new?** Create [issue/issueXXX.md](issue/)

## Feedback

Found documentation issues or have suggestions? Update the relevant doc and create a PR following [policy/branching-strategy.md](policy/branching-strategy.md).
