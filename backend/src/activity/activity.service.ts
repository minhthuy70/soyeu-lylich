import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ActivityInput {
  organization: string;
  position: string;
  startDate: Date | string;
  endDate?: Date | string;
  description: string;
  achievements?: string;
  type: string;
  memberCount?: number;
}

export type UpdateActivityInput = Partial<ActivityInput>;

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: ActivityInput) {
    return this.prisma.activity.create({
      data: {
        userId,
        organization: data.organization,
        position: data.position,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
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

  async update(userId: number, id: number, data: UpdateActivityInput) {
    return this.prisma.activity.update({
      where: { id, userId },
      data: {
        organization: data.organization,
        position: data.position,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        description: data.description,
        achievements: data.achievements === undefined ? undefined : [data.achievements],
        type: data.type,
        memberCount: data.memberCount,
        updatedAt: new Date(),
      },
    });
  }

  async remove(userId: number, id: number) {
    return this.prisma.activity.delete({
      where: { id, userId },
    });
  }

  async getActivitiesByType(userId: number, type: string) {
    return this.prisma.activity.findMany({
      where: { userId, type },
      orderBy: { startDate: 'desc' },
    });
  }
}
