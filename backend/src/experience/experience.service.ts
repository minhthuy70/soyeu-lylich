import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: any) {
    const experience = await this.prisma.experience.create({
      data: {
        userId,
        companyName: createDto.companyName,
        position: createDto.position,
        employmentType: createDto.employmentType,
        startDate: createDto.startDate ? new Date(createDto.startDate) : null,
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        currentJobStatus: createDto.currentJobStatus || false,
        jobDescription: createDto.jobDescription,
        responsibilities: createDto.responsibilities || [],
        achievements: createDto.achievements || [],
        technologiesUsed: createDto.technologiesUsed || [],
        companyWebsite: createDto.companyWebsite,
        companyLogo: createDto.companyLogo,
        workLocation: createDto.workLocation,
        workType: createDto.workType,
        salaryRange: createDto.salaryRange,
        reasonForLeaving: createDto.reasonForLeaving,
        supervisorName: createDto.supervisorName,
      },
    });

    return experience;
  }

  async findAll(userId: number, employmentType?: string) {
    const where: any = { userId };

    if (employmentType) {
      where.employmentType = employmentType;
    }

    const experiences = await this.prisma.experience.findMany({
      where,
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      experiences,
      count: experiences.length,
    };
  }

  async findOne(userId: number, id: number) {
    const experience = await this.prisma.experience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!experience) {
      throw new NotFoundException('Không tìm thấy kinh nghiệm làm việc');
    }

    return experience;
  }

  async update(userId: number, id: number, updateDto: any) {
    const experience = await this.prisma.experience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!experience) {
      throw new NotFoundException('Không tìm thấy kinh nghiệm làm việc');
    }

    const updated = await this.prisma.experience.update({
      where: { id },
      data: {
        companyName: updateDto.companyName,
        position: updateDto.position,
        employmentType: updateDto.employmentType,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        currentJobStatus: updateDto.currentJobStatus,
        jobDescription: updateDto.jobDescription,
        responsibilities: updateDto.responsibilities,
        achievements: updateDto.achievements,
        technologiesUsed: updateDto.technologiesUsed,
        companyWebsite: updateDto.companyWebsite,
        companyLogo: updateDto.companyLogo,
        workLocation: updateDto.workLocation,
        workType: updateDto.workType,
        salaryRange: updateDto.salaryRange,
        reasonForLeaving: updateDto.reasonForLeaving,
        supervisorName: updateDto.supervisorName,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const experience = await this.prisma.experience.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!experience) {
      throw new NotFoundException('Không tìm thấy kinh nghiệm làm việc');
    }

    await this.prisma.experience.delete({
      where: { id },
    });

    return { message: 'Đã xóa kinh nghiệm làm việc thành công' };
  }

  async getCurrentJobs(userId: number) {
    const currentJobs = await this.prisma.experience.findMany({
      where: {
        userId,
        currentJobStatus: true,
      },
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      currentJobs,
      count: currentJobs.length,
    };
  }

  async getTimeline(userId: number) {
    const experiences = await this.prisma.experience.findMany({
      where: { userId },
      orderBy: [{ startDate: 'desc' }],
    });

    const timeline = experiences.map((exp) => ({
      id: exp.id,
      companyName: exp.companyName,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      currentJobStatus: exp.currentJobStatus,
      workType: exp.workType,
      technologiesUsed: exp.technologiesUsed,
    }));

    return { timeline };
  }
}
