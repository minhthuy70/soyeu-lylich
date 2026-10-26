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
import { AchievementService } from './achievement.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/create-achievement.dto';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateAchievementDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.achievementService.create(userId, createDto);
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('category') category?: string,
    @Query('level') level?: string
  ) {
    const userId = this.extractUserIdFromRequest(req);

    if (category) {
      return this.achievementService.getAchievementsByCategory(userId, category);
    }

    if (level) {
      return this.achievementService.getAchievementsByLevel(userId, level);
    }

    return this.achievementService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.achievementService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateAchievementDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.achievementService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.achievementService.remove(userId, parseInt(id));
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
