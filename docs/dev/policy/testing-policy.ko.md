# 테스팅 정책

## TL;DR (빠른 참조)

**프레임워크**: Vitest + MSW (Mock Service Worker) + Testing Library

**무엇을 테스트할지** (우선순위 순서):

| 코드 타입 | 커버리지 | 이유 |
|-----------|----------|-----|
| Entities/도메인 모델 | 80%+ | 핵심 비즈니스 로직 |
| API 라우트 | 80%+ | 중요 엔드포인트 |
| Features (사용자 상호작용) | 70%+ | UX 무결성 |
| 로직이 있는 UI 컴포넌트 | 50%+ | 조건부 렌더링 |

**테스트하지 말아야 할 것**: 단순 표현 컴포넌트, 타입 정의, 설정 파일

**명령어**:
```bash
pnpm test       # 표준 테스트 (MSW 모킹)
pnpm test:deep  # 실제 Notion API 호출
```

**테스트 위치**: 테스트되는 코드 옆의 `__tests__/` 디렉토리 (예: `src/entities/posts/__tests__/`)

**황금률**: 구현(어떻게)이 아닌 동작(무엇)을 테스트하세요

---

## 개요

테스팅은 코드 품질을 보장하고, 회귀를 방지하며, 예상 동작을 문서화합니다. 이 정책은 프로젝트의 테스팅 표준, 요구사항 및 모범 사례를 정의합니다.

## 테스팅 철학

### 목표

1. **회귀 방지**: 프로덕션에 도달하기 전에 버그 포착
2. **동작 문서화**: 테스트는 실행 가능한 명세서 역할
3. **리팩토링 활성화**: 안전망으로 코드를 자신있게 재구조화
4. **빠른 피드백**: 개발 중 빠른 반복

### 원칙

- **구현이 아닌 동작 테스트**: 코드가 어떻게가 아닌 무엇을 하는지에 집중
- **유닛 테스트보다 통합 테스트 선호**: 사용자가 경험하는 대로 기능 테스트
- **외부 의존성 모킹**: 테스트 중 실제 API 호출 안 함
- **테스트를 단순하게 유지**: 테스트는 코드보다 이해하기 쉬워야 함

## 테스트 프레임워크와 도구

### 코어 스택

- **Test Runner**: Vitest
- **Environment**: jsdom (브라우저 시뮬레이션)
- **Mocking**: MSW (Mock Service Worker) API 호출용
- **Assertions**: Vitest 내장 단언문
- **Component Testing**: Testing Library (@testing-library/react)

### 설정

**`vitest.config.ts`**:
- 환경 변수를 위한 `.env.local` 로드
- jsdom 환경 사용
- 경로 alias `@` → `./src`
- 설정 파일: `vitest.setup.ts`

**`vitest.setup.ts`**:
- 모든 테스트 전에 MSW 서버 시작
- 각 테스트 후 핸들러 리셋
- 모든 테스트 후 서버 종료

## 테스트 위치

### 디렉토리 구조

```text
src/
├── __test__/                 # 테스트 스위트
│   ├── features/
│   │   └── notion.test.ts    # Notion 통합 테스트
│   └── mock/
│       ├── mock.test.tsx     # 스냅샷 및 상호작용 테스트
│       └── __snapshots__/
└── mocks/                    # MSW 설정
    ├── server.ts             # MSW 서버 설정
    ├── api/                  # API 모킹 핸들러
    └── components/           # 테스트 전용 컴포넌트
```

### 테스트 파일 네이밍

**규칙**: `<name>.test.ts` 또는 `<name>.test.tsx`

**예시**:
```text
src/__test__/features/notion.test.ts
src/__test__/mock/mock.test.tsx
src/__test__/entities/post.test.ts
```

**위치**: 테스트는 `src/__test__/` 디렉토리에 있으며, 레이어별로 구성됨 (features, entities 등)

## 무엇을 테스트할지

### 높은 우선순위 (필수)

1. **Entities / 도메인 모델**:
   - 모델 생성 및 검증
   - 타입 가드
   - 데이터 변환
   - 팩토리 메서드

   **예시**:
   ```typescript
   // src/__test__/entities/post.test.ts
   describe('Post', () => {
     it('should create valid post from Notion response', () => {
       const response = mockNotionDatabaseResponse();
       const post = Post.create(response);
       expect(post.id).toBe('123');
       expect(post.title).toBe('Test Post');
     });

     it('should throw error for invalid Notion response', () => {
       const invalidResponse = { };
       expect(() => Post.create(invalidResponse)).toThrow();
     });
   });
   ```

