import { Test, TestingModule } from '@nestjs/testing';
import { WebVitalsController } from './web-vitals.controller';
import { WebVitalsService, WebVitalsMetric } from './web-vitals.service';

describe('WebVitalsController', () => {
  let controller: WebVitalsController;
  let service: jest.Mocked<WebVitalsService>;

  const mockService = {
    recordMetric: jest.fn(),
    getMetrics: jest.fn(),
    getAverageMetrics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebVitalsController],
      providers: [
        {
          provide: WebVitalsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<WebVitalsController>(WebVitalsController);
    service = module.get(WebVitalsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('recordMetric', () => {
    it('should call service.recordMetric and return success true', () => {
      const metric: WebVitalsMetric = {
        name: 'CLS',
        value: 0.05,
        id: 'metric-1',
        delta: 0.05,
        rating: 'good',
      };

      const result = controller.recordMetric(metric);

      expect(service.recordMetric).toHaveBeenCalledWith(metric);
      expect(result).toEqual({ success: true });
    });
  });

  describe('getMetrics', () => {
    it('should return metrics list from service', () => {
      mockService.getMetrics.mockReturnValue([]);

      const result = controller.getMetrics();

      expect(service.getMetrics).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getAverageMetrics', () => {
    it('should return average metrics from service', () => {
      const averages = { LCP: 1500, FID: 45 };
      mockService.getAverageMetrics.mockReturnValue(averages);

      const result = controller.getAverageMetrics();

      expect(service.getAverageMetrics).toHaveBeenCalled();
      expect(result).toEqual(averages);
    });
  });
});
