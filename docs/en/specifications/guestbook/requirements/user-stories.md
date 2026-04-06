<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [requirements](requirements.md) | [use-cases](../workflows/use-cases.md) -->

> [← Requirements](requirements.md) | [Use Cases →](../workflows/use-cases.md)

# Guestbook Domain — User Stories

## US-01: View Guestbook

**As a** reader,
**I want to** see a list of guestbook entries on the guestbook page,
**So that** I can read messages left by other visitors.

### Acceptance Criteria

- [ ] **AC-US01-01**: Given guestbook entries exist, When I visit `/guestbooks`, Then I see entries sorted by date descending
- [ ] **AC-US01-02**: Given a private entry exists, When the list renders, Then the content shows "비공개 방명록 입니다." instead of actual content
- [ ] **AC-US01-03**: Given entries are loaded, When I view a public entry, Then I see the author name, date, and content

## US-02: Leave a Guestbook Entry

**As a** reader,
**I want to** submit a message via the guestbook form,
**So that** I can leave a note for the blog owner.

### Acceptance Criteria

- [ ] **AC-US02-01**: Given I fill in name and content, When I submit the form, Then the entry is created in Notion and appears in the list
- [ ] **AC-US02-02**: Given I check the private option, When I submit, Then the entry is created with status "비공개"
- [ ] **AC-US02-03**: Given name or content is empty, When I submit, Then the API returns a 400 error
- [ ] **AC-US02-04**: Given submission is in progress, When waiting, Then a loading spinner is displayed

## US-03: Receive Email Notification

**As a** blog owner,
**I want to** receive an email when someone leaves a guestbook entry,
**So that** I can respond in a timely manner.

### Acceptance Criteria

- [ ] **AC-US03-01**: Given a guestbook entry is created, When submission succeeds, Then an email is sent to the configured address
- [ ] **AC-US03-02**: Given email sending fails, When the alarm API errors, Then the guestbook entry is still saved (no rollback)

## Story-Requirement Traceability

| User Story | Requirements | AC Count |
|-----------|-------------|----------|
| US-01 | FR-GB-01 | 3 |
| US-02 | FR-GB-02 | 4 |
| US-03 | FR-GB-03 | 2 |

> **All Documents**
> [Requirements](requirements.md) | **[User Stories]** | [Use Cases](../workflows/use-cases.md) | [Sequence Diagram](../workflows/sequence-diagram.md) | [API Spec](../workflows/api-spec.md) | [Test Spec](../workflows/test-spec.md)
