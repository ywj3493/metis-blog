export const CACHE_CONFIG = {
  // ISR 설정, dev 30초, prod 5분
  ISR_REVALIDATE_TIME: process.env.NODE_ENV === "development" ? 30 : 300,

  get MEMORY_CACHE_TTL() {
    return this.ISR_REVALIDATE_TIME * 1000; // 밀리초로 변환
  },
} as const;

export const SUMMARY_MODEL_CONFIG = {
	model: process.env.NODE_ENV === "development" ? "gemma3:1b" : "gpt-4o-mini",
	temperature: 0.2,
	max_tokens: 50,
	top_p: 0.9,
} as const;
