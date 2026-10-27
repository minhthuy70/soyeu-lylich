import { Test, TestingModule } from '@nestjs/testing';
import { PrivacyController } from './privacy.controller';
import { PrivacyService } from './privacy.service';

describe('PrivacyController', () => {
  let controller: PrivacyController;

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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPrivacySettings', () => {
    it('should call service.getPrivacySettings with user id', async () => {
      mockPrivacyService.getPrivacySettings.mockResolvedValue({ userId: 3 } as any);

      const result = await controller.getPrivacySettings(mockReq);

      expect(mockPrivacyService.getPrivacySettings).toHaveBeenCalledWith(3);
      expect(result).toEqual({ userId: 3 });
    });
  });

  describe('updatePrivacySettings', () => {
    it('should call service.updatePrivacySettings with settings body', () => {
      const settings = { marketingEmails: false };
      mockPrivacyService.updatePrivacySettings.mockReturnValue({ message: 'Success' });

      const result = controller.updatePrivacySettings(mockReq, settings);

      expect(mockPrivacyService.updatePrivacySettings).toHaveBeenCalledWith(3, settings);
      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('requestGDPRDataExport', () => {
    it('should call service.requestGDPRDataExport with user id', async () => {
      mockPrivacyService.requestGDPRDataExport.mockResolvedValue({ format: 'JSON' } as any);

      const result = await controller.requestGDPRDataExport(mockReq);

      expect(mockPrivacyService.requestGDPRDataExport).toHaveBeenCalledWith(3);
      expect(result).toEqual({ format: 'JSON' });
    });
  });

  describe('requestGDPRDataDeletion', () => {
    it('should call service.requestGDPRDataDeletion with user id', async () => {
      mockPrivacyService.requestGDPRDataDeletion.mockResolvedValue({ message: 'Deleted' } as any);

      const result = await controller.requestGDPRDataDeletion(mockReq);

      expect(mockPrivacyService.requestGDPRDataDeletion).toHaveBeenCalledWith(3);
      expect(result).toEqual({ message: 'Deleted' });
    });
  });

  describe('getDataRetentionInfo', () => {
    it('should call service.getDataRetentionInfo', () => {
      mockPrivacyService.getDataRetentionInfo.mockReturnValue({ gdprCompliant: true });

      const result = controller.getDataRetentionInfo();

      expect(mockPrivacyService.getDataRetentionInfo).toHaveBeenCalled();
      expect(result).toEqual({ gdprCompliant: true });
    });
  });

  describe('acceptCookieConsent', () => {
    it('should call service.acceptCookieConsent with consent body', () => {
      const consent = { analytics: true };
      mockPrivacyService.acceptCookieConsent.mockReturnValue({ message: 'Saved' });

      const result = controller.acceptCookieConsent(mockReq, consent);

      expect(mockPrivacyService.acceptCookieConsent).toHaveBeenCalledWith(3, consent);
      expect(result).toEqual({ message: 'Saved' });
    });
  });

  describe('getCookieConsent', () => {
    it('should call service.getCookieConsent with user id', () => {
      mockPrivacyService.getCookieConsent.mockReturnValue({ cookieConsent: {} });

      const result = controller.getCookieConsent();

      expect(mockPrivacyService.getCookieConsent).toHaveBeenCalledWith();
      expect(result).toEqual({ cookieConsent: {} });
    });
  });
});
