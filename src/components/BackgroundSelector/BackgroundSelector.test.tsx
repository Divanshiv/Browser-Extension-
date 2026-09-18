import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsProvider } from "../../context/settings-context";
import { BackgroundSelector } from "./BackgroundSelector";
import { vi } from "vitest";

vi.mock("../../data/images", () => ({
  getRandomImage: () => "https://picsum.photos/seed/mock/1920/1080",
}));

const renderSelector = (onBackgroundChange = vi.fn()) =>
  render(
    <SettingsProvider>
      <BackgroundSelector onBackgroundChange={onBackgroundChange} />
    </SettingsProvider>,
  );

describe("BackgroundSelector", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("does not show panel initially", () => {
    renderSelector();
    expect(
      screen.queryByRole("dialog", { name: /background selector/i }),
    ).not.toBeInTheDocument();
  });

  it("opens panel on toggle click", () => {
    renderSelector();
    fireEvent.click(screen.getByLabelText("Change background"));
    expect(
      screen.getByRole("dialog", { name: /background selector/i }),
    ).toBeInTheDocument();
  });

  it("calls onBackgroundChange with random URL on random button click", () => {
    const onChange = vi.fn();
    renderSelector(onChange);
    fireEvent.click(screen.getByLabelText("Change background"));
    fireEvent.click(screen.getByText("New Random Image"));
    expect(onChange).toHaveBeenCalledWith(
      "https://picsum.photos/seed/mock/1920/1080",
    );
  });

  it("clears customBackgroundUrl when random is clicked", () => {
    localStorage.setItem(
      "settings",
      JSON.stringify({
        backgroundType: "custom",
        customBackgroundUrl: "https://example.com/img.jpg",
      }),
    );
    const onChange = vi.fn();
    renderSelector(onChange);
    fireEvent.click(screen.getByLabelText("Change background"));
    fireEvent.click(screen.getByText("New Random Image"));
    const stored = JSON.parse(localStorage.getItem("settings")!);
    expect(stored.customBackgroundUrl).toBe("");
    expect(stored.backgroundType).toBe("picsum");
  });

  it("selects a preset image", () => {
    const onChange = vi.fn();
    renderSelector(onChange);
    fireEvent.click(screen.getByLabelText("Change background"));
    const presets = screen.getAllByLabelText("Select background");
    fireEvent.click(presets[0]);
    expect(onChange).toHaveBeenCalledWith(
      "https://picsum.photos/seed/mountains/1920/1080",
    );
    const stored = JSON.parse(localStorage.getItem("settings")!);
    expect(stored.backgroundType).toBe("picsum");
    expect(stored.customBackgroundUrl).toBe(
      "https://picsum.photos/seed/mountains/1920/1080",
    );
  });

  it("submits custom URL via form", () => {
    const onChange = vi.fn();
    renderSelector(onChange);
    fireEvent.click(screen.getByLabelText("Change background"));
    const urlInput = screen.getByLabelText("Custom image URL");
    fireEvent.change(urlInput, {
      target: { value: "https://example.com/bg.jpg" },
    });
    fireEvent.submit(urlInput.closest("form")!);
    expect(onChange).toHaveBeenCalledWith("https://example.com/bg.jpg");
    const stored = JSON.parse(localStorage.getItem("settings")!);
    expect(stored.backgroundType).toBe("custom");
    expect(stored.customBackgroundUrl).toBe("https://example.com/bg.jpg");
  });

  it("closes panel when preset is selected", () => {
    renderSelector();
    fireEvent.click(screen.getByLabelText("Change background"));
    const presets = screen.getAllByLabelText("Select background");
    fireEvent.click(presets[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes panel with close button", () => {
    renderSelector();
    fireEvent.click(screen.getByLabelText("Change background"));
    fireEvent.click(screen.getByLabelText("Close"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
