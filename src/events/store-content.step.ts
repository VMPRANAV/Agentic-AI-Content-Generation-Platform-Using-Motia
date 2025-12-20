import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { contentRepository } from '../repositories/content/index';
import type { FinalContent } from '../types/content';

const inputSchema = z.object({
  briefId: z.string(),
  social: z.object({
    briefId: z.string(),
    twitter: z.object({
      text: z.string(),
      hashtags: z.array(z.string()),
      characterCount: z.number(),
    }),
    linkedin: z.object({
      text: z.string(),
      hashtags: z.array(z.string()),
      characterCount: z.number(),
    }),
    completedAt: z.string(),
  }),
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
  name: 'StoreContent',
  type: 'event',
  description: 'Stores final content in database after all agents complete',
  subscribes: ['social-versions-completed'],
  emits: ['content-stored'],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler: Handlers['StoreContent'] = async (
  input: z.infer<typeof inputSchema>, 
  { emit, logger, state }: any
) => {
  try {
    const { briefId, social, edited, seo, draft } = input;
    logger.info('Storing content', { briefId });

    // 1. Retrieve the original Brief and Research data from State
    // (We need these to construct the full FinalContent object)
    const brief = await state.get(`content-${briefId}`, 'brief');
    const research = await state.get(`content-${briefId}`, 'research');

    if (!brief) throw new Error(`Brief data not found for ${briefId}`);
    if (!research) logger.warn(`Research data missing for ${briefId}, proceeding without it.`);

    // 2. Construct the FinalContent object
    const finalContent: FinalContent = {
      id: `content-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      briefId,
      topic: brief.topic,
      format: brief.format,
      audience: brief.audience,
      research: research || { keyFindings: [], sources: [], statistics: {}, completedAt: new Date().toISOString() },
      draft,
      seo,
      edited,
      social,
      createdAt: brief.createdAt,
      updatedAt: new Date().toISOString(),
      status: 'ready',
    };

    // 3. Save to Repository
    await contentRepository.saveContent(finalContent);

    logger.info('Content saved to repository', { briefId, contentId: finalContent.id });

    // 4. Emit completed event
    await emit({
      topic: 'content-stored',
      data: finalContent,
    });

  } catch (error) {
    logger.error('Failed to store content', {
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};