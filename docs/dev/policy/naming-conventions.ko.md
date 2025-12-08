# 네이밍 규칙

## TL;DR (빠른 참조)

| 대상 | 규칙 | 예시 |
|------|-----------|---------|
| 파일/디렉토리 | `kebab-case` | `post-card.tsx`, `ai-summary/` |
| React 컴포넌트 | `PascalCase` | `PostCard`, `AISummaryButton` |
| 함수/변수 | `camelCase` | `fetchPosts`, `postData` |
| 상수 | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| 타입/인터페이스 | `PascalCase` | `PostData`, `TagName` |
| Private 메서드 | `_camelCase` | `_validatePost` |
| Boolean 변수 | `is/has/should + 명사` | `isLoading`, `hasError` |
| 이벤트 핸들러 | `handle + 이벤트` | `handleClick`, `handleSubmit` |

**황금률**: 설명적인 이름 > 짧은 이름. 코드는 작성되는 것보다 읽히는 것이 더 많습니다.

---

## 개요

일관된 네이밍은 코드를 읽기 쉽고, 검색 가능하며, 유지보수 가능하게 만듭니다. 이 문서는 파일, 디렉토리, 코드 식별자 및 기타 프로젝트 아티팩트에 대한 네이밍 규칙을 정의합니다.

## 파일 및 디렉토리 네이밍

### 파일: kebab-case

**규칙**: 모든 파일은 하이픈을 사용한 소문자(kebab-case)를 사용합니다

**예시**:
```text
✅ post-card.tsx
✅ ai-summary-button.tsx
✅ guestbook-form.tsx
✅ use-theme-toggle.ts
✅ cache-config.ts

❌ PostCard.tsx
❌ AI_Summary_Button.tsx
❌ guestbookForm.tsx
❌ useThemeToggle.ts
```

**근거**:
- 플랫폼 간 일관성 (대소문자 구분 vs 대소문자 무시 파일시스템)
- 타이핑하고 기억하기 쉬움
- URL 패턴과 일치

### 디렉토리: kebab-case

**규칙**: 모든 디렉토리는 하이픈을 사용한 소문자를 사용합니다

**예시**:
```text
✅ src/features/ai-summary/
✅ src/entities/posts/
✅ src/shared/lib/
✅ docs/specifications/

❌ src/features/AISummary/
❌ src/entities/Posts/
❌ src/shared/Lib/
```

### 특수 파일

#### 설정 파일

커뮤니티 규칙을 따릅니다:

```text
✅ next.config.mjs
✅ tailwind.config.ts
✅ tsconfig.json
✅ .eslintrc.json
✅ biome.json
✅ package.json
```

#### 문서 파일

루트 레벨 문서는 대문자 사용:

```text
✅ README.md
✅ AGENTS.md
✅ LICENSE
✅ CHANGELOG.md
```

중첩된 문서는 소문자 사용:

```text
✅ docs/specifications/architecture.md
✅ docs/policy/commit-convention.md
✅ docs/issue/issue087.md
```

#### 한국어 문서

`.md` 전에 `.ko` 접미사 추가:

```text
✅ architecture.ko.md
✅ commit-convention.ko.md
✅ requirements.ko.md
```

## 코드 식별자 네이밍

### React 컴포넌트: PascalCase

**규칙**: 컴포넌트 이름은 PascalCase(UpperCamelCase) 사용

**예시**:
```typescript
✅ export function PostCard() { }
✅ export function AIAssistantButton() { }
✅ export const ThemeProvider = () => { }

❌ export function postCard() { }
❌ export function ai_assistant_button() { }
❌ export const theme_provider = () => { }
```

**파일 vs Export**:
```typescript
// 파일: ai-summary-button.tsx
export function AISummaryButton() {
  // 컴포넌트 구현
}
```

### 함수와 변수: camelCase

**규칙**: 함수, 변수, 매개변수는 camelCase(lowerCamelCase) 사용

**예시**:
```typescript
✅ function fetchPosts() { }
✅ const isPublished = true;
✅ const postId = '123';
✅ const handleSubmit = () => { };

❌ function FetchPosts() { }
❌ const IsPublished = true;
❌ const post_id = '123';
❌ const handle_submit = () => { };
```

### 상수: UPPER_SNAKE_CASE

**규칙**: 모듈 레벨 상수는 UPPER_SNAKE_CASE 사용

