import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { ContentManagementService } from './content-management.service';
import type {
  AnnouncementBannerInput,
  FAQInput,
  PublicContent,
  SystemSettings,
} from './content-management.service';
import type { UpdateResumeTemplateInput } from '../resume-template/resume-template.service';

@Controller('admin/content')
@UseGuards(AdminGuard)
export class ContentManagementController {
  constructor(private readonly contentManagementService: ContentManagementService) {}

  // Resume Templates
  @Get('resume-templates')
  getAllResumeTemplates() {
    return this.contentManagementService.getAllResumeTemplates();
  }

  @Put('resume-templates/:id')
  updateResumeTemplate(@Param('id') id: string, @Body() updateData: UpdateResumeTemplateInput) {
    return this.contentManagementService.updateResumeTemplate(parseInt(id), updateData);
  }

  @Delete('resume-templates/:id')
  deleteResumeTemplate(@Param('id') id: string) {
    return this.contentManagementService.deleteResumeTemplate(parseInt(id));
  }

  // Skill Categories
  @Get('skill-categories')
  getSkillCategories() {
    return this.contentManagementService.getSkillCategories();
  }

  @Post('skill-categories')
  createSkillCategory(@Body() body: { category: string }) {
    return this.contentManagementService.createSkillCategory(body.category);
  }

  @Delete('skill-categories/:category')
  deleteSkillCategory(@Param('category') category: string) {
    return this.contentManagementService.deleteSkillCategory(category);
  }

  // System Settings
  @Get('settings')
  getSystemSettings() {
    return this.contentManagementService.getSystemSettings();
  }

  @Put('settings')
  updateSystemSettings(@Body() settings: Partial<SystemSettings>) {
    return this.contentManagementService.updateSystemSettings(settings);
  }

  // Public Content
  @Get('public')
  getPublicContent() {
    return this.contentManagementService.getPublicContent();
  }

  @Put('public')
  updatePublicContent(@Body() content: Partial<PublicContent>) {
    return this.contentManagementService.updatePublicContent(content);
  }

  // Announcement Banners
  @Get('banners')
  getAnnouncementBanners() {
    return this.contentManagementService.getAnnouncementBanners();
  }

  @Post('banners')
  createAnnouncementBanner(@Body() banner: AnnouncementBannerInput) {
    return this.contentManagementService.createAnnouncementBanner(banner);
  }

  @Put('banners/:id')
  updateAnnouncementBanner(
    @Param('id') id: string,
    @Body() banner: Partial<AnnouncementBannerInput>
  ) {
    return this.contentManagementService.updateAnnouncementBanner(parseInt(id), banner);
  }

  @Delete('banners/:id')
  deleteAnnouncementBanner() {
    return this.contentManagementService.deleteAnnouncementBanner();
  }

  // FAQ
  @Get('faqs')
  getFAQs() {
    return this.contentManagementService.getFAQs();
  }

  @Post('faqs')
  createFAQ(@Body() faq: FAQInput) {
    return this.contentManagementService.createFAQ(faq);
  }

  @Put('faqs/:id')
  updateFAQ(@Param('id') id: string, @Body() faq: Partial<FAQInput>) {
    return this.contentManagementService.updateFAQ(parseInt(id), faq);
  }

  @Delete('faqs/:id')
  deleteFAQ() {
    return this.contentManagementService.deleteFAQ();
  }
}
