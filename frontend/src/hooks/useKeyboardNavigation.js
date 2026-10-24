import { useEffect, useCallback, useState } from 'react';

export function useKeyboardNavigation(options = {}) {
  const {
    onArrowUp = null,
    onArrowDown = null,
    onArrowLeft = null,
    onArrowRight = null,
    onEnter = null,
    onEscape = null,
    onTab = null,
    enabled = true,
  } = options;

  const handleKeyDown = useCallback(
    (event) => {
      if (!enabled) return;

      switch (event.key) {
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp(event);
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown(event);
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft(event);
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight(event);
          }
          break;
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter(event);
          }
          break;
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape(event);
          }
          break;
        case 'Tab':
          if (onTab) {
            event.preventDefault();
            onTab(event);
          }
          break;
      }
    },
    [enabled, onArrowUp, onArrowDown, onArrowLeft, onArrowRight, onEnter, onEscape, onTab],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { handleKeyDown };
}

export function useKeyboardListNavigation(itemsLength, onSelect) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : itemsLength - 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) => (prev < itemsLength - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
          event.preventDefault();
          onSelect(selectedIndex);
          break;
      }
    },
    [itemsLength, selectedIndex, onSelect],
  );

  return { selectedIndex, setSelectedIndex, handleKeyDown };
}

export function useKeyboardGridNavigation(rows, cols, onSelect) {
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);

  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          setSelectedRow((prev) => (prev > 0 ? prev - 1 : rows - 1));
          break;
        case 'ArrowDown':
          event.preventDefault();
          setSelectedRow((prev) => (prev < rows - 1 ? prev + 1 : 0));
          break;
        case 'ArrowLeft':
          event.preventDefault();
          setSelectedCol((prev) => (prev > 0 ? prev - 1 : cols - 1));
          break;
        case 'ArrowRight':
          event.preventDefault();
          setSelectedCol((prev) => (prev < cols - 1 ? prev + 1 : 0));
          break;
        case 'Enter':
          event.preventDefault();
          onSelect(selectedRow, selectedCol);
          break;
      }
    },
    [rows, cols, selectedRow, selectedCol, onSelect],
  );

  return { selectedRow, selectedCol, setSelectedRow, setSelectedCol, handleKeyDown };
}
