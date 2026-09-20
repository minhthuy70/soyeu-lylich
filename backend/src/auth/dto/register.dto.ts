import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự',
  })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng xác nhận mật khẩu' })
  confirmPassword: string;

  @IsBoolean()
  @IsNotEmpty({ message: 'Vui lòng đồng ý điều khoản sử dụng' })
  agreeTerms: boolean;

  @IsBoolean()
  @IsNotEmpty({ message: 'Vui lòng đồng ý chính sách bảo mật' })
  agreePrivacy: boolean;
}