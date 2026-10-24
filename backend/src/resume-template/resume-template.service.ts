import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: any) {
    const template = await this.prisma.resumeTemplate.create({
      data: {
        userId,
        name: createDto.name,
        description: createDto.description,
        category: createDto.category || 'professional',
        template: createDto.template,
        thumbnail: createDto.thumbnail,
        isPublic: createDto.isPublic || false,
        isDefault: createDto.isDefault || false,
      },
    });

    return template;
  }

  async findAll(userId: number, category?: string) {
    const where: any = { userId };

    if (category) {
      where.category = category;
    }

    const templates = await this.prisma.resumeTemplate.findMany({
      where,
      orderBy: [{ createdAt: 'desc' }],
    });

    return {
      templates,
      count: templates.length,
    };
  }

  async findPublicTemplates(category?: string) {
    const where: any = { isPublic: true };

    if (category) {
      where.category = category;
    }

    const templates = await this.prisma.resumeTemplate.findMany({
      where,
      orderBy: [{ usageCount: 'desc' }, { createdAt: 'desc' }],
    });

    return {
      templates,
      count: templates.length,
    };
  }

  async findOne(userId: number, id: number) {
    const template = await this.prisma.resumeTemplate.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { isPublic: true },
        ],
      },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu sơ yếu lý lịch');
    }

    return template;
  }

  async update(userId: number, id: number, updateDto: any) {
    const template = await this.prisma.resumeTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu sơ yếu lý lịch');
    }

    const updated = await this.prisma.resumeTemplate.update({
      where: { id },
      data: {
        name: updateDto.name,
        description: updateDto.description,
        category: updateDto.category,
        template: updateDto.template,
        thumbnail: updateDto.thumbnail,
        isPublic: updateDto.isPublic,
        isDefault: updateDto.isDefault,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const template = await this.prisma.resumeTemplate.findFirst({
      where: { id, userId },
    });

    if (!template) {
      throw new NotFoundException('Không tìm thấy mẫu sơ yếu lý lịch');
    }

    await this.prisma.resumeTemplate.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa mẫu sơ yếu lý lịch thành công',
    };
  }

  async incrementUsage(id: number) {
    await this.prisma.resumeTemplate.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  async setAsDefault(userId: number, id: number) {
    // Remove default from all user's templates
    await this.prisma.resumeTemplate.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set this template as default
    const template = await this.prisma.resumeTemplate.update({
      where: { id, userId },
      data: { isDefault: true },
    });

    return template;
  }

  async duplicate(userId: number, id: number) {
    const original = await this.prisma.resumeTemplate.findFirst({
      where: { id },
    });

    if (!original) {
      throw new NotFoundException('Không tìm thấy mẫu sơ yếu lý lịch');
    }

    const duplicated = await this.prisma.resumeTemplate.create({
      data: {
        userId,
        name: `${original.name} (Copy)`,
        description: original.description,
        category: original.category,
        template: original.template,
        thumbnail: original.thumbnail,
        isPublic: false,
        isDefault: false,
      },
    });

    return duplicated;
  }
}
