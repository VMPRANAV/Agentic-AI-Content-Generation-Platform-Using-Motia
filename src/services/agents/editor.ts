// src/services/agents/editor.ts
import { z } from "zod";
import { createGroqLLM } from './llm-factory';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { EditedContent } from '../../types/content';

const editorSchema = z.object({
  refinedContent: z.string().describe("The improved version of the text"),
  factCheckResults: z.array(z.object({
    claim: z.string(),
    verified: z.boolean(),
    source: z.string().optional(),
  })),
  improvements: z.array(z.string()),
  qualityScore: z.number(),
});

export async function editAndFactCheck(briefId: string, content: string, researchData?: any): Promise<EditedContent> {
  const llm = createGroqLLM(0.3); // Low temp for quality control
  const structuredLlm = llm.withStructuredOutput(editorSchema);

  console.log(`📝 [Editor] Polishing content...`);

  // Pass research data so the editor knows what is "true"
  const facts = researchData?.keyFindings ? JSON.stringify(researchData.keyFindings) : "General knowledge";

  const result = await structuredLlm.invoke([
    new SystemMessage(`You are a Senior Editor. Fix grammar, improve flow, and verify facts against the provided research.`),
    new HumanMessage(`
      Verified Facts: ${facts}
      
      Draft Content:
      ${content}
      
      Task:
      1. Rewrite weak sections for clarity.
      2. Flag any claims that contradict the facts.
      3. Give a quality score (0-100).
    `)
  ]);

  return {
    briefId,
    content: result.refinedContent,
    factCheckResults: result.factCheckResults,
    improvements: result.improvements,
    qualityScore: result.qualityScore,
    completedAt: new Date().toISOString(),
  };
}