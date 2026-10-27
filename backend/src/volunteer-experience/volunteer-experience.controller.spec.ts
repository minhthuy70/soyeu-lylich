import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerExperienceController } from './volunteer-experience.controller';
import { VolunteerExperienceService } from './volunteer-experience.service';

describe('VolunteerExperienceController', () => {
  let controller: VolunteerExperienceController;
  let service: jest.Mocked<VolunteerExperienceService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getTotalHours: jest.fn(),
    getByCause: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 11 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerExperienceController],
      providers: [
        {
          provide: VolunteerExperienceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<VolunteerExperienceController>(VolunteerExperienceController);
    service = module.get(VolunteerExperienceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with authenticated user id and dto', async () => {
      const dto = { organization: 'Red Cross', role: 'Leader' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(11, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should default to userId 1 if req.user is undefined', async () => {
      const dto = { organization: 'WWF' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId and optional cause', async () => {
      mockService.findAll.mockResolvedValue({ volunteerExperiences: [], count: 0 } as any);

      await controller.findAll(mockReq, 'Environment');

      expect(service.findAll).toHaveBeenCalledWith(11, 'Environment');
    });
  });

  describe('getTotalHours', () => {
    it('should call service.getTotalHours with userId', async () => {
      mockService.getTotalHours.mockResolvedValue({ totalHours: 120 } as any);

      const result = await controller.getTotalHours(mockReq);

      expect(service.getTotalHours).toHaveBeenCalledWith(11);
      expect(result).toEqual({ totalHours: 120 });
    });
  });

  describe('getByCause', () => {
    it('should call service.getByCause with userId', async () => {
      mockService.getByCause.mockResolvedValue({ causes: [] } as any);

      await controller.getByCause(mockReq);

      expect(service.getByCause).toHaveBeenCalledWith(11);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 2 } as any);

      const result = await controller.findOne(mockReq, '2');

      expect(service.findOne).toHaveBeenCalledWith(11, 2);
      expect(result).toEqual({ id: 2 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, parsed id and updateDto', async () => {
      const updateDto = { role: 'Lead Organizer' };
      mockService.update.mockResolvedValue({ id: 2, ...updateDto } as any);

      const result = await controller.update(mockReq, '2', updateDto);

      expect(service.update).toHaveBeenCalledWith(11, 2, updateDto);
      expect(result).toEqual({ id: 2, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '2');

      expect(service.remove).toHaveBeenCalledWith(11, 2);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
