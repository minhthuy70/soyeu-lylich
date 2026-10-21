import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ErrorTrackingService } from './error-tracking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('error-tracking')
@UseGuards(JwtAuthGuard)
export class ErrorTrackingController {
  constructor(private readonly errorTrackingService: ErrorTrackingService) {}

  @Post()
  logError(@Body() body: any) {
    return this.errorTrackingService.logError(body);
  }

  @Post('stats')
  getStats() {
    return this.errorTrackingService.getErrorStats();
  }
}
