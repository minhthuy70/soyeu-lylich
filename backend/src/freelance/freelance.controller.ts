import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FreelanceService } from './freelance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('freelance-projects')
@UseGuards(JwtAuthGuard)
export class FreelanceController {
  constructor(private readonly freelanceService: FreelanceService) {}

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    const userId = req.user?.id || 1;
    return this.freelanceService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id || 1;
    return this.freelanceService.findAll(userId);
  }

  @Get('total-earnings')
  async getTotalEarnings(@Request() req) {
    const userId = req.user?.id || 1;
    return this.freelanceService.getTotalEarnings(userId);
  }

  @Get('by-client')
  async getByClient(@Request() req, @Query('clientName') clientName: string) {
    const userId = req.user?.id || 1;
    return this.freelanceService.getByClient(userId, clientName);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.freelanceService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
    const userId = req.user?.id || 1;
    return this.freelanceService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.freelanceService.remove(userId, parseInt(id));
  }
}
