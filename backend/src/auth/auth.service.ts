import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
}