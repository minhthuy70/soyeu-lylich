import { Test, TestingModule } from '@nestjs/testing';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

describe('EducationController', () => {
  let controller: EducationController;
  let service: jest.Mocked<EducationService>;

  const mockEducationService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getCurrentStudies: jest.fn(),
    getTimeline: jest.fn(),
    getByDegree: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUserReq = { user: { id: 5 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationController],
      providers: [
        {
          provide: EducationService,
          useValue: mockEducationService,
        },
      ],
    }).compile();

    controller = module.get<EducationController>(EducationController);
    service = module.get(EducationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with authenticated userId and dto', async () => {
      const dto = { schoolName: 'Đại học Quốc Gia' };
      mockEducationService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockUserReq, dto);

      expect(service.create).toHaveBeenCalledWith(5, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should fallback to userId 1 when req.user is undefined', async () => {
      const dto = { schoolName: 'Đại học Bách Khoa' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId and optional degree', async () => {
      mockEducationService.findAll.mockResolvedValue({ educations: [], count: 0 } as any);

      await controller.findAll(mockUserReq, 'Cử nhân');

      expect(service.findAll).toHaveBeenCalledWith(5, 'Cử nhân');
    });
  });

  describe('getCurrentStudies', () => {
    it('should call service.getCurrentStudies with userId', async () => {
      mockEducationService.getCurrentStudies.mockResolvedValue({ currentStudies: [], count: 0 } as any);

      await controller.getCurrentStudies(mockUserReq);

      expect(service.getCurrentStudies).toHaveBeenCalledWith(5);
    });
  });

  describe('getTimeline', () => {
    it('should call service.getTimeline with userId', async () => {
      mockEducationService.getTimeline.mockResolvedValue({ timeline: [] } as any);

      await controller.getTimeline(mockUserReq);

      expect(service.getTimeline).toHaveBeenCalledWith(5);
    });
  });

  describe('getByDegree', () => {
    it('should call service.getByDegree with userId and degree param', async () => {
      mockEducationService.getByDegree.mockResolvedValue({ educations: [], count: 0 } as any);

      await controller.getByDegree(mockUserReq, 'Thạc sĩ');

      expect(service.getByDegree).toHaveBeenCalledWith(5, 'Thạc sĩ');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockEducationService.findOne.mockResolvedValue({ id: 9 } as any);

      const result = await controller.findOne(mockUserReq, '9');

      expect(service.findOne).toHaveBeenCalledWith(5, 9);
      expect(result).toEqual({ id: 9 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, id and updateDto', async () => {
      const updateDto = { gpa: 4.0 };
      mockEducationService.update.mockResolvedValue({ id: 9, ...updateDto } as any);

      const result = await controller.update(mockUserReq, '9', updateDto);

      expect(service.update).toHaveBeenCalledWith(5, 9, updateDto);
      expect(result).toEqual({ id: 9, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockEducationService.remove.mockResolvedValue({ message: 'Success' } as any);

      const result = await controller.remove(mockUserReq, '9');

      expect(service.remove).toHaveBeenCalledWith(5, 9);
      expect(result).toEqual({ message: 'Success' });
    });
  });
});
