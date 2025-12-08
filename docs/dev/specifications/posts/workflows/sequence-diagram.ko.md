# Posts 도메인 시퀀스 다이어그램

이 문서는 Posts 도메인의 모든 백엔드 워크플로우에 대한 상세 시퀀스 다이어그램을 포함합니다.

## 1. 포스트 목록 조회

### 개요

서버 사이드 캐싱과 함께 Notion 데이터베이스에서 모든 발행 포스트를 조회합니다.

### 액터

- **Page Component**: 데이터를 요청하는 Next.js 페이지
- **Repository**: `entities/notion/model`
- **Cache**: Next.js `unstable_cache`
- **Notion**: 외부 Notion API

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant P as Page Component
    participant R as Repository<br/>(getNotionPosts)
    participant C as Next.js Cache
    participant N as Notion API

    P->>R: getNotionPosts()
    R->>C: 캐시 확인 (tag: "posts")

    alt 캐시 히트
        C-->>R: 캐시된 DatabaseObjectResponse[]
        R-->>P: 캐시된 데이터 반환
    else 캐시 미스
        R->>N: notion.databases.query()
        Note right of N: Filter: 상태 = "공개"<br/>Sort: 날짜 descending
        N-->>R: Raw 쿼리 결과
        R->>C: tag "posts"와 함께 저장<br/>TTL: ISR_REVALIDATE_TIME
        R-->>P: DatabaseObjectResponse[]
    end

    P->>P: posts.map(Post.create)
    P-->>P: Post[] 도메인 모델
```

### 요청 상세

**Notion 쿼리**:
```typescript
{
  database_id: NOTION_POST_DATABASE_ID,
  filter: {
    property: "상태",
    status: { equals: "공개" }
  },
  sorts: [{
    property: "날짜",
    direction: "descending"
  }]
}
```

### 캐시 설정

| 속성 | 값 |
|-----|-----|
| 캐시 태그 | `posts` |
| 재검증 (개발) | 30초 |
| 재검증 (운영) | 300초 |

---

## 2. 포스트 상세 조회

### 개요

URL slug를 Notion 페이지 ID로 변환하고 렌더링을 위한 전체 페이지 콘텐츠를 조회합니다.

### 액터

- **Page Component**: 포스트 상세 페이지
- **Slug Map**: 캐시된 slug-ID 매핑
- **Repository**: Notion API 래퍼
- **Official Client**: 메타데이터용
- **Unofficial Client**: 콘텐츠 렌더링용

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant P as Page Component
    participant S as Slug Map
    participant R as Repository
    participant OC as Official Client<br/>(@notionhq/client)
    participant UC as Unofficial Client<br/>(notion-client)
    participant N as Notion API

    P->>P: URL params에서 slug 수신

    alt Slug가 Notion 페이지 ID인 경우
        P->>P: slug를 postId로 직접 사용
    else Slug가 제목 기반인 경우
        P->>S: getSlugMap()
        S->>R: getNotionPosts()
        R-->>S: 모든 포스트
        S->>S: { slug: postId } 맵 구축
        S-->>P: slugMap[slug] = postId
    end

    par 메타데이터 조회
        P->>R: getNotionPostMetadata(postId)
        R->>OC: pages.retrieve() + blocks.children.list()
        OC->>N: API 호출
        N-->>OC: 페이지 + 블록 데이터
        OC-->>R: { title, content, tags }
        R-->>P: SEO용 메타데이터
    and 페이지 콘텐츠 조회
        P->>R: getNotionPage(postId)
        R->>UC: notionApi.getPage(postId)
        UC->>N: 비공식 API 호출
        N-->>UC: ExtendedRecordMap
        UC-->>R: recordMap
        R-->>P: 렌더링용 페이지 콘텐츠
    end

    P->>P: ClientNotionRenderer로 렌더링
```

### Slug 변환 로직

