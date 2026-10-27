import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;
  let service: jest.Mocked<DashboardService>;

  const mockDashboardService = {
    getActivityFeed: jest.fn(),
    getResumeViewStatistics: jest.fn(),
    getTopViewedSections: jest.fn(),
    getCompletionSuggestions: jest.fn(),
    getCompletionScore: jest.fn(),
    getDashboardOverview: jest.fn(),
    getUpcomingCertificateExpiry: jest.fn(),
    getVisitorGeography: jest.fn(),
    getDeviceBreakdown: jest.fn(),
    getReferralSources: jest.fn(),
    getSectionCompletionStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        {
          provide: DashboardService,
          useValue: mockDashboardService,
        },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    service = module.get(DashboardService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getActivityFeed', () => {
    it('should call service.getActivityFeed with parsed userId and default limit', async () => {
      const mockResult = [{ id: 1, action: 'CREATE_RESUME' }];
      mockDashboardService.getActivityFeed.mockResolvedValue(mockResult as any);

      const result = await controller.getActivityFeed('5');

      expect(service.getActivityFeed).toHaveBeenCalledWith(5, 20);
      expect(result).toEqual(mockResult);
    });

    it('should call service.getActivityFeed with custom limit', async () => {
      mockDashboardService.getActivityFeed.mockResolvedValue([] as any);

      await controller.getActivityFeed('5', '10');

      expect(service.getActivityFeed).toHaveBeenCalledWith(5, 10);
    });
  });

  describe('getResumeViewStatistics', () => {
    it('should call service.getResumeViewStatistics with default period', async () => {
      const mockStats = { views: 100, uniqueVisitors: 50 };
      mockDashboardService.getResumeViewStatistics.mockResolvedValue(mockStats as any);

      const result = await controller.getResumeViewStatistics('10');

      expect(service.getResumeViewStatistics).toHaveBeenCalledWith(10, 'month');
      expect(result).toEqual(mockStats);
    });

    it('should call service.getResumeViewStatistics with specified period', async () => {
      mockDashboardService.getResumeViewStatistics.mockResolvedValue({} as any);

      await controller.getResumeViewStatistics('10', 'week');

      expect(service.getResumeViewStatistics).toHaveBeenCalledWith(10, 'week');
    });
  });

  describe('getTopViewedSections', () => {
    it('should call service.getTopViewedSections with default limit', async () => {
      mockDashboardService.getTopViewedSections.mockResolvedValue([] as any);

      await controller.getTopViewedSections('12');

      expect(service.getTopViewedSections).toHaveBeenCalledWith(12, 10);
    });

    it('should call service.getTopViewedSections with custom limit', async () => {
      mockDashboardService.getTopViewedSections.mockResolvedValue([] as any);

      await controller.getTopViewedSections('12', '5');

      expect(service.getTopViewedSections).toHaveBeenCalledWith(12, 5);
    });
  });

  describe('getCompletionSuggestions', () => {
    it('should call service.getCompletionSuggestions', async () => {
      const suggestions = ['Add skills', 'Upload avatar'];
      mockDashboardService.getCompletionSuggestions.mockResolvedValue(suggestions as any);

      const result = await controller.getCompletionSuggestions('3');

      expect(service.getCompletionSuggestions).toHaveBeenCalledWith(3);
      expect(result).toEqual(suggestions);
    });
  });

  describe('getCompletionScore', () => {
    it('should call service.getCompletionScore', async () => {
      mockDashboardService.getCompletionScore.mockResolvedValue({ score: 85 } as any);

      const result = await controller.getCompletionScore('3');

      expect(service.getCompletionScore).toHaveBeenCalledWith(3);
      expect(result).toEqual({ score: 85 });
    });
  });

  describe('getDashboardOverview', () => {
    it('should call service.getDashboardOverview', async () => {
      const overview = { totalResumes: 2, totalViews: 40 };
      mockDashboardService.getDashboardOverview.mockResolvedValue(overview as any);

      const result = await controller.getDashboardOverview('7');

      expect(service.getDashboardOverview).toHaveBeenCalledWith(7);
      expect(result).toEqual(overview);
    });
  });

  describe('getUpcomingCertificateExpiry', () => {
    it('should call service.getUpcomingCertificateExpiry with default days', async () => {
      mockDashboardService.getUpcomingCertificateExpiry.mockResolvedValue([] as any);

      await controller.getUpcomingCertificateExpiry('7');

      expect(service.getUpcomingCertificateExpiry).toHaveBeenCalledWith(7, 30);
    });

    it('should call service.getUpcomingCertificateExpiry with custom days', async () => {
      mockDashboardService.getUpcomingCertificateExpiry.mockResolvedValue([] as any);

      await controller.getUpcomingCertificateExpiry('7', '60');

      expect(service.getUpcomingCertificateExpiry).toHaveBeenCalledWith(7, 60);
    });
  });

  describe('getVisitorGeography', () => {
    it('should call service.getVisitorGeography', async () => {
      mockDashboardService.getVisitorGeography.mockResolvedValue([] as any);

      await controller.getVisitorGeography('2', 'year');

      expect(service.getVisitorGeography).toHaveBeenCalledWith(2, 'year');
    });
  });

  describe('getDeviceBreakdown', () => {
    it('should call service.getDeviceBreakdown', async () => {
      mockDashboardService.getDeviceBreakdown.mockResolvedValue({ desktop: 60, mobile: 40 } as any);

      const result = await controller.getDeviceBreakdown('2', 'month');

      expect(service.getDeviceBreakdown).toHaveBeenCalledWith(2, 'month');
      expect(result).toEqual({ desktop: 60, mobile: 40 });
    });
  });

  describe('getReferralSources', () => {
    it('should call service.getReferralSources', async () => {
      mockDashboardService.getReferralSources.mockResolvedValue([] as any);

      await controller.getReferralSources('2', 'week');

      expect(service.getReferralSources).toHaveBeenCalledWith(2, 'week');
    });
  });

  describe('getSectionCompletionStatus', () => {
    it('should call service.getSectionCompletionStatus', async () => {
      mockDashboardService.getSectionCompletionStatus.mockResolvedValue({ profile: true } as any);

      const result = await controller.getSectionCompletionStatus('8');

      expect(service.getSectionCompletionStatus).toHaveBeenCalledWith(8);
      expect(result).toEqual({ profile: true });
    });
  });
});
