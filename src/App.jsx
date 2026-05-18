import './App.css';
import { getRandomImage } from "./db/images";
import { Home, Task } from "./pages";
import { useBrowser } from "./context/browser-context";
import { useEffect, useState } from 'react';

function App() {

  const { name, browserDispatch } = useBrowser();

  const [bgImage, setBgImage] = useState(getRandomImage);

  useEffect(() => {
    const userName = localStorage.getItem("name");
    browserDispatch({
      type: "NAME",
      payload: userName
    });
  }, [browserDispatch])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBgImage(getRandomImage());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="app" style={{ backgroundImage: `url("${bgImage}")` }}>
      {name ? <Task /> : <Home />}
    </div>
  );
}

export default App;
