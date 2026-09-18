import { render, screen, fireEvent, act } from "@testing-library/react";
import { SettingsProvider } from "../../context/settings-context";
import { Pomodoro } from "./Pomodoro";

const WORK_SECONDS = 3;
const BREAK_SECONDS = 2;
const SESSIONS = 2;

const renderPomodoro = (onClose = vi.fn()) => {
  localStorage.setItem(
    "settings",
    JSON.stringify({
      theme: "dark",
      backgroundType: "picsum",
      customBackgroundUrl: "",
      pomodoroWorkDuration: WORK_SECONDS,
      pomodoroBreakDuration: BREAK_SECONDS,
      pomodoroLongBreakDuration: 2,
      pomodoroSessionsBeforeLongBreak: SESSIONS,
      shortcutsEnabled: true,
    }),
  );
  return render(
    <SettingsProvider>
      <Pomodoro onClose={onClose} />
    </SettingsProvider>,
  );
};

describe("Pomodoro", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders idle state with label and start button", () => {
    renderPomodoro();
    expect(screen.getByText("Pomodoro")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start Pomodoro" }),
    ).toBeInTheDocument();
  });

  it("starts work session on click", () => {
    renderPomodoro();
    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));
    expect(screen.getByText("Focus")).toBeInTheDocument();
    expect(screen.getByLabelText("Pause")).toBeInTheDocument();
  });

  it("transitions from work to break after timer completes", () => {
    renderPomodoro();
    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));

    act(() => {
      vi.advanceTimersByTime(WORK_SECONDS * 1000);
    });

    expect(screen.getByText("Short Break")).toBeInTheDocument();
  });

  it("transitions from break back to work", () => {
    renderPomodoro();
    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));

    // Work session complete -> break (must resume manually)
    act(() => {
      vi.advanceTimersByTime(WORK_SECONDS * 1000);
    });
    expect(screen.getByText("Short Break")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Resume"));

    // Break complete -> work
    act(() => {
      vi.advanceTimersByTime(BREAK_SECONDS * 1000);
    });
    expect(screen.getByText("Focus")).toBeInTheDocument();
  });

  it("pauses and resumes the timer", () => {
    renderPomodoro();
    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.click(screen.getByLabelText("Pause"));
    expect(screen.getByLabelText("Resume")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Resume"));
    expect(screen.getByLabelText("Pause")).toBeInTheDocument();
  });

  it("resets to idle state", () => {
    renderPomodoro();
    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));
    fireEvent.click(screen.getByLabelText("Reset timer"));
    expect(screen.getByText("Pomodoro")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start Pomodoro" }),
    ).toBeInTheDocument();
  });

  it("skips current session", () => {
    renderPomodoro();
    fireEvent.click(screen.getByRole("button", { name: "Start Pomodoro" }));
    fireEvent.click(screen.getByLabelText("Skip session"));
    expect(screen.getByText("Short Break")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderPomodoro(onClose);
    fireEvent.click(screen.getByLabelText("Close Pomodoro"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("renders session dots", () => {
    renderPomodoro();
    const dots = document.querySelectorAll(".pomodoro-session-dot");
    expect(dots).toHaveLength(SESSIONS);
  });
});
