import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: {
    notification: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      updateMany: jest.Mock;
      deleteMany: jest.Mock;
    };
  };

  const mockNotification = {
    id: 1,
    userId: 1,
    type: 'PROFILE_COMPLETION',
    title: 'Complete Your Profile',
    message: 'Your profile is 80% complete.',
    isRead: false,
    readAt: null,
    createdAt: new Date(),
    metadata: { completionPercentage: 80 },
  };

  beforeEach(async () => {
    prisma = {
      notification: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        updateMany: jest.fn(),
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProfileCompletionReminder', () => {
    it('should create notification with PROFILE_COMPLETION type', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      const result = await service.createProfileCompletionReminder(1, 80);

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          type: 'PROFILE_COMPLETION',
          metadata: { completionPercentage: 80 },
        }),
      });
      expect(result).toEqual(mockNotification);
    });
  });

  describe('createResumeUpdateNotification', () => {
    it('should create notification with RESUME_UPDATE type', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      await service.createResumeUpdateNotification(1, 'Software Engineer CV');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          type: 'RESUME_UPDATE',
          metadata: { resumeTitle: 'Software Engineer CV' },
        }),
      });
    });
  });

  describe('createSecurityNotification', () => {
    it('should create security notification with appropriate title and message', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      await service.createSecurityNotification(1, 'LOGIN', { ip: '127.0.0.1' });

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          type: 'SECURITY',
          title: 'New Login Detected',
        }),
      });
    });
  });

  describe('createSystemNotification', () => {
    it('should create custom system notification', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      await service.createSystemNotification(
        1,
        'Maintenance Notice',
        'System will restart at midnight'
      );

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 1,
          type: 'SYSTEM',
          title: 'Maintenance Notice',
        }),
      });
    });
  });

  describe('getUserNotifications', () => {
    it('should return notifications list and total count', async () => {
      prisma.notification.findMany.mockResolvedValue([mockNotification]);
      prisma.notification.count.mockResolvedValue(1);

      const result = await service.getUserNotifications(1, 10, 0);

      expect(result).toEqual({ notifications: [mockNotification], total: 1 });
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });
  });

  describe('getUserNotificationPreferences and update', () => {
    it('should return default preferences', async () => {
      const prefs = await service.getUserNotificationPreferences(1);
      expect(prefs.profileCompletion).toBe(true);
      expect(prefs.security).toBe(true);
    });

    it('should return updated preferences payload', async () => {
      const result = await service.updateUserNotificationPreferences(1, { security: false });
      expect(result.success).toBe(true);
      expect(result.preferences).toEqual({ security: false });
    });
  });

  describe('markAsRead & markAllAsRead', () => {
    it('should mark single notification as read', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.markAsRead(5, 1);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { id: 5, userId: 1 },
        data: expect.objectContaining({ isRead: true }),
      });
      expect(result).toEqual({ count: 1 });
    });

    it('should mark all unread notifications as read', async () => {
      prisma.notification.updateMany.mockResolvedValue({ count: 5 });

      const result = await service.markAllAsRead(1);

      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
        data: expect.objectContaining({ isRead: true }),
      });
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('deleteNotification & getUnreadCount', () => {
    it('should delete notification by id and userId', async () => {
      prisma.notification.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteNotification(5, 1);

      expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
        where: { id: 5, userId: 1 },
      });
      expect(result).toEqual({ count: 1 });
    });

    it('should return unread count for user', async () => {
      prisma.notification.count.mockResolvedValue(3);

      const count = await service.getUnreadCount(1);

      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { userId: 1, isRead: false },
      });
      expect(count).toBe(3);
    });
  });

  describe('createAchievementNotification', () => {
    it('should create achievement notification', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      await service.createAchievementNotification(1, 'Fast Learner');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'ACHIEVEMENT',
          title: 'Achievement Unlocked!',
        }),
      });
    });
  });

  describe('createProfileViewNotification & createResumeShareNotification', () => {
    it('should create profile view notification', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      await service.createProfileViewNotification(1, 50);

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'PROFILE_VIEW',
          metadata: { viewCount: 50 },
        }),
      });
    });

    it('should create resume share notification', async () => {
      prisma.notification.create.mockResolvedValue(mockNotification);

      await service.createResumeShareNotification(1, 'My CV', 'recruiter@tech.com');

      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: 'RESUME_SHARE',
          metadata: { resumeTitle: 'My CV', sharedWith: 'recruiter@tech.com' },
        }),
      });
    });
  });

  describe('getNotificationsByType & deleteOldNotifications', () => {
    it('should filter notifications by type', async () => {
      prisma.notification.findMany.mockResolvedValue([mockNotification]);

      const result = await service.getNotificationsByType(1, 'SECURITY');

      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId: 1, type: 'SECURITY' },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockNotification]);
    });

    it('should delete old read notifications', async () => {
      prisma.notification.deleteMany.mockResolvedValue({ count: 4 });

      const result = await service.deleteOldNotifications(1, 60);

      expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          createdAt: { lt: expect.any(Date) },
          isRead: true,
        },
      });
      expect(result).toEqual({ count: 4 });
    });
  });
});
