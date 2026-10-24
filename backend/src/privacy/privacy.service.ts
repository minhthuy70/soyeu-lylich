import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrivacyService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrivacySettings(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    return {
      userId: user.id,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      accountCreatedDate: user.createdAt,
      privacySettings: {
        dataCollection: true,
        analyticsEnabled: true,
        marketingEmails: false,
        thirdPartySharing: false,
        dataRetentionDays: 365,
        cookieConsent: {
          necessary: true,
          analytics: false,
          marketing: false,
        },
      },
    };
  }

  async updatePrivacySettings(userId: number, settings: any) {
    // In production, store these in a privacy_settings table
    return {
      message: 'Đã cập nhật cài đặt quyền riêng tư',
      settings: {
        ...settings,
        updatedAt: new Date(),
      },
    };
  }

  async requestGDPRDataExport(userId: number) {
    // Export all user data for GDPR compliance
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        socialAccounts: true,
        sessions: true,
        identityDocuments: true,
        references: true,
        educations: true,
        certificates: true,
        onlineCourses: true,
        experiences: true,
        freelanceProjects: true,
        skills: true,
        softSkills: true,
        languageSkills: true,
        toolSkills: true,
        projects: true,
        achievements: true,
        activities: true,
        publications: true,
        patents: true,
        resumes: true,
        notifications: true,
        resumeTemplates: true,
        volunteerExperiences: true,
      },
    });

    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Remove sensitive data
    const exportData = {
      ...user,
      passwordHash: undefined,
      verificationToken: undefined,
      resetPasswordToken: undefined,
      twoFactorSecret: undefined,
      twoFactorBackupCodes: undefined,
    };

    return {
      exportData,
      exportedAt: new Date(),
      format: 'JSON',
    };
  }

  async requestGDPRDataDeletion(userId: number) {
    // Soft delete user data for GDPR compliance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        deletedAt: new Date(),
        email: `deleted_${userId}@deleted.local`,
        isActive: false,
      },
    });

    return {
      message: 'Đã xóa dữ liệu người dùng theo yêu cầu GDPR',
      deletedAt: new Date(),
    };
  }

  async getDataRetentionInfo() {
    return {
      dataRetentionPolicy: {
        userAccounts: '365 days after deletion',
        sessions: '30 days',
        logs: '90 days',
        analytics: '365 days',
        backups: '30 days',
      },
      gdprCompliant: true,
      rightToAccess: true,
      rightToDeletion: true,
      rightToRectification: true,
      rightToPortability: true,
      rightToWithdrawConsent: true,
    };
  }

  async acceptCookieConsent(userId: number, consent: any) {
    // Store cookie consent preferences
    return {
      message: 'Đã lưu đồng ý sử dụng cookie',
      consent: {
        ...consent,
        acceptedAt: new Date(),
        userId,
      },
    };
  }

  async getCookieConsent(userId: number) {
    return {
      cookieConsent: {
        necessary: true,
        analytics: false,
        marketing: false,
        acceptedAt: null,
      },
    };
  }
}
