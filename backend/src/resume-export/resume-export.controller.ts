import { Controller, Get, Post, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
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
    @Request() req,
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
    @Request() req,
  ) {
    const userId = req.user?.id || 1;
    return this.resumeExportService.exportMultipleResumes(body.resumeIds, userId, body.format);
  }
}
