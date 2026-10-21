import { useCallback, useMemo, useRef, useEffect } from 'react';

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
