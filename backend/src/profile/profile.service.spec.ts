import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockProfile = {
    id: 1,
    userId: 1,
    fullName: 'Test User',
    desiredPosition: 'Software Engineer',
    introduction: 'Experienced developer',
    phoneNumber: '+1234567890',
    currentAddress: '123 Main St',
    personalWebsite: 'https://example.com',
  };

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    isEmailVerified: true,
    createdAt: new Date(),
    profile: mockProfile,
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
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
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getProfile(1);
      expect(result).toHaveProperty('profile');
      expect(result.profile).toEqual(mockProfile);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getProfile(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('should update existing profile', async () => {
      const updateDto = {
        fullName: 'Updated Name',
        desiredPosition: 'Senior Software Engineer',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      mockPrisma.profile.update.mockResolvedValue({
        ...mockProfile,
        ...updateDto,
      });

      const result = await service.updateProfile(1, updateDto);
      expect(result.profile.fullName).toBe('Updated Name');
      expect(mockPrisma.profile.update).toHaveBeenCalled();
    });

    it('should create profile if none exists', async () => {
      const updateDto = {
        fullName: 'New User Profile',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.profile.create.mockResolvedValue({
        ...mockProfile,
        ...updateDto,
      });

      const result = await service.updateProfile(1, updateDto);
      expect(result.profile.fullName).toBe('New User Profile');
      expect(mockPrisma.profile.create).toHaveBeenCalled();
    });
  });
});