```typescript
async function slugToPostId(slugOrId: string) {
  // 이미 Notion 페이지 ID인지 확인
  if (isNotionPageId(slugOrId)) {
    return slugOrId;
  }

  // slug 맵에서 조회
  const slugMap = await getSlugMap();
  const postId = slugMap[decodeURIComponent(slugOrId)];

  if (!postId) {
    throw new Error("Post not found for given slug or id.");
  }

  return postId;
}
```

---

## 3. AI 요약 생성

### 개요

블로그 포스트에 대한 AI 기반 요약을 생성하고 Notion에 저장합니다.

### 액터

- **Client**: 브라우저 UI (AISummaryButton)
- **API Route**: `/api/posts/[postId]/summary`
- **Repository**: Notion 클라이언트 래퍼
- **LLM Service**: OpenAI 또는 Local LLM
- **Cache**: Next.js 캐시 무효화

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant U as 사용자
    participant B as AISummaryButton
    participant A as API Route<br/>/api/posts/[postId]/summary
    participant R as Repository
    participant N as Notion API
    participant L as LLM Service
    participant C as Cache

    U->>B: "요약 생성" 클릭
    B->>B: setIsGenerating(true)
    B->>A: PATCH /api/posts/{postId}/summary

    A->>R: getNotionPostContentForSummary(postId)
    R->>N: pages.retrieve()
    N-->>R: 페이지 속성
    R->>N: blocks.children.list()
    N-->>R: 블록 콘텐츠
    R->>R: title, content, isSummarized 추출
    R-->>A: { title, content, isSummarized }

    alt 이미 요약됨
        A-->>B: 500 { error: "이미 요약이 생성된 포스트입니다" }
        B->>B: setError(message)
        B->>B: setIsGenerating(false)
        B-->>U: 오류 메시지 표시
    else 요약 안됨
        A->>L: getAISummary(title, content)
        Note right of L: NODE_ENV에 따라 제공자 선택<br/>Production: OpenAI<br/>Development: Local LLM

        L->>L: 프롬프트 준비
        L->>L: 콘텐츠를 ~8000 토큰으로 자르기
        L-->>A: 생성된 요약 (2문장)

        A->>R: patchNotionPostSummary(postId, summary)
        R->>N: pages.update()
        Note right of N: "summary" rich_text 속성 업데이트
        N-->>R: 업데이트 확인
        R-->>A: 성공

        A->>C: revalidateTag("posts")
        A->>C: revalidatePath("/posts")
        A->>C: revalidatePath("/")

        A-->>B: 200 { success: true, summary: "..." }
        B->>B: setSummary(summary)
        B->>B: setIsGenerating(false)
        B-->>U: AISummaryCard 표시
    end
```

### 요청/응답 스키마

**요청**:
```typescript
PATCH /api/posts/{postId}/summary
Content-Type: application/json

// Body 필요 없음 - postId는 URL params에서
```

**성공 응답** (200):
```typescript
{
  success: true,
  summary: "이 포스트는... 결론적으로...",
  message: "AI 요약이 성공적으로 생성되었습니다."
}
```

**오류 응답** (500):
```typescript
{
  success: false,
  error: "이미 요약이 생성된 포스트입니다." | "Notion API 권한이 부족합니다." | ...
}
```

### LLM 제공자 선택

```mermaid
flowchart TD
    A[getAISummary 호출됨] --> B{NODE_ENV?}
    B -->|production| C[OpenAI API 사용]
    B -->|development| D[Local LLM 사용]

    C --> E[api.openai.com]
    D --> F[LOCAL_AI_ENDPOINT<br/>예: Ollama localhost:11434]

    E --> G[요약 생성]
    F --> G
```

### 콘텐츠 추출

```typescript
// Notion 블록에서 텍스트 콘텐츠 추출
const content = contentResponse.results
  .filter(block => block.type === "paragraph")
  .map(block =>
    block.paragraph.rich_text
      .map(text => text.plain_text)
      .join("")
  )
  .join("");
