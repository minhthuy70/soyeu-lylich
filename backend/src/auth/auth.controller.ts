import { Body, Controller, Post, Get, Query, BadRequestException, UseGuards, Request, UnauthorizedException, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SocialAuthService } from './social-auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { GitHubStrategy } from './strategies/github.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { LinkedInStrategy } from './strategies/linkedin.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialAuthService: SocialAuthService,
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token xác thực không hợp lệ');
    }
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  async logout(@Request() req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // In a real implementation, you might want to:
    // 1. Add the token to a blacklist (Redis)
    // 2. Clear the token from client storage
    // For now, we'll just return success
    return {
      message: 'Đăng xuất thành công',
    };
  }

  // Google OAuth
  @Get('google')
  @UseGuards(GoogleStrategy)
  async googleLogin() {
    // Guard handles the redirect
  }

  @Get('google/callback')
  @UseGuards(GoogleStrategy)
  async googleCallback(@Req() req, @Res() res: Response) {
    const result = req.user;
    return res.redirect(`http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`);
  }

  // GitHub OAuth
  @Get('github')
  @UseGuards(GitHubStrategy)
  async githubLogin() {
    // Guard handles the redirect
  }

  @Get('github/callback')
  @UseGuards(GitHubStrategy)
  async githubCallback(@Req() req, @Res() res: Response) {
    const result = req.user;
    return res.redirect(`http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`);
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(FacebookStrategy)
  async facebookLogin() {
    // Guard handles the redirect
  }

  @Get('facebook/callback')
  @UseGuards(FacebookStrategy)
  async facebookCallback(@Req() req, @Res() res: Response) {
    const result = req.user;
    return res.redirect(`http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`);
  }

  // LinkedIn OAuth
  @Get('linkedin')
  @UseGuards(LinkedInStrategy)
  async linkedinLogin() {
    // Guard handles the redirect
  }

  @Get('linkedin/callback')
  @UseGuards(LinkedInStrategy)
  async linkedinCallback(@Req() req, @Res() res: Response) {
    const result = req.user;
    return res.redirect(`http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`);
  }

  // Link/Unlink social accounts
  @Post('social/link')
  async linkSocialAccount(@Request() req, @Body() body: { provider: string; providerId: string; accessToken?: string; refreshToken?: string }) {
    const userId = this.extractUserIdFromRequest(req);
    return this.socialAuthService.linkSocialAccount(userId, body.provider, body.providerId, body.accessToken, body.refreshToken);
  }

  @Post('social/unlink')
  async unlinkSocialAccount(@Request() req, @Body() body: { provider: string }) {
    const userId = this.extractUserIdFromRequest(req);
    return this.socialAuthService.unlinkSocialAccount(userId, body.provider);
  }

  @Get('social/accounts')
  async getSocialAccounts(@Request() req) {
    const userId = this.extractUserIdFromRequest(req);
    return this.socialAuthService.getSocialAccounts(userId);
  }

  private extractUserIdFromRequest(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      // Simple JWT decoding (in production, use proper JWT verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}