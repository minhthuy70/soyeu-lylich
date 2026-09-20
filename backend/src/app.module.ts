import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { IdentityModule } from './identity/identity.module';
import { ReferenceModule } from './reference/reference.module';
import { EducationModule } from './education/education.module';
import { CertificateModule } from './certificate/certificate.module';
import { OnlineCourseModule } from './online-course/online-course.module';
import { ExperienceModule } from './experience/experience.module';
import { FreelanceModule } from './freelance/freelance.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    IdentityModule,
    ReferenceModule,
    EducationModule,
    CertificateModule,
    OnlineCourseModule,
    ExperienceModule,
    FreelanceModule,
  ],
})
export class AppModule {}