```

---

## 4. 태그 목록 조회

### 개요

Notion 데이터베이스 스키마에서 사용 가능한 태그 옵션을 조회합니다.

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant P as Page Component
    participant R as Repository<br/>(getNotionPostDatabaseTags)
    participant C as Next.js Cache
    participant N as Notion API

    P->>R: getNotionPostDatabaseTags()
    R->>C: 캐시 확인 (tag: "tags")

    alt 캐시 히트
        C-->>R: 캐시된 TagDatabaseResponse[]
    else 캐시 미스
        R->>N: notion.databases.retrieve()
        N-->>R: 데이터베이스 스키마
        R->>R: Tags.multi_select.options 추출
        R->>C: tag "tags"와 함께 저장
    end

    R-->>P: TagDatabaseResponse[]
    P->>P: tags.map(Tag.create)
```

### 응답 스키마

```typescript
interface TagDatabaseResponse {
  id: string;      // Notion 태그 ID
  name: string;    // 표시 이름 (예: "React", "TypeScript")
  color: string;   // Notion 색상 값
}
```

---

## 5. 캐시 무효화 플로우

### 개요

데이터 변경 후 트리거되는 캐시 무효화.

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant A as API Route
    participant C as Next.js Cache
    participant ISR as ISR System

    Note over A: 성공적인 변경 후

    A->>C: revalidateTag("posts")
    C->>C: 태그가 있는 모든 항목 무효화
    C-->>A: 태그 무효화됨

    A->>C: revalidatePath("/posts")
    C->>ISR: 경로 재생성 표시
    ISR-->>C: 경로 큐에 추가됨

    A->>C: revalidatePath("/")
    C->>ISR: 경로 재생성 표시
    ISR-->>C: 경로 큐에 추가됨

    Note over ISR: 다음 요청이<br/>재생성 트리거
```

### 무효화 트리거

| 작업 | 무효화되는 태그 | 무효화되는 경로 |
|-----|---------------|----------------|
| AI 요약 생성됨 | `posts` | `/`, `/posts` |
| (향후) 포스트 생성됨 | `posts`, `tags` | `/`, `/posts` |
| (향후) 포스트 업데이트됨 | `posts` | `/`, `/posts`, `/posts/[slug]` |
| (향후) 포스트 삭제됨 | `posts` | `/`, `/posts` |

---

## 6. 정적 생성 플로우

### 개요

빌드 시점에 모든 포스트에 대한 정적 경로를 생성합니다.

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant B as 빌드 프로세스
    participant G as generateStaticParams
    participant R as Repository
    participant N as Notion API

    B->>G: generateStaticParams() 호출
    G->>R: getNotionPosts()
    R->>N: 모든 발행 포스트 조회
    N-->>R: 포스트 데이터
    R-->>G: DatabaseObjectResponse[]

    G->>G: posts.map(Post.create)
    G->>G: 각 포스트에서 slugifiedTitle 추출

    G-->>B: [{ slug: "post-title-1" }, { slug: "post-title-2" }, ...]

    loop 각 slug에 대해
        B->>B: /posts/[slug] 사전 렌더링
    end
```

### 구현

```typescript
export async function generateStaticParams() {
  const posts = (await getNotionPosts()).map(Post.create);

  return posts.map(({ slugifiedTitle }) => ({
    slug: slugifiedTitle,
  }));
}
```

---

## 오류 처리 매트릭스

| 플로우 | 오류 타입 | HTTP 상태 | 복구 |
|-------|---------|----------|------|
| 포스트 조회 | Notion API 오류 | 500 | 오래된 캐시 제공 |
| 상세 조회 | 잘못된 slug | 404 | 404 페이지 표시 |
| 상세 조회 | Notion 페이지 삭제됨 | 404 | 404 페이지 표시 |
| AI 요약 | 이미 요약됨 | 500 | 오류 메시지 표시 |
| AI 요약 | LLM 타임아웃 | 500 | 재시도 버튼 |
| AI 요약 | 요청 제한 | 429 | 대기 후 재시도 |
| AI 요약 | Notion 업데이트 실패 | 500 | 재시도 버튼 |
| 태그 조회 | Notion API 오류 | 500 | 필터 섹션 숨김 |
