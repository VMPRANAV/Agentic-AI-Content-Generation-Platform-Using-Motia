import nodemailer from 'nodemailer';
import type { FinalContent } from '../../types/content';

// Initialize the transporter (using environment variables for security)
// This creates a reusable connection pool
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.sendgrid.net or smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendContentEmail(
  email: string,
  content: FinalContent
): Promise<void> {
  try {
    const subject = `Your Content is Ready: ${content.topic}`;
    
    // Construct HTML body for a professional look
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Hi there,</h2>
        <p>Your AI-generated content for <strong>"${content.topic}"</strong> is ready!</p>
        
        <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Content Format:</strong> ${content.format}</p>
          <p><strong>Target Audience:</strong> ${content.audience}</p>
        </div>

        <h3>Here's a summary of what was created:</h3>
        <ul>
          <li><strong>Research:</strong> ${content.research.keyFindings.length} key findings</li>
          <li><strong>Draft:</strong> ${content.draft.wordCount} words</li>
          <li><strong>SEO Score:</strong> ${content.seo.score}/100</li>
          <li><strong>Editing Quality:</strong> ${content.edited.qualityScore}/100</li>
          <li><strong>Social:</strong> Twitter and LinkedIn posts included</li>
        </ul>

        <p style="margin-top: 30px;">
          <a href="${process.env.DASHBOARD_URL}/content/${content.topic}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
             View Content Dashboard
          </a>
        </p>
        
        <hr style="margin-top: 30px; border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px;">Best regards,<br/>Content Creation Platform</p>
      </div>
    `;

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Content Platform" <no-reply@yourdomain.com>',
      to: email,
      subject: subject,
      html: htmlBody,
      // Plain text fallback for clients that don't support HTML
      text: `Your content for "${content.topic}" is ready. Login to your dashboard to view the full details.`, 
    });

    console.log(`Email sent successfully to ${email}. Message ID: ${info.messageId}`);

  } catch (error) {
    console.error('Failed to send content email:', error);
    // Depending on your logic, you might want to re-throw this to handle it in the controller
    throw new Error('Email delivery failed');
  }
}