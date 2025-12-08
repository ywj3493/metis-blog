# Reference Documentation

## Purpose

This directory contains external reference materials for third-party integrations, APIs, SDK guides, and other technical documentation that Claude and developers may need when working with external systems.

## What Goes Here

**Include**:
- External API documentation (Notion, OpenAI, etc.)
- SDK integration guides
- Third-party service setup instructions
- Authentication and credential management guides
- Vendor-specific best practices
- Rate limiting and quota information
- Webhook and callback specifications

**Do Not Include**:
- Project-specific code or architecture (use `docs/specifications/`)
- Development policies and conventions (use `docs/policy/`)
- Issue planning documents (use `docs/issue/`)
- Internal implementation details

## Adding Reference Materials

### When to Add

Add reference documentation when:
1. Integrating a new external service or API
2. Documenting complex third-party setup procedures
3. Capturing important vendor-specific knowledge
4. Providing context that isn't obvious from official docs

### How to Add

1. **Create appropriately named file**: Use descriptive kebab-case names
   - Example: `notion-api-reference.md`, `openai-models-guide.md`, `vercel-deployment.md`

2. **Include source and date**: Note where information came from and when
   - Example header:
     ```markdown
     # Notion API Reference

     Source: https://developers.notion.com/reference
     Last updated: 2024-01-15
     ```

3. **Focus on project-relevant details**: Don't copy entire docs, extract what matters
   - Relevant endpoints
   - Authentication requirements
   - Rate limits
   - Common patterns used in this project

4. **Update existing references**: Keep docs current as APIs evolve

## Current Reference Materials

_None yet. Add reference materials as needed when integrating with external services._

## Maintenance

### Human Developer Responsibilities

- Add new reference materials when integrating external services
- Update references when APIs change
- Remove outdated documentation
- Provide Claude with context from these docs when relevant

### Claude's Role

- **Read** reference materials when working with integrations
- **Reference** these docs in issue documents and code comments
- **Request** new reference materials if information is missing
- **Do Not Create**: Claude should not generate reference docs unless explicitly asked

## Tips for Effective Reference Docs

1. **Be concise**: Extract only what's needed, don't duplicate entire vendor docs
2. **Link to official docs**: Always include link to authoritative source
3. **Note gotchas**: Document non-obvious behaviors and edge cases
4. **Include examples**: Show how the API is used in this project
5. **Date everything**: APIs change, note when reference was created/updated

## Example Structure

```markdown
# Service Name API Reference

**Source**: https://api-docs-url.com
**Last Updated**: 2024-01-15
**Relevant Sections**: Authentication, Posts API, Webhooks

## Authentication

[How this project authenticates with the service]

## Key Endpoints Used

### GET /api/posts
[Description and example relevant to this project]

### POST /api/posts
[Description and example relevant to this project]

## Rate Limits

[Quota and throttling information]

## Gotchas and Known Issues

[Non-obvious behaviors encountered in this project]

## Related Project Files

- Implementation: `src/entities/service/`
- Configuration: `src/shared/config/service.ts`
- Tests: `src/__test__/entities/service.test.ts`
```

---

**Note**: This folder is intentionally empty initially. Add materials as the project evolves and integrations are added.
