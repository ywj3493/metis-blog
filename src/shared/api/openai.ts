import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!_client) {
    const isDev = process.env.NODE_ENV === "development";
    _client = new OpenAI({
      apiKey: isDev ? "ollama" : process.env.OPENAI_API_KEY,
      baseURL: isDev
        ? `${process.env.LOCAL_AI_ENDPOINT ?? "http://localhost:11434"}/v1`
        : undefined,
    });
  }
  return _client;
}
