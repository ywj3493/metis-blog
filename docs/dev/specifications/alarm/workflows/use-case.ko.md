# Alarm 도메인 유즈케이스 (백엔드)

이 문서는 Alarm 도메인의 백엔드 API 유즈케이스를 설명합니다.

## UC-API-020: 이메일 알림 전송

### 엔드포인트 상세

| 속성 | 값 |
|------|-----|
| 메소드 | `POST` |
| 경로 | `/api/alarm` |
| 인증 | 없음 (내부 사용) |
| 속도 제한 | 없음 (Gmail 제한에 의존) |

### 목적

다양한 이벤트(방명록 제출, 연락 메시지 등)에 대해 블로그 소유자에게 이메일 알림을 전송합니다.

### 요청

```typescript
// 메소드
POST

// 헤더
Content-Type: application/json

// 본문
{
  from: string;     // 발신자 식별자 (이메일 또는 이름)
  subject: string;  // 이메일 제목
  message: string;  // 이메일 본문 내용 (일반 텍스트 또는 HTML)
}
```

### 유효성 검증 스키마

```typescript
const bodySchema = z.object({
  from: z.string(),
  subject: z.string(),
  message: z.string(),
});
```

### 응답

**성공 (200)**:
```typescript
{
  message: "메일을 성공적으로 보냈음"
}
```

**유효성 검증 오류 (400)**:
```typescript
"보내는이, 제목, 내용은 문자열만 가능합니다."
```

**서버 오류 (500)**:
```typescript
{
  message: "메일 전송에 실패함",
  error: Error
}
```

### 구현

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bodySchema.safeParse(body);

  if (!parsed.success) {
    return new Response("보내는이, 제목, 내용은 문자열만 가능합니다.", {
      status: 400,
    });
  }

  return sendEamil(body)
    .then(() => {
      return new Response(
        JSON.stringify({ message: "메일을 성공적으로 보냈음" }),
        { status: 200 }
      );
    })
    .catch((error) => {
      return new Response(
        JSON.stringify({ message: "메일 전송에 실패함", error }),
        { status: 500 }
      );
    });
}
```

### 의존성

**서비스 함수**: `sendEmail()`

```typescript
export async function sendEamil({ from, subject, message }: EmailForm) {
  const mailData = {
    to: process.env.AUTH_USER,
    subject: `[BLOG] ${subject}`,
    from,
    html: `
      <h1>${subject}</h1>
      <div>${message}</div>
      <br />
      <p>보낸사람: ${from}</p>
    `,
  };

  return transporter.sendMail(mailData);
}
```

**SMTP Transporter**:

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});
```

---

## 사용 패턴

### 패턴 1: 방명록 알림

**호출자**: `GuestbookForm` 컴포넌트

**트리거**: 성공적인 방명록 제출 후

**예시**:
```typescript
// GuestbookForm.onSubmit() 내부
const guestbookResponse = await fetch('/api/guestbooks', {
  method: 'POST',
  body: JSON.stringify(formData),
});

if (guestbookResponse.ok) {
  // Fire-and-forget 알림
  fetch('/api/alarm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'guestbook@blog.com',
      subject: `새로운 방명록: ${formData.name}`,
      message: `
        이름: ${formData.name}
        내용: ${formData.content}
        공개여부: ${formData.isPrivate ? '비공개' : '공개'}
      `,
    }),
  }); // await 하지 않음 - fire and forget
}
```

### 패턴 2: 연락처 폼 알림 (향후)

**호출자**: `ContactForm` 컴포넌트 (아직 미구현)

**트리거**: 연락처 폼 제출 후

**예시**:
```typescript
// 향후 구현
fetch('/api/alarm', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    from: contactData.email,
    subject: `연락 문의: ${contactData.subject}`,
    message: contactData.message,
  }),
});
```

---

## 오류 처리

### 유효성 검증 오류

| 필드 | 오류 조건 | 응답 |
|-----|---------|------|
| from | 누락 또는 문자열 아님 | 400 |
| subject | 누락 또는 문자열 아님 | 400 |
| message | 누락 또는 문자열 아님 | 400 |

### 서버 오류

