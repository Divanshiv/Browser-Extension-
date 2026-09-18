import { render, screen, fireEvent, act } from "@testing-library/react";
import { Scratchpad } from "./Scratchpad";

describe("Scratchpad", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not show panel initially", () => {
    render(<Scratchpad />);
    expect(
      screen.queryByRole("textbox", { name: /scratchpad/i }),
    ).not.toBeInTheDocument();
  });

  it("opens panel on toggle click", () => {
    render(<Scratchpad />);
    fireEvent.click(screen.getByLabelText("Open scratchpad"));
    expect(
      screen.getByRole("textbox", { name: /scratchpad/i }),
    ).toBeInTheDocument();
  });

  it("closes panel on second toggle click", () => {
    render(<Scratchpad />);
    fireEvent.click(screen.getByLabelText("Open scratchpad"));
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Close scratchpad"));
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("saves content to localStorage after debounce", () => {
    render(<Scratchpad />);
    fireEvent.click(screen.getByLabelText("Open scratchpad"));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Hello notes" },
    });

    expect(localStorage.getItem("scratchpad")).toBeNull();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(localStorage.getItem("scratchpad")).toBe("Hello notes");
  });

  it("loads persisted content on mount", () => {
    localStorage.setItem("scratchpad", "Saved note");
    render(<Scratchpad />);
    fireEvent.click(screen.getByLabelText("Open scratchpad"));
    expect(screen.getByRole("textbox")).toHaveValue("Saved note");
  });

  it("auto-bullets on Enter after dash-space line", () => {
    render(<Scratchpad />);
    fireEvent.click(screen.getByLabelText("Open scratchpad"));
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "- item" } });
    // Simulate cursor at end of "- item"
    textarea.selectionStart = 6;
    textarea.selectionEnd = 6;

    fireEvent.keyDown(textarea, { key: "Enter" });

    // After auto-bullet, content should have a new bullet line
    expect(textarea).toHaveValue("- item\n- ");
  });

  it("shows auto-saved hint", () => {
    render(<Scratchpad />);
    fireEvent.click(screen.getByLabelText("Open scratchpad"));
    expect(screen.getByText("Auto-saved")).toBeInTheDocument();
  });
});
