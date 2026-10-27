import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';

describe('ActivityController', () => {
  let controller: ActivityController;
  let service: jest.Mocked<ActivityService>;

  const mockActivityService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getActivitiesByType: jest.fn(),
  };

  const validToken = `dummy.${Buffer.from(JSON.stringify({ sub: 7 })).toString('base64')}.sig`;
  const validReq = {
    headers: {
      authorization: `Bearer ${validToken}`,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: mockActivityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
    service = module.get(ActivityService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('extractUserIdFromRequest', () => {
    it('should throw UnauthorizedException when auth header is missing', async () => {
      await expect(controller.create({ headers: {} } as any, {})).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when token cannot be parsed', async () => {
      await expect(
        controller.create({ headers: { authorization: 'Bearer broken.token' } } as any, {}),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('create', () => {
    it('should create activity with decoded userId', async () => {
      const data = { organization: 'Tech Club' };
      mockActivityService.create.mockResolvedValue({ id: 1, ...data } as any);

      const result = await controller.create(validReq, data);

      expect(service.create).toHaveBeenCalledWith(7, data);
      expect(result).toEqual({ id: 1, ...data });
    });
  });

  describe('findAll', () => {
    it('should call getActivitiesByType when type query is given', async () => {
      mockActivityService.getActivitiesByType.mockResolvedValue([]);

      await controller.findAll(validReq, 'Club');

      expect(service.getActivitiesByType).toHaveBeenCalledWith(7, 'Club');
      expect(service.findAll).not.toHaveBeenCalled();
    });

    it('should call findAll when no type is provided', async () => {
      mockActivityService.findAll.mockResolvedValue([]);

      await controller.findAll(validReq);

      expect(service.findAll).toHaveBeenCalledWith(7);
    });
  });

  describe('findOne', () => {
    it('should find single activity by parsed id', async () => {
      mockActivityService.findOne.mockResolvedValue({ id: 3 } as any);

      const result = await controller.findOne(validReq, '3');

      expect(service.findOne).toHaveBeenCalledWith(7, 3);
      expect(result).toEqual({ id: 3 });
    });
  });

  describe('update', () => {
    it('should update activity with parsed id and data', async () => {
      const data = { memberCount: 100 };
      mockActivityService.update.mockResolvedValue({ id: 3, ...data } as any);

      const result = await controller.update(validReq, '3', data);

      expect(service.update).toHaveBeenCalledWith(7, 3, data);
      expect(result).toEqual({ id: 3, ...data });
    });
  });

  describe('remove', () => {
    it('should remove activity by parsed id', async () => {
      mockActivityService.remove.mockResolvedValue({ id: 3 } as any);

      const result = await controller.remove(validReq, '3');

      expect(service.remove).toHaveBeenCalledWith(7, 3);
      expect(result).toEqual({ id: 3 });
    });
  });
});
