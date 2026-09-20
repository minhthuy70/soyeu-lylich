import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
      },
      profile: user.profile,
    };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    // Check if profile exists, if not create it
    const existingProfile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      const updatedProfile = await this.prisma.profile.update({
        where: { userId },
        data: updateProfileDto,
      });

      return {
        message: 'Cập nhật thông tin thành công',
        profile: updatedProfile,
      };
    } else {
      const newProfile = await this.prisma.profile.create({
        data: {
          userId,
          ...updateProfileDto,
        },
      });

      return {
        message: 'Tạo thông tin thành công',
        profile: newProfile,
      };
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Kiểm tra mật khẩu xác nhận
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp');
    }

    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    // Hash mật khẩu mới
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    return {
      message: 'Đổi mật khẩu thành công',
    };
  }

  async deleteAccount(userId: number, password: string) {
    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu không đúng');
    }

    // Xóa user (cascade delete sẽ xóa profile)
    await this.prisma.user.delete({
      where: { id: userId },
    });

    return {
      message: 'Xóa tài khoản thành công',
    };
  }
}
