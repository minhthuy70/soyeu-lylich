import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ExperienceService } from './experience.service';
import type { CreateExperienceInput, UpdateExperienceInput } from './experience.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
@UseGuards(JwtAuthGuard)
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  async create(
    @Request() req: { user?: { id?: number } },
    @Body() createDto: CreateExperienceInput
  ) {
    const userId = req.user?.id || 1;
    return this.experienceService.create(userId, createDto);
  }

  @Get()
  async findAll(
    @Request() req: { user?: { id?: number } },
    @Query('employmentType') employmentType?: string
  ) {
    const userId = req.user?.id || 1;
    return this.experienceService.findAll(userId, employmentType);
  }

  @Get('current')
  async getCurrentJobs(@Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.experienceService.getCurrentJobs(userId);
  }

  @Get('timeline')
  async getTimeline(@Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.experienceService.getTimeline(userId);
  }

  @Get(':id')
  async findOne(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.experienceService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(
    @Request() req: { user?: { id?: number } },
    @Param('id') id: string,
    @Body() updateDto: UpdateExperienceInput
  ) {
    const userId = req.user?.id || 1;
    return this.experienceService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.experienceService.remove(userId, parseInt(id));
  }
}
