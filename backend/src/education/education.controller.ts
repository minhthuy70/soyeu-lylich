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
import { EducationService } from './education.service';
import type { CreateEducationInput, UpdateEducationInput } from './education.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('educations')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async create(
    @Request() req: { user?: { id?: number } },
    @Body() createDto: CreateEducationInput
  ) {
    const userId = req.user?.id || 1;
    return this.educationService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req: { user?: { id?: number } }, @Query('degree') degree?: string) {
    const userId = req.user?.id || 1;
    return this.educationService.findAll(userId, degree);
  }

  @Get('current')
  async getCurrentStudies(@Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.educationService.getCurrentStudies(userId);
  }

  @Get('timeline')
  async getTimeline(@Request() req: { user?: { id?: number } }) {
    const userId = req.user?.id || 1;
    return this.educationService.getTimeline(userId);
  }

  @Get('by-degree')
  async getByDegree(@Request() req: { user?: { id?: number } }, @Query('degree') degree: string) {
    const userId = req.user?.id || 1;
    return this.educationService.getByDegree(userId, degree);
  }

  @Get(':id')
  async findOne(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.educationService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(
    @Request() req: { user?: { id?: number } },
    @Param('id') id: string,
    @Body() updateDto: UpdateEducationInput
  ) {
    const userId = req.user?.id || 1;
    return this.educationService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.educationService.remove(userId, parseInt(id));
  }
}
