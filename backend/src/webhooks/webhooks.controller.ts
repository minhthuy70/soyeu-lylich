import { Controller, Post, Get, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('webhooks')
@UseGuards(JwtAuthGuard)
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('register')
  registerWebhook(@Body() body: any) {
    const { userId, url, secret, events } = body;
    return this.webhooksService.registerWebhook(userId, { url, secret, events });
  }

  @Get(':userId')
  getWebhooks(@Param('userId') userId: string) {
    return this.webhooksService.getWebhooks(parseInt(userId));
  }

  @Delete(':webhookId')
  deleteWebhook(@Param('webhookId') webhookId: string) {
    return this.webhooksService.deleteWebhook(webhookId);
  }

  @Post('trigger')
  triggerWebhook(@Body() body: any) {
    const { event, payload } = body;
    return this.webhooksService.triggerWebhook(event, payload);
  }
}
