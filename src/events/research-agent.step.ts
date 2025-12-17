import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';

// Define the shape of your research data (optional, but recommended)
// This should match what your ResearchAgent actually returns
const researchDataSchema = z.object({
  keyFindings: z.array(z.string()).optional(),
  summary: z.string().optional(),
  sources: z.array(z.string()).optional(),
}).passthrough(); // allows other fields to pass through

const inputSchema = z.object({
  briefId: z.string(),
  research: researchDataSchema,
});

export const config: EventConfig = {
  name: 'ResearchAgent',
  type: 'event',
  description: 'Consumes research-completed payload',
  subscribes: ['research-completed'],
  emits: [],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler = async (
  input: z.infer<typeof inputSchema>,
  { logger }: { logger: any }
) => {
  const { briefId, research } = input;

  logger.info('Research results received', {
    briefId,
    dataSize: JSON.stringify(research).length 
  });

  // Example processing: Accessing the typed data
  if (research.summary) {
     logger.info('Research Summary:', { summary: research.summary });
  }
};