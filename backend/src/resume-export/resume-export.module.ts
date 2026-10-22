import { Module } from '@nestjs/common';
import { ResumeExportService } from './resume-export.service';
import { ResumeExportController } from './resume-export.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResumeExportController],
  providers: [ResumeExportService],
  exports: [ResumeExportService],
})
export class ResumeExportModule {}
