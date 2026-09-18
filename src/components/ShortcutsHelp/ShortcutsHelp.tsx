import type { ReactNode } from "react";
import "./ShortcutsHelp.css";

interface ShortcutsHelpProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  keys: string;
  action: string;
}

const SHORTCUTS: ShortcutRow[] = [
  { keys: "Cmd/Ctrl + K", action: "Focus main task input" },
  { keys: "Cmd/Ctrl + T", action: "Toggle Todo list" },
  { keys: "Cmd/Ctrl + N", action: "Toggle Scratchpad" },
  { keys: "Cmd/Ctrl + Shift + T", action: "Cycle theme" },
  { keys: "Cmd/Ctrl + P", action: "Start Pomodoro" },
  { keys: "Cmd/Ctrl + Shift + E", action: "Export data" },
  { keys: "Cmd/Ctrl + Shift + I", action: "Import data" },
  { keys: "Shift + ?", action: "Show this help" },
  { keys: "Esc", action: "Blur active input" },
];

export const ShortcutsHelp = ({ open, onClose }: ShortcutsHelpProps) => {
  if (!open) return null;

  const rows: Array<ReactNode> = SHORTCUTS.map((shortcut) => (
    <div key={shortcut.keys} className="shortcuts-row">
      <kbd className="shortcuts-keys">{shortcut.keys}</kbd>
      <span className="shortcuts-action">{shortcut.action}</span>
    </div>
  ));

  return (
    <div
      className="shortcuts-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      onClick={onClose}
    >
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h3>Keyboard Shortcuts</h3>
          <button
            className="shortcuts-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="shortcuts-list">{rows}</div>
        <button className="shortcuts-done" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ShortcutsHelp;
