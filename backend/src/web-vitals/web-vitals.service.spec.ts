import { Test, TestingModule } from '@nestjs/testing';
import { WebVitalsService, WebVitalsMetric } from './web-vitals.service';

describe('WebVitalsService', () => {
  let service: WebVitalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebVitalsService],
    }).compile();

    service = module.get<WebVitalsService>(WebVitalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should initialize without error', () => {
      expect(() => service.onModuleInit()).not.toThrow();
    });
  });

  describe('recordMetric', () => {
    it('should assign "good" rating when metric is below good threshold', () => {
      const metric: WebVitalsMetric = {
        name: 'LCP',
        value: 1200,
        id: 'v1',
        delta: 1200,
        rating: 'good',
      };

      service.recordMetric(metric);
      const metrics = service.getMetrics();

      expect(metrics).toHaveLength(1);
      expect(metrics[0].rating).toBe('good');
    });

    it('should assign "needs-improvement" rating when value is between good and poor', () => {
      const metric: WebVitalsMetric = {
        name: 'LCP',
        value: 3000,
        id: 'v2',
        delta: 3000,
        rating: 'good',
      };

      service.recordMetric(metric);
      const metrics = service.getMetrics();

      expect(metrics[0].rating).toBe('needs-improvement');
    });

    it('should assign "poor" rating when value is above poor threshold', () => {
      const metric: WebVitalsMetric = {
        name: 'LCP',
        value: 5000,
        id: 'v3',
        delta: 5000,
        rating: 'good',
      };

      service.recordMetric(metric);
      const metrics = service.getMetrics();

      expect(metrics[0].rating).toBe('poor');
    });

    it('should default to "good" for unknown metric names', () => {
      const metric: WebVitalsMetric = {
        name: 'CUSTOM_METRIC',
        value: 99999,
        id: 'v4',
        delta: 99999,
        rating: 'poor',
      };

      service.recordMetric(metric);
      const metrics = service.getMetrics();

      expect(metrics[0].rating).toBe('good');
    });
  });

  describe('getAverageMetrics', () => {
    it('should calculate arithmetic mean for each metric type', () => {
      service.recordMetric({ name: 'FID', value: 50, id: '1', delta: 50, rating: 'good' });
      service.recordMetric({ name: 'FID', value: 150, id: '2', delta: 150, rating: 'good' });
      service.recordMetric({ name: 'CLS', value: 0.1, id: '3', delta: 0.1, rating: 'good' });

      const averages = service.getAverageMetrics();

      expect(averages.FID).toBe(100);
      expect(averages.CLS).toBe(0.1);
    });

    it('should return empty object when no metrics recorded', () => {
      expect(service.getAverageMetrics()).toEqual({});
    });
  });
});
