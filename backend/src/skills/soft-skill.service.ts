import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SoftSkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createDto: {
      name: string;
      level?: string;
      description?: string;
      progress?: number;
    }
  ) {
    const skill = await this.prisma.softSkill.create({
      data: {
        userId,
        name: createDto.name,
        level: createDto.level,
        description: createDto.description,
        progress: createDto.progress || 0,
      },
    });

    return skill;
  }

  async findAll(userId: number) {
    const skills = await this.prisma.softSkill.findMany({
      where: { userId },
      orderBy: [{ progress: 'desc' }, { name: 'asc' }],
    });

    return {
      skills,
      count: skills.length,
    };
  }

  async findOne(userId: number, id: number) {
    const skill = await this.prisma.softSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Soft skill not found');
    }

    return skill;
  }

  async update(
    userId: number,
    id: number,
    updateDto: {
      name?: string;
      level?: string;
      description?: string;
      progress?: number;
    }
  ) {
    const skill = await this.prisma.softSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Soft skill not found');
    }

    const updated = await this.prisma.softSkill.update({
      where: { id },
      data: updateDto,
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const skill = await this.prisma.softSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Soft skill not found');
    }

    await this.prisma.softSkill.delete({
      where: { id },
    });

    return {
      message: 'Soft skill deleted successfully',
    };
  }
}
