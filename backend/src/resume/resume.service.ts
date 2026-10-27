import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  async createResume(
    userId: number,
    data: {
      title: string;
      template?: string;
      isDefault?: boolean;
    }
  ) {
    // If setting as default, unset other resumes
    if (data.isDefault) {
      await this.prisma.resume.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const resume = await this.prisma.resume.create({
      data: {
        userId,
        title: data.title,
        template: data.template,
        isDefault: data.isDefault || false,
      },
    });

    return resume;
  }

  async getResumes(userId: number) {
    return this.prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getResumeById(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      throw new BadRequestException('Resume not found');
    }

    return resume;
  }

  async updateResume(resumeId: number, userId: number, data: any) {
    // If setting as default, unset other resumes
    if (data.isDefault) {
      await this.prisma.resume.updateMany({
        where: { userId, id: { not: resumeId } },
        data: { isDefault: false },
      });
    }

    const resume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return resume;
  }

  async deleteResume(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new BadRequestException('Resume not found');
    }

    await this.prisma.resume.delete({
      where: { id: resumeId },
    });

    return { message: 'Resume deleted successfully' };
  }

  async duplicateResume(resumeId: number, userId: number) {
    const originalResume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!originalResume) {
      throw new BadRequestException('Resume not found');
    }

    const duplicatedResume = await this.prisma.resume.create({
      data: {
        userId,
        title: `${originalResume.title} (Copy)`,
        template: originalResume.template,
        isDefault: false,
      },
    });

    // Duplicate resume sections
    await Promise.all(
      originalResume.sections.map((section) =>
        this.prisma.resumeSection.create({
          data: {
            resumeId: duplicatedResume.id,
            sectionType: section.sectionType,
            customName: section.customName,
            description: section.description,
            isEnabled: section.isEnabled,
            order: section.order,
          },
        })
      )
    );

    return duplicatedResume;
  }

  async setDefaultResume(resumeId: number, userId: number) {
    // Unset all other resumes
    await this.prisma.resume.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set as default
    const resume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: { isDefault: true },
    });

    return resume;
  }

  async compareResumes(resumeId1: number, resumeId2: number, userId: number) {
    const [resume1, resume2] = await Promise.all([
      this.getResumeById(resumeId1, userId),
      this.getResumeById(resumeId2, userId),
    ]);

    const differences: Array<{ field: string; value1: any; value2: any }> = [];

    // Compare basic fields
    if (resume1.title !== resume2.title) {
      differences.push({ field: 'title', value1: resume1.title, value2: resume2.title });
    }

    // Get counts separately
    const [exp1, proj1, skill1, cert1, edu1] = await Promise.all([
      this.prisma.experience.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.skill.count({ where: { userId } }),
      this.prisma.certificate.count({ where: { userId } }),
      this.prisma.education.count({ where: { userId } }),
    ]);

    const [exp2, proj2, skill2, cert2, edu2] = await Promise.all([
      this.prisma.experience.count({ where: { userId } }),
      this.prisma.project.count({ where: { userId } }),
      this.prisma.skill.count({ where: { userId } }),
      this.prisma.certificate.count({ where: { userId } }),
      this.prisma.education.count({ where: { userId } }),
    ]);

    const counts1 = {
      experiences: exp1,
      projects: proj1,
      skills: skill1,
      certificates: cert1,
      educations: edu1,
    };

    const counts2 = {
      experiences: exp2,
      projects: proj2,
      skills: skill2,
      certificates: cert2,
      educations: edu2,
    };

    Object.keys(counts1).forEach((key) => {
      if (counts1[key] !== counts2[key]) {
        differences.push({
          field: key,
          value1: counts1[key],
          value2: counts2[key],
        });
      }
    });

    return {
      resume1: { id: resume1.id, title: resume1.title, counts: counts1 },
      resume2: { id: resume2.id, title: resume2.title, counts: counts2 },
      differences,
    };
  }

  async getResumeVersionHistory(resumeId: number, userId: number) {
    // Mock implementation - in production, use actual version tracking
    const resume = await this.getResumeById(resumeId, userId);

    return {
      currentVersion: {
        id: resume.id,
        title: resume.title,
        updatedAt: resume.updatedAt,
      },
      versions: [
        {
          id: resume.id,
          title: resume.title,
          updatedAt: resume.updatedAt,
          version: '1.0',
        },
      ],
    };
  }

  async updateSectionOrder(
    resumeId: number,
    userId: number,
    sectionOrders: { sectionId: number; order: number }[]
  ) {
    // Update order of resume sections
    await Promise.all(
      sectionOrders.map(({ sectionId, order }) =>
        this.prisma.resumeSection.update({
          where: { id: sectionId },
          data: { order },
        })
      )
    );

    return { message: 'Section order updated successfully' };
  }

  async toggleSection(resumeId: number, userId: number, sectionId: number, enabled: boolean) {
    await this.prisma.resumeSection.update({
      where: { id: sectionId },
      data: { isEnabled: enabled },
    });

    return { message: 'Section toggled successfully' };
  }
}
