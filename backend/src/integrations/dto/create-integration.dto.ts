import { IsString, IsOptional, IsBoolean, IsArray, IsEnum } from 'class-validator';

export enum IntegrationProvider {
  TWITTER = 'twitter',
  SLACK = 'slack',
  NOTION = 'notion',
  GOOGLE_CALENDAR = 'google_calendar',
  SENDGRID = 'sendgrid',
  TWILIO = 'twilio',
  STRIPE = 'stripe',
  AWS_S3 = 'aws_s3',
}

export class CreateIntegrationDto {
  @IsEnum(IntegrationProvider)
  provider: IntegrationProvider;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  settings?: Record<string, any>;
}
