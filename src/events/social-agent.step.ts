import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';

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

export const config: EventConfig = {
  name: 'SocialAgent',
  type: 'event',
  description: 'Social agent that creates Twitter/LinkedIn versions',
  subscribes: ['editing-completed'],
  emits: ['social-versions-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler: Handlers['SocialAgent'] = async (input, { emit, logger, state }) => {
  try {
    const { briefId, edited } = input;

    logger.info('Social agent started', { briefId });

    // Get brief data for topic
    const briefData = await state.get(`content-${briefId}`, 'brief');
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

