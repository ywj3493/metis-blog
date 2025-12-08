# Testing Policy

## TL;DR (Quick Reference)

**Framework**: Vitest + MSW (Mock Service Worker) + Testing Library

**What to Test** (priority order):

| Code Type | Coverage | Why |
|-----------|----------|-----|
| Entities/domain models | 80%+ | Core business logic |
| API routes | 80%+ | Critical endpoints |
| Features (user interaction) | 70%+ | UX integrity |
| UI components with logic | 50%+ | Conditional rendering |

**What NOT to Test**: Simple presentational components, type definitions, config files

**Commands**:
```bash
pnpm test       # Standard tests (MSW mocking)
pnpm test:deep  # Real Notion API calls
```

**Test Location**: `__tests__/` directory next to tested code (e.g., `src/entities/posts/__tests__/`)

**Golden Rule**: Test behavior (what), not implementation (how)

---

## When to Use This Document

Use this document when you need to:

- **Writing tests right now?** → See [TL;DR](#tldr-quick-reference) above for quick reference
- **Deciding what to test?** → See [What to Test](#what-to-test)
- **Setting up MSW mocks?** → See [Testing with MSW](#testing-with-msw-mock-service-worker)
- **Running real API tests?** → See [Deep Testing Mode](#deep-testing-mode)
- **Writing component tests?** → See [Component Testing](#component-testing-with-testing-library)
- **Understanding test structure?** → See [Writing Good Tests](#writing-good-tests)
- **Checking coverage goals?** → See [Test Coverage](#test-coverage)

**Related Documents**:

- Testing before commits? → [commit-convention.md](./commit-convention.md) - Run `pnpm test` before committing
- PR requirements? → [branching-strategy.md](./branching-strategy.md) - Tests must pass for PR approval

---

## Overview

Testing ensures code quality, prevents regressions, and documents expected behavior. This policy defines testing standards, requirements, and best practices for the project.

## Testing Philosophy

### Goals

1. **Prevent Regressions**: Catch bugs before they reach production
2. **Document Behavior**: Tests serve as executable specifications
3. **Enable Refactoring**: Confidently restructure code with safety net
4. **Fast Feedback**: Quick iteration during development

### Principles

- **Test behavior, not implementation**: Focus on what code does, not how
- **Prefer integration tests over unit tests**: Test features as users experience them
- **Mock external dependencies**: Don't hit real APIs during tests
- **Keep tests simple**: Tests should be easier to understand than code

## Test Framework and Tools

### Core Stack

- **Test Runner**: Vitest
- **Environment**: jsdom (simulates browser)
- **Mocking**: MSW (Mock Service Worker) for API calls
- **Assertions**: Vitest built-in assertions
- **Component Testing**: Testing Library (@testing-library/react)

### Configuration

**`vitest.config.ts`**:
- Loads `.env.local` for environment variables
- Uses jsdom environment
- Path alias `@` → `./src`
- Setup file: `vitest.setup.ts`

**`vitest.setup.ts`**:
- Starts MSW server before all tests
- Resets handlers after each test
- Closes server after all tests

## Test Locations

### Directory Structure

```text
src/
├── __test__/                 # Test suites
│   ├── features/
│   │   └── notion.test.ts    # Notion integration tests
│   └── mock/
│       ├── mock.test.tsx     # Snapshot and interaction tests
│       └── __snapshots__/
└── mocks/                    # MSW configuration
    ├── server.ts             # MSW server setup
    ├── api/                  # API mock handlers
    └── components/           # Test-specific components
```

### Test File Naming

**Convention**: `<name>.test.ts` or `<name>.test.tsx`

**Examples**:
```text
src/__test__/features/notion.test.ts
src/__test__/mock/mock.test.tsx
src/__test__/entities/post.test.ts
```

**Location**: Tests live in `src/__test__/` directory, organized by layer (features, entities, etc.)

## What to Test

### High Priority (Required)

1. **Entities / Domain Models**:
   - Model creation and validation
   - Type guards
   - Data transformations
   - Factory methods

   **Example**:
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

2. **API Routes**:
   - Request validation
   - Response structure
   - Error handling
   - Cache invalidation

   **Example**:
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

3. **Features / Critical Paths**:
   - User interactions (form submission, filtering, etc.)
   - State management
   - Error boundaries

   **Example**:
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

4. **Cache Logic**:
   - Cache wrapper behavior
   - Revalidation triggers
   - Tag-based invalidation

### Medium Priority (Recommended)

5. **UI Components** (if complex logic):
   - Conditional rendering
   - Event handlers with side effects
   - Component state management

6. **Utilities and Helpers**:
   - Pure functions with complex logic
   - Data transformations
   - Validation functions

### Low Priority (Optional)

7. **Simple UI Components**:
   - Presentational components with no logic
   - Simple wrappers around primitives

8. **Type Definitions**:
   - TypeScript handles type checking

## Testing with MSW (Mock Service Worker)

### Purpose

Mock external API calls without hitting real endpoints during tests.

### Setup

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

### Lifecycle

**`vitest.setup.ts`**:
```typescript
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());        // Start server before all tests
afterEach(() => server.resetHandlers()); // Reset to default handlers after each
afterAll(() => server.close());          // Clean up after all tests
```

### Overriding Handlers in Tests

```typescript
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

test('handles API error', async () => {
  server.use(
    http.post('https://api.notion.com/v1/databases/*/query', () => {
      return HttpResponse.json({ error: 'Rate limited' }, { status: 429 });
    })
  );

  // Test error handling
});
```

## Deep Testing Mode

### Purpose

Run tests against real external APIs for build validation.

### Configuration

**Environment Variable**:
```bash
DEEP_TEST=true pnpm test:deep
```

**In Tests**:
```typescript
const isDeepTest = process.env.DEEP_TEST === 'true';

if (isDeepTest) {
  beforeAll(() => {
    server.close(); // Disable MSW to allow real API calls
  });
}
```

### When to Use

- **Before deployment**: Validate against production Notion data
- **After major changes**: Ensure integration still works
- **Debugging API issues**: Isolate MSW vs real API behavior

### Requirements

- Valid environment variables in `.env.local`
- Real Notion database credentials
- OpenAI API key (if testing AI features)

**Warning**: Deep tests make real API calls and may incur costs or rate limits.

## Writing Good Tests

### Test Structure (AAA Pattern)

```typescript
test('should do something', () => {
  // Arrange: Set up test data and mocks
  const mockPost = { id: '123', title: 'Test' };

  // Act: Execute the code under test
  const result = transformPost(mockPost);

  // Assert: Verify the outcome
  expect(result).toEqual({ id: '123', title: 'Test', slug: 'test' });
});
```

### Test Naming

**Pattern**: `should <expected behavior> when <condition>`

**Good**:
```typescript
✅ test('should return published posts when status filter is "published"', ...)
✅ test('should throw error when Notion response is invalid', ...)
✅ test('should invalidate cache when summary is generated', ...)
```

**Bad**:
```typescript
❌ test('posts', ...)
❌ test('it works', ...)
❌ test('test post filtering', ...)
```

### Assertions

**Be specific**:
```typescript
// Good: Specific assertion
expect(post.title).toBe('My Post');
expect(posts).toHaveLength(5);

// Bad: Vague assertion
expect(post).toBeTruthy();
expect(posts.length > 0).toBe(true);
```

### Avoid Test Implementation Details

**Good** (test behavior):
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

**Bad** (test implementation):
```typescript
test('should call Array.filter method', () => {
  const spy = vi.spyOn(Array.prototype, 'filter');
  filterPostsByTag(posts, 'react');
  expect(spy).toHaveBeenCalled(); // Tests HOW, not WHAT
});
```

## Component Testing with Testing Library

### Principles

- **Test user interactions**: Click, type, submit
- **Query by accessibility role**: Use `getByRole`, `getByLabelText`
- **Avoid implementation details**: Don't query by class names or test IDs unless necessary

### Example

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GuestbookForm } from '@/features/guestbooks';

test('should submit guestbook form with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();

  render(<GuestbookForm onSubmit={onSubmit} />);

  // Find inputs by label (accessibility-friendly)
  await user.type(screen.getByLabelText('Name'), 'John Doe');
  await user.type(screen.getByLabelText('Message'), 'Hello, world!');

  // Find button by role and text
  await user.click(screen.getByRole('button', { name: 'Submit' }));

  // Assert form submission
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    message: 'Hello, world!',
  });
});
```

### Common Queries

**Prefer (in order)**:
1. `getByRole`: Most accessible
2. `getByLabelText`: For form inputs
3. `getByPlaceholderText`: If no label
4. `getByText`: For non-interactive elements
5. `getByTestId`: Last resort

**Avoid**:
- `getByClassName`
- `querySelector`

## Snapshot Testing

### Use Cases

- **Visual regression**: Catch unintended UI changes
- **Complex output**: Validate large data structures

### Example

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

### Updating Snapshots

```bash
# Update all snapshots
pnpm test -- -u

# Update specific test file
pnpm test post-card.test.tsx -- -u
```

**Warning**: Review snapshot changes carefully before committing.

## Test Coverage

### Goals

- **Entities**: 80%+ coverage (critical domain logic)
- **Features**: 70%+ coverage (user-facing functionality)
- **API Routes**: 80%+ coverage (integration points)
- **UI Components**: 50%+ coverage (focus on logic, not markup)

### Measuring Coverage

```bash
pnpm test -- --coverage
```

**Output**: Coverage report in terminal + HTML report in `coverage/` directory

### Coverage Exceptions

Don't aim for 100% coverage. Skip:
- Simple getter/setter methods
- Type definitions
- Configuration files
- Generated code

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Pull requests to `main` branch
- Push to main branch (after merge)

**Workflow** (`.github/workflows/pull_request.yml`):
```yaml
- name: Run tests
  run: pnpm test
```

### Pre-Push Hook (Optional)

Add to `.git/hooks/pre-push`:
```bash
#!/bin/sh
pnpm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
  exit 1
fi
```

## Debugging Tests

### Run Specific Test

```bash
# Run single test file
pnpm test post.test.ts

# Run tests matching pattern
pnpm test --grep "should filter posts"

# Run in watch mode
pnpm test --watch
```

### Debug in VS Code

Add to `.vscode/launch.json`:
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

### Verbose Output

```bash
pnpm test --reporter=verbose
```

## Regression Testing

### When to Add Regression Tests

**Always** add tests when:
- Fixing a bug (test should fail before fix, pass after)
- Modifying cache logic
- Changing API routes
- Updating entity models
- Refactoring critical features

### Regression Test Example

```typescript
// Bug: AI summary not saved to Notion after generation
test('should persist AI summary to Notion database', async () => {
  const postId = '123';
  const mockSummary = 'This is a test summary.';

  // Generate summary
  await generateSummary(postId);

  // Verify Notion update was called
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

## Test Maintenance

### Keeping Tests Green

- **Fix failing tests immediately**: Don't accumulate technical debt
- **Update tests with code changes**: Tests should evolve with implementation
- **Remove obsolete tests**: Delete tests for removed features
- **Refactor brittle tests**: If tests break often, improve test design

### Flaky Tests

If a test fails intermittently:
1. **Identify root cause**: Race condition, async timing, external dependency
2. **Fix properly**: Don't add `sleep()` or `retry()` logic
3. **Use proper async utilities**: `waitFor`, `findBy*` queries
4. **Skip if unfixable**: Mark with `test.skip()` and file issue

## Summary

**Quick Reference**:

- **Framework**: Vitest + jsdom + MSW + Testing Library
- **Location**: `src/__test__/` organized by layer
- **Naming**: `<name>.test.ts` or `<name>.test.tsx`
- **Priority**: Entities > API routes > Features > UI components
- **Mocking**: MSW for external APIs
- **Deep tests**: `pnpm test:deep` for real API validation
- **Coverage**: 70-80% for critical code, don't aim for 100%
- **Regression**: Always add tests when fixing bugs

Good tests provide confidence, documentation, and fast feedback for sustainable development.
