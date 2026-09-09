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
    const { email, password, confirmPassword } = registerDto;

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      throw new BadRequestException(
        'Mật khẩu xác nhận không khớp',
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

    // Tạo user
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      message: 'Đăng ký tài khoản thành công',
      user,
    };
  }
}