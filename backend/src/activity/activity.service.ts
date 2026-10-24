import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: {
    organizationName: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    description: string;
    achievements?: string;
    activityType: string;
    memberCount?: number;
  }) {
    return this.prisma.activity.create({
      data: {
        userId,
        ...data,
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
      where: { userId, activityType: type },
      orderBy: { startDate: 'desc' },
    });
  }
}
