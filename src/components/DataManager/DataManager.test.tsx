import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsProvider } from "../../context/settings-context";
import { BrowserProvider } from "../../context/browser-context";
import { DataManager } from "./DataManager";
import { vi } from "vitest";

vi.stubGlobal(
  "URL",
  Object.assign(URL, {
    createObjectURL: vi.fn(() => "blob:mock"),
    revokeObjectURL: vi.fn(),
  }),
);

vi.stubGlobal(
  "Notification",
  class {
    static permission = "granted";
    constructor() {}
  },
);

const mockReload = vi.fn();
Object.defineProperty(window, "location", {
  configurable: true,
  value: { ...window.location, reload: mockReload },
});

const renderManager = (onClose = vi.fn()) =>
  render(
    <BrowserProvider>
      <SettingsProvider>
        <DataManager onClose={onClose} />
      </SettingsProvider>
    </BrowserProvider>,
  );

const validBackup = {
  version: "1.0.0",
  timestamp: "2026-01-01T00:00:00Z",
  settings: {
    theme: "light",
    backgroundType: "picsum",
    customBackgroundUrl: "",
    pomodoroWorkDuration: 25 * 60,
    pomodoroBreakDuration: 5 * 60,
    pomodoroLongBreakDuration: 15 * 60,
    pomodoroSessionsBeforeLongBreak: 4,
    shortcutsEnabled: true,
  },
  browser: { name: "TestUser", task: "Ship feature" },
  todos: [{ id: "1", todo: "Test todo", isCompleted: false }],
  scratchpad: "Note content",
};

describe("DataManager", () => {
  beforeEach(() => {
    localStorage.clear();
    mockReload.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders header and action buttons", () => {
    renderManager();
    expect(screen.getByText("Data Manager")).toBeInTheDocument();
    expect(screen.getByText("Export Data")).toBeInTheDocument();
    expect(screen.getByText("Import Data")).toBeInTheDocument();
    expect(screen.getByText("Clear All")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderManager(onClose);
    fireEvent.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("exports data successfully", () => {
    renderManager();
    const anchor = { href: "", click: vi.fn() };
    const realCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation(
      (tagName: string, options?: ElementCreationOptions) => {
        if (tagName === "a") return anchor as unknown as HTMLElement;
        return realCreateElement(tagName, options);
      },
    );

    fireEvent.click(screen.getByText("Export Data"));
    expect(anchor.click).toHaveBeenCalledOnce();
    expect(screen.getByText("Data exported successfully!")).toBeInTheDocument();
  });

  it("opens and closes import panel", () => {
    renderManager();
    fireEvent.click(screen.getByText("Import"));
    expect(screen.getByText("Paste JSON backup:")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("Paste JSON backup:")).not.toBeInTheDocument();
  });

  it("imports valid backup data", () => {
    renderManager();
    fireEvent.click(screen.getByText("Import"));
    const textarea = screen.getByPlaceholderText(/\{"version"/);
    fireEvent.change(textarea, {
      target: { value: JSON.stringify(validBackup) },
    });
    fireEvent.click(screen.getByText("Import"));
    expect(screen.getByText("Data imported! Reloading...")).toBeInTheDocument();
  });

  it("shows error for invalid backup data", () => {
    renderManager();
    fireEvent.click(screen.getByText("Import"));
    const textarea = screen.getByPlaceholderText(/\{"version"/);
    fireEvent.change(textarea, { target: { value: "not json" } });
    fireEvent.click(screen.getByText("Import"));
    expect(screen.getByText("Invalid backup file")).toBeInTheDocument();
  });

  it("shows error for structurally invalid backup", () => {
    renderManager();
    fireEvent.click(screen.getByText("Import"));
    const textarea = screen.getByPlaceholderText(/\{"version"/);
    fireEvent.change(textarea, {
      target: { value: JSON.stringify({ version: "1.0.0" }) },
    });
    fireEvent.click(screen.getByText("Import"));
    expect(screen.getByText("Invalid backup file")).toBeInTheDocument();
  });

  it("shows confirm dialog when Clear All is clicked", () => {
    renderManager();
    fireEvent.click(screen.getByText("Clear All"));
    expect(
      screen.getByText("Delete ALL data? This cannot be undone."),
    ).toBeInTheDocument();
  });

  it("closes confirm dialog on Cancel", () => {
    renderManager();
    fireEvent.click(screen.getByText("Clear All"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByText("Delete ALL data? This cannot be undone."),
    ).not.toBeInTheDocument();
  });
});
