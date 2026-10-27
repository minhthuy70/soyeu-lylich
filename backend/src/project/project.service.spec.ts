import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProjectService', () => {
  let service: ProjectService;

  const mockProject = {
    id: 1,
    userId: 1,
    title: 'Project A',
    description: 'Description',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    technologies: ['React', 'Node.js'],
    status: 'completed',
    projectImages: [],
  };

  const mockPrisma = {
    project: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return projects list and count', async () => {
      const mockProjects = [mockProject];
      mockPrisma.project.findMany.mockResolvedValue(mockProjects);

      const result = await service.findAll(1);
      expect(result.projects).toEqual(mockProjects);
      expect(result.count).toBe(1);
    });

    it('should return empty array if no projects', async () => {
      mockPrisma.project.findMany.mockResolvedValue([]);

      const result = await service.findAll(1);
      expect(result.projects).toEqual([]);
      expect(result.count).toBe(0);
    });
  });

  describe('create', () => {
    it('should create and return project', async () => {
      const createDto = {
        title: 'New Project',
        description: 'Description',
        technologies: ['React'],
      };

      mockPrisma.project.create.mockResolvedValue(mockProject);

      const result = await service.create(1, createDto);
      expect(result).toEqual(mockProject);
      expect(mockPrisma.project.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return project', async () => {
      const updateDto = {
        title: 'Updated Title',
        status: 'in-progress',
      };

      mockPrisma.project.findFirst.mockResolvedValue(mockProject);
      mockPrisma.project.update.mockResolvedValue({
        ...mockProject,
        ...updateDto,
      });

      const result = await service.update(1, 1, updateDto);
      expect(result.title).toBe(updateDto.title);
    });

    it('should throw NotFoundException if project not found', async () => {
      mockPrisma.project.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 1, { title: 'New Title' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('remove', () => {
    it('should delete project', async () => {
      mockPrisma.project.findFirst.mockResolvedValue(mockProject);
      mockPrisma.project.delete.mockResolvedValue(mockProject);

      const result = await service.remove(1, 1);
      expect(result).toHaveProperty('message');
    });

    it('should throw NotFoundException if project not found', async () => {
      mockPrisma.project.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
