import "./Home.css";
import { useBrowser } from "../../context/browser-context";
import { useState, type FormEvent } from "react";

export const Home = () => {
  const { browserDispatch } = useBrowser();
  const [name, setName] = useState("");

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName.length > 0) {
      browserDispatch({
        type: "NAME",
        payload: trimmedName,
      });
      localStorage.setItem("name", trimmedName);
    }
  };

  return (
    <div className="home-container d-flex direction-column align-center justify-center">
      <h1 className="main-heading fade-in-up">Browser Extension</h1>
      <div className="user-details d-flex direction-column align-center gap fade-in-up delay-1">
        <label htmlFor="name-input" className="heading-1 label-shadow">
          Hello, what&apos;s your name?
        </label>
        <form
          onSubmit={handleFormSubmit}
          className="d-flex direction-column align-center relative w-full"
        >
          <div className="input-wrapper">
            <input
              id="name-input"
              required
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={50}
              autoFocus
              aria-label="Enter your name"
              autoComplete="off"
              spellCheck="false"
            />
            <span className="input-highlight"></span>
          </div>
          <small className={`hint ${name.trim() ? "hint--visible" : ""}`}>
            Press Enter to continue
          </small>
        </form>
      </div>
      <footer className="footer fade-in-up delay-2">
        Made by Divanshiv ❤️
      </footer>
    </div>
  );
};
