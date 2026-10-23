import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserManagementService {
  constructor(private readonly prisma: PrismaService) {}

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
    const logs = await this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return {
      logs,
      count: logs.length,
    };
  }
}
