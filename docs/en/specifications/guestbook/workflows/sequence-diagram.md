<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [api-spec](api-spec.md) -->

> [← Use Cases](use-cases.md) | [API Spec →](api-spec.md)

# Guestbook Domain — Sequence Diagrams

## Flow 1: View Guestbook Entries (UC-GB-01)

```mermaid
sequenceDiagram
  participant Reader
  participant Page as guestbooks/page.tsx
  participant List as GuestbookList (client)
  participant API as GET /api/guestbooks
  participant Entity as entities/guestbook/api
  participant Notion as Notion API

  Reader->>Page: GET /guestbooks
  Page->>List: render GuestbookList
  List->>API: fetch GET /api/guestbooks
  API->>Entity: getNotionGuestbooks()
  Entity->>Notion: databases.query(sort=남긴날짜 desc)
  Notion-->>Entity: DatabaseObjectResponse[]
  Entity-->>API: results
  API-->>List: { data: results }
  List->>List: map to Guestbook.create()
  List-->>Reader: GuestbookCard[] (public/private)
```

## Flow 2: Create Guestbook Entry (UC-GB-02)

```mermaid
sequenceDiagram
  participant Reader
  participant Form as GuestbookForm (client)
  participant GBApi as POST /api/guestbooks
  participant Zod as Zod Schema
  participant Entity as entities/guestbook/api
  participant Notion as Notion API

  Reader->>Form: fill name, content, isPrivate
  Reader->>Form: submit
  Form->>Form: show loading spinner
  Form->>GBApi: POST { name, content, isPrivate }
  GBApi->>Zod: validate body
  alt Valid
    Zod-->>GBApi: parsed data
    GBApi->>Entity: postNotionGuestbook(data)
    Entity->>Notion: pages.create(properties)
    Notion-->>Entity: created page
    Entity-->>GBApi: { id, name, content, isPrivate }
    GBApi-->>Form: 200 { data }
    Form->>Form: reset form
    Form->>Form: refetch() list
  else Invalid
    Zod-->>GBApi: validation error
    GBApi-->>Form: 400 error
  end
```

## Flow 3: Email Notification (UC-GB-03)

```mermaid
sequenceDiagram
  participant Form as GuestbookForm (client)
  participant AlarmAPI as POST /api/alarm
  participant Zod as Zod Schema
  participant Email as entities/alarm/model
  participant SMTP as Gmail SMTP

  Note over Form: After successful guestbook creation
  Form->>AlarmAPI: POST { from, subject, message }
  AlarmAPI->>Zod: validate body
  alt Valid
    Zod-->>AlarmAPI: parsed data
    AlarmAPI->>Email: sendEmail({ from, subject, message })
    Email->>SMTP: transporter.sendMail(mailData)
    alt SMTP Success
      SMTP-->>Email: sent
      Email-->>AlarmAPI: success
      AlarmAPI-->>Form: 200
    else SMTP Failure
      SMTP-->>Email: error
      Email-->>AlarmAPI: error
      AlarmAPI-->>Form: 500 (guestbook already saved)
    end
  else Invalid
    Zod-->>AlarmAPI: validation error
    AlarmAPI-->>Form: 400
  end
```

## Error Handling

| Scenario | HTTP Status | Effect on Guestbook |
|----------|------------|-------------------|
| Zod validation fails (guestbook) | 400 | Not created |
| Notion API fails (guestbook) | 500 | Not created |
| Zod validation fails (alarm) | 400 | Already saved |
| Gmail SMTP fails (alarm) | 500 | Already saved |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | **[Sequence Diagram]** | [API Spec](api-spec.md) | [Test Spec](test-spec.md)
