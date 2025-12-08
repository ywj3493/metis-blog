# Site 도메인 시퀀스 다이어그램

이 문서는 Site 도메인의 모든 백엔드 워크플로우에 대한 상세 시퀀스 다이어그램을 포함합니다.

## 1. Sitemap 생성

### 개요

검색 엔진 크롤러를 위해 모든 공개 블로그 URL을 포함하는 XML sitemap을 생성합니다.

### 액터

- **Search Bot**: 외부 크롤러 (Google, Bing 등)
- **API Route**: `/api/sitemap` 핸들러
- **Repository**: `entities/notion/model`
- **Cache**: Next.js `unstable_cache`
- **Notion**: 외부 Notion API

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant B as Search Bot
    participant A as API Route<br/>(/api/sitemap)
    participant R as Repository<br/>(getNotionPosts)
    participant C as Next.js Cache
    participant N as Notion API

    B->>A: GET /api/sitemap
    A->>A: 환경변수에서 BLOG_URL 조회

    A->>R: getNotionPosts()
    R->>C: 캐시 확인 (태그: "posts")

    alt 캐시 히트
        C-->>R: 캐시된 포스트 데이터
    else 캐시 미스
        R->>N: notion.databases.query()
        Note right of N: 필터: 상태 = "공개"<br/>정렬: 날짜 내림차순
        N-->>R: 원시 쿼리 결과
        R->>C: 태그 "posts"로 저장
    end

    R-->>A: DatabaseObjectResponse[]
    A->>A: posts.map(Post.create)
    A->>A: slug로 포스트 URL 생성
    A->>A: 정적 페이지 URL 추가
    A->>A: XML 포맷

    A-->>B: 200 OK (application/xml)
```

### 데이터 변환

```mermaid
flowchart LR
    subgraph "Notion 응답"
        N[DatabaseObjectResponse]
    end

    subgraph "도메인 모델"
        P[Post]
    end

    subgraph "Sitemap 항목"
        S["{ url, lastModified,<br/>changeFrequency, priority }"]
    end

    subgraph "XML 출력"
        X["&lt;url&gt;...&lt;/url&gt;"]
    end

    N -->|Post.create| P
    P -->|map| S
    S -->|formatAsXml| X
```

### URL 조합

```mermaid
flowchart TD
    subgraph "정적 URL"
        A["/ (priority: 1.0)"]
        B["/about (priority: 0.8)"]
        C["/posts (priority: 0.8)"]
        D["/guestbooks (priority: 0.8)"]
    end

    subgraph "동적 URL"
        E["posts.map(p => /posts/{p.slug})"]
    end

    subgraph "결합된 Sitemap"
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

## 2. Sitemap 캐시 흐름

### 개요

Sitemap 생성은 포스트 목록과 동일한 캐싱 전략을 활용합니다.

### 시퀀스

```mermaid
sequenceDiagram
    autonumber
    participant A as API Route
    participant R as Repository
    participant C as Cache
    participant N as Notion

    Note over A,N: 첫 번째 요청 (캐시 콜드)

    A->>R: getNotionPosts()
    R->>C: 캐시 확인
    C-->>R: 캐시 MISS
    R->>N: 데이터베이스 쿼리
    N-->>R: 포스트 데이터
    R->>C: 저장 (TTL: ISR_REVALIDATE_TIME)
    R-->>A: 포스트

    Note over A,N: 후속 요청 (캐시 웜)

    A->>R: getNotionPosts()
    R->>C: 캐시 확인
    C-->>R: 캐시 HIT
    R-->>A: 캐시된 포스트

    Note over A,N: 캐시 만료 후

    A->>R: getNotionPosts()
    R->>C: 캐시 확인
    C-->>R: 캐시 STALE
    R->>N: Notion에서 재검증
    N-->>R: 새 포스트
    R->>C: 캐시 업데이트
    R-->>A: 새 포스트
```

### 캐시 설정

| 환경 | ISR_REVALIDATE_TIME | 동작 |
|------|---------------------|------|
| 개발 | 30초 | 빠른 반복 |
| 운영 | 300초 | API 호출 감소 |

---

## 3. 에러 시나리오

### Notion API 실패

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
    N--xR: API 에러 (500/타임아웃)

    alt 캐시된 데이터 사용 가능
        R-->>A: 오래된 캐시 데이터
        A->>A: 캐시에서 sitemap 생성
        A-->>B: 200 OK (오래된 sitemap)
    else 캐시 없음
        R--xA: 에러 throw
        A-->>B: 500 Internal Server Error
    end
```

### 빈 포스트 목록

```mermaid
sequenceDiagram
    autonumber
    participant B as Search Bot
    participant A as API Route
    participant R as Repository

    B->>A: GET /api/sitemap
    A->>R: getNotionPosts()
    R-->>A: 빈 배열 []

    A->>A: 정적 URL만 생성
    Note right of A: /, /about, /posts, /guestbooks

    A-->>B: 200 OK (정적 페이지만 있는 sitemap)
```

---

## 4. 성능 고려사항

### 요청 흐름 타이밍

```mermaid
gantt
    title Sitemap 생성 타임라인
    dateFormat X
    axisFormat %L ms

    section 캐시 히트
    캐시 확인              :0, 5
    캐시된 포스트 반환      :5, 10
    XML 포맷               :10, 20
    응답 전송              :20, 25

    section 캐시 미스
    캐시 확인              :0, 5
    Notion API 쿼리        :5, 500
    응답 파싱              :500, 520
    캐시에 저장            :520, 530
    XML 포맷               :530, 550
    응답 전송              :550, 560
```

### 최적화 포인트

| 항목 | 최적화 |
|------|--------|
| 캐싱 | 포스트가 캐시되어 Notion API 호출 감소 |
| 응답 크기 | XML은 요청 시 생성되며 저장되지 않음 |
| 병렬 조회 | 모든 포스트에 대해 단일 데이터베이스 쿼리 |
| Content-Type | 올바른 `application/xml` 헤더 |
