<!-- Created: 2026-04-03 | Last Modified: 2026-04-03 | Status: Active -->

# 개발 정책

## TL;DR

| 규칙 | 요약 |
|------|------|
| 언어 | 문서/코드는 영어, 커밋 메시지와 번역은 한국어 |
| 문서 위치 | `docs/en/` (영어), `docs/ko/` (한국어 미러) |
| 워크플로우 | 이슈 → 브랜치 → 구현 → PR → 리뷰 → 머지 |
| 코드 품질 | TypeScript strict, Biome 포매팅, ESLint 린팅 |
| 테스팅 | Vitest + MSW; entities 80%+, API routes 80%+, features 70%+ |
| 브랜칭 | `<type>/<issue-number>[-description]` from `main` |

## 문서 구조

```
docs/
├── en/                     # 영어 (원본)
│   ├── specifications/     # 기술 명세
│   ├── issue/              # 이슈 추적 문서
│   └── policy/             # 개발 정책
├── ko/                     # 한국어 번역 (en/ 미러)
│   ├── specifications/
│   ├── issue/
│   └── policy/
└── reference/              # 외부 API 문서 (번역 없음)
```

### 원칙

1. **영어 우선**: 모든 문서는 `docs/en/` 아래에 영어로 작성
2. **한국어 미러**: `docs/ko/`에 동일한 파일 구조와 이름으로 번역 유지
3. **단일 출처**: 주제당 하나의 문서, 중복 없음
4. **코드 참조는 영어 유지**: 파일 경로, 명령어, 코드 블록은 한국어 번역에서도 영어 유지

## 개발 워크플로우

### 이슈 기반 개발

1. **이슈 생성**: `gh issue create`로 GitHub Issue 또는 로컬 `docs/en/issue/issueNNN.md`
2. **브랜치 생성**: `<type>/<issue-number>[-description]` (예: `feat/93-docs-refactor`)
3. **구현**: 정책 준수, 점진적 커밋
4. **PR 생성**: 이슈 링크된 Draft PR, 본문에 `Resolves #<number>`
5. **리뷰**: 완료 기준 대비 검증
6. **머지**: `main`으로 Squash 또는 Merge

### 브랜치 네이밍

| 타입 | 용도 | 예시 |
|------|------|------|
| `feat/` | 새 기능 | `feat/93-docs-refactor` |
| `fix/` | 버그 수정 | `fix/94-mobile-header` |
| `docs/` | 문서만 변경 | `docs/95-update-readme` |
| `chore/` | 유지보수 | `chore/96-deps-update` |

### PR 체크리스트

- [ ] 모든 커밋이 [커밋 메시지 규칙](commit-message-rule.md) 준수
- [ ] `pnpm lint` 통과
- [ ] `pnpm biome:write` 적용
- [ ] `pnpm test` 통과
- [ ] PR 본문에 이슈 참조
- [ ] 필요시 문서 업데이트

## 코드 품질 기준

### TypeScript

- **Strict mode**: `strict: true`, `noUnusedLocals`, `noUnusedParameters`
- **타입 가드**: 도메인 모델 유효성 검증에 사용
- **`any` 금지**: `unknown`과 타입 좁히기 선호

### 포매팅 & 린팅

- **Biome**: 주 포매터 (`pnpm biome:write`)
- **ESLint**: `next/core-web-vitals` 설정 린터 (`pnpm lint`)
- 커밋 전 둘 다 실행

### 테스팅

| 코드 유형 | 커버리지 목표 |
|-----------|-------------|
| Entities / 도메인 모델 | 80%+ |
| API 라우트 | 80%+ |
| 사용자 인터랙션 기능 | 70%+ |
| 로직이 있는 UI 컴포넌트 | 50%+ |

**테스트하지 않을 것**: 단순 프레젠테이션 컴포넌트, 타입 정의, 설정 파일, 커스텀 로직 없는 서드파티 래퍼.

**테스트 명령어**:
- `pnpm test` — MSW 모킹 표준 테스트
- `pnpm test:deep` — 실제 Notion API 호출 (인증 정보 필요)

## 협업: 사람 + AI 에이전트

### AI 에이전트 책임

1. 변경 구현 전 `docs/` 읽기
2. 모든 정책 준수 (커밋, 네이밍, 테스팅)
3. 새 작업을 위한 이슈 문서 생성
4. 코드 변경 시 문서 업데이트
5. 불확실할 때 질문 — 추측 금지

### 사람 책임

1. 구현 리뷰
2. 도메인 지식 및 비즈니스 컨텍스트 제공
3. `docs/reference/`에 외부 API 문서 추가
4. 아키텍처 결정
5. PR 승인
