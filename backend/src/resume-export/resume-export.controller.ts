import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ResumeExportService } from './resume-export.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

@Controller('resume-export')
@UseGuards(JwtAuthGuard)
export class ResumeExportController {
  constructor(private readonly resumeExportService: ResumeExportService) {}

  @Post(':id/docx')
  @HttpCode(HttpStatus.OK)
  exportToDocx(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.exportToDocx(id, req.user.id);
  }

  @Post(':id/pdf')
  @HttpCode(HttpStatus.OK)
  exportToPdf(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { watermark?: string; pageSize?: 'A4' | 'Letter' },
    @Request() req: AuthenticatedRequest
  ) {
    return this.resumeExportService.exportToPdf(id, req.user.id, body);
  }

  @Post(':id/txt')
  @HttpCode(HttpStatus.OK)
  exportToTxt(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.exportToTxt(id, req.user.id);
  }

  @Post(':id/json')
  @HttpCode(HttpStatus.OK)
  exportToJson(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.exportToJson(id, req.user.id);
  }

  @Post(':id/html')
  @HttpCode(HttpStatus.OK)
  exportToHtml(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.exportToHtml(id, req.user.id);
  }

  @Post('batch')
  @HttpCode(HttpStatus.OK)
  exportMultiple(
    @Body() body: { resumeIds: number[]; format: 'pdf' | 'docx' | 'txt' | 'json' | 'html' },
    @Request() req: AuthenticatedRequest
  ) {
    return this.resumeExportService.exportMultipleResumes(body.resumeIds, req.user.id, body.format);
  }

  @Post(':id/public')
  @HttpCode(HttpStatus.OK)
  generatePublicUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { customSlug?: string; password?: string; expiryDate?: string },
    @Request() req: AuthenticatedRequest
  ) {
    const options = {
      customSlug: body.customSlug,
      password: body.password,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    };
    return this.resumeExportService.generatePublicUrl(id, req.user.id, options);
  }

  @Delete(':id/public')
  @HttpCode(HttpStatus.OK)
  disablePublicAccess(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.disablePublicAccess(id, req.user.id);
  }

  @Get('public/:slug')
  @HttpCode(HttpStatus.OK)
  getPublicResume(@Param('slug') slug: string, @Query('password') password?: string) {
    return this.resumeExportService.getPublicResume(slug, password);
  }

  @Post(':id/track-view')
  @HttpCode(HttpStatus.OK)
  trackView(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { ipAddress?: string; userAgent?: string; referrer?: string }
  ) {
    return this.resumeExportService.trackPublicView(id, body);
  }

  @Get(':id/qrcode')
  @HttpCode(HttpStatus.OK)
  generateQrCode(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.generateQrCode(id, req.user.id);
  }

  @Post(':id/share-email')
  @HttpCode(HttpStatus.OK)
  shareViaEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { recipients: string[]; message?: string },
    @Request() req: AuthenticatedRequest
  ) {
    return this.resumeExportService.shareViaEmail(id, req.user.id, body.recipients, body.message);
  }

  @Get(':id/analytics')
  @HttpCode(HttpStatus.OK)
  getAnalytics(
    @Param('id', ParseIntPipe) id: number,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
    @Request() req: AuthenticatedRequest
  ) {
    return this.resumeExportService.getSharingAnalytics(id, req.user.id, period);
  }

  @Post('import')
  @HttpCode(HttpStatus.OK)
  importFromJson(@Body() body: { jsonData: unknown }, @Request() req: AuthenticatedRequest) {
    return this.resumeExportService.importFromJson(req.user.id, body.jsonData);
  }
}
