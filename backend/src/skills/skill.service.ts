import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createDto: {
      name: string;
      category?: string;
      level?: string;
      yearsOfExperience?: number;
      description?: string;
      progress?: number;
      tags?: string[];
      portfolioLink?: string;
    }
  ) {
    const skill = await this.prisma.skill.create({
      data: {
        userId,
        name: createDto.name,
        category: createDto.category,
        level: createDto.level,
        yearsOfExperience: createDto.yearsOfExperience,
        description: createDto.description,
        progress: createDto.progress || 0,
        tags: createDto.tags || [],
        portfolioLink: createDto.portfolioLink,
      },
    });

    return skill;
  }

  async findAll(userId: number) {
    const skills = await this.prisma.skill.findMany({
      where: { userId },
      orderBy: [{ progress: 'desc' }, { name: 'asc' }],
    });

    return {
      skills,
      count: skills.length,
    };
  }

  async findOne(userId: number, id: number) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    return skill;
  }

  async update(
    userId: number,
    id: number,
    updateDto: {
      name?: string;
      category?: string;
      level?: string;
      yearsOfExperience?: number;
      description?: string;
      progress?: number;
      tags?: string[];
      portfolioLink?: string;
      endorsementCount?: number;
    }
  ) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    const updated = await this.prisma.skill.update({
      where: { id },
      data: {
        name: updateDto.name,
        category: updateDto.category,
        level: updateDto.level,
        yearsOfExperience: updateDto.yearsOfExperience,
        description: updateDto.description,
        progress: updateDto.progress,
        tags: updateDto.tags,
        portfolioLink: updateDto.portfolioLink,
        endorsementCount: updateDto.endorsementCount,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    await this.prisma.skill.delete({
      where: { id },
    });

    return {
      message: 'Skill deleted successfully',
    };
  }

  async incrementEndorsement(userId: number, id: number) {
    const skill = await this.prisma.skill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Skill not found');
    }

    const updated = await this.prisma.skill.update({
      where: { id },
      data: {
        endorsementCount: (skill.endorsementCount || 0) + 1,
      },
    });

    return updated;
  }
}
