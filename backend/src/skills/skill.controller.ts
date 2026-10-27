import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/authenticated-request.type';
import { SkillService } from './skill.service';
import type { CreateSkillInput, UpdateSkillInput } from './skill.service';

@Controller('skills')
@UseGuards(JwtAuthGuard)
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateSkillInput) {
    return this.skillService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.skillService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.skillService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateSkillInput
  ) {
    return this.skillService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.skillService.remove(req.user.id, id);
  }

  @Post(':id/endorse')
  endorse(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.skillService.incrementEndorsement(req.user.id, id);
  }
}
