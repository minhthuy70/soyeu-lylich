import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemConfigurationService {
  constructor(private readonly prisma: PrismaService) {}

  getGeneralSettings() {
    return {
      appName: 'Sơ yếu lý lịch',
      appVersion: '4.4',
      maintenanceMode: false,
      registrationEnabled: true,
      maxResumesPerUser: 10,
      maxProjectsPerUser: 50,
    };
  }

  updateGeneralSettings(settings: Record<string, unknown>) {
    // In production, these would be stored in a settings table or environment variables
    return {
      ...settings,
      updatedAt: new Date(),
    };
  }

  getEmailConfiguration() {
    return {
      provider: 'sendgrid', // or 'nodemailer', 'aws-ses'
      fromEmail: process.env.EMAIL_FROM || 'noreply@soyeulylich.com',
      fromName: 'Sơ yếu lý lịch',
      enabled: !!process.env.SENDGRID_API_KEY,
    };
  }

  updateEmailConfiguration(config: Record<string, unknown>) {
    // In production, update environment variables or secure storage
    return {
      ...config,
      updatedAt: new Date(),
    };
  }

  getStorageConfiguration() {
    return {
      provider: 'local', // or 's3', 'gcs', 'azure'
      maxFileSize: 5 * 1024 * 1024, // 5MB
      allowedFileTypes: [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ],
      uploadPath: './uploads',
    };
  }

  updateStorageConfiguration(config: Record<string, unknown>) {
    return {
      ...config,
      updatedAt: new Date(),
    };
  }

  getAIServiceConfiguration() {
    return {
      provider: 'openai', // or 'anthropic', 'mock'
      enabled: !!process.env.OPENAI_API_KEY,
      model: 'gpt-4',
      maxTokens: 2000,
    };
  }

  updateAIServiceConfiguration(config: Record<string, unknown>) {
    return {
      ...config,
      updatedAt: new Date(),
    };
  }

  getFeatureFlags() {
    return {
      aiFeatures: true,
      pushNotifications: true,
      emailNotifications: true,
      resumeExport: true,
      fileUpload: true,
      analytics: true,
      securityAudit: true,
    };
  }

  updateFeatureFlags(flags: Record<string, unknown>) {
    return {
      ...flags,
      updatedAt: new Date(),
    };
  }

  toggleMaintenanceMode(enabled: boolean) {
    // In production, this would update a global flag or environment variable
    return {
      maintenanceMode: enabled,
      updatedAt: new Date(),
    };
  }
}
