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
import { ResumeTemplateService } from './resume-template.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resume-templates')
@UseGuards(JwtAuthGuard)
export class ResumeTemplateController {
  constructor(private readonly resumeTemplateService: ResumeTemplateService) {}

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req, @Query('category') category?: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.findAll(userId, category);
  }

  @Get('public')
  async findPublic(@Query('category') category?: string) {
    return this.resumeTemplateService.findPublicTemplates(category);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.remove(userId, parseInt(id));
  }

  @Post(':id/use')
  async incrementUsage(@Param('id') id: string) {
    return this.resumeTemplateService.incrementUsage(parseInt(id));
  }

  @Post(':id/set-default')
  async setAsDefault(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.setAsDefault(userId, parseInt(id));
  }

  @Post(':id/duplicate')
  async duplicate(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.duplicate(userId, parseInt(id));
  }
}
