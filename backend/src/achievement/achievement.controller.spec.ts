import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';

describe('AchievementController', () => {
  let controller: AchievementController;
  let service: jest.Mocked<AchievementService>;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getAchievementsByCategory: jest.fn(),
    getAchievementsByLevel: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Helper to make a dummy Bearer token with sub = 10
  const validToken = `dummyHeader.${Buffer.from(JSON.stringify({ sub: 10 })).toString('base64')}.dummySig`;
  const validReq = {
    headers: {
      authorization: `Bearer ${validToken}`,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementController],
      providers: [
        {
          provide: AchievementService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
    service = module.get(AchievementService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('extractUserIdFromRequest', () => {
    it('should throw UnauthorizedException when authorization header is missing', async () => {
      await expect(controller.create({ headers: {} } as any, {} as any)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException when token payload cannot be decoded', async () => {
      const invalidReq = { headers: { authorization: 'Bearer invalid.token' } };
      await expect(controller.create(invalidReq as any, {} as any)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('create', () => {
    it('should create achievement with extracted userId', async () => {
      const dto = { title: 'First Place', organization: 'Org' };
      mockService.create.mockResolvedValue({ id: 1, ...dto } as any);

      const result = await controller.create(validReq, dto);

      expect(service.create).toHaveBeenCalledWith(10, dto);
      expect(result).toEqual({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should call getAchievementsByCategory if category query is provided', async () => {
      mockService.getAchievementsByCategory.mockResolvedValue({
        achievements: [],
        count: 0,
      } as any);

      await controller.findAll(validReq, 'Cert');

      expect(service.getAchievementsByCategory).toHaveBeenCalledWith(10, 'Cert');
      expect(service.findAll).not.toHaveBeenCalled();
    });

    it('should call getAchievementsByLevel if level query is provided', async () => {
      mockService.getAchievementsByLevel.mockResolvedValue({ achievements: [], count: 0 } as any);

      await controller.findAll(validReq, undefined, 'National');

      expect(service.getAchievementsByLevel).toHaveBeenCalledWith(10, 'National');
      expect(service.findAll).not.toHaveBeenCalled();
    });

    it('should call findAll if no filters provided', async () => {
      mockService.findAll.mockResolvedValue({ achievements: [], count: 0 } as any);

      await controller.findAll(validReq);

      expect(service.findAll).toHaveBeenCalledWith(10);
    });
  });

  describe('findOne', () => {
    it('should call findOne with parsed id', async () => {
      mockService.findOne.mockResolvedValue({ id: 7 } as any);

      const result = await controller.findOne(validReq, '7');

      expect(service.findOne).toHaveBeenCalledWith(10, 7);
      expect(result).toEqual({ id: 7 });
    });
  });

  describe('update', () => {
    it('should call update with parsed id and dto', async () => {
      const dto = { title: 'Updated' };
      mockService.update.mockResolvedValue({ id: 7, ...dto } as any);

      const result = await controller.update(validReq, '7', dto);

      expect(service.update).toHaveBeenCalledWith(10, 7, dto);
      expect(result).toEqual({ id: 7, ...dto });
    });
  });

  describe('remove', () => {
    it('should call remove with parsed id', async () => {
      mockService.remove.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.remove(validReq, '7');

      expect(service.remove).toHaveBeenCalledWith(10, 7);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });
});
