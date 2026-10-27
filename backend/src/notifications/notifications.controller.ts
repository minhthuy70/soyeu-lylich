import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { NotificationService } from './notifications.service';
import type { NotificationPreferences } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getUserNotifications(
    @Request() req: AuthenticatedRequest,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0
  ) {
    return this.notificationService.getUserNotifications(
      req.user.id,
      Number(limit),
      Number(offset)
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: AuthenticatedRequest) {
    const count = await this.notificationService.getUnreadCount(req.user.id);
    return { count };
  }

  @Get('type/:type')
  getNotificationsByType(@Param('type') type: string, @Request() req: AuthenticatedRequest) {
    return this.notificationService.getNotificationsByType(req.user.id, type);
  }

  @Post('profile-completion')
  createProfileCompletionReminder(
    @Body() body: { completionPercentage: number },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createProfileCompletionReminder(
      req.user.id,
      body.completionPercentage
    );
  }

  @Post('resume-update')
  createResumeUpdateNotification(
    @Body() body: { resumeTitle: string },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createResumeUpdateNotification(req.user.id, body.resumeTitle);
  }

  @Post('security')
  createSecurityNotification(
    @Body()
    body: {
      securityType: 'LOGIN' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | 'SUSPICIOUS_ACTIVITY';
      details?: Prisma.InputJsonObject;
    },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createSecurityNotification(
      req.user.id,
      body.securityType,
      body.details
    );
  }

  @Post('system')
  createSystemNotification(
    @Body()
    body: {
      title: string;
      message: string;
      metadata?: Prisma.InputJsonValue;
    },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createSystemNotification(
      req.user.id,
      body.title,
      body.message,
      body.metadata
    );
  }

  @Post('achievement')
  createAchievementNotification(
    @Body() body: { achievementTitle: string },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createAchievementNotification(
      req.user.id,
      body.achievementTitle
    );
  }

  @Post('profile-view')
  createProfileViewNotification(
    @Body() body: { viewCount: number },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createProfileViewNotification(req.user.id, body.viewCount);
  }

  @Post('resume-share')
  createResumeShareNotification(
    @Body() body: { resumeTitle: string; sharedWith: string },
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.createResumeShareNotification(
      req.user.id,
      body.resumeTitle,
      body.sharedWith
    );
  }

  @Post(':id/mark-read')
  markAsRead(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.notificationService.markAsRead(id, req.user.id);
  }

  @Post('mark-all-read')
  markAllAsRead(@Request() req: AuthenticatedRequest) {
    return this.notificationService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  deleteNotification(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.notificationService.deleteNotification(id, req.user.id);
  }

  @Get('preferences')
  getPreferences() {
    return this.notificationService.getUserNotificationPreferences();
  }

  @Post('preferences')
  updatePreferences(
    @Body() body: Partial<NotificationPreferences>,
    @Request() req: AuthenticatedRequest
  ) {
    return this.notificationService.updateUserNotificationPreferences(req.user.id, body);
  }

  @Delete('old')
  deleteOldNotifications(@Query('daysOld') daysOld = 90, @Request() req: AuthenticatedRequest) {
    return this.notificationService.deleteOldNotifications(req.user.id, Number(daysOld));
  }
}
