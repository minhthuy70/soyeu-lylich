import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { SystemHealthService } from './system-health.service';

@Controller('admin/system-health')
@UseGuards(AdminGuard)
export class SystemHealthController {
  constructor(private readonly systemHealthService: SystemHealthService) {}

  @Get()
  async getSystemHealth() {
    return this.systemHealthService.getSystemHealth();
  }
}
