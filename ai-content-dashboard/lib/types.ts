// TypeScript interfaces matching the Motia backend structure

export interface ContentBrief {
  id: string
  topic: string
  format: "Article" | "Thread" | "LinkedIn"
  audience?: string
  status: "pending" | "researching" | "ready"
  createdAt?: string
}

export interface ResearchItem {
  finding: string
  source?: string
}

export interface SocialPost {
  twitter?: {
    text: string
    hashtags?: string[]
  }
  linkedin?: {
    text: string
    hashtags?: string[]
  }
}

export interface SEOMetrics {
  score: number
  keywords?: string[]
  readability?: number
}

export interface FinalContent {
  id: string
  briefId: string
  research: ResearchItem[]
  content: string // markdown content
  seo: SEOMetrics
  social: SocialPost
  status: "pending" | "ready"
}

export interface ContentBriefResponse {
  brief: ContentBrief
  content?: FinalContent
}
