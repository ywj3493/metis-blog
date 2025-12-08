# Posts Domain Sequence Diagrams

This document contains detailed sequence diagrams for all backend workflows in the Posts domain.

## 1. Fetch Posts List

### Overview

Fetch all published posts from Notion database with server-side caching.

### Actors

- **Page Component**: Next.js page requesting data
- **Repository**: `entities/notion/model`
- **Cache**: Next.js `unstable_cache`
- **Notion**: External Notion API

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant P as Page Component
    participant R as Repository<br/>(getNotionPosts)
    participant C as Next.js Cache
    participant N as Notion API

    P->>R: getNotionPosts()
    R->>C: Check cache (tag: "posts")

    alt Cache Hit
        C-->>R: Cached DatabaseObjectResponse[]
        R-->>P: Return cached data
    else Cache Miss
        R->>N: notion.databases.query()
        Note right of N: Filter: 상태 = "공개"<br/>Sort: 날짜 descending
        N-->>R: Raw query results
        R->>C: Store with tag "posts"<br/>TTL: ISR_REVALIDATE_TIME
        R-->>P: DatabaseObjectResponse[]
    end

    P->>P: posts.map(Post.create)
    P-->>P: Post[] domain models
```

### Request Details

**Notion Query**:
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

### Cache Configuration

| Property | Value |
|----------|-------|
| Cache Tag | `posts` |
| Revalidate (dev) | 30 seconds |
| Revalidate (prod) | 300 seconds |

---

## 2. Fetch Post Detail

### Overview

Resolve URL slug to Notion page ID and fetch full page content for rendering.

### Actors

- **Page Component**: Post detail page
- **Slug Map**: Cached slug-to-ID mapping
- **Repository**: Notion API wrapper
- **Official Client**: For metadata
- **Unofficial Client**: For content rendering

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant P as Page Component
    participant S as Slug Map
    participant R as Repository
    participant OC as Official Client<br/>(@notionhq/client)
    participant UC as Unofficial Client<br/>(notion-client)
    participant N as Notion API

    P->>P: Receive slug from URL params

    alt Slug is Notion Page ID
        P->>P: Use slug directly as postId
    else Slug is title-based
        P->>S: getSlugMap()
        S->>R: getNotionPosts()
        R-->>S: All posts
        S->>S: Build { slug: postId } map
        S-->>P: slugMap[slug] = postId
    end

    par Fetch Metadata
        P->>R: getNotionPostMetadata(postId)
        R->>OC: pages.retrieve() + blocks.children.list()
        OC->>N: API calls
        N-->>OC: Page + blocks data
        OC-->>R: { title, content, tags }
        R-->>P: Metadata for SEO
    and Fetch Page Content
        P->>R: getNotionPage(postId)
        R->>UC: notionApi.getPage(postId)
        UC->>N: Unofficial API call
        N-->>UC: ExtendedRecordMap
        UC-->>R: recordMap
        R-->>P: Page content for rendering
    end

    P->>P: Render with ClientNotionRenderer
```

### Slug Resolution Logic

```typescript
async function slugToPostId(slugOrId: string) {
  // Check if already a Notion page ID
  if (isNotionPageId(slugOrId)) {
    return slugOrId;
  }

  // Lookup in slug map
  const slugMap = await getSlugMap();
  const postId = slugMap[decodeURIComponent(slugOrId)];

  if (!postId) {
    throw new Error("Post not found for given slug or id.");
  }

  return postId;
}
```

---

## 3. Generate AI Summary

### Overview

Generate AI-powered summary for a blog post and store it in Notion.

### Actors

- **Client**: Browser UI (AISummaryButton)
- **API Route**: `/api/posts/[postId]/summary`
- **Repository**: Notion client wrapper
- **LLM Service**: OpenAI or Local LLM
- **Cache**: Next.js cache invalidation

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant B as AISummaryButton
    participant A as API Route<br/>/api/posts/[postId]/summary
    participant R as Repository
    participant N as Notion API
    participant L as LLM Service
    participant C as Cache

    U->>B: Click "Generate Summary"
    B->>B: setIsGenerating(true)
    B->>A: PATCH /api/posts/{postId}/summary

    A->>R: getNotionPostContentForSummary(postId)
    R->>N: pages.retrieve()
    N-->>R: Page properties
    R->>N: blocks.children.list()
    N-->>R: Block content
    R->>R: Extract title, content, isSummarized
    R-->>A: { title, content, isSummarized }

    alt Already Summarized
        A-->>B: 500 { error: "이미 요약이 생성된 포스트입니다" }
        B->>B: setError(message)
        B->>B: setIsGenerating(false)
        B-->>U: Show error message
    else Not Summarized
        A->>L: getAISummary(title, content)
        Note right of L: Select provider based on NODE_ENV<br/>Production: OpenAI<br/>Development: Local LLM

        L->>L: Prepare prompt
        L->>L: Slice content to ~8000 tokens
        L-->>A: Generated summary (2 sentences)

        A->>R: patchNotionPostSummary(postId, summary)
        R->>N: pages.update()
        Note right of N: Update "summary" rich_text property
        N-->>R: Update confirmation
        R-->>A: Success

        A->>C: revalidateTag("posts")
        A->>C: revalidatePath("/posts")
        A->>C: revalidatePath("/")

        A-->>B: 200 { success: true, summary: "..." }
        B->>B: setSummary(summary)
        B->>B: setIsGenerating(false)
        B-->>U: Display AISummaryCard
    end
