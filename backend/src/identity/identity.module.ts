import { Module } from '@nestjs/common';
import { IdentityDocumentController } from './identity-document.controller';
import { IdentityDocumentService } from './identity-document.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IdentityDocumentController],
  providers: [IdentityDocumentService],
  exports: [IdentityDocumentService],
})
export class IdentityModule {}
