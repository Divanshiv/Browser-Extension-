import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsProvider } from "../../context/settings-context";
import { ThemeToggle } from "./ThemeToggle";

const renderToggle = () =>
  render(
    <SettingsProvider>
      <ThemeToggle />
    </SettingsProvider>,
  );

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders with default dark theme", () => {
    renderToggle();
    const btn = screen.getByRole("button", { name: /Switch to Light mode/ });
    expect(btn).toBeInTheDocument();
  });

  it("cycles to light theme on click", () => {
    renderToggle();
    const btn = screen.getByRole("button", { name: /Switch to Light mode/ });
    fireEvent.click(btn);
    expect(
      screen.getByRole("button", { name: /Switch to Sepia mode/ }),
    ).toBeInTheDocument();
  });

  it("cycles through all themes and back to dark", () => {
    renderToggle();
    const click = (label: RegExp) =>
      fireEvent.click(screen.getByRole("button", { name: label }));

    click(/Switch to Light/);
    click(/Switch to Sepia/);
    click(/Switch to High Contrast/);
    click(/Switch to Dark/);

    expect(
      screen.getByRole("button", { name: /Switch to Light mode/ }),
    ).toBeInTheDocument();
  });

  it("persists theme to localStorage", () => {
    renderToggle();
    fireEvent.click(
      screen.getByRole("button", { name: /Switch to Light mode/ }),
    );
    const stored = JSON.parse(localStorage.getItem("settings")!);
    expect(stored.theme).toBe("light");
  });

  it("reads persisted theme on mount", () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ theme: "sepia", backgroundType: "picsum" }),
    );
    renderToggle();
    expect(
      screen.getByRole("button", { name: /Switch to High Contrast mode/ }),
    ).toBeInTheDocument();
  });
});
