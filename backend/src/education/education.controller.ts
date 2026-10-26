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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('educations')
@UseGuards(JwtAuthGuard)
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    const userId = req.user?.id || 1;
    return this.educationService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req, @Query('degree') degree?: string) {
    const userId = req.user?.id || 1;
    return this.educationService.findAll(userId, degree);
  }

  @Get('current')
  async getCurrentStudies(@Request() req) {
    const userId = req.user?.id || 1;
    return this.educationService.getCurrentStudies(userId);
  }

  @Get('timeline')
  async getTimeline(@Request() req) {
    const userId = req.user?.id || 1;
    return this.educationService.getTimeline(userId);
  }

  @Get('by-degree')
  async getByDegree(@Request() req, @Query('degree') degree: string) {
    const userId = req.user?.id || 1;
    return this.educationService.getByDegree(userId, degree);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.educationService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
    const userId = req.user?.id || 1;
    return this.educationService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.educationService.remove(userId, parseInt(id));
  }
}