2. **API 라우트**:
   - 요청 검증
   - 응답 구조
   - 에러 처리
   - 캐시 무효화

   **예시**:
   ```typescript
   // src/__test__/api/posts.test.ts
   describe('POST /api/posts/[postId]/summary', () => {
     it('should generate and store AI summary', async () => {
       const response = await POST({ postId: '123' });
       expect(response.status).toBe(200);
       expect(await response.json()).toHaveProperty('summary');
     });

     it('should return 400 for invalid postId', async () => {
       const response = await POST({ postId: '' });
       expect(response.status).toBe(400);
     });
   });
   ```

3. **Features / 중요 경로**:
   - 사용자 상호작용 (폼 제출, 필터링 등)
   - 상태 관리
   - 에러 경계

   **예시**:
   ```typescript
   // src/__test__/features/guestbook.test.tsx
   describe('GuestbookForm', () => {
     it('should submit valid guestbook entry', async () => {
       render(<GuestbookForm />);

       await userEvent.type(screen.getByLabelText('Name'), 'John Doe');
       await userEvent.type(screen.getByLabelText('Message'), 'Hello!');
       await userEvent.click(screen.getByRole('button', { name: 'Submit' }));

       expect(await screen.findByText('Thank you!')).toBeInTheDocument();
     });
   });
   ```

4. **캐시 로직**:
   - 캐시 래퍼 동작
   - 재검증 트리거
   - 태그 기반 무효화

### 중간 우선순위 (권장)

5. **UI 컴포넌트** (복잡한 로직이 있는 경우):
   - 조건부 렌더링
   - 부작용이 있는 이벤트 핸들러
   - 컴포넌트 상태 관리

6. **유틸리티와 헬퍼**:
   - 복잡한 로직이 있는 순수 함수
   - 데이터 변환
   - 검증 함수

### 낮은 우선순위 (선택사항)

7. **단순 UI 컴포넌트**:
   - 로직이 없는 표현 컴포넌트
   - 프리미티브를 둘러싼 단순 래퍼

8. **타입 정의**:
   - TypeScript가 타입 검사 처리

## MSW(Mock Service Worker)로 테스팅

### 목적

테스트 중 실제 엔드포인트를 호출하지 않고 외부 API 호출을 모킹합니다.

### 설정

**`src/mocks/server.ts`**:
```typescript
import { setupServer } from 'msw/node';
import { handlers } from './api';

export const server = setupServer(...handlers);
```

**`src/mocks/api/index.ts`**:
```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://api.notion.com/v1/databases/*/query', () => {
    return HttpResponse.json({
      results: [/* mock Notion response */],
    });
  }),

  http.post('https://api.openai.com/v1/chat/completions', () => {
    return HttpResponse.json({
      choices: [{ message: { content: 'Mock AI summary' } }],
    });
  }),
];
```

### 생명주기

**`vitest.setup.ts`**:
```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());        // 모든 테스트 전에 서버 시작
afterEach(() => server.resetHandlers()); // 각 테스트 후 기본 핸들러로 리셋
afterAll(() => server.close());          // 모든 테스트 후 정리
```

### 테스트에서 핸들러 재정의

```typescript
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

test('handles API error', async () => {
  server.use(
    http.post('https://api.notion.com/v1/databases/*/query', () => {
      return HttpResponse.json({ error: 'Rate limited' }, { status: 429 });
    })
  );

  // 에러 처리 테스트
});
```

## 딥 테스팅 모드

### 목적

빌드 검증을 위해 실제 외부 API에 대해 테스트를 실행합니다.

### 설정

**환경 변수**:
```bash
DEEP_TEST=true pnpm test:deep
```

**테스트에서**:
```typescript
const isDeepTest = process.env.DEEP_TEST === 'true';

if (isDeepTest) {
  beforeAll(() => {
    server.close(); // 실제 API 호출을 허용하기 위해 MSW 비활성화
  });
}
```

### 언제 사용할지

- **배포 전**: 프로덕션 Notion 데이터에 대해 검증
- **주요 변경 후**: 통합이 여전히 작동하는지 확인
- **API 이슈 디버깅**: MSW vs 실제 API 동작 격리

