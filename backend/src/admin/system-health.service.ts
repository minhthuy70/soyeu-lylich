import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemHealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemHealth() {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers24h,
      totalResumes,
      totalProjects,
      totalViews,
      recentRegistrations,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: { gte: last24Hours },
        },
      }),
      this.prisma.resume.count(),
      this.prisma.project.count(),
      this.prisma.resumeView.count(),
      this.prisma.user.count({
        where: {
          createdAt: { gte: last24Hours },
        },
      }),
    ]);

    // Calculate system load (mock)
    const systemLoad = {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      disk: Math.random() * 100,
    };

    // Database health check
    const dbHealth = await this.checkDatabaseHealth();

    return {
      status: this.calculateOverallStatus(systemLoad, dbHealth),
      timestamp: now.toISOString(),
      metrics: {
        users: {
          total: totalUsers,
          active24h: activeUsers24h,
          growthRate: totalUsers > 0 ? (activeUsers24h / totalUsers) * 100 : 0,
        },
        content: {
          resumes: totalResumes,
          projects: totalProjects,
          views: totalViews,
        },
        system: {
          load: systemLoad,
          database: dbHealth,
          errors24h: 0,
        },
      },
    };
  }

  private async checkDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        latency: Math.random() * 100, // Mock latency
        connections: Math.floor(Math.random() * 100),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  private calculateOverallStatus(systemLoad, dbHealth) {
    if (dbHealth.status !== 'healthy') return 'critical';
    if (systemLoad.cpu > 90 || systemLoad.memory > 90) return 'warning';
    if (systemLoad.cpu > 70 || systemLoad.memory > 70) return 'degraded';
    return 'healthy';
  }
}
