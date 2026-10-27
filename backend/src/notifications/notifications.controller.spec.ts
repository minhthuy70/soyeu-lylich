import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationService } from './notifications.service';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let service: jest.Mocked<NotificationService>;

  const mockService = {
    getUserNotifications: jest.fn(),
    getUnreadCount: jest.fn(),
    getNotificationsByType: jest.fn(),
    createProfileCompletionReminder: jest.fn(),
    createResumeUpdateNotification: jest.fn(),
    createSecurityNotification: jest.fn(),
    createSystemNotification: jest.fn(),
    createAchievementNotification: jest.fn(),
    createProfileViewNotification: jest.fn(),
    createResumeShareNotification: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    deleteNotification: jest.fn(),
    getUserNotificationPreferences: jest.fn(),
    updateUserNotificationPreferences: jest.fn(),
    deleteOldNotifications: jest.fn(),
  };

  const mockReq = { user: { id: 9 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    service = module.get(NotificationService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserNotifications', () => {
    it('should call getUserNotifications with parsed limit and offset', async () => {
      mockService.getUserNotifications.mockResolvedValue({ notifications: [], total: 0 } as any);

      await controller.getUserNotifications(mockReq, 10, 20);

      expect(service.getUserNotifications).toHaveBeenCalledWith(9, 10, 20);
    });

    it('should default to userId 1 if req.user is absent', async () => {
      await controller.getUserNotifications({});

      expect(service.getUserNotifications).toHaveBeenCalledWith(1, 20, 0);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count wrapped in object', async () => {
      mockService.getUnreadCount.mockResolvedValue(5);

      const result = await controller.getUnreadCount(mockReq);

      expect(service.getUnreadCount).toHaveBeenCalledWith(9);
      expect(result).toEqual({ count: 5 });
    });
  });

  describe('getNotificationsByType', () => {
    it('should call getNotificationsByType with type and userId', async () => {
      mockService.getNotificationsByType.mockResolvedValue([]);

      await controller.getNotificationsByType('SECURITY', mockReq);

      expect(service.getNotificationsByType).toHaveBeenCalledWith(9, 'SECURITY');
    });
  });

  describe('creation endpoints', () => {
    it('should create profile completion reminder', async () => {
      await controller.createProfileCompletionReminder({ completionPercentage: 75 }, mockReq);
      expect(service.createProfileCompletionReminder).toHaveBeenCalledWith(9, 75);
    });

    it('should create resume update notification', async () => {
      await controller.createResumeUpdateNotification({ resumeTitle: 'My Resume' }, mockReq);
      expect(service.createResumeUpdateNotification).toHaveBeenCalledWith(9, 'My Resume');
    });

    it('should create security notification', async () => {
      await controller.createSecurityNotification(
        { securityType: 'LOGIN', details: { ip: '1.1.1.1' } },
        mockReq
      );
      expect(service.createSecurityNotification).toHaveBeenCalledWith(9, 'LOGIN', {
        ip: '1.1.1.1',
      });
    });

    it('should create system notification', async () => {
      await controller.createSystemNotification({ title: 'T', message: 'M' }, mockReq);
      expect(service.createSystemNotification).toHaveBeenCalledWith(9, 'T', 'M', undefined);
    });

    it('should create achievement notification', async () => {
      await controller.createAchievementNotification({ achievementTitle: 'Star' }, mockReq);
      expect(service.createAchievementNotification).toHaveBeenCalledWith(9, 'Star');
    });

    it('should create profile view notification', async () => {
      await controller.createProfileViewNotification({ viewCount: 10 }, mockReq);
      expect(service.createProfileViewNotification).toHaveBeenCalledWith(9, 10);
    });

    it('should create resume share notification', async () => {
      await controller.createResumeShareNotification(
        { resumeTitle: 'CV', sharedWith: 'HR' },
        mockReq
      );
      expect(service.createResumeShareNotification).toHaveBeenCalledWith(9, 'CV', 'HR');
    });
  });

  describe('actions: mark read & delete', () => {
    it('should mark single notification read', async () => {
      await controller.markAsRead('15', mockReq);
      expect(service.markAsRead).toHaveBeenCalledWith(15, 9);
    });

    it('should mark all notifications read', async () => {
      await controller.markAllAsRead(mockReq);
      expect(service.markAllAsRead).toHaveBeenCalledWith(9);
    });

    it('should delete notification by id', async () => {
      await controller.deleteNotification('15', mockReq);
      expect(service.deleteNotification).toHaveBeenCalledWith(15, 9);
    });

    it('should delete old notifications', async () => {
      await controller.deleteOldNotifications(30, mockReq);
      expect(service.deleteOldNotifications).toHaveBeenCalledWith(9, 30);
    });
  });

  describe('preferences', () => {
    it('should get notification preferences', async () => {
      mockService.getUserNotificationPreferences.mockResolvedValue({ security: true } as any);

      const result = await controller.getPreferences(mockReq);

      expect(service.getUserNotificationPreferences).toHaveBeenCalledWith(9);
      expect(result).toEqual({ security: true });
    });

    it('should update notification preferences', async () => {
      const prefs = { security: false };
      await controller.updatePreferences(prefs, mockReq);

      expect(service.updateUserNotificationPreferences).toHaveBeenCalledWith(9, prefs);
    });
  });
});
