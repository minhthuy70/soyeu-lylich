import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-linkedin-oauth2';
import { SocialAuthService } from '../social-auth.service';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly socialAuthService: SocialAuthService) {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'your-linkedin-client-secret',
      callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3000/auth/linkedin/callback',
      scope: ['r_emailaddress', 'r_liteprofile'],
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
        'linkedin',
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
