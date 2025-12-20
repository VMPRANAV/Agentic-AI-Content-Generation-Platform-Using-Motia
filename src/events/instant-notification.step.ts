import type { EventConfig } from 'motia';
import { z } from 'zod';

// Define the input schema (this matches the output of StoreContent)
const inputSchema = z.object({
  id: z.string(),
  briefId: z.string(),
  topic: z.string(),
  format: z.string(),
  audience: z.string(),
  additionalRequirements: z.string().optional(),
}).passthrough(); // Allows extra fields like 'research', 'seo' to pass through

export const config: EventConfig = {
  name: 'InstantNotificationListener',
  type: 'event',
  description: 'Triggers an email immediately after content is stored',
  subscribes: ['content-stored'],
  emits: ['send-content-email'],
  input: inputSchema as any, // Type assertion for Motia compatibility
  flows: ['content-creation-flow'],
};

// Handler function with proper typing
export const handler = async (
  input: z.infer<typeof inputSchema>, 
  { emit, logger, state }: { 
    emit: (event: any) => Promise<void>; 
    logger: any;
    state?: any;
  }
) => {
  try {
    const { id, briefId, topic } = input;
    
    // Get email from env or use a default
    const userEmail = process.env.DEFAULT_NOTIFICATION_EMAIL || 'user@example.com';

    logger.info('Triggering instant notification', { 
      contentId: id, 
      briefId,
      email: userEmail,
      topic 
    });

    // Emit the event that the existing Email Service listens to
    await emit({
      topic: 'send-content-email',
      data: {
        contentId: id,
        briefId,
        email: userEmail,
        topic, // Include topic for email subject
      },
    });

    logger.info('Notification event emitted successfully', { contentId: id });

  } catch (error) {
    logger.error('Failed to trigger notification', {
      contentId: input.id,
      briefId: input.briefId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    
    // Re-throw to let Motia handle the error
    throw error;
  }
};