# Issue 086: 도메인별 상세 명세 문서 작성

## 1. Summary
- **문제**: 기존 `docs/specifications/requirements.md`가 모든 기능을 하나의 문서에 담고 있어 도메인별 상세 정보가 부족함
- **중요성**: 도메인별로 분리된 상세 명세 문서가 있어야 향후 기능 개발 및 유지보수 시 참조 가능

## 2. Background & Context
- 기존 `docs/specifications/requirements.md`에 FR-001 ~ FR-009 정의됨
- 도메인별 상세 유즈케이스, 시퀀스 다이어그램, 정보 구조 등이 미비
- Feature-Sliced Design (FSD) 아키텍처에 맞는 도메인 분리 필요

**관련 문서**:
- [docs/specifications/requirements.md](../specifications/requirements.md) - 기존 전체 요구사항
- [docs/specifications/architecture.md](../specifications/architecture.md) - FSD 아키텍처

## 3. Goals & Non-Goals

### Goals
- [x] 4개 비즈니스 도메인별 상세 명세 문서 작성
  - Posts (포스트 + AI 요약 + 태그)
  - Guestbook (방명록)
  - Alarm (이메일 알림)
  - Site (테마 + 프로필 + SEO)
- [x] 각 도메인에 requirements/, design/, workflows/ 폴더 구조 적용
- [x] Mermaid 다이어그램으로 시각적 문서화
- [x] 영문 문서 작성 후 한글 번역 제공

### Non-Goals
- 코드 구현 변경
- 기존 requirements.md 삭제 (overview 역할로 유지)
- 테스트 코드 작성

## 4. Proposed Approach

### 도메인 구조
```
docs/specifications/
├── posts/           # 포스트 + AI 요약 + 태그 (API 있음)
├── guestbook/       # 방명록 (API 있음)
├── alarm/           # 이메일 알림 (API 있음)
└── site/            # 테마 + 프로필 + SEO + Sitemap (API 있음)
```

### 문서 구조 (도메인별)
```
{domain}/
├── requirements/
│   ├── requirements.md      # 기능 요구사항
│   └── user-stories.md      # E2E 유저 스토리
├── design/
│   ├── information-architecture.md  # 화면 구조
│   ├── use-case.md                  # 프론트엔드 유즈케이스
│   └── component-design.md          # 컴포넌트 설계 (선택)
└── workflows/                       # API 있는 도메인만
    ├── sequence-diagram.md          # 시퀀스 다이어그램
    └── use-case.md                  # 백엔드 유즈케이스
```

### 번역 규칙
- 영문 문서 먼저 작성 → 한글 번역
- 한글 문서는 `docs/dev/specifications/{domain}/` 하위에 `.ko.md` 확장자
- Mermaid 다이어그램은 영문 유지
- 기술 용어 (API, cache, Notion 등)는 영문 유지

## 5. Implementation Checklist

### Phase 1: Posts Domain ✅
- [x] `docs/specifications/posts/requirements/requirements.md` - FR-POSTS-001 ~ FR-POSTS-006
- [x] `docs/specifications/posts/requirements/user-stories.md` - 4 user journeys
- [x] `docs/specifications/posts/design/information-architecture.md` - 3 screens
- [x] `docs/specifications/posts/design/use-case.md` - UC-F-001 ~ UC-F-004
- [x] `docs/specifications/posts/design/component-design.md` - Repository pattern
- [x] `docs/specifications/posts/workflows/sequence-diagram.md` - 6 diagrams
- [x] `docs/specifications/posts/workflows/use-case.md` - UC-API-001
- [x] 한글 번역 (7 files)

### Phase 2: Guestbook Domain ✅
- [x] `docs/specifications/guestbook/requirements/requirements.md` - FR-GB-001 ~ FR-GB-003
- [x] `docs/specifications/guestbook/requirements/user-stories.md` - 4 user journeys
- [x] `docs/specifications/guestbook/design/information-architecture.md`
- [x] `docs/specifications/guestbook/design/use-case.md` - UC-F-010, UC-F-011
- [x] `docs/specifications/guestbook/workflows/sequence-diagram.md` - 4 diagrams
- [x] `docs/specifications/guestbook/workflows/use-case.md` - UC-API-010, UC-API-011
- [x] 한글 번역 (6 files)

### Phase 3: Alarm Domain ✅
- [x] `docs/specifications/alarm/requirements/requirements.md` - FR-ALARM-001 ~ FR-ALARM-002
- [x] `docs/specifications/alarm/requirements/user-stories.md` - 3 user journeys
- [x] `docs/specifications/alarm/workflows/sequence-diagram.md` - 5 diagrams
- [x] `docs/specifications/alarm/workflows/use-case.md` - UC-API-020
- [x] 한글 번역 (4 files)

### Phase 4: Site Domain ✅
- [x] `docs/specifications/site/requirements/requirements.md` - FR-SITE-001 ~ FR-SITE-006
- [x] `docs/specifications/site/requirements/user-stories.md` - 4 user journeys
- [x] `docs/specifications/site/design/information-architecture.md`
- [x] `docs/specifications/site/design/use-case.md` - UC-F-030, UC-F-031, UC-F-033
- [x] `docs/specifications/site/workflows/sequence-diagram.md` - Sitemap 시퀀스 다이어그램
- [x] `docs/specifications/site/workflows/use-case.md` - UC-API-030 (Sitemap 생성)
- [x] 한글 번역 (6 files)

### Documentation Updates

- [x] 46개 파일 생성 (영문 23개 + 한글 23개)
- [ ] docs/README.md 업데이트 (새 문서 링크 추가) - 선택

## 6. Validation Plan

### Manual Checks
- [x] 모든 Mermaid 다이어그램이 렌더링되는지 확인
- [x] 영문/한글 문서 간 구조 일치 확인
- [x] 코드 예시가 실제 구현과 일치하는지 확인

### File Count Verification

| Domain | requirements/ | design/ | workflows/ | Total (EN) | Total (KO) |
|--------|--------------|---------|------------|------------|------------|
| posts | 2 | 3 | 2 | 7 | 7 |
| guestbook | 2 | 2 | 2 | 6 | 6 |
| alarm | 2 | 0 | 2 | 4 | 4 |
| site | 2 | 2 | 2 | 6 | 6 |
| **Total** | **8** | **7** | **8** | **23** | **23** |

## 7. Rollout & Follow-up

### Commits
- `bc18ddc` - docs: 도메인별 상세 명세 문서 추가

### Follow-up Tasks
- [ ] 기존 `docs/specifications/requirements.md`에서 새 문서로 링크 추가
- [ ] `docs/README.md`에 도메인별 문서 네비게이션 추가
- [ ] 향후 기능 개발 시 해당 도메인 문서 참조 및 업데이트

## 8. Status Log

| Date | Update | Owner |
| --- | --- | --- |
| 2024-12-08 | Initial draft & plan created | Claude |
| 2024-12-08 | Phase 1-4 완료, 44개 파일 생성 | Claude |
| 2024-12-08 | 커밋 완료 (bc18ddc) | Claude |
| 2024-12-08 | Site 도메인 구조 개선: SEO/Sitemap을 workflows/로 이동, IA에서 비기능적 요구사항 제거 | Claude |
| 2024-12-08 | Alarm 도메인 구조 개선: IA 삭제, Contact Form 관련 내용 제거, Sequence Diagram 프론트엔드 제거 | Claude |