**예시**:
```typescript
✅ const ISR_REVALIDATE_TIME = 300;
✅ const MEMORY_CACHE_TTL = 300000;
✅ const DEFAULT_POST_LIMIT = 20;

❌ const isrRevalidateTime = 300;
❌ const memoryCacheTTL = 300000;
❌ const default-post-limit = 20;
```

**예외**: Const 객체는 속성 접근에 camelCase 사용:

```typescript
✅ const CACHE_CONFIG = {
  revalidateTime: 300,
  cacheTTL: 300000,
};

// camelCase로 접근
const time = CACHE_CONFIG.revalidateTime;
```

### 클래스: PascalCase

**규칙**: 클래스 이름은 PascalCase 사용

**예시**:
```typescript
✅ class Post { }
✅ class NotionAPILogger { }
✅ class Tag { }

❌ class post { }
❌ class notionAPILogger { }
❌ class tag { }
```

### 인터페이스와 타입: PascalCase

**규칙**: TypeScript 인터페이스와 타입은 PascalCase 사용

**예시**:
```typescript
✅ interface IPost { }
✅ type PostStatus = 'draft' | 'published';
✅ interface NotionDatabaseResponse { }

❌ interface iPost { }
❌ type post_status = 'draft' | 'published';
❌ interface notion_database_response { }
```

**참고**: 클래스와 구분하기 위해 인터페이스에 `I` 접두사 사용:
```typescript
✅ interface IPost { }     // 인터페이스
✅ class Post { }          // 클래스

// 이렇게 하면 어떤 것이 어떤 것인지 명확합니다
const post: IPost = new Post();
```

### Enum: PascalCase

**규칙**: Enum 이름은 PascalCase, 값은 UPPER_SNAKE_CASE 사용

**예시**:
```typescript
✅ enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

❌ enum postStatus {
  draft = 'draft',
  published = 'published',
}
```

**선호**: 가능하면 enum 대신 const 객체나 리터럴 타입 사용:

```typescript
✅ const POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

✅ type PostStatus = 'draft' | 'published';
```

### Private 멤버: _접두사

**규칙**: Private 클래스 멤버는 언더스코어 접두사 사용 (선택사항)

**예시**:
```typescript
class Post {
  ✅ private _id: string;
  ✅ private _calculateSlug(): string { }

  // 이것도 허용 (TypeScript private 키워드로 충분)
  ✅ private id: string;
  ✅ private calculateSlug(): string { }
}
```

**선호**: TypeScript `private` 키워드 사용, 명확성을 위해 언더스코어는 선택사항

## Hook 네이밍

### Custom Hooks: use* 접두사

**규칙**: Custom React hook은 `use` + camelCase로 시작

**예시**:
```typescript
✅ function useTheme() { }
✅ function usePostFilter() { }
✅ function useNotionData() { }

❌ function theme() { }
❌ function getPostFilter() { }
❌ function fetchNotionData() { }
```

**파일 네이밍**: kebab-case의 hook 이름과 일치
```text
파일: use-theme.ts
Export: export function useTheme() { }
```

## API 라우트 네이밍

### Next.js App Router 라우트

**규칙**: 라우트 폴더는 kebab-case 사용, 파일은 Next.js 규칙 사용

**구조**:
```text
app/
├── posts/
│   ├── page.tsx              ✅ Next.js 페이지
│   ├── [slug]/
│   │   └── page.tsx          ✅ 동적 라우트
│   └── route.ts              ✅ API 라우트
├── api/
│   ├── posts/
│   │   ├── route.ts          ✅ /api/posts 엔드포인트
│   │   └── [postId]/
│   │       └── summary/
│   │           └── route.ts  ✅ /api/posts/:postId/summary
```

**파일**:
- `page.tsx`: 페이지 컴포넌트
- `layout.tsx`: 레이아웃 컴포넌트
- `route.ts`: API 라우트 핸들러
- `loading.tsx`: 로딩 UI
- `error.tsx`: 에러 UI

## 테스트 파일 네이밍

### 테스트 파일

**규칙**: 테스트 파일은 소스 파일 이름과 일치하며 `.test` 또는 `.spec` 접미사 사용

**예시**:
```text
소스: post-card.tsx
테스트: post-card.test.tsx  ✅

소스: use-theme.ts
테스트: use-theme.spec.ts   ✅

❌ post-card.tests.tsx
❌ PostCard.test.tsx
❌ test-post-card.tsx
```

