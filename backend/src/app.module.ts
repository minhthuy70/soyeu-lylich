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
import { SkillModule } from './skill/skill.module';
import { SoftSkillModule } from './soft-skill/soft-skill.module';
import { LanguageSkillModule } from './language-skill/language-skill.module';
import { ToolSkillModule } from './tool-skill/tool-skill.module';
import { ProjectModule } from './project/project.module';
import { ProjectImageModule } from './project-image/project-image.module';
import { ProjectAnalyticsModule } from './project-analytics/project-analytics.module';
import { AchievementModule } from './achievement/achievement.module';
import { ActivityModule } from './activity/activity.module';
import { PublicationModule } from './publication/publication.module';
import { PatentModule } from './patent/patent.module';
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
    SkillModule,
    SoftSkillModule,
    LanguageSkillModule,
    ToolSkillModule,
    ProjectModule,
    ProjectImageModule,
    ProjectAnalyticsModule,
    AchievementModule,
    ActivityModule,
    PublicationModule,
    PatentModule,
  ],
})
export class AppModule {}