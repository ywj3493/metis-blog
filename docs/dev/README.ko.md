# 문서 허브 (Documentation Hub)

metis-blog 문서에 오신 것을 환영합니다. 이 허브는 작업에 필요한 올바른 문서를 빠르게 찾을 수 있도록 도와줍니다.

## 빠른 시작

**프로젝트가 처음이신가요?** 작업 중심의 빠른 참조를 위해 [../../AGENTS.md](../../AGENTS.md)로 시작하세요.

**특정 세부사항을 찾고 계신가요?** 아래의 작업 기반 네비게이션을 사용하여 올바른 문서를 찾으세요.

## 작업별 네비게이션

### 계획 및 아키텍처

| 무엇을 하고 계신가요? | 이 문서를 읽으세요 |
|---------------------|-----------|
| 프로젝트 구조 이해하기 | [specifications/architecture.md](../specifications/architecture.md) |
| 기능 요구사항 확인하기 | [specifications/requirements.md](../specifications/requirements.md) |
| 환경/배포 설정하기 | [specifications/infrastructure.md](../specifications/infrastructure.md) |
| 새로운 작업 계획하기 | [issue/README.md](../issue/README.md) → 새로운 issueXXX.md 생성 |

### 개발 워크플로우

| 무엇을 하고 계신가요? | 이 문서를 읽으세요 |
|---------------------|-----------|
| 커밋 만들기 | [policy/commit-convention.md](../policy/commit-convention.md) (TL;DR 섹션) |
| 브랜치 생성하기 | [policy/branching-strategy.md](../policy/branching-strategy.md) (TL;DR 섹션) |
| 파일/변수/컴포넌트 명명하기 | [policy/naming-conventions.md](../policy/naming-conventions.md) (TL;DR 섹션) |
| 테스트 작성하기 | [policy/testing-policy.md](../policy/testing-policy.md) (TL;DR 섹션) |
| 문서화 워크플로우 이해하기 | [policy/policy.md](../policy/policy.md) |

### 구현 세부사항

