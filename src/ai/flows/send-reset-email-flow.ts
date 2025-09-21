
'use server';
/**
 * @fileOverview A flow for sending a password reset email.
 *
 * - sendPasswordResetEmail - A function that handles sending the email.
 * - SendPasswordResetEmailInput - The input type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Resend } from 'resend';
import { PasswordResetEmailTemplate } from '@/components/features/auth/password-reset-email';

const SendPasswordResetEmailInputSchema = z.object({
  email: z.string().email().describe('The email address to send the reset link to.'),
});
export type SendPasswordResetEmailInput = z.infer<typeof SendPasswordResetEmailInputSchema>;


export async function sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void> {
  return sendPasswordResetEmailFlow(input);
}

const sendPasswordResetEmailFlow = ai.defineFlow(
  {
    name: 'sendPasswordResetEmailFlow',
    inputSchema: SendPasswordResetEmailInputSchema,
    outputSchema: z.void(),
  },
  async (input) => {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey || resendApiKey === 'YOUR_RESEND_API_KEY') {
      console.warn('RESEND_API_KEY is not configured. Email will not be sent.');
      // Simulate success for UI testing without a real API key.
      return;
    }
     
    // For development and testing, Resend requires using this 'from' address
    // until a custom domain is verified.
    const fromEmail = 'onboarding@resend.dev';

    const resend = new Resend(resendApiKey);

    // In a real app, you would generate a secure, unique token,
    // store it with an expiration date, and create a link to your password reset page.
    const mockResetToken = 'mock-reset-token-12345';
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9003'}/reset-password?token=${mockResetToken}`;

    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: [input.email],
        subject: 'Reset Your EduResult Pro Password',
        react: PasswordResetEmailTemplate({ resetLink }),
      });

      if (error) {
        console.error('Resend API error:', error);
        throw new Error(`Failed to send email: ${error.message}`);
      }

      console.log('Password reset email sent successfully:', data);
    } catch (e) {
      console.error('Exception when sending email:', e);
      // Re-throw the error to be caught by the client
      if (e instanceof Error) {
        throw new Error(`An exception occurred while sending the email: ${e.message}`);
      }
      throw new Error('An unknown exception occurred while sending the email.');
    }
  }
);
