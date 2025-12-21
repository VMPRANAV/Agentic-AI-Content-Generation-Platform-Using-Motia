import type { ContentBrief } from '../../types/content';
// 1. Import the repository
import { contentRepository } from '../../repositories/content/index'; 

export async function createBrief(data: {
  topic: string;
  format: ContentBrief['format'];
  audience: string;
  additionalRequirements?: string;
}): Promise<ContentBrief> {
  
  // Create the object (as before)
  const brief: ContentBrief = {
    id: `brief-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    topic: data.topic,
    format: data.format,
    audience: data.audience,
    additionalRequirements: data.additionalRequirements,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  // 2. ✅ CRITICAL FIX: Save it to the database!
  await contentRepository.saveBrief(brief);

  return brief;
}