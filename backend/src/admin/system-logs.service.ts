import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSystemLogs(filters: {
    type?: string;
    level?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.level) {
      where.level = filters.level;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
    };
  }

  async getApiRequestLogs(filters: {
    method?: string;
    path?: string;
    statusCode?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};

    if (filters.method) {
      where.method = filters.method;
    }

    if (filters.path) {
      where.path = { contains: filters.path };
    }

    if (filters.statusCode) {
      where.statusCode = filters.statusCode;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where: { ...where, type: 'API_REQUEST' },
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      this.prisma.auditLog.count({ where: { ...where, type: 'API_REQUEST' } }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
    };
  }

  async getSecurityAuditLogs(filters: {
    type?: string;
    userId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {
      type: { in: ['LOGIN', 'LOGOUT', 'SECURITY_ALERT', 'PASSWORD_CHANGE', '2FA_ENABLED'] },
    };

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.userId) {
      where.userId = filters.userId;
    }

    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      total,
      limit: filters.limit || 50,
      offset: filters.offset || 0,
    };
  }

  async exportLogs(type: 'system' | 'api' | 'security', format: 'csv' | 'json' = 'json') {
    let logs;
    const filename = `${type}-logs-export-${Date.now()}`;

    if (type === 'system') {
      logs = await this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 1000,
      });
    } else if (type === 'api') {
      logs = await this.prisma.auditLog.findMany({
        where: { type: 'API_REQUEST' },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      });
    } else {
      logs = await this.prisma.auditLog.findMany({
        where: {
          type: { in: ['LOGIN', 'LOGOUT', 'SECURITY_ALERT', 'PASSWORD_CHANGE', '2FA_ENABLED'] },
        },
        orderBy: { createdAt: 'desc' },
        take: 1000,
      });
    }

    if (format === 'json') {
      return {
        data: logs,
        filename: `${filename}.json`,
        contentType: 'application/json',
      };
    }

    // CSV format
    const headers = ['ID', 'Type', 'Level', 'User ID', 'Action', 'Details', 'Created At'];
    const rows = logs.map((log) => [
      log.id,
      log.type,
      log.level,
      log.userId,
      log.action,
      JSON.stringify(log.details),
      log.createdAt.toISOString(),
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    return {
      data: csvContent,
      filename: `${filename}.csv`,
      contentType: 'text/csv',
    };
  }
}
