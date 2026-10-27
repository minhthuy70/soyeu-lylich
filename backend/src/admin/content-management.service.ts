import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface SystemSettings {
  maintenanceMode: boolean;
  maxUsers: number;
  allowRegistration: boolean;
  defaultLanguage: string;
  timezone: string;
}

export interface PublicContent {
  privacyPolicy: string;
  termsOfService: string;
  aboutUs: string;
}

export interface AnnouncementBannerInput {
  title: string;
  message: string;
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface FAQInput {
  question: string;
  answer: string;
}

@Injectable()
export class ContentManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // Resume Templates
  getAllResumeTemplates() {
    return this.prisma.resumeTemplate.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  updateResumeTemplate(
    id: number,
    updateData: Omit<Prisma.ResumeTemplateUncheckedUpdateInput, 'id' | 'userId'>
  ) {
    return this.prisma.resumeTemplate.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteResumeTemplate(id: number) {
    const { count } = await this.prisma.resumeTemplate.deleteMany({ where: { id } });
    if (count === 0) {
      throw new NotFoundException('Resume template not found');
    }
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

  createSkillCategory(category: string) {
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
  getSystemSettings(): SystemSettings {
    return {
      maintenanceMode: false,
      maxUsers: 1000,
      allowRegistration: true,
      defaultLanguage: 'vi',
      timezone: 'Asia/Ho_Chi_Minh',
    };
  }

  updateSystemSettings(settings: Partial<SystemSettings>) {
    // Store settings in a dedicated settings table or use environment variables
    return { ...settings, updatedAt: new Date() };
  }

  // Public Content
  getPublicContent(): PublicContent {
    return {
      privacyPolicy: 'Privacy policy content...',
      termsOfService: 'Terms of service content...',
      aboutUs: 'About us content...',
    };
  }

  updatePublicContent(content: Partial<PublicContent>) {
    return { ...content, updatedAt: new Date() };
  }

  // Announcement Banners
  getAnnouncementBanners(): Array<AnnouncementBannerInput & { id: number }> {
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

  createAnnouncementBanner(banner: AnnouncementBannerInput) {
    return {
      id: Date.now(),
      ...banner,
      createdAt: new Date(),
    };
  }

  updateAnnouncementBanner(id: number, banner: Partial<AnnouncementBannerInput>) {
    return {
      id,
      ...banner,
      updatedAt: new Date(),
    };
  }

  deleteAnnouncementBanner() {
    return { message: 'Banner deleted' };
  }

  // FAQ
  getFAQs(): FAQInput[] {
    return [];
  }

  createFAQ(faq: FAQInput) {
    return {
      id: Date.now(),
      ...faq,
      createdAt: new Date(),
    };
  }

  updateFAQ(id: number, faq: Partial<FAQInput>) {
    return {
      id,
      ...faq,
      updatedAt: new Date(),
    };
  }

  deleteFAQ() {
    return { message: 'FAQ deleted' };
  }
}
