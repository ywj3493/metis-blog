<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->

# Documentation

Documentation for the **Metis Blog** project. Read this first when navigating the docs.

## Structure

```
docs/
├── en/                     # English (source of truth)
│   ├── specifications/     # Technical specifications
│   ├── issue/              # Issue tracking documents
│   └── policy/             # Development policies
├── ko/                     # Korean translations (mirror of en/)
└── reference/              # External API/SDK references (no translation)
```

## Quick Navigation

### Specifications

| Topic | English | Korean |
|-------|---------|--------|
| Architecture (FSD) | [en/specifications/architecture.md](en/specifications/architecture.md) | [ko/specifications/architecture.md](ko/specifications/architecture.md) |
| Configuration | [en/specifications/config.md](en/specifications/config.md) | [ko/specifications/config.md](ko/specifications/config.md) |
| Infrastructure | [en/specifications/infrastructure.md](en/specifications/infrastructure.md) | [ko/specifications/infrastructure.md](ko/specifications/infrastructure.md) |
| Domain Index | [en/specifications/README.md](en/specifications/README.md) | [ko/specifications/README.md](ko/specifications/README.md) |

### Domain Specifications

Each domain has 6 documents (requirements, user-stories, use-cases, sequence-diagram, component/api-spec, test-spec):

| Domain | English | Korean |
|--------|---------|--------|
| post | [en/specifications/post/](en/specifications/post/) | [ko/specifications/post/](ko/specifications/post/) |
| guestbook | [en/specifications/guestbook/](en/specifications/guestbook/) | [ko/specifications/guestbook/](ko/specifications/guestbook/) |
| summary | [en/specifications/summary/](en/specifications/summary/) | [ko/specifications/summary/](ko/specifications/summary/) |
| site | [en/specifications/site/](en/specifications/site/) | [ko/specifications/site/](ko/specifications/site/) |

### Policies

| Topic | English | Korean |
|-------|---------|--------|
| Development Policy | [en/policy/policy.md](en/policy/policy.md) | [ko/policy/policy.md](ko/policy/policy.md) |
| Commit Message Rule | [en/policy/commit-message-rule.md](en/policy/commit-message-rule.md) | [ko/policy/commit-message-rule.md](ko/policy/commit-message-rule.md) |
| Naming Conventions | [en/policy/naming-conventions.md](en/policy/naming-conventions.md) | [ko/policy/naming-conventions.md](ko/policy/naming-conventions.md) |
| Reference Convention | [en/policy/reference-convention.md](en/policy/reference-convention.md) | [ko/policy/reference-convention.md](ko/policy/reference-convention.md) |

### Issues

Active issues are tracked on [GitHub Issues](https://github.com/ywj3493/metis-blog/issues). Long-form issue documents (when needed) are stored in [en/issue/](en/issue/) and [ko/issue/](ko/issue/).

### Reference

External API and SDK documentation: [reference/](reference/) (English only).

## Documentation Principles

1. **Read first, act second**: Always consult relevant docs before implementing changes
2. **English is source of truth**: All new docs are written in English under `docs/en/`
3. **Korean mirror**: Maintain `docs/ko/` parallel to `docs/en/`
4. **Single source of truth**: One document per topic, no duplication
5. **Update when code changes**: Keep specifications synchronized with implementation
