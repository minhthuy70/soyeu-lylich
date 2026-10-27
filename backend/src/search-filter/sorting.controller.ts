import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SortingService } from './sorting.service';
import type { SortBy, SortOrder, SortConfig } from './sorting.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

function parseSortBy(value: string): SortBy {
  if (value === 'date' || value === 'name' || value === 'relevance') {
    return value;
  }
  throw new BadRequestException('Unsupported sort field');
}

function parseSortOrder(value: string): SortOrder {
  if (value === 'asc' || value === 'desc') {
    return value;
  }
  throw new BadRequestException('Sort order must be "asc" or "desc"');
}

@Controller('sorting')
@UseGuards(JwtAuthGuard)
export class SortingController {
  constructor(private readonly sortingService: SortingService) {}

  @Get('projects')
  sortProjects(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc',
    @Request() req: AuthenticatedRequest
  ) {
    return this.sortingService.sortProjects(
      req.user.id,
      parseSortBy(sortBy),
      parseSortOrder(order)
    );
  }

  @Get('experience')
  sortExperience(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc',
    @Request() req: AuthenticatedRequest
  ) {
    return this.sortingService.sortExperience(
      req.user.id,
      parseSortBy(sortBy),
      parseSortOrder(order)
    );
  }

  @Get('certificates')
  sortCertificates(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc',
    @Request() req: AuthenticatedRequest
  ) {
    return this.sortingService.sortCertificates(
      req.user.id,
      parseSortBy(sortBy),
      parseSortOrder(order)
    );
  }

  @Get('skills')
  sortSkills(
    @Query('sortBy') sortBy: string = 'date',
    @Query('order') order: string = 'desc',
    @Request() req: AuthenticatedRequest
  ) {
    return this.sortingService.sortSkills(req.user.id, parseSortBy(sortBy), parseSortOrder(order));
  }

  @Post('custom')
  customSort(@Body() body: { entityType: string; items: unknown[]; sortConfig: SortConfig[] }) {
    return this.sortingService.customSort(body.entityType, body.items, body.sortConfig);
  }
}
