<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [api-spec](api-spec.md) -->

> [← 유스케이스](use-cases.md) | [API 명세 →](api-spec.md)

# Guestbook 도메인 — 시퀀스 다이어그램

## 흐름 1: 방명록 목록 조회 (UC-GB-01)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant Page as guestbooks/page.tsx
  participant List as GuestbookList (클라이언트)
  participant API as GET /api/guestbooks
  participant Entity as entities/guestbook/api
  participant Notion as Notion API

  Reader->>Page: GET /guestbooks
  Page->>List: GuestbookList 렌더링
  List->>API: fetch GET /api/guestbooks
  API->>Entity: getNotionGuestbooks()
  Entity->>Notion: databases.query(sort=남긴날짜 desc)
  Notion-->>Entity: DatabaseObjectResponse[]
  Entity-->>API: 결과
  API-->>List: { data: results }
  List->>List: Guestbook.create()로 매핑
  List-->>Reader: GuestbookCard[] (공개/비공개)
```

## 흐름 2: 방명록 작성 (UC-GB-02)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant Form as GuestbookForm (클라이언트)
  participant GBApi as POST /api/guestbooks
  participant Zod as Zod 스키마
  participant Entity as entities/guestbook/api
  participant Notion as Notion API

  Reader->>Form: 이름, 내용, 비공개 여부 입력
  Reader->>Form: 제출
  Form->>Form: 로딩 스피너 표시
  Form->>GBApi: POST { name, content, isPrivate }
  GBApi->>Zod: body 검증
  alt 유효
    Zod-->>GBApi: 파싱된 데이터
    GBApi->>Entity: postNotionGuestbook(data)
    Entity->>Notion: pages.create(properties)
    Notion-->>Entity: 생성된 페이지
    Entity-->>GBApi: { id, name, content, isPrivate }
    GBApi-->>Form: 200 { data }
    Form->>Form: 폼 리셋
    Form->>Form: refetch() 목록 새로고침
  else 유효하지 않음
    Zod-->>GBApi: 검증 에러
    GBApi-->>Form: 400 에러
  end
```

## 흐름 3: 이메일 알림 (UC-GB-03)

```mermaid
sequenceDiagram
  participant Form as GuestbookForm (클라이언트)
  participant AlarmAPI as POST /api/alarm
  participant Zod as Zod 스키마
  participant Email as entities/alarm/model
  participant SMTP as Gmail SMTP

  Note over Form: 방명록 생성 성공 후
  Form->>AlarmAPI: POST { from, subject, message }
  AlarmAPI->>Zod: body 검증
  alt 유효
    Zod-->>AlarmAPI: 파싱된 데이터
    AlarmAPI->>Email: sendEmail({ from, subject, message })
    Email->>SMTP: transporter.sendMail(mailData)
    alt SMTP 성공
      SMTP-->>Email: 전송됨
      Email-->>AlarmAPI: 성공
      AlarmAPI-->>Form: 200
    else SMTP 실패
      SMTP-->>Email: 에러
      Email-->>AlarmAPI: 에러
      AlarmAPI-->>Form: 500 (방명록은 이미 저장됨)
    end
  else 유효하지 않음
    Zod-->>AlarmAPI: 검증 에러
    AlarmAPI-->>Form: 400
  end
```

## 에러 처리

| 시나리오 | HTTP 상태 | 방명록 영향 |
|---------|----------|-----------|
| Zod 검증 실패 (방명록) | 400 | 생성 안 됨 |
| Notion API 실패 (방명록) | 500 | 생성 안 됨 |
| Zod 검증 실패 (알람) | 400 | 이미 저장됨 |
| Gmail SMTP 실패 (알람) | 500 | 이미 저장됨 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | **[시퀀스 다이어그램]** | [API 명세](api-spec.md) | [테스트 명세](test-spec.md)
