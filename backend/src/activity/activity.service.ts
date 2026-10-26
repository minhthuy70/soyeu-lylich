import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: number,
    data: {
      organization: string;
      position: string;
      startDate: Date;
      endDate?: Date;
      description: string;
      achievements?: string;
      type: string;
      memberCount?: number;
    }
  ) {
    return this.prisma.activity.create({
      data: {
        userId,
        organization: data.organization,
        position: data.position,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
        achievements: data.achievements ? [data.achievements] : [],
        type: data.type,
        memberCount: data.memberCount,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    return this.prisma.activity.findFirst({
      where: { id, userId },
    });
  }

  async update(userId: number, id: number, data: any) {
    return this.prisma.activity.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  }

  async remove(userId: number, id: number) {
    return this.prisma.activity.delete({
      where: { id },
    });
  }

  async getActivitiesByType(userId: number, type: string) {
    return this.prisma.activity.findMany({
      where: { userId, type },
      orderBy: { startDate: 'desc' },
    });
  }
}