| 무엇을 하고 계신가요? | 이 문서를 읽으세요 |
|---------------------|-----------|
| Notion API 작업하기 | [../../AGENTS.md](../../AGENTS.md#dual-notion-client-setup) |
| 캐싱 구현하기 | [specifications/infrastructure.md](../specifications/infrastructure.md#server-side-caching-strategy) |
| FSD 레이어 이해하기 | [specifications/architecture.md](../specifications/architecture.md#layer-responsibilities) |
| AI/LLM 기능 추가하기 | [../../AGENTS.md](../../AGENTS.md#environment-based-llm-selection) |
| 이메일 알림 설정하기 | [specifications/infrastructure.md](../specifications/infrastructure.md#email-service) |

## 문서 구조

```
docs/
├── README.md                    # 영문 네비게이션 허브
├── specifications/              # 기술 아키텍처 및 요구사항
│   ├── architecture.md         # FSD 레이어, 디자인 패턴, 모듈 경계
│   ├── infrastructure.md       # 환경, 배포, 통합, 캐싱
│   └── requirements.md         # 기능 요구사항 (FR-001 ~ FR-009)
├── policy/                     # 개발 정책 및 규칙
│   ├── policy.md              # 문서 구조, 워크플로우, 메타 정책
│   ├── commit-convention.md   # 커밋 메시지 규칙 (TL;DR 포함)
│   ├── branching-strategy.md  # Git 워크플로우, 브랜치 명명 (TL;DR 포함)
│   ├── naming-conventions.md  # 파일 및 코드 명명 규칙 (TL;DR 포함)
│   └── testing-policy.md      # 테스트 표준 (TL;DR 포함)
├── issue/                      # 이슈 추적 및 계획
│   ├── README.md              # 이슈 워크플로우 개요
│   └── issueXXX.md            # 개별 이슈 문서 (085, 086, 087...)
├── reference/                  # 외부 API 문서 (사용자 추가)
│   └── README.md              # 참조 문서 추가 가이드라인
└── dev/                        # 한국어 번역
    ├── README.ko.md           # 이 파일 - 한국어 네비게이션 허브
    ├── development-guide.md   # 한국어 개발 개요
    ├── issue/                 # 한국어 이슈 번역
    ├── policy/                # 한국어 정책 번역
    └── specifications/        # 한국어 사양 번역
```

## 카테고리별 문서

### 사양 (기술 세부사항)

**[specifications/architecture.md](../specifications/architecture.md)** (영문)
- Feature-Sliced Design (FSD) 레이어 계층
- 임포트 규칙 및 경계
- 공통 패턴 (보호된 생성자, 타입 가드)
- 디렉토리 구조 및 책임
- 한국어 번역: [specifications/architecture.ko.md](specifications/architecture.ko.md)

**[specifications/infrastructure.md](../specifications/infrastructure.md)** (영문)
- 환경 변수 및 설정
- Notion API 설정 (이중 클라이언트 방식)
- 서버 사이드 캐싱 전략
- AI/LLM 통합 (OpenAI vs 로컬)
- 이메일 서비스 설정
- 배포 및 모니터링

**[specifications/requirements.md](../specifications/requirements.md)** (영문)
- FR-001 ~ FR-009: 모든 기능 요구사항
- 기능 설명 및 수락 기준
- 시스템 기능 및 제약사항

### 정책 (개발 규칙)

**[policy/policy.md](../policy/policy.md)** (영문)
- 문서 구조 및 언어 규칙
- 이슈 기반 개발 워크플로우
- 업데이트 및 유지보수 가이드라인
- 한국어 번역: [policy/policy.ko.md](policy/policy.ko.md)

**[policy/commit-convention.md](../policy/commit-convention.md)** (영문)
- 커밋 메시지 형식: `<type>: <summary>`
- 사용 가능한 타입: feat, fix, style, chore 등
- 예제 및 안티패턴
- **빠른 참조를 위한 상단 TL;DR 섹션**

**[policy/branching-strategy.md](../policy/branching-strategy.md)** (영문)
- 브랜치 명명: `<type>/<issue-number>[-description]`
- 브랜치 생성부터 PR까지의 워크플로우
- 예제 및 규칙
- **빠른 참조를 위한 상단 TL;DR 섹션**

**[policy/naming-conventions.md](../policy/naming-conventions.md)** (영문)
- 파일 명명 (kebab-case)
- 컴포넌트 명명 (PascalCase)
- 변수/함수 명명 (camelCase)
- 상수 (UPPER_SNAKE_CASE)
- **빠른 참조를 위한 상단 TL;DR 테이블**

**[policy/testing-policy.md](../policy/testing-policy.md)** (영문)
- 테스트 철학 및 프레임워크 (Vitest + MSW)
- 테스트 대상 (우선순위 및 커버리지 목표)
- 테스트 위치 및 구조
- 명령어: `pnpm test` vs `pnpm test:deep`
- **빠른 참조를 위한 상단 TL;DR 섹션**

### 이슈 (작업 계획)

**[issue/README.md](../issue/README.md)** (영문)
- 이슈 워크플로우 개요
- 이슈 문서 생성 시기
- 이슈 번호 매기기 (085부터 시작)
- 한국어 번역: [issue/README.ko.md](issue/README.ko.md)

**[issue/issueXXX.md](../issue/)** (영문)
- 개별 이슈 계획 문서
- 템플릿: [issue085.md](../issue/issue085.md)
- 각 이슈 포함 사항: 문제, 목표, 접근 방법, 검증
- 한국어 예제: [issue/issue085.ko.md](issue/issue085.ko.md)

### 참조 (외부 문서)

**[reference/README.md](../reference/README.md)** (영문)
- 외부 API 문서 추가 가이드라인
- SDK 가이드 및 통합 참조
- 현재 비어있음 - 필요시 추가

## 문서 원칙

### TL;DR 우선

모든 주요 정책 및 사양 문서에는 이제 상단에 **TL;DR (빠른 참조)** 섹션이 포함됩니다:
- 테이블 또는 목록 형식의 필수 규칙
- 간단한 예제
- 아래 전체 세부사항으로의 링크

이를 통해 에이전트와 개발자가 전체 문서를 읽지 않고도 빠르게 정보를 찾을 수 있습니다.

### 작업 중심

문서는 기술 카테고리가 아닌 달성하려는 목표에 따라 구성됩니다. 위의 "작업별 네비게이션" 테이블을 사용하여 필요한 것을 찾으세요.

### 단일 진실의 원천

- [../../AGENTS.md](../../AGENTS.md): 빠른 참조 및 작업 라우팅 (~400줄)
- [docs/](../): 포괄적인 세부사항 및 근거 (~3,500줄 이상)
- 중복 없음 - AGENTS.md는 심층 분석을 위해 docs/로 링크

### 살아있는 문서

문서는 코드와 함께 발전해야 합니다:
- 아키텍처 변경 시 docs/ 업데이트
- 작업 시작 전 새 이슈 추가
- TL;DR 섹션을 상세 내용과 동기화 유지

## AI 에이전트를 위한 안내

**여기서 시작**: [../../AGENTS.md](../../AGENTS.md)

**AGENTS.md 제공 내용**:
- 작업 기반 라우팅 ("~가 필요하면 → 읽기:")
- 빠른 참조 테이블 (명명, 커밋, 테스트)
- 핵심 패턴 (캐싱, 이중 Notion 클라이언트)
- 심층 문서로의 링크

**이 README 사용 목적**:
- 문서 구조 이해
- 특정 주제 찾기
- 관련 문서 간 탐색

## 한국인 개발자를 위한 안내

**시작**: [development-guide.md](development-guide.md)

**기여하기**:
1. 문서화 워크플로우를 위해 [policy/policy.md](../policy/policy.md) 읽기
2. 주요 작업 전 [issue/](../issue/)에 이슈 생성
3. [policy/](../policy/)의 규칙 준수
4. 영문 및 한국어 문서 동기화 유지

## 도움말

- **규칙에 대한 질문?** [policy/](../policy/) TL;DR 섹션 확인
- **아키텍처 질문?** [specifications/architecture.md](../specifications/architecture.md) 참조
- **설정 문제?** [specifications/infrastructure.md](../specifications/infrastructure.md) 확인
- **새로운 작업?** [issue/issueXXX.md](../issue/) 생성

## 피드백

문서 문제를 발견하거나 제안이 있으신가요? 관련 문서를 업데이트하고 [policy/branching-strategy.md](../policy/branching-strategy.md)를 따라 PR을 생성하세요.
