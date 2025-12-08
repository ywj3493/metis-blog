# 인프라 명세서

## 로컬 개발 환경

### 필수 소프트웨어

- **Node.js**: 버전 `22.x` (`package.json` engines 필드 참조)
- **패키지 관리자**: pnpm (workspace catalog 기능 필요)
- **Git**: 버전 관리용

### 설치 단계

1. **의존성 설치**:
   ```bash
   pnpm install
   ```

2. **환경 변수 설정**:
   - `.env.local.example`을 `.env.local`로 복사 (템플릿이 있는 경우)
   - 필수 환경 변수 입력 (환경 변수 섹션 참조)

3. **개발 서버 시작**:
   ```bash
   pnpm dev
   ```
   - `http://localhost:3000`에서 실행
   - 핫 리로드 활성화
   - 환경: `NODE_ENV=development`

### 환경 변수

프로젝트 루트에 다음 변수들을 포함한 `.env.local` 파일을 생성하세요:

#### Notion 통합

```bash
NOTION_KEY=secret_xxxxxxxxxxxxx           # Notion 통합 토큰
NOTION_TOKEN_V2=xxxxxxxxxxxxxxxxxx        # 비공식 클라이언트용 브라우저 쿠키
NOTION_POST_DATABASE_ID=xxxxxxxx          # 포스트 데이터베이스 ID
NOTION_GUESTBOOK_DATABASE_ID=xxxxxxxx    # 방명록 데이터베이스 ID
NOTION_ABOUT_PAGE_ID=xxxxxxxx            # About 페이지 ID
NOTION_USER_ID=xxxxxxxx                  # Notion 사용자 ID
```

#### AI 통합

```bash
# 프로덕션: OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxx

# 개발: 로컬 LLM (선택사항)
LOCAL_AI_ENDPOINT=http://localhost:11434
```

#### 이메일 알림

```bash
AUTH_USER=your-email@gmail.com           # Gmail 주소
AUTH_PASS=xxxx xxxx xxxx xxxx            # Gmail 앱 비밀번호 (일반 비밀번호 아님)
```

#### 배포 및 SEO

```bash
BLOG_URL=https://yourdomain.com          # 프로덕션 URL
GOOGLE_SITE_VERIFICATION=xxxxxxxx        # Google Search Console 인증
VERCEL_TOKEN=xxxxxxxx                    # API 접근용 (필요 시)
```

**보안 참고사항**:

- `.env.local`을 버전 관리에 커밋하지 마세요
- `.env.local`은 로컬 개발 전용으로 사용
- 프로덕션 시크릿은 Vercel 프로젝트 설정에 저장

## 도구 및 스크립트

### 개발 명령어

```bash
pnpm dev              # Next.js 개발 서버 시작 (핫 리로드, 포트 3000)
```

### 빌드 명령어

```bash
pnpm build            # ISR 최적화가 적용된 프로덕션 빌드
pnpm start            # 프로덕션 빌드를 로컬에서 서빙
```

### 코드 품질 명령어

```bash
pnpm lint             # Next.js ESLint 실행 (next/core-web-vitals 확장)
pnpm biome:write      # Biome으로 코드 포맷팅 (src/ 디렉토리)
```

### 테스트 명령어

```bash
pnpm test             # MSW 모킹을 사용한 Vitest 실행
pnpm test:deep        # 실제 Notion API 호출을 사용한 확장 테스트
                      # 유효한 NOTION_* 자격 증명 필요
                      # DEEP_TEST=true 플래그 설정
```

### 푸시 전 체크리스트

원격에 푸시하기 전:

1. `pnpm lint` 실행 - ESLint 오류 없는지 확인
2. `pnpm biome:write` 실행 - 코드 일관성 있게 포맷팅
3. `pnpm test` 실행 - 테스트 통과 확인
4. `pnpm build` 실행 - 프로덕션 빌드 성공 확인

## 빌드 및 배포

### 프로덕션 빌드 프로세스

```bash
pnpm build
```

**빌드 출력**:

- Vercel 배포에 최적화
- 가능한 경우 정적 페이지 사전 렌더링
- API 라우트는 서버리스 함수로 번들링
- `sharp` 의존성을 통한 이미지 최적화

**빌드 최적화**:

- SWC 최소화 활성화 (`next.config.mjs` 참조)
- 사용하지 않는 코드에 대한 트리 셰이킹
- 라우트별 코드 스플리팅
- Next.js Image 컴포넌트를 통한 이미지 최적화

