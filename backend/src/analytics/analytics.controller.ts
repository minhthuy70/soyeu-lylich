import { Controller, Get, Post, Body, Param, Query, UseGuards, Req, Headers } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { TrackEventDto } from './dto/track-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Track event (public endpoint with optional auth)
  @Post('track')
  async trackEvent(
    @Req() req,
    @Body() trackEventDto: TrackEventDto,
    @Headers('user-agent') userAgent?: string
  ) {
    const userId = req.user?.userId || 0;
    return this.analyticsService.trackEvent(userId, trackEventDto, userAgent);
  }

  // End session
  @Post('session/end')
  async endSession(@Body('sessionId') sessionId: string) {
    return this.analyticsService.endSession(sessionId);
  }

  // Get user behavior analytics (protected)
  @Get('behavior')
  @UseGuards(JwtAuthGuard)
  async getUserBehaviorAnalytics(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getUserBehaviorAnalytics(req.user.userId, start, end);
  }

  // Get session analytics (protected)
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessionAnalytics(@Req() req, @Query('limit') limit?: string) {
    return this.analyticsService.getSessionAnalytics(req.user.userId, limit ? parseInt(limit) : 50);
  }

  // Dashboard analytics (protected)
  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  async getDashboardAnalytics(
    @Req() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.analyticsService.getDashboardAnalytics(req.user.userId, start, end);
  }

  // Funnel management (admin only - should add admin guard)
  @Post('funnel')
  @UseGuards(JwtAuthGuard)
  async createFunnel(
    @Body('funnelName') funnelName: string,
    @Body('steps') steps: { name: string; description?: string }[]
  ) {
    return this.analyticsService.createFunnel(funnelName, steps);
  }

  @Post('funnel/track')
  async trackFunnelEvent(
    @Body('sessionId') sessionId: string,
    @Body('funnelName') funnelName: string,
    @Body('stepName') stepName: string
  ) {
    return this.analyticsService.trackFunnelEvent(sessionId, funnelName, stepName);
  }

  @Get('funnel/:funnelName')
  async getFunnelAnalytics(@Param('funnelName') funnelName: string) {
    return this.analyticsService.getFunnelAnalytics(funnelName);
  }

  // A/B Testing (admin only)
  @Post('ab-test')
  @UseGuards(JwtAuthGuard)
  async createABTest(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('variantA') variantA: string,
    @Body('variantB') variantB: string,
    @Body('trafficSplit') trafficSplit?: number
  ) {
    return this.analyticsService.createABTest(name, description, variantA, variantB, trafficSplit);
  }

  @Get('ab-test/assign')
  @UseGuards(JwtAuthGuard)
  async assignUserToABTest(@Req() req, @Query('testName') testName: string) {
    return this.analyticsService.assignUserToABTest(req.user.userId, testName);
  }

  @Post('ab-test/convert')
  @UseGuards(JwtAuthGuard)
  async trackABTestConversion(@Req() req, @Body('testName') testName: string) {
    return this.analyticsService.trackABTestConversion(req.user.userId, testName);
  }

  @Get('ab-test/:testName')
  async getABTestResults(@Param('testName') testName: string) {
    return this.analyticsService.getABTestResults(testName);
  }

  // Retention Analysis
  @Post('retention/track')
  @UseGuards(JwtAuthGuard)
  async trackRetention(@Req() req) {
    return this.analyticsService.trackRetention(req.user.userId);
  }

  @Get('retention')
  async getRetentionMetrics(@Query('cohortDate') cohortDate?: string) {
    const date = cohortDate ? new Date(cohortDate) : undefined;
    return this.analyticsService.getRetentionMetrics(date);
  }
}
