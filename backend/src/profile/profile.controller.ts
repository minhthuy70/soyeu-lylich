import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  private extractUserIdFromRequest(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      // Simple JWT decoding (in production, use proper JWT verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  @Get()
  getProfile(@Request() req) {
    const userId = this.extractUserIdFromRequest(req);
    return this.profileService.getProfile(userId);
  }

  @Put()
  updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Put('change-password')
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.profileService.changePassword(userId, changePasswordDto);
  }

  @Delete()
  deleteAccount(@Request() req, @Body('password') password: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.profileService.deleteAccount(userId, password);
  }
}
