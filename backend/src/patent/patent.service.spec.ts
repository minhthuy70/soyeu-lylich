import { Test, TestingModule } from '@nestjs/testing';
import { PatentService } from './patent.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PatentService', () => {
  let service: PatentService;
  let prisma: {
    patent: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      updateMany: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  const mockPatent = {
    id: 1,
    userId: 1,
    title: 'AI Resume Optimization Algorithm',
    patentNumber: 'VN-12345-B',
    filingDate: new Date('2023-01-01'),
    issueDate: new Date('2024-01-01'),
    status: 'GRANTED',
  };

  beforeEach(async () => {
    prisma = {
      patent: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatentService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<PatentService>(PatentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPatent', () => {
    it('should create patent attached to userId', async () => {
      prisma.patent.create.mockResolvedValue(mockPatent);

      const data = { title: 'AI Algorithm', patentNumber: 'VN-12345-B' };
      const result = await service.createPatent(1, data);

      expect(prisma.patent.create).toHaveBeenCalledWith({
        data: {
          ...data,
          userId: 1,
        },
      });
      expect(result).toEqual(mockPatent);
    });
  });

  describe('getPatents', () => {
    it('should return patents ordered by filingDate desc', async () => {
      prisma.patent.findMany.mockResolvedValue([mockPatent]);

      const result = await service.getPatents(1);

      expect(prisma.patent.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { filingDate: 'desc' },
      });
      expect(result).toEqual([mockPatent]);
    });
  });

  describe('getPatentById', () => {
    it('should return patent by id and userId', async () => {
      prisma.patent.findFirst.mockResolvedValue(mockPatent);

      const result = await service.getPatentById(1, 1);

      expect(prisma.patent.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockPatent);
    });
  });

  describe('updatePatent', () => {
    it('should update patent matching id and userId', async () => {
      prisma.patent.updateMany.mockResolvedValue({ count: 1 });

      const updateData = { status: 'PENDING' };
      const result = await service.updatePatent(1, 1, updateData);

      expect(prisma.patent.updateMany).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: updateData,
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('deletePatent', () => {
    it('should delete patent matching id and userId', async () => {
      prisma.patent.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deletePatent(1, 1);

      expect(prisma.patent.deleteMany).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual({ count: 1 });
    });
  });
});
