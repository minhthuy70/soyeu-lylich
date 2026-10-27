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
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ProjectImageService } from './project-image.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import {
  CreateProjectImageDto,
  ReorderImagesDto,
  UpdateProjectImageDto,
} from './dto/create-project-image.dto';

@Controller('project-images')
@UseGuards(JwtAuthGuard)
export class ProjectImageController {
  constructor(private readonly projectImageService: ProjectImageService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateProjectImageDto) {
    return this.projectImageService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest, @Query('projectId') projectId?: string) {
    const parsedProjectId = projectId === undefined ? undefined : Number(projectId);
    if (parsedProjectId !== undefined && !Number.isSafeInteger(parsedProjectId)) {
      throw new BadRequestException('projectId must be a valid integer');
    }

    return this.projectImageService.findAll(req.user.id, parsedProjectId);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.projectImageService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProjectImageDto
  ) {
    return this.projectImageService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.projectImageService.remove(req.user.id, id);
  }

  @Post('reorder')
  reorder(
    @Request() req: AuthenticatedRequest,
    @Body() body: ReorderImagesDto & { projectId: number }
  ) {
    return this.projectImageService.reorder(req.user.id, body.projectId, {
      imageIds: body.imageIds,
    });
  }

  @Post(':id/set-thumbnail')
  setThumbnail(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.projectImageService.setThumbnail(req.user.id, id);
  }
}
