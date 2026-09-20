import {
  IsString,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu hiện tại không được để trống' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(8, {
    message: 'Mật khẩu phải có ít nhất 8 ký tự',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng xác nhận mật khẩu mới' })
  confirmPassword: string;
}