### 배포 대상: Vercel

**플랫폼**: Vercel (Next.js에 최적화)

**배포 흐름**:

1. `main` 브랜치에 푸시
2. Vercel이 자동으로 변경 감지
3. `pnpm build` 실행
4. 프로덕션 URL에 배포

**환경 설정**:

- Vercel 프로젝트 설정에서 환경 변수 설정
- Vercel 대시보드를 시크릿 관리에 사용
- 해당되는 경우 커스텀 도메인 설정

### ISR 설정

Incremental Static Regeneration 설정 (`src/shared/config/index.ts`):

```typescript
// 개발
ISR_REVALIDATE_TIME: 30 seconds
MEMORY_CACHE_TTL: 30000 milliseconds

// 프로덕션
ISR_REVALIDATE_TIME: 300 seconds (5분)
MEMORY_CACHE_TTL: 300000 milliseconds
```

**재검증 전략**:

- 시간 기반: 설정된 간격 후 자동 갱신
- 온디맨드: 즉시 업데이트를 위한 `revalidateTag()` 및 `revalidatePath()`

## 데이터 및 통합

### Notion CMS

**통합 유형**: 헤드리스 CMS

**클라이언트 라이브러리**:

1. **공식 클라이언트** (`@notionhq/client`):
   - API: Notion REST API v1
   - 인증: `NOTION_KEY` (통합 토큰)
   - 용도: 데이터베이스 쿼리, 속성 업데이트
   - 위치: `src/entities/notion/api/server-side.ts`

2. **비공식 클라이언트** (`notion-client` + `react-notion-x`):
   - API: Notion의 내부 API
   - 인증: `NOTION_TOKEN_V2` (브라우저 쿠키)
   - 용도: 리치 콘텐츠 렌더링
   - 위치: `src/entities/notion/api/react-notion-x.ts`

**데이터베이스 구조**:

- **Posts 데이터베이스**: 한국어 속성 이름을 가진 블로그 포스트 포함
  - "제목" (Title)
  - "날짜" (Date)
  - "상태" (Status) - 공개 가시성을 위해 "Published"여야 함
  - "태그" (Tags)
  - "요약" (Summary) - AI 생성 요약 저장

- **Guestbook 데이터베이스**: 방문자 메시지 저장
  - 이름, 이메일, 메시지, 가시성 (공개/비공개)

**API 호출 추적**:

- `NotionAPILogger` 싱글톤이 통계를 로깅
- 개발: `logs/notion-api.log`에 기록
- 프로덕션: 데이터 누출 방지를 위한 경량 로깅

### OpenAI / 로컬 LLM

**환경 기반 선택**:

- **프로덕션** (`NODE_ENV=production`): OpenAI API
  - 엔드포인트: `https://api.openai.com/v1`
  - 인증: `OPENAI_API_KEY`
  - 모델: GPT-4 또는 설정된 모델

- **개발** (`NODE_ENV=development`): 로컬 LLM
  - 엔드포인트: `LOCAL_AI_ENDPOINT` (예: `http://localhost:11434`)
  - 인증 불필요
  - Ollama 또는 유사 서비스와 호환

**용도**: 블로그 포스트용 AI 요약 생성

**구현**: `src/entities/openai/`

### 이메일 알림

**제공자**: Gmail SMTP

**설정**:

- SMTP 호스트: `smtp.gmail.com`
- 포트: 465 (SSL) 또는 587 (TLS)
- 인증: 앱 비밀번호 (일반 Gmail 비밀번호 아님)

**Gmail 앱 비밀번호 설정**:

1. Gmail에서 2단계 인증 활성화
2. Google 계정 > 보안 > 앱 비밀번호로 이동
3. "메일"용 새 앱 비밀번호 생성
4. 생성된 비밀번호를 `AUTH_PASS`에 사용

**용도**: 연락처 폼 및 방명록 알림

**구현**: `nodemailer`를 사용하는 `src/features/alarm/`

## 로깅, 캐싱 및 관측성

### 로깅

**프레임워크**: 프리티 프린팅이 포함된 Pino 로거

**설정**:

- 개발: 프리티 프린트된 콘솔 출력
- 프로덕션: JSON 형식 로그

**유틸리티**:

- `withPinoLogger`: 함수 계측용 래퍼
- `NotionAPILogger`: Notion API 호출 통계 추적

**위치**: `src/shared/lib/logger.ts`

