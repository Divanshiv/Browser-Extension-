import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light" | "sepia" | "high-contrast";
export type BackgroundType = "picsum" | "custom";

export interface SettingsState {
  theme: Theme;
  backgroundType: BackgroundType;
  customBackgroundUrl: string;
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  pomodoroLongBreakDuration: number;
  pomodoroSessionsBeforeLongBreak: number;
  shortcutsEnabled: boolean;
}

export type SettingsAction =
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_BACKGROUND_TYPE"; payload: BackgroundType }
  | { type: "SET_CUSTOM_BACKGROUND"; payload: string }
  | { type: "SET_POMODORO_WORK"; payload: number }
  | { type: "SET_POMODORO_BREAK"; payload: number }
  | { type: "SET_POMODORO_LONG_BREAK"; payload: number }
  | { type: "SET_POMODORO_SESSIONS"; payload: number }
  | { type: "TOGGLE_SHORTCUTS" }
  | { type: "RESET_SETTINGS" };

export const initialSettings: SettingsState = {
  theme: "dark",
  backgroundType: "picsum",
  customBackgroundUrl: "",
  pomodoroWorkDuration: 25 * 60,
  pomodoroBreakDuration: 5 * 60,
  pomodoroLongBreakDuration: 15 * 60,
  pomodoroSessionsBeforeLongBreak: 4,
  shortcutsEnabled: true,
};

const THEMES: Theme[] = ["dark", "light", "sepia", "high-contrast"];
const BACKGROUND_TYPES: BackgroundType[] = ["picsum", "custom"];

const STORAGE_KEY = "settings";

function sanitizeSettings(parsed: unknown): SettingsState {
  const state: SettingsState = { ...initialSettings };
  if (typeof parsed !== "object" || parsed === null) return state;
  const candidate = parsed as Record<string, unknown>;

  if (
    typeof candidate.theme === "string" &&
    THEMES.includes(candidate.theme as Theme)
  ) {
    state.theme = candidate.theme as Theme;
  }
  if (
    typeof candidate.backgroundType === "string" &&
    BACKGROUND_TYPES.includes(candidate.backgroundType as BackgroundType)
  ) {
    state.backgroundType = candidate.backgroundType as BackgroundType;
  }
  if (typeof candidate.customBackgroundUrl === "string") {
    state.customBackgroundUrl = candidate.customBackgroundUrl;
  }
  if (
    typeof candidate.pomodoroWorkDuration === "number" &&
    candidate.pomodoroWorkDuration > 0
  ) {
    state.pomodoroWorkDuration = candidate.pomodoroWorkDuration;
  }
  if (
    typeof candidate.pomodoroBreakDuration === "number" &&
    candidate.pomodoroBreakDuration > 0
  ) {
    state.pomodoroBreakDuration = candidate.pomodoroBreakDuration;
  }
  if (
    typeof candidate.pomodoroLongBreakDuration === "number" &&
    candidate.pomodoroLongBreakDuration > 0
  ) {
    state.pomodoroLongBreakDuration = candidate.pomodoroLongBreakDuration;
  }
  if (
    typeof candidate.pomodoroSessionsBeforeLongBreak === "number" &&
    candidate.pomodoroSessionsBeforeLongBreak > 0
  ) {
    state.pomodoroSessionsBeforeLongBreak =
      candidate.pomodoroSessionsBeforeLongBreak;
  }
  if (typeof candidate.shortcutsEnabled === "boolean") {
    state.shortcutsEnabled = candidate.shortcutsEnabled;
  }
  return state;
}

function loadSettings(): SettingsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return initialSettings;
    return sanitizeSettings(JSON.parse(stored));
  } catch {
    return initialSettings;
  }
}

export const settingsReducer = (
  state: SettingsState,
  action: SettingsAction,
): SettingsState => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_BACKGROUND_TYPE":
      return { ...state, backgroundType: action.payload };
    case "SET_CUSTOM_BACKGROUND":
      return { ...state, customBackgroundUrl: action.payload };
    case "SET_POMODORO_WORK":
      return { ...state, pomodoroWorkDuration: action.payload };
    case "SET_POMODORO_BREAK":
      return { ...state, pomodoroBreakDuration: action.payload };
    case "SET_POMODORO_LONG_BREAK":
      return { ...state, pomodoroLongBreakDuration: action.payload };
    case "SET_POMODORO_SESSIONS":
      return { ...state, pomodoroSessionsBeforeLongBreak: action.payload };
    case "TOGGLE_SHORTCUTS":
      return { ...state, shortcutsEnabled: !state.shortcutsEnabled };
    case "RESET_SETTINGS":
      return initialSettings;
    default:
      return state;
  }
};

const SettingsContext = createContext<{
  settings: SettingsState;
  dispatch: Dispatch<SettingsAction>;
} | null>(null);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, dispatch] = useReducer(
    settingsReducer,
    initialSettings,
    loadSettings,
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
