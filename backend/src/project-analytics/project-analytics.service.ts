import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  // Track project view
  async trackProjectView(
    projectId: number,
    metadata?: {
      viewerIp?: string;
      userAgent?: string;
    }
  ) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.projectView.create({
      data: {
        projectId,
        viewerIp: metadata?.viewerIp || 'unknown',
        viewerUserAgent: metadata?.userAgent || 'unknown',
      },
    });

    return { message: 'View tracked successfully' };
  }

  // Track project click (github, demo, image)
  async trackProjectClick(projectId: number, clickType: string, clickUrl?: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.projectClick.create({
      data: {
        projectId,
        clickType,
        clickUrl,
      },
    });

    return { message: 'Click tracked successfully' };
  }

  // Get project analytics
  async getProjectAnalytics(
    userId: number,
    projectId?: number,
    period: 'week' | 'month' | 'year' = 'month'
  ) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const whereClause: any = {
      viewedAt: { gte: startDate },
    };

    if (projectId) {
      // Verify project belongs to user
      const project = await this.prisma.project.findFirst({
        where: { id: projectId, userId },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      whereClause.projectId = projectId;
    } else {
      // Get all user's projects
      const userProjects = await this.prisma.project.findMany({
        where: { userId },
        select: { id: true },
      });
      whereClause.projectId = { in: userProjects.map((p) => p.id) };
    }

    const views = await this.prisma.projectView.findMany({
      where: whereClause,
    });

    const clicks = await this.prisma.projectClick.findMany({
      where: {
        projectId: projectId || { in: whereClause.projectId.in },
        clickedAt: { gte: startDate },
      },
    });

    // Calculate analytics
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.viewerIp)).size;
    const totalClicks = clicks.length;

    // Click breakdown by type
    const clickBreakdown = clicks.reduce(
      (acc, click) => {
        acc[click.clickType] = (acc[click.clickType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Most viewed projects
    const viewsByProject = views.reduce(
      (acc, view) => {
        acc[view.projectId] = (acc[view.projectId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const mostViewedProjectIds = Object.entries(viewsByProject)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id]) => parseInt(id));

    const mostViewedProjects = await this.prisma.project.findMany({
      where: { id: { in: mostViewedProjectIds } },
      select: {
        id: true,
        title: true,
      },
    });

    return {
      period,
      startDate,
      endDate: now,
      totalViews,
      uniqueVisitors,
      totalClicks,
      clickBreakdown,
      mostViewedProjects: mostViewedProjects.map((p) => ({
        ...p,
        viewCount: viewsByProject[p.id],
      })),
    };
  }

  // Get most viewed projects across all projects
  async getMostViewedProjects(userId: number, limit: number = 5) {
    const userProjects = await this.prisma.project.findMany({
      where: { userId },
      select: { id: true },
    });

    const views = await this.prisma.projectView.findMany({
      where: {
        projectId: { in: userProjects.map((p) => p.id) },
      },
    });

    const viewsByProject = views.reduce(
      (acc, view) => {
        acc[view.projectId] = (acc[view.projectId] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const sortedProjectIds = Object.entries(viewsByProject)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id]) => parseInt(id));

    const projects = await this.prisma.project.findMany({
      where: { id: { in: sortedProjectIds } },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
      },
    });

    return projects.map((p) => ({
      ...p,
      viewCount: viewsByProject[p.id],
    }));
  }
}
