import { useState, useCallback, useRef, type ChangeEvent } from "react";
import {
  useSettings,
  type Theme,
  type BackgroundType,
} from "../../context/settings-context";
import { useBrowser } from "../../context/browser-context";
import "./DataManager.css";

interface ExportData {
  version: string;
  timestamp: string;
  settings: {
    theme: Theme;
    backgroundType: BackgroundType;
    customBackgroundUrl: string;
    pomodoroWorkDuration: number;
    pomodoroBreakDuration: number;
    pomodoroLongBreakDuration: number;
    pomodoroSessionsBeforeLongBreak: number;
    shortcutsEnabled: boolean;
  };
  browser: {
    name: string;
    task: string | null;
  };
  todos: Array<{ id: string; todo: string; isCompleted: boolean }>;
  scratchpad: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const THEMES: Theme[] = ["dark", "light", "sepia", "high-contrast"];
const BACKGROUND_TYPES: BackgroundType[] = ["picsum", "custom"];

function isValidExport(data: unknown): data is ExportData {
  if (!isRecord(data)) return false;
  if (typeof data.version !== "string" || typeof data.timestamp !== "string") {
    return false;
  }

  const settings = data.settings;
  if (!isRecord(settings)) return false;
  if (
    typeof settings.theme !== "string" ||
    !THEMES.includes(settings.theme as Theme)
  ) {
    return false;
  }
  if (
    typeof settings.backgroundType !== "string" ||
    !BACKGROUND_TYPES.includes(settings.backgroundType as BackgroundType)
  ) {
    return false;
  }
  if (typeof settings.customBackgroundUrl !== "string") return false;
  if (typeof settings.pomodoroWorkDuration !== "number") return false;
  if (typeof settings.pomodoroBreakDuration !== "number") return false;
  if (typeof settings.pomodoroLongBreakDuration !== "number") return false;
  if (typeof settings.pomodoroSessionsBeforeLongBreak !== "number")
    return false;
  if (typeof settings.shortcutsEnabled !== "boolean") return false;

  if (!isRecord(data.browser)) return false;
  if (typeof data.browser.name !== "string") return false;
  if (data.browser.task !== null && typeof data.browser.task !== "string")
    return false;

  if (!Array.isArray(data.todos)) return false;
  const todosValid = data.todos.every((item) => {
    return (
      isRecord(item) &&
      typeof item.id === "string" &&
      typeof item.todo === "string" &&
      typeof item.isCompleted === "boolean"
    );
  });
  if (!todosValid) return false;

  if (typeof data.scratchpad !== "string") return false;

  return true;
}

export const DataManager = ({ onClose }: { onClose: () => void }) => {
  const { settings, dispatch: settingsDispatch } = useSettings();
  const { name, task, browserDispatch } = useBrowser();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    if (messageTimerRef.current) {
      clearTimeout(messageTimerRef.current);
    }
    setMessage({ type, text });
    messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
  }, []);

  const collectData = useCallback((): ExportData => {
    let todos: ExportData["todos"] = [];
    let scratchpad = "";
    try {
      const storedTodos = localStorage.getItem("todo");
      if (storedTodos) todos = JSON.parse(storedTodos);
      scratchpad = localStorage.getItem("scratchpad") ?? "";
    } catch {
      // ignore
    }
    return {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      settings: {
        theme: settings.theme,
        backgroundType: settings.backgroundType,
        customBackgroundUrl: settings.customBackgroundUrl,
        pomodoroWorkDuration: settings.pomodoroWorkDuration,
        pomodoroBreakDuration: settings.pomodoroBreakDuration,
        pomodoroLongBreakDuration: settings.pomodoroLongBreakDuration,
        pomodoroSessionsBeforeLongBreak:
          settings.pomodoroSessionsBeforeLongBreak,
        shortcutsEnabled: settings.shortcutsEnabled,
      },
      browser: { name, task },
      todos,
      scratchpad,
    };
  }, [settings, name, task]);

  const handleExport = useCallback(() => {
    try {
      const data = collectData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `daily-focus-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showMessage("success", "Data exported successfully!");
    } catch {
      showMessage("error", "Failed to export data");
    }
  }, [collectData, showMessage]);

  const handleImport = useCallback(() => {
    try {
      const data: ExportData = JSON.parse(importText);
      if (!isValidExport(data)) throw new Error("Invalid format");

      // Import settings
      settingsDispatch({ type: "SET_THEME", payload: data.settings.theme });
      settingsDispatch({
        type: "SET_BACKGROUND_TYPE",
        payload: data.settings.backgroundType,
      });
      settingsDispatch({
        type: "SET_CUSTOM_BACKGROUND",
        payload: data.settings.customBackgroundUrl,
      });
      settingsDispatch({
        type: "SET_POMODORO_WORK",
        payload: data.settings.pomodoroWorkDuration,
      });
      settingsDispatch({
        type: "SET_POMODORO_BREAK",
        payload: data.settings.pomodoroBreakDuration,
      });
      settingsDispatch({
        type: "SET_POMODORO_LONG_BREAK",
        payload: data.settings.pomodoroLongBreakDuration,
      });
      settingsDispatch({
        type: "SET_POMODORO_SESSIONS",
        payload: data.settings.pomodoroSessionsBeforeLongBreak,
      });
      if (data.settings.shortcutsEnabled !== settings.shortcutsEnabled) {
        settingsDispatch({ type: "TOGGLE_SHORTCUTS" });
      }

      // Import browser data
      if (data.browser.name) {
        browserDispatch({ type: "NAME", payload: data.browser.name });
        localStorage.setItem("name", data.browser.name);
      }
      if (data.browser.task) {
        browserDispatch({ type: "TASK", payload: data.browser.task });
        localStorage.setItem("task", data.browser.task);
        localStorage.setItem("date", String(new Date().getDate()));
      }

      // Import todos
      if (data.todos?.length) {
        localStorage.setItem("todo", JSON.stringify(data.todos));
      }

      // Import scratchpad
      localStorage.setItem("scratchpad", data.scratchpad);

      showMessage("success", "Data imported! Reloading...");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      showMessage("error", "Invalid backup file");
    }
  }, [
    importText,
    settings.shortcutsEnabled,
    settingsDispatch,
    browserDispatch,
    showMessage,
  ]);

  const handleFileImport = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setImportText(event.target?.result as string);
      setIsImportOpen(true);
    };
    reader.readAsText(file);
  }, []);

  const confirmClearAll = useCallback(() => {
    try {
      localStorage.clear();
      setIsConfirmOpen(false);
      showMessage("success", "All data cleared. Reloading...");
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      setIsConfirmOpen(false);
      showMessage("error", "Failed to clear data");
    }
  }, [showMessage]);

  return (
    <div className="data-manager">
      <div className="data-manager-header">
        <h3>Data Manager</h3>
        <div className="data-manager-actions">
          <button
            className="data-manager-toggle"
            onClick={() => setIsImportOpen(!isImportOpen)}
            aria-expanded={isImportOpen}
          >
            {isImportOpen ? "Close" : "Import"}
          </button>
          <button
            className="data-manager-toggle"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              width="18"
              height="18"
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
      </div>

      {message && (
        <div className={`data-message data-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="data-actions">
        <button className="data-btn" onClick={handleExport}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export Data
        </button>

        <label className="data-btn data-btn--file">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Import Data
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            hidden
          />
        </label>

        <button
          className="data-btn data-btn--danger"
          onClick={() => setIsConfirmOpen(true)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
          Clear All
        </button>
      </div>

      {isImportOpen && (
        <div className="data-import-panel">
          <label>
            Paste JSON backup:
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"version":"1.0.0","timestamp":"...","settings":{...},"browser":{...},"todos":[...],"scratchpad":"..."}'
              rows={8}
              spellCheck={false}
            />
          </label>
          <div className="data-import-actions">
            <button className="data-btn" onClick={handleImport}>
              Import
            </button>
            <button
              className="data-btn data-btn--secondary"
              onClick={() => setIsImportOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isConfirmOpen && (
        <div
          className="data-confirm-backdrop"
          role="alertdialog"
          aria-modal="true"
          aria-label="Confirm clear all data"
        >
          <div className="data-confirm">
            <p>Delete ALL data? This cannot be undone.</p>
            <div className="data-confirm-actions">
              <button
                className="data-btn data-btn--danger"
                onClick={confirmClearAll}
              >
                Delete
              </button>
              <button
                className="data-btn data-btn--secondary"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManager;
