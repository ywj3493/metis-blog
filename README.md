# Meti's Blog

메티의 노션 기반 기술 블로그입니다. Next.js App Router 위에서 구동되며 노션 데이터베이스를 원천 데이터로 사용하고, 방명록 및 AI 요약과 같은 인터랙션 기능을 제공합니다.

## 주요 기능
- 노션 데이터베이스에서 글을 동기화해 정적 페이지로 제공 (ISR + 서버 캐시)
- 태그 필터링이 가능한 포스트 목록과 상세 페이지, 이전/다음 내비게이터
- OpenAI 또는 로컬 LLM을 통한 자동 포스트 요약 생성 및 Notion 컬럼 업데이트
- 방명록 작성 및 관리 (Notion DB 연동) + 관리자 이메일 알림
- 라이트/다크 테마 토글, Tooltip, Header 등 공용 UI 위젯 제공

## 기술 스택
| 영역 | 사용 기술 |
| --- | --- |
| Framework | Next.js (App Router), React 18 |
| 언어 & 빌드 | TypeScript, pnpm, Turbopack/Next Build |
| UI | Tailwind CSS, shadcn/ui, next-themes |
| 데이터 연동 | 공식 Notion API, notion-client (unofficial), @notionhq/client |
| AI | OpenAI API, 로컬 LLM 엔드포인트 (예: Ollama) |
| 테스트 | Vitest, @testing-library/react, MSW |
| 로깅 & 기타 | pino, zod |

## 디렉터리 구조
Feature-Sliced Design(FSD)에 맞춰 UI와 비즈니스 로직을 계층화했습니다.

```
src/
├── app/           # Next.js App Router 페이지 및 API Route
├── entities/      # 도메인 모델, 노션/AI 연동, UI 컴포넌트 조각
├── features/      # 특정 사용자 기능 단위 (게시글 목록, 방명록, 알람 등)
├── widgets/       # 페이지 레벨에서 조합되는 UI 블록 (Header 등)
├── shared/        # 공용 설정, 유틸, UI 프리미티브, 캐시 래퍼
├── mocks/         # MSW 핸들러, 테스트용 컴포넌트
└── __test__/      # Vitest 테스트 스위트
```

### 데이터 흐름 스냅샷
1. `entities/notion`이 공식 Notion API/NotionAPI 클라이언트를 이용해 DB를 조회합니다.
2. `entities/posts`가 조회 데이터를 `Post`/`Tag` 객체로 정제하고, `features/posts`가 UI에 맞게 구성합니다.
3. 상세 페이지(`app/posts/[slug]`)는 슬러그-아이디 맵을 캐싱하고 Notion 페이지를 렌더링(`react-notion-x`).
4. `features/posts/ui/ai-summary-button`은 `/api/posts/[postId]/summary` PATCH를 호출해 AI 요약을 생성하고, 성공 시 Notion `summary` 속성을 업데이트 후 ISR 캐시를 무효화합니다.
5. 방명록(`features/guestbooks`)은 `/api/guestbooks`를 통해 Notion DB에 쓰기/읽기 요청을 보내며, `features/alarm`은 `/api/alarm`으로 이메일 알림을 발송합니다.

## 환경 변수
> 실제 값은 공유하지 마세요. 아래 키들을 `.env.local` 등에 설정해야 합니다.

### Notion
- `NOTION_KEY` : 공식 Notion API 토큰
- `NOTION_ABOUT_PAGE_ID` : 소개 페이지 블록 ID
- `NOTION_POST_DATABASE_ID` : 포스트 데이터베이스 ID
- `NOTION_GUESTBOOK_DATABASE_ID` : 방명록 데이터베이스 ID
- `NOTION_USER_ID` : notion-client activeUser 설정
- `NOTION_TOKEN_V2` : notion-client authToken (쿠키 기반)

### AI 요약
- `OPENAI_API_KEY` : 프로덕션 요약용 OpenAI 토큰
- `LOCAL_AI_ENDPOINT` : 개발 환경에서 사용할 로컬 LLM API (예: `http://localhost:11434`)

### 이메일 알림
- `AUTH_USER` : Gmail 계정
- `AUTH_PASS` : Gmail 앱 비밀번호

### 기타
- `BLOG_URL` : 배포된 블로그 기본 URL (SEO canonical)
- `GOOGLE_SITE_VERIFICATION` : 검색 콘솔 검증 파일명
- `VERCEL_TOKEN` : Vercel 자동화에 사용할 토큰 (필요 시)

## 개발 환경 설정
1. Node.js 22.x와 pnpm이 설치되어 있어야 합니다.
2. 저장소 클론 후 의존성 설치:
   ```bash
   pnpm install
   ```
3. 환경 변수 파일 `.env.local`을 루트에 준비합니다 (위 키 참고).
4. 개발 서버 실행:
   ```bash
   pnpm dev
   ```
   기본 포트는 `http://localhost:3000` 입니다.

## 주요 스크립트
- `pnpm dev` : 개발 서버 (Hot Reload 포함)
- `pnpm build` : 프로덕션 번들 & ISR 준비
- `pnpm start` : 빌드 결과 서빙
- `pnpm lint` : Next.js ESLint 규칙 검사
- `pnpm biome:write` : Biome 포맷터로 코드 정리
- `pnpm test` : Vitest (jsdom) 테스트 실행
- `pnpm test:deep` : `DEEP_TEST=true` 설정으로 확장 테스트 실행

## 테스트 전략
- `src/__test__` 내부에서 Testing Library로 컴포넌트 상호작용을 검증합니다.
- `src/mocks`에 MSW 핸들러 및 테스트 전용 컴포넌트를 유지해 API 호출을 모킹합니다.
- `vitest.setup.ts`에서 jest-dom matcher와 전역 설정을 적용합니다.

## 캐싱 & 로깅
- `CACHE_CONFIG`와 `nextServerCache` 유틸을 통해 ISR(개발 30초, 프로덕션 5분)＋서버 캐시 TTL을 통일합니다.
- Notion API 호출은 `withPinoLogger`로 감싸 호출 통계를 로컬 `logs/notion-api.log`에 남깁니다.
- 요약 생성 이후 `revalidateTag`/`revalidatePath`로 관련 페이지를 즉시 무효화합니다.

## 배포 노트
- 기본 배포 대상은 Vercel이며, Edge 또는 Node 런타임을 사용합니다.
- `sharp` 의존성 덕분에 이미지 최적화가 활성화되어 있으니 Vercel 빌드 환경에서 자동 처리됩니다.
- Gmail SMTP, Notion, OpenAI 토큰은 Vercel 프로젝트 설정의 Environment Variables에 안전하게 저장하세요.

## 참고 자료
- Notion API: https://developers.notion.com/
- react-notion-x: https://github.com/NotionX/react-notion-x
- Next.js ISR: https://nextjs.org/docs/app/building-your-application/data-fetching/revalidating
