import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { IdentityDocumentService } from './identity-document.service';
import { CreateIdentityDocumentDto, UpdateIdentityDocumentDto } from './dto/create-identity-document.dto';

@Controller('identity-documents')
export class IdentityDocumentController {
  constructor(private readonly identityDocumentService: IdentityDocumentService) {}

  @Post()
  async create(@Request() req, @Body() createDto: CreateIdentityDocumentDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.identityDocumentService.create(userId, createDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = this.extractUserIdFromRequest(req);
    return this.identityDocumentService.findAll(userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.identityDocumentService.findOne(userId, parseInt(id));
  }

  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateIdentityDocumentDto) {
    const userId = this.extractUserIdFromRequest(req);
    return this.identityDocumentService.update(userId, parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const userId = this.extractUserIdFromRequest(req);
    return this.identityDocumentService.remove(userId, parseInt(id));
  }

  @Post('validate')
  async validate(@Body() body: { documentType: string; documentNumber: string }) {
    return this.identityDocumentService.validateDocumentData(body.documentType, body.documentNumber);
  }

  private extractUserIdFromRequest(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }
}
