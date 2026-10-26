import { Controller, Get, Put, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { UserManagementService } from './user-management.service';

@Controller('admin/users')
@UseGuards(AdminGuard)
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get()
  async getAllUsers() {
    return this.userManagementService.getAllUsers();
  }

  @Put(':id')
  async editUser(@Param('id') id: string, @Body() updateData: any) {
    return this.userManagementService.editUser(parseInt(id), updateData);
  }

  @Get('export')
  async exportUserList(@Query('format') format: 'csv' | 'json' = 'csv') {
    return this.userManagementService.exportUserList(format);
  }

  @Post('bulk')
  async bulkUserActions(
    @Body() body: { action: 'disable' | 'enable' | 'delete'; userIds: number[] }
  ) {
    return this.userManagementService.bulkUserActions(body.action, body.userIds);
  }

  @Get(':id/activity')
  async getUserActivityLog(@Param('id') id: string, @Query('limit') limit: string = '50') {
    return this.userManagementService.getUserActivityLog(parseInt(id), parseInt(limit));
  }

  @Post(':id/impersonate')
  async impersonateUser(@Param('id') id: string, @Body() body: { adminId: number }) {
    return this.userManagementService.impersonateUser(parseInt(id), body.adminId);
  }

  @Post('end-impersonation')
  async endImpersonation(@Body() body: { adminId: number }) {
    return this.userManagementService.endImpersonation(body.adminId);
  }
}
