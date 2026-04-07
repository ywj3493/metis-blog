<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [api-spec](api-spec.md) -->

> [← Use Cases](use-cases.md) | [API Spec →](api-spec.md)

# Summary Domain — Sequence Diagrams

## Flow 1: Generate and Store Summary (UC-SUMMARY-01)

```mermaid
sequenceDiagram
  participant Owner as Blog Owner
  participant Button as SummaryButton (client)
  participant Update as updatePostSummary
  participant API as PATCH /api/posts/[postId]/summary
  participant PostAPI as entities/post/api
  participant Notion as Notion API
  participant Summary as features/summary/api/get-summary
  participant LLM as OpenAI/Ollama
  participant Cache as next/cache

  Owner->>Button: click "Generate Summary"
  Button->>Update: updatePostSummary(postId)
  Update->>API: PATCH /api/posts/{postId}/summary

  API->>PostAPI: getNotionPostContentForSummary(postId)
  PostAPI->>Notion: pages.retrieve(postId)
  Notion-->>PostAPI: page properties
  PostAPI->>Notion: blocks.children.list(postId)
  Notion-->>PostAPI: paragraph blocks
  PostAPI-->>API: { title, content, isSummarized }

  alt isSummarized
    API-->>Update: 500 "이미 요약이 생성된 포스트입니다."
  else not summarized
    API->>Summary: getSummary(title, content)
    Summary->>Summary: safeSlice(content, 8000)
    Summary->>LLM: chat.completions.create(SYSTEM_PROMPT, prompt)
    LLM-->>Summary: completion
    Summary-->>API: summary text

    API->>PostAPI: patchNotionPostSummary(postId, summary)
    PostAPI->>Notion: pages.update(properties.summary)
    Notion-->>PostAPI: updated page
    PostAPI-->>API: response

    API->>Cache: revalidateTag("posts")
    API->>Cache: revalidatePath("/posts")
    API->>Cache: revalidatePath("/")

    API-->>Update: 200 { success, summary, message }
  end

  Update-->>Button: result
  Button->>Owner: show new summary
```

## Flow 2: LLM Selection (UC-SUMMARY-02)

```mermaid
sequenceDiagram
  participant Caller as features/summary
  participant Client as getOpenAIClient
  participant Env as process.env
  participant OpenAI as OpenAI SDK

  Caller->>Client: getOpenAIClient()
  alt _client cached
    Client-->>Caller: cached instance
  else first call
    Client->>Env: read NODE_ENV
    alt NODE_ENV=development
      Client->>OpenAI: new OpenAI({ apiKey: "ollama", baseURL: LOCAL_AI_ENDPOINT/v1 })
    else NODE_ENV=production
      Client->>OpenAI: new OpenAI({ apiKey: OPENAI_API_KEY })
    end
    OpenAI-->>Client: instance
    Client->>Client: cache _client
    Client-->>Caller: instance
  end
```

## Flow 3: Display Summary in UI (UC-SUMMARY-03)

```mermaid
sequenceDiagram
  participant Reader
  participant Page as PostCard
  participant Card as SummaryCard
  participant Button as SummaryButton

  Reader->>Page: view post card
  Page->>Page: check post.aiSummarized
  alt aiSummarized = true
    Page->>Card: render(post.aiSummary)
    Card-->>Reader: display summary text
  else aiSummarized = false
    Page->>Button: render(post.id)
    Button-->>Reader: display generate button
  end
```

## Error Handling

```mermaid
sequenceDiagram
  participant API as PATCH /api/posts/[postId]/summary
  participant PostAPI as entities/post/api
  participant Notion as Notion API
  participant Summary as features/summary/api

  API->>PostAPI: getNotionPostContentForSummary(postId)
  alt Notion error
    Notion-->>PostAPI: NotionClientError
    PostAPI->>PostAPI: throw NotionApiError(cause)
    PostAPI-->>API: NotionApiError
    API->>API: classify by APIErrorCode
    alt ObjectNotFound
      API-->>API: 404
    else Unauthorized
      API-->>API: 403
    else RateLimited
      API-->>API: 429
    else Other
      API-->>API: 502
    end
  end

  API->>Summary: getSummary(title, content)
  alt LLM error
    Summary->>Summary: throw SummaryServiceError
    Summary-->>API: SummaryServiceError
    API-->>API: 502
  end
```

## Performance Notes

| Aspect | Strategy |
|--------|---------|
| Content size | `safeSlice(plainText, 8000)` truncates word-tokens |
| LLM determinism | `temperature: 0.2` for stable output |
| Output length | `max_tokens: 50` for concise summaries |
| Cache invalidation | After Notion update, refresh ISR caches immediately |

> **All Documents**
> [Requirements](../requirements/requirements.md) | [User Stories](../requirements/user-stories.md) | [Use Cases](use-cases.md) | **[Sequence Diagram]** | [API Spec](api-spec.md) | [Test Spec](test-spec.md)
