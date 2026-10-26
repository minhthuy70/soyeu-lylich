import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResumeExportService } from './resume-export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resume-export')
@UseGuards(JwtAuthGuard)
export class ResumeExportController {
  constructor(private readonly resumeExportService: ResumeExportService) {}

  @Post(':id/docx')
  @HttpCode(HttpStatus.OK)
  async exportToDocx(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportToDocx(parseInt(id), userId);
  }

  @Post(':id/pdf')
  @HttpCode(HttpStatus.OK)
  async exportToPdf(
    @Param('id') id: string,
    @Body() body: { watermark?: string; pageSize?: 'A4' | 'Letter' },
    @Request() req
  ) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportToPdf(parseInt(id), userId, body);
  }

  @Post(':id/txt')
  @HttpCode(HttpStatus.OK)
  async exportToTxt(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportToTxt(parseInt(id), userId);
  }

  @Post(':id/json')
  @HttpCode(HttpStatus.OK)
  async exportToJson(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportToJson(parseInt(id), userId);
  }

  @Post(':id/html')
  @HttpCode(HttpStatus.OK)
  async exportToHtml(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportToHtml(parseInt(id), userId);
  }

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  async exportMultiple(
    @Body() body: { resumeIds: number[]; format: 'pdf' | 'docx' | 'txt' | 'json' | 'html' },
    @Request() req
  ) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportMultipleResumes(body.resumeIds, userId, body.format);
  }

  @Post(':id/public')
  @HttpCode(HttpStatus.OK)
  async generatePublicUrl(
    @Param('id') id: string,
    @Body() body: { customSlug?: string; password?: string; expiryDate?: string },
    @Request() req
  ) {
    const userId = req.user?.id || 1;
    const options = {
      customSlug: body.customSlug,
      password: body.password,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    };
    return this.resumeExportService.generatePublicUrl(parseInt(id), userId, options);
  }

  @Delete(':id/public')
  @HttpCode(HttpStatus.OK)
  async disablePublicAccess(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.disablePublicAccess(parseInt(id), userId);
  }

  @Get('public/:slug')
  @HttpCode(HttpStatus.OK)
  async getPublicResume(@Param('slug') slug: string, @Query('password') password?: string) {
    return this.resumeExportService.getPublicResume(slug, password);
  }

  @Post(':id/track-view')
  @HttpCode(HttpStatus.OK)
  async trackView(
    @Param('id') id: string,
    @Body() body: { ipAddress?: string; userAgent?: string; referrer?: string }
  ) {
    return this.resumeExportService.trackPublicView(parseInt(id), body);
  }

  @Get(':id/qrcode')
  @HttpCode(HttpStatus.OK)
  async generateQrCode(@Param('id') id: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.generateQrCode(parseInt(id), userId);
  }

  @Post(':id/share-email')
  @HttpCode(HttpStatus.OK)
  async shareViaEmail(
    @Param('id') id: string,
    @Body() body: { recipients: string[]; message?: string },
    @Request() req
  ) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.shareViaEmail(
      parseInt(id),
      userId,
      body.recipients,
      body.message
    );
  }

  @Get(':id/analytics')
  @HttpCode(HttpStatus.OK)
  async getAnalytics(
    @Param('id') id: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
    @Request() req
  ) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.getSharingAnalytics(parseInt(id), userId, period);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  async importFromJson(@Body() body: { jsonData: any }, @Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.importFromJson(userId, body.jsonData);
  }
}
