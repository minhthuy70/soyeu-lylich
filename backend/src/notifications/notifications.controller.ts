import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getUserNotifications(
    @Request() req,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.getUserNotifications(
      userId,
      parseInt(limit as string),
      parseInt(offset as string),
    );
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    const userId = req.user?.id || 1;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Get('type/:type')
  async getNotificationsByType(@Param('type') type: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.getNotificationsByType(userId, type);
  }

  @Post('profile-completion')
  async createProfileCompletionReminder(@Body() body: { completionPercentage: number }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.createProfileCompletionReminder(userId, body.completionPercentage);
  }

  @Post('resume-update')
  async createResumeUpdateNotification(@Body() body: { resumeTitle: string }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.createResumeUpdateNotification(userId, body.resumeTitle);
  }

  @Post('security')
  async createSecurityNotification(@Body() body: { securityType: string; details?: any }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.createSecurityNotification(userId, body.securityType, body.details);
  }

  @Post('system')
  async createSystemNotification(@Body() body: { title: string; message: string; metadata?: any }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.createSystemNotification(userId, body.title, body.message, body.metadata);
  }

  @Post('achievement')
  async createAchievementNotification(@Body() body: { achievementTitle: string }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.createAchievementNotification(userId, body.achievementTitle);
  }

  @Post('profile-view')
  async createProfileViewNotification(@Body() body: { viewCount: number }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.createProfileViewNotification(userId, body.viewCount);
  }

  @Post('resume-share')
  async createResumeShareNotification(
    @Body() body: { resumeTitle: string; sharedWith: string },
    @Request() req,
  ) {
    const userId = req.user?.id || 1;
    return this.notificationService.createResumeShareNotification(userId, body.resumeTitle, body.sharedWith);
  }

  @Post(':id/mark-read')
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.markAsRead(parseInt(id), userId);
  }

  @Post('mark-all-read')
  async markAllAsRead(@Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.deleteNotification(parseInt(id), userId);
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.getUserNotificationPreferences(userId);
  }

  @Post('preferences')
  async updatePreferences(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.updateUserNotificationPreferences(userId, body);
  }

  @Delete('old')
  async deleteOldNotifications(@Query('daysOld') daysOld = 90, @Request() req) {
    const userId = req.user?.id || 1;
    return this.notificationService.deleteOldNotifications(userId, parseInt(daysOld as string));
  }
}
