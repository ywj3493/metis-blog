<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- Tech Stack: Next.js 14, TypeScript, Notion API, Zod, Nodemailer -->
<!-- @reference: [architecture](../../architecture.md) | [user-stories](user-stories.md) -->

> [유저 스토리 →](user-stories.md)

# Guestbook 도메인 — 요구사항

## 시스템 개요

Guestbook 도메인은 Notion 데이터베이스를 통한 방명록 CRUD, 유효성 검증이 포함된 폼 제출, 공개/비공개 제어, 새 항목 작성 시 블로그 소유자에게 이메일 알림을 담당합니다. 알람(이메일) 서브시스템이 이 도메인에 포함됩니다.

## 기능 요구사항

### FR-GB-01: 방명록 목록 조회

| 항목 | 값 |
|------|---|
| ID | FR-GB-01 |
| 우선순위 | 높음 |
| 설명 | 날짜 내림차순으로 모든 방명록 항목 표시 |

**완료 기준**:
- `GET /api/guestbooks`로 Notion 데이터베이스에서 항목 조회
- "남긴날짜" 기준 내림차순 정렬
- 공개 항목: 작성자, 날짜, 내용 표시
- 비공개 항목: "비공개 방명록 입니다." 플레이스홀더 표시

### FR-GB-02: 방명록 작성

| 항목 | 값 |
|------|---|
| ID | FR-GB-02 |
| 우선순위 | 높음 |
| 설명 | 이름, 내용, 공개/비공개 옵션으로 새 방명록 항목 제출 |

**완료 기준**:
- 폼 필드: name (필수), content (필수), isPrivate (boolean)
- API 라우트에서 Zod 스키마로 입력 검증
- `POST /api/guestbooks`로 Notion 데이터베이스에 항목 생성
- isPrivate 플래그에 따라 상태를 "공개" 또는 "비공개"로 설정
- 성공 시 폼 리셋 및 목록 새로고침
- 제출 중 로딩 스피너 표시

### FR-GB-03: 새 항목 이메일 알림

| 항목 | 값 |
|------|---|
| ID | FR-GB-03 |
| 우선순위 | 중간 |
| 설명 | 새 방명록 항목 작성 시 블로그 소유자에게 이메일 알림 전송 |

**완료 기준**:
- 방명록 생성 성공 후 `POST /api/alarm` 호출
- Gmail SMTP (Nodemailer)로 `AUTH_USER`에게 이메일 전송
- 이메일 내용: 보낸사람, 제목, 방명록 내용 (HTML)
- 이메일 실패가 방명록 생성을 차단하지 않음 (fire-and-forget)

## 비기능 요구사항

### NFR-GB-01: 유효성 검증

- API 라우트에서 모든 입력에 Zod 스키마 검증
- name과 content는 필수 문자열
- isPrivate는 필수 boolean

### NFR-GB-02: 보안

- 인증 불필요 (공개 방명록)
- 비공개 항목은 상태로 서버 사이드 필터링

## 제약사항

| 유형 | 제약 |
|------|------|
| 기술 | Notion 데이터베이스 속성: 작성자, 방명록, 남긴날짜, 상태 |
| 기술 | Gmail SMTP에 앱 비밀번호 필요 (일반 비밀번호 아님) |
| 아키텍처 | `src/entities/guestbook/` + `src/entities/alarm/` + `src/features/guestbook/` |

## 요구사항 추적 매트릭스

| 요구사항 | 유저 스토리 | 유스케이스 |
|---------|-----------|----------|
| FR-GB-01 | US-01 | UC-GB-01 |
| FR-GB-02 | US-02 | UC-GB-02 |
| FR-GB-03 | US-03 | UC-GB-03 |

> **전체 문서**
> **[요구사항]** | [유저 스토리](user-stories.md) | [유스케이스](../workflows/use-cases.md) | [시퀀스 다이어그램](../workflows/sequence-diagram.md) | [API 명세](../workflows/api-spec.md) | [테스트 명세](../workflows/test-spec.md)
