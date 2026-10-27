import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  AIAssistantService,
  AssistantExperienceInput,
  AssistantProfileInput,
  AssistantProjectInput,
} from './ai-assistant.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-assistant')
@UseGuards(JwtAuthGuard)
export class AIAssistantController {
  constructor(private readonly aiAssistantService: AIAssistantService) {}

  @Post('generate-summary')
  generateSummary(@Body() body: { profile: AssistantProfileInput }) {
    return this.aiAssistantService.generateProfileSummary(body.profile);
  }

  @Post('generate-objective')
  generateObjective(@Body() body: { profile: AssistantProfileInput; targetRole?: string }) {
    return this.aiAssistantService.generateCareerObjective(body.profile, body.targetRole);
  }

  @Post('improve-project')
  improveProject(@Body() body: { project: AssistantProjectInput }) {
    return this.aiAssistantService.improveProjectDescription(body.project);
  }

  @Post('improve-experience')
  improveExperience(@Body() body: { experience: AssistantExperienceInput }) {
    return this.aiAssistantService.improveExperienceDescription(body.experience);
  }

  @Post('suggest-skills')
  suggestSkills(@Body() body: { profile: AssistantProfileInput; jobTitle?: string }) {
    return this.aiAssistantService.suggestSkills(body.profile, body.jobTitle);
  }

  @Post('correct-grammar')
  correctGrammar(@Body() body: { text: string }) {
    return this.aiAssistantService.correctGrammar(body.text);
  }

  @Post('writing-suggestions')
  writingSuggestions(@Body() body: { text: string; section: string }) {
    return this.aiAssistantService.suggestWritingImprovements(body.text, body.section);
  }

  @Post('translate')
  translate(@Body() body: { text: string; targetLanguage: string }) {
    return this.aiAssistantService.translateText(body.text, body.targetLanguage);
  }

  @Post('adjust-tone')
  adjustTone(@Body() body: { text: string; targetTone: 'formal' | 'casual' | 'professional' }) {
    return this.aiAssistantService.adjustTone(body.text, body.targetTone);
  }

  @Post('generate-bullets')
  generateBullets(@Body() body: { experience: AssistantExperienceInput }) {
    return this.aiAssistantService.generateBulletPoints(body.experience);
  }
}
