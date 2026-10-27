import { Prisma } from '@prisma/client';
import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';

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
  @IsObject()
  metadata?: Prisma.InputJsonValue;

  @IsOptional()
  @IsObject()
  settings?: Prisma.InputJsonValue;
}
