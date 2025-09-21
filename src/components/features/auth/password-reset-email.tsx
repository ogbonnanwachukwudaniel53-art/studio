
import * as React from 'react';

interface PasswordResetEmailTemplateProps {
  resetLink: string;
}

export const PasswordResetEmailTemplate: React.FC<Readonly<PasswordResetEmailTemplateProps>> = ({ resetLink }) => (
  <div>
    <h1>Reset Your Password</h1>
    <p>Click the link below to reset your password for EduResult Pro.</p>
    <a href={resetLink}>Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  </div>
);
