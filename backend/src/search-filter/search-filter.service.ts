import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type DateFilterValue = string | Date;

export interface ProjectSearchFilters {
  technologies?: string[] | string;
  startDate?: DateFilterValue;
  endDate?: DateFilterValue;
  status?: string;
}

export interface ExperienceSearchFilters {
  startDate?: DateFilterValue;
  endDate?: DateFilterValue;
  currentPosition?: boolean | string;
}

export interface CertificateSearchFilters {
  organization?: string;
  startDate?: DateFilterValue;
  endDate?: DateFilterValue;
  expiryDate?: DateFilterValue;
}

export interface SkillSearchFilters {
  category?: string;
  proficiency?: string;
}

function parseDate(value: DateFilterValue): Date {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('Search date filters must be valid dates');
  }
  return date;
}

@Injectable()
export class SearchFilterService {
  constructor(private readonly prisma: PrismaService) {}

  async filterProjects(userId: number, filters: ProjectSearchFilters) {
    const where: Prisma.ProjectWhereInput = { userId };

    if (filters.technologies && filters.technologies.length > 0) {
      where.technologies = {
        hasSome: Array.isArray(filters.technologies)
          ? filters.technologies
          : [filters.technologies],
      };
    }

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) {
        where.startDate.gte = parseDate(filters.startDate);
      }
      if (filters.endDate) {
        where.startDate.lte = parseDate(filters.endDate);
      }
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const projects = await this.prisma.project.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });

    return {
      projects,
      count: projects.length,
      filters,
    };
  }

  async filterExperience(userId: number, filters: ExperienceSearchFilters) {
    const where: Prisma.ExperienceWhereInput = { userId };

    if (filters.startDate || filters.endDate) {
      where.startDate = {};
      if (filters.startDate) {
        where.startDate.gte = parseDate(filters.startDate);
      }
      if (filters.endDate) {
        where.startDate.lte = parseDate(filters.endDate);
      }
    }

    if (filters.currentPosition !== undefined) {
      if (filters.currentPosition === 'true' || filters.currentPosition === true) {
        where.currentJobStatus = true;
      } else if (filters.currentPosition === 'false' || filters.currentPosition === false) {
        where.currentJobStatus = false;
      } else {
        throw new BadRequestException('currentPosition must be true or false');
      }
    }

    const experiences = await this.prisma.experience.findMany({
      where,
      orderBy: { startDate: 'desc' },
    });

    return {
      experiences,
      count: experiences.length,
      filters,
    };
  }

  async filterCertificates(userId: number, filters: CertificateSearchFilters) {
    const where: Prisma.CertificateWhereInput = { userId };

    if (filters.organization) {
      where.issuingOrganization = {
        contains: filters.organization,
        mode: 'insensitive',
      };
    }

    if (filters.startDate || filters.endDate) {
      where.issueDate = {};
      if (filters.startDate) {
        where.issueDate.gte = parseDate(filters.startDate);
      }
      if (filters.endDate) {
        where.issueDate.lte = parseDate(filters.endDate);
      }
    }

    if (filters.expiryDate) {
      where.expiryDate = {
        lte: parseDate(filters.expiryDate),
      };
    }

    const certificates = await this.prisma.certificate.findMany({
      where,
      orderBy: { issueDate: 'desc' },
    });

    return {
      certificates,
      count: certificates.length,
      filters,
    };
  }

  async filterSkills(userId: number, filters: SkillSearchFilters) {
    const where: Prisma.SkillWhereInput = { userId };

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.proficiency) {
      where.level = filters.proficiency;
    }

    const skills = await this.prisma.skill.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return {
      skills,
      count: skills.length,
      filters,
    };
  }

  saveFilterPreset(
    userId: number,
    preset: {
      name: string;
      type: 'projects' | 'experience' | 'certificates' | 'skills';
      filters: Prisma.InputJsonValue;
    }
  ) {
    return this.prisma.filterPreset.create({
      data: {
        userId,
        ...preset,
      },
    });
  }

  getFilterPresets(userId: number, type?: string) {
    return this.prisma.filterPreset.findMany({
      where: {
        userId,
        ...(type ? { type } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  deleteFilterPreset(userId: number, presetId: number) {
    return this.prisma.filterPreset
      .deleteMany({
        where: {
          id: presetId,
          userId,
        },
      })
      .then(({ count }) => {
        if (count === 0) {
          throw new NotFoundException('Filter preset not found');
        }
        return { message: 'Filter preset deleted successfully' };
      });
  }

  async globalSearch(query: string, userId: number) {
    if (!query || query.trim().length === 0) {
      return { results: [], query, count: 0 };
    }

    const searchTerm = query.trim();

    // Search across multiple entities
    const [profiles, projects, skills, certificates, experiences] = await Promise.all([
      this.prisma.profile.findMany({
        where: {
          userId,
          OR: [{ fullName: { contains: searchTerm, mode: 'insensitive' } }],
        },
        take: 5,
      }),
      this.prisma.project.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { technologies: { hasSome: [searchTerm] } },
          ],
        },
        take: 5,
      }),
      this.prisma.skill.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.certificate.findMany({
        where: {
          userId,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { issuingOrganization: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      this.prisma.experience.findMany({
        where: {
          userId,
          OR: [
            { companyName: { contains: searchTerm, mode: 'insensitive' } },
            { position: { contains: searchTerm, mode: 'insensitive' } },
            { jobDescription: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    const results = [
      ...profiles.map((p) => ({
        type: 'profile',
        id: p.id,
        title: p.fullName,
        subtitle: '',
      })),
      ...projects.map((p) => ({
        type: 'project',
        id: p.id,
        title: p.title,
        subtitle: p.description?.substring(0, 100),
      })),
      ...skills.map((s) => ({ type: 'skill', id: s.id, title: s.name, subtitle: s.category })),
      ...certificates.map((c) => ({
        type: 'certificate',
        id: c.id,
        title: c.name,
        subtitle: c.issuingOrganization,
      })),
      ...experiences.map((e) => ({
        type: 'experience',
        id: e.id,
        title: e.position,
        subtitle: e.companyName,
      })),
    ];

    return {
      results,
      query,
      count: results.length,
    };
  }

  async saveSearchHistory(userId: number, query: string) {
    if (!query || query.trim().length === 0) {
      return null;
    }

    // Save to user behavior events or create a dedicated search history table
    await this.prisma.userBehaviorEvent.create({
      data: {
        userId,
        eventType: 'SEARCH',
        metadata: { query },
        sessionId: 'search-session',
      },
    });

    return { message: 'Search history saved' };
  }

  async getSearchHistory(userId: number, limit = 10) {
    const events = await this.prisma.userBehaviorEvent.findMany({
      where: {
        userId,
        eventType: 'SEARCH',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    const queries = events
      .map((event) => {
        const metadata = event.metadata;
        if (
          typeof metadata === 'object' &&
          metadata !== null &&
          !Array.isArray(metadata) &&
          typeof metadata.query === 'string'
        ) {
          return metadata.query;
        }
        return null;
      })
      .filter((query): query is string => query !== null);

    return {
      queries,
      count: queries.length,
    };
  }

  async clearSearchHistory(userId: number) {
    await this.prisma.userBehaviorEvent.deleteMany({
      where: {
        userId,
        eventType: 'SEARCH',
      },
    });

    return { message: 'Search history cleared' };
  }
}
