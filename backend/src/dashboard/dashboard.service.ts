import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getActivityFeed(userId: number, limit = 20) {
    const activities = await this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      activities,
      count: activities.length,
    };
  }

  async getResumeViewStatistics(resumeId: number, period: 'week' | 'month' | 'year' = 'month') {
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

    const views = await this.prisma.resumeView.findMany({
      where: {
        resumeId,
        viewedAt: { gte: startDate },
      },
      orderBy: { viewedAt: 'asc' },
    });

    // Group by date for chart data
    const viewsByDate = views.reduce(
      (acc, view) => {
        const date = view.viewedAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const chartData = Object.entries(viewsByDate).map(([date, count]) => ({
      date,
      count,
    }));

    return {
      totalViews: views.length,
      chartData,
      period,
      startDate,
      endDate: now,
    };
  }

  async getTopViewedSections(resumeId: number, limit = 10) {
    // Mock implementation - track which sections are viewed most
    // In production, this would be tracked via analytics events
    const topSections = [
      { section: 'Experience', views: 45 },
      { section: 'Projects', views: 38 },
      { section: 'Skills', views: 32 },
      { section: 'Education', views: 28 },
      { section: 'Certificates', views: 15 },
    ];

    return {
      topSections: topSections.slice(0, limit),
    };
  }

  async getCompletionSuggestions(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const suggestions: Array<{ type: string; message: string; priority: string; resumeId?: number }> = [];

    // Check resume completeness
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
    });

    if (resumes.length === 0) {
      suggestions.push({
        type: 'resume',
        message: 'Create your first resume',
        priority: 'high',
      });
    }

    // Check for experience
    const experiences = await this.prisma.experience.findMany({
      where: { userId },
    });

    if (experiences.length === 0) {
      suggestions.push({
        type: 'experience',
        message: 'Add work experience',
        priority: 'medium',
      });
    }

    // Check for projects
    const projects = await this.prisma.project.findMany({
      where: { userId },
    });

    if (projects.length === 0) {
      suggestions.push({
        type: 'project',
        message: 'Add projects',
        priority: 'medium',
      });
    }

    // Check for skills
    const skills = await this.prisma.skill.findMany({
      where: { userId },
    });

    if (skills.length === 0) {
      suggestions.push({
        type: 'skill',
        message: 'Add skills',
        priority: 'medium',
      });
    }

    // Check for certificates
    const certificates = await this.prisma.certificate.findMany({
      where: { userId },
    });

    if (certificates.length === 0) {
      suggestions.push({
        type: 'certificate',
        message: 'Add certificates',
        priority: 'low',
      });
    }

    return {
      suggestions,
      count: suggestions.length,
    };
  }

  async getCompletionScore(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    let totalScore = 0;
    let maxScore = 100;

    // Profile completion (20 points) - check if profile exists separately
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (profile) {
      totalScore += 20;
    }

    // Resume existence (10 points)
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
    });
    if (resumes.length > 0) {
      totalScore += 10;
    }

    // Experience (20 points)
    const experiences = await this.prisma.experience.findMany({
      where: { userId },
    });
    if (experiences.length > 0) {
      totalScore += 20;
    }

    // Projects (15 points)
    const projects = await this.prisma.project.findMany({
      where: { userId },
    });
    if (projects.length > 0) {
      totalScore += 15;
    }

    // Skills (15 points)
    const skills = await this.prisma.skill.findMany({
      where: { userId },
    });
    if (skills.length > 0) {
      totalScore += 15;
    }

    // Education (10 points)
    const educations = await this.prisma.education.findMany({
      where: { userId },
    });
    if (educations.length > 0) {
      totalScore += 10;
    }

    // Certificates (10 points)
    const certificates = await this.prisma.certificate.findMany({
      where: { userId },
    });
    if (certificates.length > 0) {
      totalScore += 10;
    }

    return {
      score: totalScore,
      maxScore,
      percentage: Math.round((totalScore / maxScore) * 100),
      level: this.getCompletionLevel(totalScore),
    };
  }

  private getCompletionLevel(score: number): string {
    if (score >= 90) return 'Expert';
    if (score >= 70) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    if (score >= 30) return 'Beginner';
    return 'Starter';
  }

  async getDashboardOverview(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const completion = await this.getCompletionScore(userId);

    // Get counts separately
    const [resumes, educations, experiences, projects, skills, certificates] = await Promise.all([
      this.prisma.resume.count({ where: { userId } }),
      this.prisma.education.count({ where: { userId } }),
      this.prisma.experience.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.skill.count({ where: { userId } }),
      this.prisma.certificate.count({ where: { userId } }),
    ]);

    return {
      userId,
      completionPercentage: completion.percentage,
      resumeStatus: resumes > 0 ? 'active' : 'not_created',
      educationCount: educations,
      experienceCount: experiences,
      projectCount: projects,
      skillCount: skills,
      certificateCount: certificates,
      completionLevel: completion.level,
      completionScore: completion.score,
    };
  }

  async getUpcomingCertificateExpiry(userId: number, days = 30) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const certificates = await this.prisma.certificate.findMany({
      where: {
        userId,
        expiryDate: {
          lte: expiryDate,
          gte: new Date(),
        },
      },
      orderBy: { expiryDate: 'asc' },
    });

    return {
      certificates,
      count: certificates.length,
      daysThreshold: days,
    };
  }

  async getVisitorGeography(resumeId: number, period: 'week' | 'month' | 'year' = 'month') {
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

    const views = await this.prisma.resumeView.findMany({
      where: {
        resumeId,
        viewedAt: { gte: startDate },
      },
    });

    // Mock geography data - in production, this would come from IP geolocation
    const geography = [
      { country: 'Vietnam', views: Math.floor(views.length * 0.6) },
      { country: 'United States', views: Math.floor(views.length * 0.15) },
      { country: 'Singapore', views: Math.floor(views.length * 0.1) },
      { country: 'Japan', views: Math.floor(views.length * 0.08) },
      { country: 'Other', views: Math.floor(views.length * 0.07) },
    ];

    return {
      geography,
      totalViews: views.length,
      period,
    };
  }

  async getDeviceBreakdown(resumeId: number, period: 'week' | 'month' | 'year' = 'month') {
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

    const views = await this.prisma.resumeView.findMany({
      where: {
        resumeId,
        viewedAt: { gte: startDate },
      },
    });

    // Mock device data - in production, this would come from user agent analysis
    const devices = [
      { device: 'Desktop', views: Math.floor(views.length * 0.55) },
      { device: 'Mobile', views: Math.floor(views.length * 0.35) },
      { device: 'Tablet', views: Math.floor(views.length * 0.1) },
    ];

    return {
      devices,
      totalViews: views.length,
      period,
    };
  }

  async getReferralSources(resumeId: number, period: 'week' | 'month' | 'year' = 'month') {
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

    const views = await this.prisma.resumeView.findMany({
      where: {
        resumeId,
        viewedAt: { gte: startDate },
      },
    });

    // Mock referral data - in production, this would come from referrer header
    const referrals = [
      { source: 'Direct', views: Math.floor(views.length * 0.4) },
      { source: 'Google', views: Math.floor(views.length * 0.3) },
      { source: 'LinkedIn', views: Math.floor(views.length * 0.15) },
      { source: 'Facebook', views: Math.floor(views.length * 0.1) },
      { source: 'Other', views: Math.floor(views.length * 0.05) },
    ];

    return {
      referrals,
      totalViews: views.length,
      period,
    };
  }

  async getSectionCompletionStatus(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    // Get counts separately
    const [resumes, experiences, projects, skills, educations, certificates, achievements, publications] = await Promise.all([
      this.prisma.resume.count({ where: { userId } }),
      this.prisma.experience.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.skill.count({ where: { userId } }),
      this.prisma.education.count({ where: { userId } }),
      this.prisma.certificate.count({ where: { userId } }),
      this.prisma.achievement.count({ where: { userId } }),
      this.prisma.publication.count({ where: { userId } }),
    ]);

    const sections = [
      {
        name: 'Profile',
        completed: !!profile,
        items: profile ? 1 : 0,
        total: 1,
      },
      {
        name: 'Resume',
        completed: resumes > 0,
        items: resumes,
        total: 1,
      },
      {
        name: 'Experience',
        completed: experiences > 0,
        items: experiences,
        total: 3,
      },
      {
        name: 'Projects',
        completed: projects > 0,
        items: projects,
        total: 3,
      },
      {
        name: 'Skills',
        completed: skills > 0,
        items: skills,
        total: 5,
      },
      {
        name: 'Education',
        completed: educations > 0,
        items: educations,
        total: 2,
      },
      {
        name: 'Certificates',
        completed: certificates > 0,
        items: certificates,
        total: 2,
      },
      {
        name: 'Achievements',
        completed: achievements > 0,
        items: achievements,
        total: 2,
      },
      {
        name: 'Publications',
        completed: publications > 0,
        items: publications,
        total: 1,
      },
    ];

    return {
      sections,
      totalSections: sections.length,
      completedSections: sections.filter((s) => s.completed).length,
    };
  }
}
