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
import { PublicationService } from './publication.service';
import type { PublicationInput, PublicationUpdateInput } from './publication.service';

@Controller('publications')
@UseGuards(JwtAuthGuard)
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  createPublication(@Request() req: AuthenticatedRequest, @Body() data: PublicationInput) {
    return this.publicationService.createPublication(req.user.id, data);
  }

  @Get()
  getPublications(@Request() req: AuthenticatedRequest) {
    return this.publicationService.getPublications(req.user.id);
  }

  @Get(':id')
  getPublicationById(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.publicationService.getPublicationById(id, req.user.id);
  }

  @Put(':id')
  updatePublication(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
    @Body() data: PublicationUpdateInput
  ) {
    return this.publicationService.updatePublication(id, req.user.id, data);
  }

  @Delete(':id')
  deletePublication(@Param('id', ParseIntPipe) id: number, @Request() req: AuthenticatedRequest) {
    return this.publicationService.deletePublication(id, req.user.id);
  }
}
