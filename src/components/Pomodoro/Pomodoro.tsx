import { useState, useEffect, useCallback, useRef } from "react";
import { useSettings } from "../../context/settings-context";
import "./Pomodoro.css";

type PomodoroState = "idle" | "work" | "break" | "long-break";

interface PomodoroProps {
  onClose: () => void;
}

export const Pomodoro = ({ onClose }: PomodoroProps) => {
  const { settings } = useSettings();
  const [state, setState] = useState<PomodoroState>("idle");
  const [timeLeft, setTimeLeft] = useState(settings.pomodoroWorkDuration);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stateRef = useRef(state);
  const completedSessionsRef = useRef(completedSessions);
  const settingsRef = useRef(settings);
  const isRunningRef = useRef(false);
  const completingRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    completedSessionsRef.current = completedSessions;
  }, [completedSessions]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (completingRef.current) return;
    completingRef.current = true;
    clearTimer();
    setIsRunning(false);
    isRunningRef.current = false;

    const currentState = stateRef.current;
    const sessions = completedSessionsRef.current;
    const currentSettings = settingsRef.current;

    if (currentState === "work") {
      const nextSessions = sessions + 1;
      setCompletedSessions(nextSessions);
      if (
        nextSessions % currentSettings.pomodoroSessionsBeforeLongBreak ===
        0
      ) {
        setState("long-break");
        setTimeLeft(currentSettings.pomodoroLongBreakDuration);
      } else {
        setState("break");
        setTimeLeft(currentSettings.pomodoroBreakDuration);
      }
      notify("Work session complete!", "Time for a break");
    } else {
      setState("work");
      setTimeLeft(currentSettings.pomodoroWorkDuration);
      notify("Break complete!", "Ready to focus?");
    }
  }, [clearTimer]);

  const handleCompleteRef = useRef(handleTimerComplete);
  useEffect(() => {
    handleCompleteRef.current = handleTimerComplete;
  }, [handleTimerComplete]);

  const startTimer = useCallback(() => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    completingRef.current = false;
    setIsRunning(true);
    if (stateRef.current === "idle") {
      setState("work");
      setTimeLeft(settingsRef.current.pomodoroWorkDuration);
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleCompleteRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    isRunningRef.current = false;
  }, [clearTimer]);

  const resetTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
    isRunningRef.current = false;
    completingRef.current = false;
    setState("idle");
    setTimeLeft(settingsRef.current.pomodoroWorkDuration);
  }, [clearTimer]);

  const skipSession = useCallback(() => {
    handleTimerComplete();
  }, [handleTimerComplete]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStateLabel = () => {
    switch (state) {
      case "work":
        return "Focus";
      case "break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Pomodoro";
    }
  };

  const getProgress = () => {
    if (state === "idle") return 0;
    const total =
      state === "work"
        ? settings.pomodoroWorkDuration
        : state === "break"
          ? settings.pomodoroBreakDuration
          : settings.pomodoroLongBreakDuration;
    return ((total - timeLeft) / total) * 100;
  };

  if (state === "idle" && !isRunning) {
    return (
      <div className="pomodoro-container">
        <button
          className="pomodoro-close"
          onClick={onClose}
          aria-label="Close Pomodoro"
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
        <div
          className="pomodoro-display"
          role="timer"
          aria-label="Pomodoro timer"
        >
          <svg className="pomodoro-circle" viewBox="0 0 100 100">
            <circle className="pomodoro-bg" cx="50" cy="50" r="45" />
            <circle
              className="pomodoro-progress"
              cx="50"
              cy="50"
              r="45"
              strokeDasharray="283"
              strokeDashoffset="283"
            />
          </svg>
          <span className="pomodoro-time">
            {formatTime(settings.pomodoroWorkDuration)}
          </span>
        </div>
        <div className="pomodoro-label">{getStateLabel()}</div>
        <button
          className="pomodoro-btn pomodoro-btn--start"
          onClick={startTimer}
          aria-label="Start Pomodoro"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="pomodoro-sessions">
          {Array.from(
            { length: settings.pomodoroSessionsBeforeLongBreak },
            (_, i) => (
              <span
                key={i}
                className={`pomodoro-session-dot ${i < completedSessions ? "completed" : ""}`}
              />
            ),
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pomodoro-container">
      <button
        className="pomodoro-close"
        onClick={onClose}
        aria-label="Close Pomodoro"
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
      <div
        className="pomodoro-display"
        role="timer"
        aria-label={`Pomodoro timer: ${formatTime(timeLeft)} remaining`}
      >
        <svg className="pomodoro-circle" viewBox="0 0 100 100">
          <circle className="pomodoro-bg" cx="50" cy="50" r="45" />
          <circle
            className="pomodoro-progress"
            cx="50"
            cy="50"
            r="45"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * getProgress()) / 100}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <span className="pomodoro-time">{formatTime(timeLeft)}</span>
      </div>
      <div className="pomodoro-label">{getStateLabel()}</div>
      <div className="pomodoro-controls">
        <button
          className="pomodoro-btn pomodoro-btn--pause"
          onClick={isRunning ? pauseTimer : startTimer}
          aria-label={isRunning ? "Pause" : "Resume"}
        >
          {isRunning ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          className="pomodoro-btn pomodoro-btn--skip"
          onClick={skipSession}
          aria-label="Skip session"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 18l8.5-6L4 6v12zM13.5 18l8.5-6L13.5 6v12z" />
          </svg>
        </button>
        <button
          className="pomodoro-btn pomodoro-btn--reset"
          onClick={resetTimer}
          aria-label="Reset timer"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
          </svg>
        </button>
      </div>
      <div className="pomodoro-sessions">
        {Array.from(
          { length: settings.pomodoroSessionsBeforeLongBreak },
          (_, i) => (
            <span
              key={i}
              className={`pomodoro-session-dot ${i < completedSessions ? "completed" : i === completedSessions && state !== "idle" ? "current" : ""}`}
            />
          ),
        )}
      </div>
    </div>
  );
};

function notify(title: string, body: string) {
  try {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (
      "Notification" in window &&
      Notification.permission !== "denied"
    ) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    }
  } catch {
    // Notifications unavailable — ignore
  }
}

export default Pomodoro;
