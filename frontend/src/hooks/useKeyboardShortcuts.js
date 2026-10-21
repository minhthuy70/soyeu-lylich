import { useEffect, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  const handleKeyDown = useCallback(
    (e) => {
      const pressedKey = e.key.toLowerCase();
      const hasModifier = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;

      for (const shortcut of shortcuts) {
        const shortcutKey = shortcut.key.toLowerCase();
        const shortcutModifiers = {
          ctrl: shortcut.ctrl || false,
          meta: shortcut.meta || false,
          shift: shortcut.shift || false,
          alt: shortcut.alt || false,
        };

        if (
          pressedKey === shortcutKey &&
          e.ctrlKey === shortcutModifiers.ctrl &&
          e.metaKey === shortcutModifiers.meta &&
          e.shiftKey === shortcutModifiers.shift &&
          e.altKey === shortcutModifiers.alt
        ) {
          e.preventDefault();
          shortcut.callback();
          break;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
