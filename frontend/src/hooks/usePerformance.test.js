import { renderHook } from '@testing-library/react';
import { usePerformance } from './usePerformance';

describe('usePerformance', () => {
  it('should track render count', () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.renderCount).toBe(1);
  });

  it('should track previous value', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePerformance(value),
      {
        initialProps: { value: 'initial' },
      },
    );

    expect(result.current.previousValue).toBe(undefined);

    rerender({ value: 'updated' });

    expect(result.current.previousValue).toBe('initial');
  });

  it('should detect if value changed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => usePerformance(value),
      {
        initialProps: { value: 'initial' },
      },
    );

    expect(result.current.hasChanged).toBe(false);

    rerender({ value: 'updated' });

    expect(result.current.hasChanged).toBe(true);
  });
});
