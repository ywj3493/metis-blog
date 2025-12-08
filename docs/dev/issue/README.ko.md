# Issue 계획 워크플로우

미래 작업은 이 디렉토리 내의 마크다운 계획을 통해 추적됩니다. Issue 문서를 생성하고 유지관리하려면 아래 단계를 따르세요.

## 네이밍 규칙

- 파일 이름은 `issue0XX.md` 형식이며, `XX`는 `85`부터 시작하는 0으로 패딩된 증분 번호입니다 (예: `issue085.md`, `issue086.md`).
- 순차적으로 번호를 유지하세요. 번호를 건너뛰는 경우 이유를 문서화하세요.

## Issue 문서를 생성해야 하는 경우

1. 새 작업을 시작하기 전에 `issue085.md` (템플릿)를 복제하고 사용 가능한 다음 번호로 이름을 변경합니다.
2. 문제 컨텍스트, 목표, 솔루션 개요, 영향을 받는 영역, 검증 단계를 기록합니다.
3. 결정이 변경됨에 따라 문서를 업데이트합니다. 이는 구현 중 단일 진실 공급원입니다.

## 라이프사이클

- **Draft**: 초기 이해 및 미해결 질문을 포착합니다.
- **In Progress**: 합의된 접근 방법, 구현 체크리스트, 테스트 계획을 반영합니다.
- **Ready for Review**: 완료된 작업 요약, 검증 증거, 남아있는 위험을 포함합니다.
- **Done**: 병합 또는 릴리스 세부사항과 후속 작업을 기록한 다음 업데이트된 문서에 링크합니다.

## 링킹 및 추적성

- 커밋 메시지 및 Pull Request에서 관련 issue 문서를 참조하세요 (예: "feat: add AI summary cache (refs issue085)").
- 업데이트가 필요한 경우 관련 문서를 언급하세요:
  - 명세: [docs/specifications/](../../specifications/)
  - 정책: [docs/policy/](../../policy/)
  - 참조 자료: [docs/reference/](../../reference/)
- Issue를 닫기 전에 모든 문서 업데이트를 확인하세요.

## 관련 문서

Issue를 처리할 때 컨텍스트를 위해 다음 문서를 참조하세요:

- **아키텍처**: [specifications/architecture.md](../specifications/architecture.ko.md) - FSD 레이어, import 규칙, 디자인 패턴
- **인프라**: [specifications/infrastructure.md](../specifications/infrastructure.ko.md) - 환경 설정, 배포, 통합
- **요구사항**: [specifications/requirements.md](../specifications/requirements.ko.md) - 기능 요구사항 및 기능
- **정책**: [policy/policy.md](../policy/policy.ko.md) - 개발 규칙 및 규율
- **커밋 규칙**: [policy/commit-convention.md](../policy/commit-convention.ko.md) - 커밋 메시지 형식
- **브랜치 전략**: [policy/branching-strategy.md](../policy/branching-strategy.ko.md) - 브랜치 명명 및 PR 워크플로우
- **테스팅 정책**: [policy/testing-policy.md](../policy/testing-policy.ko.md) - 테스팅 표준

체계적인 issue 문서를 유지하면 협업이 투명해지고 재작업이 줄어듭니다.
