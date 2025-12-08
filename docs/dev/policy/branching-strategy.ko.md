# 브랜치 전략

## TL;DR (빠른 참조)

**패턴**: `<타입>/<이슈번호>[-설명]`

**예시**:

```bash
feat/087-add-search
fix/088-cache-invalidation
chore/86
```

**규칙**:

- 커밋 타입 사용: feat, fix, chore, docs 등
- 앞자리 0 포함 (085, 85 아님)
- 설명은 선택사항이지만 권장
- 항상 docs/issue/에 이슈 문서를 먼저 생성

**워크플로우**:

1. docs/issue/issueXXX.md 생성
2. 브랜치 생성: `git checkout -b <타입>/<이슈번호>[-설명]`
3. [commit-convention.md](commit-convention.ko.md)를 따라 작업 및 커밋
4. 푸시하고 이슈 문서를 참조하는 PR 생성

---

## 브랜치 네이밍 규칙

모든 기능 및 수정 브랜치는 다음 패턴을 따릅니다:

```text
<타입>/<이슈번호>[-설명]
```

### 구성요소

- **타입**: 커밋 메시지와 동일한 타입 (`feat`, `fix`, `chore` 등)
- **이슈번호**: 이슈 문서 번호 (예: `085`, `086`, `087`)
- **설명**: 선택적 짧은 kebab-case 설명

### 예시

```text
feat/087-add-search
fix/088-cache-invalidation
chore/86
docs/089-update-architecture
perf/090-optimize-images
```

### 규칙

- 타입은 소문자 사용
- 이슈 번호가 100 미만이면 앞자리 0 포함 (예: `085`, `85` 아님)
- 설명은 선택사항이지만 명확성을 위해 권장
- 설명에는 kebab-case 사용 (단어 사이에 하이픈)
- 설명은 짧게 유지 (최대 2-4단어)

## 브랜치 타입

### 기능 브랜치

**패턴**: `feat/<이슈번호>[-설명]`

**목적**: 새로운 사용자 대면 기능 개발

**예시**:
```text
feat/091-guestbook-pagination
feat/092-search-functionality
feat/093-rss-feed
```

**워크플로우**:
1. `main` 브랜치에서 생성
2. 기능을 점진적으로 개발
3. 해당하는 `docs/issue/issue0XX.md` 참조
4. 리뷰 준비가 되면 PR 생성

### 수정 브랜치

**패턴**: `fix/<이슈번호>[-설명]`

**목적**: 버그 및 이슈 해결

**예시**:
```text
fix/094-mobile-header
fix/095-notion-api-error
fix/096-dark-mode-flash
```

**워크플로우**:
1. 이슈 문서에 버그 기록
2. `main`에서 브랜치 생성
3. 수정 및 회귀 테스트 추가
4. 수정 검증과 함께 PR 생성

### 유지보수 브랜치

**패턴**: `chore/<이슈번호>[-설명]`

**목적**: 유지보수 작업, 의존성 업데이트, 리팩토링

**예시**:
```text
chore/86
chore/097-update-deps
chore/098-refactor-cache
```

**워크플로우**:
1. 사용자 대면하지 않는 변경을 위해 생성
2. 이슈 문서가 필요할 수도, 아닐 수도 있음 (판단 필요)
3. 변경 후 모든 테스트가 통과하는지 확인

### 문서 브랜치

**패턴**: `docs/<이슈번호>[-설명]`

**목적**: 문서 전용 변경

**예시**:
```text
docs/089-update-architecture
docs/099-add-api-reference
```

**워크플로우**:
1. 상당한 문서 업데이트 시 생성
2. 사소한 오타 수정은 건너뛸 수 있음 (`main`에 직접 커밋하거나 fix/ 사용)

## 메인 브랜치

### `main` 브랜치

**목적**: 프로덕션 준비 코드

**보호 규칙**:
- 변경을 위해서는 Pull Request 필요 (직접 커밋 불가)
- CI 검사 통과 필수 (Biome 포매팅)
- 프로덕션에 자동 배포 (Vercel)

**배포**:
- `main`으로의 모든 병합은 프로덕션 배포를 트리거
- Vercel이 자동으로 빌드 및 배포
- 에러가 있는지 배포 모니터링

