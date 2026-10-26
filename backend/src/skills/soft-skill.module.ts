import { Module } from '@nestjs/common';
import { SoftSkillController } from './soft-skill.controller';
import { SoftSkillService } from './soft-skill.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SoftSkillController],
  providers: [SoftSkillService],
  exports: [SoftSkillService],
})
export class SoftSkillModule {}
