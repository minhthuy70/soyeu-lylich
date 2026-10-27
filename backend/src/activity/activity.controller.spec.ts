import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

describe('ActivityController', () => {
  let controller: ActivityController;

  const mockActivityService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getActivitiesByType: jest.fn(),
  };
  const authenticatedRequest = { user: { id: 7 } } as AuthenticatedRequest;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [{ provide: ActivityService, useValue: mockActivityService }],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('uses the verified user identity when creating an activity', async () => {
    const activity = {
      organization: 'Tech Club',
      position: 'Organizer',
      startDate: new Date('2024-01-01'),
      description: 'Organized events',
      type: 'Community',
    };
    mockActivityService.create.mockResolvedValue({ id: 1, ...activity });

    const result = await controller.create(authenticatedRequest, activity);

    expect(mockActivityService.create).toHaveBeenCalledWith(7, activity);
    expect(result).toEqual({ id: 1, ...activity });
  });

  it('uses the verified user identity when listing activities by type', async () => {
    mockActivityService.getActivitiesByType.mockResolvedValue([]);

    await controller.findAll(authenticatedRequest, 'Community');

    expect(mockActivityService.getActivitiesByType).toHaveBeenCalledWith(7, 'Community');
    expect(mockActivityService.findAll).not.toHaveBeenCalled();
  });

  it('uses the verified user identity when listing all activities', async () => {
    mockActivityService.findAll.mockResolvedValue([]);

    await controller.findAll(authenticatedRequest);

    expect(mockActivityService.findAll).toHaveBeenCalledWith(7);
  });

  it('passes parsed activity ids and verified user identity to service methods', async () => {
    mockActivityService.findOne.mockResolvedValue({ id: 3 });
    mockActivityService.update.mockResolvedValue({ id: 3 });
    mockActivityService.remove.mockResolvedValue({ id: 3 });

    await controller.findOne(authenticatedRequest, 3);
    await controller.update(authenticatedRequest, 3, { memberCount: 100 });
    await controller.remove(authenticatedRequest, 3);

    expect(mockActivityService.findOne).toHaveBeenCalledWith(7, 3);
    expect(mockActivityService.update).toHaveBeenCalledWith(7, 3, { memberCount: 100 });
    expect(mockActivityService.remove).toHaveBeenCalledWith(7, 3);
  });
});
