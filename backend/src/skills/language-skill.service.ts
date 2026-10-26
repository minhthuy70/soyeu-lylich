import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageSkillService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    createDto: {
      language: string;
      proficiencyLevel?: string;
      listeningLevel?: string;
      speakingLevel?: string;
      readingLevel?: string;
      writingLevel?: string;
      certificateScore?: string;
      certificateInfo?: string;
      cefrLevel?: string;
    }
  ) {
    const skill = await this.prisma.languageSkill.create({
      data: {
        userId,
        language: createDto.language,
        proficiencyLevel: createDto.proficiencyLevel,
        listeningLevel: createDto.listeningLevel,
        speakingLevel: createDto.speakingLevel,
        readingLevel: createDto.readingLevel,
        writingLevel: createDto.writingLevel,
        certificateScore: createDto.certificateScore,
        certificateInfo: createDto.certificateInfo,
        cefrLevel: createDto.cefrLevel,
      },
    });

    return skill;
  }

  async findAll(userId: number) {
    const skills = await this.prisma.languageSkill.findMany({
      where: { userId },
      orderBy: [{ language: 'asc' }],
    });

    return {
      skills,
      count: skills.length,
    };
  }

  async findOne(userId: number, id: number) {
    const skill = await this.prisma.languageSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Language skill not found');
    }

    return skill;
  }

  async update(
    userId: number,
    id: number,
    updateDto: {
      language?: string;
      proficiencyLevel?: string;
      listeningLevel?: string;
      speakingLevel?: string;
      readingLevel?: string;
      writingLevel?: string;
      certificateScore?: string;
      certificateInfo?: string;
      cefrLevel?: string;
    }
  ) {
    const skill = await this.prisma.languageSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Language skill not found');
    }

    const updated = await this.prisma.languageSkill.update({
      where: { id },
      data: updateDto,
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const skill = await this.prisma.languageSkill.findFirst({
      where: { id, userId },
    });

    if (!skill) {
      throw new NotFoundException('Language skill not found');
    }

    await this.prisma.languageSkill.delete({
      where: { id },
    });

    return {
      message: 'Language skill deleted successfully',
    };
  }
}
