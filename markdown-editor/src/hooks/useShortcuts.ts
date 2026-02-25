import { useEffect, useCallback } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onNew?: () => void;
  onExport?: () => void;
  onImport?: () => void;
  onTogglePreview?: () => void;
  onToggleSidebar?: () => void;
  onSearch?: () => void;
  onBold?: () => void;
  onItalic?: () => void;
  onHeading?: () => void;
  onLink?: () => void;
  onImage?: () => void;
  onCode?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const useShortcuts = (handlers: ShortcutHandlers) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlKey = isMac ? event.metaKey : event.ctrlKey;
    
    if (!ctrlKey) return;
    
    switch (event.key.toLowerCase()) {
      case 's':
        event.preventDefault();
        handlers.onSave?.();
        break;
      case 'n':
        event.preventDefault();
        handlers.onNew?.();
        break;
      case 'e':
        event.preventDefault();
        handlers.onExport?.();
        break;
      case 'o':
        event.preventDefault();
        handlers.onImport?.();
        break;
      case 'p':
        event.preventDefault();
        handlers.onTogglePreview?.();
        break;
      case 'b':
        event.preventDefault();
        handlers.onBold?.();
        break;
      case 'i':
        event.preventDefault();
        handlers.onItalic?.();
        break;
      case 'k':
        event.preventDefault();
        handlers.onLink?.();
        break;
      case 'f':
        event.preventDefault();
        handlers.onSearch?.();
        break;
      case 'z':
        event.preventDefault();
        if (event.shiftKey) {
          handlers.onRedo?.();
        } else {
          handlers.onUndo?.();
        }
        break;
      case 'h':
        event.preventDefault();
        handlers.onHeading?.();
        break;
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
        if (event.altKey) {
          event.preventDefault();
          handlers.onHeading?.();
        }
        break;
    }
  }, [handlers]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
