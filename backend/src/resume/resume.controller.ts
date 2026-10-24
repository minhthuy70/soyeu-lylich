import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeService } from './resume.service';

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  async create(@Request() req, @Body() data: any) {
    const userId = req.user?.id || 1;
    return this.resumeService.createResume(userId, data);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id || 1;
    return this.resumeService.getResumes(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeService.getResumeById(parseInt(id), userId);
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    const userId = req.user?.id || 1;
    return this.resumeService.updateResume(parseInt(id), userId, data);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeService.deleteResume(parseInt(id), userId);
  }

  @Post(':id/duplicate')
  async duplicate(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeService.duplicateResume(parseInt(id), userId);
  }

  @Post(':id/set-default')
  async setDefault(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeService.setDefaultResume(parseInt(id), userId);
  }

  @Get(':id/compare/:otherId')
  async compare(@Request() req, @Param('id') id: string, @Param('otherId') otherId: string) {
    const userId = req.user?.id || 1;
    return this.resumeService.compareResumes(parseInt(id), parseInt(otherId), userId);
  }

  @Get(':id/history')
  async getHistory(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeService.getResumeVersionHistory(parseInt(id), userId);
  }

  @Put(':id/sections/order')
  async updateSectionOrder(@Request() req, @Param('id') id: string, @Body() body: { sectionOrders: any[] }) {
    const userId = req.user?.id || 1;
    return this.resumeService.updateSectionOrder(parseInt(id), userId, body.sectionOrders);
  }

  @Put(':id/sections/:sectionId/toggle')
  async toggleSection(@Request() req, @Param('id') id: string, @Param('sectionId') sectionId: string, @Body() body: { enabled: boolean }) {
    const userId = req.user?.id || 1;
    return this.resumeService.toggleSection(parseInt(id), userId, parseInt(sectionId), body.enabled);
  }
}
