import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { SystemConfigurationService } from './system-configuration.service';

@Controller('admin/config')
@UseGuards(AdminGuard)
export class SystemConfigurationController {
  constructor(private readonly systemConfigurationService: SystemConfigurationService) {}

  @Get('general')
  getGeneralSettings() {
    return this.systemConfigurationService.getGeneralSettings();
  }

  @Put('general')
  updateGeneralSettings(@Body() settings: Record<string, unknown>) {
    return this.systemConfigurationService.updateGeneralSettings(settings);
  }

  @Get('email')
  getEmailConfiguration() {
    return this.systemConfigurationService.getEmailConfiguration();
  }

  @Put('email')
  updateEmailConfiguration(@Body() config: Record<string, unknown>) {
    return this.systemConfigurationService.updateEmailConfiguration(config);
  }

  @Get('storage')
  getStorageConfiguration() {
    return this.systemConfigurationService.getStorageConfiguration();
  }

  @Put('storage')
  updateStorageConfiguration(@Body() config: Record<string, unknown>) {
    return this.systemConfigurationService.updateStorageConfiguration(config);
  }

  @Get('ai')
  getAIServiceConfiguration() {
    return this.systemConfigurationService.getAIServiceConfiguration();
  }

  @Put('ai')
  updateAIServiceConfiguration(@Body() config: Record<string, unknown>) {
    return this.systemConfigurationService.updateAIServiceConfiguration(config);
  }

  @Get('feature-flags')
  getFeatureFlags() {
    return this.systemConfigurationService.getFeatureFlags();
  }

  @Put('feature-flags')
  updateFeatureFlags(@Body() flags: Record<string, unknown>) {
    return this.systemConfigurationService.updateFeatureFlags(flags);
  }

  @Put('maintenance-mode')
  toggleMaintenanceMode(@Body() body: { enabled: boolean }) {
    return this.systemConfigurationService.toggleMaintenanceMode(body.enabled);
  }
}
