import { Module } from '@nestjs/common';
import { VolunteerExperienceService } from './volunteer-experience.service';
import { VolunteerExperienceController } from './volunteer-experience.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VolunteerExperienceController],
  providers: [VolunteerExperienceService],
  exports: [VolunteerExperienceService],
})
export class VolunteerExperienceModule {}
