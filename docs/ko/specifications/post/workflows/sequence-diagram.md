<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [component-spec](component-spec.md) -->

> [← 유스케이스](use-cases.md) | [컴포넌트 명세 →](component-spec.md)

# Post 도메인 — 시퀀스 다이어그램

## 아키텍처 레이어

```mermaid
graph TD
  subgraph Presentation
    HomePage["page.tsx<br/>(app/)"]
    PostsPage["posts/page.tsx<br/>(app/)"]
    PostDetailPage["posts/[slug]/page.tsx<br/>(app/)"]
  end

  subgraph Feature
    FeaturedPosts["featured-post.tsx<br/>(features/post)"]
    FilterablePosts["filterable-post.tsx<br/>(features/post)"]
    TagFilter["tag-filter.tsx<br/>(features/tag)"]
    PostNavigator["post-navigator.tsx<br/>(features/post)"]
    NotionRenderer["client-notion-renderer.tsx<br/>(features/post)"]
  end

  subgraph Entity
    PostModel["Post.create()<br/>(entities/post/model)"]
    PostAPI["getNotionPosts()<br/>(entities/post/api)"]
    TagAPI["getNotionPostDatabaseTags()<br/>(entities/post/api)"]
    PageAPI["getNotionPage()<br/>(entities/post/api)"]
    SlugMap["getSlugMap()<br/>(entities/post/api)"]
  end

  subgraph Infrastructure
    NotionOfficial["@notionhq/client"]
    NotionUnofficial["notion-client"]
    Cache["nextServerCache()"]
  end
```

## 흐름 1: 포스트 목록 로딩 (UC-POST-01)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant PostsPage as posts/page.tsx
  participant PostAPI as entities/post/api
  participant Cache as nextServerCache
  participant Notion as Notion API

  Reader->>PostsPage: GET /posts
  PostsPage->>PostAPI: getNotionPosts()
  PostAPI->>Cache: 캐시 확인 ["posts"]
  alt 캐시 히트
    Cache-->>PostAPI: 캐시된 결과
  else 캐시 미스
    Cache->>Notion: databases.query(status=공개, sort=날짜 desc)
    Notion-->>Cache: DatabaseObjectResponse[]
    Cache-->>PostAPI: 결과 (ISR_REVALIDATE_TIME 동안 캐시)
  end
  PostAPI-->>PostsPage: DatabaseObjectResponse[]

  PostsPage->>PostAPI: getNotionPostDatabaseTags()
  PostAPI->>Cache: 캐시 확인 ["tags"]
  Cache-->>PostAPI: TagDatabaseResponse[]
  PostAPI-->>PostsPage: TagDatabaseResponse[]

  PostsPage->>PostsPage: FilterablePosts(dataList, tagDataList) 렌더링
  PostsPage-->>Reader: 포스트 그리드 + 태그 사이드바 HTML
```

## 흐름 2: 포스트 상세 렌더링 (UC-POST-02)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant DetailPage as posts/[slug]/page.tsx
  participant SlugMap as getSlugMap()
  participant PostAPI as entities/post/api
  participant NotionX as notion-client (비공식)
  participant Renderer as ClientNotionRenderer

  Reader->>DetailPage: GET /posts/{slug}
  DetailPage->>SlugMap: getSlugMap()
  SlugMap->>PostAPI: getNotionPosts()
  PostAPI-->>SlugMap: posts[]
  SlugMap-->>DetailPage: {slug: pageId} 맵

  DetailPage->>DetailPage: slug에서 pageId 해석
  alt 유효한 slug
    DetailPage->>PostAPI: getNotionPage(pageId)
    PostAPI->>NotionX: notionApi.getPage(pageId)
    NotionX-->>PostAPI: ExtendedRecordMap
    PostAPI-->>DetailPage: recordMap
    DetailPage->>Renderer: render(recordMap)
    Renderer-->>Reader: 리치 Notion 콘텐츠 (다크/라이트 인식)
  else 유효하지 않은 slug
    DetailPage-->>Reader: 404 Not Found
  end
```

## 흐름 3: 태그 필터링 (UC-POST-03)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant FilterablePosts as FilterablePosts (클라이언트)
  participant TagFilter as TagFilter (클라이언트)
  participant PostsGrid as PostsGrid

  Note over FilterablePosts: 모든 포스트와 태그는 서버 사이드에서 로드됨

  Reader->>TagFilter: 태그 칩 "React" 클릭
  TagFilter->>FilterablePosts: setSelectedTags("React" 추가)
  FilterablePosts->>FilterablePosts: 포스트 필터링 (OR: 선택된 태그 중 하나라도)
  FilterablePosts->>PostsGrid: render(filteredPosts)
  PostsGrid-->>Reader: 업데이트된 그리드

  Reader->>TagFilter: 태그 칩 "TypeScript" 클릭
  TagFilter->>FilterablePosts: setSelectedTags("TypeScript" 추가)
  FilterablePosts->>FilterablePosts: 포스트 필터링 (React OR TypeScript)
  FilterablePosts->>PostsGrid: render(filteredPosts)
  PostsGrid-->>Reader: 업데이트된 그리드

  Reader->>TagFilter: 태그 칩 "React" 다시 클릭 (해제)
  TagFilter->>FilterablePosts: setSelectedTags("React" 제거)
  FilterablePosts->>FilterablePosts: 포스트 필터링 (TypeScript만)
  FilterablePosts->>PostsGrid: render(filteredPosts)
  PostsGrid-->>Reader: 업데이트된 그리드
```

## 흐름 4: 관련 포스트 네비게이션 (UC-POST-04)

```mermaid
sequenceDiagram
  participant DetailPage as posts/[slug]/page.tsx
  participant Navigator as PostNavigator (서버)
  participant PostAPI as entities/post/api
  participant Reader as 독자

  DetailPage->>Navigator: render(currentPostId)
  Navigator->>PostAPI: getNotionPosts()
  PostAPI-->>Navigator: allPosts[]
  Navigator->>Navigator: 현재 포스트 찾기
  Navigator->>Navigator: 태그 공유 포스트 필터링
  Navigator->>Navigator: 날짜 근접성 정렬, 4개 선택
  Navigator-->>DetailPage: SmallPostCard[] 그리드
  DetailPage-->>Reader: 포스트 콘텐츠 + 관련 포스트

  Reader->>Reader: 관련 포스트 클릭
  Reader->>DetailPage: GET /posts/{related-slug}
```

## 에러 처리 흐름

```mermaid
sequenceDiagram
  participant Page as App Router 페이지
  participant PostAPI as entities/post/api
  participant Notion as Notion API

  Page->>PostAPI: getNotionPosts()
  PostAPI->>Notion: databases.query()
  Notion-->>PostAPI: 에러 (네트워크/인증)
  PostAPI->>PostAPI: NotionApiError throw
  PostAPI-->>Page: NotionApiError
  Page-->>Page: 에러 바운더리가 error.tsx 렌더링
```

## 성능: 캐싱 전략

| 함수 | 캐시 키 | 재검증 | 태그 |
|------|---------|-------|------|
| `getNotionPosts()` | `["posts"]` | `ISR_REVALIDATE_TIME` | — |
| `getNotionPostDatabaseTags()` | `["tags"]` | `ISR_REVALIDATE_TIME` | — |
| `getNotionPage()` | 없음 (캐시 안 됨) | — | — |
| `getSlugMap()` | 없음 (`getNotionPosts`에서 파생) | — | — |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | **[시퀀스 다이어그램]** | [컴포넌트 명세](component-spec.md) | [테스트 명세](test-spec.md)
