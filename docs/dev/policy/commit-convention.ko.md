# 커밋 메시지 규칙

## TL;DR (빠른 참조)

**형식**: `<타입>: <현재시제 요약>`

**주요 타입**: `feat`, `fix`, `style`, `chore`, `docs`, `test`, `seo`, `perf`

**규칙**:
- 현재시제 사용 (add/fix, added/fixed 아님)
- 소문자, 72자 이하, 마침표 없음
- 설명에 이슈 참조: `(refs issue087)`

**예시**:
```bash
feat: add AI summary generation
fix: apply mobile header responsive layout
chore: update to more AI-style summary
```

---

## 형식

모든 커밋 메시지는 Conventional Commit에서 영감을 받은 형식을 따릅니다:

```text
<타입>: <현재시제 요약>
```

**규칙**:
- 타입은 소문자 사용
- 콜론 뒤 공백 하나
- 요약은 현재시제 사용 (예: "add" 사용, "added" 사용 안 함, "fix" 사용, "fixed" 사용 안 함)
- 요약은 "이 커밋은 ...할 것이다"라는 문장을 완성해야 함
- 가독성을 위해 요약은 72자 이하로 유지
- 요약 끝에 마침표 없음

## 커밋 타입

### `feat`: 새로운 기능

사용자가 사용하는 새로운 기능이나 역량을 추가합니다.

**예시**:
```text
feat: add AI summary generation for blog posts
feat: implement tag filtering on posts page
feat: create guestbook submission form
```

**사용 시기**:
- 사용자가 상호작용하는 새로운 UI 컴포넌트
- 새로운 API 엔드포인트
- 새로운 페이지나 라우트
- 릴리스 노트에 포함될 기능

### `fix`: 버그 수정

잘못된 동작을 수정하거나 이슈를 해결합니다.

**예시**:
```text
fix: apply mobile header responsive styling
fix: resolve cache invalidation after summary update
fix: correct Notion property name for Korean tags
```

**사용 시기**:
- 잘못된 기능 수정
- 런타임 에러 해결
- 시각적 버그 수정
- 보안 취약점 패치

### `style`: 시각/UI 변경

기능 변경 없이 외관만 수정합니다.

**예시**:
```text
style: update post card hover effect
style: adjust spacing in guestbook form
style: improve dark mode contrast ratios
```

**사용 시기**:
- CSS/스타일링 조정
- 레이아웃 개선
- 테마 개선
- 시각적 개선 (그림자, 테두리, 색상)

**사용하지 않는 경우**: 코드 포매팅 (대신 `chore` 사용)

### `chore`: 유지보수 작업

사용자가 보는 동작에 영향을 주지 않는 내부 작업입니다.

**예시**:
```text
chore: update dependencies to latest versions
chore: clean up unused imports
chore: format code with Biome
chore: reorganize component file structure
```

**사용 시기**:
- 의존성 업데이트
- 코드 포매팅/정리
- 파일 재구성
- 사용하지 않는 코드 제거
- 동작 변경 없는 리팩토링

### `lint`: 린팅 수정

린터 에러나 경고를 해결합니다.

**예시**:
```text
lint: fix ESLint warnings in post components
lint: resolve TypeScript strict mode errors
lint: apply Biome formatting rules
```

**사용 시기**:
- 린터 에러 수정
- 타입 에러 해결
- 린팅 도구의 자동 수정 적용

**참고**: 더 큰 정리 작업의 일부인 경우 종종 `chore`와 결합됩니다

### `config`: 설정 변경

프로젝트 설정 파일을 수정합니다.

**예시**:
```text
config: add environment variable for local LLM
config: update Tailwind safelist for dynamic colors
config: enable SWC minification in Next.js
```

**사용 시기**:
- `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json` 변경
- `.env` 템플릿 업데이트
- 빌드 도구 설정 수정
- 린터/포매터 설정 조정

### `perf`: 성능 개선

기능 변경 없이 코드나 리소스 사용을 최적화합니다.

**예시**:
```text
perf: implement ISR caching for post queries
perf: optimize image loading with Next.js Image
perf: reduce bundle size by lazy loading components
```

**사용 시기**:
- 캐싱 개선
- 데이터베이스 쿼리 최적화
- 번들 크기 감소
- 렌더링 성능 향상

### `seo`: SEO 개선

검색 엔진 최적화를 향상시킵니다.

**예시**:
```text
seo: add Open Graph meta tags to post pages
seo: generate dynamic sitemap from Notion posts
seo: implement structured data for blog posts
seo: permanent redirect for renamed post URL
```

**사용 시기**:
- 메타 태그 추가/업데이트
- 사이트맵 변경
- 구조화된 데이터 (JSON-LD)
- URL 리다이렉트
- robots.txt 수정

### `docs`: 문서 업데이트

문서 파일만 변경합니다.

**예시**:
```text
docs: add architecture specification document
docs: update README with environment variables
docs: align issue numbering baseline to 085
docs: create testing policy document
```

**사용 시기**:
- 마크다운 문서 추가/업데이트
- README 변경
- 코드 주석 (중요한 경우)
- 문서 수정

**사용하지 않는 경우**: 코드 변경 (관련 주석을 업데이트하는 경우에도)

### `test`: 테스트 변경

테스트를 추가하거나 수정합니다.

**예시**:
```text
test: add unit tests for Post model creation
test: implement MSW handlers for Notion API
test: add regression test for cache invalidation
```

**사용 시기**:
- 새로운 테스트 파일
- 기존 테스트 업데이트
- 테스트 설정 변경
- Mock/Fixture 업데이트

## 멀티 스코프 커밋

커밋이 여러 영역을 건드리는 경우, **주요** 타입을 선택하세요:

