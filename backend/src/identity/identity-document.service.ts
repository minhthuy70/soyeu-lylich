import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIdentityDocumentDto, UpdateIdentityDocumentDto } from './dto/create-identity-document.dto';

@Injectable()
export class IdentityDocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createDto: CreateIdentityDocumentDto) {
    // Check if document number already exists for this user
    const existing = await this.prisma.identityDocument.findFirst({
      where: {
        userId,
        documentNumber: createDto.documentNumber,
      },
    });

    if (existing) {
      throw new BadRequestException('Số giấy tờ này đã tồn tại');
    }

    const document = await this.prisma.identityDocument.create({
      data: {
        userId,
        documentType: createDto.documentType,
        documentNumber: createDto.documentNumber,
        issueDate: createDto.issueDate ? new Date(createDto.issueDate) : null,
        issuePlace: createDto.issuePlace,
        expiryDate: createDto.expiryDate ? new Date(createDto.expiryDate) : null,
      },
    });

    return document;
  }

  async findAll(userId: number) {
    const documents = await this.prisma.identityDocument.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      documents,
      count: documents.length,
    };
  }

  async findOne(userId: number, id: number) {
    const document = await this.prisma.identityDocument.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy giấy tờ định danh');
    }

    return document;
  }

  async update(userId: number, id: number, updateDto: UpdateIdentityDocumentDto) {
    const document = await this.prisma.identityDocument.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy giấy tờ định danh');
    }

    // Check if new document number conflicts with existing documents
    if (updateDto.documentNumber && updateDto.documentNumber !== document.documentNumber) {
      const existing = await this.prisma.identityDocument.findFirst({
        where: {
          userId,
          documentNumber: updateDto.documentNumber,
          id: { not: id },
        },
      });

      if (existing) {
        throw new BadRequestException('Số giấy tờ này đã tồn tại');
      }
    }

    const updated = await this.prisma.identityDocument.update({
      where: { id },
      data: {
        documentType: updateDto.documentType,
        documentNumber: updateDto.documentNumber,
        issueDate: updateDto.issueDate ? new Date(updateDto.issueDate) : undefined,
        issuePlace: updateDto.issuePlace,
        expiryDate: updateDto.expiryDate ? new Date(updateDto.expiryDate) : undefined,
      },
    });

    return updated;
  }

  async remove(userId: number, id: number) {
    const document = await this.prisma.identityDocument.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!document) {
      throw new NotFoundException('Không tìm thấy giấy tờ định danh');
    }

    await this.prisma.identityDocument.delete({
      where: { id },
    });

    return {
      message: 'Đã xóa giấy tờ định danh thành công',
    };
  }

  async validateDocumentData(documentType: string, documentNumber: string) {
    // Basic validation logic
    if (!documentType || !documentNumber) {
      throw new BadRequestException('Loại giấy tờ và số giấy tờ là bắt buộc');
    }

    // Document type validation
    const validTypes = ['CMND', 'CCCD', 'Hộ chiếu', 'Passport', 'Khác'];
    if (!validTypes.includes(documentType)) {
      throw new BadRequestException('Loại giấy tờ không hợp lệ');
    }

    // Document number validation (basic)
    if (documentNumber.length < 6 || documentNumber.length > 20) {
      throw new BadRequestException('Số giấy tờ phải có độ dài từ 6 đến 20 ký tự');
    }

    return {
      valid: true,
      message: 'Dữ liệu hợp lệ',
    };
  }
}
