import { Module } from '@nestjs/common';
import { ProjectAnalyticsController } from './project-analytics.controller';
import { ProjectAnalyticsService } from './project-analytics.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectAnalyticsController],
  providers: [ProjectAnalyticsService],
  exports: [ProjectAnalyticsService],
})
export class ProjectAnalyticsModule {}
