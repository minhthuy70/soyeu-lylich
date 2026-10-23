import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { SystemConfigurationService } from './system-configuration.service';

@Controller('admin/config')
@UseGuards(AdminGuard)
export class SystemConfigurationController {
  constructor(private readonly systemConfigurationService: SystemConfigurationService) {}

  @Get('general')
  async getGeneralSettings() {
    return this.systemConfigurationService.getGeneralSettings();
  }

  @Put('general')
  async updateGeneralSettings(@Body() settings: any) {
    return this.systemConfigurationService.updateGeneralSettings(settings);
  }

  @Get('email')
  async getEmailConfiguration() {
    return this.systemConfigurationService.getEmailConfiguration();
  }

  @Put('email')
  async updateEmailConfiguration(@Body() config: any) {
    return this.systemConfigurationService.updateEmailConfiguration(config);
  }

  @Get('storage')
  async getStorageConfiguration() {
    return this.systemConfigurationService.getStorageConfiguration();
  }

  @Put('storage')
  async updateStorageConfiguration(@Body() config: any) {
    return this.systemConfigurationService.updateStorageConfiguration(config);
  }

  @Get('ai')
  async getAIServiceConfiguration() {
    return this.systemConfigurationService.getAIServiceConfiguration();
  }

  @Put('ai')
  async updateAIServiceConfiguration(@Body() config: any) {
    return this.systemConfigurationService.updateAIServiceConfiguration(config);
  }

  @Get('feature-flags')
  async getFeatureFlags() {
    return this.systemConfigurationService.getFeatureFlags();
  }

  @Put('feature-flags')
  async updateFeatureFlags(@Body() flags: any) {
    return this.systemConfigurationService.updateFeatureFlags(flags);
  }

  @Put('maintenance-mode')
  async toggleMaintenanceMode(@Body() body: { enabled: boolean }) {
    return this.systemConfigurationService.toggleMaintenanceMode(body.enabled);
  }
}
