import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationService {
  constructor(private prisma: PrismaService) {}

  async createPublication(userId: number, data: any) {
    return this.prisma.publication.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getPublications(userId: number) {
    return this.prisma.publication.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
  }

  async getPublicationById(id: number, userId: number) {
    return this.prisma.publication.findFirst({
      where: { id, userId },
    });
  }

  async updatePublication(id: number, userId: number, data: any) {
    return this.prisma.publication.updateMany({
      where: { id, userId },
      data,
    });
  }

  async deletePublication(id: number, userId: number) {
    return this.prisma.publication.deleteMany({
      where: { id, userId },
    });
  }
}
