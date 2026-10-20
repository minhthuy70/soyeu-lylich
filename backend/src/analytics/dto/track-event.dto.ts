import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export enum EventType {
  PAGE_VIEW = 'page_view',
  CLICK = 'click',
  SCROLL = 'scroll',
  FORM_SUBMIT = 'form_submit',
  NAVIGATION = 'navigation',
  ERROR = 'error',
}

export class TrackEventDto {
  @IsEnum(EventType)
  eventType: EventType;

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  element?: string;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  duration?: number;

  @IsString()
  @IsOptional()
  sessionId?: string;
}
