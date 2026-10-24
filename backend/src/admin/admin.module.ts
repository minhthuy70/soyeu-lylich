import { Module } from '@nestjs/common';
import { SystemHealthService } from './system-health.service';
import { SystemHealthController } from './system-health.controller';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { SystemLogsService } from './system-logs.service';
import { SystemLogsController } from './system-logs.controller';
import { SystemConfigurationService } from './system-configuration.service';
import { SystemConfigurationController } from './system-configuration.controller';
import { ContentManagementService } from './content-management.service';
import { ContentManagementController } from './content-management.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [
    SystemHealthController,
    UserManagementController,
    SystemLogsController,
    SystemConfigurationController,
    ContentManagementController,
  ],
  providers: [
    SystemHealthService,
    UserManagementService,
    SystemLogsService,
    SystemConfigurationService,
    ContentManagementService,
  ],
  exports: [
    SystemHealthService,
    UserManagementService,
    SystemLogsService,
    SystemConfigurationService,
    ContentManagementService,
  ],
})
export class AdminModule {}
