import { IsString, IsOptional, IsInt, IsDateString, IsArray, IsUrl, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  placeOfBirth?: string;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @IsString()
  @IsOptional()
  personalPhoto?: string;

  @IsString()
  @IsOptional()
  introduction?: string;

  @IsString()
  @IsOptional()
  religion?: string;

  @IsString()
  @IsOptional()
  ethnicity?: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsInt()
  @IsOptional()
  height?: number;

  @IsInt()
  @IsOptional()
  weight?: number;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @IsOptional()
  secondaryPhone?: string;

  @IsString()
  @IsOptional()
  currentAddress?: string;

  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsArray()
  @IsString({ each: true })
  @IsUrl({}, { each: true })
  @IsOptional()
  socialLinks?: string[];

  @IsString()
  @IsOptional()
  @IsUrl()
  personalWebsite?: string;

  @IsString()
  @IsOptional()
  emergencyContact?: string;
}
