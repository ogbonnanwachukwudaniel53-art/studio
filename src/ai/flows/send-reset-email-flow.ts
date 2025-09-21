
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
import * as React from 'react';

const SendPasswordResetEmailInputSchema = z.object({
  email: z.string().email().describe('The email address to send the reset link to.'),
});
export type SendPasswordResetEmailInput = z.infer<typeof SendPasswordResetEmailInputSchema>;


// Basic email template component
const PasswordResetEmailTemplate: React.FC<{ resetLink: string }> = ({ resetLink }) => (
  <div>
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password for EduResult Pro.</p>
    <a href={resetLink}>Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  </div>
);


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
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured in environment variables.');
    }
     if (!fromEmail) {
      throw new Error('RESEND_FROM_EMAIL is not configured in environment variables.');
    }

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
