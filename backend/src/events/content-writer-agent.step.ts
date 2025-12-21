import type { EventConfig } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';

// 1. Update Input Schema to match 'research-completed' event payload
// The Research Agent emits { briefId, sources, research }
const inputSchema = z.object({
  briefId: z.string(),
  research: z.object({
    keyFindings: z.array(z.string()),
    statistics: z.record(z.string(), z.string().or(z.number())),
    summary: z.string(),
  }),
  sources: z.array(z.object({
    title: z.string(),
    url: z.string(),
    summary: z.string(),
  })).optional(),
});

type ContentWriterInput = z.infer<typeof inputSchema>;

export const config: EventConfig = {
  name: 'ContentWriterAgent',
  type: 'event',
  description: 'Content writer agent that generates outline and draft content',
  
  // ✅ FIX: Subscribe to research-completed instead of content-brief-created
  subscribes: ['research-completed'], 
  
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
    const { briefId, research } = input;

    logger.info('Content writer agent started', { briefId });

    // ✅ FIX: Retrieve Brief Data from State
    // Since we no longer get topic/audience from the trigger event, we fetch them from state.
    // These were saved in content-brief.step.ts
    const brief = await state.get(`content-${briefId}`, 'brief');

    if (!brief) {
        throw new Error(`Brief data not found for briefId: ${briefId}`);
    }

    const { topic, format, audience } = brief;
    
    logger.info('Writing content with research data', { topic, researchPoints: research.keyFindings.length });

    // Generate content draft using the research from input
    const draft = await agentService.generateContent(briefId, topic, format, audience, research);

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