import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';
// import type { ContentBrief } from '../types/content'; // Uncomment if file exists

const inputSchema = z.object({
  briefId: z.string(),
  draft: z.object({
    briefId: z.string(),
    outline: z.array(z.string()),
    draft: z.string(),
    wordCount: z.number(),
    completedAt: z.string(),
  }),
});

type SEOAgentInput = z.infer<typeof inputSchema>;

export const config: EventConfig = {
  name: 'SEOAgent',
  type: 'event',
  description: 'SEO agent that optimizes content for keywords',
  subscribes: ['content-draft-completed'],
  emits: ['seo-optimization-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

// FIX: We manually define the type for 'context' here 👇
// This guarantees the 'implicit any' error disappears.
export const handler = async (
  input: SEOAgentInput, 
  context: { 
    emit: (event: any) => Promise<void>; 
    logger: { info: Function; error: Function; warn: Function }; 
    state: { get: Function; set: Function } 
  }
) => {
  const { emit, logger, state } = context;

  try {
    const { briefId, draft } = input;

    logger.info('SEO agent started', { briefId });

    // We cast this safely because we trust the state has the brief
    const briefData = await state.get(`content-${briefId}`, 'brief') as { topic: string };
    
    if (!briefData) throw new Error("Brief data missing from state");

    const seoData = await agentService.optimizeSEO(briefId, draft.draft, briefData.topic);

    await state.set(`content-${briefId}`, 'seo', seoData);

    logger.info('SEO optimization completed', { briefId, score: seoData.score });

    await emit({
      topic: 'seo-optimization-completed',
      data: {
        briefId,
        seo: seoData,
        draft,
      },
    });
  } catch (error) {
    logger.error('SEO agent failed', {
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};