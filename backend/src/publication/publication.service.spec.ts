import { Test, TestingModule } from '@nestjs/testing';
import { PublicationService } from './publication.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PublicationService', () => {
  let service: PublicationService;
  let prisma: {
    publication: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      updateMany: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  const mockPublication = {
    id: 1,
    userId: 1,
    title: 'Modern Microservice Architecture in NestJS',
    journal: 'IEEE Software',
    publicationDate: new Date('2024-03-01'),
    url: 'https://ieee.example.com/paper/12345',
    authors: ['Nguyen Minh Thuy', 'Co-author A'],
    description: 'An empirical study on NestJS performance at scale',
  };

  beforeEach(async () => {
    prisma = {
      publication: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PublicationService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<PublicationService>(PublicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPublication', () => {
    it('should create publication with userId', async () => {
      prisma.publication.create.mockResolvedValue(mockPublication);

      const data = { title: 'Modern Microservice Architecture in NestJS' };
      const result = await service.createPublication(1, data);

      expect(prisma.publication.create).toHaveBeenCalledWith({
        data: {
          ...data,
          userId: 1,
        },
      });
      expect(result).toEqual(mockPublication);
    });
  });

  describe('getPublications', () => {
    it('should return publications ordered by publicationDate desc', async () => {
      prisma.publication.findMany.mockResolvedValue([mockPublication]);

      const result = await service.getPublications(1);

      expect(prisma.publication.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { publicationDate: 'desc' },
      });
      expect(result).toEqual([mockPublication]);
    });
  });

  describe('getPublicationById', () => {
    it('should return publication by id and userId', async () => {
      prisma.publication.findFirst.mockResolvedValue(mockPublication);

      const result = await service.getPublicationById(1, 1);

      expect(prisma.publication.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockPublication);
    });
  });

  describe('updatePublication', () => {
    it('should update publication by id and userId', async () => {
      prisma.publication.updateMany.mockResolvedValue({ count: 1 });

      const data = { journal: 'ACM Computing Surveys' };
      const result = await service.updatePublication(1, 1, data);

      expect(prisma.publication.updateMany).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data,
      });
      expect(result).toEqual({ count: 1 });
    });
  });

  describe('deletePublication', () => {
    it('should delete publication by id and userId', async () => {
      prisma.publication.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deletePublication(1, 1);

      expect(prisma.publication.deleteMany).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual({ count: 1 });
    });
  });
});
