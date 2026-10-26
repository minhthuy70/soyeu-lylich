import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectImageDto,
  UpdateProjectImageDto,
  ReorderImagesDto,
} from './dto/create-project-image.dto';

@Injectable()
export class ProjectImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateProjectImageDto) {
    // Verify project belongs to user
    const project = await this.prisma.project.findFirst({
      where: {
        id: createDto.projectId,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Không tìm thấy dự án');
    }

    // If this is set as thumbnail, remove thumbnail flag from other images
    if (createDto.isThumbnail) {
      await this.prisma.projectImage.updateMany({
        where: {
          projectId: createDto.projectId,
          isThumbnail: true,
        },
        data: {
          isThumbnail: false,
        },
      });
    }

    const image = await this.prisma.projectImage.create({
      data: {
        projectId: createDto.projectId,
        imageUrl: createDto.imageUrl,
        caption: createDto.caption,
        order: createDto.order || 0,
        isThumbnail: createDto.isThumbnail || false,
      },
    });

    return image;
  }

  async findAll(userId: number, projectId?: number) {
    const where: any = {};

    if (projectId) {
      where.projectId = projectId;
      // Verify project belongs to user
      const project = await this.prisma.project.findFirst({
        where: {
          id: projectId,
          userId,
        },
      });

      if (!project) {
        throw new NotFoundException('Không tìm thấy dự án');
      }
    } else {
      // Get all images from user's projects
      const userProjects = await this.prisma.project.findMany({
        where: { userId },
        select: { id: true },
      });
      where.projectId = { in: userProjects.map((p) => p.id) };
    }

    const images = await this.prisma.projectImage.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      images,
      count: images.length,
    };
  }

  async findOne(userId: number, id: number) {
    const image = await this.prisma.projectImage.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Không tìm thấy ảnh dự án');
    }

    return image;
  }

  async update(userId: number, id: number, updateDto: UpdateProjectImageDto) {
    const image = await this.prisma.projectImage.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Không tìm thấy ảnh dự án');
    }

    // If setting as thumbnail, remove thumbnail flag from other images in the same project
    if (updateDto.isThumbnail === true) {
      await this.prisma.projectImage.updateMany({
        where: {
          projectId: image.projectId,
          isThumbnail: true,
          id: { not: id },
        },
        data: {
          isThumbnail: false,
        },
      });
    }

    const updated = await this.prisma.projectImage.update({
      where: { id },
      data: {
        imageUrl: updateDto.imageUrl,
        caption: updateDto.caption,
        order: updateDto.order,
        isThumbnail: updateDto.isThumbnail,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const image = await this.prisma.projectImage.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Không tìm thấy ảnh dự án');
    }

    await this.prisma.projectImage.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa ảnh dự án thành công',
    };
  }

  async reorder(userId: number, projectId: number, reorderDto: ReorderImagesDto) {
    // Verify project belongs to user
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Không tìm thấy dự án');
    }

    // Verify all images belong to the project
    const images = await this.prisma.projectImage.findMany({
      where: {
        id: { in: reorderDto.imageIds },
        projectId,
      },
    });

    if (images.length !== reorderDto.imageIds.length) {
      throw new BadRequestException('Một số ảnh không tồn tại hoặc không thuộc về dự án này');
    }

    // Update order for each image
    const updatePromises = reorderDto.imageIds.map((imageId, index) =>
      this.prisma.projectImage.update({
        where: { id: imageId },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    return {
      message: 'Đã sắp xếp lại ảnh thành công',
    };
  }

  async setThumbnail(userId: number, id: number) {
    const image = await this.prisma.projectImage.findFirst({
      where: {
        id,
        project: {
          userId,
        },
      },
    });

    if (!image) {
      throw new NotFoundException('Không tìm thấy ảnh dự án');
    }

    // Remove thumbnail flag from all images in the project
    await this.prisma.projectImage.updateMany({
      where: {
        projectId: image.projectId,
        isThumbnail: true,
      },
      data: {
        isThumbnail: false,
      },
    });

    // Set this image as thumbnail
    const updated = await this.prisma.projectImage.update({
      where: { id },
      data: {
        isThumbnail: true,
      },
    });

    return updated;
  }
}
