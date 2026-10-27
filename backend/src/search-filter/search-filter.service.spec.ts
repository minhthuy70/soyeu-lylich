import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFilterService } from './search-filter.service';

describe('SearchFilterService', () => {
  let service: SearchFilterService;
  const prisma = {
    project: { findMany: jest.fn() },
    experience: { findMany: jest.fn() },
    certificate: { findMany: jest.fn() },
    skill: { findMany: jest.fn() },
    filterPreset: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    userBehaviorEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchFilterService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SearchFilterService>(SearchFilterService);
    jest.clearAllMocks();
  });

  it('scopes project filters to the authenticated user and parses query filters', async () => {
    prisma.project.findMany.mockResolvedValue([]);

    await service.filterProjects(7, {
      technologies: 'TypeScript',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
    });

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: {
        userId: 7,
        technologies: { hasSome: ['TypeScript'] },
        startDate: {
          gte: new Date('2024-01-01'),
          lte: new Date('2024-12-31'),
        },
      },
      orderBy: { startDate: 'desc' },
    });
  });

  it('maps current-position filters to the persisted field', async () => {
    prisma.experience.findMany.mockResolvedValue([]);

    await service.filterExperience(9, { currentPosition: 'true' });

    expect(prisma.experience.findMany).toHaveBeenCalledWith({
      where: { userId: 9, currentJobStatus: true },
      orderBy: { startDate: 'desc' },
    });
  });

  it('persists presets for the authenticated user', async () => {
    const preset = {
      name: 'Recent projects',
      type: 'projects' as const,
      filters: { status: 'Completed' },
    };

    await service.saveFilterPreset(3, preset);

    expect(prisma.filterPreset.create).toHaveBeenCalledWith({
      data: { userId: 3, ...preset },
    });
  });

  it("prevents deleting another user's preset", async () => {
    prisma.filterPreset.deleteMany.mockResolvedValue({ count: 0 });

    await expect(service.deleteFilterPreset(4, 12)).rejects.toThrow(NotFoundException);
    expect(prisma.filterPreset.deleteMany).toHaveBeenCalledWith({
      where: { id: 12, userId: 4 },
    });
  });
});
