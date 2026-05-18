import "./App.css";
import { getRandomImage } from "./data/images";
import { Home, Task } from "./pages";
import { useBrowser } from "./context/browser-context";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { useEffect, useState, useCallback } from "react";

function App() {
  const { name, browserDispatch } = useBrowser();

  const [bgImage, setBgImage] = useState(getRandomImage);
  const [bgLoaded, setBgLoaded] = useState(false);

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
    const intervalId = setInterval(refreshBackground, 60000);
    return () => clearInterval(intervalId);
  }, [refreshBackground]);

  return (
    <div
      className={`app${bgLoaded ? " app--loaded" : ""}`}
      role="main"
      aria-label="Daily Focus Dashboard"
      style={{ backgroundImage: `url("${bgImage}")` }}
    >
      <img
        src={bgImage}
        onLoad={() => setBgLoaded(true)}
        onError={() => setBgLoaded(true)}
        style={{ display: "none" }}
        alt=""
        aria-hidden="true"
      />
      <ThemeToggle />
      {name ? <Task /> : <Home />}
    </div>
  );
}

export default App;
