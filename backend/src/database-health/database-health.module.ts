import { Module } from '@nestjs/common';
import { DatabaseHealthService } from './database-health.service';
import { DatabaseHealthController } from './database-health.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DatabaseHealthController],
  providers: [DatabaseHealthService],
  exports: [DatabaseHealthService],
})
export class DatabaseHealthModule {}
