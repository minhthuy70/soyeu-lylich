import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FreelanceService', () => {
  let service: FreelanceService;
  let prisma: {
    freelanceProject: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockFreelance = {
    id: 1,
    userId: 1,
    clientName: 'TechCorp USA',
    projectScope: 'E-commerce platform backend rebuild',
    rate: '$50/hr',
    budget: '$5,000',
    duration: '2 months',
    startDate: new Date('2023-05-01'),
    endDate: new Date('2023-07-01'),
    technologies: ['NestJS', 'PostgreSQL', 'Stripe'],
    outcome: 'Increased system throughput by 300%',
    description: 'Delivered high-performance API for marketplace checkout',
  };

  beforeEach(async () => {
    prisma = {
      freelanceProject: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreelanceService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<FreelanceService>(FreelanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create freelance project', async () => {
      prisma.freelanceProject.create.mockResolvedValue(mockFreelance);

      const dto = {
        clientName: 'TechCorp USA',
        projectScope: 'E-commerce platform backend',
        startDate: '2023-05-01',
      };

      const result = await service.create(1, dto);

      expect(prisma.freelanceProject.create).toHaveBeenCalled();
      expect(result).toEqual(mockFreelance);
    });
  });

  describe('findAll', () => {
    it('should return all freelance projects for user', async () => {
      prisma.freelanceProject.findMany.mockResolvedValue([mockFreelance]);

      const result = await service.findAll(1);

      expect(prisma.freelanceProject.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ freelanceProjects: [mockFreelance], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return freelance project if found', async () => {
      prisma.freelanceProject.findFirst.mockResolvedValue(mockFreelance);

      const result = await service.findOne(1, 1);

      expect(prisma.freelanceProject.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockFreelance);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.freelanceProject.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update freelance project if found', async () => {
      prisma.freelanceProject.findFirst.mockResolvedValue(mockFreelance);
      const updated = { ...mockFreelance, budget: '$6,000' };
      prisma.freelanceProject.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { budget: '$6,000' });

      expect(prisma.freelanceProject.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ budget: '$6,000' }),
      });
      expect(result.budget).toBe('$6,000');
    });

    it('should throw NotFoundException when updating non-existent project', async () => {
      prisma.freelanceProject.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { rate: '100' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete freelance project if found', async () => {
      prisma.freelanceProject.findFirst.mockResolvedValue(mockFreelance);
      prisma.freelanceProject.delete.mockResolvedValue(mockFreelance);

      const result = await service.remove(1, 1);

      expect(prisma.freelanceProject.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Đã xóa dự án freelance thành công' });
    });

    it('should throw NotFoundException when deleting non-existent project', async () => {
      prisma.freelanceProject.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTotalEarnings', () => {
    it('should calculate total earnings from numeric budget fields', async () => {
      prisma.freelanceProject.findMany.mockResolvedValue([
        mockFreelance,
        { ...mockFreelance, id: 2, budget: '2500 USD' },
      ]);

      const result = await service.getTotalEarnings(1);

      expect(result.totalEarnings).toBe(7500);
    });

    it('should ignore null or non-numeric budgets', async () => {
      prisma.freelanceProject.findMany.mockResolvedValue([
        { ...mockFreelance, budget: null },
        { ...mockFreelance, budget: 'N/A' },
      ]);

      const result = await service.getTotalEarnings(1);

      expect(result.totalEarnings).toBe(0);
    });
  });

  describe('getByClient', () => {
    it('should filter projects by client name', async () => {
      prisma.freelanceProject.findMany.mockResolvedValue([mockFreelance]);

      const result = await service.getByClient(1, 'TechCorp');

      expect(prisma.freelanceProject.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          clientName: { contains: 'TechCorp', mode: 'insensitive' },
        },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ freelanceProjects: [mockFreelance], count: 1 });
    });
  });
});
