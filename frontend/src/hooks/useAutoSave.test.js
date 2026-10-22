import { renderHook, act } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';

describe('useAutoSave', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should call onSave after delay', () => {
    const onSave = jest.fn();
    const data = { name: 'Test' };

    renderHook(() => useAutoSave(data, onSave, 500));

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onSave).toHaveBeenCalledWith(data);
  });

  it('should debounce multiple changes', () => {
    const onSave = jest.fn();

    const { rerender } = renderHook(
      ({ data, delay }) => useAutoSave(data, onSave, delay),
      {
        initialProps: { data: { name: 'Test' }, delay: 500 },
      },
    );

    rerender({ data: { name: 'Test Updated' }, delay: 500 });
    rerender({ data: { name: 'Test Updated Again' }, delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith({ name: 'Test Updated Again' });
  });

  it('should cleanup on unmount', () => {
    const onSave = jest.fn();
    const data = { name: 'Test' };

    const { unmount } = renderHook(() => useAutoSave(data, onSave, 500));

    unmount();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(onSave).not.toHaveBeenCalled();
  });
});
