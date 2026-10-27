import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateFreelanceInput = Omit<
  Prisma.FreelanceProjectUncheckedCreateInput,
  'userId' | 'startDate' | 'endDate'
> & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
};

export type UpdateFreelanceInput = Omit<
  Prisma.FreelanceProjectUncheckedUpdateInput,
  'userId' | 'startDate' | 'endDate'
> & {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
};

@Injectable()
export class FreelanceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateFreelanceInput) {
    const freelance = await this.prisma.freelanceProject.create({
      data: {
        userId,
        clientName: createDto.clientName,
        projectScope: createDto.projectScope,
        rate: createDto.rate,
        budget: createDto.budget,
        duration: createDto.duration,
        startDate: createDto.startDate ? new Date(createDto.startDate) : null,
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        technologies: createDto.technologies || [],
        outcome: createDto.outcome,
        description: createDto.description,
      },
    });

    return freelance;
  }

  async findAll(userId: number) {
    const freelances = await this.prisma.freelanceProject.findMany({
      where: { userId },
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      freelanceProjects: freelances,
      count: freelances.length,
    };
  }

  async findOne(userId: number, id: number) {
    const freelance = await this.prisma.freelanceProject.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!freelance) {
      throw new NotFoundException('Không tìm thấy dự án freelance');
    }

    return freelance;
  }

  async update(userId: number, id: number, updateDto: UpdateFreelanceInput) {
    const freelance = await this.prisma.freelanceProject.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!freelance) {
      throw new NotFoundException('Không tìm thấy dự án freelance');
    }

    const updated = await this.prisma.freelanceProject.update({
      where: { id },
      data: {
        clientName: updateDto.clientName,
        projectScope: updateDto.projectScope,
        rate: updateDto.rate,
        budget: updateDto.budget,
        duration: updateDto.duration,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        technologies: updateDto.technologies,
        outcome: updateDto.outcome,
        description: updateDto.description,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const freelance = await this.prisma.freelanceProject.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!freelance) {
      throw new NotFoundException('Không tìm thấy dự án freelance');
    }

    await this.prisma.freelanceProject.delete({
      where: { id },
    });

    return { message: 'Đã xóa dự án freelance thành công' };
  }

  async getTotalEarnings(userId: number) {
    const freelances = await this.prisma.freelanceProject.findMany({
      where: { userId },
    });

    let totalEarnings = 0;
    freelances.forEach((f) => {
      if (f.budget) {
        const budgetValue = parseFloat(f.budget.replace(/[^0-9.-]+/g, ''));
        if (!isNaN(budgetValue)) {
          totalEarnings += budgetValue;
        }
      }
    });

    return { totalEarnings };
  }

  async getByClient(userId: number, clientName: string) {
    const freelances = await this.prisma.freelanceProject.findMany({
      where: {
        userId,
        clientName: {
          contains: clientName,
          mode: 'insensitive',
        },
      },
      orderBy: [{ startDate: 'desc' }],
    });

    return {
      freelanceProjects: freelances,
      count: freelances.length,
    };
  }
}
