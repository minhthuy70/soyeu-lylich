import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async generateTwoFactorSecret(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA đã được kích hoạt');
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `Sơ yếu lý lịch (${user.email})`,
      issuer: 'Sơ yếu lý lịch',
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // Store secret temporarily (not enabled yet)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
      },
    });

    return {
      secret: secret.base32,
      qrCode: qrCodeUrl,
      message: 'Vui lòng quét mã QR với Google Authenticator và nhập mã OTP để xác nhận',
    };
  }

  async enableTwoFactor(userId: number, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!user.twoFactorSecret) {
      throw new BadRequestException('Vui lòng tạo secret 2FA trước');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA đã được kích hoạt');
    }

    // Verify OTP
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: otp,
      window: 2, // Allow 2 time steps (1 minute)
    });

    if (!verified) {
      throw new BadRequestException('Mã OTP không đúng');
    }

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Enable 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: backupCodes,
      },
    });

    return {
      message: 'Kích hoạt 2FA thành công',
      backupCodes,
      warning: 'Vui lòng lưu trữ các mã dự phòng này. Bạn sẽ không thể xem lại sau khi đóng trang này.',
    };
  }

  async disableTwoFactor(userId: number, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA chưa được kích hoạt');
    }

    // Verify password
    if (!user.passwordHash) {
      throw new BadRequestException('Tài khoản này không có mật khẩu');
    }

    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }

    // Disable 2FA
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorBackupCodes: [],
      },
    });

    return {
      message: 'Tắt 2FA thành công',
    };
  }

  async verifyTwoFactorToken(userId: number, token: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!user.twoFactorEnabled) {
      throw new BadRequestException('2FA chưa được kích hoạt');
    }

    // Check if token is a backup code
    if (user.twoFactorBackupCodes && user.twoFactorBackupCodes.includes(token)) {
      // Remove used backup code
      const updatedBackupCodes = user.twoFactorBackupCodes.filter(
        (code) => code !== token,
      );

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: updatedBackupCodes,
        },
      });

      return {
        verified: true,
        type: 'backup',
        message: 'Xác thực bằng mã dự phòng thành công',
      };
    }

    // Verify TOTP token
    if (!user.twoFactorSecret) {
      throw new BadRequestException('Secret 2FA không tồn tại');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 2,
    });

    if (!verified) {
      throw new BadRequestException('Mã OTP không đúng');
    }

    return {
      verified: true,
      type: 'totp',
      message: 'Xác thực 2FA thành công',
    };
  }

  async generateEmailOTP(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in verificationToken field (temporary)
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: otp,
        verificationTokenExpiry: otpExpiry,
      },
    });

    // In production, send email here
    console.log(`Email OTP for ${user.email}: ${otp}`);

    return {
      message: 'Mã OTP đã được gửi đến email của bạn',
      expiry: otpExpiry,
    };
  }

  async verifyEmailOTP(userId: number, otp: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    if (!user.verificationToken || !user.verificationTokenExpiry) {
      throw new BadRequestException('OTP không tồn tại hoặc đã hết hạn');
    }

    if (new Date() > user.verificationTokenExpiry) {
      throw new BadRequestException('OTP đã hết hạn');
    }

    if (user.verificationToken !== otp) {
      throw new BadRequestException('Mã OTP không đúng');
    }

    // Clear OTP
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    return {
      verified: true,
      message: 'Xác thực OTP qua email thành công',
    };
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.floor(10000000 + Math.random() * 90000000).toString();
      codes.push(code);
    }
    return codes;
  }

  async getTwoFactorStatus(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorEnabled: true,
        twoFactorSecret: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    return {
      twoFactorEnabled: user.twoFactorEnabled,
      hasSecret: !!user.twoFactorSecret,
    };
  }
}
