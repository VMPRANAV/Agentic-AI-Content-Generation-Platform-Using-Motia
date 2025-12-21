import { EventConfig } from 'motia';
import { z } from 'zod';
import { agentService } from '../services/agents/index';

// Input schema should match content-brief-created event
const inputSchema = z.object({
  briefId: z.string(),
  topic: z.string(),
  format: z.string(),
  audience: z.string(),
  additionalRequirements: z.string().optional(),
  createdAt: z.string(),
});

export const config: EventConfig = {
  name: 'ResearchAgent',
  type: 'event',
  description: 'Performs research when content brief is created',
  subscribes: ['content-brief-created'],
  emits: ['research-completed'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler = async (
  input: z.infer<typeof inputSchema>,
  { emit, logger, state }: any
) => {
  const { briefId, topic, audience } = input;

  try {
    logger.info('Starting research', { briefId, topic });
    
    // Perform the actual research
    const researchResults = await agentService.performResearch(briefId, topic, audience);
    
    // Store research results in state for other agents to access
    await state.set(`content-${briefId}`, 'research', researchResults.research);
    
    // Emit research-completed event
    await emit({
      topic: 'research-completed',
      data: researchResults
    });

    logger.info('Research completed', { briefId });
    
  } catch (error) {
    logger.error('Research failed', { 
      briefId, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
    throw error;
  }
};