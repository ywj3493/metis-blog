<!-- Created: 2026-04-07 | Last Modified: 2026-04-07 | Status: Active -->

# 명세 (Specifications)

Metis Blog 프로젝트의 기술 명세. 각 도메인은 [dev-planning](../../README.md) 파이프라인을 따릅니다: 요구사항 → 유저 스토리 → 유스케이스 → 시퀀스 다이어그램 → 도메인 명세 → 테스트 명세.

## 전역 명세

| 문서 | 설명 |
|------|------|
| [아키텍처](architecture.md) | FSD 레이어, 디자인 패턴, 모듈 목록, 데이터 흐름 |
| [설정](config.md) | 환경 변수, 앱 설정, Notion 속성명 |
| [인프라](infrastructure.md) | 기술 스택, 배포, 캐싱, 외부 서비스 |

## 도메인 명세

### post

최종 사용자 대상 포스트 기능: 목록, 상세, 필터링, 태그, 네비게이션, 렌더링.

| 단계 | 문서 |
|------|------|
| 요구사항 | [requirements.md](post/requirements/requirements.md) |
| 유저 스토리 | [user-stories.md](post/requirements/user-stories.md) |
| 유스케이스 | [use-cases.md](post/workflows/use-cases.md) |
| 시퀀스 다이어그램 | [sequence-diagram.md](post/workflows/sequence-diagram.md) |
| 컴포넌트 명세 | [component-spec.md](post/workflows/component-spec.md) |
| 테스트 명세 | [test-spec.md](post/workflows/test-spec.md) |

**소스 코드**: `src/features/post/`, `src/features/tag/`, `src/entities/post/`, `src/app/posts/`

### guestbook

방명록 CRUD와 이메일 알림.

| 단계 | 문서 |
|------|------|
| 요구사항 | [requirements.md](guestbook/requirements/requirements.md) |
| 유저 스토리 | [user-stories.md](guestbook/requirements/user-stories.md) |
| 유스케이스 | [use-cases.md](guestbook/workflows/use-cases.md) |
| 시퀀스 다이어그램 | [sequence-diagram.md](guestbook/workflows/sequence-diagram.md) |
| API 명세 | [api-spec.md](guestbook/workflows/api-spec.md) |
| 테스트 명세 | [test-spec.md](guestbook/workflows/test-spec.md) |

**소스 코드**: `src/features/guestbook/`, `src/entities/guestbook/`, `src/entities/alarm/`, `src/app/api/guestbooks/`, `src/app/api/alarm/`

### summary

OpenAI/Ollama를 통한 AI 생성 포스트 요약.

| 단계 | 문서 |
|------|------|
| 요구사항 | [requirements.md](summary/requirements/requirements.md) |
| 유저 스토리 | [user-stories.md](summary/requirements/user-stories.md) |
| 유스케이스 | [use-cases.md](summary/workflows/use-cases.md) |
| 시퀀스 다이어그램 | [sequence-diagram.md](summary/workflows/sequence-diagram.md) |
| API 명세 | [api-spec.md](summary/workflows/api-spec.md) |
| 테스트 명세 | [test-spec.md](summary/workflows/test-spec.md) |

**소스 코드**: `src/features/summary/`, `src/app/api/posts/[postId]/summary/`, `src/shared/api/openai.ts`

### site

테마 시스템, 네비게이션, 프로필, About 페이지, SEO (사이트맵, robots).

| 단계 | 문서 |
|------|------|
| 요구사항 | [requirements.md](site/requirements/requirements.md) |
| 유저 스토리 | [user-stories.md](site/requirements/user-stories.md) |
| 유스케이스 | [use-cases.md](site/workflows/use-cases.md) |
| 시퀀스 다이어그램 | [sequence-diagram.md](site/workflows/sequence-diagram.md) |
| 컴포넌트 명세 | [component-spec.md](site/workflows/component-spec.md) |
| 테스트 명세 | [test-spec.md](site/workflows/test-spec.md) |

**소스 코드**: `src/features/theme/`, `src/features/profile/`, `src/widgets/`, `src/app/about/`, `src/app/api/sitemap/`, `src/app/robots.ts`, `src/app/layout.tsx`

## ID 시스템

| 문서 | ID 형식 | 예시 |
|------|--------|------|
| 요구사항 | `FR-<DOMAIN>-NN`, `NFR-<DOMAIN>-NN` | `FR-POST-01`, `NFR-SITE-02` |
| 유저 스토리 | `US-NN`, `AC-USNN-NN` | `US-01`, `AC-US01-01` |
| 유스케이스 | `UC-<DOMAIN>-NN` | `UC-GB-01` |
| 테스트 | `T-NNN` | `T-001` |

## 상호 참조

- 모든 요구사항은 관련 유스케이스에 링크
- 모든 유저 스토리는 요구사항에 링크
- 모든 유스케이스는 시퀀스 다이어그램에 링크
- 테스트 명세는 이전 문서들(FR-, US-, AC-, UC-)에서 테스트 ID 파생
