import { Pool } from 'pg';
import type { ContentBrief, FinalContent } from '../../types/content';

// Initialize connection pool using the environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export class ContentRepository {
  
  // --- Brief Operations ---

  async saveBrief(brief: ContentBrief): Promise<ContentBrief> {
    const query = `
      INSERT INTO briefs (id, topic, format, audience, additional_requirements, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE 
      SET status = EXCLUDED.status
      RETURNING *;
    `;
    
    const values = [
      brief.id,
      brief.topic,
      brief.format,
      brief.audience,
      brief.additionalRequirements || null,
      brief.status,
      brief.createdAt
    ];

    const { rows } = await pool.query(query, values);
    return this.mapRowToBrief(rows[0]);
  }

  async getBrief(briefId: string): Promise<ContentBrief | null> {
    const query = 'SELECT * FROM briefs WHERE id = $1';
    const { rows } = await pool.query(query, [briefId]);
    return rows.length ? this.mapRowToBrief(rows[0]) : null;
  }

  // --- Content Operations ---

  async saveContent(content: FinalContent): Promise<FinalContent> {
    const query = `
      INSERT INTO content (
        id, brief_id, topic, format, audience, status,
        research_data, draft_data, seo_data, edited_data, social_data,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at,
        edited_data = EXCLUDED.edited_data,
        social_data = EXCLUDED.social_data
      RETURNING *;
    `;

    const values = [
      content.id,
      content.briefId,
      content.topic,
      content.format,
      content.audience,
      content.status,
      JSON.stringify(content.research),
      JSON.stringify(content.draft),
      JSON.stringify(content.seo),
      JSON.stringify(content.edited),
      JSON.stringify(content.social),
      content.createdAt,
      content.updatedAt,
    ];

    const { rows } = await pool.query(query, values);
    return this.mapRowToContent(rows[0]);
  }

  async getContent(contentId: string): Promise<FinalContent | null> {
    const query = 'SELECT * FROM content WHERE id = $1';
    const { rows } = await pool.query(query, [contentId]);
    return rows.length ? this.mapRowToContent(rows[0]) : null;
  }

  async getContentByBriefId(briefId: string): Promise<FinalContent | null> {
    const query = 'SELECT * FROM content WHERE brief_id = $1';
    const { rows } = await pool.query(query, [briefId]);
    return rows.length ? this.mapRowToContent(rows[0]) : null;
  }

  async getAllCompletedContent(): Promise<FinalContent[]> {
    const query = "SELECT * FROM content WHERE status = 'ready' OR status = 'published'";
    const { rows } = await pool.query(query);
    return rows.map(row => this.mapRowToContent(row));
  }

  async updateContentStatus(contentId: string, status: FinalContent['status']): Promise<void> {
    const query = 'UPDATE content SET status = $1, updated_at = NOW() WHERE id = $2';
    await pool.query(query, [status, contentId]);
  }

  // --- Helpers to convert DB Snake_Case to TS CamelCase ---

  private mapRowToBrief(row: any): ContentBrief {
    return {
      id: row.id,
      topic: row.topic,
      format: row.format,
      audience: row.audience,
      additionalRequirements: row.additional_requirements,
      status: row.status,
      createdAt: row.created_at.toISOString(),
    };
  }

  private mapRowToContent(row: any): FinalContent {
    return {
      id: row.id,
      briefId: row.brief_id,
      topic: row.topic,
      format: row.format,
      audience: row.audience,
      status: row.status,
      // Parse JSON columns back to objects
      research: row.research_data,
      draft: row.draft_data,
      seo: row.seo_data,
      edited: row.edited_data,
      social: row.social_data,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    };
  }
}

// Export a singleton instance
export const contentRepository = new ContentRepository();