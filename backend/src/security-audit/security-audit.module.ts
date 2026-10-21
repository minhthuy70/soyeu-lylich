import { Module } from '@nestjs/common';
import { SecurityAuditController } from './security-audit.controller';
import { SecurityAuditService } from './security-audit.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SecurityAuditController],
  providers: [SecurityAuditService],
  exports: [SecurityAuditService],
})
export class SecurityAuditModule {}
