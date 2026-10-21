import { useEffect, useRef } from 'react';

export function useKeyboardNavigation(onKeyDown, targetElement = document) {
  const callbackRef = useRef(onKeyDown);

  useEffect(() => {
    callbackRef.current = onKeyDown;
  }, [onKeyDown]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (callbackRef.current) {
        callbackRef.current(e);
      }
    };

    targetElement.addEventListener('keydown', handleKeyDown);
    return () => targetElement.removeEventListener('keydown', handleKeyDown);
  }, [targetElement]);
}

export function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        firstElement.focus();
      }
    };

    containerRef.current.addEventListener('keydown', handleTab);
    containerRef.current.addEventListener('keydown', handleEscape);

    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('keydown', handleTab);
        containerRef.current.removeEventListener('keydown', handleEscape);
      }
    };
  }, [isActive]);

  return containerRef;
}
