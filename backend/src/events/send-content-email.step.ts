import type { Handlers } from 'motia';
import { z } from 'zod';
import { notificationService } from '../services/notifications/index';
import { contentRepository } from '../repositories/content/index';

const inputSchema = z.object({
  contentId: z.string(),
  briefId: z.string(),
  email: z.string().email().optional(),
});

type Input = z.infer<typeof inputSchema>;

export const config = {
  name: 'SendContentEmail',
  type: 'event',
  description: 'Sends email notification with final content outputs',
  subscribes: ['send-content-email'],
  emits: [],
  input: inputSchema,
  flows: ['content-creation-flow'],
};

export const handler: Handlers['SendContentEmail'] = async (input: Input, { logger }) => {
  try {
    const { contentId, email } = input;

    if (!email) {
      logger.warn('No email provided, skipping email notification', { contentId });
      return;
    }

    logger.info('Sending content email', { contentId, email });

    // Get content from repository
    const content = await contentRepository.getContent(contentId);

    if (!content) {
      logger.error('Content not found', { contentId });
      throw new Error(`Content with id ${contentId} not found`);
    }

    // Send email with content
    await notificationService.sendContentEmail(email, content);

    logger.info('Content email sent successfully', { contentId, email });
  } catch (error) {
    logger.error('Failed to send content email', {
      contentId: input.contentId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

