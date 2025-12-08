# Site 도메인 요구사항

이 문서는 Site 도메인의 기능 요구사항을 정의합니다. Site 도메인은 테마 관리, 프로필 표시, 소개 페이지, 연락처 정보, SEO 최적화, 분석 통합을 포함합니다.

## 개요

Site 도메인은 전체 블로그 경험에 영향을 미치는 횡단 관심사(cross-cutting concerns)를 처리합니다. 기능 특화 도메인(Posts, Guestbook)과 달리, 이 도메인은 전역 UI 요소, 사용자 환경설정, 검색 가능성과 성능을 향상시키는 기술적 최적화를 관리합니다.

## 기능 요구사항

### FR-SITE-001: 테마 시스템

**설명**: 자동 감지 및 수동 토글을 통한 라이트/다크 테마를 지원합니다.

**수용 기준**:
- 첫 방문 시 시스템 테마 환경설정 감지
- 헤더에 접근 가능한 테마 토글 컨트롤 제공
- 테마 선택을 브라우저 저장소에 영속
- 테마 간 부드러운 전환 적용 (깜빡임 없음)
- 모든 UI 요소가 테마를 인식하도록 보장

**테마 상태**:
| 상태 | 트리거 | 영속성 |
|-----|--------|--------|
| 시스템 기본값 | 첫 방문 | 없음 |
| 라이트 | 사용자 선택 | localStorage |
| 다크 | 사용자 선택 | localStorage |

**기술 구현**:
- 라이브러리: `next-themes`
- 프로바이더: 루트 레이아웃의 `ThemeProvider`
- 토글: 헤더의 `ThemeToggle` 컴포넌트
- CSS: Tailwind `dark:` 수정자

**관련 컴포넌트**:
- `src/entities/theme/hooks/theme-provider.tsx`
- `src/entities/theme/ui/theme-toggle.tsx`

---

### FR-SITE-002: 프로필/히어로 섹션

**설명**: 홈페이지에 블로그 소유자 소개를 표시합니다.

**수용 기준**:
- 프로필 이미지(마스코트) 표시
- 인사말 메시지 표시
- 간략한 블로그 설명 포함
- GitHub 저장소 링크 제공
- 모든 화면 크기에 대응하는 반응형 레이아웃

**콘텐츠**:
| 요소 | 내용 |
|-----|------|
| 이미지 | `/mascot.png` (240x240) |
| 인사말 | "안녕하세요. 메티입니다." |
| 설명 | 블로그 목적 설명 |
| CTA | GitHub 저장소 링크 |

**관련 컴포넌트**:
- `src/features/profile/ui/hero.tsx`

---

### FR-SITE-003: 소개 페이지

**설명**: Notion의 풍부한 콘텐츠로 블로그 소유자에 대한 상세 정보를 제공합니다.

**수용 기준**:
- 전체 Notion 페이지 콘텐츠 렌더링
- 모든 서식 유지 (텍스트, 이미지, 코드 블록)
- 연락처 정보 표시
- Notion 소스와 콘텐츠 동기화 유지
- 성능을 위한 ISR 캐싱 적용

**데이터 소스**:
- `NOTION_ABOUT_PAGE_ID`를 통한 Notion 페이지
- 풍부한 렌더링을 위한 비공식 Notion 클라이언트

**관련 컴포넌트**:
- `src/app/about/page.tsx`
- `src/entities/notion/model/index.ts` (`getNotionAboutPage`)

---

### FR-SITE-004: 연락처 표시

**설명**: 방문자가 블로그 소유자에게 연락할 수 있도록 연락처 정보와 소셜 링크를 표시합니다.

**수용 기준**:
- 이메일 주소 표시
- 소셜 미디어 링크 표시 (GitHub 등)
- 접근 가능하고 명확하게 보이는 위치
- 링크는 새 탭에서 열림

**연락 방법**:
| 방법 | 위치 | 링크 |
|-----|-----|------|
| GitHub | 헤더, 히어로 | https://github.com/ywj3493 |
| 저장소 | 히어로 | https://github.com/ywj3493/metis-blog |

**관련 컴포넌트**:
- `src/features/profile/ui/contact.tsx`

---

### FR-SITE-005: SEO 최적화

**설명**: 검색 엔진 검색 가능성을 위해 블로그를 최적화합니다.

**수용 기준**:
- 각 페이지에 고유한 메타 태그 생성
- 소셜 공유를 위한 Open Graph 태그 제공
- 모든 게시된 포스트가 포함된 동적 사이트맵 생성
- 블로그 포스트용 구조화된 데이터(JSON-LD) 제출
- Google Search Console 인증 구성

