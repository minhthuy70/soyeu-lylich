import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToolSkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createDto: {
      name: string;
      category?: string;
      proficiencyLevel?: string;
      yearsOfUse?: number;
      description?: string;
    }
  ) {
    const skill = await this.prisma.toolSkill.create({
      data: {
        userId,
        name: createDto.name,
        category: createDto.category,
        proficiencyLevel: createDto.proficiencyLevel,
        yearsOfUse: createDto.yearsOfUse,
        description: createDto.description,
      },
    });

    return skill;
  }

  async findAll(userId: number) {
    const skills = await this.prisma.toolSkill.findMany({
      where: { userId },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });

    return {
      skills,
      count: skills.length,
    };
  }

  async findOne(userId: number, id: number) {
    const skill = await this.prisma.toolSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Tool skill not found');
    }

    return skill;
  }

  async update(
    userId: number,
    id: number,
    updateDto: {
      name?: string;
      category?: string;
      proficiencyLevel?: string;
      yearsOfUse?: number;
      description?: string;
    }
  ) {
    const skill = await this.prisma.toolSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Tool skill not found');
    }

    const updated = await this.prisma.toolSkill.update({
      where: { id },
      data: updateDto,
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const skill = await this.prisma.toolSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Tool skill not found');
    }

    await this.prisma.toolSkill.delete({
      where: { id },
    });

    return {
      message: 'Tool skill deleted successfully',
    };
  }
}
