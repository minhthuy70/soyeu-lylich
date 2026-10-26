import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { SystemLogsService } from './system-logs.service';

@Controller('admin/logs')
@UseGuards(AdminGuard)
export class SystemLogsController {
  constructor(private readonly systemLogsService: SystemLogsService) {}

  @Get('system')
  async getSystemLogs(@Query() filters: any) {
    return this.systemLogsService.getSystemLogs(filters);
  }

  @Get('api')
  async getApiRequestLogs(@Query() filters: any) {
    return this.systemLogsService.getApiRequestLogs(filters);
  }

  @Get('security')
  async getSecurityAuditLogs(@Query() filters: any) {
    return this.systemLogsService.getSecurityAuditLogs(filters);
  }

  @Get('export')
  async exportLogs(
    @Query('type') type: 'system' | 'api' | 'security',
    @Query('format') format: 'csv' | 'json' = 'json'
  ) {
    return this.systemLogsService.exportLogs(type, format);
  }
}
