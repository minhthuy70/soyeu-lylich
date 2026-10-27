import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type PublicationInput = Pick<
  Prisma.PublicationUncheckedCreateInput,
  'title' | 'journal' | 'conference' | 'publicationDate' | 'coAuthors' | 'doi' | 'url' | 'abstract'
>;
export type PublicationUpdateInput = Partial<PublicationInput>;

@Injectable()
export class PublicationService {
  constructor(private prisma: PrismaService) {}

  async createPublication(userId: number, data: PublicationInput) {
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
      orderBy: { publicationDate: 'desc' },
    });
  }

  async getPublicationById(id: number, userId: number) {
    return this.prisma.publication.findFirst({
      where: { id, userId },
    });
  }

  async updatePublication(id: number, userId: number, data: PublicationUpdateInput) {
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
