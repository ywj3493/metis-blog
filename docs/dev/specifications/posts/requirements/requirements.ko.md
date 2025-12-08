# Posts 도메인 요구사항

이 문서는 Posts 도메인의 기능 요구사항을 정의합니다. 블로그 포스트 조회, 필터링, AI 요약, 네비게이션 기능을 포함합니다.

## 개요

Posts 도메인은 블로그의 핵심 콘텐츠 전달 시스템입니다. Notion에서 가져온 블로그 포스트 표시, 태그 기반 필터링을 통한 콘텐츠 탐색, 요청 시 AI 요약 생성, 포스트 간 원활한 네비게이션을 관리합니다.

## 기능 요구사항

### FR-POSTS-001: 포스트 목록 표시

**설명**: 발행된 모든 블로그 포스트를 체계적이고 탐색 가능한 형식으로 표시합니다.

**인수 기준**:
- Notion 데이터베이스에서 상태가 "공개"인 포스트 조회
- 날짜 기준 내림차순 정렬 (최신순)
- 포스트 메타데이터 표시: 제목, 날짜, 태그, 커버 이미지, 아이콘
- AI 요약이 있으면 표시, 없으면 본문 발췌 표시
- 반응형 그리드 레이아웃 (화면 크기에 적응)
- 설정 가능한 재검증 주기로 ISR 캐싱 적용

**데이터 소스**:
- `getNotionPosts()`를 통한 Notion Post 데이터베이스
- 캐시 태그: `posts`

**관련 컴포넌트**:
- `src/features/posts/ui/posts-grid.tsx`
- `src/entities/posts/ui/post-card.tsx`

---

### FR-POSTS-002: 태그 기반 필터링

**설명**: 방문자가 하나 이상의 태그를 선택하여 포스트를 필터링할 수 있도록 합니다.

**인수 기준**:
- Notion 데이터베이스 스키마에서 사용 가능한 모든 태그 표시
- 다중 태그 선택 허용 (토글 온/오프)
- OR 로직으로 포스트 필터링 (선택된 태그 중 ANY 포함 시 표시)
- 공유 가능한 필터 뷰를 위한 URL 쿼리 파라미터 업데이트
- 필터 조건에 맞는 포스트가 없을 때 빈 상태 표시
- 세션 내 페이지 네비게이션 시 필터 상태 유지

**필터 로직**:
```
IF 선택된 태그 없음:
  모든 포스트 표시
ELSE:
  post.tags INTERSECT selectedTags가 빈 집합이 아닌 포스트 표시
```

**데이터 소스**:
- `getNotionPostDatabaseTags()`를 통한 태그 옵션
- 캐시 태그: `tags`

**관련 컴포넌트**:
- `src/features/tags/ui/tag-filter.tsx`
- `src/features/posts/ui/filterable-post.tsx`

---

### FR-POSTS-003: 포스트 상세 렌더링

**설명**: Notion의 리치 포맷팅을 유지하며 전체 블로그 포스트 콘텐츠를 렌더링합니다.

**인수 기준**:
- URL slug를 slug 맵을 통해 Notion 페이지 ID로 매핑
- Notion 페이지 콘텐츠를 완전히 렌더링하며 다음을 보존:
  - 텍스트 포맷팅 (볼드, 이탤릭, 밑줄, 취소선)
  - 제목 (H1, H2, H3)
  - 구문 강조가 적용된 코드 블록
  - 이미지 및 임베디드 미디어
  - 테이블, 콜아웃, 토글
  - 링크 (내부 및 외부)
- 포스트 메타데이터 표시 (제목, 날짜, 태그)
- 요약이 있으면 AI 요약 카드 표시
- 요약이 없으면 "요약 생성" 버튼 제공
- 적절한 SEO 메타데이터 구현 (제목, 설명, Open Graph)

**Slug 매핑**:
- `github-slugger`를 통해 제목을 URL 안전 slug로 변환
- `getSlugMap()`에서 양방향 매핑 유지

**듀얼 클라이언트 아키텍처**:
| 클라이언트 | 용도 | 토큰 |
|-----------|------|------|
| Official (`@notionhq/client`) | 메타데이터, 데이터베이스 쿼리 | `NOTION_KEY` |
| Unofficial (`notion-client`) | 리치 콘텐츠 렌더링 | `NOTION_TOKEN_V2` |

**관련 컴포넌트**:
- `src/entities/posts/ui/client-notion-renderer.tsx`
- `src/entities/posts/ui/ai-summary-card.tsx`
- `src/features/posts/ui/ai-summary-button.tsx`

---

### FR-POSTS-004: AI 요약 생성

**설명**: 사용자 요청 시 블로그 포스트의 AI 기반 요약을 생성합니다.

**인수 기준**:
- 기존 요약이 없는 포스트에 "AI 요약 생성" 버튼 표시
- 요약 생성 중 로딩 상태 표시
- 주요 포인트를 담은 2문장 요약 생성
- 생성된 요약을 Notion "summary" 속성에 저장
- 생성 후 전용 카드 컴포넌트에 요약 표시
- 성공적인 생성 후 관련 캐시 무효화
- 사용자 친화적인 메시지로 오류 처리
- 중복 생성 방지 (`isSummarized` 플래그 확인)

