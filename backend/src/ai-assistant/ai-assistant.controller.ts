import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AIAssistantService } from './ai-assistant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-assistant')
@UseGuards(JwtAuthGuard)
export class AIAssistantController {
  constructor(private readonly aiAssistantService: AIAssistantService) {}

  @Post('generate-summary')
  async generateSummary(@Body() body: { profile: any }) {
    return this.aiAssistantService.generateProfileSummary(body.profile);
  }

  @Post('generate-objective')
  async generateObjective(@Body() body: { profile: any; targetRole?: string }) {
    return this.aiAssistantService.generateCareerObjective(body.profile, body.targetRole);
  }

  @Post('improve-project')
  async improveProject(@Body() body: { project: any }) {
    return this.aiAssistantService.improveProjectDescription(body.project);
  }

  @Post('improve-experience')
  async improveExperience(@Body() body: { experience: any }) {
    return this.aiAssistantService.improveExperienceDescription(body.experience);
  }

  @Post('suggest-skills')
  async suggestSkills(@Body() body: { profile: any; jobTitle?: string }) {
    return this.aiAssistantService.suggestSkills(body.profile, body.jobTitle);
  }

  @Post('correct-grammar')
  async correctGrammar(@Body() body: { text: string }) {
    return this.aiAssistantService.correctGrammar(body.text);
  }

  @Post('writing-suggestions')
  async writingSuggestions(@Body() body: { text: string; section: string }) {
    return this.aiAssistantService.suggestWritingImprovements(body.text, body.section);
  }

  @Post('translate')
  async translate(@Body() body: { text: string; targetLanguage: string }) {
    return this.aiAssistantService.translateText(body.text, body.targetLanguage);
  }

  @Post('adjust-tone')
  async adjustTone(@Body() body: { text: string; targetTone: 'formal' | 'casual' | 'professional' }) {
    return this.aiAssistantService.adjustTone(body.text, body.targetTone);
  }

  @Post('generate-bullets')
  async generateBullets(@Body() body: { experience: any }) {
    return this.aiAssistantService.generateBulletPoints(body.experience);
  }
}
