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
import type {
  CreateResumeTemplateInput,
  UpdateResumeTemplateInput,
} from './resume-template.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('resume-templates')
@UseGuards(JwtAuthGuard)
export class ResumeTemplateController {
  constructor(private readonly resumeTemplateService: ResumeTemplateService) {}

  @Post()
  create(@Request() req: { user?: { id?: number } }, @Body() createDto: CreateResumeTemplateInput) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.create(userId, createDto);
  }

  @Get()
  findAll(@Request() req: { user?: { id?: number } }, @Query('category') category?: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.findAll(userId, category);
  }

  @Get('public')
  findPublic(@Query('category') category?: string) {
    return this.resumeTemplateService.findPublicTemplates(category);
  }

  @Get(':id')
  findOne(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  update(
    @Request() req: { user?: { id?: number } },
    @Param('id') id: string,
    @Body() updateDto: UpdateResumeTemplateInput
  ) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  remove(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.remove(userId, parseInt(id));
  }

  @Post(':id/use')
  incrementUsage(@Param('id') id: string) {
    return this.resumeTemplateService.incrementUsage(parseInt(id));
  }

  @Post(':id/set-default')
  setAsDefault(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.setAsDefault(userId, parseInt(id));
  }

  @Post(':id/duplicate')
  duplicate(@Request() req: { user?: { id?: number } }, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.resumeTemplateService.duplicate(userId, parseInt(id));
  }
}
