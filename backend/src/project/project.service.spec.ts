import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';

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
  };

  const mockPrisma = {
    project: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: 'PrismaService',
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProjects', () => {
    it('should return paginated projects', async () => {
      const mockProjects = [mockProject];
      mockPrisma.project.findMany.mockResolvedValue(mockProjects);
      mockPrisma.project.count.mockResolvedValue(1);

      const result = await service.getProjects(1, 10);
      expect(result.data).toEqual(mockProjects);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should return empty array if no projects', async () => {
      mockPrisma.project.findMany.mockResolvedValue([]);
      mockPrisma.project.count.mockResolvedValue(0);

      const result = await service.getProjects(1, 10);
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });
  });

  describe('createProject', () => {
    it('should create and return project', async () => {
      const createDto = {
        userId: 1,
        title: 'New Project',
        description: 'Description',
        technologies: ['React'],
      };

      mockPrisma.project.create.mockResolvedValue(mockProject);

      const result = await service.createProject(createDto);
      expect(result).toEqual(mockProject);
      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('updateProject', () => {
    it('should update and return project', async () => {
      const updateDto = {
        title: 'Updated Title',
        status: 'in-progress',
      };

      mockPrisma.project.findUnique.mockResolvedValue(mockProject);
      mockPrisma.project.update.mockResolvedValue({
        ...mockProject,
        ...updateDto,
      });

      const result = await service.updateProject(1, updateDto);
      expect(result.title).toBe(updateDto.title);
    });

    it('should return null if project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const result = await service.updateProject(1, { title: 'New Title' });
      expect(result).toBeNull();
    });
  });

  describe('deleteProject', () => {
    it('should delete project', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(mockProject);
      mockPrisma.project.delete.mockResolvedValue(mockProject);

      const result = await service.deleteProject(1);
      expect(result).toEqual(mockProject);
    });

    it('should return null if project not found', async () => {
      mockPrisma.project.findUnique.mockResolvedValue(null);

      const result = await service.deleteProject(1);
      expect(result).toBeNull();
    });
  });
});
