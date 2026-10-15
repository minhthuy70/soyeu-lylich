import { Module } from '@nestjs/common';
import { ProjectImageController } from './project-image.controller';
import { ProjectImageService } from './project-image.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjectImageController],
  providers: [ProjectImageService],
  exports: [ProjectImageService],
})
export class ProjectImageModule {}
