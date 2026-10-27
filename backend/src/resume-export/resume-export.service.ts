import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import PDFDocument from 'pdfkit';

type ResumeExportResult = {
  format: 'docx' | 'pdf' | 'txt' | 'json' | 'html';
  filename: string;
  content: string;
  message: string;
  options?: {
    watermark?: string;
    pageSize?: 'A4' | 'Letter';
  };
};

type ResumeExportFailure = {
  resumeId: number;
  error: string;
};

interface ResumeImportSection {
  sectionType: string;
  customName?: string | null;
  description?: string | null;
  isEnabled?: boolean;
  order?: number;
}

interface ResumeImportData {
  title: string;
  template?: string | null;
  colorScheme?: string | null;
  font?: string | null;
  sections?: ResumeImportSection[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isResumeImportSection(value: unknown): value is ResumeImportSection {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.sectionType === 'string' &&
    (value.customName === undefined ||
      value.customName === null ||
      typeof value.customName === 'string') &&
    (value.description === undefined ||
      value.description === null ||
      typeof value.description === 'string') &&
    (value.isEnabled === undefined || typeof value.isEnabled === 'boolean') &&
    (value.order === undefined || typeof value.order === 'number')
  );
}

function parseResumeImportData(value: unknown): ResumeImportData {
  if (!isRecord(value)) {
    throw new Error('Resume import data must be an object');
  }

  if (typeof value.title !== 'string' || !value.title.trim()) {
    throw new Error('Resume title is required');
  }

  const sections = value.sections;
  if (
    sections !== undefined &&
    (!Array.isArray(sections) || !sections.every(isResumeImportSection))
  ) {
    throw new Error('Resume sections must be an array of sections');
  }

  for (const key of ['template', 'colorScheme', 'font'] as const) {
    const field = value[key];
    if (field !== undefined && field !== null && typeof field !== 'string') {
      throw new Error(`Resume import field "${key}" must be a string`);
    }
  }

  return {
    title: value.title,
    ...(typeof value.template === 'string' || value.template === null
      ? { template: value.template }
      : {}),
    ...(typeof value.colorScheme === 'string' || value.colorScheme === null
      ? { colorScheme: value.colorScheme }
      : {}),
    ...(typeof value.font === 'string' || value.font === null ? { font: value.font } : {}),
    ...(sections === undefined ? {} : { sections }),
  };
}

@Injectable()
export class ResumeExportService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Export DOCX (using docx library)
  async exportToDocx(resumeId: number, userId: number): Promise<ResumeExportResult> {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // Create DOCX document
    const children: Paragraph[] = [];

    // Add title
    children.push(
      new Paragraph({
        text: resume.title,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Add profile information if available
    if (resume.user?.profile) {
      const profile = resume.user.profile;
      if (profile.fullName) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Name: ${profile.fullName}`,
                bold: true,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
      if (profile.email) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${profile.email}`,
              }),
            ],
            spacing: { after: 200 },
          })
        );
      }
      if (profile.phoneNumber) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Phone: ${profile.phoneNumber}`,
              }),
            ],
            spacing: { after: 400 },
          })
        );
      }
    }

    // Add sections
    if (resume.sections && resume.sections.length > 0) {
      resume.sections.forEach((section) => {
        if (section.isEnabled) {
          children.push(
            new Paragraph({
              text: section.customName || section.sectionType,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 400, after: 200 },
            })
          );

          if (section.description) {
            children.push(
              new Paragraph({
                text: section.description,
                spacing: { after: 300 },
              })
            );
          }
        }
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    return {
      format: 'docx',
      filename: `${resume.title.replace(/\s+/g, '_')}.docx`,
      content: buffer.toString('base64'),
      message: 'DOCX export generated successfully',
    };
  }

  // 2. Export PDF (using pdfkit library)
  async exportToPdf(
    resumeId: number,
    userId: number,
    options?: {
      watermark?: string;
      pageSize?: 'A4' | 'Letter';
    }
  ): Promise<ResumeExportResult> {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
      include: {
        sections: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    return new Promise<ResumeExportResult>((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: options?.pageSize === 'Letter' ? 'LETTER' : 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve({
            format: 'pdf',
            filename: `${resume.title.replace(/\s+/g, '_')}.pdf`,
            content: buffer.toString('base64'),
            message: 'PDF export generated successfully',
            options,
          });
        });
        doc.on('error', reject);

        // Add title
        doc.fontSize(24).font('Helvetica-Bold').text(resume.title, { align: 'center' });
        doc.moveDown();

        // Add profile information if available
        if (resume.user?.profile) {
          const profile = resume.user.profile;
          doc.fontSize(12).font('Helvetica');
          if (profile.fullName) {
            doc.text(`Name: ${profile.fullName}`);
          }
          if (profile.email) {
            doc.text(`Email: ${profile.email}`);
          }
          if (profile.phoneNumber) {
            doc.text(`Phone: ${profile.phoneNumber}`);
          }
          doc.moveDown();
        }

        // Add sections
        if (resume.sections && resume.sections.length > 0) {
          resume.sections.forEach((section) => {
            if (section.isEnabled) {
              doc
                .fontSize(16)
                .font('Helvetica-Bold')
                .text(section.customName || section.sectionType);
              doc.moveDown();
              doc.fontSize(12).font('Helvetica');
              if (section.description) {
                doc.text(section.description);
              }
              doc.moveDown();
            }
          });
        }

        // Add watermark if provided
        if (options?.watermark) {
          doc.save();
          doc
            .rotate(45, { origin: [300, 450] })
            .fontSize(40)
            .fillColor('gray', 0.3)
            .text(options.watermark, 50, 400, { align: 'center' });
          doc.restore();
        }

        doc.end();
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  // 3. Export TXT
  async exportToTxt(resumeId: number, userId: number): Promise<ResumeExportResult> {
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
        const title = section.customName || section.sectionType;
        txtContent += `${title}\n`;
        txtContent += '-'.repeat(title.length) + '\n';
        if (section.description) {
          txtContent += `${section.description}\n\n`;
        }
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
  async exportToJson(resumeId: number, userId: number): Promise<ResumeExportResult> {
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
  async exportToHtml(resumeId: number, userId: number): Promise<ResumeExportResult> {
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
        const title = section.customName || section.sectionType;
        const content = section.description || '';
        htmlContent += `  <div class="section">
    <h2 class="section-title">${title}</h2>
    <div>${content}</div>
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
  async exportMultipleResumes(
    resumeIds: number[],
    userId: number,
    format: 'pdf' | 'docx' | 'txt' | 'json' | 'html'
  ) {
    const exports: (ResumeExportResult | ResumeExportFailure)[] = [];

    for (const resumeId of resumeIds) {
      try {
        let exportResult: ResumeExportResult;
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
          error: error instanceof Error ? error.message : 'Resume export failed',
        });
      }
    }

    return {
      format,
      exports,
      total: resumeIds.length,
      successful: exports.filter((entry) => !('error' in entry)).length,
      failed: exports.filter((entry) => 'error' in entry).length,
    };
  }

  // Generate public URL for resume
  async generatePublicUrl(
    resumeId: number,
    userId: number,
    options?: {
      customSlug?: string;
      password?: string;
      expiryDate?: Date;
    }
  ) {
    const resume = await this.prisma.resume.findFirst({
      where: { id: resumeId, userId },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    // Generate unique slug if not provided
    const slug =
      options?.customSlug ||
      `${resume.id}-${Buffer.from(resume.title).toString('base64').substring(0, 8)}`;

    // Hash password if provided
    let hashedPassword: string | null = null;
    if (options?.password) {
      hashedPassword = await bcrypt.hash(options.password, 10);
    }

    // Update resume with public slug
    const updatedResume = await this.prisma.resume.update({
      where: { id: resumeId },
      data: {
        publicSlug: slug,
        isPublic: true,
        publicPassword: hashedPassword,
        publicExpiryDate: options?.expiryDate,
      },
    });

    return {
      resumeId: updatedResume.id,
      publicUrl: `/public/${slug}`,
      slug,
      isPublic: true,
      hasPassword: !!hashedPassword,
      expiryDate: updatedResume.publicExpiryDate,
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
  async getPublicResume(slug: string, password?: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { publicSlug: slug, isPublic: true },
      include: {
        sections: true,
        user: {
          select: {
            id: true,
            email: true,
            profile: true,
            experiences: true,
            projects: true,
            skills: true,
            certificates: true,
            educations: true,
            achievements: true,
            publications: true,
          },
        },
      },
    });

    if (!resume) {
      throw new Error('Public resume not found');
    }

    // Check expiry date
    if (resume.publicExpiryDate && new Date() > resume.publicExpiryDate) {
      throw new Error('Public resume has expired');
    }

    // Check password if set
    if (resume.publicPassword) {
      if (!password) {
        return {
          requiresPassword: true,
          resumeId: resume.id,
        };
      }

      const isPasswordValid = await bcrypt.compare(password, resume.publicPassword);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
    }

    return resume;
  }

  // Track public resume view
  async trackPublicView(
    resumeId: number,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
      referrer?: string;
    }
  ) {
    await this.prisma.resumeView.create({
      data: {
        resumeId,
        viewerIp: metadata?.ipAddress || 'unknown',
        referralSource: metadata?.referrer || 'direct',
      },
    });

    return { message: 'View tracked' };
  }

  // Generate QR code data (using qrcode library)
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

    // Use qrcode library to generate actual QR code
    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });

    return {
      resumeId,
      publicUrl,
      qrCodeDataUrl,
      message: 'QR code generated successfully',
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

    const publicUrl =
      resume.isPublic && resume.publicSlug
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
  async getSharingAnalytics(
    resumeId: number,
    userId: number,
    period: 'week' | 'month' | 'year' = 'month'
  ) {
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
        viewedAt: { gte: startDate },
      },
    });

    const totalViews = views.length;
    const uniqueVisitors = new Set(views.map((v) => v.viewerIp).filter(Boolean)).size;
    const referrers = views.reduce(
      (acc, v) => {
        const ref = v.referralSource || 'direct';
        acc[ref] = (acc[ref] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

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

  // Import resume from JSON
  async importFromJson(userId: number, jsonData: unknown) {
    try {
      const importedResume = parseResumeImportData(jsonData);

      // Create resume
      const resume = await this.prisma.resume.create({
        data: {
          userId,
          title: importedResume.title,
          template: importedResume.template || 'Modern',
          colorScheme: importedResume.colorScheme,
          font: importedResume.font,
        },
      });

      // Import sections if provided
      if (importedResume.sections) {
        for (const section of importedResume.sections) {
          await this.prisma.resumeSection.create({
            data: {
              resumeId: resume.id,
              sectionType: section.sectionType,
              customName: section.customName,
              description: section.description,
              isEnabled: section.isEnabled !== undefined ? section.isEnabled : true,
              order: section.order || 0,
            },
          });
        }
      }

      return {
        resumeId: resume.id,
        message: 'Resume imported successfully',
        resume,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown import error';
      throw new Error(`Failed to import resume: ${message}`);
    }
  }
}