**LLM 설정**:
| 환경 | 제공자 | 엔드포인트 |
|------|--------|-----------|
| Production | OpenAI | `api.openai.com` |
| Development | Local LLM | `LOCAL_AI_ENDPOINT` (예: Ollama) |

**API 엔드포인트**: `PATCH /api/posts/[postId]/summary`

**캐시 무효화**:
- `revalidateTag('posts')`
- `revalidatePath('/posts')`
- `revalidatePath('/')`

**관련 컴포넌트**:
- `src/features/posts/ui/ai-summary-button.tsx`
- `src/entities/posts/ui/ai-summary-card.tsx`
- `src/app/api/posts/[postId]/summary/route.ts`
- `src/entities/openai/model/index.ts`

---

### FR-POSTS-005: 추천 포스트 표시

**설명**: 홈 페이지에 선택된 포스트를 쇼케이스하여 주목할 만한 콘텐츠를 강조합니다.

**인수 기준**:
- 홈 페이지에 추천 포스트 그리드 표시
- 포스트 카드에 표시: 제목, 요약/발췌, 날짜, 태그, 커버 이미지
- 적절한 개수로 표시 제한 (예: 6-9개 포스트)
- 각 카드를 전체 포스트 상세 페이지에 링크
- 포스트 목록 페이지와 시각적 일관성 유지

**현재 구현**: 모든 발행된 포스트가 표시됩니다 (선택 기준 없음).

**관련 컴포넌트**:
- `src/features/posts/ui/featured-post.tsx`
- `src/entities/posts/ui/post-card.tsx`
- `src/entities/posts/ui/small-post-card.tsx`

---

### FR-POSTS-006: 포스트 네비게이션

**설명**: 연속적인 읽기 경험을 위한 포스트 간 네비게이션을 제공합니다.

**인수 기준**:
- 포스트 상세 페이지에 이전/다음 포스트 링크 표시
- 공유 태그 기반 관련 포스트 표시
- 네비게이션 제안 정렬 기준:
  1. 태그 유사도 (공유 태그가 많을수록 높은 우선순위)
  2. 날짜 근접도 (날짜가 가까울수록 높은 우선순위)
- 엣지 케이스 처리 (첫 포스트는 이전 없음, 마지막은 다음 없음)

**관련 컴포넌트**:
- `src/features/posts/ui/post-navigator.tsx`

---

## 데이터 모델

### Post 엔티티

```typescript
interface IPost {
  id: string;              // Notion 페이지 ID
  title: string;           // 포스트 제목 (제목)
  slugifiedTitle: string;  // URL 안전 slug
  tags: ITag[];            // 연관 태그
  cover: string;           // 커버 이미지 URL
  icon: string;            // 아이콘 이미지 URL (기본값: /mascot.png)
  publishTime: string;     // 발행일 (날짜)
  lastEditedTime: string;  // 마지막 수정 타임스탬프
  aiSummary: string;       // AI 생성 요약 (생성되지 않았으면 빈 문자열)
}
```

### Tag 엔티티

```typescript
interface ITag {
  id: string;          // Notion 태그 ID
  name: string;        // 태그 표시 이름
  color: string;       // Notion 색상 값
  description?: string; // 선택적 설명
}
```

### Notion 속성 매핑

| 도메인 속성 | Notion 속성 (한글) | Notion 타입 |
|------------|-------------------|-------------|
| title | 제목 | title |
| tags | Tags | multi_select |
| publishTime | 날짜 | date |
| status | 상태 | status |
| aiSummary | summary | rich_text |
| cover | cover | external URL |
| icon | icon | external URL |

---

## 비기능 요구사항

### NFR-POSTS-001: 성능

- 포스트 목록 페이지 로드 < 2초
- 포스트 상세 페이지 로드 < 3초 (리치 콘텐츠 포함)
- ISR 재검증: 30초 (개발) / 300초 (운영)
- 클라이언트 사이드 필터링 응답 < 100ms

### NFR-POSTS-002: 캐싱 전략

- 서버 사이드: 태그와 함께 Next.js `unstable_cache`
- 캐시 태그: `posts`, `tags`
- 데이터 변경 후 수동 무효화

### NFR-POSTS-003: SEO

- 포스트별 고유 메타 제목 및 설명
- 포스트 커버에서 Open Graph 이미지
- 블로그 포스트용 구조화된 데이터 (JSON-LD)
- 모든 발행 포스트의 사이트맵 포함

### NFR-POSTS-004: 접근성

- 태그 필터 키보드 네비게이션
- 커버 이미지 대체 텍스트
- 포스트 콘텐츠의 시맨틱 제목 계층
- 인터랙티브 요소의 ARIA 레이블

---

## 의존성

### 외부 서비스
- Notion API (공식 및 비공식 클라이언트)
- OpenAI API (운영) / Local LLM (개발)

### 내부 모듈
- `src/shared/lib/cache.ts` - 캐싱 래퍼
- `src/shared/config/index.ts` - ISR 설정

---

## 범위 외

- 포스트 전체 텍스트 검색
- 포스트 반응/좋아요
- 댓글 시스템
- RSS 피드 생성
- 다중 저자 귀속
