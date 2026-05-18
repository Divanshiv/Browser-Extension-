import "@testing-library/jest-dom";

// Ensure localStorage is available in the test environment
if (
  typeof globalThis.localStorage === "undefined" ||
  typeof globalThis.localStorage.clear !== "function"
) {
  const store = {};
  const storageHandler = {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((key) => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => Object.keys(store)[index] ?? null,
  };
  Object.defineProperty(globalThis, "localStorage", {
    value: storageHandler,
    writable: false,
    configurable: true,
  });
}
