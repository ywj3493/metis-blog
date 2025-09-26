# Collaboration & Documentation Policy

## Purpose
This document defines how Meti and Codex collaborate on the repository. It captures expectations for planning, documentation, and day-to-day development so that every change follows a predictable workflow.

## Working Language
- Author all issues, commits, comments, and documents in English unless the team explicitly agrees otherwise.
- Avoid copying secrets or personally identifiable information into the repository or shared discussions.

## Source of Truth for Work Items
- New work starts with an issue document under `docs/issue/` named `issue0XX.md` (zero-padded) beginning at `issue085.md`.
- Each issue file describes the problem, scope, acceptance criteria, validation plan, and follow-up documentation updates.
- Treat the active issue document as the canonical reference while implementing related code.

## Documentation Responsibilities
- Update repository documentation whenever behaviour, APIs, or workflows change.
- Keep `docs/README.md` aligned with the directory structure so newcomers know where to look.
- Append or revise existing docs rather than duplicating information; cross-link sections when possible.

## Change Planning & Execution
1. Draft or update the relevant `issue0XX.md` file with background, proposed approach, and task list.
2. Confirm open questions early—use the issue doc to log assumptions and decisions.
3. Implement code changes in alignment with the file naming and architecture guidelines in `docs/dev/development-guide.md`.
4. Update feature descriptions in `docs/feature/` if user-facing behaviour shifts.

## Review & Quality
- Prefer small, incremental pull requests that reference the relevant `issue0XX.md` file.
- Run linting, tests, and manual checks suggested in the development guide before requesting review.
- Document risk areas and validation results in the issue file to aid reviewers.

## Maintenance of Docs
- When adding new documents, include them in `docs/README.md` and link to related policies.
- Archive superseded docs by referencing them in the new material instead of deleting historical context.

Maintaining these policies keeps the collaboration between Meti and Codex predictable, auditable, and easy to onboard.
