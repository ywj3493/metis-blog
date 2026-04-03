<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# Commit Message Rule

## TL;DR

```
<type>: <한글 요약>
```

- Summary in **Korean**, no period, under 72 characters
- Issue reference: `(refs #93)` or `(refs issue088)`

## Format

```
<type>: <한글 요약> [(refs #<number>)]
```

## Available Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | 새로운 기능 | `feat: AI 요약 생성 기능 추가` |
| `fix` | 버그 수정 | `fix: 모바일 헤더 반응형 레이아웃 적용` |
| `style` | 코드 스타일/포맷팅 (로직 변경 없음) | `style: 컴포넌트 임포트 정렬` |
| `chore` | 유지보수 작업 | `chore: 의존성 업데이트` |
| `lint` | 린팅 수정 | `lint: Biome CI 에러 수정` |
| `config` | 설정 변경 | `config: CI 빌드에서 목 데이터 사용` |
| `perf` | 성능 개선 | `perf: generateMetadata에서 API 호출 제거` |
| `seo` | SEO 최적화 | `seo: 포스트 영구 리다이렉트 추가` |
| `docs` | 문서만 변경 | `docs: architecture 명세 작성` |
| `test` | 테스트 추가/수정 | `test: Post 모델 유닛 테스트 추가` |

## Rules

1. **Summary is Korean**: Write the summary line in Korean
2. **No period**: Do not end with a period (`.`)
3. **72 characters max**: Keep the full line under 72 characters
4. **Imperative mood (conceptually)**: Describe what the commit does, not what was done
5. **Issue reference**: Add `(refs #<number>)` when linked to a GitHub issue

## Examples

```bash
feat: AI 요약 생성 기능 추가
fix: 모바일 헤더 반응형 레이아웃 적용
chore: AI 스타일 요약으로 업데이트
seo: b2b 포스트 영구 리다이렉트 추가
docs: architecture 명세 작성 (refs #93)
config: CI 빌드에서 Notion API mock 데이터 사용하도록 변경
```
