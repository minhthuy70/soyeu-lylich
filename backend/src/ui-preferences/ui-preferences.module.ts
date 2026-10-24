import { Module } from '@nestjs/common';
import { UIPreferencesService } from './ui-preferences.service';
import { UIPreferencesController } from './ui-preferences.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UIPreferencesController],
  providers: [UIPreferencesService],
  exports: [UIPreferencesService],
})
export class UIPreferencesModule {}
