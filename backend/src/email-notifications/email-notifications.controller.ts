import { BadRequestException, Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { EmailNotificationService } from './email-notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

@Controller('email-notifications')
@UseGuards(JwtAuthGuard)
export class EmailNotificationsController {
  constructor(private readonly emailNotificationService: EmailNotificationService) {}

  @Post('security-alert')
  sendSecurityAlert(
    @Body()
    body: {
      alertType: 'login' | 'password_change' | '2fa_enabled' | 'suspicious_activity';
      details?: unknown;
    },
    @Request() req: AuthenticatedRequest
  ) {
    return this.emailNotificationService.sendSecurityAlert(
      req.user.id,
      req.user.email,
      body.alertType,
      body.details
    );
  }

  @Post('resume-sharing')
  sendResumeSharingNotification(
    @Body()
    body: {
      resumeTitle: string;
      sharedWith: string;
      shareType: 'public' | 'private' | 'email';
    },
    @Request() req: AuthenticatedRequest
  ) {
    return this.emailNotificationService.sendResumeSharingNotification(
      req.user.id,
      req.user.email,
      body.resumeTitle,
      body.sharedWith,
      body.shareType
    );
  }

  @Post('weekly-summary')
  sendWeeklySummary(
    @Body()
    body: {
      summary: {
        profileViews: number;
        shares: number;
        newConnections: number;
        achievements: number;
      };
    },
    @Request() req: AuthenticatedRequest
  ) {
    return this.emailNotificationService.sendWeeklySummary(
      req.user.id,
      req.user.email,
      body.summary
    );
  }

  @Post('certificate-expiry')
  sendCertificateExpiryReminder(
    @Body()
    body: { certificateName: string; expiryDate: string; daysUntilExpiry: number },
    @Request() req: AuthenticatedRequest
  ) {
    const expiryDate = new Date(body.expiryDate);
    if (Number.isNaN(expiryDate.getTime())) {
      throw new BadRequestException('Expiry date must be a valid date');
    }

    return this.emailNotificationService.sendCertificateExpiryReminder(
      req.user.id,
      req.user.email,
      body.certificateName,
      expiryDate,
      body.daysUntilExpiry
    );
  }

  @Post('profile-milestone')
  sendProfileViewMilestone(
    @Body() body: { milestone: number; currentViews: number },
    @Request() req: AuthenticatedRequest
  ) {
    return this.emailNotificationService.sendProfileViewMilestone(
      req.user.id,
      req.user.email,
      body.milestone,
      body.currentViews
    );
  }

  @Post('account-verification')
  sendAccountVerification(@Body() body: { email: string; token: string }) {
    return this.emailNotificationService.sendAccountVerification(body.email, body.token);
  }

  @Post('password-reset')
  sendPasswordReset(@Body() body: { email: string; token: string }) {
    return this.emailNotificationService.sendPasswordReset(body.email, body.token);
  }

  @Post('batch/weekly-summary')
  sendWeeklySummariesToAll() {
    return this.emailNotificationService.sendWeeklySummariesToAllUsers();
  }

  @Post('batch/certificate-expiry')
  sendCertificateExpiryReminders() {
    return this.emailNotificationService.sendCertificateExpiryReminders();
  }
}
