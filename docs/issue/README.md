# Issue Planning Workflow

Future work is tracked through markdown plans inside this directory. Follow the steps below to create and maintain issue documents.

## Naming Convention

- Files are named `issue0XX.md`, where `XX` is a zero-padded incremental number starting at `85` (e.g., `issue085.md`, `issue086.md`).
- Keep numbering sequential; if you skip a number, document the reason.

## When to Create an Issue Document

1. Before starting a new task, duplicate `issue085.md` (the template) and rename it to the next available number.
2. Record problem context, goals, solution outline, affected areas, and validation steps.
3. Update the document as decisions change; it is the single source of truth during implementation.

## Lifecycle

- **Draft**: Captures initial understanding and open questions.
- **In Progress**: Reflects agreed approach, implementation checklist, and test plan.
- **Ready for Review**: Includes a summary of completed work, validation evidence, and outstanding risks.
- **Done**: Notes merge or release details plus follow-up tasks, then links to updated documentation.

## Linking & Traceability

- Reference the relevant issue document in commit messages and pull requests (e.g., "feat: add AI summary cache (refs issue085)").
- Mention related docs when they require updates:
  - Specifications: [docs/specifications/](../specifications/)
  - Policies: [docs/policy/](../policy/)
  - Reference materials: [docs/reference/](../reference/)
- Confirm all documentation updates before closing the issue.

## Related Documentation

When working on issues, reference these documents for context:

- **Architecture**: [specifications/architecture.md](../specifications/architecture.md) - FSD layers, import rules, design patterns
- **Infrastructure**: [specifications/infrastructure.md](../specifications/infrastructure.md) - Environment setup, deployment, integrations
- **Requirements**: [specifications/requirements.md](../specifications/requirements.md) - Functional requirements and features
- **Policies**: [policy/policy.md](../policy/policy.md) - Development conventions and rules
- **Commit Convention**: [policy/commit-convention.md](../policy/commit-convention.md) - Commit message format
- **Branching Strategy**: [policy/branching-strategy.md](../policy/branching-strategy.md) - Branch naming and PR workflow
- **Testing Policy**: [policy/testing-policy.md](../policy/testing-policy.md) - Testing standards

Maintaining disciplined issue documents keeps collaboration transparent and reduces rework.
