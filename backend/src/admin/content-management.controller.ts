import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { ContentManagementService } from './content-management.service';

@Controller('admin/content')
@UseGuards(AdminGuard)
export class ContentManagementController {
  constructor(private readonly contentManagementService: ContentManagementService) {}

  // Resume Templates
  @Get('resume-templates')
  async getAllResumeTemplates() {
    return this.contentManagementService.getAllResumeTemplates();
  }

  @Put('resume-templates/:id')
  async updateResumeTemplate(@Param('id') id: string, @Body() updateData: any) {
    return this.contentManagementService.updateResumeTemplate(parseInt(id), updateData);
  }

  @Delete('resume-templates/:id')
  async deleteResumeTemplate(@Param('id') id: string) {
    return this.contentManagementService.deleteResumeTemplate(parseInt(id));
  }

  // Skill Categories
  @Get('skill-categories')
  async getSkillCategories() {
    return this.contentManagementService.getSkillCategories();
  }

  @Post('skill-categories')
  async createSkillCategory(@Body() body: { category: string }) {
    return this.contentManagementService.createSkillCategory(body.category);
  }

  @Delete('skill-categories/:category')
  async deleteSkillCategory(@Param('category') category: string) {
    return this.contentManagementService.deleteSkillCategory(category);
  }

  // System Settings
  @Get('settings')
  async getSystemSettings() {
    return this.contentManagementService.getSystemSettings();
  }

  @Put('settings')
  async updateSystemSettings(@Body() settings: any) {
    return this.contentManagementService.updateSystemSettings(settings);
  }

  // Public Content
  @Get('public')
  async getPublicContent() {
    return this.contentManagementService.getPublicContent();
  }

  @Put('public')
  async updatePublicContent(@Body() content: any) {
    return this.contentManagementService.updatePublicContent(content);
  }

  // Announcement Banners
  @Get('banners')
  async getAnnouncementBanners() {
    return this.contentManagementService.getAnnouncementBanners();
  }

  @Post('banners')
  async createAnnouncementBanner(@Body() banner: any) {
    return this.contentManagementService.createAnnouncementBanner(banner);
  }

  @Put('banners/:id')
  async updateAnnouncementBanner(@Param('id') id: string, @Body() banner: any) {
    return this.contentManagementService.updateAnnouncementBanner(parseInt(id), banner);
  }

  @Delete('banners/:id')
  async deleteAnnouncementBanner(@Param('id') id: string) {
    return this.contentManagementService.deleteAnnouncementBanner(parseInt(id));
  }

  // FAQ
  @Get('faqs')
  async getFAQs() {
    return this.contentManagementService.getFAQs();
  }

  @Post('faqs')
  async createFAQ(@Body() faq: any) {
    return this.contentManagementService.createFAQ(faq);
  }

  @Put('faqs/:id')
  async updateFAQ(@Param('id') id: string, @Body() faq: any) {
    return this.contentManagementService.updateFAQ(parseInt(id), faq);
  }

  @Delete('faqs/:id')
  async deleteFAQ(@Param('id') id: string) {
    return this.contentManagementService.deleteFAQ(parseInt(id));
  }
}
