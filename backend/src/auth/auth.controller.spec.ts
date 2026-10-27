import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SocialAuthService } from './social-auth.service';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { SessionService } from './session.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
    register: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: SocialAuthService,
          useValue: {},
        },
        {
          provide: TwoFactorAuthService,
          useValue: {},
        },
        {
          provide: SessionService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return access token and user on successful login', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockResponse = {
        access_token: 'jwt-token',
        user: { id: 1, email: 'test@example.com', name: 'Test User' },
      };

      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);
      expect(result).toEqual(mockResponse);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockAuthService.login.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return access token and user on successful registration', async () => {
      const registerDto = {
        email: 'new@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true,
        agreePrivacy: true,
      };

      const mockResponse = {
        access_token: 'jwt-token',
        user: { id: 2, email: 'new@example.com', name: 'New User' },
      };

      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(registerDto);
      expect(result).toEqual(mockResponse);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw error if user already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
        agreeTerms: true,
        agreePrivacy: true,
      };

      mockAuthService.register.mockRejectedValue(new Error('User already exists'));

      await expect(controller.register(registerDto)).rejects.toThrow();
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset email', async () => {
      const forgotPasswordDto = {
        email: 'test@example.com',
      };

      mockAuthService.forgotPassword.mockResolvedValue({ message: 'Reset email sent' });

      const result = await controller.forgotPassword(forgotPasswordDto);
      expect(result).toHaveProperty('message');
      expect(service.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const resetPasswordDto = {
        token: 'valid-token',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      mockAuthService.resetPassword.mockResolvedValue({ message: 'Password reset successful' });

      const result = await controller.resetPassword(resetPasswordDto);
      expect(result).toHaveProperty('message');
      expect(service.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
    });

    it('should throw error with invalid token', async () => {
      const resetPasswordDto = {
        token: 'invalid-token',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      };

      mockAuthService.resetPassword.mockRejectedValue(new UnauthorizedException('Invalid token'));

      await expect(controller.resetPassword(resetPasswordDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
