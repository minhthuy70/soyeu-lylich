import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { SocialAuthService } from '../social-auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly socialAuthService: SocialAuthService) {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID || 'your-facebook-client-id',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'your-facebook-client-secret',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
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
        'facebook',
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
