import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ProjectAnalyticsService } from './project-analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('project-analytics')
@UseGuards(JwtAuthGuard)
export class ProjectAnalyticsController {
  constructor(private readonly projectAnalyticsService: ProjectAnalyticsService) {}

  @Post(':projectId/view')
  async trackView(
    @Param('projectId') projectId: string,
    @Body() body: { viewerIp?: string; userAgent?: string }
  ) {
    return this.projectAnalyticsService.trackProjectView(parseInt(projectId), body);
  }

  @Post(':projectId/click')
  async trackClick(
    @Param('projectId') projectId: string,
    @Body() body: { clickType: string; clickUrl?: string }
  ) {
    return this.projectAnalyticsService.trackProjectClick(
      parseInt(projectId),
      body.clickType,
      body.clickUrl
    );
  }

  @Get()
  async getAnalytics(
    @Request() req,
    @Query('projectId') projectId?: string,
    @Query('period') period: 'week' | 'month' | 'year' = 'month'
  ) {
    const userId = req.user?.id || 1;
    return this.projectAnalyticsService.getProjectAnalytics(
      userId,
      projectId ? parseInt(projectId) : undefined,
      period
    );
  }

  @Get('most-viewed')
  async getMostViewed(@Request() req, @Query('limit') limit: string = '5') {
    const userId = req.user?.id || 1;
    return this.projectAnalyticsService.getMostViewedProjects(userId, parseInt(limit));
  }
}
