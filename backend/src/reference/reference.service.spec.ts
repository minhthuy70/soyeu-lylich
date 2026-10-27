import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReferenceService', () => {
  let service: ReferenceService;
  let prisma: {
    reference: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockReference = {
    id: 1,
    userId: 1,
    name: 'Nguyễn Văn A',
    position: 'Engineering Director',
    company: 'VinAI Research',
    contact: 'vana@vinai.example.com',
    relationship: 'Direct Supervisor',
  };

  beforeEach(async () => {
    prisma = {
      reference: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReferenceService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ReferenceService>(ReferenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a reference', async () => {
      prisma.reference.create.mockResolvedValue(mockReference);

      const dto = {
        name: 'Nguyễn Văn A',
        position: 'Engineering Director',
        company: 'VinAI Research',
        contact: 'vana@vinai.example.com',
        relationship: 'Direct Supervisor',
      };

      const result = await service.create(1, dto);

      expect(prisma.reference.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          ...dto,
        },
      });
      expect(result).toEqual(mockReference);
    });
  });

  describe('findAll', () => {
    it('should return references for a user', async () => {
      prisma.reference.findMany.mockResolvedValue([mockReference]);

      const result = await service.findAll(1);

      expect(prisma.reference.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ createdAt: 'desc' }],
      });
      expect(result).toEqual({ references: [mockReference], count: 1 });
    });
  });

  describe('findOne', () => {
    it('should return reference if found', async () => {
      prisma.reference.findFirst.mockResolvedValue(mockReference);

      const result = await service.findOne(1, 1);

      expect(prisma.reference.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockReference);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.reference.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update reference if found', async () => {
      prisma.reference.findFirst.mockResolvedValue(mockReference);
      const updated = { ...mockReference, position: 'VP of Engineering' };
      prisma.reference.update.mockResolvedValue(updated);

      await service.update(1, 1, { position: 'VP of Engineering' });

      expect(prisma.reference.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: {
          name: undefined,
          position: 'VP of Engineering',
          company: undefined,
          contact: undefined,
          relationship: undefined,
        },
      });
    });

    it('should throw NotFoundException when updating non-existent reference', async () => {
      prisma.reference.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { name: 'Nobody' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete reference if found', async () => {
      prisma.reference.findFirst.mockResolvedValue(mockReference);
      prisma.reference.delete.mockResolvedValue(mockReference);

      const result = await service.remove(1, 1);

      expect(prisma.reference.delete).toHaveBeenCalledWith({ where: { id: 1, userId: 1 } });
      expect(result).toEqual({ message: 'Đã xóa người tham chiếu thành công' });
    });

    it('should throw NotFoundException when deleting non-existent reference', async () => {
      prisma.reference.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getByCompany', () => {
    it('should filter references by company name case-insensitively', async () => {
      prisma.reference.findMany.mockResolvedValue([mockReference]);

      const result = await service.getByCompany(1, 'vinai');

      expect(prisma.reference.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          company: { contains: 'vinai', mode: 'insensitive' },
        },
        orderBy: [{ createdAt: 'desc' }],
      });
      expect(result).toEqual({ references: [mockReference], count: 1 });
    });
  });
});