**선호**: 일관성을 위해 `.test` 사용 (프로젝트에서 이미 사용 중)

## 환경 변수 네이밍

### 네이밍 패턴

**규칙**: 설명적인 접두사가 있는 UPPER_SNAKE_CASE

**예시**:
```bash
✅ NOTION_KEY=xxx
✅ NOTION_POST_DATABASE_ID=xxx
✅ OPENAI_API_KEY=xxx
✅ LOCAL_AI_ENDPOINT=xxx
✅ AUTH_USER=xxx
✅ BLOG_URL=xxx

❌ notionKey=xxx
❌ notion-key=xxx
❌ apiKey=xxx          # 너무 일반적
❌ key=xxx             # 너무 모호함
```

**접두사**:
- `NOTION_*`: Notion 관련 변수
- `OPENAI_*`: OpenAI 관련 변수
- `AUTH_*`: 인증 자격 증명
- `VERCEL_*`: Vercel 특정 변수
- `GOOGLE_*`: Google 서비스

### Next.js Public 변수

**규칙**: 클라이언트 측 접근을 위해 `NEXT_PUBLIC_` 접두사 사용

**예시**:
```bash
✅ NEXT_PUBLIC_BLOG_URL=https://example.com
✅ NEXT_PUBLIC_ANALYTICS_ID=xxx

❌ BLOG_URL=xxx                 # 클라이언트에서 접근 불가
❌ NEXT_PUBLIC_API_KEY=xxx      # 비밀 정보를 절대 노출하지 마세요!
```

**경고**: 비밀 정보(API 키, 토큰, 비밀번호)에는 절대 `NEXT_PUBLIC_` 사용하지 마세요

## Import Alias 네이밍

### 경로 Alias

**규칙**: `src/` 디렉토리에 `@` 사용

**예시**:
```typescript
✅ import { Post } from '@/entities/posts';
✅ import { Button } from '@/shared/ui/button';
✅ import { cn } from '@/shared/lib/utils';

❌ import { Post } from '../../entities/posts';
❌ import { Button } from '../../../shared/ui/button';
```

**설정** (`tsconfig.json`에서):
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 브랜치와 태그 네이밍

### Git 브랜치

**규칙**: `<타입>/<이슈번호>[-설명]`

**예시**:
```text
✅ feat/087-add-search
✅ fix/088-mobile-header
✅ chore/089-update-deps

❌ feature/add-search
❌ fix-mobile
❌ my-branch
```

자세한 내용은 [branching-strategy.md](./branching-strategy.ko.md)를 참조하세요.

### Git 태그

**규칙**: `v` 접두사가 있는 시맨틱 버저닝

**예시**:
```text
✅ v1.0.0
✅ v1.2.3
✅ v2.0.0-beta.1

❌ 1.0.0          # v 접두사 누락
❌ version-1.0    # 잘못된 형식
❌ release-1      # 시맨틱이 아님
```

## 이슈와 문서 네이밍

### 이슈 문서

**규칙**: 0으로 채워진 순차적 번호를 가진 `issue0XX.md`

**예시**:
```text
✅ issue085.md
✅ issue086.md
✅ issue100.md

❌ issue85.md      # 앞자리 0 누락
❌ issue-087.md    # 하이픈 불필요
❌ issue_088.md    # 언더스코어 사용 안 함
```

### 문서 파일

**규칙**: 설명적인 kebab-case 이름

**예시**:
```text
✅ architecture.md
✅ commit-convention.md
✅ naming-conventions.md
✅ infrastructure.md

❌ Architecture.md
❌ commit_convention.md
❌ namingConventions.md
```

## Co-location과 구조

### 기능 기반 구조

**규칙**: 관련 파일을 타입별이 아닌 기능별로 그룹화

**좋음 (co-located)**:
```text
features/posts/
├── ai-summary/
│   ├── ai-summary-button.tsx
│   ├── ai-summary-display.tsx
│   └── use-ai-summary.ts
├── filter/
│   ├── post-filter.tsx
│   └── use-post-filter.ts
└── ui/
    ├── post-card.tsx
    └── post-list.tsx
```

**나쁨 (타입 기반)**:
```text
components/
├── AIAssistantButton.tsx
├── PostFilter.tsx
├── PostCard.tsx
└── PostList.tsx
hooks/
├── useAIAssistant.ts
└── usePostFilter.ts
```

### Index 파일

