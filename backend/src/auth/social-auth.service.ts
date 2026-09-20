import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SocialAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async handleSocialLogin(provider: string, providerId: string, email?: string, profileData?: any) {
    // Check if social account exists
    let socialAccount = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: {
        user: true,
      },
    });

    if (socialAccount) {
      // User exists, login
      const user = socialAccount.user;

      // Update access token if provided
      if (profileData?.accessToken) {
        await this.prisma.socialAccount.update({
          where: { id: socialAccount.id },
          data: {
            accessToken: profileData.accessToken,
            refreshToken: profileData.refreshToken,
          },
        });
      }

      // Create JWT token
      const payload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
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

    // Check if user exists with this email
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (existingUser) {
        // Link social account to existing user
        await this.prisma.socialAccount.create({
          data: {
            userId: existingUser.id,
            provider,
            providerId,
            email,
            accessToken: profileData?.accessToken,
            refreshToken: profileData?.refreshToken,
          },
        });

        // Create JWT token
        const payload = { sub: existingUser.id, email: existingUser.email };
        const accessToken = await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        });

        return {
          message: 'Liên kết tài khoản xã hội thành công',
          accessToken,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            isEmailVerified: existingUser.isEmailVerified,
          },
        };
      }
    }

    // Create new user with social account
    const newUser = await this.prisma.user.create({
      data: {
        email: email || `${provider}_${providerId}@temp.com`,
        passwordHash: null, // No password for social login users
        isEmailVerified: true, // Email verified by social provider
      },
      select: {
        id: true,
        email: true,
        isEmailVerified: true,
        createdAt: true,
      },
    });

    // Create social account
    await this.prisma.socialAccount.create({
      data: {
        userId: newUser.id,
        provider,
        providerId,
        email,
        accessToken: profileData?.accessToken,
        refreshToken: profileData?.refreshToken,
      },
    });

    // Create JWT token
    const payload = { sub: newUser.id, email: newUser.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      message: 'Đăng ký và đăng nhập thành công',
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
      },
    };
  }

  async linkSocialAccount(userId: number, provider: string, providerId: string, accessToken?: string, refreshToken?: string) {
    // Check if social account already exists
    const existingSocialAccount = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
    });

    if (existingSocialAccount) {
      if (existingSocialAccount.userId === userId) {
        throw new ConflictException('Tài khoản xã hội này đã được liên kết');
      } else {
        throw new ConflictException('Tài khoản xã hội này đã được liên kết với người dùng khác');
      }
    }

    // Link social account
    await this.prisma.socialAccount.create({
      data: {
        userId,
        provider,
        providerId,
        accessToken,
        refreshToken,
      },
    });

    return {
      message: 'Liên kết tài khoản xã hội thành công',
    };
  }

  async unlinkSocialAccount(userId: number, provider: string) {
    const socialAccount = await this.prisma.socialAccount.findFirst({
      where: {
        userId,
        provider,
      },
    });

    if (!socialAccount) {
      throw new UnauthorizedException('Không tìm thấy tài khoản xã hội');
    }

    await this.prisma.socialAccount.delete({
      where: { id: socialAccount.id },
    });

    return {
      message: 'Hủy liên kết tài khoản xã hội thành công',
    };
  }

  async getSocialAccounts(userId: number) {
    const socialAccounts = await this.prisma.socialAccount.findMany({
      where: { userId },
      select: {
        id: true,
        provider: true,
        createdAt: true,
      },
    });

    return {
      socialAccounts,
    };
  }
}
