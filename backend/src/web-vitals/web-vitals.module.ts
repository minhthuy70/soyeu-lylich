import { Module } from '@nestjs/common';
import { WebVitalsController } from './web-vitals.controller';
import { WebVitalsService } from './web-vitals.service';

@Module({
  controllers: [WebVitalsController],
  providers: [WebVitalsService],
  exports: [WebVitalsService],
})
export class WebVitalsModule {}
