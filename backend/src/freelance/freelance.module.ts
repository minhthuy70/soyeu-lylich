import { Module } from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { FreelanceController } from './freelance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FreelanceController],
  providers: [FreelanceService],
  exports: [FreelanceService],
})
export class FreelanceModule {}
