import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { UnauthorizedException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile = {
    id: 1,
    userId: 1,
    title: 'Software Engineer',
    bio: 'Experienced developer',
    phone: '+1234567890',
    address: '123 Main St',
    website: 'https://example.com',
  };

  const mockPrisma = {
    profile: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: 'PrismaService',
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockPrisma.profile.findFirst.mockResolvedValue(mockProfile);

      const result = await service.getProfile(1);
      expect(result).toEqual(mockProfile);
      expect(mockPrisma.profile.findFirst).toHaveBeenCalledWith({
        where: { userId: 1 },
      });
    });

    it('should return null if profile not found', async () => {
      mockPrisma.profile.findFirst.mockResolvedValue(null);

      const result = await service.getProfile(1);
      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update and return profile', async () => {
      const updateDto = {
        title: 'Senior Software Engineer',
        bio: 'Updated bio',
      };

      mockPrisma.profile.findFirst.mockResolvedValue(mockProfile);
      mockPrisma.profile.update.mockResolvedValue({
        ...mockProfile,
        ...updateDto,
      });

      const result = await service.updateProfile(1, updateDto);
      expect(result.title).toBe(updateDto.title);
      expect(mockPrisma.profile.update).toHaveBeenCalled();
    });

    it('should throw error if profile not found', async () => {
      mockPrisma.profile.findFirst.mockResolvedValue(null);

      await expect(service.updateProfile(1, { title: 'New Title' })).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('createProfile', () => {
    it('should create new profile', async () => {
      const createDto = {
        userId: 1,
        title: 'Software Engineer',
        bio: 'New bio',
      };

      mockPrisma.profile.create.mockResolvedValue(mockProfile);

      const result = await service.createProfile(createDto);
      expect(result).toEqual(mockProfile);
      expect(mockPrisma.profile.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });
});
