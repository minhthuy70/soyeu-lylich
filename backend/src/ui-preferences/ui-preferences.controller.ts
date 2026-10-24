import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UIPreferencesService } from './ui-preferences.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ui-preferences')
@UseGuards(JwtAuthGuard)
export class UIPreferencesController {
  constructor(private readonly uiPreferencesService: UIPreferencesService) {}

  @Get()
  async getUserPreferences(@Request() req) {
    const userId = req.user?.id || 1;
    return this.uiPreferencesService.getUserPreferences(userId);
  }

  @Put()
  async updateUserPreferences(@Request() req, @Body() preferences: any) {
    const userId = req.user?.id || 1;
    return this.uiPreferencesService.updateUserPreferences(userId, preferences);
  }

  @Post('reset')
  async resetToDefaults(@Request() req) {
    const userId = req.user?.id || 1;
    return this.uiPreferencesService.resetToDefaults(userId);
  }

  @Get('themes')
  async getAvailableThemes() {
    return this.uiPreferencesService.getAvailableThemes();
  }

  @Get('colors')
  async getAvailableColors() {
    return this.uiPreferencesService.getAvailableColors();
  }

  @Get('fonts')
  async getAvailableFonts() {
    return this.uiPreferencesService.getAvailableFonts();
  }

  @Get('layouts')
  async getAvailableLayouts() {
    return this.uiPreferencesService.getAvailableLayouts();
  }
}
