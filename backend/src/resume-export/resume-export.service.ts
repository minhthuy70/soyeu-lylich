import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResumeExportService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Export DOCX (mock implementation - needs docx library in production)
  async exportToDocx(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // In production, use library like 'docx' to generate DOCX
    // This is a mock implementation
    console.log(`Generating DOCX for resume: ${resume.title}`);

    return {
      format: 'docx',
      filename: `${resume.title.replace(/\s+/g, '_')}.docx`,
      content: JSON.stringify(resume, null, 2),
      message: 'DOCX export generated (mock - requires docx library)',
    };
  }

  // 2. Export PDF (mock implementation - needs puppeteer/pdfkit in production)
  async exportToPdf(resumeId: number, userId: number, options?: {
    watermark?: string;
    pageSize?: 'A4' | 'Letter';
  }) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // In production, use library like 'puppeteer' or 'pdfkit' to generate PDF
    // This is a mock implementation
    console.log(`Generating PDF for resume: ${resume.title}`);
    if (options?.watermark) {
      console.log(`Adding watermark: ${options.watermark}`);
    }

    return {
      format: 'pdf',
      filename: `${resume.title.replace(/\s+/g, '_')}.pdf`,
      content: JSON.stringify(resume, null, 2),
      message: 'PDF export generated (mock - requires puppeteer/pdfkit library)',
      options,
    };
  }

  // 3. Export TXT
  async exportToTxt(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // Generate plain text format
    let txtContent = `${resume.title}\n`;
    txtContent += '='.repeat(resume.title.length) + '\n\n';

    if (resume.sections) {
      resume.sections.forEach((section) => {
        txtContent += `${section.title}\n`;
        txtContent += '-'.repeat(section.title.length) + '\n';
        txtContent += `${section.content}\n\n`;
      });
    }

    return {
      format: 'txt',
      filename: `${resume.title.replace(/\s+/g, '_')}.txt`,
      content: txtContent,
      message: 'TXT export generated',
    };
  }

  // Additional: Export JSON
  async exportToJson(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    return {
      format: 'json',
      filename: `${resume.title.replace(/\s+/g, '_')}.json`,
      content: JSON.stringify(resume, null, 2),
      message: 'JSON export generated',
    };
  }

  // Additional: Export HTML
  async exportToHtml(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // Generate HTML format
    let htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${resume.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .section { margin: 20px 0; }
    .section-title { color: #666; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
  </style>
</head>
<body>
  <h1>${resume.title}</h1>
`;

    if (resume.sections) {
      resume.sections.forEach((section) => {
        htmlContent += `  <div class="section">
    <h2 class="section-title">${section.title}</h2>
    <div>${section.content}</div>
  </div>
`;
      });
    }

    htmlContent += '</body>\n</html>';

    return {
      format: 'html',
      filename: `${resume.title.replace(/\s+/g, '_')}.html`,
      content: htmlContent,
      message: 'HTML export generated',
    };
  }

  // Additional: Batch export multiple resumes
  async exportMultipleResumes(resumeIds: number[], userId: number, format: 'pdf' | 'docx' | 'txt' | 'json' | 'html') {
    const exports = [];

    for (const resumeId of resumeIds) {
      try {
        let exportResult;
        switch (format) {
          case 'docx':
            exportResult = await this.exportToDocx(resumeId, userId);
            break;
          case 'pdf':
            exportResult = await this.exportToPdf(resumeId, userId);
            break;
          case 'txt':
            exportResult = await this.exportToTxt(resumeId, userId);
            break;
          case 'json':
            exportResult = await this.exportToJson(resumeId, userId);
            break;
          case 'html':
            exportResult = await this.exportToHtml(resumeId, userId);
            break;
        }
        exports.push(exportResult);
      } catch (error) {
        exports.push({
          resumeId,
          error: error.message,
        });
      }
    }

    return {
      format,
      exports,
      total: resumeIds.length,
      successful: exports.filter((e) => !e.error).length,
      failed: exports.filter((e) => e.error).length,
    };
  }

  // Generate public URL for resume
  async generatePublicUrl(resumeId: number, userId: number, customSlug?: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // Generate unique slug if not provided
    const slug = customSlug || `${resume.id}-${Buffer.from(resume.title).toString('base64').substring(0, 8)}`;

    // Update resume with public slug
    const updatedResume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        publicSlug: slug,
        isPublic: true,
      },
    });

    return {
      resumeId: updatedResume.id,
      publicUrl: `/public/${slug}`,
      slug,
      isPublic: true,
    };
  }

  // Disable public access
  async disablePublicAccess(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        isPublic: false,
        publicSlug: null,
      },
    });

    return {
      resumeId,
      isPublic: false,
      message: 'Public access disabled',
    };
  }

  // Get public resume by slug
  async getPublicResume(slug: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { publicSlug: slug, isPublic: true },
      include: {
        experiences: true,
        projects: true,
        skills: true,
        certificates: true,
        educations: true,
        achievements: true,
        publications: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!resume) {
      throw new Error('Public resume not found');
    }

    return resume;
  }

  // Track public resume view
  async trackPublicView(resumeId: number, metadata?: {
    ipAddress?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    await this.prisma.resumeView.create({
      data: {
        resumeId,
        ipAddress: metadata?.ipAddress || 'unknown',
        userAgent: metadata?.userAgent || 'unknown',
        referrer: metadata?.referrer || 'direct',
      },
    });

    return { message: 'View tracked' };
  }

  // Generate QR code data (requires qrcode library in production)
  async generateQrCode(resumeId: number, userId: number) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    if (!resume.isPublic || !resume.publicSlug) {
      throw new Error('Resume is not public');
    }

    const publicUrl = `${process.env.APP_URL || 'http://localhost:3000'}/public/${resume.publicSlug}`;

    // In production, use library like 'qrcode' to generate actual QR code
    // This is a mock implementation
    return {
      resumeId,
      publicUrl,
      qrCodeData: publicUrl, // In production, this would be base64 encoded QR image
      message: 'QR code data generated (mock - requires qrcode library)',
    };
  }

  // Share resume via email (requires email service)
  async shareViaEmail(resumeId: number, userId: number, recipients: string[], message?: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const publicUrl = resume.isPublic && resume.publicSlug
      ? `${process.env.APP_URL || 'http://localhost:3000'}/public/${resume.publicSlug}`
      : null;

    // In production, use email service to send emails
    // This is a mock implementation
    return {
      resumeId,
      recipients,
      message,
      publicUrl,
      sent: true,
      count: recipients.length,
      mock: true,
    };
  }

  // Get sharing analytics
  async getSharingAnalytics(resumeId: number, userId: number, period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const views = await this.prisma.resumeView.findMany({
      where: {
        resumeId,
        createdAt: { gte: startDate },
      },
    });

    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.ipAddress)).size;
    const referrers = views.reduce((acc, v) => {
      acc[v.referrer] = (acc[v.referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      resumeId,
      period,
      totalViews,
      uniqueVisitors,
      referrers,
      startDate,
      endDate: now,
    };
  }
}
