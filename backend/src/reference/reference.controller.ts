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
import { ReferenceService } from './reference.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('references')
@UseGuards(JwtAuthGuard)
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    const userId = req.user?.id || 1;
    return this.referenceService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id || 1;
    return this.referenceService.findAll(userId);
  }

  @Get('by-company')
  async getByCompany(@Request() req, @Query('company') company: string) {
    const userId = req.user?.id || 1;
    return this.referenceService.getByCompany(userId, company);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.referenceService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
    const userId = req.user?.id || 1;
    return this.referenceService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = req.user?.id || 1;
    return this.referenceService.remove(userId, parseInt(id));
  }
}
