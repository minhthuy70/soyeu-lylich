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
import { IdentityDocumentService } from './identity-document.service';
import {
  CreateIdentityDocumentDto,
  UpdateIdentityDocumentDto,
} from './dto/create-identity-document.dto';

@Controller('identity-documents')
@UseGuards(JwtAuthGuard)
export class IdentityDocumentController {
  constructor(private readonly identityDocumentService: IdentityDocumentService) {}

  @Post()
  create(@Request() req: AuthenticatedRequest, @Body() createDto: CreateIdentityDocumentDto) {
    return this.identityDocumentService.create(req.user.id, createDto);
  }

  @Get()
  findAll(@Request() req: AuthenticatedRequest) {
    return this.identityDocumentService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.identityDocumentService.findOne(req.user.id, id);
  }

  @Put(':id')
  update(
    @Request() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIdentityDocumentDto
  ) {
    return this.identityDocumentService.update(req.user.id, id, updateDto);
  }

  @Delete(':id')
  remove(@Request() req: AuthenticatedRequest, @Param('id', ParseIntPipe) id: number) {
    return this.identityDocumentService.remove(req.user.id, id);
  }

  @Post('validate')
  validate(@Body() body: { documentType: string; documentNumber: string }) {
    return this.identityDocumentService.validateDocumentData(
      body.documentType,
      body.documentNumber
    );
  }
}
