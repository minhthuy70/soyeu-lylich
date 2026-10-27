import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchFilterService } from './search-filter.service';
import type {
  CertificateSearchFilters,
  ExperienceSearchFilters,
  ProjectSearchFilters,
  SkillSearchFilters,
} from './search-filter.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

@Controller('search-filter')
@UseGuards(JwtAuthGuard)
export class SearchFilterController {
  constructor(private readonly searchFilterService: SearchFilterService) {}

  @Get('projects')
  filterProjects(@Query() filters: ProjectSearchFilters, @Request() req: AuthenticatedRequest) {
    return this.searchFilterService.filterProjects(req.user.id, filters);
  }

  @Get('experience')
  filterExperience(
    @Query() filters: ExperienceSearchFilters,
    @Request() req: AuthenticatedRequest
  ) {
    return this.searchFilterService.filterExperience(req.user.id, filters);
  }

  @Get('certificates')
  filterCertificates(
    @Query() filters: CertificateSearchFilters,
    @Request() req: AuthenticatedRequest
  ) {
    return this.searchFilterService.filterCertificates(req.user.id, filters);
  }

  @Get('skills')
  filterSkills(@Query() filters: SkillSearchFilters, @Request() req: AuthenticatedRequest) {
    return this.searchFilterService.filterSkills(req.user.id, filters);
  }

  @Post('presets')
  saveFilterPreset(
    @Body()
    body: {
      preset: {
        name: string;
        type: 'projects' | 'experience' | 'certificates' | 'skills';
        filters: Prisma.InputJsonValue;
      };
    },
    @Request() req: AuthenticatedRequest
  ) {
    return this.searchFilterService.saveFilterPreset(req.user.id, body.preset);
  }

  @Get('presets')
  getFilterPresets(@Request() req: AuthenticatedRequest, @Query('type') type?: string) {
    return this.searchFilterService.getFilterPresets(req.user.id, type);
  }

  @Delete('presets/:id')
  deleteFilterPreset(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.searchFilterService.deleteFilterPreset(req.user.id, parseInt(id));
  }

  @Get('global')
  globalSearch(@Query('q') query: string, @Request() req: AuthenticatedRequest) {
    return this.searchFilterService.globalSearch(query, req.user.id);
  }

  @Post('history')
  saveSearchHistory(@Body() body: { query: string }, @Request() req: AuthenticatedRequest) {
    return this.searchFilterService.saveSearchHistory(req.user.id, body.query);
  }

  @Get('history')
  getSearchHistory(@Request() req: AuthenticatedRequest, @Query('limit') limit: string = '10') {
    return this.searchFilterService.getSearchHistory(req.user.id, parseInt(limit));
  }

  @Delete('history')
  clearSearchHistory(@Request() req: AuthenticatedRequest) {
    return this.searchFilterService.clearSearchHistory(req.user.id);
  }
}
