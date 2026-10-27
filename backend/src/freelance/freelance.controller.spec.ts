import { Test, TestingModule } from '@nestjs/testing';
import { FreelanceController } from './freelance.controller';
import { FreelanceService } from './freelance.service';

describe('FreelanceController', () => {
  let controller: FreelanceController;
  let service: jest.Mocked<FreelanceService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getTotalEarnings: jest.fn(),
    getByClient: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockReq = { user: { id: 5 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FreelanceController],
      providers: [
        {
          provide: FreelanceService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<FreelanceController>(FreelanceController);
    service = module.get(FreelanceService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create freelance project with user id and dto', async () => {
      const dto = { clientName: 'Globex Inc', budget: '$4,000' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(mockReq, dto);

      expect(service.create).toHaveBeenCalledWith(5, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });

    it('should fallback to userId 1 if req.user is undefined', async () => {
      const dto = { clientName: 'Initech' };
      await controller.create({}, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId', async () => {
      mockService.findAll.mockResolvedValue({ freelanceProjects: [], count: 0 } as any);

      await controller.findAll(mockReq);

      expect(service.findAll).toHaveBeenCalledWith(5);
    });
  });

  describe('getTotalEarnings', () => {
    it('should call service.getTotalEarnings with userId', async () => {
      mockService.getTotalEarnings.mockResolvedValue({ totalEarnings: 15000 } as any);

      const result = await controller.getTotalEarnings(mockReq);

      expect(service.getTotalEarnings).toHaveBeenCalledWith(5);
      expect(result).toEqual({ totalEarnings: 15000 });
    });
  });

  describe('getByClient', () => {
    it('should call service.getByClient with userId and clientName', async () => {
      mockService.getByClient.mockResolvedValue({ freelanceProjects: [], count: 0 } as any);

      await controller.getByClient(mockReq, 'Globex');

      expect(service.getByClient).toHaveBeenCalledWith(5, 'Globex');
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with userId and parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 8 } as any);

      const result = await controller.findOne(mockReq, '8');

      expect(service.findOne).toHaveBeenCalledWith(5, 8);
      expect(result).toEqual({ id: 8 });
    });
  });

  describe('update', () => {
    it('should call service.update with userId, id and updateDto', async () => {
      const updateDto = { budget: '$8,000' };
      mockService.update.mockResolvedValue({ id: 8, ...updateDto } as any);

      const result = await controller.update(mockReq, '8', updateDto);

      expect(service.update).toHaveBeenCalledWith(5, 8, updateDto);
      expect(result).toEqual({ id: 8, ...updateDto });
    });
  });

  describe('remove', () => {
    it('should call service.remove with userId and parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(mockReq, '8');

      expect(service.remove).toHaveBeenCalledWith(5, 8);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
