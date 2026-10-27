import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { PrivacyService } from './privacy.service';

@Controller('privacy')
@UseGuards(JwtAuthGuard)
export class PrivacyController {
  constructor(private readonly privacyService: PrivacyService) {}

  @Get('settings')
  getPrivacySettings(@Request() req: AuthenticatedRequest) {
    return this.privacyService.getPrivacySettings(req.user.id);
  }

  @Put('settings')
  updatePrivacySettings(
    @Request() req: AuthenticatedRequest,
    @Body() settings: Record<string, unknown>
  ) {
    return this.privacyService.updatePrivacySettings(req.user.id, settings);
  }

  @Post('gdpr/export')
  requestGDPRDataExport(@Request() req: AuthenticatedRequest) {
    return this.privacyService.requestGDPRDataExport(req.user.id);
  }

  @Post('gdpr/delete')
  requestGDPRDataDeletion(@Request() req: AuthenticatedRequest) {
    return this.privacyService.requestGDPRDataDeletion(req.user.id);
  }

  @Get('retention')
  getDataRetentionInfo() {
    return this.privacyService.getDataRetentionInfo();
  }

  @Post('cookie-consent')
  acceptCookieConsent(
    @Request() req: AuthenticatedRequest,
    @Body() consent: Record<string, unknown>
  ) {
    return this.privacyService.acceptCookieConsent(req.user.id, consent);
  }

  @Get('cookie-consent')
  getCookieConsent() {
    return this.privacyService.getCookieConsent();
  }
}
