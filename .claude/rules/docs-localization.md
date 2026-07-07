---
paths:
  - "docs/**"
---

# Documentation & Localization Rules

Source: docs/en/policy/policy.md (Documentation Structure)

- `docs/en/` is the source of truth. Write or update English first.
- Every change under `docs/en/` requires a mirrored Korean translation at the identical path under `docs/ko/` (same filename, no `.ko` suffix). Use the `sync-translations` skill for bulk syncs.
- Code blocks, file paths, commands, and identifiers stay in English inside Korean docs.
- `docs/reference/` holds external API/SDK references — English only, never translated (see docs/en/policy/reference-convention.md).
- Every policy/spec document starts with the header comment:
  `<!-- Created: YYYY-MM-DD | Last Modified: YYYY-MM-DD | Status: Active -->`
  Update `Last Modified` when editing.
- One document per topic — no duplication across files; link instead.
- Domain specs live in `docs/en/specifications/<domain>/` with the 6-document pipeline: requirements → user-stories → use-cases → sequence-diagram → component/api-spec → test-spec (use the `dev-planning` skill for new domains).
