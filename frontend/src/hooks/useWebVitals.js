import { useEffect } from 'react';

export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    const reportWebVital = (metric) => {
      const value = metric.value;
      const name = metric.name;

      // Send to backend
      fetch('/api/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          value,
          id: metric.id,
          delta: metric.delta,
          rating: metric.rating,
        }),
      }).catch((err) => console.error('Failed to report web vital:', err));

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Web Vitals] ${name}:`, value, metric);
      }
    };

    // Report LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          reportWebVital({
            name: 'LCP',
            value: lastEntry.startTime,
            id: 'lcp',
            delta: 0,
            rating: 'good',
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // Report FID (First Input Delay)
    if ('PerformanceObserver' in window) {
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            reportWebVital({
              name: 'FID',
              value: entry.processingStart - entry.startTime,
              id: 'fid',
              delta: entry.duration,
              rating: 'good',
            });
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }

    // Report CLS (Cumulative Layout Shift)
    if ('PerformanceObserver' in window) {
      try {
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          let clsValue = 0;
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          reportWebVital({
            name: 'CLS',
            value: clsValue,
            id: 'cls',
            delta: clsValue,
            rating: 'good',
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }

    // Report FCP (First Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0];
          reportWebVital({
            name: 'FCP',
            value: firstEntry.startTime,
            id: 'fcp',
            delta: 0,
            rating: 'good',
          });
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP observer not supported');
      }
    }
  }, []);
}
