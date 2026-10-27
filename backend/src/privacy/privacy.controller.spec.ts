import { Test, TestingModule } from '@nestjs/testing';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';

describe('PrivacyController', () => {
  let controller: PrivacyController;
  let service: jest.Mocked<PrivacyService>;

  const mockPrivacyService = {
    getPrivacySettings: jest.fn(),
    updatePrivacySettings: jest.fn(),
    requestGDPRDataExport: jest.fn(),
    requestGDPRDataDeletion: jest.fn(),
    getDataRetentionInfo: jest.fn(),
    acceptCookieConsent: jest.fn(),
    getCookieConsent: jest.fn(),
  };

  const mockReq = { user: { id: 3 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PrivacyController],
      providers: [
        {
          provide: PrivacyService,
          useValue: mockPrivacyService,
        },
      ],
    }).compile();

    controller = module.get<PrivacyController>(PrivacyController);
    service = module.get(PrivacyService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPrivacySettings', () => {
    it('should call service.getPrivacySettings with user id', async () => {
      mockPrivacyService.getPrivacySettings.mockResolvedValue({ userId: 3 } as any);

      const result = await controller.getPrivacySettings(mockReq);

      expect(service.getPrivacySettings).toHaveBeenCalledWith(3);
      expect(result).toEqual({ userId: 3 });
    });

    it('should fallback to userId 1 if req.user is absent', async () => {
      await controller.getPrivacySettings({});

      expect(service.getPrivacySettings).toHaveBeenCalledWith(1);
    });
  });

  describe('updatePrivacySettings', () => {
    it('should call service.updatePrivacySettings with settings body', async () => {
      const settings = { marketingEmails: false };
      mockPrivacyService.updatePrivacySettings.mockResolvedValue({ message: 'Success' } as any);

      const result = await controller.updatePrivacySettings(mockReq, settings);

      expect(service.updatePrivacySettings).toHaveBeenCalledWith(3, settings);
      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('requestGDPRDataExport', () => {
    it('should call service.requestGDPRDataExport with user id', async () => {
      mockPrivacyService.requestGDPRDataExport.mockResolvedValue({ format: 'JSON' } as any);

      const result = await controller.requestGDPRDataExport(mockReq);

      expect(service.requestGDPRDataExport).toHaveBeenCalledWith(3);
      expect(result).toEqual({ format: 'JSON' });
    });
  });

  describe('requestGDPRDataDeletion', () => {
    it('should call service.requestGDPRDataDeletion with user id', async () => {
      mockPrivacyService.requestGDPRDataDeletion.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.requestGDPRDataDeletion(mockReq);

      expect(service.requestGDPRDataDeletion).toHaveBeenCalledWith(3);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });

  describe('getDataRetentionInfo', () => {
    it('should call service.getDataRetentionInfo', async () => {
      mockPrivacyService.getDataRetentionInfo.mockResolvedValue({ gdprCompliant: true } as any);

      const result = await controller.getDataRetentionInfo();

      expect(service.getDataRetentionInfo).toHaveBeenCalled();
      expect(result).toEqual({ gdprCompliant: true });
    });
  });

  describe('acceptCookieConsent', () => {
    it('should call service.acceptCookieConsent with consent body', async () => {
      const consent = { analytics: true };
      mockPrivacyService.acceptCookieConsent.mockResolvedValue({ message: 'Saved' } as any);

      const result = await controller.acceptCookieConsent(mockReq, consent);

      expect(service.acceptCookieConsent).toHaveBeenCalledWith(3, consent);
      expect(result).toEqual({ message: 'Saved' });
    });
  });

  describe('getCookieConsent', () => {
    it('should call service.getCookieConsent with user id', async () => {
      mockPrivacyService.getCookieConsent.mockResolvedValue({ cookieConsent: {} } as any);

      const result = await controller.getCookieConsent(mockReq);

      expect(service.getCookieConsent).toHaveBeenCalledWith(3);
      expect(result).toEqual({ cookieConsent: {} });
    });
  });
});
