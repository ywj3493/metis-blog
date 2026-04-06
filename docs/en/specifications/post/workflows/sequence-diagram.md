<!-- Created: 2026-04-06 | Last Modified: 2026-04-06 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [component-spec](component-spec.md) -->

> [← Use Cases](use-cases.md) | [Component Spec →](component-spec.md)

# Post Domain — Sequence Diagrams

## Architecture Layers

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

## Flow 1: Post List Loading (UC-POST-01)

```mermaid
sequenceDiagram
  participant Reader
  participant PostsPage as posts/page.tsx
  participant PostAPI as entities/post/api
  participant Cache as nextServerCache
  participant Notion as Notion API

  Reader->>PostsPage: GET /posts
  PostsPage->>PostAPI: getNotionPosts()
  PostAPI->>Cache: check cache ["posts"]
  alt Cache Hit
    Cache-->>PostAPI: cached results
  else Cache Miss
    Cache->>Notion: databases.query(status=공개, sort=날짜 desc)
    Notion-->>Cache: DatabaseObjectResponse[]
    Cache-->>PostAPI: results (cached for ISR_REVALIDATE_TIME)
  end
  PostAPI-->>PostsPage: DatabaseObjectResponse[]

  PostsPage->>PostAPI: getNotionPostDatabaseTags()
  PostAPI->>Cache: check cache ["tags"]
  Cache-->>PostAPI: TagDatabaseResponse[]
  PostAPI-->>PostsPage: TagDatabaseResponse[]

  PostsPage->>PostsPage: render FilterablePosts(dataList, tagDataList)
  PostsPage-->>Reader: HTML with post grid + tag sidebar
```

## Flow 2: Post Detail Rendering (UC-POST-02)

```mermaid
sequenceDiagram
  participant Reader
  participant DetailPage as posts/[slug]/page.tsx
  participant SlugMap as getSlugMap()
  participant PostAPI as entities/post/api
  participant NotionX as notion-client (unofficial)
  participant Renderer as ClientNotionRenderer

  Reader->>DetailPage: GET /posts/{slug}
  DetailPage->>SlugMap: getSlugMap()
  SlugMap->>PostAPI: getNotionPosts()
  PostAPI-->>SlugMap: posts[]
  SlugMap-->>DetailPage: {slug: pageId} map

  DetailPage->>DetailPage: resolve pageId from slug
  alt Valid slug
    DetailPage->>PostAPI: getNotionPage(pageId)
    PostAPI->>NotionX: notionApi.getPage(pageId)
    NotionX-->>PostAPI: ExtendedRecordMap
    PostAPI-->>DetailPage: recordMap
    DetailPage->>Renderer: render(recordMap)
    Renderer-->>Reader: rich Notion content (dark/light aware)
  else Invalid slug
    DetailPage-->>Reader: 404 Not Found
  end
```

## Flow 3: Tag Filtering (UC-POST-03)

```mermaid
sequenceDiagram
  participant Reader
  participant FilterablePosts as FilterablePosts (client)
  participant TagFilter as TagFilter (client)
  participant PostsGrid as PostsGrid

  Note over FilterablePosts: All posts and tags loaded server-side

  Reader->>TagFilter: click tag chip "React"
  TagFilter->>FilterablePosts: setSelectedTags(add "React")
  FilterablePosts->>FilterablePosts: filter posts (OR: any selected tag)
  FilterablePosts->>PostsGrid: render(filteredPosts)
  PostsGrid-->>Reader: updated grid

  Reader->>TagFilter: click tag chip "TypeScript"
  TagFilter->>FilterablePosts: setSelectedTags(add "TypeScript")
  FilterablePosts->>FilterablePosts: filter posts (React OR TypeScript)
  FilterablePosts->>PostsGrid: render(filteredPosts)
  PostsGrid-->>Reader: updated grid

  Reader->>TagFilter: click tag chip "React" again (deselect)
  TagFilter->>FilterablePosts: setSelectedTags(remove "React")
  FilterablePosts->>FilterablePosts: filter posts (TypeScript only)
  FilterablePosts->>PostsGrid: render(filteredPosts)
  PostsGrid-->>Reader: updated grid
```

## Flow 4: Related Post Navigation (UC-POST-04)

```mermaid
sequenceDiagram
  participant DetailPage as posts/[slug]/page.tsx
  participant Navigator as PostNavigator (server)
  participant PostAPI as entities/post/api
  participant Reader

  DetailPage->>Navigator: render(currentPostId)
  Navigator->>PostAPI: getNotionPosts()
  PostAPI-->>Navigator: allPosts[]
  Navigator->>Navigator: find current post
  Navigator->>Navigator: filter posts sharing tags
  Navigator->>Navigator: sort by date proximity, take 4
  Navigator-->>DetailPage: SmallPostCard[] grid
  DetailPage-->>Reader: post content + related posts

  Reader->>Reader: click related post
  Reader->>DetailPage: GET /posts/{related-slug}
```

## Error Handling Flows

```mermaid
sequenceDiagram
  participant Page as App Router Page
  participant PostAPI as entities/post/api
  participant Notion as Notion API

  Page->>PostAPI: getNotionPosts()
  PostAPI->>Notion: databases.query()
  Notion-->>PostAPI: Error (network/auth)
  PostAPI->>PostAPI: throw NotionApiError
  PostAPI-->>Page: NotionApiError
  Page-->>Page: Error boundary renders error.tsx
```

## Performance: Caching Strategy

| Function | Cache Key | Revalidation | Tags |
|----------|-----------|-------------|------|
| `getNotionPosts()` | `["posts"]` | `ISR_REVALIDATE_TIME` | — |
| `getNotionPostDatabaseTags()` | `["tags"]` | `ISR_REVALIDATE_TIME` | — |
| `getNotionPage()` | None (not cached) | — | — |
| `getSlugMap()` | None (derived from `getNotionPosts`) | — | — |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | **[Sequence Diagram]** | [Component Spec](component-spec.md) | [Test Spec](test-spec.md)
