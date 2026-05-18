import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserProvider } from "./context/browser-context";
import { ErrorBoundary } from "./components/ErrorBoundary";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserProvider>
        <App />
      </BrowserProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
