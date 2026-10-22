import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ResumeAnalysisService, ResumeAnalysisResult } from './resume-analysis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resume-analysis')
@UseGuards(JwtAuthGuard)
export class ResumeAnalysisController {
  constructor(private readonly resumeAnalysisService: ResumeAnalysisService) {}

  @Post(':id')
  async analyzeResume(
    @Param('id') id: string,
    @Body() body: { jobTitle?: string },
    @Request() req,
  ): Promise<ResumeAnalysisResult> {
    const resumeId = parseInt(id, 10);
    const { jobTitle } = body;

    return this.resumeAnalysisService.analyzeResume(resumeId, jobTitle);
  }

  @Get(':id/completeness')
  async getCompleteness(@Param('id') id: string, @Request() req) {
    const resumeId = parseInt(id, 10);
    const analysis = await this.resumeAnalysisService.analyzeResume(resumeId);
    return analysis.completeness;
  }

  @Get(':id/quality')
  async getQuality(@Param('id') id: string, @Request() req) {
    const resumeId = parseInt(id, 10);
    const analysis = await this.resumeAnalysisService.analyzeResume(resumeId);
    return analysis.quality;
  }

  @Get(':id/missing-sections')
  async getMissingSections(@Param('id') id: string, @Request() req) {
    const resumeId = parseInt(id, 10);
    const analysis = await this.resumeAnalysisService.analyzeResume(resumeId);
    return analysis.missingSections;
  }

  @Get(':id/keywords')
  async getKeywordSuggestions(@Param('id') id: string, @Request() req) {
    const resumeId = parseInt(id, 10);
    const analysis = await this.resumeAnalysisService.analyzeResume(resumeId);
    return analysis.keywordSuggestions;
  }
}
