import type { EventConfig } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';
// import type { ContentBrief } from '../types/content'; // Optional: for cleaner casting

const inputSchema = z.object({
  briefId: z.string(),
  edited: z.object({
    briefId: z.string(),
    content: z.string(),
    factCheckResults: z.array(z.object({
      claim: z.string(),
      verified: z.boolean(),
      source: z.string().optional(),
    })),
    improvements: z.array(z.string()),
    qualityScore: z.number(),
    completedAt: z.string(),
  }),
  seo: z.object({
    briefId: z.string(),
    keywords: z.array(z.string()),
    keywordDensity: z.record(z.string(), z.number()),
    metaTitle: z.string(),
    metaDescription: z.string(),
    suggestions: z.array(z.string()),
    score: z.number(),
    completedAt: z.string(),
  }),
  draft: z.object({
    briefId: z.string(),
    outline: z.array(z.string()),
    draft: z.string(),
    wordCount: z.number(),
    completedAt: z.string(),
  }),
});

type SocialAgentInput = z.infer<typeof inputSchema>;

export const config: EventConfig = {
  name: 'SocialAgent',
  type: 'event',
  description: 'Social agent that creates Twitter/LinkedIn versions',
  subscribes: ['editing-completed'],
  emits: ['social-versions-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler = async (
  input: SocialAgentInput, 
  context: { 
    emit: (event: any) => Promise<void>; 
    logger: { info: Function; error: Function; warn: Function }; 
    state: { get: Function; set: Function } 
  }
) => {
  const { emit, logger, state } = context;

  try {
    const { briefId, edited } = input;

    logger.info('Social agent started', { briefId });

    // Cleanly retrieve topic from state
    const briefData = await state.get(`content-${briefId}`, 'brief') as { topic: string };
    const topic = briefData?.topic || '';

    // Generate social media versions
    const socialVersions = await agentService.generateSocialVersions(briefId, edited.content, topic);

    // Store social versions in state
    await state.set(`content-${briefId}`, 'social', socialVersions);

    logger.info('Social versions completed', { briefId });

    // Emit social versions completed event
    await emit({
      topic: 'social-versions-completed',
      data: {
        briefId,
        social: socialVersions,
        edited,
        seo: input.seo,
        draft: input.draft,
      },
    });
  } catch (error) {
    logger.error('Social agent failed', {
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};