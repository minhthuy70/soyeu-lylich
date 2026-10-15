import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { IdentityModule } from './identity/identity.module';
import { ProjectModule } from './project/project.module';
import { ProjectImageModule } from './project-image/project-image.module';
import { AchievementModule } from './achievement/achievement.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    IdentityModule,
    ProjectModule,
    ProjectImageModule,
    AchievementModule,
  ],
})
export class AppModule {}