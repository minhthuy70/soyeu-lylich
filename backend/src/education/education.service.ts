import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateEducationInput = Omit<
  Prisma.EducationUncheckedCreateInput,
  'userId' | 'startDate' | 'endDate'
> & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
};

export type UpdateEducationInput = Omit<
  Prisma.EducationUncheckedUpdateInput,
  'userId' | 'startDate' | 'endDate'
> & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
};

@Injectable()
export class EducationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateEducationInput) {
    const education = await this.prisma.education.create({
      data: {
        userId,
        schoolName: createDto.schoolName,
        major: createDto.major,
        degree: createDto.degree,
        startDate: createDto.startDate ? new Date(createDto.startDate) : null,
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        currentStudyStatus: createDto.currentStudyStatus,
        gpa: createDto.gpa,
        academicAchievements: createDto.academicAchievements || [],
        description: createDto.description,
        thesisTopic: createDto.thesisTopic,
        relevantCoursework: createDto.relevantCoursework || [],
        studyAbroad: createDto.studyAbroad,
      },
    });

    return education;
  }

  async findAll(userId: number, degree?: string) {
    const where: Prisma.EducationWhereInput = { userId };

    if (degree) {
      where.degree = degree;
    }

    const educations = await this.prisma.education.findMany({
      where,
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      educations,
      count: educations.length,
    };
  }

  async findOne(userId: number, id: number) {
    const education = await this.prisma.education.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!education) {
      throw new NotFoundException('Không tìm thấy thông tin học vấn');
    }

    return education;
  }

  async update(userId: number, id: number, updateDto: UpdateEducationInput) {
    const education = await this.prisma.education.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!education) {
      throw new NotFoundException('Không tìm thấy thông tin học vấn');
    }

    const updated = await this.prisma.education.update({
      where: { id },
      data: {
        schoolName: updateDto.schoolName,
        major: updateDto.major,
        degree: updateDto.degree,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        currentStudyStatus: updateDto.currentStudyStatus,
        gpa: updateDto.gpa,
        academicAchievements: updateDto.academicAchievements,
        description: updateDto.description,
        thesisTopic: updateDto.thesisTopic,
        relevantCoursework: updateDto.relevantCoursework,
        studyAbroad: updateDto.studyAbroad,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const education = await this.prisma.education.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!education) {
      throw new NotFoundException('Không tìm thấy thông tin học vấn');
    }

    await this.prisma.education.delete({
      where: { id },
    });

    return { message: 'Đã xóa thông tin học vấn thành công' };
  }

  async getCurrentStudies(userId: number) {
    const currentStudies = await this.prisma.education.findMany({
      where: {
        userId,
        currentStudyStatus: 'Đang học',
      },
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      currentStudies,
      count: currentStudies.length,
    };
  }

  async getTimeline(userId: number) {
    const educations = await this.prisma.education.findMany({
      where: { userId },
      orderBy: [{ startDate: 'desc' }],
    });

    const timeline = educations.map((edu) => ({
      id: edu.id,
      schoolName: edu.schoolName,
      major: edu.major,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      currentStudyStatus: edu.currentStudyStatus,
      gpa: edu.gpa,
    }));

    return { timeline };
  }

  async getByDegree(userId: number, degree: string) {
    const educations = await this.prisma.education.findMany({
      where: {
        userId,
        degree: {
          contains: degree,
          mode: 'insensitive',
        },
      },
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      educations,
      count: educations.length,
    };
  }
}
