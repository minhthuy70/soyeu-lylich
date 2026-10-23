import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DatabaseHealthService } from './database-health.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('database-health')
@UseGuards(JwtAuthGuard, AdminGuard)
export class DatabaseHealthController {
  constructor(private readonly databaseHealthService: DatabaseHealthService) {}

  @Get('status')
  async getHealthStatus() {
    return this.databaseHealthService.getHealthStatus();
  }

  @Get('size')
  async getDatabaseSize() {
    return this.databaseHealthService.getDatabaseSize();
  }

  @Get('table-sizes')
  async getTableSizes() {
    return this.databaseHealthService.getTableSizes();
  }

  @Get('slow-queries')
  async getSlowQueries() {
    return this.databaseHealthService.getSlowQueries();
  }

  @Get('connections')
  async getActiveConnections() {
    return this.databaseHealthService.getActiveConnections();
  }

  @Get('index-usage')
  async getIndexUsage() {
    return this.databaseHealthService.getIndexUsage();
  }

  @Post('optimize')
  async optimizeDatabase() {
    return this.databaseHealthService.optimizeDatabase();
  }

  @Get('config')
  async getDatabaseConfig() {
    return this.databaseHealthService.getDatabaseConfig();
  }
}
