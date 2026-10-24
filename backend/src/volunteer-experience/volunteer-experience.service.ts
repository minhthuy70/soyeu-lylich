import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VolunteerExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: any) {
    const volunteer = await this.prisma.volunteerExperience.create({
      data: {
        userId,
        organization: createDto.organization,
        role: createDto.role,
        startDate: new Date(createDto.startDate),
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        isCurrent: createDto.isCurrent || false,
        description: createDto.description,
        responsibilities: createDto.responsibilities,
        achievements: createDto.achievements,
        hoursPerWeek: createDto.hoursPerWeek,
        cause: createDto.cause,
      },
    });

    return volunteer;
  }

  async findAll(userId: number, cause?: string) {
    const where: any = { userId };

    if (cause) {
      where.cause = cause;
    }

    const volunteers = await this.prisma.volunteerExperience.findMany({
      where,
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      volunteerExperiences: volunteers,
      count: volunteers.length,
    };
  }

  async findOne(userId: number, id: number) {
    const volunteer = await this.prisma.volunteerExperience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Không tìm thấy kinh nghiệm tình nguyện');
    }

    return volunteer;
  }

  async update(userId: number, id: number, updateDto: any) {
    const volunteer = await this.prisma.volunteerExperience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Không tìm thấy kinh nghiệm tình nguyện');
    }

    const updated = await this.prisma.volunteerExperience.update({
      where: { id },
      data: {
        organization: updateDto.organization,
        role: updateDto.role,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        isCurrent: updateDto.isCurrent,
        description: updateDto.description,
        responsibilities: updateDto.responsibilities,
        achievements: updateDto.achievements,
        hoursPerWeek: updateDto.hoursPerWeek,
        cause: updateDto.cause,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const volunteer = await this.prisma.volunteerExperience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!volunteer) {
      throw new NotFoundException('Không tìm thấy kinh nghiệm tình nguyện');
    }

    await this.prisma.volunteerExperience.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa kinh nghiệm tình nguyện thành công',
    };
  }

  async getTotalHours(userId: number) {
    const volunteers = await this.prisma.volunteerExperience.findMany({
      where: { userId },
    });

    let totalHours = 0;
    volunteers.forEach((v) => {
      if (v.hoursPerWeek) {
        const weeks = v.endDate
          ? Math.floor((v.endDate.getTime() - v.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000))
          : Math.floor((new Date().getTime() - v.startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
        totalHours += v.hoursPerWeek * Math.max(1, weeks);
      }
    });

    return { totalHours };
  }

  async getByCause(userId: number) {
    const volunteers = await this.prisma.volunteerExperience.findMany({
      where: { userId },
    });

    const causeMap = new Map();
    volunteers.forEach((v) => {
      if (v.cause) {
        const count = causeMap.get(v.cause) || 0;
        causeMap.set(v.cause, count + 1);
      }
    });

    return {
      causes: Array.from(causeMap.entries()).map(([cause, count]) => ({ cause, count })),
    };
  }
}