### 요구사항

- `.env.local`의 유효한 환경 변수
- 실제 Notion 데이터베이스 자격 증명
- OpenAI API 키 (AI 기능 테스트 시)

**경고**: 딥 테스트는 실제 API 호출을 하며 비용이나 속도 제한이 발생할 수 있습니다.

## 좋은 테스트 작성하기

### 테스트 구조 (AAA 패턴)

```typescript
test('should do something', () => {
  // Arrange: 테스트 데이터와 모킹 설정
  const mockPost = { id: '123', title: 'Test' };

  // Act: 테스트 대상 코드 실행
  const result = transformPost(mockPost);

  // Assert: 결과 검증
  expect(result).toEqual({ id: '123', title: 'Test', slug: 'test' });
});
```

### 테스트 네이밍

**패턴**: `should <예상 동작> when <조건>`

**좋음**:
```typescript
✅ test('should return published posts when status filter is "published"', ...)
✅ test('should throw error when Notion response is invalid', ...)
✅ test('should invalidate cache when summary is generated', ...)
```

**나쁨**:
```typescript
❌ test('posts', ...)
❌ test('it works', ...)
❌ test('test post filtering', ...)
```

### 단언문

**구체적으로**:
```typescript
// 좋음: 구체적 단언문
expect(post.title).toBe('My Post');
expect(posts).toHaveLength(5);

// 나쁨: 모호한 단언문
expect(post).toBeTruthy();
expect(posts.length > 0).toBe(true);
```

### 테스트 구현 세부사항 피하기

**좋음** (동작 테스트):
```typescript
test('should filter posts by tag', () => {
  const posts = [
    { tags: ['react'] },
    { tags: ['vue'] },
    { tags: ['react'] },
  ];

  const filtered = filterPostsByTag(posts, 'react');

  expect(filtered).toHaveLength(2);
  expect(filtered.every(p => p.tags.includes('react'))).toBe(true);
});
```

**나쁨** (구현 테스트):
```typescript
test('should call Array.filter method', () => {
  const spy = vi.spyOn(Array.prototype, 'filter');
  filterPostsByTag(posts, 'react');
  expect(spy).toHaveBeenCalled(); // 무엇이 아닌 어떻게 테스트
});
```

## Testing Library로 컴포넌트 테스팅

### 원칙

- **사용자 상호작용 테스트**: 클릭, 타이핑, 제출
- **접근성 역할로 쿼리**: `getByRole`, `getByLabelText` 사용
- **구현 세부사항 피하기**: 필요하지 않으면 클래스 이름이나 테스트 ID로 쿼리하지 않기

### 예시

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestbookForm } from '@/features/guestbooks';

test('should submit guestbook form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<GuestbookForm onSubmit={onSubmit} />);

  // 레이블로 입력 찾기 (접근성 친화적)
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Message'), 'Hello, world!');

  // 역할과 텍스트로 버튼 찾기
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  // 폼 제출 단언
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    message: 'Hello, world!',
  });
});
```

### 일반적인 쿼리

**선호 순서**:
1. `getByRole`: 가장 접근 가능
2. `getByLabelText`: 폼 입력용
3. `getByPlaceholderText`: 레이블이 없는 경우
4. `getByText`: 비대화형 요소용
5. `getByTestId`: 최후의 수단

**피하기**:
- `getByClassName`
- `querySelector`

## 스냅샷 테스팅

### 사용 사례

- **시각적 회귀**: 의도하지 않은 UI 변경 포착
- **복잡한 출력**: 큰 데이터 구조 검증

### 예시

```typescript
import { render } from '@testing-library/react';
import { PostCard } from '@/features/posts';

test('should match snapshot', () => {
  const post = {
    id: '123',
    title: 'Test Post',
    date: '2023-01-01',
    tags: ['react', 'testing'],
  };

  const { container } = render(<PostCard post={post} />);

  expect(container).toMatchSnapshot();
});
```

### 스냅샷 업데이트

```bash
# 모든 스냅샷 업데이트
pnpm test -- -u