```

### Request/Response Schema

**Request**:
```typescript
PATCH /api/posts/{postId}/summary
Content-Type: application/json

// No body required - postId from URL params
```

**Success Response** (200):
```typescript
{
  success: true,
  summary: "This post explains... In conclusion...",
  message: "AI 요약이 성공적으로 생성되었습니다."
}
```

**Error Response** (500):
```typescript
{
  success: false,
  error: "이미 요약이 생성된 포스트입니다." | "Notion API 권한이 부족합니다." | ...
}
```

### LLM Provider Selection

```mermaid
flowchart TD
    A[getAISummary called] --> B{NODE_ENV?}
    B -->|production| C[Use OpenAI API]
    B -->|development| D[Use Local LLM]

    C --> E[api.openai.com]
    D --> F[LOCAL_AI_ENDPOINT<br/>e.g., Ollama localhost:11434]

    E --> G[Generate Summary]
    F --> G
```

### Content Extraction

```typescript
// Extract text content from Notion blocks
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

## 4. Fetch Tags List

### Overview

Retrieve available tag options from Notion database schema.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant P as Page Component
    participant R as Repository<br/>(getNotionPostDatabaseTags)
    participant C as Next.js Cache
    participant N as Notion API

    P->>R: getNotionPostDatabaseTags()
    R->>C: Check cache (tag: "tags")

    alt Cache Hit
        C-->>R: Cached TagDatabaseResponse[]
    else Cache Miss
        R->>N: notion.databases.retrieve()
        N-->>R: Database schema
        R->>R: Extract Tags.multi_select.options
        R->>C: Store with tag "tags"
    end

    R-->>P: TagDatabaseResponse[]
    P->>P: tags.map(Tag.create)
```

### Response Schema

```typescript
interface TagDatabaseResponse {
  id: string;      // Notion tag ID
  name: string;    // Display name (e.g., "React", "TypeScript")
  color: string;   // Notion color value
}
```

---

## 5. Cache Invalidation Flow

### Overview

Cache invalidation triggered after data mutations.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant A as API Route
    participant C as Next.js Cache
    participant ISR as ISR System

    Note over A: After successful mutation

    A->>C: revalidateTag("posts")
    C->>C: Invalidate all entries with tag
    C-->>A: Tag invalidated

    A->>C: revalidatePath("/posts")
    C->>ISR: Mark path for regeneration
    ISR-->>C: Path queued

    A->>C: revalidatePath("/")
    C->>ISR: Mark path for regeneration
    ISR-->>C: Path queued

    Note over ISR: Next request triggers<br/>regeneration
```

### Invalidation Triggers

| Operation | Tags Invalidated | Paths Invalidated |
|-----------|-----------------|-------------------|
| AI Summary Generated | `posts` | `/`, `/posts` |
| (Future) Post Created | `posts`, `tags` | `/`, `/posts` |
| (Future) Post Updated | `posts` | `/`, `/posts`, `/posts/[slug]` |
| (Future) Post Deleted | `posts` | `/`, `/posts` |

---

## 6. Static Generation Flow

### Overview

Generate static paths for all posts at build time.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant B as Build Process
    participant G as generateStaticParams
    participant R as Repository
    participant N as Notion API

    B->>G: Call generateStaticParams()
    G->>R: getNotionPosts()
    R->>N: Fetch all published posts
    N-->>R: Posts data
    R-->>G: DatabaseObjectResponse[]

    G->>G: posts.map(Post.create)
    G->>G: Extract slugifiedTitle from each post

    G-->>B: [{ slug: "post-title-1" }, { slug: "post-title-2" }, ...]

    loop For each slug
        B->>B: Pre-render /posts/[slug]
    end
```

### Implementation

```typescript
export async function generateStaticParams() {
  const posts = (await getNotionPosts()).map(Post.create);

  return posts.map(({ slugifiedTitle }) => ({
    slug: slugifiedTitle,
  }));
}
```

---

## Error Handling Matrix

| Flow | Error Type | HTTP Status | Recovery |
|------|-----------|-------------|----------|
| Fetch Posts | Notion API error | 500 | Serve stale cache |
| Fetch Detail | Invalid slug | 404 | Show 404 page |
| Fetch Detail | Notion page deleted | 404 | Show 404 page |
| AI Summary | Already summarized | 500 | Show error message |
| AI Summary | LLM timeout | 500 | Retry button |
| AI Summary | Rate limited | 429 | Wait and retry |
| AI Summary | Notion update failed | 500 | Retry button |
| Fetch Tags | Notion API error | 500 | Hide filter section |
