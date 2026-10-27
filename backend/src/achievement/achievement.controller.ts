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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { AchievementService } from './achievement.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/create-achievement.dto';

@Controller('achievements')
@UseGuards(JwtAuthGuard)
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateAchievementDto) {
    return this.achievementService.create(req.user.id, createDto);
  }

  @Get()
  findAll(
    @Request() req: AuthenticatedRequest,
    @Query('category') category?: string,
    @Query('level') level?: string
  ) {
    if (category) {
      return this.achievementService.getAchievementsByCategory(req.user.id, category);
    }

    if (level) {
      return this.achievementService.getAchievementsByLevel(req.user.id, level);
    }

    return this.achievementService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.achievementService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAchievementDto
  ) {
    return this.achievementService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.achievementService.remove(req.user.id, id);
  }
}
