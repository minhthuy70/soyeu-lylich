import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password, rememberMe } = loginDto;

    // Chuẩn hóa email
    const normalizedEmail = email.trim().toLowerCase();

    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra tài khoản bị khóa
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Tài khoản đã bị khóa. Vui lòng thử lại sau ${remainingTime} phút.`,
      );
    }

    // Kiểm tra email đã được xác thực
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Vui lòng xác thực email trước khi đăng nhập');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Tăng số lần đăng nhập thất bại
      const failedAttempts = user.failedLoginAttempts + 1;

      // Khóa tài khoản sau 5 lần thất bại
      if (failedAttempts >= 5) {
        await this.prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: failedAttempts,
            lockedUntil: new Date(Date.now() + 15 * 60 * 1000), // Khóa 15 phút
          },
        });

        throw new UnauthorizedException(
          'Tài khoản đã bị khóa do quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
        );
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: failedAttempts,
        },
      });

      if (failedAttempts >= 5) {
        throw new UnauthorizedException(
          'Tài khoản đã bị khóa do quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.',
        );
      }

      const remainingAttempts = 5 - failedAttempts;
      throw new UnauthorizedException(
        `Email hoặc mật khẩu không đúng. Còn ${remainingAttempts} lần thử.`,
      );
    }

    // Reset số lần đăng nhập thất bại khi đăng nhập thành công
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Tạo JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: tokenExpiry,
    });

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async validateUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
      },
    });
    return user;
  }

  async register(registerDto: RegisterDto) {
    const { email, password, confirmPassword, agreeTerms, agreePrivacy } = registerDto;

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu xác nhận không khớp',
      );
    }

    // Kiểm tra đồng ý điều khoản
    if (!agreeTerms) {
      throw new BadRequestException(
        'Vui lòng đồng ý với điều khoản sử dụng',
      );
    }

    // Kiểm tra đồng ý chính sách bảo mật
    if (!agreePrivacy) {
      throw new BadRequestException(
        'Vui lòng đồng ý với chính sách bảo mật',
      );
    }

    // Chuẩn hóa email
    const normalizedEmail = email.trim().toLowerCase();

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Email đã được sử dụng',
      );
    }

    // Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 10);

    // Tạo user với email verification token
    const verificationToken = this.generateVerificationToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        isEmailVerified: false,
        verificationToken,
        verificationTokenExpiry,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        isEmailVerified: true,
      },
    });

    // TODO: Send verification email here
    // await this.sendVerificationEmail(normalizedEmail, verificationToken);

    return {
      message: 'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
      user,
      requiresEmailVerification: true,
    };
  }

  private generateVerificationToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token xác thực không hợp lệ hoặc đã hết hạn');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return {
      message: 'Xác thực email thành công',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    // Chuẩn hóa email
    const normalizedEmail = email.trim().toLowerCase();

    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    // Không báo lỗi nếu email không tồn tại (security best practice)
    if (!user) {
      return {
        message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.',
      };
    }

    // Tạo reset token
    const resetToken = this.generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiry: resetTokenExpiry,
      },
    });

    // TODO: Send reset email here
    // await this.sendResetPasswordEmail(normalizedEmail, resetToken);

    return {
      message: 'Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, newPassword, confirmPassword } = resetPasswordDto;

    // Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    // Tìm user với reset token hợp lệ
    const user = await this.prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
    }

    // Hash mật khẩu mới
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu và xóa reset token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiry: null,
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });

    return {
      message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập với mật khẩu mới.',
    };
  }

  private generateResetToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}