| 오류 유형 | 원인 | 응답 |
|---------|-----|------|
| 인증 실패 | 잘못된 `AUTH_PASS` | 500 |
| 연결 타임아웃 | 네트워크 문제 | 500 |
| 속도 제한 | Gmail 일일 제한 초과 | 500 |
| 잘못된 수신자 | 올바르지 않은 `AUTH_USER` | 500 |

---

## 보안 고려사항

### 입력 검증

- 모든 필드는 Zod를 통해 문자열로 검증
- 특정 길이 제한 없음 (Gmail이 처리)
- 메시지에서 HTML 허용 (포맷팅용)

### 자격 증명 보호

- SMTP 자격 증명은 환경 변수에 저장
- 일반 Gmail 비밀번호 대신 앱 비밀번호 사용
- 자격 증명은 절대 로깅되거나 응답에 반환되지 않음

### 접근 제어

- 엔드포인트는 공개적으로 접근 가능
- 내부 호출자의 fire-and-forget 패턴에 의존
- 프로덕션을 위해 속도 제한 추가 고려

### 개인정보

- 이메일 내용은 애플리케이션에 저장되지 않음
- 오류 정보만 로깅될 수 있음
- 수신자는 항상 블로그 소유자 (요청으로 설정 불가)

---

## 테스트

### 단위 테스트 시나리오

```typescript
describe("POST /api/alarm", () => {
  it("should send email with valid data", async () => {
    // transporter.sendMail 모킹
    // 200 상태 검증
    // sendMail이 올바른 파라미터로 호출됐는지 검증
  });

  it("should reject missing from field", async () => {
    // from 없이 POST
    // 400 상태 검증
    // 오류 메시지 검증
  });

  it("should reject missing subject field", async () => {
    // subject 없이 POST
    // 400 상태 검증
  });

  it("should reject missing message field", async () => {
    // message 없이 POST
    // 400 상태 검증
  });

  it("should handle SMTP failure", async () => {
    // transporter.sendMail을 reject하도록 모킹
    // 500 상태 검증
    // 오류 메시지 검증
  });
});
```

### 통합 테스트 시나리오

```typescript
describe("Alarm Integration", () => {
  it("should deliver email to Gmail", async () => {
    // 실제 SMTP 호출 (유효한 자격 증명 필요)
    // 테스트 이메일 받은 편지함 확인
    // 테스트 후 정리
  });
});
```

---

## 모니터링

### 권장 메트릭

| 메트릭 | 설명 |
|-------|------|
| `alarm_requests_total` | 총 알림 요청 수 |
| `alarm_success_total` | 성공한 전송 수 |
| `alarm_failures_total` | 실패한 전송 수 |
| `alarm_latency_ms` | 요청 처리 시간 |

### 로깅

```typescript
// 현재 구현 (암시적)
// 오류는 응답에 반환됨, 명시적으로 로깅되지 않음

// 권장 추가
console.error("Alarm error:", error);
```

### 알림

| 조건 | 심각도 | 조치 |
|-----|--------|------|
| 연속 다중 실패 | 높음 | SMTP 자격 증명 확인 |
| 지연 > 5초 | 중간 | 네트워크/Gmail 상태 확인 |
| 오류율 > 10% | 높음 | 근본 원인 조사 |

---

## 속도 제한

### Gmail 제한

| 제한 유형 | 값 | 참고 |
|---------|---|-----|
| 일일 전송 제한 | 500 이메일 | 무료 Gmail 계정 |
| 분당 | ~20 이메일 | 대략적 |
| 수신자 제한 | 500/일 | 전송과 동일 |

### 고려사항

- 현재 블로그 트래픽은 제한에 도달할 가능성 낮음
- 애플리케이션 레벨 속도 제한 없음
- 트래픽 증가 시 구현 고려

---

## 향후 개선 사항

| 개선 | 설명 | 우선순위 |
|-----|-----|---------|
| 재시도 메커니즘 | 실패한 이메일 재시도 | 중간 |
| 큐 시스템 | 전송을 요청에서 분리 | 중간 |
| 다중 제공자 | 백업 SMTP로 장애 조치 | 낮음 |
| 템플릿 시스템 | 설정 가능한 이메일 템플릿 | 낮음 |
| 전송 추적 | 열람/클릭률 추적 | 낮음 |
