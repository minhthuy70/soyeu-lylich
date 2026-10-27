import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SoftSkillService } from './soft-skill.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SoftSkillService', () => {
  let service: SoftSkillService;
  let prisma: {
    softSkill: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockSoftSkill = {
    id: 1,
    userId: 1,
    name: 'Leadership & Team Management',
    level: 'Advanced',
    description: 'Experienced in leading agile cross-functional teams',
    progress: 85,
  };

  beforeEach(async () => {
    prisma = {
      softSkill: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SoftSkillService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<SoftSkillService>(SoftSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create soft skill with default progress when omitted', async () => {
      prisma.softSkill.create.mockResolvedValue(mockSoftSkill);

      const result = await service.create(1, { name: 'Leadership & Team Management' });

      expect(prisma.softSkill.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          name: 'Leadership & Team Management',
          progress: 0,
        }),
      });
      expect(result).toEqual(mockSoftSkill);
    });
  });

  describe('findAll', () => {
    it('should return list of soft skills ordered by progress and name', async () => {
      prisma.softSkill.findMany.mockResolvedValue([mockSoftSkill]);

      const result = await service.findAll(1);

      expect(prisma.softSkill.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ progress: 'desc' }, { name: 'asc' }],
      });
      expect(result).toEqual({ skills: [mockSoftSkill], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return soft skill by id and userId', async () => {
      prisma.softSkill.findFirst.mockResolvedValue(mockSoftSkill);

      const result = await service.findOne(1, 1);

      expect(prisma.softSkill.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockSoftSkill);
    });

    it('should throw NotFoundException when soft skill does not exist', async () => {
      prisma.softSkill.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update soft skill fields', async () => {
      prisma.softSkill.findFirst.mockResolvedValue(mockSoftSkill);
      const updated = { ...mockSoftSkill, progress: 95 };
      prisma.softSkill.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { progress: 95 });

      expect(prisma.softSkill.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { progress: 95 },
      });
      expect(result.progress).toBe(95);
    });

    it('should throw NotFoundException when updating non-existent soft skill', async () => {
      prisma.softSkill.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { name: 'Communication' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should delete soft skill successfully', async () => {
      prisma.softSkill.findFirst.mockResolvedValue(mockSoftSkill);
      prisma.softSkill.delete.mockResolvedValue(mockSoftSkill);

      const result = await service.remove(1, 1);

      expect(prisma.softSkill.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Soft skill deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent soft skill', async () => {
      prisma.softSkill.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });
});
