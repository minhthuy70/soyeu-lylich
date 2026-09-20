import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';
import { SocialAuthService } from '../social-auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly socialAuthService: SocialAuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'your-github-client-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your-github-client-secret',
      callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, emails, username } = profile;
      const email = emails?.[0]?.value;

      const result = await this.socialAuthService.handleSocialLogin(
        'github',
        id.toString(),
        email,
        {
          accessToken,
          refreshToken,
          username,
        },
      );

      return done(null, result);
    } catch (error) {
      return done(error, false);
    }
  }
}
