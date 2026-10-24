import { Controller, Get, Post, Put, Delete, Body, Param, Req } from '@nestjs/common';
import { PatentService } from './patent.service';

@Controller('patents')
export class PatentController {
  constructor(private patentService: PatentService) {}

  private extractUserId(req: any): number {
    const authHeader = req.headers.authorization;
    if (!authHeader) return 1;
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  }

  @Post()
  async createPatent(@Req() req, @Body() data: any) {
    const userId = this.extractUserId(req);
    return this.patentService.createPatent(userId, data);
  }

  @Get()
  async getPatents(@Req() req) {
    const userId = this.extractUserId(req);
    return this.patentService.getPatents(userId);
  }

  @Get(':id')
  async getPatentById(@Param('id') id: string, @Req() req) {
    const userId = this.extractUserId(req);
    return this.patentService.getPatentById(+id, userId);
  }

  @Put(':id')
  async updatePatent(@Param('id') id: string, @Req() req, @Body() data: any) {
    const userId = this.extractUserId(req);
    return this.patentService.updatePatent(+id, userId, data);
  }

  @Delete(':id')
  async deletePatent(@Param('id') id: string, @Req() req) {
    const userId = this.extractUserId(req);
    return this.patentService.deletePatent(+id, userId);
  }
}
