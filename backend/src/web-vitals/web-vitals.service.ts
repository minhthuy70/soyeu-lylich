import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';

export interface WebVitalsMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

@Injectable()
export class WebVitalsService implements OnModuleInit {
  private metrics: WebVitalsMetric[] = [];
  private thresholds = {
    LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
    FID: { good: 100, poor: 300 }, // First Input Delay
    CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
    FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
    TTFB: { good: 800, poor: 1800 }, // Time to First Byte
  };

  onModuleInit() {
    // This would typically receive metrics from the frontend
    console.log('Web Vitals monitoring initialized');
  }

  recordMetric(metric: WebVitalsMetric) {
    const rating = this.calculateRating(metric.name, metric.value);
    this.metrics.push({ ...metric, rating });

    // Log poor metrics for investigation
    if (rating === 'poor') {
      console.warn(`Poor ${metric.name}: ${metric.value}ms`, metric);
    }

    // Store in database for analytics
    // await this.prisma.webVital.create({ data: metric });
  }

  private calculateRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const threshold = this.thresholds[name as keyof typeof this.thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  getMetrics() {
    return this.metrics;
  }

  getAverageMetrics() {
    const averages: Record<string, number> = {};
    const grouped: Record<string, number[]> = {};

    this.metrics.forEach((metric) => {
      if (!grouped[metric.name]) grouped[metric.name] = [];
      grouped[metric.name].push(metric.value);
    });

    Object.keys(grouped).forEach((name) => {
      const values = grouped[name];
      averages[name] = values.reduce((a, b) => a + b, 0) / values.length;
    });

    return averages;
  }
}
