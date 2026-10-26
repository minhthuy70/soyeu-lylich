import { Module } from '@nestjs/common';
import { ToolSkillController } from './tool-skill.controller';
import { ToolSkillService } from './tool-skill.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ToolSkillController],
  providers: [ToolSkillService],
  exports: [ToolSkillService],
})
export class ToolSkillModule {}
