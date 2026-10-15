import { IsString, IsOptional, IsDateString, IsArray, IsInt } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsDateString()
  achievementDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string; // 'Academic', 'Professional', 'Sports', 'Arts', 'Other'

  @IsOptional()
  @IsString()
  level?: string; // 'School', 'District', 'Provincial', 'National', 'International'
}

export class UpdateAchievementDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsDateString()
  achievementDate?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  level?: string;
}
