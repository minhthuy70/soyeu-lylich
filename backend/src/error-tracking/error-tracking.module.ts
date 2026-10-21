import { Module } from '@nestjs/common';
import { ErrorTrackingController } from './error-tracking.controller';
import { ErrorTrackingService } from './error-tracking.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ErrorTrackingController],
  providers: [ErrorTrackingService],
  exports: [ErrorTrackingService],
})
export class ErrorTrackingModule {}
