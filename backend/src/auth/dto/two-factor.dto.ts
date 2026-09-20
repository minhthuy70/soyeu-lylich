import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';

export class EnableTwoFactorDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  @MinLength(6, { message: 'Mã OTP phải có ít nhất 6 ký tự' })
  @MaxLength(6, { message: 'Mã OTP phải có tối đa 6 ký tự' })
  otp: string;
}

export class VerifyTwoFactorDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  @MinLength(6, { message: 'Mã OTP phải có ít nhất 6 ký tự' })
  @MaxLength(6, { message: 'Mã OTP phải có tối đa 6 ký tự' })
  otp: string;
}

export class VerifyEmailTwoFactorDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã OTP không được để trống' })
  @MinLength(6, { message: 'Mã OTP phải có ít nhất 6 ký tự' })
  @MaxLength(6, { message: 'Mã OTP phải có tối đa 6 ký tự' })
  otp: string;
}

export class GenerateBackupCodesDto {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;
}
