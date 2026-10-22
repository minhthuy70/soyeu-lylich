import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notifications.service';
import { EmailNotificationsController } from './email-notifications.controller';

@Module({
  controllers: [EmailNotificationsController],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class EmailNotificationsModule {}
