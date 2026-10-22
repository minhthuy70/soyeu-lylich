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
}
