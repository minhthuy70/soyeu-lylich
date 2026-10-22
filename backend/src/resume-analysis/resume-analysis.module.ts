import { Module } from '@nestjs/common';
import { ResumeAnalysisService } from './resume-analysis.service';
import { ResumeAnalysisController } from './resume-analysis.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ResumeAnalysisController],
  providers: [ResumeAnalysisService],
  exports: [ResumeAnalysisService],
})
export class ResumeAnalysisModule {}
