import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { SessionService } from './session.service';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockImplementation(async (pass: string, hash: string) => pass === 'password'),
  hash: jest.fn().mockImplementation(async () => 'hashedPassword'),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    passwordHash: '$2b$10$hashedpassword',
    name: 'Test User',
    isEmailVerified: true,
    lockedUntil: null,
    failedLoginAttempts: 0,
    twoFactorEnabled: false,
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-token'),
    verify: jest.fn().mockReturnValue({ sub: 1, requires2FA: true }),
  };

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      create: jest.fn(),
    },
  };

  const mockTwoFactorAuthService = {
    verifyTwoFactorToken: jest.fn(),
  };

  const mockSessionService = {
    createSession: jest.fn().mockResolvedValue({ id: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: TwoFactorAuthService,
          useValue: mockTwoFactorAuthService,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUserById', () => {
    it('should return user if id is valid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        isEmailVerified: true,
        role: 'user',
      });

      const result = await service.validateUserById(1);
      expect(result).toBeDefined();
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUserById(999);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password',
      });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.accessToken).toBe('mock-token');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'password' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create new user and return token', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true,
        agreePrivacy: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        ...mockUser,
        id: 2,
        email: 'new@example.com',
      });

      const result = await service.register(registerDto);
      expect(result).toHaveProperty('requiresEmailVerification');
      expect(result).toHaveProperty('user');
    });

    it('should throw error if user already exists', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'Password123!',
        confirmPassword: 'Password123!',
        agreeTerms: true,
        agreePrivacy: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow();
    });
  });
});
