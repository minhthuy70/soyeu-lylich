import { Module } from '@nestjs/common';
import { ResumeTemplateService } from './resume-template.service';
import { ResumeTemplateController } from './resume-template.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResumeTemplateController],
  providers: [ResumeTemplateService],
  exports: [ResumeTemplateService],
})
export class ResumeTemplateModule {}
