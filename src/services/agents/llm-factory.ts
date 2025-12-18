import { ChatGroq } from "@langchain/groq";

export const createGroqLLM = (temperature = 0) => {
  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature,            // OK: top-level ChatModel param
    maxTokens: 1024,        // use `maxTokens`, not `max_completion_tokens`
    topP: 1,                // use `topP`, not `top_p`
    streaming: true,        // use `streaming`, not `stream`
    stop: null,             // usually omit this; `stop` is optional
  });
};
