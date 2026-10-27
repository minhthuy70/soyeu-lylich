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
import { PatentService } from './patent.service';
import type { PatentInput, PatentUpdateInput } from './patent.service';

@Controller('patents')
@UseGuards(JwtAuthGuard)
export class PatentController {
  constructor(private readonly patentService: PatentService) {}

  @Post()
  createPatent(@Request() req: AuthenticatedRequest, @Body() data: PatentInput) {
    return this.patentService.createPatent(req.user.id, data);
  }

  @Get()
  getPatents(@Request() req: AuthenticatedRequest) {
    return this.patentService.getPatents(req.user.id);
  }

  @Get(':id')
  getPatentById(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.patentService.getPatentById(id, req.user.id);
  }

  @Put(':id')
  updatePatent(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
    @Body() data: PatentUpdateInput
  ) {
    return this.patentService.updatePatent(id, req.user.id, data);
  }

  @Delete(':id')
  deletePatent(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.patentService.deletePatent(id, req.user.id);
  }
}
