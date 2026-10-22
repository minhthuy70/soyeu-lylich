import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notifications.service';
import { PushNotificationsController } from './push-notifications.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PushNotificationsController],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotificationsModule {}
