// src/services/agents/writer.ts
import { z } from "zod";
import { createGroqLLM } from './llm-factory'; 
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

// Schema for the expected AI output
const writerSchema = z.object({
  outline: z.array(z.string()).describe("A clear, sequential list of section headers for the content"),
  draft: z.string().describe("The comprehensive content written in Markdown format (using #, ##, etc.)"),
});

export async function generateContent(
  briefId: string,
  topic: string,
  format: string,
  audience: string,
  researchData?: any
) {
  // 1. Initialize Groq LLM
  // Temperature 0.7 gives it enough creativity to write engaging text
  const llm = createGroqLLM(0.7);

  // 2. Bind the schema to the model
  // This forces the model to return a Javascript Object matching 'writerSchema'
  const structuredLlm = llm.withStructuredOutput(writerSchema);

  console.log(`✍️ [Writer] Generating '${format}' about: ${topic}...`);

  // 3. Prepare Context from Research
  const researchContext = researchData?.keyFindings?.length 
    ? `Key Facts to Include:\n${JSON.stringify(researchData.keyFindings, null, 2)}` 
    : "No specific research provided. Use general knowledge.";

  // 4. Invoke the AI
  // We pass the prompt messages directly to .invoke()
  const result = await structuredLlm.invoke([
    new SystemMessage(
      `You are an expert Content Writer.
       Role: Create high-quality, engaging content.
       Format: ${format}
       Audience: ${audience}
       Tone: Professional, informative, and tailored to the audience.
       Objective: Write a comprehensive piece with clear structure.`
    ),
    new HumanMessage(
      `Topic: "${topic}"
      
      ${researchContext}

      Task:
      1. Create a detailed outline.
      2. Write the full content in Markdown.
      3. Ensure the content is substantial (aim for 500+ words).`
    )
  ]);

  // 5. Return structured data
  // 'result' is already typed as { outline: string[], draft: string }
  return {
    briefId,
    outline: result.outline,
    draft: result.draft,
    wordCount: result.draft.split(/\s+/).length, // Simple word count calculation
    completedAt: new Date().toISOString(),
  };
}