<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# 참조 문서 규칙

## 목적

`docs/reference/` 디렉토리는 개발을 지원하는 외부 문서를 저장합니다 — API 레퍼런스, SDK 가이드, 서드파티 서비스 문서.

## 규칙

1. **외부 문서만**: 외부 소스(API, SDK, 서비스)의 문서만 추가
2. **번역 없음**: 참조 문서는 `docs/ko/`에 미러하지 않음
3. **출처 표기**: 항상 소스 URL과 조회 날짜 포함
4. **네이밍**: `<service-name>.md` (`kebab-case`) (예: `notion-api.md`, `openai-sdk.md`)

## 문서 형식

```markdown
# <서비스명> 참조

**출처**: <URL>
**조회일**: <YYYY-MM-DD>

## <섹션>
...
```

## 상호 참조

명세 및 기타 문서에서 참조할 때 `@` 접두어를 사용:

```markdown
@reference: [notion-api](../../reference/notion-api.md)
```

문서 상단 메타 블록에서:

```markdown
<!-- @reference: [architecture](../specifications/architecture.md) | [config](../specifications/config.md) -->
```

## 참조 문서 추가 시점

- 새로운 외부 연동 설정 시
- 의존하는 API 엔드포인트 문서화 시
- 코드만으로는 명확하지 않은 SDK 사용 패턴 기록 시
