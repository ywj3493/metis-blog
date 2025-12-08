# Guestbook 도메인 요구사항

이 문서는 방문자가 블로그 소유자에게 메시지를 남길 수 있는 Guestbook 도메인의 기능 요구사항을 정의합니다.

## 개요

Guestbook 도메인은 방문자와 블로그 소유자 간의 인터랙티브 커뮤니케이션 채널을 제공합니다. 방문자는 공개 또는 비공개 메시지를 남길 수 있으며, 이는 Notion 데이터베이스에 저장됩니다. 시스템은 폼 검증, 공개 여부 제어, 이메일 알림을 지원합니다.

## 기능 요구사항

### FR-GB-001: 방명록 제출

**설명**: 방문자가 검증이 포함된 폼을 통해 메시지를 제출할 수 있도록 합니다.

**인수 기준**:
- 폼 필드 제공: 이름 (필수), 내용 (필수), 공개 여부 토글 (공개/비공개)
- 제출 전 Zod 스키마를 사용한 입력 검증
- 잘못된 입력에 대한 명확한 오류 메시지 표시
- 제출 중 로딩 상태 표시
- 제출 후 성공 확인 표시
- 성공적인 제출 후 폼 초기화
- Notion 방명록 데이터베이스에 제출 내용 저장

**폼 검증 스키마**:
```typescript
{
  name: z.string({ required_error: "이름은 필수입니다." }),
  content: z.string({ required_error: "내용은 필수입니다." }),
  isPrivate: z.boolean()
}
```

**API 엔드포인트**: `POST /api/guestbooks`

**관련 컴포넌트**:
- `src/entities/guestbooks/ui/guestbook-form.tsx`
- `src/app/api/guestbooks/route.ts`

---

### FR-GB-002: 방명록 표시

**설명**: 모든 공개 방명록 항목을 읽기 쉬운 형식으로 표시합니다.

**인수 기준**:
- Notion 데이터베이스에서 모든 방명록 항목 조회
- 공개 항목만 표시하도록 필터링 (상태 = "공개")
- 날짜 기준 정렬 (최신순)
- 항목 메타데이터 표시: 작성자 이름, 날짜, 내용
- 반응형 카드 레이아웃 구현
- 빈 상태 우아하게 처리
- 많은 항목에 대해 페이지네이션 또는 무한 스크롤 지원

**API 엔드포인트**: `GET /api/guestbooks`

**관련 컴포넌트**:
- `src/features/guestbooks/ui/guestbook-list.tsx`
- `src/entities/guestbooks/ui/guestbook-card.tsx`

---

### FR-GB-003: 이메일 알림 트리거

**설명**: 새 방명록 항목이 제출될 때 이메일 알림을 트리거합니다.

**인수 기준**:
- 성공적인 방명록 제출 후 이메일 알림 전송
- 알림에 항목 세부사항 포함 (작성자, 내용, 공개 여부)
- 논블로킹 실행 (사용자 응답 지연 없음)
- 이메일 실패 우아하게 처리 (제출 성공에 영향 없음)

**통합**: `/api/alarm` 엔드포인트 호출

**관련 컴포넌트**:
- `src/features/guestbooks/ui/guestbook-list.tsx`
- `src/features/alarm/api/index.ts`

---

## 데이터 모델

### Guestbook 엔티티

```typescript
interface IGuestbook {
  id: string;        // Notion 페이지 ID
  name: string;      // 작성자 이름 (작성자)
  content: string;   // 메시지 내용 (방명록)
  date: string;      // 제출 날짜 (남긴날짜)
  status: string;    // 공개 상태 (상태: "공개" | "비공개")
}
```

### Guestbook 폼 데이터

```typescript
interface GuestbookFormData {
  name: string;
  content: string;
  isPrivate: boolean;
}
```

### Notion 속성 매핑

| 도메인 속성 | Notion 속성 (한글) | Notion 타입 |
|------------|-------------------|-------------|
| name | 작성자 | title |
| content | 방명록 | rich_text |
| date | 남긴날짜 | date |
| status | 상태 | status |

### 상태 값

| 상태 | 한글 | 공개 여부 |
|------|-----|----------|
| Public | 공개 | 모든 방문자에게 표시 |
| Private | 비공개 | 블로그 소유자에게만 표시 (Notion에서) |

---

## 비기능 요구사항

### NFR-GB-001: 성능

- 폼 제출 응답 < 3초
- 방명록 목록 로드 < 2초
- 이메일 알림 비동기 (논블로킹)

### NFR-GB-002: 검증

- API 호출 전 클라이언트 사이드 검증
- Zod 스키마로 서버 사이드 검증
- 한글로 명확한 오류 메시지

### NFR-GB-003: 사용자 경험

- 비동기 작업 중 로딩 인디케이터
- 성공/오류 피드백 메시지
- 성공적인 제출 후 폼 자동 초기화
- 모든 디바이스에서 반응형 디자인

### NFR-GB-004: 프라이버시

- 공개 API 응답에 비공개 메시지 노출 안 함
- 추가 레이어로 클라이언트 사이드 필터링
- 알림에 프라이버시 상태 포함

---

## 의존성

### 외부 서비스
- Notion API (방명록 데이터베이스 읽기/쓰기)
- 이메일 서비스 (`/api/alarm` 통해)

### 내부 모듈
- `src/entities/notion/model/index.ts` - Notion 작업
- `src/features/alarm/api/index.ts` - 이메일 알림

---

## 범위 외

- 제출에 대한 사용자 인증
- 방문자용 수정/삭제 기능
- 스레드 답글 또는 대화
- 메시지의 리치 텍스트 포맷팅
- 파일 첨부
- 스팸 필터링/CAPTCHA
