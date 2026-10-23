import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchFilterService {
  constructor(private readonly prisma: PrismaService) {}

  async filterProjects(filters: {
    technologies?: string[];
    startDate?: Date;
    endDate?: Date;
    status?: string;
  }) {
    const where: any = {};

    if (filters.technologies && filters.technologies.length > 0) {
      where.technologies = {
        hasSome: filters.technologies,
      };
    }

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) {
        where.startDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.startDate.lte = filters.endDate;
      }
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const projects = await this.prisma.project.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      projects,
      count: projects.length,
      filters,
    };
  }

  async filterExperience(filters: {
    startDate?: Date;
    endDate?: Date;
    currentPosition?: boolean;
  }) {
    const where: any = {};

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) {
        where.startDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.startDate.lte = filters.endDate;
      }
    }

    if (filters.currentPosition !== undefined) {
      where.currentPosition = filters.currentPosition;
    }

    const experiences = await this.prisma.experience.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      experiences,
      count: experiences.length,
      filters,
    };
  }

  async filterCertificates(filters: {
    organization?: string;
    startDate?: Date;
    endDate?: Date;
    expiryDate?: Date;
  }) {
    const where: any = {};

    if (filters.organization) {
      where.organization = {
        contains: filters.organization,
        mode: 'insensitive',
      };
    }

    if (filters.startDate || filters.endDate) {
      where.issueDate = {};
      if (filters.startDate) {
        where.issueDate.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.issueDate.lte = filters.endDate;
      }
    }

    if (filters.expiryDate) {
      where.expiryDate = {
        lte: filters.expiryDate,
      };
    }

    const certificates = await this.prisma.certificate.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { issueDate: 'desc' },
    });

    return {
      certificates,
      count: certificates.length,
      filters,
    };
  }

  async filterSkills(filters: {
    category?: string;
    proficiency?: string;
  }) {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.proficiency) {
      where.proficiency = filters.proficiency;
    }

    const skills = await this.prisma.skill.findMany({
      where,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return {
      skills,
      count: skills.length,
      filters,
    };
  }

  async saveFilterPreset(userId: number, preset: {
    name: string;
    type: 'projects' | 'experience' | 'certificates' | 'skills';
    filters: any;
  }) {
    const savedPreset = await this.prisma.filterPreset.create({
      data: {
        userId,
        name: preset.name,
        type: preset.type,
        filters: preset.filters,
      },
    });

    return savedPreset;
  }

  async getFilterPresets(userId: number, type?: string) {
    const where: any = { userId };

    if (type) {
      where.type = type;
    }

    const presets = await this.prisma.filterPreset.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return presets;
  }

  async deleteFilterPreset(userId: number, presetId: number) {
    const preset = await this.prisma.filterPreset.findFirst({
      where: { id: presetId, userId },
    });

    if (!preset) {
      throw new Error('Filter preset not found');
    }

    await this.prisma.filterPreset.delete({
      where: { id: presetId },
    });

    return { message: 'Filter preset deleted successfully' };
  }
}
