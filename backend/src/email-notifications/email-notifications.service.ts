import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailNotificationService {
  // 1. Security Alert Email
  async sendSecurityAlert(
    userId: number,
    email: string,
    alertType: 'login' | 'password_change' | '2fa_enabled' | 'suspicious_activity',
    details?: any,
  ) {
    // In production, use Nodemailer, SendGrid, AWS SES, or similar
    console.log(`Sending security alert email to ${email}: ${alertType}`);
    console.log('Details:', details);

    const templates = {
      login: 'New login detected from your account',
      password_change: 'Your password was recently changed',
      '2fa_enabled': 'Two-factor authentication was enabled',
      suspicious_activity: 'Suspicious activity detected on your account',
    };

    return {
      success: true,
      message: `Security alert sent: ${templates[alertType]}`,
    };
  }

  // 2. Resume Sharing Notification
  async sendResumeSharingNotification(
    userId: number,
    email: string,
    resumeTitle: string,
    sharedWith: string,
    shareType: 'public' | 'private' | 'email',
  ) {
    console.log(`Sending resume sharing notification to ${email}`);
    console.log(`Resume: ${resumeTitle}, Shared with: ${sharedWith}, Type: ${shareType}`);

    return {
      success: true,
      message: 'Resume sharing notification sent',
    };
  }

  // 3. Weekly Summary Email
  async sendWeeklySummary(
    userId: number,
    email: string,
    summary: {
      profileViews: number;
      shares: number;
      newConnections: number;
      achievements: number;
    },
  ) {
    console.log(`Sending weekly summary to ${email}`);
    console.log('Summary:', summary);

    return {
      success: true,
      message: 'Weekly summary email sent',
    };
  }

  // 4. Certificate Expiry Email
  async sendCertificateExpiryReminder(
    userId: number,
    email: string,
    certificateName: string,
    expiryDate: Date,
    daysUntilExpiry: number,
  ) {
    console.log(`Sending certificate expiry reminder to ${email}`);
    console.log(`Certificate: ${certificateName}, Expires: ${expiryDate}, Days left: ${daysUntilExpiry}`);

    const urgency =
      daysUntilExpiry <= 7
        ? 'URGENT'
        : daysUntilExpiry <= 30
          ? 'Important'
          : 'Reminder';

    return {
      success: true,
      message: `Certificate expiry reminder sent (${urgency})`,
    };
  }

  // 5. Profile View Milestone Email
  async sendProfileViewMilestone(
    userId: number,
    email: string,
    milestone: number,
    currentViews: number,
  ) {
    console.log(`Sending profile view milestone email to ${email}`);
    console.log(`Milestone: ${milestone}, Current views: ${currentViews}`);

    return {
      success: true,
      message: `Profile view milestone ${milestone} achieved!`,
    };
  }

  // Helper: Send account verification email (complement to existing auth logic)
  async sendAccountVerification(email: string, token: string) {
    console.log(`Sending account verification email to ${email}`);
    console.log(`Verification token: ${token}`);

    return {
      success: true,
      message: 'Account verification email sent',
    };
  }

  // Helper: Send password reset email (complement to existing auth logic)
  async sendPasswordReset(email: string, token: string) {
    console.log(`Sending password reset email to ${email}`);
    console.log(`Reset token: ${token}`);

    return {
      success: true,
      message: 'Password reset email sent',
    };
  }

  // Batch send weekly summaries (for scheduled jobs)
  async sendWeeklySummariesToAllUsers() {
    console.log('Sending weekly summaries to all users');
    // In production, query all users with weekly summaries enabled
    // and send individual emails
    return {
      success: true,
      message: 'Weekly summaries queued for sending',
      recipients: 0,
    };
  }

  // Batch send certificate expiry reminders (for scheduled jobs)
  async sendCertificateExpiryReminders() {
    console.log('Sending certificate expiry reminders');
    // In production, query certificates expiring soon
    // and send reminders to respective users
    return {
      success: true,
      message: 'Certificate expiry reminders queued for sending',
      recipients: 0,
    };
  }
}
