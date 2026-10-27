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
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import type { ActivityInput, UpdateActivityInput } from './activity.service';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() data: ActivityInput) {
    return this.activityService.create(req.user.id, data);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest, @Query('type') type?: string) {
    if (type) {
      return this.activityService.getActivitiesByType(req.user.id, type);
    }

    return this.activityService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.activityService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateActivityInput
  ) {
    return this.activityService.update(req.user.id, id, data);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.activityService.remove(req.user.id, id);
  }
}
