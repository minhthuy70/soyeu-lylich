import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ExperienceService', () => {
  let service: ExperienceService;
  let prisma: {
    experience: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockExperience = {
    id: 1,
    userId: 1,
    companyName: 'Công ty Công nghệ ABC',
    position: 'Senior Software Engineer',
    employmentType: 'Toàn thời gian',
    startDate: new Date('2022-01-01'),
    endDate: null,
    currentJobStatus: true,
    jobDescription: 'Phát triển kiến trúc backend',
    responsibilities: ['Xây dựng microservices', 'Thiết kế REST API'],
    achievements: ['Tối ưu hóa query giảm 50% latency'],
    technologiesUsed: ['NestJS', 'PostgreSQL', 'Docker'],
    companyWebsite: 'https://abc.example.com',
    companyLogo: null,
    workLocation: 'Hà Nội',
    workType: 'Hybrid',
    salaryRange: '30-40M',
    reasonForLeaving: null,
    supervisorName: 'Trưởng phòng Kỹ thuật',
  };

  beforeEach(async () => {
    prisma = {
      experience: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return experience record', async () => {
      prisma.experience.create.mockResolvedValue(mockExperience);

      const dto = {
        companyName: 'Công ty Công nghệ ABC',
        position: 'Senior Software Engineer',
        employmentType: 'Toàn thời gian',
        startDate: '2022-01-01',
        currentJobStatus: true,
      };

      const result = await service.create(1, dto);

      expect(prisma.experience.create).toHaveBeenCalled();
      expect(result).toEqual(mockExperience);
    });
  });

  describe('findAll', () => {
    it('should return all experiences for user', async () => {
      prisma.experience.findMany.mockResolvedValue([mockExperience]);

      const result = await service.findAll(1);

      expect(prisma.experience.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ experiences: [mockExperience], count: 1 });
    });

    it('should filter by employmentType when given', async () => {
      prisma.experience.findMany.mockResolvedValue([mockExperience]);

      await service.findAll(1, 'Toàn thời gian');

      expect(prisma.experience.findMany).toHaveBeenCalledWith({
        where: { userId: 1, employmentType: 'Toàn thời gian' },
        orderBy: [{ startDate: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return experience if found', async () => {
      prisma.experience.findFirst.mockResolvedValue(mockExperience);

      const result = await service.findOne(1, 1);

      expect(prisma.experience.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockExperience);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.experience.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update experience if found', async () => {
      prisma.experience.findFirst.mockResolvedValue(mockExperience);
      const updated = { ...mockExperience, position: 'Lead Engineer' };
      prisma.experience.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { position: 'Lead Engineer' });

      expect(prisma.experience.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ position: 'Lead Engineer' }),
      });
      expect(result.position).toBe('Lead Engineer');
    });

    it('should throw NotFoundException if updating non-existent record', async () => {
      prisma.experience.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { position: 'Lead' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete experience if found', async () => {
      prisma.experience.findFirst.mockResolvedValue(mockExperience);
      prisma.experience.delete.mockResolvedValue(mockExperience);

      const result = await service.remove(1, 1);

      expect(prisma.experience.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Đã xóa kinh nghiệm làm việc thành công' });
    });

    it('should throw NotFoundException if deleting non-existent record', async () => {
      prisma.experience.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCurrentJobs', () => {
    it('should return only current active jobs', async () => {
      prisma.experience.findMany.mockResolvedValue([mockExperience]);

      const result = await service.getCurrentJobs(1);

      expect(prisma.experience.findMany).toHaveBeenCalledWith({
        where: { userId: 1, currentJobStatus: true },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ currentJobs: [mockExperience], count: 1 });
    });
  });

  describe('getTimeline', () => {
    it('should map experiences into timeline structure', async () => {
      prisma.experience.findMany.mockResolvedValue([mockExperience]);

      const result = await service.getTimeline(1);

      expect(result.timeline).toHaveLength(1);
      expect(result.timeline[0]).toEqual({
        id: mockExperience.id,
        companyName: mockExperience.companyName,
        position: mockExperience.position,
        startDate: mockExperience.startDate,
        endDate: mockExperience.endDate,
        currentJobStatus: mockExperience.currentJobStatus,
        workType: mockExperience.workType,
        technologiesUsed: mockExperience.technologiesUsed,
      });
    });
  });
});
