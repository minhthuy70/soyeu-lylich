import { Module } from '@nestjs/common';
import { LanguageSkillController } from './language-skill.controller';
import { LanguageSkillService } from './language-skill.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LanguageSkillController],
  providers: [LanguageSkillService],
  exports: [LanguageSkillService],
})
export class LanguageSkillModule {}
