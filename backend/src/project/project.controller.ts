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
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateProjectDto) {
    return this.projectService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.projectService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.projectService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectDto
  ) {
    return this.projectService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(req.user.id, id);
  }

  @Post('reorder')
  reorder(
    @Request() req: AuthenticatedRequest,
    @Body() body: { projectOrders: { id: number; order: number }[] }
  ) {
    return this.projectService.reorder(req.user.id, body.projectOrders);
  }
}
