<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->
<!-- @reference: [architecture](architecture.md) | [infrastructure](infrastructure.md) -->

> [← 아키텍처](architecture.md) | [인프라 →](infrastructure.md)

# 설정

## 환경 변수

`.env.local` 파일에 다음 변수를 설정하세요:

### Notion (필수)

| 변수 | 설명 | 예시 |
|------|------|------|
| `NOTION_KEY` | 내부 통합 토큰 (공식 API) | `secret_xxx` |
| `NOTION_TOKEN_V2` | 브라우저 쿠키 토큰 (react-notion-x 렌더러) | `v02%3Auser_token_or_...` |
| `NOTION_USER_ID` | Notion 활성 사용자 ID (react-notion-x) | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `NOTION_POST_DATABASE_ID` | 포스트 데이터베이스 ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `NOTION_GUESTBOOK_DATABASE_ID` | 방명록 데이터베이스 ID | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |

### AI / LLM

| 변수 | 환경 | 설명 | 예시 |
|------|------|------|------|
| `OPENAI_API_KEY` | Production 전용 | OpenAI API 키 | `sk-xxx` |
| `LOCAL_AI_ENDPOINT` | Development 전용 | 로컬 LLM 엔드포인트 (예: Ollama) | `http://localhost:11434` |
| `LOCAL_AI_MODEL` | Development 전용 | 기본 로컬 모델 오버라이드 | `gemma3:1b` (기본값) |

### 이메일 (방명록 알림에 필수)

| 변수 | 설명 | 예시 |
|------|------|------|
| `AUTH_USER` | Gmail 발신 주소 | `your@gmail.com` |
| `AUTH_PASS` | Gmail 앱 비밀번호 (일반 비밀번호 아님) | `xxxx xxxx xxxx xxxx` |

### 선택사항

| 변수 | 설명 | 예시 |
|------|------|------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 측정 ID | `G-XXXXXXXXXX` |
| `GOOGLE_SITE_VERIFICATION` | Google Search Console 인증 파일명 | `googleXXXXX.html` |

### CI / 빌드

| 변수 | 설명 | 예시 |
|------|------|------|
| `CI_MOCK` | CI 빌드에서 Notion API 목 데이터 사용 | `true` |

## 애플리케이션 설정

### 캐시 설정

**소스**: `src/shared/config/index.ts`

```typescript
export const CACHE_CONFIG = {
  ISR_REVALIDATE_TIME: process.env.NODE_ENV === "development" ? 30 : 300, // 초
  get MEMORY_CACHE_TTL() { return this.ISR_REVALIDATE_TIME * 1000; },     // 밀리초
};
```

| 환경 | ISR 재검증 | 메모리 캐시 TTL |
|------|-----------|---------------|
| Development | 30초 | 30,000 ms |
| Production | 300초 (5분) | 300,000 ms |

### 요약 모델 설정

**소스**: `src/shared/config/index.ts`

```typescript
export const SUMMARY_MODEL_CONFIG = {
  model: process.env.NODE_ENV === "development"
    ? (process.env.LOCAL_AI_MODEL ?? "gemma3:1b")
    : "gpt-4o-mini",
  temperature: 0.2,
  max_tokens: 50,
  top_p: 0.9,
};
```

### Next.js 설정

**소스**: `next.config.mjs`

| 설정 | 값 | 비고 |
|------|---|------|
| `swcMinify` | `true` | SWC 기반 압축 |
| `reactStrictMode` | `true` | React strict mode 활성화 |
| 이미지 원격 패턴 | `www.notion.so`, `noticon-static.tammolo.com` | 허용된 원격 이미지 호스트 |
| Rewrite: `/sitemap.xml` | → `/api/sitemap` | API 라우트로 사이트맵 제공 |

### TypeScript 설정

**소스**: `tsconfig.json`

| 설정 | 값 |
|------|---|
| `strict` | `true` |
| `noUnusedLocals` | `true` |
| `noUnusedParameters` | `true` |
| 경로 별칭 `@/*` | `src/*` |

### Notion 데이터베이스 속성

데이터베이스 속성은 **한국어 이름**을 사용합니다:

| 한국어 | 영어 | 타입 |
|--------|------|------|
| 제목 | Title | Title |
| 날짜 | Date | Date |
| 상태 | Status | Select (`공개` = 게시됨) |
| 태그 | Tags | Multi-select |

> **전체 문서**
> [아키텍처](architecture.md) | **[설정]** | [인프라](infrastructure.md) | [도메인](README.md)
