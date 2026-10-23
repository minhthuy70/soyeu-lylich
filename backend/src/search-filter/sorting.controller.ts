import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SortingService } from './sorting.service';

@Controller('sorting')
@UseGuards(JwtAuthGuard)
export class SortingController {
  constructor(private readonly sortingService: SortingService) {}

  @Get('projects')
  async sortProjects(@Query('sortBy') sortBy: string = 'date', @Query('order') order: string = 'desc') {
    return this.sortingService.sortProjects(sortBy as any, order as any);
  }

  @Get('experience')
  async sortExperience(@Query('sortBy') sortBy: string = 'date', @Query('order') order: string = 'desc') {
    return this.sortingService.sortExperience(sortBy as any, order as any);
  }

  @Get('certificates')
  async sortCertificates(@Query('sortBy') sortBy: string = 'date', @Query('order') order: string = 'desc') {
    return this.sortingService.sortCertificates(sortBy as any, order as any);
  }

  @Get('skills')
  async sortSkills(@Query('sortBy') sortBy: string = 'date', @Query('order') order: string = 'desc') {
    return this.sortingService.sortSkills(sortBy as any, order as any);
  }

  @Post('custom')
  async customSort(@Body() body: { entityType: string; items: any[]; sortConfig: any[] }) {
    return this.sortingService.customSort(body.entityType, body.items, body.sortConfig);
  }
}
