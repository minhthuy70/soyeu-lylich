import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { PublicationService } from './publication.service';

@Controller('publications')
export class PublicationController {
  constructor(private publicationService: PublicationService) {}

  private extractUserId(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) return 1;
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }

  @Post()
  async createPublication(@Req() req, @Body() data: any) {
    const userId = this.extractUserId(req);
    return this.publicationService.createPublication(userId, data);
  }

  @Get()
  async getPublications(@Req() req) {
    const userId = this.extractUserId(req);
    return this.publicationService.getPublications(userId);
  }

  @Get(':id')
  async getPublicationById(@Param('id') id: string, @Req() req) {
    const userId = this.extractUserId(req);
    return this.publicationService.getPublicationById(+id, userId);
  }

  @Put(':id')
  async updatePublication(@Param('id') id: string, @Req() req, @Body() data: any) {
    const userId = this.extractUserId(req);
    return this.publicationService.updatePublication(+id, userId, data);
  }

  @Delete(':id')
  async deletePublication(@Param('id') id: string, @Req() req) {
    const userId = this.extractUserId(req);
    return this.publicationService.deletePublication(+id, userId);
  }
}
