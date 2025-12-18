import type { EventConfig } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';

const inputSchema = z.object({
  briefId: z.string(),
  topic: z.string(),
  format: z.string(),
  audience: z.string(),
  additionalRequirements: z.string().optional(),
  createdAt: z.string(),
});

type ContentWriterInput = z.infer<typeof inputSchema>;

export const config: EventConfig = {
  name: 'ContentWriterAgent',
  type: 'event',
  description: 'Content writer agent that generates outline and draft content',
  subscribes: ['content-brief-created'],
  emits: ['content-draft-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler = async (
  input: ContentWriterInput, 
  context: { 
    emit: (event: any) => Promise<void>; 
    logger: { info: Function; error: Function; warn: Function }; 
    state: { get: Function; set: Function } 
  }
) => {
  const { emit, logger, state } = context;

  try {
    const { briefId, topic, format, audience } = input;

    logger.info('Content writer agent started', { briefId, topic });

    // Get research data from state if available
    const researchData = await state.get(`content-${briefId}`, 'research');

    // Generate content draft
    const draft = await agentService.generateContent(briefId, topic, format, audience, researchData);

    // Store draft in state
    await state.set(`content-${briefId}`, 'draft', draft);

    logger.info('Content draft completed', { briefId, wordCount: draft.wordCount });

    // Emit draft completed event
    await emit({
      topic: 'content-draft-completed',
      data: {
        briefId,
        draft,
      },
    });
  } catch (error) {
    logger.error('Content writer agent failed', {
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};