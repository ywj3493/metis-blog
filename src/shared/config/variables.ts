export const CACHE_CONFIG = {
  // ISR 설정, dev 30초, prod 5분
  ISR_REVALIDATE_TIME: process.env.NODE_ENV === "development" ? 30 : 300,

  get MEMORY_CACHE_TTL() {
    return this.ISR_REVALIDATE_TIME * 1000; // 밀리초로 변환
  },
} as const;
