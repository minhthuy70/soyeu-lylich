import { Test, TestingModule } from '@nestjs/testing';
import { AchievementController } from './achievement.controller';
import { AchievementService } from './achievement.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

describe('AchievementController', () => {
  let controller: AchievementController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    getAchievementsByCategory: jest.fn(),
    getAchievementsByLevel: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };
  const authenticatedRequest = { user: { id: 10 } } as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AchievementController],
      providers: [{ provide: AchievementService, useValue: mockService }],
    }).compile();

    controller = module.get<AchievementController>(AchievementController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates achievements for the authenticated user', async () => {
    const dto = { title: 'First Place', organization: 'Org' };
    mockService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(authenticatedRequest, dto);

    expect(mockService.create).toHaveBeenCalledWith(10, dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('filters by category before level', async () => {
    mockService.getAchievementsByCategory.mockResolvedValue({ achievements: [], count: 0 });
    mockService.getAchievementsByLevel.mockResolvedValue({ achievements: [], count: 0 });

    await controller.findAll(authenticatedRequest, 'Academic', 'National');

    expect(mockService.getAchievementsByCategory).toHaveBeenCalledWith(10, 'Academic');
    expect(mockService.getAchievementsByLevel).not.toHaveBeenCalled();
  });

  it('filters by level when no category is specified', async () => {
    mockService.getAchievementsByLevel.mockResolvedValue({ achievements: [], count: 0 });

    await controller.findAll(authenticatedRequest, undefined, 'National');

    expect(mockService.getAchievementsByLevel).toHaveBeenCalledWith(10, 'National');
  });

  it('lists all achievements when no filter is provided', async () => {
    mockService.findAll.mockResolvedValue({ achievements: [], count: 0 });

    await controller.findAll(authenticatedRequest);

    expect(mockService.findAll).toHaveBeenCalledWith(10);
  });

  it('passes numeric ids and authenticated user identity to resource methods', async () => {
    mockService.findOne.mockResolvedValue({ id: 7 });
    mockService.update.mockResolvedValue({ id: 7, title: 'Updated' });
    mockService.remove.mockResolvedValue({ message: 'Deleted' });

    await controller.findOne(authenticatedRequest, 7);
    await controller.update(authenticatedRequest, 7, { title: 'Updated' });
    await controller.remove(authenticatedRequest, 7);

    expect(mockService.findOne).toHaveBeenCalledWith(10, 7);
    expect(mockService.update).toHaveBeenCalledWith(10, 7, { title: 'Updated' });
    expect(mockService.remove).toHaveBeenCalledWith(10, 7);
  });
});
