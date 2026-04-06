<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [user-stories](../requirements/user-stories.md) | [sequence-diagram](sequence-diagram.md) -->

> [← 유저 스토리](../requirements/user-stories.md) | [시퀀스 다이어그램 →](sequence-diagram.md)

# Guestbook 도메인 — 유스케이스

## 액터

| 액터 | 유형 | 설명 |
|------|------|------|
| 독자 | 주 | 방명록 조회 및 작성 |
| 블로그 소유자 | 주 | 이메일 알림 수신 |
| Notion API | 보조 | 방명록 데이터 저장 |
| Gmail SMTP | 보조 | 이메일 알림 전송 |

## UC-GB-01: 방명록 목록 조회

| 항목 | 값 |
|------|---|
| ID | UC-GB-01 |
| 액터 | 독자, Notion API |
| 관련 요구사항 | FR-GB-01 |

### 주요 흐름

1. 독자가 `/guestbooks`로 이동
2. `GuestbookList` 컴포넌트 마운트, `getGuestbooks()` 호출 (클라이언트 사이드)
3. `GET /api/guestbooks`가 Notion 데이터베이스를 남긴날짜 내림차순으로 쿼리
4. 응답을 `Guestbook.create()`로 `Guestbook` 도메인 모델에 매핑
5. 각 항목을 `GuestbookCard`로 렌더링
6. 비공개 항목은 플레이스홀더 텍스트 표시

### 대안 흐름
- **AF-01**: Notion API 실패 → 500 응답, 에러 상태 표시

## UC-GB-02: 방명록 작성

| 항목 | 값 |
|------|---|
| ID | UC-GB-02 |
| 액터 | 독자, Notion API |
| 관련 요구사항 | FR-GB-02 |

### 주요 흐름

1. 독자가 이름, 내용 입력 및 비공개 옵션 선택
2. 독자가 폼 제출
3. `GuestbookForm`이 `createGuestbook()` → `POST /api/guestbooks` 호출
4. API가 Zod 스키마로 입력 검증
5. `postNotionGuestbook()`이 Notion 데이터베이스에 페이지 생성
6. API가 생성된 항목과 200 반환
7. 폼 리셋, `refetch()` 호출로 목록 새로고침

### 대안 흐름
- **AF-01**: 잘못된 입력 (이름/내용 누락) → 400 응답
- **AF-02**: Notion API 실패 → 500 응답, 폼에 에러 표시

## UC-GB-03: 이메일 알림 전송

| 항목 | 값 |
|------|---|
| ID | UC-GB-03 |
| 액터 | 블로그 소유자, Gmail SMTP |
| 관련 요구사항 | FR-GB-03 |

### 주요 흐름

1. 방명록 생성 성공 후 (UC-GB-02 6단계)
2. `GuestbookForm`이 `POST /api/alarm`에 보낸사람, 제목, 메시지 전달
3. API가 Zod 스키마로 입력 검증
4. `sendEmail()`이 Gmail SMTP (Nodemailer)로 전송
5. `AUTH_USER`에게 이메일 전달

### 대안 흐름
- **AF-01**: 이메일 검증 실패 → 400 응답 (방명록은 이미 저장됨)
- **AF-02**: SMTP 실패 → 500 응답 (방명록은 이미 저장됨, 롤백 없음)

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | **[유스케이스]** | [시퀀스 다이어그램](sequence-diagram.md) | [API 명세](api-spec.md) | [테스트 명세](test-spec.md)
