/**
 * Shared TypeScript types for the Content Creation Platform
 */

export interface ContentBrief {
  id: string;
  topic: string;
  format: 'article' | 'blog-post' | 'social-media' | 'email' | 'whitepaper';
  audience: string;
  additionalRequirements?: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface ResearchData {
  briefId: string;
  sources: Array<{
    url: string;
    title: string;
    summary: string;
  }>;
  keyFindings: string[];
  statistics: Record<string, any>;
  completedAt: string;
}

export interface ContentDraft {
  briefId: string;
  outline: string[];
  draft: string;
  wordCount: number;
  completedAt: string;
}

export interface SEOData {
  briefId: string;
  keywords: string[];
  keywordDensity: Record<string, number>;
  metaTitle: string;
  metaDescription: string;
  suggestions: string[];
  score: number;
  completedAt: string;
}

export interface EditedContent {
  briefId: string;
  content: string;
  factCheckResults: Array<{
    claim: string;
    verified: boolean;
    source?: string;
  }>;
  improvements: string[];
  qualityScore: number;
  completedAt: string;
}

export interface SocialVersions {
  briefId: string;
  twitter: {
    text: string;
    hashtags: string[];
    characterCount: number;
  };
  linkedin: {
    text: string;
    hashtags: string[];
    characterCount: number;
  };
  completedAt: string;
}

export interface AgentOutput {
  briefId: string;
  research?: ResearchData;
  draft?: ContentDraft;
  seo?: SEOData;
  edited?: EditedContent;
  social?: SocialVersions;
}

export interface FinalContent {
  id: string;
  briefId: string;
  topic: string;
  format: string;
  audience: string;
  research: ResearchData;
  draft: ContentDraft;
  seo: SEOData;
  edited: EditedContent;
  social: SocialVersions;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'ready' | 'published';
}

