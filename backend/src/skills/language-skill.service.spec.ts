import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LanguageSkillService } from './language-skill.service';
import { PrismaService } from '../prisma/prisma.service';

describe('LanguageSkillService', () => {
  let service: LanguageSkillService;
  let prisma: {
    languageSkill: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockLanguageSkill = {
    id: 1,
    userId: 1,
    language: 'English',
    proficiencyLevel: 'Fluent',
    listeningLevel: 'C1',
    speakingLevel: 'C1',
    readingLevel: 'C2',
    writingLevel: 'C1',
    certificateScore: 'IELTS 8.0',
    certificateInfo: 'British Council 2024',
    cefrLevel: 'C1',
  };

  beforeEach(async () => {
    prisma = {
      languageSkill: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageSkillService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<LanguageSkillService>(LanguageSkillService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return language skill', async () => {
      prisma.languageSkill.create.mockResolvedValue(mockLanguageSkill);

      const dto = {
        language: 'English',
        proficiencyLevel: 'Fluent',
        certificateScore: 'IELTS 8.0',
      };

      const result = await service.create(1, dto);

      expect(prisma.languageSkill.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          language: 'English',
          proficiencyLevel: 'Fluent',
        }),
      });
      expect(result).toEqual(mockLanguageSkill);
    });
  });

  describe('findAll', () => {
    it('should return list of language skills sorted by language name', async () => {
      prisma.languageSkill.findMany.mockResolvedValue([mockLanguageSkill]);

      const result = await service.findAll(1);

      expect(prisma.languageSkill.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ language: 'asc' }],
      });
      expect(result).toEqual({ skills: [mockLanguageSkill], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return language skill if found', async () => {
      prisma.languageSkill.findFirst.mockResolvedValue(mockLanguageSkill);

      const result = await service.findOne(1, 1);

      expect(prisma.languageSkill.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockLanguageSkill);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.languageSkill.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update language skill', async () => {
      prisma.languageSkill.findFirst.mockResolvedValue(mockLanguageSkill);
      const updated = { ...mockLanguageSkill, certificateScore: 'IELTS 8.5' };
      prisma.languageSkill.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { certificateScore: 'IELTS 8.5' });

      expect(prisma.languageSkill.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { certificateScore: 'IELTS 8.5' },
      });
      expect(result.certificateScore).toBe('IELTS 8.5');
    });

    it('should throw NotFoundException if updating non-existent skill', async () => {
      prisma.languageSkill.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { language: 'French' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should delete language skill', async () => {
      prisma.languageSkill.findFirst.mockResolvedValue(mockLanguageSkill);
      prisma.languageSkill.delete.mockResolvedValue(mockLanguageSkill);

      const result = await service.remove(1, 1);

      expect(prisma.languageSkill.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Language skill deleted successfully' });
    });

    it('should throw NotFoundException if deleting non-existent skill', async () => {
      prisma.languageSkill.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });
});
