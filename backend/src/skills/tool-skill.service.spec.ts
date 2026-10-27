import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ToolSkillService } from './tool-skill.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ToolSkillService', () => {
  let service: ToolSkillService;
  let prisma: {
    toolSkill: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockToolSkill = {
    id: 1,
    userId: 1,
    name: 'Git & GitHub',
    category: 'Version Control',
    proficiencyLevel: 'Expert',
    yearsOfUse: 5,
    description: 'Branching strategies, CI/CD actions, submodules',
  };

  beforeEach(async () => {
    prisma = {
      toolSkill: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToolSkillService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ToolSkillService>(ToolSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return tool skill', async () => {
      prisma.toolSkill.create.mockResolvedValue(mockToolSkill);

      const dto = {
        name: 'Docker',
        category: 'DevOps',
        proficiencyLevel: 'Intermediate',
        yearsOfUse: 3,
      };

      const result = await service.create(1, dto);

      expect(prisma.toolSkill.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          name: 'Docker',
          category: 'DevOps',
          proficiencyLevel: 'Intermediate',
          yearsOfUse: 3,
          description: undefined,
        },
      });
      expect(result).toEqual(mockToolSkill);
    });
  });

  describe('findAll', () => {
    it('should return list of tool skills ordered by category and name', async () => {
      prisma.toolSkill.findMany.mockResolvedValue([mockToolSkill]);

      const result = await service.findAll(1);

      expect(prisma.toolSkill.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ category: 'asc' }, { name: 'asc' }],
      });
      expect(result).toEqual({ skills: [mockToolSkill], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return tool skill by id and userId', async () => {
      prisma.toolSkill.findFirst.mockResolvedValue(mockToolSkill);

      const result = await service.findOne(1, 1);

      expect(prisma.toolSkill.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockToolSkill);
    });

    it('should throw NotFoundException when tool skill not found', async () => {
      prisma.toolSkill.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update tool skill', async () => {
      prisma.toolSkill.findFirst.mockResolvedValue(mockToolSkill);
      const updated = { ...mockToolSkill, proficiencyLevel: 'Advanced' };
      prisma.toolSkill.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { proficiencyLevel: 'Advanced' });

      expect(prisma.toolSkill.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { proficiencyLevel: 'Advanced' },
      });
      expect(result.proficiencyLevel).toBe('Advanced');
    });

    it('should throw NotFoundException when updating non-existent tool skill', async () => {
      prisma.toolSkill.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { name: 'Kubernetes' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete tool skill', async () => {
      prisma.toolSkill.findFirst.mockResolvedValue(mockToolSkill);
      prisma.toolSkill.delete.mockResolvedValue(mockToolSkill);

      const result = await service.remove(1, 1);

      expect(prisma.toolSkill.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Tool skill deleted successfully' });
    });

    it('should throw NotFoundException when deleting non-existent tool skill', async () => {
      prisma.toolSkill.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });
});
