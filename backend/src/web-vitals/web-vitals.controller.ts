import { Controller, Post, Get, Body } from '@nestjs/common';
import { WebVitalsService } from './web-vitals.service';

@Controller('web-vitals')
export class WebVitalsController {
  constructor(private readonly webVitalsService: WebVitalsService) {}

  @Post()
  recordMetric(@Body() metric: any) {
    this.webVitalsService.recordMetric(metric);
    return { success: true };
  }

  @Get()
  getMetrics() {
    return this.webVitalsService.getMetrics();
  }

  @Get('average')
  getAverageMetrics() {
    return this.webVitalsService.getAverageMetrics();
  }
}
