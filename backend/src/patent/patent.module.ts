import { Module } from '@nestjs/common';
import { PatentController } from './patent.controller';
import { PatentService } from './patent.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PatentController],
  providers: [PatentService],
  exports: [PatentService],
})
export class PatentModule {}