# 특정 테스트 파일 업데이트
pnpm test post-card.test.tsx -- -u
```

**경고**: 커밋하기 전에 스냅샷 변경사항을 신중하게 검토하세요.

## 테스트 커버리지

### 목표

- **Entities**: 80%+ 커버리지 (중요 도메인 로직)
- **Features**: 70%+ 커버리지 (사용자 대면 기능)
- **API Routes**: 80%+ 커버리지 (통합 지점)
- **UI Components**: 50%+ 커버리지 (마크업이 아닌 로직에 집중)

### 커버리지 측정

```bash
pnpm test -- --coverage
```

**출력**: 터미널의 커버리지 리포트 + `coverage/` 디렉토리의 HTML 리포트

### 커버리지 예외

100% 커버리지를 목표로 하지 마세요. 건너뛰기:
- 단순 getter/setter 메서드
- 타입 정의
- 설정 파일
- 생성된 코드

## 지속적 통합

### GitHub Actions

테스트는 다음 경우 자동으로 실행됩니다:
- `main` 브랜치로의 Pull request
- main 브랜치로 푸시 (병합 후)

**워크플로우** (`.github/workflows/pull_request.yml`):
```yaml
- name: Run tests
  run: pnpm test
```

### Pre-Push Hook (선택사항)

`.git/hooks/pre-push`에 추가:
```bash
#!/bin/sh
pnpm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
  exit 1
fi
```

## 테스트 디버깅

### 특정 테스트 실행

```bash
# 단일 테스트 파일 실행
pnpm test post.test.ts

# 패턴과 일치하는 테스트 실행
pnpm test --grep "should filter posts"

# watch 모드로 실행
pnpm test --watch
```

### VS Code에서 디버그

`.vscode/launch.json`에 추가:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["test", "--run"],
  "console": "integratedTerminal"
}
```

### 자세한 출력

```bash
pnpm test --reporter=verbose
```

## 회귀 테스팅

### 회귀 테스트를 추가해야 할 때

다음 경우 **항상** 테스트 추가:
- 버그 수정 시 (테스트는 수정 전 실패, 수정 후 통과해야 함)
- 캐시 로직 수정
- API 라우트 변경
- 엔티티 모델 업데이트
- 중요 기능 리팩토링

### 회귀 테스트 예시

```typescript
// 버그: AI 요약이 생성 후 Notion에 저장되지 않음
test('should persist AI summary to Notion database', async () => {
  const postId = '123';
  const mockSummary = 'This is a test summary.';

  // 요약 생성
  await generateSummary(postId);

  // Notion 업데이트 호출 검증
  const notionCalls = server
    .getHandlers()
    .filter(h => h.url.includes('notion'));

  expect(notionCalls).toContainEqual(
    expect.objectContaining({
      properties: {
        '요약': { rich_text: [{ text: { content: mockSummary } }] },
      },
    })
  );
});
```

## 테스트 유지보수

### 테스트를 녹색으로 유지

- **실패하는 테스트를 즉시 수정**: 기술 부채 누적 금지
- **코드 변경과 함께 테스트 업데이트**: 테스트는 구현과 함께 발전해야 함
- **오래된 테스트 제거**: 제거된 기능의 테스트 삭제
- **취약한 테스트 리팩토링**: 테스트가 자주 깨지면 테스트 설계 개선

### Flaky 테스트

테스트가 간헐적으로 실패하는 경우:
1. **근본 원인 파악**: 경쟁 조건, 비동기 타이밍, 외부 의존성
2. **적절히 수정**: `sleep()`이나 `retry()` 로직 추가 금지
3. **적절한 비동기 유틸리티 사용**: `waitFor`, `findBy*` 쿼리
4. **수정 불가능하면 건너뛰기**: `test.skip()`으로 표시하고 이슈 제기

## 요약

**빠른 참조**:

- **프레임워크**: Vitest + jsdom + MSW + Testing Library
- **위치**: 레이어별로 구성된 `src/__test__/`
- **네이밍**: `<name>.test.ts` 또는 `<name>.test.tsx`
- **우선순위**: Entities > API 라우트 > Features > UI 컴포넌트
- **모킹**: 외부 API용 MSW
- **딥 테스트**: 실제 API 검증을 위한 `pnpm test:deep`
- **커버리지**: 중요 코드는 70-80%, 100%를 목표로 하지 않기
- **회귀**: 버그 수정 시 항상 테스트 추가

좋은 테스트는 지속 가능한 개발을 위한 신뢰, 문서화 및 빠른 피드백을 제공합니다.

---

> 마지막 번역: 2025-11-25 | 원본: testing-policy.md
