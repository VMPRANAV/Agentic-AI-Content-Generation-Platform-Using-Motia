import type { ContentBrief, FinalContent } from '../../types/content';

// Temporary in-memory storage for development
const briefs: Map<string, ContentBrief> = new Map();
const contents: Map<string, FinalContent> = new Map();

export class ContentRepository {
  async saveBrief(brief: ContentBrief): Promise<ContentBrief> {
    briefs.set(brief.id, { ...brief });
    return briefs.get(brief.id)!;
  }

  async getBrief(briefId: string): Promise<ContentBrief | null> {
    return briefs.get(briefId) || null;
  }

  async saveContent(content: FinalContent): Promise<FinalContent> {
    contents.set(content.id, { ...content });
    return contents.get(content.id)!;
  }

  async getContent(contentId: string): Promise<FinalContent | null> {
    return contents.get(contentId) || null;
  }

  async getContentByBriefId(briefId: string): Promise<FinalContent | null> {
    const contentArray = Array.from(contents.values());
    for (const content of contentArray) {
      if (content.briefId === briefId) {
        return content;
      }
    }
    return null;
  }

  async getAllCompletedContent(): Promise<FinalContent[]> {
    return Array.from(contents.values()).filter(
      content => content.status === 'ready' || content.status === 'published'
    );
  }

  async updateContentStatus(contentId: string, status: FinalContent['status']): Promise<void> {
    const content = contents.get(contentId);
    if (content) {
      content.status = status;
      contents.set(contentId, content);
    }
  }
}