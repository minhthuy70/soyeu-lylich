import { Module } from '@nestjs/common';
import { SearchFilterService } from './search-filter.service';
import { SearchFilterController } from './search-filter.controller';
import { SortingService } from './sorting.service';
import { SortingController } from './sorting.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SearchFilterController, SortingController],
  providers: [SearchFilterService, SortingService],
  exports: [SearchFilterService, SortingService],
})
export class SearchFilterModule {}
