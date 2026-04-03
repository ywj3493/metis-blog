<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# 커밋 메시지 규칙

## TL;DR

```
<type>: <한글 요약>
```

- 요약은 **한글**, 마침표 없음, 72자 이하
- 이슈 참조: `(refs #93)` 또는 `(refs issue088)`

## 형식

```
<type>: <한글 요약> [(refs #<number>)]
```

## 사용 가능한 타입

| 타입 | 설명 | 예시 |
|------|------|------|
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

## 규칙

1. **요약은 한글**: 요약 줄은 한글로 작성
2. **마침표 없음**: 마침표(`.`)로 끝내지 않음
3. **72자 이하**: 전체 줄을 72자 이하로 유지
4. **명령형**: 커밋이 무엇을 하는지 설명 (완료형 아님)
5. **이슈 참조**: GitHub 이슈와 연결 시 `(refs #<number>)` 추가

## 예시

```bash
feat: AI 요약 생성 기능 추가
fix: 모바일 헤더 반응형 레이아웃 적용
chore: AI 스타일 요약으로 업데이트
seo: b2b 포스트 영구 리다이렉트 추가
docs: architecture 명세 작성 (refs #93)
config: CI 빌드에서 Notion API mock 데이터 사용하도록 변경
```