**규칙**: export를 집계하기 위해 `index.ts` 사용

**예시**:
```typescript
// features/posts/index.ts
export { PostCard } from './ui/post-card';
export { PostList } from './ui/post-list';
export { usePostFilter } from './filter/use-post-filter';
```

**Import**:
```typescript
✅ import { PostCard, PostList } from '@/features/posts';

❌ import { PostCard } from '@/features/posts/ui/post-card';
❌ import { PostList } from '@/features/posts/ui/post-list';
```

## 약어 처리

### 코드에서

**규칙**: 약어를 단어로 취급 (최대 2개의 대문자)

**예시**:
```typescript
✅ function parseHtml() { }
✅ const apiEndpoint = '...';
✅ class HttpClient { }
✅ interface ApiResponse { }

❌ function parseHTML() { }
❌ const APIEndpoint = '...';
❌ class HTTPClient { }
❌ interface APIResponse { }
```

**예외**: 상수에서는 약어를 대문자로 유지

```typescript
✅ const DEFAULT_API_URL = '...';
✅ const HTML_PARSER_CONFIG = { };
```

### 파일 이름에서

**규칙**: 파일 이름에서는 약어를 소문자로

**예시**:
```text
✅ api-client.ts
✅ html-parser.ts
✅ seo-metadata.ts
✅ ai-summary-button.tsx

❌ API-client.ts
❌ HTML-parser.ts
❌ SEO-metadata.ts
❌ AI-summary-button.tsx
```

## Boolean 네이밍

### 술어(Predicates)

**규칙**: `is`, `has`, `should`, `can` 접두사 사용

**예시**:
```typescript
✅ const isPublished = true;
✅ const hasError = false;
✅ const shouldRedirect = true;
✅ const canEdit = false;

❌ const published = true;
❌ const error = false;
❌ const redirect = true;
❌ const edit = false;
```

### Boolean을 반환하는 함수

**규칙**: `is`, `has`, `should`, `can`으로 시작

**예시**:
```typescript
✅ function isValidPost(post: Post): boolean { }
✅ function hasPublishedStatus(post: Post): boolean { }
✅ function shouldShowSummary(): boolean { }

❌ function validatePost(post: Post): boolean { }
❌ function checkStatus(post: Post): boolean { }
```

## 안티패턴

### 사용하지 마세요

```typescript
❌ 약어 (`id`, `url`, `api` 같은 일반적인 것 제외)
   // 나쁨
   const usr = getUser();
   const cfg = getConfig();

   // 좋음
   const user = getUser();
   const config = getConfig();

❌ 단일 문자 변수 (루프 인덱스 제외)
   // 나쁨
   const p = getPosts();
   const r = await fetch(url);

   // 좋음
   const posts = getPosts();
   const response = await fetch(url);

   // 예외: 루프 인덱스
   for (let i = 0; i < posts.length; i++) { }

❌ 헝가리안 표기법
   // 나쁨
   const strName = 'John';
   const intAge = 30;

   // 좋음 (TypeScript가 타입을 제공)
   const name = 'John';
   const age = 30;

❌ 중복 네이밍
   // 나쁨
   class PostClass { }
   interface IPostInterface { }
   const postObject = { };

   // 좋음
   class Post { }
   interface IPost { }
   const post = { };
```

## 요약

**빠른 참조**:

| 항목 | 규칙 | 예시 |
|------|------------|---------|
| 파일 | kebab-case | `post-card.tsx` |
| 디렉토리 | kebab-case | `ai-summary/` |
| 컴포넌트 | PascalCase | `PostCard` |
| 함수 | camelCase | `fetchPosts()` |
| 변수 | camelCase | `postId` |
| 상수 | UPPER_SNAKE_CASE | `ISR_REVALIDATE_TIME` |
| 클래스 | PascalCase | `Post` |
| 인터페이스 | PascalCase (I 접두사) | `IPost` |
| 타입 | PascalCase | `PostStatus` |
| Hook | use + camelCase | `useTheme()` |
| 환경 변수 | UPPER_SNAKE_CASE | `NOTION_KEY` |
| 브랜치 | type/number-desc | `feat/087-search` |
| 이슈 | issue0XX.md | `issue087.md` |

일관된 네이밍은 인지 부하를 줄이고 코드를 더 쉽게 탐색하고 유지보수할 수 있게 만듭니다.

---

> 마지막 번역: 2025-11-25 | 원본: naming-conventions.md
