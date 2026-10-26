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
  UnauthorizedException,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateProjectDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateProjectDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectService.remove(userId, parseInt(id));
  }

  @Post('reorder')
  async reorder(@Request() req, @Body() body: { projectOrders: { id: number; order: number }[] }) {
    const userId = this.extractUserIdFromRequest(req);
    return this.projectService.reorder(userId, body.projectOrders);
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
