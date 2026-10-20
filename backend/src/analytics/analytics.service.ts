import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackEventDto, EventType } from './dto/track-event.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Generate session ID
  generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track user behavior event
  async trackEvent(userId: number, trackEventDto: TrackEventDto, userAgent?: string) {
    const sessionId = trackEventDto.sessionId || this.generateSessionId();

    // Create or update analytics session
    let session = await this.prisma.analyticsSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      const deviceType = this.detectDeviceType(userAgent);
      const browser = this.detectBrowser(userAgent);
      const os = this.detectOS(userAgent);

      session = await this.prisma.analyticsSession.create({
        data: {
          userId,
          sessionId,
          deviceType,
          browser,
          os,
          pageViews: trackEventDto.eventType === EventType.PAGE_VIEW ? 1 : 0,
        },
      });
    } else {
      if (trackEventDto.eventType === EventType.PAGE_VIEW) {
        session = await this.prisma.analyticsSession.update({
          where: { sessionId },
          data: {
            pageViews: { increment: 1 },
            exitPage: trackEventDto.page,
          },
        });
      }
    }

    // Create behavior event
    await this.prisma.userBehaviorEvent.create({
      data: {
        userId,
        sessionId,
        eventType: trackEventDto.eventType,
        page: trackEventDto.page,
        element: trackEventDto.element,
        metadata: trackEventDto.metadata || {},
        duration: trackEventDto.duration,
      },
    });

    return { sessionId, success: true };
  }

  // End session
  async endSession(sessionId: string) {
    const session = await this.prisma.analyticsSession.findUnique({
      where: { sessionId },
    });

    if (!session) {
      return { success: false, message: 'Session not found' };
    }

    const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000);

    await this.prisma.analyticsSession.update({
      where: { sessionId },
      data: {
        endTime: new Date(),
        duration,
        bounce: session.pageViews <= 1,
      },
    });

    return { success: true };
  }

  // Get user behavior analytics
  async getUserBehaviorAnalytics(userId: number, startDate?: Date, endDate?: Date) {
    const where: any = { userId };

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const events = await this.prisma.userBehaviorEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000,
    });

    const eventTypeCounts = await this.prisma.userBehaviorEvent.groupBy({
      by: ['eventType'],
      where,
      _count: true,
    });

    const pageViews = await this.prisma.userBehaviorEvent.groupBy({
      by: ['page'],
      where: { ...where, eventType: EventType.PAGE_VIEW },
      _count: true,
    });

    return {
      totalEvents: events.length,
      eventTypeCounts: eventTypeCounts.reduce((acc, item) => {
        acc[item.eventType] = item._count;
        return acc;
      }, {}),
      topPages: pageViews
        .sort((a, b) => b._count - a._count)
        .slice(0, 10)
        .map((item) => ({ page: item.page, views: item._count })),
      recentEvents: events.slice(0, 50),
    };
  }

  // Get session analytics
  async getSessionAnalytics(userId: number, limit = 50) {
    const sessions = await this.prisma.analyticsSession.findMany({
      where: { userId },
      orderBy: { startTime: 'desc' },
      take: limit,
    });

    const totalSessions = await this.prisma.analyticsSession.count({
      where: { userId },
    });

    const avgDuration = await this.prisma.analyticsSession.aggregate({
      where: { userId, duration: { not: null } },
      _avg: { duration: true },
    });

    const bouncedSessions = await this.prisma.analyticsSession.count({
      where: { userId, bounce: true },
    });

    const bounceRate = totalSessions > 0 ? (bouncedSessions / totalSessions) * 100 : 0;

    return {
      totalSessions,
      averageDuration: avgDuration._avg.duration || 0,
      bounceRate: bounceRate.toFixed(2),
      sessions,
    };
  }

  // Funnel analysis
  async createFunnel(funnelName: string, steps: { name: string; description?: string }[]) {
    for (let i = 0; i < steps.length; i++) {
      await this.prisma.funnelStep.create({
        data: {
          funnelName,
          stepName: steps[i].name,
          stepOrder: i,
          description: steps[i].description,
        },
      });
    }

    return { success: true };
  }

  async trackFunnelEvent(sessionId: string, funnelName: string, stepName: string) {
    const step = await this.prisma.funnelStep.findFirst({
      where: { funnelName, stepName },
    });

    if (!step) {
      return { success: false, message: 'Funnel step not found' };
    }

    const previousEvent = await this.prisma.funnelEvent.findFirst({
      where: { sessionId, funnelName },
      orderBy: { timestamp: 'desc' },
    });

    let timeToComplete: number | null = null;
    if (previousEvent) {
      timeToComplete = Date.now() - previousEvent.timestamp.getTime();
    }

    await this.prisma.funnelEvent.create({
      data: {
        sessionId,
        funnelName,
        stepName,
        completed: true,
        timeToComplete,
      },
    });

    return { success: true };
  }

  async getFunnelAnalytics(funnelName: string) {
    const steps = await this.prisma.funnelStep.findMany({
      where: { funnelName },
      orderBy: { stepOrder: 'asc' },
    });

    const funnelData: any[] = [];

    for (const step of steps) {
      const totalEvents = await this.prisma.funnelEvent.count({
        where: { funnelName, stepName: step.stepName },
      });

      const completedEvents = await this.prisma.funnelEvent.count({
        where: { funnelName, stepName: step.stepName, completed: true },
      });

      const avgTimeToComplete = await this.prisma.funnelEvent.aggregate({
        where: { funnelName, stepName: step.stepName, timeToComplete: { not: null } },
        _avg: { timeToComplete: true },
      });

      funnelData.push({
        stepName: step.stepName,
        stepOrder: step.stepOrder,
        description: step.description,
        totalEvents,
        completedEvents,
        completionRate: totalEvents > 0 ? ((completedEvents / totalEvents) * 100).toFixed(2) : '0',
        avgTimeToComplete: avgTimeToComplete._avg.timeToComplete || 0,
      });
    }

    return {
      funnelName,
      steps: funnelData,
    };
  }

  // A/B Testing
  async createABTest(name: string, description: string, variantA: string, variantB: string, trafficSplit = 50) {
    return this.prisma.aBTest.create({
      data: {
        name,
        description,
        variantA,
        variantB,
        trafficSplit,
      },
    });
  }

  async assignUserToABTest(userId: number, testName: string) {
    const test = await this.prisma.aBTest.findUnique({
      where: { name: testName },
    });

    if (!test || !test.isActive) {
      return { success: false, message: 'Test not found or inactive' };
    }

    const existingAssignment = await this.prisma.aBTestAssignment.findUnique({
      where: { userId_testId: { userId, testId: test.id } },
    });

    if (existingAssignment) {
      return { variant: existingAssignment.variant };
    }

    const random = Math.random() * 100;
    const variant = random < test.trafficSplit ? 'A' : 'B';

    await this.prisma.aBTestAssignment.create({
      data: {
        userId,
        testId: test.id,
        variant,
      },
    });

    return { variant };
  }

  async trackABTestConversion(userId: number, testName: string) {
    const test = await this.prisma.aBTest.findUnique({
      where: { name: testName },
    });

    if (!test) {
      return { success: false, message: 'Test not found' };
    }

    await this.prisma.aBTestAssignment.updateMany({
      where: { userId, testId: test.id },
      data: {
        converted: true,
        convertedAt: new Date(),
      },
    });

    return { success: true };
  }

  async getABTestResults(testName: string) {
    const test = await this.prisma.aBTest.findUnique({
      where: { name: testName },
    });

    if (!test) {
      return { success: false, message: 'Test not found' };
    }

    const assignments = await this.prisma.aBTestAssignment.findMany({
      where: { testId: test.id },
    });

    const variantA = assignments.filter((a) => a.variant === 'A');
    const variantB = assignments.filter((a) => a.variant === 'B');

    const variantAConversions = variantA.filter((a) => a.converted).length;
    const variantBConversions = variantB.filter((a) => a.converted).length;

    return {
      testName,
      variantA: {
        total: variantA.length,
        conversions: variantAConversions,
        conversionRate: variantA.length > 0 ? ((variantAConversions / variantA.length) * 100).toFixed(2) : '0',
      },
      variantB: {
        total: variantB.length,
        conversions: variantBConversions,
        conversionRate: variantB.length > 0 ? ((variantBConversions / variantB.length) * 100).toFixed(2) : '0',
      },
    };
  }

  // Retention Analysis
  async trackRetention(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const cohortDate = new Date(user.createdAt);
    cohortDate.setHours(0, 0, 0, 0);

    const retention = await this.prisma.retentionMetric.upsert({
      where: { userId_cohortDate: { userId, cohortDate } },
      create: {
        userId,
        cohortDate,
        lastActiveDate: new Date(),
      },
      update: {
        lastActiveDate: new Date(),
      },
    });

    // Calculate retention metrics
    const daysSinceCohort = Math.floor((Date.now() - cohortDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceCohort >= 1) {
      await this.prisma.retentionMetric.update({
        where: { userId_cohortDate: { userId, cohortDate } },
        data: { day1: true },
      });
    }
    if (daysSinceCohort >= 7) {
      await this.prisma.retentionMetric.update({
        where: { userId_cohortDate: { userId, cohortDate } },
        data: { day7: true },
      });
    }
    if (daysSinceCohort >= 30) {
      await this.prisma.retentionMetric.update({
        where: { userId_cohortDate: { userId, cohortDate } },
        data: { day30: true },
      });
    }
    if (daysSinceCohort >= 90) {
      await this.prisma.retentionMetric.update({
        where: { userId_cohortDate: { userId, cohortDate } },
        data: { day90: true },
      });
    }

    return { success: true };
  }

  async getRetentionMetrics(cohortDate?: Date) {
    const where: any = {};
    if (cohortDate) {
      where.cohortDate = cohortDate;
    }

    const metrics = await this.prisma.retentionMetric.findMany({
      where,
    });

    const totalUsers = metrics.length;
    const day1Retention = metrics.filter((m) => m.day1).length;
    const day7Retention = metrics.filter((m) => m.day7).length;
    const day30Retention = metrics.filter((m) => m.day30).length;
    const day90Retention = metrics.filter((m) => m.day90).length;

    return {
      totalUsers,
      day1RetentionRate: totalUsers > 0 ? ((day1Retention / totalUsers) * 100).toFixed(2) : '0',
      day7RetentionRate: totalUsers > 0 ? ((day7Retention / totalUsers) * 100).toFixed(2) : '0',
      day30RetentionRate: totalUsers > 0 ? ((day30Retention / totalUsers) * 100).toFixed(2) : '0',
      day90RetentionRate: totalUsers > 0 ? ((day90Retention / totalUsers) * 100).toFixed(2) : '0',
    };
  }

  // Overall analytics dashboard
  async getDashboardAnalytics(userId: number, startDate?: Date, endDate?: Date) {
    const behaviorAnalytics = await this.getUserBehaviorAnalytics(userId, startDate, endDate);
    const sessionAnalytics = await this.getSessionAnalytics(userId);
    const retentionMetrics = await this.getRetentionMetrics();

    return {
      behavior: behaviorAnalytics,
      sessions: sessionAnalytics,
      retention: retentionMetrics,
    };
  }

  // Helper methods
  private detectDeviceType(userAgent?: string): string {
    if (!userAgent) return 'desktop';
    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    return 'desktop';
  }

  private detectBrowser(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    if (/chrome/i.test(userAgent)) return 'chrome';
    if (/firefox/i.test(userAgent)) return 'firefox';
    if (/safari/i.test(userAgent)) return 'safari';
    if (/edge/i.test(userAgent)) return 'edge';
    return 'unknown';
  }

  private detectOS(userAgent?: string): string {
    if (!userAgent) return 'unknown';
    if (/windows/i.test(userAgent)) return 'windows';
    if (/mac/i.test(userAgent)) return 'macos';
    if (/linux/i.test(userAgent)) return 'linux';
    if (/android/i.test(userAgent)) return 'android';
    if (/ios/i.test(userAgent)) return 'ios';
    return 'unknown';
  }
}
