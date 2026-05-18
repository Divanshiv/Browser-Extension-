import { render, screen, fireEvent } from "@testing-library/react";
import { Todo } from "./Todo";

describe("Todo Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders an input field", () => {
    render(<Todo />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("adds a todo on form submit", () => {
    render(<Todo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Buy groceries" } });

    const form = input.closest("form");
    fireEvent.submit(form);

    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
  });

  it("persists todo to localStorage", () => {
    render(<Todo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Persist me" } });
    fireEvent.submit(input.closest("form"));

    const saved = JSON.parse(localStorage.getItem("todo"));
    expect(saved).toHaveLength(1);
    expect(saved[0].todo).toBe("Persist me");
    expect(saved[0].isCompleted).toBe(false);
    expect(saved[0].id).toBeDefined();
  });

  it("trims whitespace from todo", () => {
    render(<Todo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "  Spaced Task  " } });
    fireEvent.submit(input.closest("form"));

    expect(screen.getByText("Spaced Task")).toBeInTheDocument();
  });

  it("does not add empty todos", () => {
    render(<Todo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(input.closest("form"));

    // localStorage should still be null since nothing was written
    expect(localStorage.getItem("todo")).toBeNull();
  });

  it("toggles todo completion status", () => {
    render(<Todo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Toggle me" } });
    fireEvent.submit(input.closest("form"));

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    const saved = JSON.parse(localStorage.getItem("todo"));
    expect(saved[0].isCompleted).toBe(true);
  });

  it("deletes a todo", () => {
    render(<Todo />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Delete me" } });
    fireEvent.submit(input.closest("form"));

    expect(screen.getByText("Delete me")).toBeInTheDocument();

    const deleteBtn = screen.getByText("clear");
    fireEvent.click(deleteBtn);

    expect(screen.queryByText("Delete me")).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("todo"))).toHaveLength(0);
  });

  it("loads existing todos from localStorage on mount", () => {
    const existingTodos = [
      { id: "1", todo: "Pre-existing task", isCompleted: false },
    ];
    localStorage.setItem("todo", JSON.stringify(existingTodos));

    render(<Todo />);
    expect(screen.getByText("Pre-existing task")).toBeInTheDocument();
  });
});
