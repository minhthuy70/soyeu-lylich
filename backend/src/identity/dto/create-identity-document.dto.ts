import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateIdentityDocumentDto {
  @IsString()
  documentType: string;

  @IsString()
  documentNumber: string;

  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @IsString()
  @IsOptional()
  issuePlace?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}

export class UpdateIdentityDocumentDto {
  @IsString()
  @IsOptional()
  documentType?: string;

  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsDateString()
  @IsOptional()
  issueDate?: string;

  @IsString()
  @IsOptional()
  issuePlace?: string;

  @IsDateString()
  @IsOptional()
  expiryDate?: string;
}
