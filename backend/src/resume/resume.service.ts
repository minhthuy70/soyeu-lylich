import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeService {
  constructor(private readonly prisma: PrismaService) {}

  async createResume(
    userId: number,
    data: {
      title: string;
      templateId?: number;
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
        templateId: data.templateId,
        isDefault: data.isDefault || false,
      },
    });

    return resume;
  }

  async getResumes(userId: number) {
    return this.prisma.resume.findMany({
      where: { userId },
      include: {
        experiences: true,
        projects: true,
        skills: true,
        certificates: true,
        educations: true,
        achievements: true,
        publications: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getResumeById(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        experiences: true,
        projects: true,
        skills: true,
        certificates: true,
        educations: true,
        achievements: true,
        publications: true,
        resumeSections: true,
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
        experiences: true,
        projects: true,
        skills: true,
        certificates: true,
        educations: true,
        achievements: true,
        publications: true,
        resumeSections: true,
      },
    });

    if (!originalResume) {
      throw new BadRequestException('Resume not found');
    }

    const duplicatedResume = await this.prisma.resume.create({
      data: {
        userId,
        title: `${originalResume.title} (Copy)`,
        templateId: originalResume.templateId,
        isDefault: false,
      },
    });

    // Duplicate related entities
    await Promise.all([
      ...originalResume.experiences.map((exp) =>
        this.prisma.experience.create({
          data: {
            ...exp,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.projects.map((proj) =>
        this.prisma.project.create({
          data: {
            ...proj,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.skills.map((skill) =>
        this.prisma.skill.create({
          data: {
            ...skill,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.certificates.map((cert) =>
        this.prisma.certificate.create({
          data: {
            ...cert,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.educations.map((edu) =>
        this.prisma.education.create({
          data: {
            ...edu,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.achievements.map((ach) =>
        this.prisma.achievement.create({
          data: {
            ...ach,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.publications.map((pub) =>
        this.prisma.publication.create({
          data: {
            ...pub,
            id: undefined,
            resumeId: duplicatedResume.id,
            userId,
          },
        })
      ),
      ...originalResume.resumeSections.map((section) =>
        this.prisma.resumeSection.create({
          data: {
            ...section,
            id: undefined,
            resumeId: duplicatedResume.id,
          },
        })
      ),
    ]);

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

    const differences = [];

    // Compare basic fields
    if (resume1.title !== resume2.title) {
      differences.push({ field: 'title', value1: resume1.title, value2: resume2.title });
    }

    // Compare counts
    const counts1 = {
      experiences: resume1.experiences.length,
      projects: resume1.projects.length,
      skills: resume1.skills.length,
      certificates: resume1.certificates.length,
      educations: resume1.educations.length,
    };

    const counts2 = {
      experiences: resume2.experiences.length,
      projects: resume2.projects.length,
      skills: resume2.skills.length,
      certificates: resume2.certificates.length,
      educations: resume2.educations.length,
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
      data: { enabled },
    });

    return { message: 'Section toggled successfully' };
  }
}
