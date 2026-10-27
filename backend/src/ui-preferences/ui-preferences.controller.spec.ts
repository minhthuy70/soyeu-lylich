import { Test, TestingModule } from '@nestjs/testing';
import { UIPreferencesController } from './ui-preferences.controller';
import { UIPreferencesService } from './ui-preferences.service';

describe('UIPreferencesController', () => {
  let controller: UIPreferencesController;
  let service: jest.Mocked<UIPreferencesService>;

  const mockService = {
    getUserPreferences: jest.fn(),
    updateUserPreferences: jest.fn(),
    resetToDefaults: jest.fn(),
    getAvailableThemes: jest.fn(),
    getAvailableColors: jest.fn(),
    getAvailableFonts: jest.fn(),
    getAvailableLayouts: jest.fn(),
  };

  const mockReq = { user: { id: 21 } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UIPreferencesController],
      providers: [
        {
          provide: UIPreferencesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UIPreferencesController>(UIPreferencesController);
    service = module.get(UIPreferencesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUserPreferences', () => {
    it('should call service.getUserPreferences with user id', async () => {
      mockService.getUserPreferences.mockResolvedValue({ userId: 21 } as any);

      const result = await controller.getUserPreferences(mockReq);

      expect(service.getUserPreferences).toHaveBeenCalledWith(21);
      expect(result).toEqual({ userId: 21 });
    });

    it('should fallback to userId 1 if req.user is absent', async () => {
      await controller.getUserPreferences({});

      expect(service.getUserPreferences).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUserPreferences', () => {
    it('should call service.updateUserPreferences with user id and body', async () => {
      const body = { theme: { mode: 'dark' } };
      mockService.updateUserPreferences.mockResolvedValue({ message: 'Success' } as any);

      const result = await controller.updateUserPreferences(mockReq, body);

      expect(service.updateUserPreferences).toHaveBeenCalledWith(21, body);
      expect(result).toEqual({ message: 'Success' });
    });
  });

  describe('resetToDefaults', () => {
    it('should call service.resetToDefaults with user id', async () => {
      mockService.resetToDefaults.mockResolvedValue({ message: 'Reset' } as any);

      const result = await controller.resetToDefaults(mockReq);

      expect(service.resetToDefaults).toHaveBeenCalledWith(21);
      expect(result).toEqual({ message: 'Reset' });
    });
  });

  describe('getAvailableThemes', () => {
    it('should return available themes', async () => {
      mockService.getAvailableThemes.mockResolvedValue({ themes: [] } as any);

      const result = await controller.getAvailableThemes();

      expect(service.getAvailableThemes).toHaveBeenCalled();
      expect(result).toEqual({ themes: [] });
    });
  });

  describe('getAvailableColors', () => {
    it('should return available colors', async () => {
      mockService.getAvailableColors.mockResolvedValue({ colors: [] } as any);

      const result = await controller.getAvailableColors();

      expect(service.getAvailableColors).toHaveBeenCalled();
      expect(result).toEqual({ colors: [] });
    });
  });

  describe('getAvailableFonts', () => {
    it('should return available fonts', async () => {
      mockService.getAvailableFonts.mockResolvedValue({ fonts: [] } as any);

      const result = await controller.getAvailableFonts();

      expect(service.getAvailableFonts).toHaveBeenCalled();
      expect(result).toEqual({ fonts: [] });
    });
  });

  describe('getAvailableLayouts', () => {
    it('should return available layouts', async () => {
      mockService.getAvailableLayouts.mockResolvedValue({ layouts: [] } as any);

      const result = await controller.getAvailableLayouts();

      expect(service.getAvailableLayouts).toHaveBeenCalled();
      expect(result).toEqual({ layouts: [] });
    });
  });
});
