// src/services/agents/social.ts
import { z } from "zod";
import { createGroqLLM } from './llm-factory';
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { SocialVersions } from '../../types/content';

const socialSchema = z.object({
  twitter: z.object({
    text: z.string(),
    hashtags: z.array(z.string()),
  }),
  linkedin: z.object({
    text: z.string(),
    hashtags: z.array(z.string()),
  }),
});

export async function generateSocialVersions(briefId: string, content: string, topic: string): Promise<SocialVersions> {
  const llm = createGroqLLM(0.7); // High temp for creativity
  const structuredLlm = llm.withStructuredOutput(socialSchema);

  console.log(`📢 [Social] Generating posts...`);

  const result = await structuredLlm.invoke([
    new SystemMessage(`You are a Social Media Manager. Create viral content based on the article provided.`),
    new HumanMessage(`
      Topic: ${topic}
      Article Summary: ${content.substring(0, 1000)}...
      
      Task:
      1. Write a punchy Tweet (under 280 chars) with 2 hashtags.
      2. Write a professional LinkedIn post with bullet points and 3 hashtags.
    `)
  ]);

  return {
    briefId,
    twitter: {
      ...result.twitter,
      characterCount: result.twitter.text.length,
    },
    linkedin: {
      ...result.linkedin,
      characterCount: result.linkedin.text.length,
    },
    completedAt: new Date().toISOString(),
  };
}