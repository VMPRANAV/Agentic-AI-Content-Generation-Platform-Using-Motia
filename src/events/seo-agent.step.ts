import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';

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

export const config: EventConfig = {
  name: 'SEOAgent',
  type: 'event',
  description: 'SEO agent that optimizes content for keywords',
  subscribes: ['content-draft-completed'],
  emits: ['seo-optimization-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler: Handlers['SEOAgent'] = async (input, { emit, logger, state }) => {
  try {
    const { briefId, draft } = input;

    logger.info('SEO agent started', { briefId });

    // Get brief data from state to get topic
    const briefData = await state.get(`content-${briefId}`, 'brief');
    const topic = briefData?.topic || '';

    // Optimize for SEO
    const seoData = await agentService.optimizeSEO(briefId, draft.draft, topic);

    // Store SEO data in state
    await state.set(`content-${briefId}`, 'seo', seoData);

    logger.info('SEO optimization completed', { briefId, score: seoData.score });

    // Emit SEO completed event
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

