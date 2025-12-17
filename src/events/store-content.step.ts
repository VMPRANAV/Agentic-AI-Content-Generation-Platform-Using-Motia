import type { EventConfig, Handlers } from 'motia';
import { z } from 'zod';
import { contentRepository } from '../repositories/content/index';
import type { FinalContent, ResearchData, ContentDraft, SEOData, EditedContent, SocialVersions } from '../types/content';

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

export const handler: Handlers['StoreContent'] = async (input, { emit, logger, state }) => {
  try {
    const { briefId, social, edited, seo, draft } = input;

    logger.info('Storing content', { briefId });

    // Get research data and brief from state
    const researchData = await state.get<ResearchData>(`content-${briefId}`, 'research');
    const briefData = await state.get(`content-${briefId}`, 'brief');

    if (!researchData) {
      throw new Error('Research data not found');
    }

    if (!briefData) {
      throw new Error('Brief data not found');
    }

    // Aggregate all agent outputs into final content
    const finalContent: FinalContent = {
      id: `content-${briefId}-${Date.now()}`,
      briefId,
      topic: briefData.topic,
      format: briefData.format,
      audience: briefData.audience,
      research: researchData,
      draft: draft as ContentDraft,
      seo: seo as SEOData,
      edited: edited as EditedContent,
      social: social as SocialVersions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'ready',
    };

    // Store in database via repository
    await contentRepository.saveContent(finalContent);

    logger.info('Content stored successfully', { contentId: finalContent.id, briefId });

    // Emit content stored event (can trigger email notification)
    await emit({
      topic: 'content-stored',
      data: {
        contentId: finalContent.id,
        briefId,
        status: finalContent.status,
      },
    });
  } catch (error) {
    logger.error('Failed to store content', {
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

