import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EmailNotificationService } from './email-notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('email-notifications')
@UseGuards(JwtAuthGuard)
export class EmailNotificationsController {
  constructor(private readonly emailNotificationService: EmailNotificationService) {}

  @Post('security-alert')
  async sendSecurityAlert(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    const email = req.user?.email || body.email;
    return this.emailNotificationService.sendSecurityAlert(
      userId,
      email,
      body.alertType,
      body.details
    );
  }

  @Post('resume-sharing')
  async sendResumeSharingNotification(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    const email = req.user?.email || body.email;
    return this.emailNotificationService.sendResumeSharingNotification(
      userId,
      email,
      body.resumeTitle,
      body.sharedWith,
      body.shareType
    );
  }

  @Post('weekly-summary')
  async sendWeeklySummary(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    const email = req.user?.email || body.email;
    return this.emailNotificationService.sendWeeklySummary(userId, email, body.summary);
  }

  @Post('certificate-expiry')
  async sendCertificateExpiryReminder(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    const email = req.user?.email || body.email;
    return this.emailNotificationService.sendCertificateExpiryReminder(
      userId,
      email,
      body.certificateName,
      body.expiryDate,
      body.daysUntilExpiry
    );
  }

  @Post('profile-milestone')
  async sendProfileViewMilestone(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    const email = req.user?.email || body.email;
    return this.emailNotificationService.sendProfileViewMilestone(
      userId,
      email,
      body.milestone,
      body.currentViews
    );
  }

  @Post('account-verification')
  async sendAccountVerification(@Body() body: { email: string; token: string }) {
    return this.emailNotificationService.sendAccountVerification(body.email, body.token);
  }

  @Post('password-reset')
  async sendPasswordReset(@Body() body: { email: string; token: string }) {
    return this.emailNotificationService.sendPasswordReset(body.email, body.token);
  }

  @Post('batch/weekly-summary')
  async sendWeeklySummariesToAll() {
    return this.emailNotificationService.sendWeeklySummariesToAllUsers();
  }

  @Post('batch/certificate-expiry')
  async sendCertificateExpiryReminders() {
    return this.emailNotificationService.sendCertificateExpiryReminders();
  }
}
