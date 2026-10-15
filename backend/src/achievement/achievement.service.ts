import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAchievementDto, UpdateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateAchievementDto) {
    const achievement = await this.prisma.achievement.create({
      data: {
        userId,
        title: createDto.title,
        organization: createDto.organization,
        achievementDate: createDto.achievementDate ? new Date(createDto.achievementDate) : null,
        description: createDto.description,
        evidenceUrl: createDto.evidenceUrl,
        imageUrl: createDto.imageUrl,
        category: createDto.category || 'Other',
        level: createDto.level || 'School',
      },
    });

    return achievement;
  }

  async findAll(userId: number) {
    const achievements = await this.prisma.achievement.findMany({
      where: { userId },
      orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      achievements,
      count: achievements.length,
    };
  }

  async findOne(userId: number, id: number) {
    const achievement = await this.prisma.achievement.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!achievement) {
      throw new NotFoundException('Không tìm thấy thành tích');
    }

    return achievement;
  }

  async update(userId: number, id: number, updateDto: UpdateAchievementDto) {
    const achievement = await this.prisma.achievement.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!achievement) {
      throw new NotFoundException('Không tìm thấy thành tích');
    }

    const updated = await this.prisma.achievement.update({
      where: { id },
      data: {
        title: updateDto.title,
        organization: updateDto.organization,
        achievementDate: updateDto.achievementDate ? new Date(updateDto.achievementDate) : undefined,
        description: updateDto.description,
        evidenceUrl: updateDto.evidenceUrl,
        imageUrl: updateDto.imageUrl,
        category: updateDto.category,
        level: updateDto.level,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const achievement = await this.prisma.achievement.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!achievement) {
      throw new NotFoundException('Không tìm thấy thành tích');
    }

    await this.prisma.achievement.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa thành tích thành công',
    };
  }

  async getAchievementsByCategory(userId: number, category: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: {
        userId,
        category,
      },
      orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      achievements,
      count: achievements.length,
    };
  }

  async getAchievementsByLevel(userId: number, level: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: {
        userId,
        level,
      },
      orderBy: [{ achievementDate: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      achievements,
      count: achievements.length,
    };
  }
}
