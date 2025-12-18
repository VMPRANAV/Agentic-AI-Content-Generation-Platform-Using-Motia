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

export const handler: Handlers['StoreContent'] = async (input: { briefId: any; social: any; edited: any; seo: any; draft: any; }, { emit, logger, state }: any) => {
  try {
    // ✅ NOW 'input' is defined here!
    // Move your debug fetch here:
    fetch('http://127.0.0.1:7242/ingest/a0c22f0d-c367-45fd-a14f-678e02bba88d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location: 'store-content.step.ts:63',
        message: 'Handler entry with input destructuring',
        data: {
          briefId: input.briefId,
          hasSocial: !!input.social,
          hasEdited: !!input.edited,
          hasSeo: !!input.seo,
          hasDraft: !!input.draft
        },
        timestamp: Date.now(),
        sessionId: 'debug-session',
        hypothesisId: 'H1,H2,H5'
      })
    }).catch(() => {});

    const { briefId, social, edited, seo, draft } = input;
    logger.info('Storing content', { briefId });

    // ... rest of handler code
  } catch (error) {
    logger.error('Failed to store content', {
      briefId: input.briefId,
    });
    throw error;
  }
};
