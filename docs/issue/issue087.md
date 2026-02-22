# Issue 087: 태그 기반 Vercel 배포 워크플로우 전환

## 1. Summary

- **문제**: 현재 `main` 브랜치 머지 시 자동으로 프로덕션 배포가 수행되어 배포 시점을 제어할 수 없음
- **중요성**: semver 태그 기반 배포로 전환하면 배포 시점을 명시적으로 제어하고, 릴리스 이력을 추적할 수 있음

## 2. Background & Context

- 현재 Vercel Git Integration이 `main` 브랜치 push를 감지하여 자동 프로덕션 배포 수행
- PR CI 체크는 Biome 포맷팅만 실행 (lint, test, build 미포함)
- PR 생성 시 Vercel preview 배포가 자동 생성되고, `cleanup.yml`이 머지 후 정리

**관련 문서**:
- [docs/specifications/infrastructure.md](../specifications/infrastructure.md) - CI/CD 파이프라인 섹션
- [docs/policy/branching-strategy.md](../policy/branching-strategy.md) - 브랜치 전략 및 GitHub Actions

## 3. Goals & Non-Goals

### Goals

- [ ] semver 태그(`v*`) push 시 GitHub Actions → Vercel CLI로 프로덕션 배포
- [ ] PR CI 체크 강화 (Biome + ESLint + Vitest + Next.js build)
- [ ] Vercel 자동 프로덕션 배포 비활성화 (Ignored Build Step)
- [ ] Preview 배포 제거 및 cleanup 워크플로우 삭제
- [ ] 관련 문서 업데이트 (infrastructure, branching-strategy)

### Non-Goals

- 스테이징 환경 구축
- 자동 changelog 생성
- GitHub Releases 자동화
- 배포 롤백 자동화

## 4. Proposed Approach

### 배포 흐름 변경

**Before** (merge-based):
```
PR merged → push to main → Vercel auto-deploy → Production
```

**After** (tag-based):
```
PR merged → push to main → (no deploy)
git tag v1.0.0 → push tag → GitHub Actions → Vercel CLI → Production
```

### CI 파이프라인 변경

**Before**:
- `pull_request.yml`: Biome CI 체크만

**After**:
- `pull_request.yml`: Biome CI + ESLint + Vitest + Next.js build (2개 병렬 job)
- `deploy.yml`: 태그 push 시 Vercel CLI로 프로덕션 배포
- `cleanup.yml`: 삭제

### Vercel 설정 변경 (수동)

- Ignored Build Step: `exit 0` (모든 Git-triggered 빌드 스킵)
- 프로덕션 배포는 GitHub Actions의 Vercel CLI를 통해서만 수행

## 5. Implementation Checklist

- [ ] `.github/workflows/pull_request.yml` 수정 - CI 강화
- [ ] `.github/workflows/deploy.yml` 생성 - 태그 기반 배포
- [ ] `.github/workflows/cleanup.yml` 삭제
- [ ] `docs/specifications/infrastructure.md` 업데이트 - CI/CD 섹션
- [ ] `docs/policy/branching-strategy.md` 업데이트 - 릴리스 워크플로우
- [ ] Vercel 대시보드 설정 변경 (Ignored Build Step = `exit 0`)
- [ ] GitHub Secrets 추가 (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
- [ ] 첫 태그 `v1.0.0` push 후 배포 검증

## 6. Validation Plan

### CI 검증
- [ ] PR 생성 시 Biome + ESLint + Test + Build 모두 실행되는지 확인

### 배포 차단 검증
- [ ] main 머지 후 Vercel 프로덕션 배포가 트리거되지 않는지 확인

### 태그 배포 검증
- [ ] `v1.0.0` 태그 push 후 GitHub Actions Deploy workflow 실행 확인
- [ ] Vercel 프로덕션 배포 완료 확인

## 7. Rollout & Follow-up

### 배포 순서

1. 코드 변경 PR 생성 및 머지
2. Vercel 대시보드 설정 변경 (Ignored Build Step = `exit 0`)
3. GitHub Secrets 추가 (`VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`)
4. 첫 태그 push: `git tag v1.0.0 && git push origin v1.0.0`

### Follow-up Tasks

- [ ] CLAUDE.md의 Quick Reference에 릴리스 워크플로우 추가 고려
- [ ] 향후 자동 changelog 생성 검토

## 8. Status Log

| Date | Update | Owner |
| --- | --- | --- |
| 2026-02-19 | 이슈 문서 초안 작성 | Claude |
