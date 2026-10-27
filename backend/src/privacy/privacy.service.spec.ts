import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PrivacyService } from './privacy.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PrivacyService', () => {
  let service: PrivacyService;
  let prisma: {
    user: {
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockUser = {
    id: 1,
    email: 'user@example.com',
    isEmailVerified: true,
    createdAt: new Date('2023-01-01'),
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivacyService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<PrivacyService>(PrivacyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPrivacySettings', () => {
    it('should return user privacy settings when user exists', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getPrivacySettings(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          email: true,
          isEmailVerified: true,
          createdAt: true,
        },
      });
      expect(result.userId).toBe(1);
      expect(result.privacySettings.dataCollection).toBe(true);
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getPrivacySettings(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePrivacySettings', () => {
    it('should return updated settings message and payload', async () => {
      const customSettings = { marketingEmails: true };
      const result = await service.updatePrivacySettings(1, customSettings);

      expect(result.message).toContain('quyền riêng tư');
      expect(result.settings.marketingEmails).toBe(true);
      expect(result.settings.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('requestGDPRDataExport', () => {
    it('should export user data stripped of sensitive fields', async () => {
      const fullUserData = {
        ...mockUser,
        passwordHash: 'secret_hash',
        verificationToken: 'token123',
        resetPasswordToken: 'reset123',
        twoFactorSecret: '2fa_secret',
        profile: { fullName: 'Nguyen Van A' },
      };
      prisma.user.findUnique.mockResolvedValue(fullUserData);

      const result = await service.requestGDPRDataExport(1);

      expect(result.format).toBe('JSON');
      expect(result.exportData.passwordHash).toBeUndefined();
      expect(result.exportData.verificationToken).toBeUndefined();
      expect(result.exportData.twoFactorSecret).toBeUndefined();
      expect(result.exportData.profile.fullName).toBe('Nguyen Van A');
    });

    it('should throw Error when user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.requestGDPRDataExport(999)).rejects.toThrow('Không tìm thấy người dùng');
    });
  });

  describe('requestGDPRDataDeletion', () => {
    it('should update user to inactive and mark deletedAt', async () => {
      prisma.user.update.mockResolvedValue({ id: 1 });

      const result = await service.requestGDPRDataDeletion(1);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({
          email: 'deleted_1@deleted.local',
          isActive: false,
        }),
      });
      expect(result.message).toContain('GDPR');
    });
  });

  describe('getDataRetentionInfo', () => {
    it('should return system data retention policies', async () => {
      const result = await service.getDataRetentionInfo();

      expect(result.gdprCompliant).toBe(true);
      expect(result.rightToAccess).toBe(true);
      expect(result.dataRetentionPolicy.userAccounts).toBeDefined();
    });
  });

  describe('acceptCookieConsent', () => {
    it('should return accepted cookie preferences', async () => {
      const consent = { analytics: true, marketing: false };
      const result = await service.acceptCookieConsent(1, consent);

      expect(result.consent.userId).toBe(1);
      expect(result.consent.analytics).toBe(true);
      expect(result.consent.acceptedAt).toBeInstanceOf(Date);
    });
  });

  describe('getCookieConsent', () => {
    it('should return default cookie consent structure', async () => {
      const result = await service.getCookieConsent(1);

      expect(result.cookieConsent.necessary).toBe(true);
      expect(result.cookieConsent.analytics).toBe(false);
    });
  });
});
