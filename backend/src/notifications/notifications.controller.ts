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
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { NotificationService } from './notifications.service';
import type { NotificationPreferences } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getUserNotifications(
    @Request() req: { user?: { id?: number } },
    @Query('limit') limit = 20,
    @Query('offset') offset = 0
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.getUserNotifications(userId, Number(limit), Number(offset));
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Get('type/:type')
  getNotificationsByType(@Param('type') type: string, @Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.notificationService.getNotificationsByType(userId, type);
  }

  @Post('profile-completion')
  createProfileCompletionReminder(
    @Body() body: { completionPercentage: number },
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createProfileCompletionReminder(
      userId,
      body.completionPercentage
    );
  }

  @Post('resume-update')
  createResumeUpdateNotification(
    @Body() body: { resumeTitle: string },
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createResumeUpdateNotification(userId, body.resumeTitle);
  }

  @Post('security')
  createSecurityNotification(
    @Body()
    body: {
      securityType: 'LOGIN' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | 'SUSPICIOUS_ACTIVITY';
      details?: Prisma.InputJsonObject;
    },
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createSecurityNotification(
      userId,
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
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createSystemNotification(
      userId,
      body.title,
      body.message,
      body.metadata
    );
  }

  @Post('achievement')
  createAchievementNotification(
    @Body() body: { achievementTitle: string },
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createAchievementNotification(userId, body.achievementTitle);
  }

  @Post('profile-view')
  createProfileViewNotification(
    @Body() body: { viewCount: number },
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createProfileViewNotification(userId, body.viewCount);
  }

  @Post('resume-share')
  createResumeShareNotification(
    @Body() body: { resumeTitle: string; sharedWith: string },
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createResumeShareNotification(
      userId,
      body.resumeTitle,
      body.sharedWith
    );
  }

  @Post(':id/mark-read')
  markAsRead(@Param('id') id: string, @Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.notificationService.markAsRead(parseInt(id), userId);
  }

  @Post('mark-all-read')
  markAllAsRead(@Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  deleteNotification(@Param('id') id: string, @Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.notificationService.deleteNotification(parseInt(id), userId);
  }

  @Get('preferences')
  getPreferences() {
    return this.notificationService.getUserNotificationPreferences();
  }

  @Post('preferences')
  updatePreferences(
    @Body() body: Partial<NotificationPreferences>,
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.updateUserNotificationPreferences(userId, body);
  }

  @Delete('old')
  deleteOldNotifications(
    @Query('daysOld') daysOld = 90,
    @Request() req: { user?: { id?: number } }
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.deleteOldNotifications(userId, Number(daysOld));
  }
}
