import { PartialType } from '@nestjs/mapped-types';
import { CreateIntegrationDto } from './create-integration.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateIntegrationDto extends PartialType(CreateIntegrationDto) {
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
