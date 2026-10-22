import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockEvent = {
    id: 1,
    userId: 1,
    eventType: 'click',
    page: '/profile',
    element: 'save-button',
    metadata: { section: 'personal-info' },
    timestamp: new Date(),
  };

  const mockPrisma = {
    userBehaviorEvent: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    analyticsSession: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: 'PrismaService',
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('trackEvent', () => {
    it('should create behavior event', async () => {
      const trackDto = {
        userId: 1,
        eventType: 'click',
        page: '/profile',
        element: 'save-button',
        metadata: { section: 'personal-info' },
      };

      mockPrisma.userBehaviorEvent.create.mockResolvedValue(mockEvent);

      const result = await service.trackEvent(trackDto);
      expect(result).toEqual(mockEvent);
      expect(mockPrisma.userBehaviorEvent.create).toHaveBeenCalledWith({
        data: trackDto,
      });
    });
  });

  describe('getBehaviorAnalytics', () => {
    it('should return behavior analytics', async () => {
      const mockEvents = [mockEvent];
      mockPrisma.userBehaviorEvent.findMany.mockResolvedValue(mockEvents);
      mockPrisma.userBehaviorEvent.count.mockResolvedValue(1);

      const result = await service.getBehaviorAnalytics(1, new Date(), new Date());
      expect(result.totalEvents).toBe(1);
      expect(result.events).toEqual(mockEvents);
    });
  });

  describe('getSessionAnalytics', () => {
    it('should return session analytics', async () => {
      const mockSessions = [
        {
          id: 1,
          userId: 1,
          device: 'desktop',
          browser: 'chrome',
          duration: 300,
        },
      ];

      mockPrisma.analyticsSession.findMany.mockResolvedValue(mockSessions);
      mockPrisma.analyticsSession.aggregate.mockResolvedValue({
        _avg: { duration: 300 },
        _count: { id: 1 },
      });

      const result = await service.getSessionAnalytics(1);
      expect(result.totalSessions).toBe(1);
      expect(result.averageDuration).toBe(300);
    });
  });
});
