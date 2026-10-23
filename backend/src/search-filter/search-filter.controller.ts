import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchFilterService } from './search-filter.service';

@Controller('search-filter')
@UseGuards(JwtAuthGuard)
export class SearchFilterController {
  constructor(private readonly searchFilterService: SearchFilterService) {}

  @Get('projects')
  async filterProjects(@Query() filters: any) {
    return this.searchFilterService.filterProjects(filters);
  }

  @Get('experience')
  async filterExperience(@Query() filters: any) {
    return this.searchFilterService.filterExperience(filters);
  }

  @Get('certificates')
  async filterCertificates(@Query() filters: any) {
    return this.searchFilterService.filterCertificates(filters);
  }

  @Get('skills')
  async filterSkills(@Query() filters: any) {
    return this.searchFilterService.filterSkills(filters);
  }

  @Post('presets')
  async saveFilterPreset(@Body() body: { userId: number; preset: any }) {
    return this.searchFilterService.saveFilterPreset(body.userId, body.preset);
  }

  @Get('presets')
  async getFilterPresets(@Query('userId') userId: string, @Query('type') type?: string) {
    return this.searchFilterService.getFilterPresets(parseInt(userId), type);
  }

  @Delete('presets/:id')
  async deleteFilterPreset(@Param('id') id: string, @Query('userId') userId: string) {
    return this.searchFilterService.deleteFilterPreset(parseInt(userId), parseInt(id));
  }
}
