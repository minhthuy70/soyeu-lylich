import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { SortingService } from './sorting.service';

describe('SortingService', () => {
  let service: SortingService;
  const prisma = {
    project: { findMany: jest.fn() },
    experience: { findMany: jest.fn() },
    certificate: { findMany: jest.fn() },
    skill: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SortingService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<SortingService>(SortingService);
    jest.clearAllMocks();
  });

  it('scopes project sorting to the authenticated user', async () => {
    prisma.project.findMany.mockResolvedValue([]);

    await service.sortProjects(7, 'name', 'asc');

    expect(prisma.project.findMany).toHaveBeenCalledWith({
      where: { userId: 7 },
      orderBy: { title: 'asc' },
    });
  });

  it('sorts custom items by the configured fields', () => {
    const items = [{ name: 'Beta' }, { name: 'alpha' }, { name: 'Alpha 2' }];

    expect(service.customSort('projects', items, [{ field: 'name', order: 'asc' }])).toEqual([
      { name: 'alpha' },
      { name: 'Alpha 2' },
      { name: 'Beta' },
    ]);
  });

  it('rejects unsupported custom-sort entity types', () => {
    expect(() => service.customSort('users', [], [])).toThrow(BadRequestException);
  });
});