**예시**: 테스트와 문서가 포함된 기능 추가
```text
feat: add AI summary generation
```
사용 안 함: ~~`feat+test+docs: add AI summary generation`~~

**지침**: 커밋의 **주요 목적**을 가장 잘 설명하는 타입을 선택하세요.

## 이슈 참조

이슈 문서 작업 시, 커밋 메시지에서 참조하세요:

**형식**:
```text
<타입>: <요약> (refs issue0XX)
```

**예시**:
```text
feat: add AI summary cache (refs issue085)
fix: resolve mobile header layout (refs issue086)
docs: update architecture specification (refs issue087)
```

**참고**: GitHub 이슈 번호와 이슈 문서를 명확하게 구분하기 위해 `#XX`가 아닌 `(refs issue0XX)`를 사용하세요.

## 중대한 변경사항

중대한 변경사항의 경우(이 프로젝트에서는 드물지만), 타입 뒤에 `!`를 추가하세요:

```text
feat!: migrate to new Notion API version
config!: change environment variable naming scheme
```

커밋 본문에 설명을 추가하세요 (아래 다중 라인 메시지 참조).

## 다중 라인 커밋 메시지

복잡한 커밋의 경우, 본문과 푸터를 사용하세요:

```text
<타입>: <요약>

<본문: 상세 설명>

<푸터: 참조, 중대한 변경사항>
```

**예시**:
```text
feat: add AI summary generation

Implement on-demand AI summary generation for blog posts using
OpenAI in production and local LLM in development. Summaries are
stored in Notion "요약" property for persistence.

refs issue085
```

**사용 시기**:
- 설명이 필요한 복잡한 기능
- 중대한 변경사항 (마이그레이션 경로 설명)
- 명확하지 않은 구현 결정

## 커밋하지 말아야 할 것

다음 패턴을 피하세요:

**나쁨: 모호한 요약**
```text
fix: fix bug
chore: update stuff
feat: improvements
```

**좋음: 구체적인 요약**
```text
fix: resolve cache invalidation after AI summary update
chore: update dependencies to patch security vulnerabilities
feat: add tag filtering to posts page
```

**나쁨: 과거시제**
```text
feat: added AI summary button
fix: fixed mobile header
```

**좋음: 현재시제**
```text
feat: add AI summary button
fix: resolve mobile header layout issue
```

**나쁨: 관련 없는 여러 변경사항**
```text
feat: add guestbook and fix header and update deps
```

**좋음: 별도 커밋**
```text
feat: add interactive guestbook form
fix: resolve mobile header responsive layout
chore: update dependencies to latest versions
```

## 커밋 원자성

### 커밋당 하나의 논리적 변경

각 커밋은 하나의 논리적 변경을 나타내야 합니다:

**좋은 예시** (원자적 커밋):
1. `feat: add guestbook form component`
2. `feat: implement guestbook API route`
3. `feat: create guestbook display page`
4. `test: add guestbook submission tests`

**나쁜 예시** (비원자적):
1. `feat: add entire guestbook feature with tests and styling`

### 자주 커밋

크고 단일한 커밋보다 작고 집중된 커밋을 선호하세요:

- 리뷰하기 쉬움
- 필요시 되돌리기 간단함
- 더 명확한 히스토리
- 디버깅을 위한 더 나은 git bisect

## 커밋 히스토리 검토

푸시하기 전에 `git log`를 사용하여 커밋 메시지 품질을 확인하세요:

```bash
git log --oneline
```

**예상 형식**:
```text
f1e7a2a docs: align issue numbering baseline
1e77a36 chore: fix post card style
a1f3ccb chore: update to more AI-style summary
2a24861 seo: permanent redirect for b2b post
2e5fb71 fix: apply mobile header
```

## 커밋 수정

가장 최근 커밋에서 실수한 경우(아직 푸시하지 않은 경우):

```bash
# 코드에서 실수 수정
git add .
git commit --amend --no-edit  # 동일한 메시지 유지
```

또는 메시지 업데이트:

```bash
git commit --amend  # 메시지를 수정하기 위해 에디터 열기
```

**경고**: 공유 브랜치에 푸시된 커밋은 절대 수정하지 마세요.

## 프로젝트 히스토리의 예시

이 프로젝트의 git 히스토리에서 가져온 실제 예시:

```text
f1e7a2a docs: align issue numbering baseline
1e77a36 chore: fix post card style
a1f3ccb chore: update to more AI-style summary
2a24861 seo: permanent redirect for b2b post
2e5fb71 fix: apply mobile header
```

일관성을 위해 이 확립된 패턴을 따르세요.

## 도구와 자동화

### Git Hooks (향후)

형식을 검증하기 위해 commit-msg hook 추가를 고려하세요:
- 타입이 유효한지 확인
- 문자 제한 강제
- 현재시제 확인

### Commitlint (선택사항)

더 엄격한 강제를 위해 `@commitlint/config-conventional`을 추가하세요:

```bash
pnpm add -D @commitlint/cli @commitlint/config-conventional
```

이 규칙과 일치하도록 `.commitlintrc.json`에서 설정하세요.

## 요약

**빠른 참조**:
- 형식: `<타입>: <현재시제 요약>`
- 타입: `feat`, `fix`, `style`, `chore`, `lint`, `config`, `perf`, `seo`, `docs`, `test`
- 현재시제, 소문자 타입, 간결한 요약
- 이슈 참조: `(refs issue0XX)`
- 커밋을 원자적이고 집중되게 유지

좋은 커밋 메시지는 협업을 쉽게 만들고 히스토리를 더 가치있게 만듭니다.

---

> 마지막 번역: 2025-11-25 | 원본: commit-convention.md
