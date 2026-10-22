import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { IdentityModule } from './identity/identity.module';
import { ProjectModule } from './project/project.module';
import { ProjectImageModule } from './project-image/project-image.module';
import { AchievementModule } from './achievement/achievement.module';
import { PrismaModule } from './prisma/prisma.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { WebVitalsModule } from './web-vitals/web-vitals.module';
import { SecurityAuditModule } from './security-audit/security-audit.module';
import { ErrorTrackingModule } from './error-tracking/error-tracking.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ResumeAnalysisModule } from './resume-analysis/resume-analysis.module';
import { AIAssistantModule } from './ai-assistant/ai-assistant.module';
import { PushNotificationsModule } from './push-notifications/push-notifications.module';
import { EmailNotificationsModule } from './email-notifications/email-notifications.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CompressionMiddleware } from './middleware/compression.middleware';
import { CacheControlMiddleware } from './middleware/cache-control.middleware';
import { CorsMiddleware } from './middleware/cors.middleware';
import { CsrfMiddleware } from './middleware/csrf.middleware';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { RequestLoggingMiddleware } from './middleware/request-logging.middleware';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    IdentityModule,
    ProjectModule,
    ProjectImageModule,
    AchievementModule,
    IntegrationsModule,
    AnalyticsModule,
    WebVitalsModule,
    SecurityAuditModule,
    ErrorTrackingModule,
    WebhooksModule,
    ResumeAnalysisModule,
    AIAssistantModule,
    PushNotificationsModule,
    EmailNotificationsModule,
    NotificationsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes('*');

    consumer
      .apply(RateLimitMiddleware)
      .forRoutes('*');

    consumer
      .apply(CorsMiddleware)
      .forRoutes('*');

    consumer
      .apply(CsrfMiddleware)
      .exclude('auth/login', 'auth/register')
      .forRoutes('*');

    consumer
      .apply(CompressionMiddleware)
      .forRoutes('*');

    consumer
      .apply(CacheControlMiddleware)
      .forRoutes('*');
  }
}