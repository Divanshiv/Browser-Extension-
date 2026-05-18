import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserProvider } from "../../context/browser-context";
import { Task } from "./Task";

import { vi } from "vitest";

vi.mock("../../data/quotes", () => ({
  quotes: [{ quote: "Test quote one" }, { quote: "Test quote two" }],
}));

const renderTask = () => {
  return render(
    <BrowserProvider>
      <Task />
    </BrowserProvider>,
  );
};

describe("Task Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a motivational quote", () => {
    renderTask();
    expect(screen.getByText(/Test quote/)).toBeInTheDocument();
  });

  it("shows focus input when no task is set", () => {
    renderTask();
    expect(
      screen.getByText("What is your main focus for today?"),
    ).toBeInTheDocument();
  });

  it("shows the ToDo toggle button", () => {
    renderTask();
    expect(screen.getByText("ToDo")).toBeInTheDocument();
  });

  it("shows the footer", () => {
    renderTask();
    expect(screen.getByText(/Made by/)).toBeInTheDocument();
  });

  it("toggles Todo panel when ToDo button is clicked", () => {
    renderTask();
    const todoBtn = screen.getByText("ToDo");

    // Only the task input is visible (Todo panel is hidden)
    expect(screen.queryAllByRole("textbox")).toHaveLength(1);

    // Click to open — Todo input appears (now 2 textboxes)
    fireEvent.click(todoBtn);
    expect(screen.queryAllByRole("textbox")).toHaveLength(2);

    // Click to close — Todo input disappears (back to 1)
    fireEvent.click(todoBtn);
    expect(screen.queryAllByRole("textbox")).toHaveLength(1);
  });

  it("saves task to localStorage on form submit", () => {
    renderTask();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Build something great" } });

    const form = input.closest("form");
    fireEvent.submit(form);

    expect(localStorage.getItem("task")).toBe("Build something great");
  });

  it("shows the daily focus section after task is set", () => {
    renderTask();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Write tests" } });

    const form = input.closest("form");
    fireEvent.submit(form);

    expect(screen.getByText("Today's Focus")).toBeInTheDocument();
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("clears the task when clear button is clicked", () => {
    renderTask();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Temporary task" } });
    fireEvent.submit(input.closest("form"));

    expect(screen.getByText("Temporary task")).toBeInTheDocument();

    const clearBtn = screen.getByText("clear");
    fireEvent.click(clearBtn);

    expect(
      screen.getByText("What is your main focus for today?"),
    ).toBeInTheDocument();
  });
});
