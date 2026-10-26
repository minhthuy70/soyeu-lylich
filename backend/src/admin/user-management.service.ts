import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserManagementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      users,
      count: users.length,
    };
  }

  async editUser(userId: number, updateData: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async exportUserList(format: 'csv' | 'json' = 'csv') {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'json') {
      return {
        data: users,
        filename: `users-export-${Date.now()}.json`,
        contentType: 'application/json',
      };
    }

    // CSV format
    const headers = ['ID', 'Email', 'Name', 'Role', 'Active', 'Created At', 'Updated At'];
    const rows = users.map((user) => [
      user.id,
      user.email,
      user.name,
      user.role,
      user.isActive ? 'Yes' : 'No',
      user.createdAt.toISOString(),
      user.updatedAt.toISOString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    return {
      data: csvContent,
      filename: `users-export-${Date.now()}.csv`,
      contentType: 'text/csv',
    };
  }

  async bulkUserActions(action: 'disable' | 'enable' | 'delete', userIds: number[]) {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const userId of userIds) {
      try {
        if (action === 'delete') {
          await this.prisma.user.delete({
            where: { id: userId },
          });
        } else {
          await this.prisma.user.update({
            where: { id: userId },
            data: { isActive: action === 'enable' },
          });
        }
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`User ${userId}: ${error.message}`);
      }
    }

    return results;
  }

  async getUserActivityLog(userId: number, limit = 50) {
    // Return placeholder data since auditLog model doesn't exist
    return {
      logs: [],
      count: 0,
    };
  }

  async impersonateUser(userId: number, adminId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.isActive) {
      throw new BadRequestException('Cannot impersonate inactive user');
    }

    // Note: auditLog model doesn't exist, skipping audit logging

    return {
      user,
      impersonationToken: Buffer.from(JSON.stringify({ adminId, targetUserId: userId })).toString(
        'base64'
      ),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    };
  }

  async endImpersonation(adminId: number) {
    // Note: auditLog model doesn't exist, skipping audit logging
    return {
      success: true,
      message: 'Impersonation ended',
    };
  }
}
