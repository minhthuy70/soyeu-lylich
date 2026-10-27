import { Test, TestingModule } from '@nestjs/testing';
import { UIPreferencesService } from './ui-preferences.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UIPreferencesService', () => {
  let service: UIPreferencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UIPreferencesService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UIPreferencesService>(UIPreferencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserPreferences', () => {
    it('should return theme, typography and layout defaults for user', async () => {
      const result = await service.getUserPreferences(42);

      expect(result.userId).toBe(42);
      expect(result.theme.mode).toBe('light');
      expect(result.typography.fontFamily).toBe('Inter');
      expect(result.layout.sidebarWidth).toBe(240);
      expect(result.animations.enabled).toBe(true);
    });
  });

  describe('updateUserPreferences', () => {
    it('should merge updated preferences and timestamp', async () => {
      const updates = { theme: { mode: 'dark' } };
      const result = await service.updateUserPreferences(42, updates);

      expect(result.message).toContain('Đã cập nhật preferences');
      expect(result.preferences.theme.mode).toBe('dark');
      expect(result.preferences.userId).toBe(42);
      expect(result.preferences.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('resetToDefaults', () => {
    it('should reset preferences to default settings', async () => {
      const result = await service.resetToDefaults(42);

      expect(result.message).toContain('Đã đặt lại giao diện mặc định');
      expect(result.preferences.theme.mode).toBe('light');
      expect(result.preferences.userId).toBe(42);
    });
  });

  describe('getAvailableThemes', () => {
    it('should return available themes list', async () => {
      const result = await service.getAvailableThemes();

      expect(result.themes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'light' }),
          expect.objectContaining({ id: 'dark' }),
          expect.objectContaining({ id: 'high-contrast' }),
        ])
      );
    });
  });

  describe('getAvailableColors', () => {
    it('should return palette colors with hex ids', async () => {
      const result = await service.getAvailableColors();

      expect(result.colors.length).toBeGreaterThan(0);
      expect(result.colors[0]).toHaveProperty('preview');
    });
  });

  describe('getAvailableFonts', () => {
    it('should return supported Google fonts', async () => {
      const result = await service.getAvailableFonts();

      expect(result.fonts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: 'Inter' }),
          expect.objectContaining({ id: 'Roboto' }),
        ])
      );
    });
  });

  describe('getAvailableLayouts', () => {
    it('should return sidebar positions and content widths', async () => {
      const result = await service.getAvailableLayouts();

      expect(result.sidebarPositions.length).toBe(4);
      expect(result.contentWidths.length).toBe(4);
    });
  });
});
