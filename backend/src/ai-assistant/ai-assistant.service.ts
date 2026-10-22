import { Injectable } from '@nestjs/common';

@Injectable()
export class AIAssistantService {
  // 1. AI Profile Summary Generation
  async generateProfileSummary(profile: any): Promise<string> {
    const { name, title, skills, experiences } = profile;
    const skillNames = skills.map((s: any) => s.name).join(', ');
    const expCount = experiences.length;

    return `A passionate and results-driven ${title || 'professional'} with ${expCount} years of experience in ${skillNames || 'various technologies'}. Proven track record of delivering high-quality solutions and driving project success. Strong analytical and problem-solving skills with excellent communication abilities. Committed to continuous learning and professional growth while contributing to team success.`;
  }

  // 2. AI Career Objective Generation
  async generateCareerObjective(profile: any, targetRole?: string): Promise<string> {
    const { title, skills } = profile;
    const role = targetRole || title || 'Senior Software Engineer';

    return `To leverage my expertise in ${skills.map((s: any) => s.name).slice(0, 3).join(', ')} as a ${role} in a dynamic organization where I can contribute to innovative projects, mentor team members, and drive technical excellence while continuing to grow professionally and make meaningful contributions to the company's success.`;
  }

  // 3. AI Project Description Improvement
  async improveProjectDescription(project: any): Promise<string> {
    const { title, description, technologies } = project;
    const techList = technologies.join(', ');

    if (!description || description.length < 50) {
      return `Led the development of ${title}, a comprehensive solution utilizing ${techList}. Collaborated with cross-functional teams to deliver high-quality features on time and within budget. Implemented best practices in software architecture and ensured scalability and maintainability of the codebase. Achieved significant improvements in system performance and user satisfaction.`;
    }

    return description;
  }

  // 4. AI Experience Description Improvement
  async improveExperienceDescription(experience: any): Promise<string> {
    const { title, company, description, achievements } = experience;

    if (!description || description.length < 50) {
      return `Served as ${title} at ${company}, where I led key initiatives and drove significant improvements in team productivity and project delivery. Mentored junior developers, implemented best practices, and contributed to the development of innovative solutions. Successfully delivered multiple high-impact projects that improved business outcomes and enhanced customer satisfaction.`;
    }

    return description;
  }

  // 5. AI Skill Suggestions
  async suggestSkills(profile: any, jobTitle?: string): Promise<string[]> {
    const jobSpecificSkills: Record<string, string[]> = {
      'Software Engineer': [
        'TypeScript',
        'GraphQL',
        'Redis',
        'Microservices',
        'CI/CD',
        'System Design',
      ],
      'Product Manager': [
        'Agile/Scrum',
        'User Research',
        'Data Analysis',
        'Roadmapping',
        'Stakeholder Management',
        'A/B Testing',
      ],
      'Data Scientist': [
        'Machine Learning',
        'Deep Learning',
        'TensorFlow',
        'PyTorch',
        'Data Visualization',
        'Statistical Analysis',
      ],
    };

    const targetJob = jobTitle || profile.title || 'Software Engineer';
    const suggestions = jobSpecificSkills[targetJob] || jobSpecificSkills['Software Engineer'];

    return suggestions;
  }

  // 6. AI Grammar Correction
  async correctGrammar(text: string): Promise<{ corrected: string; corrections: string[] }> {
    // Mock implementation - in production, use Grammarly API or similar
    const corrections: string[] = [];
    let corrected = text;

    // Simple corrections (mock)
    if (text.includes('dont')) {
      corrected = corrected.replace(/dont/g, "don't");
      corrections.push("Fixed: 'dont' → \"don't\"");
    }
    if (text.includes('cant')) {
      corrected = corrected.replace(/cant/g, "can't");
      corrections.push("Fixed: 'cant' → \"can't\"");
    }

    return { corrected, corrections };
  }

  // 7. AI Writing Suggestions
  async suggestWritingImprovements(text: string, section: string): Promise<string[]> {
    const suggestions: string[] = [];

    if (section === 'summary') {
      if (text.length < 50) {
        suggestions.push('Consider adding more details about your experience and goals.');
      }
      if (text.length > 300) {
        suggestions.push('Your summary is quite long. Consider making it more concise.');
      }
      if (!text.toLowerCase().includes('experience')) {
        suggestions.push('Mention your years of experience.');
      }
    }

    if (section === 'experience') {
      if (!text.toLowerCase().includes('achieved') && !text.toLowerCase().includes('improved')) {
        suggestions.push('Add quantifiable achievements or improvements.');
      }
      if (!/\d+/.test(text)) {
        suggestions.push('Include specific numbers or metrics to demonstrate impact.');
      }
    }

    return suggestions;
  }

  // 8. AI Translation
  async translateText(text: string, targetLanguage: string): Promise<string> {
    // Mock implementation - in production, use Google Translate API or similar
    const translations: Record<string, string> = {
      spanish: 'Esta es una traducción simulada. En producción, utilice una API de traducción real.',
      french: 'Ceci est une traduction simulée. En production, utilisez une API de traduction réelle.',
      german: 'Dies ist eine simulierte Übersetzung. In der Produktion verwenden Sie eine echte Übersetzungs-API.',
      japanese: 'これはです。ではのAPIをしてください。',
    };

    return translations[targetLanguage.toLowerCase()] || text;
  }

  // 9. AI Tone Adjustment
  async adjustTone(text: string, targetTone: 'formal' | 'casual' | 'professional'): Promise<string> {
    if (targetTone === 'formal') {
      return text
        .replace(/I'm/g, 'I am')
        .replace(/don't/g, 'do not')
        .replace(/can't/g, 'cannot')
        .replace(/good/g, 'excellent')
        .replace(/nice/g, 'beneficial');
    }

    if (targetTone === 'casual') {
      return text
        .replace(/I am/g, "I'm")
        .replace(/do not/g, "don't")
        .replace(/cannot/g, "can't")
        .replace(/excellent/g, 'great')
        .replace(/beneficial/g, 'good');
    }

    return text;
  }

  // 10. AI Bullet Point Generation
  async generateBulletPoints(experience: any): Promise<string[]> {
    const { title, company, description } = experience;

    return [
      `Led key initiatives as ${title} at ${company}, driving significant improvements in team productivity`,
      `Collaborated with cross-functional teams to deliver high-quality solutions on time and within budget`,
      `Implemented best practices in software architecture and ensured scalability of the codebase`,
      `Mentored junior developers and contributed to knowledge sharing within the team`,
      `Successfully delivered multiple high-impact projects that improved business outcomes`,
    ];
  }
}