**로그 파일**:

- `logs/notion-api.log`: Notion API 호출 추적 (개발 전용)

### 캐싱

**전략**: 다층 캐싱

**레이어**:

1. **Next.js ISR**: 시간 기반 재검증이 포함된 정적 생성
2. **서버 사이드 캐시**: 데이터 가져오기를 위한 `unstable_cache` 래퍼
3. **메모리 캐시**: TTL 기반 인메모리 저장소 (ISR과 정렬)

**캐시 래퍼**: `src/shared/lib/cache.ts`의 `nextServerCache`

**캐시 태그**:

- `posts`: 모든 포스트 관련 쿼리
- 특정 쿼리를 위한 커스텀 태그

**캐시 무효화**:

```typescript
import { revalidateTag, revalidatePath } from 'next/cache';

// 모든 포스트 무효화
revalidateTag('posts');

// 특정 라우트 무효화
revalidatePath('/posts');
```

**사용 사례**: AI 요약 생성 후 캐시를 무효화하여 업데이트된 콘텐츠 표시

### 모니터링

**프로덕션 모니터링**:

- **Vercel Analytics**: 트래픽 및 사용자 행동
- **Vercel Speed Insights**: Core Web Vitals 추적

**구현**: 루트 레이아웃에서 활성화 (`src/app/layout.tsx`)

**추적되는 메트릭**:

- 페이지 뷰
- 사용자 세션
- 성능 메트릭 (LCP, FID, CLS)
- 지리적 분포

## CI/CD 파이프라인

### GitHub Actions

**워크플로우**:

1. **Pull Request 체크** (`.github/workflows/pull_request.yml`):
   - 트리거: `main` 브랜치로의 PR
   - 단계:
     - 의존성 설치
     - Biome 포맷터 체크 실행
   - 목적: 코드 품질 게이트

2. **Preview 배포 정리** (`.github/workflows/cleanup.yml`):
   - 트리거: PR 머지 또는 닫힘
   - 단계:
     - 연관된 Vercel preview 배포 삭제
   - 목적: 리소스 정리

### 지속적 배포

**플랫폼**: Vercel

**트리거**: `main` 브랜치로 푸시

**프로세스**:

1. GitHub 통합을 통해 변경 감지
2. pnpm으로 의존성 설치
3. `pnpm build` 실행
4. 프로덕션에 배포
5. 필요시 엣지 캐싱 무효화 실행

**Preview 배포**:

- Pull Request에 대해 자동
- 각 PR에 고유 URL
- PR 머지/닫힘 후 삭제

## 보안 고려사항

### 시크릿 관리

- `.env.local` 또는 시크릿이 포함된 파일을 **절대 커밋하지 마세요**
- 프로덕션에는 Vercel 환경 변수 사용
- API 키를 주기적으로 로테이션
- Gmail 앱 비밀번호 사용 (일반 비밀번호 아님)

### API 보안

- Notion 토큰은 스코프가 지정된 권한을 가짐 (가능하면 읽기 전용)
- OpenAI API 키는 특정 모델로 제한
- 이메일 자격 증명은 전송만으로 제한

### 콘텐츠 보안

- Notion "상태" (Status) 속성이 포스트 가시성 제어
- "Published" 포스트만 블로그에 표시
- 방명록 메시지는 공개 또는 비공개 가능
- 사용자 인증 불필요 (공개 블로그)

## 문제 해결

### 일반적인 문제

1. **Notion API 오류**:
   - `NOTION_KEY`가 데이터베이스에 접근 권한이 있는지 확인
   - 데이터베이스 ID가 올바른지 확인
   - 한국어 속성 이름이 정확히 일치하는지 확인

2. **빌드 실패**:
   - `.next` 디렉토리 삭제: `rm -rf .next`
   - `node_modules` 삭제 후 재설치: `rm -rf node_modules && pnpm install`
   - TypeScript 오류 확인: `pnpm tsc --noEmit`

3. **캐시가 무효화되지 않음**:
   - 업데이트 후 `revalidateTag()` 호출 확인
   - config에서 ISR 재검증 시간 확인
   - 테스트를 위해 브라우저 캐시 삭제

4. **이메일 전송 실패**:
   - Gmail 앱 비밀번호 확인 (일반 비밀번호 아님)
   - 방화벽이 SMTP 포트 465/587을 허용하는지 확인
   - `AUTH_USER`가 전체 이메일 주소인지 확인
