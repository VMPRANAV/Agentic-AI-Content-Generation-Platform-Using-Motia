// src/services/agents/seo.ts
import { z } from "zod";
import { createGroqLLM } from './llm-factory';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { SEOData } from '../../types/content';

const seoSchema = z.object({
  keywords: z.array(z.string()),
  keywordDensity: z.record(z.string(), z.number()),
  metaTitle: z.string(),
  metaDescription: z.string(),
  suggestions: z.array(z.string()),
  score: z.number(),
});

export async function optimizeSEO(briefId: string, content: string, topic: string): Promise<SEOData> {
  const llm = createGroqLLM(0); // 0 Temp for analytical precision
  const structuredLlm = llm.withStructuredOutput(seoSchema);

  console.log(`🔍 [SEO] Analyzing content...`);

  const result = await structuredLlm.invoke([
    new SystemMessage(`You are an SEO Expert. Optimize the provided content for the topic: "${topic}".`),
    new HumanMessage(`
      CONTENT START:
      ${content.substring(0, 8000)}... (truncated)
      CONTENT END
      
      Tasks:
      1. Identify top 5 keywords.
      2. Calculate keyword density (approx).
      3. Write a clickable Meta Title (max 60 chars).
      4. Write a compelling Meta Description (max 160 chars).
      5. Provide 3 actionable improvements.
      6. Rate the SEO score (0-100).
    `)
  ]);

  return {
    briefId,
    ...result,
    completedAt: new Date().toISOString(),
  };
}