## Pull Request 워크플로우

### Pull Request 생성

1. **브랜치가 최신인지 확인**:
   ```bash
   git checkout main
   git pull
   git checkout <your-branch>
   git rebase main  # 또는 main을 브랜치에 병합
   ```

2. **브랜치를 원격에 푸시**:
   ```bash
   git push -u origin <your-branch>
   ```

3. **GitHub에서 PR 생성**:
   - Base: `main`
   - Compare: `<your-branch>`
   - Title: 변경사항의 간단한 설명
   - Description: 이슈 문서 링크, 변경사항 요약

### PR 제목 형식

커밋 메시지와 동일한 형식 사용:

```text
<타입>: <요약>
```

**예시**:
```text
feat: add guestbook pagination
fix: resolve mobile header layout issue
docs: update architecture specification
```

### PR 설명 템플릿

```markdown
## Issue Reference

refs [docs/issue/issue0XX.md](../docs/issue/issue0XX.md)

## Summary

이 PR이 하는 일에 대한 간단한 설명.

## Changes

- 주요 변경사항 목록
- 파일/컴포넌트 변경사항 포함
- 중대한 변경사항이 있다면 기록

## Validation

이렇게 테스트되었습니다:
- [ ] 유닛 테스트 통과 (`pnpm test`)
- [ ] 수동 테스트 완료
- [ ] 빌드 성공 (`pnpm build`)
- [ ] Lint 및 format 검사 통과

## Screenshots (UI 변경인 경우)

Before/after 스크린샷 또는 비디오

## Notes

추가 컨텍스트, 위험사항 또는 후속 작업
```

### PR 크기 가이드라인

**작은 PR 선호**:
- 리뷰하기 쉬움
- 병합이 빠름
- 충돌 위험 낮음
- 명확한 목적

**목표**: PR당 약 200-400줄 변경

**PR이 큰 경우**:
- 가능하면 여러 PR로 분할
- 크기가 필요한 이유를 명확하게 설명
- 상세한 설명 및 검증 제공

### 이슈 문서에 링크하기

항상 해당하는 이슈 문서를 참조하세요:

**PR 설명에서**:
```markdown
refs [docs/issue/issue087.md](../docs/issue/issue087.md)
```

**커밋에서**:
```text
feat: add search functionality (refs issue087)
```

## 브랜치 생명주기

### 1. 브랜치 생성

```bash
# main 브랜치에서
git checkout main
git pull
git checkout -b feat/087-add-search
```

### 2. 개발

```bash
# 변경사항 만들기
git add .
git commit -m "feat: implement search index generation"

# 계속 작업
git add .
git commit -m "feat: add search UI component"
```

### 3. 최신 상태 유지

충돌을 피하기 위해 정기적으로 `main`과 동기화:

```bash
git fetch origin
git rebase origin/main  # 또는 origin/main 병합
```

### 4. 푸시 및 PR 생성

```bash
git push -u origin feat/087-add-search
# GitHub에서 PR 생성
```

### 5. 리뷰 피드백 처리

```bash
# 요청된 변경사항 반영
git add .
git commit -m "fix: address PR feedback on search validation"
git push
```

### 6. 병합

승인되면:
- GitHub를 통해 병합 (squash and merge 선호)
- 병합 후 브랜치 삭제 (GitHub 설정을 통해 자동)

### 7. 정리

```bash
git checkout main
git pull
git branch -d feat/087-add-search  # 로컬 브랜치 삭제
```

## 브랜치 보호

### 필수 상태 검사

`main`으로 병합하기 전:
- [ ] Biome CI 검사 통과 (GitHub Actions)
- [ ] 모든 커밋이 커밋 규칙을 따름
- [ ] PR 설명에 이슈 참조 포함

### GitHub Actions

현재 워크플로우:

**`pull_request.yml`**:
- 트리거: `main`으로의 PR
- 단계: 의존성 설치, Biome 포매팅 검사 실행
- 목적: 코드 품질 보장

**`cleanup.yml`**:
- 트리거: PR 병합 또는 닫힘
- 단계: 연관된 Vercel 프리뷰 배포 삭제
- 목적: 리소스 정리

