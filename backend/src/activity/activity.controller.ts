import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { ActivityService } from './activity.service';

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  async create(@Request() req, @Body() data: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.activityService.create(userId, data);
  }

  @Get()
  async findAll(@Request() req, @Query('type') type?: string) {
    const userId = this.extractUserIdFromRequest(req);
    
    if (type) {
      return this.activityService.getActivitiesByType(userId, type);
    }
    
    return this.activityService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.activityService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() data: any) {
    const userId = this.extractUserIdFromRequest(req);
    return this.activityService.update(userId, parseInt(id), data);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.activityService.remove(userId, parseInt(id));
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
