import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('privacy')
@UseGuards(JwtAuthGuard)
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('settings')
  async getPrivacySettings(@Request() req) {
    const userId = req.user?.id || 1;
    return this.privacyService.getPrivacySettings(userId);
  }

  @Put('settings')
  async updatePrivacySettings(@Request() req, @Body() settings: any) {
    const userId = req.user?.id || 1;
    return this.privacyService.updatePrivacySettings(userId, settings);
  }

  @Post('gdpr/export')
  async requestGDPRDataExport(@Request() req) {
    const userId = req.user?.id || 1;
    return this.privacyService.requestGDPRDataExport(userId);
  }

  @Post('gdpr/delete')
  async requestGDPRDataDeletion(@Request() req) {
    const userId = req.user?.id || 1;
    return this.privacyService.requestGDPRDataDeletion(userId);
  }

  @Get('retention')
  async getDataRetentionInfo() {
    return this.privacyService.getDataRetentionInfo();
  }

  @Post('cookie-consent')
  async acceptCookieConsent(@Request() req, @Body() consent: any) {
    const userId = req.user?.id || 1;
    return this.privacyService.acceptCookieConsent(userId, consent);
  }

  @Get('cookie-consent')
  async getCookieConsent(@Request() req) {
    const userId = req.user?.id || 1;
    return this.privacyService.getCookieConsent(userId);
  }
}
