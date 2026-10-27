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
  ParseIntPipe,
} from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import type { CreateReferenceInput, UpdateReferenceInput } from './reference.service';

@Controller('references')
@UseGuards(JwtAuthGuard)
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateReferenceInput) {
    return this.referenceService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.referenceService.findAll(req.user.id);
  }

  @Get('by-company')
  getByCompany(@Request() req: AuthenticatedRequest, @Query('company') company: string) {
    return this.referenceService.getByCompany(req.user.id, company);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.referenceService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateReferenceInput
  ) {
    return this.referenceService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.referenceService.remove(req.user.id, id);
  }
}
