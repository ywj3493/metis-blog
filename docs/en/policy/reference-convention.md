<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# Reference Convention

## Purpose

The `docs/reference/` directory stores external documentation that supports development — API references, SDK guides, and third-party service documentation.

## Rules

1. **External only**: Only add documentation from external sources (APIs, SDKs, services)
2. **No translation**: Reference documents are not mirrored in `docs/ko/`
3. **Source attribution**: Always include the source URL and date retrieved
4. **Naming**: `<service-name>.md` in `kebab-case` (e.g., `notion-api.md`, `openai-sdk.md`)

## Document Format

```markdown
# <Service Name> Reference

**Source**: <URL>
**Retrieved**: <YYYY-MM-DD>

## <Section>
...
```

## Cross-Referencing

Use the `@` prefix to reference documents within specifications and other docs:

```markdown
@reference: [notion-api](../../reference/notion-api.md)
```

In the meta block at the top of a document:

```markdown
<!-- @reference: [architecture](../specifications/architecture.md) | [config](../specifications/config.md) -->
```

## When to Add References

- Setting up a new external integration
- Documenting API endpoints you depend on
- Recording SDK usage patterns that aren't obvious from code
