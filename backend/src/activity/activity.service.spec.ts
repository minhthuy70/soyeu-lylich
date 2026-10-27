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

      await service.create(1, data);

      expect(prisma.activity.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          organization: 'GDG Hanoi',
          position: 'Core Organizer',
          startDate: new Date('2023-01-01'),
          endDate: undefined,
          description: 'Organized events',
          achievements: ['Best Organizer'],
          type: 'Community',
          memberCount: 50,
        },
      });
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
        data: {
          userId: 1,
          organization: 'GDG Hanoi',
          position: 'Organizer',
          startDate: new Date('2023-01-01'),
          endDate: undefined,
          description: 'Organized events',
          achievements: [],
          type: 'Community',
          memberCount: undefined,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return activities ordered by startDate desc', async () => {
      prisma.activity.findMany.mockResolvedValue([mockActivity]);

      await service.findAll(1);

      expect(prisma.activity.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { startDate: 'desc' },
      });
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
      prisma.activity.findFirst.mockResolvedValue(mockActivity);
      prisma.activity.update.mockResolvedValue(updated);

      jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
      await service.update(1, 1, { position: 'Lead Organizer' });

      expect(prisma.activity.update).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
        data: {
          organization: undefined,
          position: 'Lead Organizer',
          startDate: undefined,
          endDate: undefined,
          description: undefined,
          achievements: undefined,
          type: undefined,
          memberCount: undefined,
          updatedAt: new Date('2024-01-01'),
        },
      });
      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    it('should delete activity by id', async () => {
      prisma.activity.findFirst.mockResolvedValue(mockActivity);
      prisma.activity.delete.mockResolvedValue(mockActivity);

      const result = await service.remove(1, 1);

      expect(prisma.activity.delete).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
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
