import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface NotificationPreferences {
  profileCompletion: boolean;
  resumeUpdates: boolean;
  security: boolean;
  system: boolean;
  achievements: boolean;
  profileViews: boolean;
  resumeShares: boolean;
}

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Profile completion reminders
  createProfileCompletionReminder(userId: number, completionPercentage: number) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'PROFILE_COMPLETION',
        title: 'Complete Your Profile',
        message: `Your profile is ${completionPercentage}% complete. Add more details to make it stand out!`,
        metadata: { completionPercentage },
      },
    });
  }

  // 2. Resume update notifications
  createResumeUpdateNotification(userId: number, resumeTitle: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'RESUME_UPDATE',
        title: 'Resume Updated',
        message: `Your resume "${resumeTitle}" has been updated successfully.`,
        metadata: { resumeTitle },
      },
    });
  }

  // 3. Security notifications
  createSecurityNotification(
    userId: number,
    securityType: 'LOGIN' | 'PASSWORD_CHANGE' | '2FA_ENABLED' | 'SUSPICIOUS_ACTIVITY',
    details?: Prisma.InputJsonObject
  ) {
    const titles = {
      LOGIN: 'New Login Detected',
      PASSWORD_CHANGE: 'Password Changed',
      '2FA_ENABLED': 'Two-Factor Authentication Enabled',
      SUSPICIOUS_ACTIVITY: 'Suspicious Activity Detected',
    };

    const messages = {
      LOGIN: 'A new login was detected on your account.',
      PASSWORD_CHANGE: 'Your password was recently changed.',
      '2FA_ENABLED': 'Two-factor authentication has been enabled on your account.',
      SUSPICIOUS_ACTIVITY:
        'We detected suspicious activity on your account. Please review your security settings.',
    };

    return this.prisma.notification.create({
      data: {
        userId,
        type: 'SECURITY',
        title: titles[securityType],
        message: messages[securityType],
        metadata: { securityType, ...details },
      },
    });
  }

  // 4. System notifications
  createSystemNotification(
    userId: number,
    title: string,
    message: string,
    metadata?: Prisma.InputJsonValue
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'SYSTEM',
        title,
        message,
        metadata,
      },
    });
  }

  // 5. Notification center - Get all notifications
  async getUserNotifications(userId: number, limit = 20, offset = 0) {
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return { notifications, total };
  }

  // 6. Notification preferences (mock - can be extended with user preferences table)
  getUserNotificationPreferences() {
    // In production, this would query a user_preferences table
    return {
      profileCompletion: true,
      resumeUpdates: true,
      security: true,
      system: true,
      achievements: true,
      profileViews: true,
      resumeShares: true,
    };
  }

  updateUserNotificationPreferences(userId: number, preferences: Partial<NotificationPreferences>) {
    // In production, this would update a user_preferences table
    return { success: true, preferences };
  }

  // 7. Mark as read
  markAsRead(notificationId: number, userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // 8. Mark all as read
  markAllAsRead(userId: number) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  // 9. Delete notification
  deleteNotification(notificationId: number, userId: number) {
    return this.prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId,
      },
    });
  }

  // 10. Notification badge count (unread count)
  getUnreadCount(userId: number) {
    return this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  // Additional: Create achievement notification
  createAchievementNotification(userId: number, achievementTitle: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'ACHIEVEMENT',
        title: 'Achievement Unlocked!',
        message: `Congratulations! You've unlocked: ${achievementTitle}`,
        metadata: { achievementTitle },
      },
    });
  }

  // Additional: Create profile view notification
  createProfileViewNotification(userId: number, viewCount: number) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'PROFILE_VIEW',
        title: 'Profile Viewed',
        message: `Your profile has been viewed ${viewCount} times!`,
        metadata: { viewCount },
      },
    });
  }

  // Additional: Create resume share notification
  createResumeShareNotification(userId: number, resumeTitle: string, sharedWith: string) {
    return this.prisma.notification.create({
      data: {
        userId,
        type: 'RESUME_SHARE',
        title: 'Resume Shared',
        message: `Your resume "${resumeTitle}" has been shared with ${sharedWith}`,
        metadata: { resumeTitle, sharedWith },
      },
    });
  }

  // Additional: Get notifications by type
  getNotificationsByType(userId: number, type: string) {
    return this.prisma.notification.findMany({
      where: {
        userId,
        type,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Additional: Delete old notifications (cleanup)
  deleteOldNotifications(userId: number, daysOld = 90) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    return this.prisma.notification.deleteMany({
      where: {
        userId,
        createdAt: {
          lt: cutoffDate,
        },
        isRead: true, // Only delete read notifications
      },
    });
  }
}
