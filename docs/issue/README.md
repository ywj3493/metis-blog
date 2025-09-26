# Issue Planning Workflow

Future work is tracked through markdown plans inside this directory. Follow the steps below to create and maintain issue documents.

## Naming Convention
- Files are named `issue0XX.md`, where `XX` is a zero-padded incremental number starting at `85` (e.g., `issue085.md`, `issue086.md`).
- Keep numbering sequential; if you skip a number, reserve it explicitly in the index section of the docs root README.

## When to Create an Issue Document
1. Before starting a new task, duplicate `issue085.md` (the template) and rename it to the next available number.
2. Record problem context, goals, solution outline, affected areas, and validation steps.
3. Update the document as decisions change; it is the single source of truth during implementation.

## Lifecycle
- **Draft**: captures initial understanding and open questions.
- **In Progress**: reflects agreed approach, implementation checklist, and test plan.
- **Ready for Review**: includes a summary of completed work, validation evidence, and outstanding risks.
- **Done**: notes merge or release details plus follow-up tasks, then links to updated documentation.

## Linking & Traceability
- Reference the relevant issue document in commit messages and pull requests (e.g., "feat: add AI summary cache (refs issue085)").
- Mention related feature docs or policies when they require updates, and confirm completion before closing the issue.

Maintaining disciplined issue documents keeps collaboration transparent and reduces rework.
