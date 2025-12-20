import type { CronConfig, Handlers } from 'motia';
import { contentRepository } from '../repositories/content/index';
// Import the service you created in the previous step
import { notificationService } from '../services/notifications/index';

export const config: CronConfig = {
  name: 'SendContentNotifications',
  type: 'cron',
  description: 'Sends email notifications for completed content (runs daily at 9 AM)',
  cron: '0 9 * * *', 
  // We are calling the service directly, so we can remove 'emits' unless you have other listeners
  emits: [], 
  flows: ['content-creation-flow'],
};

export const handler: Handlers['SendContentNotifications'] = async ({ logger }) => {
  try {
    logger.info('Cron job started: Checking for completed content to notify');

    // 1. Get all completed content
    // Ensure your repository returns items matching the 'FinalContent' type
    const completedContent = await contentRepository.getAllCompletedContent();

    if (!completedContent || completedContent.length === 0) {
      logger.info('No completed content found pending notification.');
      return;
    }

    logger.info(`Found ${completedContent.length} completed content items.`);

    const results = { success: 0, failed: 0 };

    // 2. Process each content item
    for (const content of completedContent) {
      try {
        // Resolve the email address
        // ideally: const userEmail = await userRepository.getEmailByBriefId(content.briefId);
        const userEmail = process.env.DEFAULT_NOTIFICATION_EMAIL || 'user@example.com';

        // 3. Call the Email Service directly
        logger.info(`Sending email for content: ${content.topic} to ${userEmail}`);
        
        await notificationService.sendContentEmail(userEmail, content);

        // Optional: Mark content as 'notified' in DB to prevent duplicate emails tomorrow
        // await contentRepository.markAsNotified(content.id);

        results.success++;
        logger.info('Email sent successfully', { contentId: content.id });

      } catch (innerError) {
        // If one email fails, log it but don't stop the loop
        results.failed++;
        logger.error('Failed to send email for content', {
          contentId: content.id,
          error: innerError instanceof Error ? innerError.message : 'Unknown error',
        });
      }
    }

    logger.info('Cron job completed', results);

  } catch (error) {
    logger.error('Critical Cron job failure', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
};