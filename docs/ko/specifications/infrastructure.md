<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->
<!-- @reference: [architecture](architecture.md) | [config](config.md) -->

> [← 설정](config.md) | [도메인 →](README.md)

# 인프라

## 기술 스택

| 분류 | 기술 | 버전/비고 |
|------|------|----------|
| 프레임워크 | Next.js 14 | App Router, ISR |
| 언어 | TypeScript | Strict mode |
| 스타일링 | Tailwind CSS | + tailwindcss-animate |
| UI 라이브러리 | shadcn/ui | Radix UI 프리미티브, `src/shared/ui/`에 설치 |
| CMS | Notion | 이중 클라이언트 (@notionhq/client + react-notion-x) |
| AI | OpenAI / Ollama | 환경 기반 선택 |
| 이메일 | Nodemailer | Gmail SMTP |
| 런타임 | Node.js 22.x | `.nvmrc`와 `engines`로 강제 |
| 패키지 매니저 | pnpm 10.x | 워크스페이스 카탈로그 |
| 포매터 | Biome | `pnpm biome:write` |
| 린터 | ESLint | next/core-web-vitals 설정 |
| 테스트 프레임워크 | Vitest | + MSW (API 모킹) |
| 테스트 라이브러리 | @testing-library/react | + jest-dom, user-event |
| 로깅 | Pino | + pino-pretty (dev) |
| 분석 | Vercel Analytics | + Speed Insights |
| 호스팅 | Vercel | 자동 배포 |

## 개발 환경 설정

### 사전 요구사항

- Node.js 22.x (`.nvmrc` 참조)
- pnpm 10.x (`package.json`의 `packageManager` 참조)

### 명령어

```bash
# 개발
pnpm dev              # 개발 서버 시작 (http://localhost:3000)
pnpm build            # ISR 포함 프로덕션 빌드
pnpm start            # 프로덕션 빌드 서빙

# 코드 품질
pnpm lint             # ESLint (next/core-web-vitals)
pnpm biome:write      # Biome 포매팅

# 테스트
pnpm test             # Vitest + MSW 모킹
pnpm test:deep        # 실제 Notion API 통합 테스트 (인증 정보 필요)
```

## 빌드 및 배포

### Vercel 배포

- **플랫폼**: Vercel
- **빌드**: ISR (Incremental Static Regeneration)
- **재검증**: 프로덕션에서 300초
- **CI 목**: `CI_MOCK=true`일 때 Notion API 호출은 `src/shared/api/notion-mock.ts`의 목 데이터 사용

### ISR 캐싱 전략

모든 Notion 데이터 페칭은 `nextServerCache()` 래퍼를 사용합니다:

```
요청 → ISR 캐시 확인 → 캐시 히트 → 캐시된 페이지 제공
                     → 캐시 미스/만료 → Notion에서 조회 → 페이지 재생성 → 캐시
```

**캐시 무효화** (데이터 변경 후):

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

revalidateTag('posts');              // 모든 포스트 쿼리 무효화
revalidatePath('/posts');            // 포스트 목록 페이지 무효화
revalidatePath(`/posts/${postId}`);  // 특정 포스트 페이지 무효화
```

## 외부 서비스

### Notion 연동

| 연동 | 클라이언트 | 인증 토큰 | 용도 |
|------|-----------|----------|------|
| 공식 API | `@notionhq/client` | `NOTION_KEY` | 데이터베이스 쿼리, 속성 업데이트 |
| 비공식 API | `notion-client` | `NOTION_TOKEN_V2` | 페이지 콘텐츠 렌더링 |

### Gmail SMTP

- **라이브러리**: Nodemailer
- **서비스**: Gmail
- **인증**: 앱 비밀번호 (일반 비밀번호 아님)
- **트리거**: 새 방명록 작성 → 블로그 소유자에게 이메일 알림

### LLM 제공자

| 환경 | 제공자 | 설정 |
|------|--------|------|
| Development | Ollama | 로컬 엔드포인트, 모델 설정 가능 |
| Production | OpenAI | `gpt-4o-mini`, API 키 필수 |

## CI/CD 파이프라인

### PR CI (`.github/workflows/pull_request.yml`)

`main`으로의 모든 PR에서 실행:

1. **코드 품질** — `biome ci .` (Biome 2.4.2)
2. **린트** — `pnpm lint` (ESLint)
3. **테스트** — `pnpm test --run` (Vitest + MSW)
4. **빌드** — `pnpm build` with `CI_MOCK=true` (Notion API 목)

CI 빌드는 모든 Notion 인증에 목 환경 변수를 사용합니다.

### 프로덕션 배포 (`.github/workflows/deploy.yml`)

`v*` 태그 (예: `v1.0.0`)로 트리거:

1. 태그가 `main` 브랜치에 있는지 검증
2. 의존성 설치 (`pnpm install --frozen-lockfile`)
3. Vercel 환경 가져오기 (`vercel pull --environment=production`)
4. Vercel CLI로 빌드 (`vercel build --prod`)
5. Vercel에 배포 (`vercel deploy --prebuilt --prod`)

**필요한 시크릿**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

## 모니터링 및 로깅

| 도구 | 용도 |
|------|------|
| `@vercel/analytics` | 페이지뷰 및 웹 분석 |
| `@vercel/speed-insights` | Core Web Vitals 모니터링 |
| Pino logger | 서버 사이드 구조화 로깅 |

### Notion API 로거

**소스**: `src/shared/lib/logger.ts`

- `NotionAPILogger` (싱글톤) — API 호출 횟수, 성공/실패, 응답 시간 추적
- `withPinoLogger(fn, name)` — 비동기 함수를 자동 로깅으로 래핑하는 고차 함수
- `setupBuildEndLogger()` — 프로세스 종료 핸들러 등록하여 최종 빌드 통계 출력
- 개발: `pino-pretty`로 `logs/notion-api.log`에 예쁜 로그
- 프로덕션: stdout에 JSON 구조화 로그

## 목 시스템 (테스트 및 CI)

**소스**: `src/mocks/`

| 모듈 | 용도 |
|------|------|
| `src/mocks/server.ts` | Vitest 테스트용 MSW 서버 |
| `src/mocks/browser.ts` | 개발/스토리북용 MSW 브라우저 |
| `src/mocks/handlers.ts` | 요청 핸들러 정의 |
| `src/shared/api/notion-mock.ts` | CI 빌드용 정적 목 데이터 (`MOCK_POSTS`, `MOCK_TAGS`, `MOCK_PAGE_RECORD_MAP`) |

> **전체 문서**
> [아키텍처](architecture.md) | [설정](config.md) | **[인프라]** | [도메인](README.md)
