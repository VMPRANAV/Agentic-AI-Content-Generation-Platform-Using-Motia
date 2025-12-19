// src/services/agents/research.ts
import { TavilySearchAPIRetriever } from "@langchain/community/retrievers/tavily_search_api";
import { z } from "zod";
import { getVectorStore } from '../rag/vector-store';
import { createGroqLLM } from './llm-factory';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

// Schema to guarantee valid output
const researchSchema = z.object({
  keyFindings: z.array(z.string()),
  statistics: z.record(z.string(), z.string().or(z.number())),
  summary: z.string(),
});

export async function performResearch(briefId: string, topic: string, audience: string) {
  const llm = createGroqLLM(0.2);
  const structuredLlm = llm.withStructuredOutput(researchSchema);
  const searchTool = new TavilySearchAPIRetriever({ k: 3 });

  console.log(`🕵️ [Research] Starting Hybrid Search for: ${topic}`);

  let contextData = "";
  let sourceOrigin = "Internal Database";

  try {
    // WRAPPED IN TRY/CATCH TO PREVENT CRASHES
    const vectorStore = await getVectorStore();
    const internalDocs = await vectorStore.similaritySearch(topic, 3);
    
    if (internalDocs.length > 0) {
      contextData = internalDocs.map((d: { pageContent: any; }) => d.pageContent).join("\n\n");
      console.log("✅ Found internal knowledge.");
    } else {
      throw new Error("No internal docs");
    }
  } catch (error) {
    console.log("🌐 Switching to Web Search (DB empty or offline)...");
    try {
        const docs = await searchTool.invoke(topic); 
        contextData = docs.map(d => d.pageContent).join("\n\n");
        sourceOrigin = "Web Search";
    } catch (e) {
        console.error("Web search failed", e);
        contextData = "No data found.";
    }
  }

  const result = await structuredLlm.invoke([
    new SystemMessage(`You are a Research Analyst. Analyze the data for audience: ${audience}.`),
    new HumanMessage(`Source Data (${sourceOrigin}):\n${contextData}`)
  ]);

  return {
    briefId,
    sources: [{ title: sourceOrigin, url: "internal/web", summary: "Data retrieved" }],
    research: result // Direct object, no JSON.parse needed
  };
}