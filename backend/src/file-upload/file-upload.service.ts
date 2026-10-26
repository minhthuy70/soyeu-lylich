import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileUploadService {
  private readonly uploadDir = './uploads';
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  private readonly allowedDocTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  constructor(private readonly prisma: PrismaService) {
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Helper: Generate unique file ID
  private generateFileId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // 1. Upload image
  async uploadImage(file: Express.Multer.File, userId: number) {
    this.validateFile(file, this.allowedImageTypes);

    const fileId = this.generateFileId();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Save file metadata to database (using CloudStorageFile model if available)
    // For now, return the file info
    return {
      fileId,
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${fileName}`,
      uploadedAt: new Date(),
    };
  }

  // 2. Upload document
  async uploadDocument(file: Express.Multer.File, userId: number) {
    this.validateFile(file, this.allowedDocTypes);

    const fileId = this.generateFileId();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    return {
      fileId,
      fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${fileName}`,
      uploadedAt: new Date(),
    };
  }

  // 3. Delete file
  async deleteFile(fileId: string, userId: number) {
    const filePath = path.join(this.uploadDir, fileId);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { success: true, message: 'File deleted successfully' };
    }

    throw new BadRequestException('File not found');
  }

  // 4. Get file info
  async getFileInfo(fileId: string) {
    const filePath = path.join(this.uploadDir, fileId);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    const stats = fs.statSync(filePath);
    return {
      fileId,
      size: stats.size,
      url: `/uploads/${fileId}`,
    };
  }

  // Helper: Validate file
  private validateFile(file: Express.Multer.File, allowedTypes: string[]) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Check file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Check file type
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }
  }

  // Helper: Get file content
  async getFileContent(fileId: string) {
    const filePath = path.join(this.uploadDir, fileId);

    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }

    return fs.readFileSync(filePath);
  }

  // Helper: Get all files for user
  async getUserFiles(userId: number) {
    // In production, query database for user's files
    // For now, return empty array
    return [];
  }
}
