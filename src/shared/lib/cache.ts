import { unstable_cache } from "next/cache";
import { CACHE_CONFIG } from "../config";

export const nextServerCache = <
  T extends (...args: unknown[]) => Promise<unknown>,
>(
  fn: T,
  cacheKeys: string[],
) => {
  return unstable_cache<T>(fn, cacheKeys, {
    revalidate: CACHE_CONFIG.ISR_REVALIDATE_TIME,
  });
};
