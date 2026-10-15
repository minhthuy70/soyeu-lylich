import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        userId,
        title: createDto.title,
        description: createDto.description,
        role: createDto.role,
        startDate: createDto.startDate ? new Date(createDto.startDate) : null,
        endDate: createDto.endDate ? new Date(createDto.endDate) : null,
        technologies: createDto.technologies || [],
        images: createDto.images || [],
        githubUrl: createDto.githubUrl,
        demoUrl: createDto.demoUrl,
        status: createDto.status || 'Planning',
        order: createDto.order || 0,
        category: createDto.category,
        teamSize: createDto.teamSize,
        highlights: createDto.highlights || [],
        challenges: createDto.challenges,
        solutions: createDto.solutions,
        impact: createDto.impact,
        client: createDto.client,
      },
      include: {
        projectImages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return project;
  }

  async findAll(userId: number) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        projectImages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return {
      projects,
      count: projects.length,
    };
  }

  async findOne(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        projectImages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Không tìm thấy dự án');
    }

    return project;
  }

  async update(userId: number, id: number, updateDto: UpdateProjectDto) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Không tìm thấy dự án');
    }

    const updated = await this.prisma.project.update({
      where: { id },
      data: {
        title: updateDto.title,
        description: updateDto.description,
        role: updateDto.role,
        startDate: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        technologies: updateDto.technologies,
        images: updateDto.images,
        githubUrl: updateDto.githubUrl,
        demoUrl: updateDto.demoUrl,
        status: updateDto.status,
        order: updateDto.order,
        category: updateDto.category,
        teamSize: updateDto.teamSize,
        highlights: updateDto.highlights,
        challenges: updateDto.challenges,
        solutions: updateDto.solutions,
        impact: updateDto.impact,
        client: updateDto.client,
      },
      include: {
        projectImages: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Không tìm thấy dự án');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa dự án thành công',
    };
  }

  async reorder(userId: number, projectOrders: { id: number; order: number }[]) {
    // Verify all projects belong to the user
    const projectIds = projectOrders.map(p => p.id);
    const projects = await this.prisma.project.findMany({
      where: {
        id: { in: projectIds },
        userId,
      },
    });

    if (projects.length !== projectOrders.length) {
      throw new BadRequestException('Một số dự án không tồn tại hoặc không thuộc về bạn');
    }

    // Update order for each project
    const updatePromises = projectOrders.map(({ id, order }) =>
      this.prisma.project.update({
        where: { id },
        data: { order },
      }),
    );

    await Promise.all(updatePromises);

    return {
      message: 'Đã sắp xếp lại dự án thành công',
    };
  }
}
