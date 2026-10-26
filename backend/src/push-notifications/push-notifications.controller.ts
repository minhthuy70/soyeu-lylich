import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PushNotificationService } from './push-notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('push-notifications')
@UseGuards(JwtAuthGuard)
export class PushNotificationsController {
  constructor(private readonly pushNotificationService: PushNotificationService) {}

  @Post('send')
  async sendNotification(@Body() body: { title: string; body: string }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.pushNotificationService.sendBrowserNotification(userId, body.title, body.body);
  }

  @Post('register-subscription')
  async registerSubscription(@Body() body: { subscription: any }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.pushNotificationService.registerPushSubscription(userId, body.subscription);
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    const userId = req.user?.id || 1;
    return this.pushNotificationService.getNotificationPreferences(userId);
  }

  @Post('preferences')
  async updatePreferences(@Body() body: any, @Request() req) {
    const userId = req.user?.id || 1;
    return this.pushNotificationService.updateNotificationPreferences(userId, body);
  }

  @Post('broadcast')
  async broadcast(@Body() body: { title: string; body: string }) {
    return this.pushNotificationService.sendNotificationToAll(body.title, body.body);
  }

  @Post('category/:category')
  async sendToCategory(
    @Param('category') category: string,
    @Body() body: { title: string; body: string }
  ) {
    return this.pushNotificationService.sendNotificationToCategory(category, body.title, body.body);
  }
}