**메타 태그 설정**:
| 페이지 | 제목 | 설명 |
|-------|------|-----|
| 홈 | "Meti's Blog" | 블로그 소개 |
| 포스트 | "Posts - Meti's Blog" | 모든 블로그 포스트 |
| 포스트 상세 | "{Post Title} - Meti's Blog" | 포스트 AI 요약 또는 발췌 |
| 소개 | "About - Meti's Blog" | 소개 페이지 설명 |
| 방명록 | "Guestbook - Meti's Blog" | 방명록 설명 |

**사이트맵 구조**:
- 홈페이지 (우선순위: 1.0)
- 소개 페이지 (우선순위: 0.8)
- 포스트 목록 페이지 (우선순위: 0.8)
- 방명록 페이지 (우선순위: 0.8)
- 개별 포스트 페이지 (우선순위: 0.8)

**관련 컴포넌트**:
- `src/app/api/sitemap/route.ts`
- 페이지 레벨 `generateMetadata` 내보내기

---

### FR-SITE-006: 분석 통합

**설명**: 사이트 성능과 방문자 행동을 추적합니다.

**수용 기준**:
- 트래픽 추적을 위한 Vercel Analytics 통합
- Core Web Vitals를 위한 Speed Insights 활성화
- 개인정보 친화적 (침해적 추적 없음)
- 최소한의 성능 영향

**분석 설정**:
| 서비스 | 목적 | 컴포넌트 |
|-------|-----|---------|
| Vercel Analytics | 페이지 뷰, 리퍼러 | `@vercel/analytics` |
| Speed Insights | Core Web Vitals | `@vercel/speed-insights` |
| Google Analytics | 확장 추적 (선택) | `NEXT_PUBLIC_GA_ID` |

**관련 컴포넌트**:
- `src/app/layout.tsx` (분석 프로바이더)

---

## 데이터 모델

### 테마 설정

```typescript
// ThemeProvider 설정
type ThemeProviderProps = {
  attribute: "class";          // CSS 클래스를 통해 테마 적용
  defaultTheme: "system";      // 시스템 환경설정 존중
  enableSystem: true;          // 시스템 테마 감지 허용
  disableTransitionOnChange: false; // 부드러운 전환 활성화
};
```

### 사이트맵 항목

```typescript
type SitemapEntry = {
  url: string;              // 전체 URL
  lastModified: Date;       // 마지막 수정 날짜
  changeFrequency: ChangeFrequency; // 업데이트 빈도 힌트
  priority: number;         // 크롤링 우선순위 (0.0 - 1.0)
};

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";
```

---

## 비기능 요구사항

### NFR-SITE-001: 성능

- 모든 메트릭에서 Lighthouse 점수 > 90
- First Contentful Paint < 1.5초
- 테마 전환이 레이아웃 시프트를 유발하지 않음
- 분석 스크립트가 렌더링을 차단하지 않음

### NFR-SITE-002: 접근성

- 테마 토글은 키보드로 접근 가능
- 양쪽 테마에서 충분한 색상 대비 (WCAG AA)
- 대화형 요소에 ARIA 레이블
- 시맨틱 HTML 구조

### NFR-SITE-003: SEO 성능

- 모든 페이지가 게시 후 7일 이내 색인됨
- 사이트맵이 새 포스트로 자동 업데이트
- 소셜 플랫폼에서 Open Graph 이미지가 올바르게 표시
- 중복 콘텐츠 문제 없음

### NFR-SITE-004: 개인정보

- 개인 식별 정보 수집 없음
- 분석이 Do Not Track 환경설정 존중
- 제3자 광고 트래커 없음
- 쿠키 동의 불필요 (추적 쿠키 없음)

---

## 의존성

### 외부 라이브러리

| 라이브러리 | 목적 | 버전 |
|----------|-----|------|
| `next-themes` | 테마 관리 | ^0.2.1 |
| `@vercel/analytics` | 트래픽 분석 | ^1.0.0 |
| `@vercel/speed-insights` | 성능 메트릭 | ^1.0.0 |

### 환경 변수

| 변수 | 목적 | 필수 |
|-----|-----|------|
| `NOTION_ABOUT_PAGE_ID` | 소개 페이지 콘텐츠 | 예 |
| `BLOG_URL` | 사이트맵용 기본 URL | 예 |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | 아니오 |

---

## 범위 외

- 사용자 인증
- 개인화된 콘텐츠
- 다국어 지원 (i18n)
- 쿠키 동의 배너
- 뉴스레터 구독
- 소셜 미디어 자동 게시
- 관리자 대시보드
