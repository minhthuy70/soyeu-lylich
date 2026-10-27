import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from './activity.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let prisma: {
    activity: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockActivity = {
    id: 1,
    userId: 1,
    organization: 'GDG Hanoi (Google Developer Group)',
    position: 'Core Organizer',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2024-01-01'),
    description: 'Organized DevFest Hanoi 2023 with 1000+ attendees',
    achievements: ['Best Tech Community Organizer 2023'],
    type: 'Community',
    memberCount: 50,
  };

  beforeEach(async () => {
    prisma = {
      activity: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an activity and wrap achievements in array', async () => {
      prisma.activity.create.mockResolvedValue(mockActivity);

      const data = {
        organization: 'GDG Hanoi',
        position: 'Core Organizer',
        startDate: new Date('2023-01-01'),
        description: 'Organized events',
        achievements: 'Best Organizer',
        type: 'Community',
        memberCount: 50,
      };

      const result = await service.create(1, data);

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          organization: 'GDG Hanoi',
          achievements: ['Best Organizer'],
        }),
      });
      expect(result).toEqual(mockActivity);
    });

    it('should set empty array for achievements if omitted', async () => {
      prisma.activity.create.mockResolvedValue(mockActivity);

      const data = {
        organization: 'GDG Hanoi',
        position: 'Organizer',
        startDate: new Date('2023-01-01'),
        description: 'Organized events',
        type: 'Community',
      };

      await service.create(1, data);

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          achievements: [],
        }),
      });
    });
  });

  describe('findAll', () => {
    it('should return activities ordered by startDate desc', async () => {
      prisma.activity.findMany.mockResolvedValue([mockActivity]);

      const result = await service.findAll(1);

      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { startDate: 'desc' },
      });
      expect(result).toEqual([mockActivity]);
    });
  });

  describe('findOne', () => {
    it('should return single activity by id and userId', async () => {
      prisma.activity.findFirst.mockResolvedValue(mockActivity);

      const result = await service.findOne(1, 1);

      expect(prisma.activity.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockActivity);
    });
  });

  describe('update', () => {
    it('should update activity and attach updatedAt', async () => {
      const updated = { ...mockActivity, position: 'Lead Organizer' };
      prisma.activity.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { position: 'Lead Organizer' });

      expect(prisma.activity.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          position: 'Lead Organizer',
          updatedAt: expect.any(Date),
        }),
      });
      expect(result.position).toBe('Lead Organizer');
    });
  });

  describe('remove', () => {
    it('should delete activity by id', async () => {
      prisma.activity.delete.mockResolvedValue(mockActivity);

      const result = await service.remove(1, 1);

      expect(prisma.activity.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockActivity);
    });
  });

  describe('getActivitiesByType', () => {
    it('should return activities filtered by type', async () => {
      prisma.activity.findMany.mockResolvedValue([mockActivity]);

      const result = await service.getActivitiesByType(1, 'Community');

      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId: 1, type: 'Community' },
        orderBy: { startDate: 'desc' },
      });
      expect(result).toEqual([mockActivity]);
    });
  });
});
