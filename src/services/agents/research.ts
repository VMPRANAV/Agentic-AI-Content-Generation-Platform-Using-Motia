// src/services/agents/research.ts
import { TavilySearch} from "@langchain/tavily";
import { getVectorStore } from '../rag/vector-store';
import { createGroqLLM } from './llm-factory';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function performResearch(briefId: string, topic: string, audience: string) {
  const llm = createGroqLLM(0.2);
  const vectorStore = await getVectorStore();
  const searchTool = new TavilySearch({ maxResults: 3 });

  console.log(`🕵️ [Research] Starting Hybrid Search for: ${topic}`);

  // 1. Check Internal DB (RAG)
  // Note: This now compares vectors generated locally by Sentence Transformers
  const internalDocs = await vectorStore.similaritySearch(topic, 3);
  
  let contextData = "";
  let sourceOrigin = "Internal Database";

  if (internalDocs.length > 0) {
    contextData = internalDocs.map(d => d.pageContent).join("\n\n");
    console.log("✅ Found internal knowledge.");
  } else {
    // 2. Fallback to Web Search
    console.log("🌐 Internal docs empty. Switching to Web Search...");
    const searchResult = await searchTool.invoke({ query: `${topic} facts statistics` });
    contextData = searchResult;
    sourceOrigin = "Web Search";
  }

  // 3. Synthesize with LLM
  const prompt = `Analyze this data for an audience of "${audience}".
  SOURCE DATA (${sourceOrigin}): 
  ${contextData}
  
  Return a summary with 3 key findings and 2 statistics. Return raw JSON.`;

  const result = await llm.invoke([new HumanMessage(prompt)]);

  // Parse the JSON response from LLM
  let parsedData;
  try {
    parsedData = JSON.parse(result.content as string);
  } catch (error) {
    console.error("Failed to parse LLM response as JSON:", error);
    parsedData = { error: "Failed to parse response" };
  }

  return {
    briefId,
    sources: [{ title: sourceOrigin, url: "internal/web", summary: "Data retrieved successfully" }],
    research: parsedData
  };
}