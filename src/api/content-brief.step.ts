import type { ApiRouteConfig, Handlers } from 'motia';
import { z } from 'zod';
import { contentService } from '../services/content/index';

const bodySchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  format: z.enum(['article', 'blog-post', 'social-media', 'email', 'whitepaper']),
  audience: z.string().min(1, 'Audience is required'),
  additionalRequirements: z.string().optional(),
});

export const config: ApiRouteConfig = {
  name: 'ContentBrief',
  type: 'api',
  path: '/api/content-brief',
  method: 'POST',
  description: 'Submit a content brief to trigger AI-powered content creation',
  emits: ['content-brief-created'],
  flows: ['content-creation-flow'],
  bodySchema,
  responseSchema: {
    201: z.object({
      briefId: z.string(),
      status: z.string(),
      message: z.string(),
    }),
    400: z.object({
      error: z.string(),
    }),
    500: z.object({
      error: z.string(),
    }),
  },
};

export const handler = async (req: any, { emit, logger, state }: any) => {
  try {
    const bodyResult = bodySchema.safeParse(req.body);

    if (!bodyResult.success) {
      logger.warn('Content brief validation failed', { error: bodyResult.error.issues });
      return {
        status: 400,
        body: {
          error: 'Validation failed',
        },
      };
    }

    const { topic, format, audience, additionalRequirements } = bodyResult.data;

    logger.info('Content brief submitted', { topic, format, audience });

    // Create brief using service
    const brief = await contentService.createBrief({
      topic,
      format,
      audience,
      additionalRequirements,
    });

    // Store brief in state for agents to access
    await state.set(`content-${brief.id}`, 'brief', brief);

    // Emit event to trigger all AI agents in parallel
    await emit({
      topic: 'content-brief-created',
      data: {
        briefId: brief.id,
        topic: brief.topic,
        format: brief.format,
        audience: brief.audience,
        additionalRequirements: brief.additionalRequirements,
        createdAt: brief.createdAt,
      },
    });

    logger.info('Content brief created and event emitted', { briefId: brief.id });

    return {
      status: 201,
      body: {
        briefId: brief.id,
        status: brief.status,
        message: 'Content brief submitted successfully. AI agents are processing your request.',
      },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Content brief validation failed', { error: error.issues });
      return {
        status: 400,
        body: {
          error: 'Validation failed',
        },
      };
    }

    logger.error('Content brief creation failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return {
      status: 500,
      body: {
        error: 'Failed to create content brief',
      },
    };
  }
};