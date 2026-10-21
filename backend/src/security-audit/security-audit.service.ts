import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AuditLogData {
  userId?: number;
  action: string;
  resource?: string;
  ipAddress: string;
  userAgent?: string;
  metadata?: any;
  severity?: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  status?: 'SUCCESS' | 'FAILURE';
}

@Injectable()
export class SecurityAuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: AuditLogData) {
    return this.prisma.securityAuditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        metadata: data.metadata,
        severity: data.severity || 'INFO',
        status: data.status || 'SUCCESS',
      },
    });
  }

  async getLogsByUser(userId: number, limit = 100) {
    return this.prisma.securityAuditLog.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getLogsByAction(action: string, limit = 100) {
    return this.prisma.securityAuditLog.findMany({
      where: { action },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getLogsBySeverity(severity: string, limit = 100) {
    return this.prisma.securityAuditLog.findMany({
      where: { severity },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getRecentLogs(limit = 50) {
    return this.prisma.securityAuditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getLogsByDateRange(startDate: Date, endDate: Date) {
    return this.prisma.securityAuditLog.findMany({
      where: {
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getFailedLogins(limit = 50) {
    return this.prisma.securityAuditLog.findMany({
      where: {
        action: 'LOGIN',
        status: 'FAILURE',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getCriticalEvents(limit = 50) {
    return this.prisma.securityAuditLog.findMany({
      where: {
        severity: 'CRITICAL',
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }
}
