import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { SocialAuthService } from '../social-auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly socialAuthService: SocialAuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID || 'your-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, name } = profile;
      const email = emails?.[0]?.value;

      const result = await this.socialAuthService.handleSocialLogin(
        'google',
        id,
        email,
        {
          accessToken,
          refreshToken,
          firstName: name?.givenName,
          lastName: name?.familyName,
        },
      );

      return done(null, result);
    } catch (error) {
      return done(error, false);
    }
  }
}
