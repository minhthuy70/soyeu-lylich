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
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectImageService } from './project-image.service';
import {
  CreateProjectImageDto,
  UpdateProjectImageDto,
  ReorderImagesDto,
} from './dto/create-project-image.dto';

@Controller('project-images')
export class ProjectImageController {
  constructor(private readonly projectImageService: ProjectImageService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateProjectImageDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req, @Query('projectId') projectId?: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.findAll(userId, projectId ? parseInt(projectId) : undefined);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateProjectImageDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.remove(userId, parseInt(id));
  }

  @Post('reorder')
  async reorder(@Request() req, @Body() body: { projectId: number; imageIds: number[] }) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.reorder(userId, body.projectId, { imageIds: body.imageIds });
  }

  @Post(':id/set-thumbnail')
  async setThumbnail(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectImageService.setThumbnail(userId, parseInt(id));
  }

  private extractUserIdFromRequest(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
