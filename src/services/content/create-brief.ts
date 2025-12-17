import type { ContentBrief } from '../../types/content';

export async function createBrief(data: {
  topic: string;
  format: ContentBrief['format'];
  audience: string;
  additionalRequirements?: string;
}): Promise<ContentBrief> {
  const brief: ContentBrief = {
    id: `brief-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    topic: data.topic,
    format: data.format,
    audience: data.audience,
    additionalRequirements: data.additionalRequirements,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  return brief;
}

