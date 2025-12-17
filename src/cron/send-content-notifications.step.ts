import type { CronConfig, Handlers } from 'motia';
import { contentRepository } from '../repositories/content/index';

export const config: CronConfig = {
  name: 'SendContentNotifications',
  type: 'cron',
  description: 'Sends email notifications for completed content (runs daily at 9 AM)',
  cron: '0 9 * * *', // Daily at 9 AM
  emits: ['send-content-email'],
  flows: ['content-creation-flow'],
};

export const handler: Handlers['SendContentNotifications'] = async ({ emit, logger }) => {
  try {
    logger.info('Cron job started: Checking for completed content to notify');

    // Get all completed content
    const completedContent = await contentRepository.getAllCompletedContent();

    logger.info('Found completed content', { count: completedContent.length });

    // Emit email events for each completed content
    // In production, you would get the user's email from the brief or user database
    for (const content of completedContent) {
      // TODO: Get user email from brief or user database
      const userEmail = process.env.DEFAULT_NOTIFICATION_EMAIL || 'user@example.com';

      await emit({
        topic: 'send-content-email',
        data: {
          contentId: content.id,
          briefId: content.briefId,
          email: userEmail,
        },
      });

      logger.info('Emitted email notification event', {
        contentId: content.id,
        email: userEmail,
      });
    }

    logger.info('Cron job completed', { notificationsSent: completedContent.length });
  } catch (error) {
    logger.error('Cron job failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};

