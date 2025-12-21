import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';

// Define the shape of your research data (must match research-agent.step.ts)
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
  name: 'ResearchResultsListener',
  type: 'event',
  description: 'Consumes research-completed payload',
  subscribes: ['research-completed'],
  emits: [],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler = async (
  input: z.infer<typeof inputSchema>,
  context: { logger: { info: (msg: string, data?: any) => void } }
) => {
  context.logger.info('Research results received', { briefId: input.briefId });
  // no-op or add processing here
};