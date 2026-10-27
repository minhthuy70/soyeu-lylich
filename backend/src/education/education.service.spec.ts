import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EducationService } from './education.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EducationService', () => {
  let service: EducationService;
  let prisma: {
    education: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  const mockEducation = {
    id: 1,
    userId: 1,
    schoolName: 'Đại học Quốc Gia Hà Nội',
    major: 'Khoa học máy tính',
    degree: 'Cử nhân',
    startDate: new Date('2020-09-01'),
    endDate: new Date('2024-06-30'),
    currentStudyStatus: 'Đã tốt nghiệp',
    gpa: 3.8,
    academicAchievements: ['Học bổng khuyến khích học tập'],
    description: 'Chuyên ngành kỹ thuật phần mềm',
    thesisTopic: 'Hệ thống quản lý sơ yếu lý lịch thông minh',
    relevantCoursework: ['Cấu trúc dữ liệu', 'Thuật toán'],
    studyAbroad: null,
  };

  beforeEach(async () => {
    prisma = {
      education: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EducationService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<EducationService>(EducationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new education record', async () => {
      prisma.education.create.mockResolvedValue(mockEducation);

      const dto = {
        schoolName: 'Đại học Bách Khoa',
        major: 'Kỹ thuật máy tính',
        degree: 'Kỹ sư',
        startDate: '2020-09-01',
      };

      const result = await service.create(1, dto);

      expect(prisma.education.create).toHaveBeenCalled();
      expect(result).toEqual(mockEducation);
    });
  });

  describe('findAll', () => {
    it('should return all educations for a user', async () => {
      prisma.education.findMany.mockResolvedValue([mockEducation]);

      const result = await service.findAll(1);

      expect(prisma.education.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ educations: [mockEducation], count: 1 });
    });

    it('should filter by degree when provided', async () => {
      prisma.education.findMany.mockResolvedValue([mockEducation]);

      await service.findAll(1, 'Cử nhân');

      expect(prisma.education.findMany).toHaveBeenCalledWith({
        where: { userId: 1, degree: 'Cử nhân' },
        orderBy: [{ startDate: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return an education when found', async () => {
      prisma.education.findFirst.mockResolvedValue(mockEducation);

      const result = await service.findOne(1, 1);

      expect(prisma.education.findFirst).toHaveBeenCalledWith({
        where: { id: 1, userId: 1 },
      });
      expect(result).toEqual(mockEducation);
    });

    it('should throw NotFoundException when education is not found', async () => {
      prisma.education.findFirst.mockResolvedValue(null);

      await expect(service.findOne(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update education when found', async () => {
      prisma.education.findFirst.mockResolvedValue(mockEducation);
      const updated = { ...mockEducation, gpa: 3.9 };
      prisma.education.update.mockResolvedValue(updated);

      const result = await service.update(1, 1, { gpa: 3.9 });

      expect(prisma.education.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ gpa: 3.9 }),
      });
      expect(result.gpa).toBe(3.9);
    });

    it('should throw NotFoundException when updating non-existent record', async () => {
      prisma.education.findFirst.mockResolvedValue(null);

      await expect(service.update(1, 999, { major: 'New' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete education when found', async () => {
      prisma.education.findFirst.mockResolvedValue(mockEducation);
      prisma.education.delete.mockResolvedValue(mockEducation);

      const result = await service.remove(1, 1);

      expect(prisma.education.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Đã xóa thông tin học vấn thành công' });
    });

    it('should throw NotFoundException when deleting non-existent record', async () => {
      prisma.education.findFirst.mockResolvedValue(null);

      await expect(service.remove(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCurrentStudies', () => {
    it('should return only educations with status Đang học', async () => {
      const activeEdu = { ...mockEducation, currentStudyStatus: 'Đang học' };
      prisma.education.findMany.mockResolvedValue([activeEdu]);

      const result = await service.getCurrentStudies(1);

      expect(prisma.education.findMany).toHaveBeenCalledWith({
        where: { userId: 1, currentStudyStatus: 'Đang học' },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ currentStudies: [activeEdu], count: 1 });
    });
  });

  describe('getTimeline', () => {
    it('should map education records into timeline format', async () => {
      prisma.education.findMany.mockResolvedValue([mockEducation]);

      const result = await service.getTimeline(1);

      expect(result.timeline).toHaveLength(1);
      expect(result.timeline[0]).toEqual({
        id: mockEducation.id,
        schoolName: mockEducation.schoolName,
        major: mockEducation.major,
        degree: mockEducation.degree,
        startDate: mockEducation.startDate,
        endDate: mockEducation.endDate,
        currentStudyStatus: mockEducation.currentStudyStatus,
        gpa: mockEducation.gpa,
      });
    });
  });

  describe('getByDegree', () => {
    it('should search educations matching degree', async () => {
      prisma.education.findMany.mockResolvedValue([mockEducation]);

      const result = await service.getByDegree(1, 'Cử nhân');

      expect(prisma.education.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          degree: { contains: 'Cử nhân', mode: 'insensitive' },
        },
        orderBy: [{ startDate: 'desc' }],
      });
      expect(result).toEqual({ educations: [mockEducation], count: 1 });
    });
  });
});