## 긴급 수정 워크플로우

긴급 프로덕션 수정의 경우:

### 옵션 1: 빠른 추적 PR

1. `fix/XXX-hotfix-description` 브랜치 생성
2. 최소한의 수정 구현
3. "HOTFIX" 레이블로 PR 생성
4. 빠른 추적 리뷰 및 병합
5. 이후에 이슈 문서에 기록

### 옵션 2: 직접 수정 (긴급 상황만)

심각한 프로덕션 이슈의 경우:

1. `main`에서 직접 수정 (정당화와 함께)
2. 이슈 문서에 즉시 수정 내용 기록
3. 일반 워크플로우에서의 이탈 기록
4. 테스트가 포함된 후속 PR 생성

**드물게 사용**: 진정으로 심각한 이슈(사이트 다운, 보안 취약점)에만 사용

## 오래된 브랜치

### 브랜치 정리

다음 경우에 브랜치 삭제:
- PR 병합됨
- 병합 없이 PR 닫힘
- 30일간 활동 없음

### 자동 정리

GitHub 설정:
- PR 병합 후 "Automatically delete head branches" 활성화
- GitHub Action을 통해 Vercel 프리뷰 배포 정리

### 수동 정리

```bash
# 병합된 브랜치 나열
git branch --merged main

# 로컬 병합 브랜치 삭제
git branch -d <branch-name>

# 원격 브랜치 삭제
git push origin --delete <branch-name>
```

## 병합 전략

### Squash and Merge (권장)

**사용 시기**: 대부분의 기능 PR

**장점**:
- 깔끔하고 선형적인 히스토리
- PR당 단일 커밋
- 되돌리기 쉬움

**방법**:
- GitHub "Squash and merge" 버튼 사용
- 필요시 커밋 메시지 편집

### Rebase and Merge

**사용 시기**: 보존되어야 하는 여러 논리적 커밋

**장점**:
- 개별 커밋 히스토리 유지
- 병합 커밋 없는 선형 히스토리

**방법**:
- GitHub "Rebase and merge" 버튼 사용
- 커밋이 깔끔하고 잘 포맷되어 있는지 확인

### Merge Commit

**사용 시기**: 드물게 (복잡한 다중 브랜치 병합에만)

**단점**: 히스토리를 어지럽히는 병합 커밋 생성

## 협업

### 다른 사람과 작업하기

여러 사람이 같은 기능을 작업하는 경우:

1. **공유 브랜치 생성**: `feat/087-add-search`
2. **커밋 조율**: 푸시하기 전에 소통
3. **자주 풀하기**: 팀과 동기화 유지
4. **필요시 서브 브랜치 사용**: `feat/087-search-ui`, `feat/087-search-backend`

### 충돌 처리

병합 충돌이 발생하는 경우:

```bash
git fetch origin
git rebase origin/main

# 에디터에서 충돌 해결
git add <resolved-files>
git rebase --continue

git push --force-with-lease
```

**참고**: 안전을 위해 `--force` 대신 `--force-with-lease` 사용

## 브랜치 네이밍 안티패턴

### 이렇게 하지 마세요

```text
❌ feature/new-stuff
❌ fix-bug
❌ my-branch
❌ test
❌ temp
❌ wip
❌ feat/add-search-no-issue
```

### 대신 이렇게 하세요

```text
✅ feat/087-add-search
✅ fix/088-mobile-header
✅ chore/089-update-deps
✅ docs/090-architecture
```

## 요약

**빠른 참조**:

- 패턴: `<타입>/<이슈번호>[-설명]`
- 타입: `feat`, `fix`, `chore`, `docs`, `perf`, `seo`, `style`, `lint`, `config`, `test`
- 항상 `main` 브랜치에서 생성
- PR에서 이슈 문서 참조
- PR은 작고 집중되게 유지
- 깔끔한 히스토리를 위해 "Squash and merge" 사용
- 병합 후 브랜치 삭제

이 전략을 따르면 예측 가능하고, 리뷰 가능하며, 추적 가능한 개발 워크플로우를 보장합니다.

---

> 마지막 번역: 2025-11-25 | 원본: branching-strategy.md
