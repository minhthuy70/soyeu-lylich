import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  BadRequestException,
  UseGuards,
  Request,
  Req,
  Res,
  Param,
} from '@nestjs/common';
import type { Request as ExpressRequest, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedRequest } from './authenticated-request.type';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  EnableTwoFactorDto,
  VerifyTwoFactorDto,
  VerifyEmailTwoFactorDto,
} from './dto/two-factor.dto';
import { SocialAuthService } from './social-auth.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { SessionService } from './session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly socialAuthService: SocialAuthService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
    private readonly sessionService: SessionService
  ) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('login/2fa')
  loginWithTwoFactor(@Body() body: { tempToken: string; otp: string; rememberMe?: boolean }) {
    return this.authService.completeTwoFactorLogin(body.tempToken, body.otp, body.rememberMe);
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
  @UseGuards(JwtAuthGuard)
  logout(@Request() req: AuthenticatedRequest) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Token không hợp lệ');
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
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Guard handles the redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: SocialOAuthRequest, @Res() res: Response) {
    const result = req.user;
    return res.redirect(
      `http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`
    );
  }

  // GitHub OAuth
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {
    // Guard handles the redirect
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  githubCallback(@Req() req: SocialOAuthRequest, @Res() res: Response) {
    const result = req.user;
    return res.redirect(
      `http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`
    );
  }

  // Facebook OAuth
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  facebookLogin() {
    // Guard handles the redirect
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookCallback(@Req() req: SocialOAuthRequest, @Res() res: Response) {
    const result = req.user;
    return res.redirect(
      `http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`
    );
  }

  // LinkedIn OAuth
  @Get('linkedin')
  @UseGuards(AuthGuard('linkedin'))
  linkedinLogin() {
    // Guard handles the redirect
  }

  @Get('linkedin/callback')
  @UseGuards(AuthGuard('linkedin'))
  linkedinCallback(@Req() req: SocialOAuthRequest, @Res() res: Response) {
    const result = req.user;
    return res.redirect(
      `http://localhost:5177?token=${result.accessToken}&userId=${result.user.id}`
    );
  }

  // Link/Unlink social accounts
  @Post('social/link')
  @UseGuards(JwtAuthGuard)
  async linkSocialAccount(
    @Request() req: AuthenticatedRequest,
    @Body()
    body: { provider: string; providerId: string; accessToken?: string; refreshToken?: string }
  ) {
    return this.socialAuthService.linkSocialAccount(
      req.user.id,
      body.provider,
      body.providerId,
      body.accessToken,
      body.refreshToken
    );
  }

  @Post('social/unlink')
  @UseGuards(JwtAuthGuard)
  async unlinkSocialAccount(
    @Request() req: AuthenticatedRequest,
    @Body() body: { provider: string }
  ) {
    return this.socialAuthService.unlinkSocialAccount(req.user.id, body.provider);
  }

  @Get('social/accounts')
  @UseGuards(JwtAuthGuard)
  async getSocialAccounts(@Request() req: AuthenticatedRequest) {
    return this.socialAuthService.getSocialAccounts(req.user.id);
  }

  // Two-Factor Authentication endpoints
  @Post('2fa/generate-secret')
  @UseGuards(JwtAuthGuard)
  async generateTwoFactorSecret(@Request() req: AuthenticatedRequest) {
    return this.twoFactorAuthService.generateTwoFactorSecret(req.user.id);
  }

  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enableTwoFactor(
    @Request() req: AuthenticatedRequest,
    @Body() enableTwoFactorDto: EnableTwoFactorDto
  ) {
    return this.twoFactorAuthService.enableTwoFactor(req.user.id, enableTwoFactorDto.otp);
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disableTwoFactor(@Request() req: AuthenticatedRequest, @Body() body: { password: string }) {
    return this.twoFactorAuthService.disableTwoFactor(req.user.id, body.password);
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  async verifyTwoFactor(
    @Request() req: AuthenticatedRequest,
    @Body() verifyTwoFactorDto: VerifyTwoFactorDto
  ) {
    return this.twoFactorAuthService.verifyTwoFactorToken(req.user.id, verifyTwoFactorDto.otp);
  }

  @Post('2fa/email/generate')
  @UseGuards(JwtAuthGuard)
  async generateEmailOTP(@Request() req: AuthenticatedRequest) {
    return this.twoFactorAuthService.generateEmailOTP(req.user.id);
  }

  @Post('2fa/email/verify')
  @UseGuards(JwtAuthGuard)
  async verifyEmailOTP(
    @Request() req: AuthenticatedRequest,
    @Body() verifyEmailTwoFactorDto: VerifyEmailTwoFactorDto
  ) {
    return this.twoFactorAuthService.verifyEmailOTP(req.user.id, verifyEmailTwoFactorDto.otp);
  }

  @Get('2fa/status')
  @UseGuards(JwtAuthGuard)
  async getTwoFactorStatus(@Request() req: AuthenticatedRequest) {
    return this.twoFactorAuthService.getTwoFactorStatus(req.user.id);
  }

  // Session Management endpoints
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getActiveSessions(@Request() req: AuthenticatedRequest) {
    return this.sessionService.getActiveSessions(req.user.id);
  }

  @Post('sessions/:id/revoke')
  @UseGuards(JwtAuthGuard)
  async revokeSession(@Request() req: AuthenticatedRequest, @Param('id') sessionId: string) {
    return this.sessionService.revokeSession(req.user.id, parseInt(sessionId));
  }

  @Post('sessions/revoke-all')
  @UseGuards(JwtAuthGuard)
  async revokeAllSessions(
    @Request() req: AuthenticatedRequest,
    @Body() body: { exceptCurrent?: boolean }
  ) {
    const exceptCurrentToken = body.exceptCurrent ? this.extractTokenFromRequest(req) : undefined;
    return this.sessionService.revokeAllSessions(req.user.id, exceptCurrentToken);
  }

  @Get('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async getSessionDetails(@Request() req: AuthenticatedRequest, @Param('id') sessionId: string) {
    return this.sessionService.getSessionDetails(req.user.id, parseInt(sessionId));
  }

  private extractTokenFromRequest(req: AuthenticatedRequest): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new BadRequestException('Token không hợp lệ');
    }
    return authHeader.replace('Bearer ', '');
  }
}

type SocialOAuthRequest = ExpressRequest & {
  user: {
    accessToken: string;
    user: { id: number };
  };
};
