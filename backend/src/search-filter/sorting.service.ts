import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type SortBy = 'date' | 'name' | 'relevance';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

function getSortValue(item: unknown, field: string): unknown {
  if (typeof item !== 'object' || item === null || !Object.hasOwn(item, field)) {
    return undefined;
  }
  return (item as Record<string, unknown>)[field];
}

function compareValues(left: unknown, right: unknown): number {
  if (left === right) {
    return 0;
  }
  if (left === null || left === undefined) {
    return -1;
  }
  if (right === null || right === undefined) {
    return 1;
  }
  if (left instanceof Date && right instanceof Date) {
    return left.getTime() - right.getTime();
  }
  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }
  const leftText = typeof left === 'string' ? left : (JSON.stringify(left) ?? '');
  const rightText = typeof right === 'string' ? right : (JSON.stringify(right) ?? '');
  return leftText.localeCompare(rightText, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

@Injectable()
export class SortingService {
  constructor(private readonly prisma: PrismaService) {}

  async sortProjects(userId: number, sortBy: SortBy, order: SortOrder = 'desc') {
    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};

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
      where: { userId },
      orderBy,
    });

    return {
      projects,
      count: projects.length,
      sortBy,
      order,
    };
  }

  async sortExperience(userId: number, sortBy: SortBy, order: SortOrder = 'desc') {
    const orderBy: Prisma.ExperienceOrderByWithRelationInput = {};

    switch (sortBy) {
      case 'date':
        orderBy.startDate = order;
        break;
      case 'name':
        orderBy.companyName = order;
        break;
      case 'relevance':
        orderBy.startDate = 'desc';
        break;
      default:
        orderBy.startDate = 'desc';
    }

    const experiences = await this.prisma.experience.findMany({
      where: { userId },
      orderBy,
    });

    return {
      experiences,
      count: experiences.length,
      sortBy,
      order,
    };
  }

  async sortCertificates(userId: number, sortBy: SortBy, order: SortOrder = 'desc') {
    const orderBy: Prisma.CertificateOrderByWithRelationInput = {};

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
      where: { userId },
      orderBy,
    });

    return {
      certificates,
      count: certificates.length,
      sortBy,
      order,
    };
  }

  async sortSkills(userId: number, sortBy: SortBy, order: SortOrder = 'desc') {
    const orderBy: Prisma.SkillOrderByWithRelationInput = {};

    switch (sortBy) {
      case 'date':
        orderBy.createdAt = order;
        break;
      case 'name':
        orderBy.name = order;
        break;
      case 'relevance':
        orderBy.level = 'desc';
        break;
      default:
        orderBy.name = 'asc';
    }

    const skills = await this.prisma.skill.findMany({
      where: { userId },
      orderBy,
    });

    return {
      skills,
      count: skills.length,
      sortBy,
      order,
    };
  }

  customSort(entityType: string, items: unknown[], sortConfig: SortConfig[]) {
    if (!['projects', 'experience', 'certificates', 'skills'].includes(entityType)) {
      throw new BadRequestException('Unsupported entity type');
    }

    // Apply custom sort order based on multiple fields
    return items.sort((a, b) => {
      for (const config of sortConfig) {
        const comparison = compareValues(
          getSortValue(a, config.field),
          getSortValue(b, config.field)
        );
        if (comparison !== 0) {
          return config.order === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }
}
