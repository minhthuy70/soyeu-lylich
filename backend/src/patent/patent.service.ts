import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PatentService {
  constructor(private prisma: PrismaService) {}

  async createPatent(userId: number, data: any) {
    return this.prisma.patent.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getPatents(userId: number) {
    return this.prisma.patent.findMany({
      where: { userId },
      orderBy: { filingDate: 'desc' },
    });
  }

  async getPatentById(id: number, userId: number) {
    return this.prisma.patent.findFirst({
      where: { id, userId },
    });
  }

  async updatePatent(id: number, userId: number, data: any) {
    return this.prisma.patent.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deletePatent(id: number, userId: number) {
    return this.prisma.patent.deleteMany({
      where: { id, userId },
    });
  }
}
