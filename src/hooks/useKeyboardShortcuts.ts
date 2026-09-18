import { useEffect, useCallback } from "react";
import { useSettings } from "../context/settings-context";

interface ShortcutHandlers {
  onFocusTask?: () => void;
  onOpenTodo?: () => void;
  onOpenScratchpad?: () => void;
  onToggleTheme?: () => void;
  onStartPomodoro?: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
  onShowShortcutsHelp?: () => void;
}

function isMac(): boolean {
  return /(Mac|iPhone|iPad|iPod)/i.test(navigator.userAgent);
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  const { settings } = useSettings();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!settings.shortcutsEnabled) return;

      const modKey = isMac() ? event.metaKey : event.ctrlKey;

      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        if (event.key === "Escape") {
          (event.target as HTMLElement).blur();
        }
        return;
      }

      switch (true) {
        case modKey && event.key === "k":
          event.preventDefault();
          handlers.onFocusTask?.();
          break;
        case modKey && event.key === "t":
          event.preventDefault();
          handlers.onOpenTodo?.();
          break;
        case modKey && event.key === "n":
          event.preventDefault();
          handlers.onOpenScratchpad?.();
          break;
        case modKey && event.shiftKey && event.key === "T":
          event.preventDefault();
          handlers.onToggleTheme?.();
          break;
        case modKey && event.key === "p":
          event.preventDefault();
          handlers.onStartPomodoro?.();
          break;
        case modKey && event.shiftKey && event.key === "E":
          event.preventDefault();
          handlers.onExportData?.();
          break;
        case modKey && event.shiftKey && event.key === "I":
          event.preventDefault();
          handlers.onImportData?.();
          break;
        case event.key === "?":
          event.preventDefault();
          handlers.onShowShortcutsHelp?.();
          break;
      }
    },
    [settings.shortcutsEnabled, handlers],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
