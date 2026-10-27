import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ResumeAnalysisResult {
  completeness: {
    score: number;
    sections: {
      name: string;
      present: boolean;
      weight: number;
    }[];
  };
  quality: {
    score: number;
    factors: {
      name: string;
      score: number;
      suggestions: string[];
    }[];
  };
  missingSections: string[];
  keywordSuggestions: {
    section: string;
    keywords: string[];
  }[];
  jobOrientedSuggestions?: {
    jobTitle: string;
    suggestions: string[];
  };
}

interface ResumeAnalysisInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  summary?: string | null;
  experiences: Array<{ jobDescription: string | null }>;
  educations: unknown[];
  skills: Array<{ name: string }>;
  projects: unknown[];
  achievements: unknown[];
}

@Injectable()
export class ResumeAnalysisService {
  constructor(private readonly prisma: PrismaService) {}

  async analyzeResume(resumeId: number, jobTitle?: string): Promise<ResumeAnalysisResult> {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
      include: {
        sections: true,
        user: {
          include: {
            profile: true,
            achievements: true,
            educations: true,
            experiences: true,
            projects: true,
            skills: true,
          },
        },
      },
    });

    if (!resume) {
      throw new Error('Resume not found');
    }

    const user = resume.user;
    const profile = user?.profile;
    const resumeData: ResumeAnalysisInput = {
      ...resume,
      name: profile?.fullName,
      email: profile?.email || user?.email,
      phone: profile?.phoneNumber,
      summary: profile?.introduction || profile?.careerObjective,
      experiences: user?.experiences || [],
      educations: user?.educations || [],
      skills: user?.skills || [],
      projects: user?.projects || [],
      achievements: user?.achievements || [],
    };

    const completeness = this.analyzeCompleteness(resumeData);
    const quality = this.analyzeQuality(resumeData);
    const missingSections = this.getMissingSections(resumeData);
    const keywordSuggestions = this.getKeywordSuggestions(resumeData);
    const jobOrientedSuggestions = jobTitle
      ? this.getJobOrientedSuggestions(resumeData, jobTitle)
      : undefined;

    return {
      completeness,
      quality,
      missingSections,
      keywordSuggestions,
      jobOrientedSuggestions,
    };
  }

  private analyzeCompleteness(resume: ResumeAnalysisInput) {
    const sections = [
      { name: 'Personal Information', present: !!resume.name, weight: 20 },
      { name: 'Contact Information', present: !!resume.email, weight: 15 },
      { name: 'Professional Summary', present: !!resume.summary, weight: 15 },
      { name: 'Experience', present: resume.experiences.length > 0, weight: 20 },
      { name: 'Education', present: resume.educations.length > 0, weight: 15 },
      { name: 'Skills', present: resume.skills.length > 0, weight: 10 },
      { name: 'Projects', present: resume.projects.length > 0, weight: 5 },
    ];

    const totalWeight = sections.reduce((sum, s) => sum + s.weight, 0);
    const scoredWeight = sections.reduce((sum, s) => sum + (s.present ? s.weight : 0), 0);
    const score = Math.round((scoredWeight / totalWeight) * 100);

    return { score, sections };
  }

  private analyzeQuality(resume: ResumeAnalysisInput) {
    const factors: { name: string; score: number; suggestions: string[] }[] = [];

    // Check professional summary length
    if (resume.summary) {
      const summaryLength = resume.summary.length;
      let summaryScore = 0;
      const suggestions: string[] = [];

      if (summaryLength >= 50 && summaryLength <= 300) {
        summaryScore = 100;
      } else if (summaryLength < 50) {
        summaryScore = 50;
        suggestions.push('Summary is too short. Add more details about your experience and goals.');
      } else {
        summaryScore = 70;
        suggestions.push('Summary is quite long. Consider making it more concise.');
      }

      factors.push({
        name: 'Professional Summary',
        score: summaryScore,
        suggestions,
      });
    } else {
      factors.push({
        name: 'Professional Summary',
        score: 0,
        suggestions: ['Add a professional summary to introduce yourself.'],
      });
    }

    // Check experience descriptions
    if (resume.experiences.length > 0) {
      const hasDetailedDescriptions = resume.experiences.some(
        (experience) => experience.jobDescription && experience.jobDescription.length > 50
      );
      factors.push({
        name: 'Experience Descriptions',
        score: hasDetailedDescriptions ? 100 : 50,
        suggestions: hasDetailedDescriptions
          ? []
          : ['Add detailed descriptions to your work experiences.'],
      });
    }

    // Check skills variety
    if (resume.skills.length > 0) {
      const skillScore = Math.min(resume.skills.length * 10, 100);
      factors.push({
        name: 'Skills Quantity',
        score: skillScore,
        suggestions: skillScore < 50 ? ['Add more relevant skills.'] : [],
      });
    }

    // Check achievements
    if (resume.achievements.length > 0) {
      factors.push({
        name: 'Achievements',
        score: 100,
        suggestions: [],
      });
    } else {
      factors.push({
        name: 'Achievements',
        score: 50,
        suggestions: ['Add achievements to showcase your accomplishments.'],
      });
    }

    const overallScore = Math.round(factors.reduce((sum, f) => sum + f.score, 0) / factors.length);

    return { score: overallScore, factors };
  }

  private getMissingSections(resume: ResumeAnalysisInput): string[] {
    const missing: string[] = [];

    if (!resume.name) missing.push('Name');
    if (!resume.email) missing.push('Email');
    if (!resume.phone) missing.push('Phone');
    if (!resume.summary) missing.push('Professional Summary');
    if (resume.experiences.length === 0) missing.push('Work Experience');
    if (resume.educations.length === 0) missing.push('Education');
    if (resume.skills.length === 0) missing.push('Skills');

    return missing;
  }

  private getKeywordSuggestions(resume: ResumeAnalysisInput) {
    const suggestions: { section: string; keywords: string[] }[] = [];

    // Experience keywords
    if (resume.experiences.length > 0) {
      const techKeywords = [
        'JavaScript',
        'TypeScript',
        'React',
        'Node.js',
        'Python',
        'Java',
        'AWS',
        'Docker',
        'Kubernetes',
        'Agile',
        'Scrum',
        'Leadership',
        'Communication',
        'Problem-solving',
      ];

      const existingKeywords = resume.skills.map((skill) => skill.name.toLowerCase());
      const missingKeywords = techKeywords.filter(
        (k) => !existingKeywords.includes(k.toLowerCase())
      );

      suggestions.push({
        section: 'Skills',
        keywords: missingKeywords.slice(0, 5),
      });
    }

    // Action verbs for experience
    suggestions.push({
      section: 'Experience',
      keywords: [
        'Led',
        'Developed',
        'Implemented',
        'Managed',
        'Designed',
        'Created',
        'Optimized',
        'Achieved',
        'Improved',
        'Collaborated',
      ],
    });

    return suggestions;
  }

  private getJobOrientedSuggestions(resume: ResumeAnalysisInput, jobTitle: string) {
    const suggestions: string[] = [];

    const jobKeywords: Record<string, string[]> = {
      'Software Engineer': [
        'Emphasize your technical skills',
        'Highlight programming languages you know',
        'Showcase your projects with GitHub links',
        'Mention your problem-solving abilities',
      ],
      'Product Manager': [
        'Highlight your product management experience',
        'Showcase your analytical skills',
        'Mention cross-functional collaboration',
        'Include metrics and results',
      ],
      'Data Scientist': [
        'Emphasize your statistical knowledge',
        'Highlight machine learning experience',
        'Showcase your data visualization skills',
        'Mention programming languages (Python, R)',
      ],
      Designer: [
        'Showcase your portfolio',
        'Highlight design tools you use',
        'Mention your design process',
        'Include examples of your work',
      ],
    };

    const lowerJobTitle = jobTitle.toLowerCase();
    for (const [job, tips] of Object.entries(jobKeywords)) {
      if (lowerJobTitle.includes(job.toLowerCase())) {
        suggestions.push(...tips);
        break;
      }
    }

    if (suggestions.length === 0) {
      suggestions.push(
        'Tailor your resume to the specific job requirements',
        'Highlight relevant experience',
        'Use keywords from the job description'
      );
    }

    return { jobTitle, suggestions };
  }
}
