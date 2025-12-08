# Site Domain Sequence Diagrams

This document contains detailed sequence diagrams for all backend workflows in the Site domain.

## 1. Generate Sitemap

### Overview

Generate an XML sitemap containing all public blog URLs for search engine crawlers.

### Actors

- **Search Bot**: External crawler (Google, Bing, etc.)
- **API Route**: `/api/sitemap` handler
- **Repository**: `entities/notion/model`
- **Cache**: Next.js `unstable_cache`
- **Notion**: External Notion API

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant B as Search Bot
    participant A as API Route<br/>(/api/sitemap)
    participant R as Repository<br/>(getNotionPosts)
    participant C as Next.js Cache
    participant N as Notion API

    B->>A: GET /api/sitemap
    A->>A: Get BLOG_URL from env

    A->>R: getNotionPosts()
    R->>C: Check cache (tag: "posts")

    alt Cache Hit
        C-->>R: Cached posts data
    else Cache Miss
        R->>N: notion.databases.query()
        Note right of N: Filter: 상태 = "공개"<br/>Sort: 날짜 descending
        N-->>R: Raw query results
        R->>C: Store with tag "posts"
    end

    R-->>A: DatabaseObjectResponse[]
    A->>A: posts.map(Post.create)
    A->>A: Generate post URLs with slugs
    A->>A: Add static page URLs
    A->>A: Format as XML

    A-->>B: 200 OK (application/xml)
```

### Data Transformation

```mermaid
flowchart LR
    subgraph "Notion Response"
        N[DatabaseObjectResponse]
    end

    subgraph "Domain Model"
        P[Post]
    end

    subgraph "Sitemap Entry"
        S["{ url, lastModified,<br/>changeFrequency, priority }"]
    end

    subgraph "XML Output"
        X["&lt;url&gt;...&lt;/url&gt;"]
    end

    N -->|Post.create| P
    P -->|map| S
    S -->|formatAsXml| X
```

### URL Assembly

```mermaid
flowchart TD
    subgraph "Static URLs"
        A["/ (priority: 1.0)"]
        B["/about (priority: 0.8)"]
        C["/posts (priority: 0.8)"]
        D["/guestbooks (priority: 0.8)"]
    end

    subgraph "Dynamic URLs"
        E["posts.map(p => /posts/{p.slug})"]
    end

    subgraph "Combined Sitemap"
        F[sitemapList]
    end

    A --> F
    B --> F
    C --> F
    D --> F
    E --> F

    F --> G[XML Sitemap]
```

---

## 2. Cache Flow for Sitemap

### Overview

Sitemap generation leverages the same caching strategy as post listing.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant A as API Route
    participant R as Repository
    participant C as Cache
    participant N as Notion

    Note over A,N: First Request (Cache Cold)

    A->>R: getNotionPosts()
    R->>C: Check cache
    C-->>R: Cache MISS
    R->>N: Query database
    N-->>R: Posts data
    R->>C: Store (TTL: ISR_REVALIDATE_TIME)
    R-->>A: Posts

    Note over A,N: Subsequent Requests (Cache Warm)

    A->>R: getNotionPosts()
    R->>C: Check cache
    C-->>R: Cache HIT
    R-->>A: Cached posts

    Note over A,N: After Cache Expiry

    A->>R: getNotionPosts()
    R->>C: Check cache
    C-->>R: Cache STALE
    R->>N: Revalidate from Notion
    N-->>R: Fresh posts
    R->>C: Update cache
    R-->>A: Fresh posts
```

### Cache Configuration

| Environment | ISR_REVALIDATE_TIME | Behavior |
|-------------|---------------------|----------|
| Development | 30 seconds | Fast iteration |
| Production | 300 seconds | Reduced API calls |

---

## 3. Error Scenarios

### Notion API Failure

```mermaid
sequenceDiagram
    autonumber
    participant B as Search Bot
    participant A as API Route
    participant R as Repository
    participant N as Notion API

    B->>A: GET /api/sitemap
    A->>R: getNotionPosts()
    R->>N: notion.databases.query()
    N--xR: API Error (500/timeout)

    alt Cached Data Available
        R-->>A: Stale cached data
        A->>A: Generate sitemap from cache
        A-->>B: 200 OK (stale sitemap)
    else No Cache
        R--xA: Throw error
        A-->>B: 500 Internal Server Error
    end
```

### Empty Posts List

```mermaid
sequenceDiagram
    autonumber
    participant B as Search Bot
    participant A as API Route
    participant R as Repository

    B->>A: GET /api/sitemap
    A->>R: getNotionPosts()
    R-->>A: Empty array []

    A->>A: Generate static URLs only
    Note right of A: /, /about, /posts, /guestbooks

    A-->>B: 200 OK (sitemap with static pages only)
```

---

## 4. Performance Considerations

### Request Flow Timing

```mermaid
gantt
    title Sitemap Generation Timeline
    dateFormat X
    axisFormat %L ms

    section Cache Hit
    Check cache           :0, 5
    Return cached posts   :5, 10
    Format XML            :10, 20
    Send response         :20, 25

    section Cache Miss
    Check cache           :0, 5
    Query Notion API      :5, 500
    Parse response        :500, 520
    Store in cache        :520, 530
    Format XML            :530, 550
    Send response         :550, 560
```

### Optimization Points

| Aspect | Optimization |
|--------|-------------|
| Caching | Posts are cached, reducing Notion API calls |
| Response Size | XML is generated on-demand, not stored |
| Parallel Fetching | Single database query for all posts |
| Content-Type | Correct `application/xml` header |
