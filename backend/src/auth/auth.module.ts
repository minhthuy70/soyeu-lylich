import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SocialAuthService } from './social-auth.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { SessionService } from './session.service';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { LinkedInStrategy } from './strategies/linkedin.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    SocialAuthService,
    TwoFactorAuthService,
    SessionService,
    JwtStrategy,
    GoogleStrategy,
    GitHubStrategy,
    FacebookStrategy,
    LinkedInStrategy,
  ],
  exports: [AuthService, SocialAuthService, TwoFactorAuthService, SessionService],
})
export class AuthModule {}