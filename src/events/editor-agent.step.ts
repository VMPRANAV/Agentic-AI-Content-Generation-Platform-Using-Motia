import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';

const inputSchema = z.object({
  briefId: z.string(),
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
  name: 'EditorAgent',
  type: 'event',
  description: 'Editor agent that fact-checks and refines content',
  subscribes: ['seo-optimization-completed'],
  emits: ['editing-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler: Handlers['EditorAgent'] = async (input, { emit, logger, state }) => {
  try {
    const { briefId, draft, seo } = input;

    logger.info('Editor agent started', { briefId });

    // Get research data for fact-checking
    const researchData = await state.get(`content-${briefId}`, 'research');

    // Edit and fact-check content
    const editedContent = await agentService.editAndFactCheck(briefId, draft.draft, researchData);

    // Store edited content in state
    await state.set(`content-${briefId}`, 'edited', editedContent);

    logger.info('Editing completed', { briefId, qualityScore: editedContent.qualityScore });

    // Emit editing completed event
    await emit({
      topic: 'editing-completed',
      data: {
        briefId,
        edited: editedContent,
        seo,
        draft,
      },
    });
  } catch (error) {
    logger.error('Editor agent failed', {
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

