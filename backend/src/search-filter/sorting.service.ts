import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SortingService {
  constructor(private readonly prisma: PrismaService) {}

  async sortProjects(sortBy: 'date' | 'name' | 'relevance', order: 'asc' | 'desc' = 'desc') {
    const orderBy: any = {};

    switch (sortBy) {
      case 'date':
        orderBy.startDate = order;
        break;
      case 'name':
        orderBy.title = order;
        break;
      case 'relevance':
        // For relevance, we'll sort by a combination of factors
        // This is a simplified implementation
        orderBy.startDate = 'desc';
        break;
      default:
        orderBy.startDate = 'desc';
    }

    const projects = await this.prisma.project.findMany({
      orderBy,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      projects,
      count: projects.length,
      sortBy,
      order,
    };
  }

  async sortExperience(sortBy: 'date' | 'name' | 'relevance', order: 'asc' | 'desc' = 'desc') {
    const orderBy: any = {};

    switch (sortBy) {
      case 'date':
        orderBy.startDate = order;
        break;
      case 'name':
        orderBy.company = order;
        break;
      case 'relevance':
        orderBy.startDate = 'desc';
        break;
      default:
        orderBy.startDate = 'desc';
    }

    const experiences = await this.prisma.experience.findMany({
      orderBy,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      experiences,
      count: experiences.length,
      sortBy,
      order,
    };
  }

  async sortCertificates(sortBy: 'date' | 'name' | 'relevance', order: 'asc' | 'desc' = 'desc') {
    const orderBy: any = {};

    switch (sortBy) {
      case 'date':
        orderBy.issueDate = order;
        break;
      case 'name':
        orderBy.name = order;
        break;
      case 'relevance':
        orderBy.expiryDate = 'asc';
        break;
      default:
        orderBy.issueDate = 'desc';
    }

    const certificates = await this.prisma.certificate.findMany({
      orderBy,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      certificates,
      count: certificates.length,
      sortBy,
      order,
    };
  }

  async sortSkills(sortBy: 'date' | 'name' | 'relevance', order: 'asc' | 'desc' = 'desc') {
    const orderBy: any = {};

    switch (sortBy) {
      case 'date':
        orderBy.createdAt = order;
        break;
      case 'name':
        orderBy.name = order;
        break;
      case 'relevance':
        orderBy.proficiency = 'desc';
        break;
      default:
        orderBy.name = 'asc';
    }

    const skills = await this.prisma.skill.findMany({
      orderBy,
      include: {
        resume: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      skills,
      count: skills.length,
      sortBy,
      order,
    };
  }

  async customSort(
    entityType: string,
    items: any[],
    sortConfig: { field: string; order: 'asc' | 'desc' }[]
  ) {
    // Apply custom sort order based on multiple fields
    return items.sort((a, b) => {
      for (const config of sortConfig) {
        const aVal = a[config.field];
        const bVal = b[config.field];

        if (aVal < bVal) return config.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return config.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
