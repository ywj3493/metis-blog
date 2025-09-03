export const modelConfig = {
  prod: {
    model: "gpt-4o-mini",
    temperature: 0.2,
    max_tokens: 50,
    top_p: 0.9,
  },
  local: {
    model: "gemma3:1b",
    temperature: 0.2,
    max_tokens: 50,
    num_predict: 50,
    top_p: 0.9,
  },
};
