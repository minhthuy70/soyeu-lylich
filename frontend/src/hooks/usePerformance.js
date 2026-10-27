import { useRef, useEffect } from 'react';

export function useRenderCount() {
  const renderCount = useRef(0);
  renderCount.current += 1;
  return renderCount.current;
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function usePerformance(value) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const previousValueRef = useRef(undefined);
  const previousValue = previousValueRef.current;
  const hasChanged = previousValue !== undefined && previousValue !== value;

  useEffect(() => {
    previousValueRef.current = value;
  });

  return {
    renderCount: renderCount.current,
    previousValue,
    hasChanged,
  };
}
