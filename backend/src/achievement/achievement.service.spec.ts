import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AchievementService', () => {
  let service: AchievementService;
  let prisma: {
    achievement: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockAchievement = {
    id: 1,
    userId: 1,
    title: 'Giải Nhất Hackathon 2024',
    organization: 'Hiệp hội Phần mềm Vinasa',
    achievementDate: new Date('2024-05-15'),
    description: 'Xây dựng giải pháp AI hỗ trợ tự động hóa',
    evidenceUrl: 'https://vinasa.example.com/certificate/123',
    imageUrl: 'https://cdn.example.com/cert.png',
    category: 'Competition',
    level: 'National',
  };

  beforeEach(async () => {
    prisma = {
      achievement: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AchievementService>(AchievementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create achievement with default category and level if omitted', async () => {
      prisma.achievement.create.mockResolvedValue(mockAchievement);

      const dto = {
        title: 'Nhân viên xuất sắc',
        organization: 'FPT Software',
      };

      const result = await service.create(1, dto as any);

      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          title: 'Nhân viên xuất sắc',
          category: 'Other',
          level: 'School',
        }),
      });
      expect(result).toEqual(mockAchievement);
    });
  });

  describe('findAll', () => {
    it('should return achievements for a user ordered by date and createdAt', async () => {
      prisma.achievement.findMany.mockResolvedValue([mockAchievement]);

      const result = await service.findAll(1);

      expect(prisma.achievement.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toEqual({ achievements: [mockAchievement], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return achievement by id and userId', async () => {
      prisma.achievement.findFirst.mockResolvedValue(mockAchievement);

      const result = await service.findOne(1, 1);

      expect(prisma.achievement.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockAchievement);
    });

    it('should throw NotFoundException if achievement not found', async () => {
      prisma.achievement.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update achievement fields', async () => {
      prisma.achievement.findFirst.mockResolvedValue(mockAchievement);
      const updated = { ...mockAchievement, title: 'Giải Đặc Biệt' };
      prisma.achievement.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { title: 'Giải Đặc Biệt' } as any);

      expect(prisma.achievement.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ title: 'Giải Đặc Biệt' }),
      });
      expect(result.title).toBe('Giải Đặc Biệt');
    });

    it('should throw NotFoundException when updating non-existent achievement', async () => {
      prisma.achievement.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { title: 'New' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete achievement successfully', async () => {
      prisma.achievement.findFirst.mockResolvedValue(mockAchievement);
      prisma.achievement.delete.mockResolvedValue(mockAchievement);

      const result = await service.remove(1, 1);

      expect(prisma.achievement.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Đã xóa thành tích thành công' });
    });

    it('should throw NotFoundException when deleting non-existent achievement', async () => {
      prisma.achievement.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAchievementsByCategory', () => {
    it('should filter achievements by category', async () => {
      prisma.achievement.findMany.mockResolvedValue([mockAchievement]);

      const result = await service.getAchievementsByCategory(1, 'Competition');

      expect(prisma.achievement.findMany).toHaveBeenCalledWith({
        where: { userId: 1, category: 'Competition' },
        orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toEqual({ achievements: [mockAchievement], count: 1 });
    });
  });

  describe('getAchievementsByLevel', () => {
    it('should filter achievements by level', async () => {
      prisma.achievement.findMany.mockResolvedValue([mockAchievement]);

      const result = await service.getAchievementsByLevel(1, 'National');

      expect(prisma.achievement.findMany).toHaveBeenCalledWith({
        where: { userId: 1, level: 'National' },
        orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toEqual({ achievements: [mockAchievement], count: 1 });
    });
  });
});
