import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';

describe('ExperienceController', () => {
  let controller: ExperienceController;
  let service: jest.Mocked<ExperienceService>;

  const mockExperienceService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getCurrentJobs: jest.fn(),
    getTimeline: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 7 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [
        {
          provide: ExperienceService,
          useValue: mockExperienceService,
        },
      ],
    }).compile();

    controller = module.get<ExperienceController>(ExperienceController);
    service = module.get(ExperienceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with authenticated user id and dto', async () => {
      const dto = { companyName: 'Google', position: 'Tech Lead' };
      mockExperienceService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(7, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should fallback to userId 1 if req.user is undefined', async () => {
      const dto = { companyName: 'OpenAI', position: 'Engineer' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId and optional employmentType', async () => {
      mockExperienceService.findAll.mockResolvedValue({ experiences: [], count: 0 } as any);

      await controller.findAll(mockReq, 'Full-time');

      expect(service.findAll).toHaveBeenCalledWith(7, 'Full-time');
    });
  });

  describe('getCurrentJobs', () => {
    it('should call service.getCurrentJobs with userId', async () => {
      mockExperienceService.getCurrentJobs.mockResolvedValue({ currentJobs: [], count: 0 } as any);

      await controller.getCurrentJobs(mockReq);

      expect(service.getCurrentJobs).toHaveBeenCalledWith(7);
    });
  });

  describe('getTimeline', () => {
    it('should call service.getTimeline with userId', async () => {
      mockExperienceService.getTimeline.mockResolvedValue({ timeline: [] } as any);

      await controller.getTimeline(mockReq);

      expect(service.getTimeline).toHaveBeenCalledWith(7);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockExperienceService.findOne.mockResolvedValue({ id: 15 } as any);

      const result = await controller.findOne(mockReq, '15');

      expect(service.findOne).toHaveBeenCalledWith(7, 15);
      expect(result).toEqual({ id: 15 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, parsed id and updateDto', async () => {
      const updateDto = { position: 'Staff Engineer' };
      mockExperienceService.update.mockResolvedValue({ id: 15, ...updateDto } as any);

      const result = await controller.update(mockReq, '15', updateDto);

      expect(service.update).toHaveBeenCalledWith(7, 15, updateDto);
      expect(result).toEqual({ id: 15, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockExperienceService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '15');

      expect(service.remove).toHaveBeenCalledWith(7, 15);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
