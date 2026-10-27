import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { VolunteerExperienceService } from './volunteer-experience.service';
import { PrismaService } from '../prisma/prisma.service';

describe('VolunteerExperienceService', () => {
  let service: VolunteerExperienceService;
  let prisma: {
    volunteerExperience: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockVolunteer = {
    id: 1,
    userId: 1,
    organization: 'Hội Chữ Thập Đỏ',
    role: 'Tình nguyện viên',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-06-30'),
    isCurrent: false,
    description: 'Hỗ trợ các hoạt động cộng đồng',
    responsibilities: ['Phân phát nhu yếu phẩm'],
    achievements: ['Giấy khen tình nguyện viên xuất sắc'],
    hoursPerWeek: 5,
    cause: 'Cộng đồng & Xã hội',
  };

  beforeEach(async () => {
    prisma = {
      volunteerExperience: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VolunteerExperienceService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<VolunteerExperienceService>(VolunteerExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create volunteer experience record', async () => {
      prisma.volunteerExperience.create.mockResolvedValue(mockVolunteer);

      const dto = {
        organization: 'Hội Chữ Thập Đỏ',
        role: 'Tình nguyện viên',
        startDate: '2023-01-01',
        hoursPerWeek: 5,
      };

      const result = await service.create(1, dto);

      expect(prisma.volunteerExperience.create).toHaveBeenCalled();
      expect(result).toEqual(mockVolunteer);
    });
  });

  describe('findAll', () => {
    it('should return all volunteer experiences for user', async () => {
      prisma.volunteerExperience.findMany.mockResolvedValue([mockVolunteer]);

      const result = await service.findAll(1);

      expect(prisma.volunteerExperience.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ volunteerExperiences: [mockVolunteer], count: 1 });
    });

    it('should filter by cause when provided', async () => {
      prisma.volunteerExperience.findMany.mockResolvedValue([mockVolunteer]);

      await service.findAll(1, 'Cộng đồng & Xã hội');

      expect(prisma.volunteerExperience.findMany).toHaveBeenCalledWith({
        where: { userId: 1, cause: 'Cộng đồng & Xã hội' },
        orderBy: [{ startDate: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return volunteer experience if found', async () => {
      prisma.volunteerExperience.findFirst.mockResolvedValue(mockVolunteer);

      const result = await service.findOne(1, 1);

      expect(prisma.volunteerExperience.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockVolunteer);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.volunteerExperience.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update volunteer experience if found', async () => {
      prisma.volunteerExperience.findFirst.mockResolvedValue(mockVolunteer);
      const updated = { ...mockVolunteer, hoursPerWeek: 10 };
      prisma.volunteerExperience.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { hoursPerWeek: 10 });

      expect(prisma.volunteerExperience.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ hoursPerWeek: 10 }),
      });
      expect(result.hoursPerWeek).toBe(10);
    });

    it('should throw NotFoundException when updating non-existent record', async () => {
      prisma.volunteerExperience.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { role: 'Lead' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete volunteer experience', async () => {
      prisma.volunteerExperience.findFirst.mockResolvedValue(mockVolunteer);
      prisma.volunteerExperience.delete.mockResolvedValue(mockVolunteer);

      const result = await service.remove(1, 1);

      expect(prisma.volunteerExperience.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Đã xóa kinh nghiệm tình nguyện thành công' });
    });

    it('should throw NotFoundException when deleting non-existent record', async () => {
      prisma.volunteerExperience.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTotalHours', () => {
    it('should calculate total hours based on weeks and hoursPerWeek', async () => {
      prisma.volunteerExperience.findMany.mockResolvedValue([mockVolunteer]);

      const result = await service.getTotalHours(1);

      expect(result.totalHours).toBeGreaterThan(0);
    });

    it('should handle record without hoursPerWeek', async () => {
      prisma.volunteerExperience.findMany.mockResolvedValue([{ ...mockVolunteer, hoursPerWeek: null }]);

      const result = await service.getTotalHours(1);

      expect(result.totalHours).toBe(0);
    });
  });

  describe('getByCause', () => {
    it('should group and count volunteer experiences by cause', async () => {
      prisma.volunteerExperience.findMany.mockResolvedValue([
        mockVolunteer,
        { ...mockVolunteer, id: 2, cause: 'Giáo dục' },
        { ...mockVolunteer, id: 3, cause: 'Cộng đồng & Xã hội' },
      ]);

      const result = await service.getByCause(1);

      expect(result.causes).toEqual(
        expect.arrayContaining([
          { cause: 'Cộng đồng & Xã hội', count: 2 },
          { cause: 'Giáo dục', count: 1 },
        ])
      );
    });
  });
});
