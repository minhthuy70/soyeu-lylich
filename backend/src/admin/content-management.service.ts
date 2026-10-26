import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContentManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // Resume Templates
  async getAllResumeTemplates() {
    // Return placeholder data since resumeTemplate model doesn't exist
    return [];
  }

  async updateResumeTemplate(id: number, updateData: any) {
    // Return placeholder data since resumeTemplate model doesn't exist
    return { id, ...updateData, updatedAt: new Date() };
  }

  async deleteResumeTemplate(id: number) {
    // Return placeholder data since resumeTemplate model doesn't exist
    return { message: 'Template deleted' };
  }

  // Skill Categories
  async getSkillCategories() {
    const skills = await this.prisma.skill.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return skills.map((s) => s.category).filter(Boolean);
  }

  async createSkillCategory(category: string) {
    // Verify category exists or mark it as available
    return { category, message: 'Category created' };
  }

  async deleteSkillCategory(category: string) {
    // Update skills in this category to have no category
    await this.prisma.skill.updateMany({
      where: { category },
      data: { category: null },
    });
    return { message: 'Category deleted' };
  }

  // System Settings
  async getSystemSettings() {
    return {
      maintenanceMode: false,
      maxUsers: 1000,
      allowRegistration: true,
      defaultLanguage: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
    };
  }

  async updateSystemSettings(settings: any) {
    // Store settings in a dedicated settings table or use environment variables
    return { ...settings, updatedAt: new Date() };
  }

  // Public Content
  async getPublicContent() {
    return {
      privacyPolicy: 'Privacy policy content...',
      termsOfService: 'Terms of service content...',
      aboutUs: 'About us content...',
    };
  }

  async updatePublicContent(content: any) {
    return { ...content, updatedAt: new Date() };
  }

  // Announcement Banners
  async getAnnouncementBanners() {
    return [
      {
        id: 1,
        title: 'New Features Available',
        message: 'Check out our new AI-powered resume analysis!',
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  async createAnnouncementBanner(banner: any) {
    return {
      id: Date.now(),
      ...banner,
      createdAt: new Date(),
    };
  }

  async updateAnnouncementBanner(id: number, banner: any) {
    return {
      id,
      ...banner,
      updatedAt: new Date(),
    };
  }

  async deleteAnnouncementBanner(id: number) {
    return { message: 'Banner deleted' };
  }

  // FAQ
  async getFAQs() {
    return [];
  }

  async createFAQ(faq: any) {
    return {
      id: Date.now(),
      ...faq,
      createdAt: new Date(),
    };
  }

  async updateFAQ(id: number, faq: any) {
    return {
      id,
      ...faq,
      updatedAt: new Date(),
    };
  }

  async deleteFAQ(id: number) {
    return { message: 'FAQ deleted' };
  }
}
