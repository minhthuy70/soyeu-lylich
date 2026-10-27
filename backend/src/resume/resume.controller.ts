import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumeService } from './resume.service';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

type ResumeData = {
  title?: string;
  template?: string;
  isDefault?: boolean;
};

@Controller('resumes')
@UseGuards(JwtAuthGuard)
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() data: ResumeData & { title: string }) {
    return this.resumeService.createResume(req.user.id, data);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.resumeService.getResumes(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.resumeService.getResumeById(id, req.user.id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ResumeData
  ) {
    return this.resumeService.updateResume(id, req.user.id, data);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.resumeService.deleteResume(id, req.user.id);
  }

  @Post(':id/duplicate')
  duplicate(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.resumeService.duplicateResume(id, req.user.id);
  }

  @Post(':id/set-default')
  setDefault(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.resumeService.setDefaultResume(id, req.user.id);
  }

  @Get(':id/compare/:otherId')
  compare(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('otherId', ParseIntPipe) otherId: number
  ) {
    return this.resumeService.compareResumes(id, otherId, req.user.id);
  }

  @Get(':id/history')
  getHistory(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.resumeService.getResumeVersionHistory(id, req.user.id);
  }

  @Put(':id/sections/order')
  updateSectionOrder(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { sectionOrders: { sectionId: number; order: number }[] }
  ) {
    return this.resumeService.updateSectionOrder(id, req.user.id, body.sectionOrders);
  }

  @Put(':id/sections/:sectionId/toggle')
  toggleSection(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Param('sectionId', ParseIntPipe) sectionId: number,
    @Body() body: { enabled: boolean }
  ) {
    return this.resumeService.toggleSection(id, req.user.id, sectionId, body.enabled);
  }
}
