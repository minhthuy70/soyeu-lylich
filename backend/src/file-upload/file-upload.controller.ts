import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const userId = req.user?.id || 1;
    return this.fileUploadService.uploadImage(file, userId);
  }

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const userId = req.user?.id || 1;
    return this.fileUploadService.uploadDocument(file, userId);
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string, @Request() req) {
    const userId = req.user?.id || 1;
    return this.fileUploadService.deleteFile(fileId, userId);
  }

  @Get(':fileId')
  async getFileInfo(@Param('fileId') fileId: string) {
    return this.fileUploadService.getFileInfo(fileId);
  }

  @Get(':fileId/content')
  async getFileContent(@Param('fileId') fileId: string) {
    const content = await this.fileUploadService.getFileContent(fileId);
    // Return file content with appropriate headers
    return content;
  }
}
