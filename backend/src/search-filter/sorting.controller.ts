import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SortingService } from './sorting.service';

@Controller('sorting')
@UseGuards(JwtAuthGuard)
export class SortingController {
  constructor(private readonly sortingService: SortingService) {}

  @Get('projects')
  async sortProjects(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc'
  ) {
    return this.sortingService.sortProjects(sortBy as 'date' | 'name' | 'relevance', order as 'asc' | 'desc');
  }

  @Get('experience')
  async sortExperience(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc'
  ) {
    return this.sortingService.sortExperience(sortBy as 'date' | 'name' | 'relevance', order as 'asc' | 'desc');
  }

  @Get('certificates')
  async sortCertificates(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc'
  ) {
    return this.sortingService.sortCertificates(sortBy as 'date' | 'name' | 'relevance', order as 'asc' | 'desc');
  }

  @Get('skills')
  async sortSkills(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc'
  ) {
    return this.sortingService.sortSkills(sortBy as 'date' | 'name' | 'relevance', order as 'asc' | 'desc');
  }

  @Post('custom')
  async customSort(@Body() body: { entityType: string; items: any[]; sortConfig: any[] }) {
    return this.sortingService.customSort(body.entityType, body.items, body.sortConfig);
  }
}
