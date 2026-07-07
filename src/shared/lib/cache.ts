import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_CONFIG } from "../config";

// React.cache 는 Next 서버 런타임(vendored React)에서만 제공된다.
// npm 의 react 18.3.1 클라이언트 빌드에는 없으므로 vitest 등에서는 identity 로 폴백한다.
const requestMemo: typeof cache =
  typeof cache === "function" ? cache : (((fn: unknown) => fn) as typeof cache);

// 바깥 requestMemo: 한 번의 렌더링(요청) 안에서 같은 인자의 중복 호출을 1회로 합친다.
// 안쪽 unstable_cache: 렌더링 간에 결과를 revalidate 주기 동안 영속 캐시한다.
export const nextServerCache = <
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  fn: T,
  cacheKeys: string[],
  options?: {
    revalidate?: number | false;
    tags?: string[];
  },
) => {
  return requestMemo(
    unstable_cache<T>(fn, cacheKeys, {
      revalidate: CACHE_CONFIG.ISR_REVALIDATE_TIME,
      ...options,
    }),
  );
};
