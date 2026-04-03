<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# 네이밍 규칙

## TL;DR

| 대상 | 규칙 | 예시 |
|------|------|------|
| 파일 / 디렉토리 | `kebab-case` | `post-card.tsx`, `ai-summary/` |
| React 컴포넌트 | `PascalCase` (export) | `export const PostCard = () => {}` |
| 함수 / 변수 | `camelCase` | `fetchPosts()`, `postData` |
| 상수 | `UPPER_SNAKE_CASE` | `ISR_REVALIDATE_TIME` |
| 타입 / 인터페이스 | `PascalCase` | `interface PostData {}`, `type TagName = string` |
| Private 메서드 | `_camelCase` | `private _validatePost()` |
| 브랜치 | `<type>/<issue>[-desc]` | `feat/93-docs-refactor` |

## 파일 & 디렉토리 네이밍

- **모든 파일**: `kebab-case` — 소문자와 하이픈
- **React 컴포넌트 파일**: `kebab-case.tsx` (컴포넌트 export는 `PascalCase`)
- **테스트 파일**: `<name>.test.ts` 또는 `<name>.test.tsx`
- **타입 정의 파일**: `type.d.ts`
- **인덱스 파일**: `index.ts` (barrel export)

### 예시

```
src/features/post/ui/post-card.tsx        → export const PostCard
src/entities/post/model/type.d.ts         → interface IPost
src/shared/lib/cache.ts                   → export const nextServerCache
src/shared/config/index.ts                → export const CACHE_CONFIG
```

## 코드 네이밍

### React 컴포넌트

```typescript
// 파일: src/features/post/ui/featured-post.tsx
export const FeaturedPost = () => { ... }
```

### 함수 & 변수

```typescript
const fetchPosts = async () => { ... }
const postData = await fetchPosts();
```

### 상수

```typescript
export const CACHE_CONFIG = { ... };
export const SUMMARY_MODEL_CONFIG = { ... };
```

### 타입 & 인터페이스

```typescript
interface IPost { ... }
interface IGuestbook { ... }
type PostDatabaseResponse = ...;
type TagName = string;
```

### 도메인 모델 (클래스명)

```typescript
export class Post { ... }
export class Tag { ... }
export class Guestbook { ... }
```

## FSD 레이어 네이밍

| 레이어 | 디렉토리 패턴 | 예시 |
|--------|-------------|------|
| Features | `src/features/<feature-name>/` | `src/features/post/` |
| Entities | `src/entities/<entity-name>/` | `src/entities/post/` |
| Shared | `src/shared/<category>/` | `src/shared/ui/`, `src/shared/lib/` |

### Feature 내부 구조

```
src/features/<name>/
├── ui/          # UI 컴포넌트
├── api/         # API 호출 및 비즈니스 로직
├── hooks/       # 커스텀 React 훅
└── index.ts     # 공개 exports
```

## Summary 네이밍

AI 생성 요약 관련 네이밍 시 항상 `summary`를 사용 — `ai` 접두어 사용 금지.

| 올바름 | 잘못됨 |
|--------|--------|
| `summary-card.tsx` | `ai-summary-card.tsx` |
| `getSummary()` | `getAiSummary()` |
| `SummaryButton` | `AiSummaryButton` |
