<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->
<!-- @reference: [use-cases](use-cases.md) | [api-spec](api-spec.md) -->

> [← 유스케이스](use-cases.md) | [API 명세 →](api-spec.md)

# Summary 도메인 — 시퀀스 다이어그램

## 흐름 1: 요약 생성 및 저장 (UC-SUMMARY-01)

```mermaid
sequenceDiagram
  participant Owner as 블로그 소유자
  participant Button as SummaryButton (클라이언트)
  participant Update as updatePostSummary
  participant API as PATCH /api/posts/[postId]/summary
  participant PostAPI as entities/post/api
  participant Notion as Notion API
  participant Summary as features/summary/api/get-summary
  participant LLM as OpenAI/Ollama
  participant Cache as next/cache

  Owner->>Button: "요약 생성" 클릭
  Button->>Update: updatePostSummary(postId)
  Update->>API: PATCH /api/posts/{postId}/summary

  API->>PostAPI: getNotionPostContentForSummary(postId)
  PostAPI->>Notion: pages.retrieve(postId)
  Notion-->>PostAPI: 페이지 속성
  PostAPI->>Notion: blocks.children.list(postId)
  Notion-->>PostAPI: 단락 블록
  PostAPI-->>API: { title, content, isSummarized }

  alt 이미 요약됨
    API-->>Update: 500 "이미 요약이 생성된 포스트입니다."
  else 요약 없음
    API->>Summary: getSummary(title, content)
    Summary->>Summary: safeSlice(content, 8000)
    Summary->>LLM: chat.completions.create(SYSTEM_PROMPT, prompt)
    LLM-->>Summary: completion
    Summary-->>API: 요약 텍스트

    API->>PostAPI: patchNotionPostSummary(postId, summary)
    PostAPI->>Notion: pages.update(properties.summary)
    Notion-->>PostAPI: 업데이트된 페이지
    PostAPI-->>API: 응답

    API->>Cache: revalidateTag("posts")
    API->>Cache: revalidatePath("/posts")
    API->>Cache: revalidatePath("/")

    API-->>Update: 200 { success, summary, message }
  end

  Update-->>Button: 결과
  Button->>Owner: 새 요약 표시
```

## 흐름 2: LLM 선택 (UC-SUMMARY-02)

```mermaid
sequenceDiagram
  participant Caller as features/summary
  participant Client as getOpenAIClient
  participant Env as process.env
  participant OpenAI as OpenAI SDK

  Caller->>Client: getOpenAIClient()
  alt _client 캐시됨
    Client-->>Caller: 캐시된 인스턴스
  else 첫 호출
    Client->>Env: NODE_ENV 읽기
    alt NODE_ENV=development
      Client->>OpenAI: new OpenAI({ apiKey: "ollama", baseURL: LOCAL_AI_ENDPOINT/v1 })
    else NODE_ENV=production
      Client->>OpenAI: new OpenAI({ apiKey: OPENAI_API_KEY })
    end
    OpenAI-->>Client: 인스턴스
    Client->>Client: _client 캐시
    Client-->>Caller: 인스턴스
  end
```

## 흐름 3: UI에 요약 표시 (UC-SUMMARY-03)

```mermaid
sequenceDiagram
  participant Reader as 독자
  participant Page as PostCard
  participant Card as SummaryCard
  participant Button as SummaryButton

  Reader->>Page: 포스트 카드 보기
  Page->>Page: post.aiSummarized 확인
  alt aiSummarized = true
    Page->>Card: render(post.aiSummary)
    Card-->>Reader: 요약 텍스트 표시
  else aiSummarized = false
    Page->>Button: render(post.id)
    Button-->>Reader: 생성 버튼 표시
  end
```

## 에러 처리

```mermaid
sequenceDiagram
  participant API as PATCH /api/posts/[postId]/summary
  participant PostAPI as entities/post/api
  participant Notion as Notion API
  participant Summary as features/summary/api

  API->>PostAPI: getNotionPostContentForSummary(postId)
  alt Notion 에러
    Notion-->>PostAPI: NotionClientError
    PostAPI->>PostAPI: NotionApiError(cause) throw
    PostAPI-->>API: NotionApiError
    API->>API: APIErrorCode로 분류
    alt ObjectNotFound
      API-->>API: 404
    else Unauthorized
      API-->>API: 403
    else RateLimited
      API-->>API: 429
    else 기타
      API-->>API: 502
    end
  end

  API->>Summary: getSummary(title, content)
  alt LLM 에러
    Summary->>Summary: SummaryServiceError throw
    Summary-->>API: SummaryServiceError
    API-->>API: 502
  end
```

## 성능 노트

| 측면 | 전략 |
|------|------|
| 콘텐츠 크기 | `safeSlice(plainText, 8000)`로 단어 토큰 트런케이션 |
| LLM 결정성 | 안정적 출력을 위한 `temperature: 0.2` |
| 출력 길이 | 간결한 요약을 위한 `max_tokens: 50` |
| 캐시 무효화 | Notion 업데이트 후 ISR 캐시 즉시 새로고침 |

> **전체 문서**
> [요구사항](../requirements/requirements.md) | [유저 스토리](../requirements/user-stories.md) | [유스케이스](use-cases.md) | **[시퀀스 다이어그램]** | [API 명세](api-spec.md) | [테스트 명세](test-spec.md)
