import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(
    userId: number,
    token: string,
    deviceInfo?: string,
    ipAddress?: string,
    userAgent?: string,
    expiresIn: number = 7 * 24 * 60 * 60 * 1000, // 7 days default
  ) {
    const expiresAt = new Date(Date.now() + expiresIn);

    const session = await this.prisma.session.create({
      data: {
        userId,
        token,
        deviceInfo,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    return session;
  }

  async getActiveSessions(userId: number) {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastActivity: 'desc',
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        userAgent: true,
        lastActivity: true,
        expiresAt: true,
        createdAt: true,
      },
    });

    return {
      sessions,
      count: sessions.length,
    };
  }

  async revokeSession(userId: number, sessionId: number) {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
    });

    if (!session) {
      throw new BadRequestException('Session không tồn tại');
    }

    if (session.isRevoked) {
      throw new BadRequestException('Session đã bị thu hồi');
    }

    await this.prisma.session.update({
      where: { id: sessionId },
      data: {
        isRevoked: true,
      },
    });

    return {
      message: 'Đã thu hồi session thành công',
    };
  }

  async revokeAllSessions(userId: number, exceptCurrentToken?: string) {
    const whereClause: any = {
      userId,
      isRevoked: false,
    };

    if (exceptCurrentToken) {
      whereClause.token = {
        not: exceptCurrentToken,
      };
    }

    const result = await this.prisma.session.updateMany({
      where: whereClause,
      data: {
        isRevoked: true,
      },
    });

    return {
      message: 'Đã thu hồi tất cả session thành công',
      revokedCount: result.count,
    };
  }

  async validateSession(token: string) {
    const session = await this.prisma.session.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Session không tồn tại');
    }

    if (session.isRevoked) {
      throw new UnauthorizedException('Session đã bị thu hồi');
    }

    if (new Date() > session.expiresAt) {
      // Auto-revoke expired sessions
      await this.prisma.session.update({
        where: { id: session.id },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Session đã hết hạn');
    }

    // Update last activity
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        lastActivity: new Date(),
      },
    });

    return session;
  }

  async deleteSession(token: string) {
    await this.prisma.session.delete({
      where: { token },
    });
  }

  async cleanupExpiredSessions() {
    const result = await this.prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return {
      deletedCount: result.count,
    };
  }

  async getSessionDetails(userId: number, sessionId: number) {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
      },
      select: {
        id: true,
        deviceInfo: true,
        ipAddress: true,
        userAgent: true,
        lastActivity: true,
        expiresAt: true,
        createdAt: true,
        isRevoked: true,
      },
    });

    if (!session) {
      throw new BadRequestException('Session không tồn tại');
    }

    return session;
  }
}
