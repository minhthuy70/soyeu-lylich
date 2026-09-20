import { Body, Controller, Post, Get, Query, BadRequestException, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}