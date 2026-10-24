import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('activity/:userId')
  async getActivityFeed(@Param('userId') userId: string, @Query('limit') limit?: string) {
    return this.dashboardService.getActivityFeed(parseInt(userId), limit ? parseInt(limit) : 20);
  }

  @Get('resume-stats/:resumeId')
  async getResumeViewStatistics(
    @Param('resumeId') resumeId: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
  ) {
    return this.dashboardService.getResumeViewStatistics(parseInt(resumeId), period);
  }

  @Get('top-sections/:resumeId')
  async getTopViewedSections(@Param('resumeId') resumeId: string, @Query('limit') limit?: string) {
    return this.dashboardService.getTopViewedSections(parseInt(resumeId), limit ? parseInt(limit) : 10);
  }

  @Get('suggestions/:userId')
  async getCompletionSuggestions(@Param('userId') userId: string) {
    return this.dashboardService.getCompletionSuggestions(parseInt(userId));
  }

  @Get('score/:userId')
  async getCompletionScore(@Param('userId') userId: string) {
    return this.dashboardService.getCompletionScore(parseInt(userId));
  }

  @Get('overview/:userId')
  async getDashboardOverview(@Param('userId') userId: string) {
    return this.dashboardService.getDashboardOverview(parseInt(userId));
  }

  @Get('certificate-expiry/:userId')
  async getUpcomingCertificateExpiry(
    @Param('userId') userId: string,
    @Query('days') days?: string,
  ) {
    return this.dashboardService.getUpcomingCertificateExpiry(
      parseInt(userId),
      days ? parseInt(days) : 30,
    );
  }

  @Get('geography/:resumeId')
  async getVisitorGeography(
    @Param('resumeId') resumeId: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
  ) {
    return this.dashboardService.getVisitorGeography(parseInt(resumeId), period);
  }

  @Get('devices/:resumeId')
  async getDeviceBreakdown(
    @Param('resumeId') resumeId: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
  ) {
    return this.dashboardService.getDeviceBreakdown(parseInt(resumeId), period);
  }

  @Get('referrals/:resumeId')
  async getReferralSources(
    @Param('resumeId') resumeId: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'month',
  ) {
    return this.dashboardService.getReferralSources(parseInt(resumeId), period);
  }

  @Get('sections/:userId')
  async getSectionCompletionStatus(@Param('userId') userId: string) {
    return this.dashboardService.getSectionCompletionStatus(parseInt(userId));
  }
}
