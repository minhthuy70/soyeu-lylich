import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SkillService } from './skill.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SkillService', () => {
  let service: SkillService;
  let prisma: {
    skill: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockSkill = {
    id: 1,
    userId: 1,
    name: 'TypeScript',
    category: 'Programming Languages',
    level: 'Expert',
    yearsOfExperience: 5,
    description: 'Strong proficiency in TypeScript and NestJS ecosystem',
    progress: 90,
    tags: ['backend', 'typed'],
    portfolioLink: 'https://github.com/example/ts-project',
    endorsementCount: 12,
  };

  beforeEach(async () => {
    prisma = {
      skill: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SkillService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<SkillService>(SkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a skill with default progress and tags if omitted', async () => {
      prisma.skill.create.mockResolvedValue(mockSkill);

      const result = await service.create(1, {
        name: 'TypeScript',
      });

      expect(prisma.skill.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          name: 'TypeScript',
          category: undefined,
          level: undefined,
          yearsOfExperience: undefined,
          description: undefined,
          progress: 0,
          tags: [],
          portfolioLink: undefined,
        },
      });
      expect(result).toEqual(mockSkill);
    });
  });

  describe('findAll', () => {
    it('should return skills sorted by progress and name', async () => {
      prisma.skill.findMany.mockResolvedValue([mockSkill]);

      const result = await service.findAll(1);

      expect(prisma.skill.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ progress: 'desc' }, { name: 'asc' }],
      });
      expect(result).toEqual({ skills: [mockSkill], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return the requested skill', async () => {
      prisma.skill.findFirst.mockResolvedValue(mockSkill);

      const result = await service.findOne(1, 1);

      expect(prisma.skill.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockSkill);
    });

    it('should throw NotFoundException if skill does not exist', async () => {
      prisma.skill.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update skill fields', async () => {
      prisma.skill.findFirst.mockResolvedValue(mockSkill);
      const updated = { ...mockSkill, progress: 95 };
      prisma.skill.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { progress: 95 });

      expect(prisma.skill.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: {
          name: undefined,
          category: undefined,
          level: undefined,
          yearsOfExperience: undefined,
          description: undefined,
          progress: 95,
          tags: undefined,
          portfolioLink: undefined,
          endorsementCount: undefined,
        },
      });
      expect(result.progress).toBe(95);
    });

    it('should throw NotFoundException when updating non-existent skill', async () => {
      prisma.skill.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { name: 'Go' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete skill successfully', async () => {
      prisma.skill.findFirst.mockResolvedValue(mockSkill);
      prisma.skill.delete.mockResolvedValue(mockSkill);

      const result = await service.remove(1, 1);

      expect(prisma.skill.delete).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
      expect(result).toEqual({ message: 'Skill deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent skill', async () => {
      prisma.skill.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('incrementEndorsement', () => {
    it('should increment endorsement count by 1', async () => {
      prisma.skill.findFirst.mockResolvedValue(mockSkill);
      const updated = { ...mockSkill, endorsementCount: 13 };
      prisma.skill.update.mockResolvedValue(updated);

      const result = await service.incrementEndorsement(1, 1);

      expect(prisma.skill.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: { endorsementCount: 13 },
      });
      expect(result.endorsementCount).toBe(13);
    });

    it('should initialize endorsement count from 0 if null', async () => {
      const skillWithoutEndorsements = { ...mockSkill, endorsementCount: null };
      prisma.skill.findFirst.mockResolvedValue(skillWithoutEndorsements);
      prisma.skill.update.mockResolvedValue({ ...mockSkill, endorsementCount: 1 });

      await service.incrementEndorsement(1, 1);

      expect(prisma.skill.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: { endorsementCount: 1 },
      });
    });

    it('should throw NotFoundException if skill not found on endorsement', async () => {
      prisma.skill.findFirst.mockResolvedValue(null);

      await expect(service.incrementEndorsement(1, 999)).rejects.toThrow(NotFoundException);
    });
  });
});
