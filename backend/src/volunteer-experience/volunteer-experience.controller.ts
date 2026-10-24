import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { VolunteerExperienceService } from './volunteer-experience.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('volunteer-experiences')
@UseGuards(JwtAuthGuard)
export class VolunteerExperienceController {
  constructor(private readonly volunteerExperienceService: VolunteerExperienceService) {}

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req, @Query('cause') cause?: string) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.findAll(userId, cause);
  }

  @Get('total-hours')
  async getTotalHours(@Request() req) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.getTotalHours(userId);
  }

  @Get('by-cause')
  async getByCause(@Request() req) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.getByCause(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.volunteerExperienceService.remove(userId, parseInt(id));
  }
}
