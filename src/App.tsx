import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import "./App.css";
import { getRandomImage } from "./data/images";
import { Home, Task } from "./pages";
import { useBrowser } from "./context/browser-context";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { useSettings } from "./context/settings-context";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Pomodoro = lazy(() => import("./components/Pomodoro/Pomodoro"));
const DataManager = lazy(() => import("./components/DataManager/DataManager"));
const BackgroundSelector = lazy(
  () => import("./components/BackgroundSelector/BackgroundSelector"),
);
const ShortcutsHelp = lazy(
  () => import("./components/ShortcutsHelp/ShortcutsHelp"),
);

function App() {
  const { name, browserDispatch } = useBrowser();
  const { settings } = useSettings();

  const hasFixedBackground =
    settings.backgroundType === "custom" ||
    (settings.backgroundType === "picsum" &&
      Boolean(settings.customBackgroundUrl));

  const [bgImage, setBgImage] = useState(() => {
    if (hasFixedBackground && settings.customBackgroundUrl) {
      return settings.customBackgroundUrl;
    }
    return getRandomImage();
  });
  const [bgLoaded, setBgLoaded] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showDataManager, setShowDataManager] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);

  const loadImage = useCallback((url: string) => {
    setBgImage(url);
    setBgLoaded(false);
  }, []);

  const refreshBackground = useCallback(() => {
    loadImage(getRandomImage());
  }, [loadImage]);

  useEffect(() => {
    const userName = localStorage.getItem("name") ?? "";
    browserDispatch({
      type: "NAME",
      payload: userName,
    });
  }, [browserDispatch]);

  useEffect(() => {
    if (settings.backgroundType !== "picsum" || settings.customBackgroundUrl) {
      return;
    }
    const intervalId = setInterval(refreshBackground, 60000);
    return () => clearInterval(intervalId);
  }, [
    settings.backgroundType,
    settings.customBackgroundUrl,
    refreshBackground,
  ]);

  const handleFocusTask = useCallback(() => {
    const input = document.querySelector(
      'input[placeholder*="focus" i], input[placeholder*="Focus" i]',
    ) as HTMLInputElement | null;
    input?.focus();
  }, []);

  const handleOpenTodo = useCallback(() => {
    const btn = document.querySelector(
      '[aria-label*="todo" i], [aria-label*="Todo" i]',
    ) as HTMLButtonElement | null;
    btn?.click();
  }, []);

  const handleOpenScratchpad = useCallback(() => {
    const btn = document.querySelector(
      '[aria-label*="scratchpad" i], [aria-label*="Scratchpad" i]',
    ) as HTMLButtonElement | null;
    btn?.click();
  }, []);

  const handleToggleTheme = useCallback(() => {
    const btn = document.querySelector(
      ".theme-toggle",
    ) as HTMLButtonElement | null;
    btn?.click();
  }, []);

  const handleStartPomodoro = useCallback(() => {
    setShowPomodoro(true);
  }, []);

  const handleExportData = useCallback(() => {
    setShowDataManager(true);
  }, []);

  const handleImportData = useCallback(() => {
    setShowDataManager(true);
  }, []);

  const handleShowShortcutsHelp = useCallback(() => {
    setShowShortcutsHelp(true);
  }, []);

  const shortcutHandlers = useMemo(
    () => ({
      onFocusTask: handleFocusTask,
      onOpenTodo: handleOpenTodo,
      onOpenScratchpad: handleOpenScratchpad,
      onToggleTheme: handleToggleTheme,
      onStartPomodoro: handleStartPomodoro,
      onExportData: handleExportData,
      onImportData: handleImportData,
      onShowShortcutsHelp: handleShowShortcutsHelp,
    }),
    [
      handleFocusTask,
      handleOpenTodo,
      handleOpenScratchpad,
      handleToggleTheme,
      handleStartPomodoro,
      handleExportData,
      handleImportData,
      handleShowShortcutsHelp,
    ],
  );

  useKeyboardShortcuts(shortcutHandlers);

  const backgroundUrl =
    hasFixedBackground && settings.customBackgroundUrl
      ? settings.customBackgroundUrl
      : bgImage;

  return (
    <div
      className={`app${bgLoaded ? " app--loaded" : ""}`}
      role="main"
      aria-label="Daily Focus Dashboard"
      style={{ backgroundImage: `url("${backgroundUrl}")` }}
      data-theme={settings.theme}
    >
      <img
        src={backgroundUrl}
        onLoad={() => setBgLoaded(true)}
        onError={() => setBgLoaded(true)}
        style={{ display: "none" }}
        alt=""
        aria-hidden="true"
      />
      <div className="app-header">
        <ThemeToggle />
        <BackgroundSelector onBackgroundChange={loadImage} />
      </div>
      {name ? <Task /> : <Home />}

      <Suspense fallback={null}>
        {showPomodoro && (
          <ErrorBoundary>
            <Pomodoro onClose={() => setShowPomodoro(false)} />
          </ErrorBoundary>
        )}
        {showDataManager && (
          <ErrorBoundary>
            <DataManager onClose={() => setShowDataManager(false)} />
          </ErrorBoundary>
        )}
        <ErrorBoundary>
          <ShortcutsHelp
            open={showShortcutsHelp}
            onClose={() => setShowShortcutsHelp(false)}
          />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
