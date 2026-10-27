import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type CreateReferenceInput = Pick<
  Prisma.ReferenceUncheckedCreateInput,
  'name' | 'position' | 'company' | 'contact' | 'relationship'
>;
export type UpdateReferenceInput = Partial<CreateReferenceInput>;

@Injectable()
export class ReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateReferenceInput) {
    const reference = await this.prisma.reference.create({
      data: {
        userId,
        name: createDto.name,
        position: createDto.position,
        company: createDto.company,
        contact: createDto.contact,
        relationship: createDto.relationship,
      },
    });

    return reference;
  }

  async findAll(userId: number) {
    const references = await this.prisma.reference.findMany({
      where: { userId },
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      references,
      count: references.length,
    };
  }

  async findOne(userId: number, id: number) {
    const reference = await this.prisma.reference.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!reference) {
      throw new NotFoundException('Không tìm thấy người tham chiếu');
    }

    return reference;
  }

  async update(userId: number, id: number, updateDto: UpdateReferenceInput) {
    const reference = await this.prisma.reference.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!reference) {
      throw new NotFoundException('Không tìm thấy người tham chiếu');
    }

    const updated = await this.prisma.reference.update({
      where: { id, userId },
      data: {
        name: updateDto.name,
        position: updateDto.position,
        company: updateDto.company,
        contact: updateDto.contact,
        relationship: updateDto.relationship,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const reference = await this.prisma.reference.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!reference) {
      throw new NotFoundException('Không tìm thấy người tham chiếu');
    }

    await this.prisma.reference.delete({
      where: { id, userId },
    });

    return { message: 'Đã xóa người tham chiếu thành công' };
  }

  async getByCompany(userId: number, company: string) {
    const references = await this.prisma.reference.findMany({
      where: {
        userId,
        company: {
          contains: company,
          mode: 'insensitive',
        },
      },
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      references,
      count: references.length,
    };
  }
}
