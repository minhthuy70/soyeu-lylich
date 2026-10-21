import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SecurityAuditService } from './security-audit.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('security-audit')
@UseGuards(JwtAuthGuard)
export class SecurityAuditController {
  constructor(private readonly securityAuditService: SecurityAuditService) {}

  @Get('user/:userId')
  getLogsByUser(@Query('userId') userId: string, @Query('limit') limit = '100') {
    return this.securityAuditService.getLogsByUser(parseInt(userId), parseInt(limit));
  }

  @Get('action/:action')
  getLogsByAction(@Query('action') action: string, @Query('limit') limit = '100') {
    return this.securityAuditService.getLogsByAction(action, parseInt(limit));
  }

  @Get('severity/:severity')
  getLogsBySeverity(@Query('severity') severity: string, @Query('limit') limit = '100') {
    return this.securityAuditService.getLogsBySeverity(severity, parseInt(limit));
  }

  @Get('recent')
  getRecentLogs(@Query('limit') limit = '50') {
    return this.securityAuditService.getRecentLogs(parseInt(limit));
  }

  @Get('date-range')
  getLogsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.securityAuditService.getLogsByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('failed-logins')
  getFailedLogins(@Query('limit') limit = '50') {
    return this.securityAuditService.getFailedLogins(parseInt(limit));
  }

  @Get('critical')
  getCriticalEvents(@Query('limit') limit = '50') {
    return this.securityAuditService.getCriticalEvents(parseInt(limit));
  }
}
