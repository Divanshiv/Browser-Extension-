import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  browserReducer,
  type BrowserAction,
  type BrowserState,
  initialBrowserState,
} from "./browser-reducer";

interface BrowserContextValue extends BrowserState {
  browserDispatch: Dispatch<BrowserAction>;
}

const BrowserContext = createContext<BrowserContextValue>(
  {} as BrowserContextValue,
);

interface BrowserProviderProps {
  children: ReactNode;
}

const BrowserProvider = ({ children }: BrowserProviderProps) => {
  const [state, browserDispatch] = useReducer(
    browserReducer,
    initialBrowserState,
    () => {
      try {
        const storedName = localStorage.getItem("name");
        if (storedName) {
          return { ...initialBrowserState, name: storedName };
        }
      } catch {
        // ignore
      }
      return initialBrowserState;
    },
  );

  return (
    <BrowserContext.Provider value={{ ...state, browserDispatch }}>
      {children}
    </BrowserContext.Provider>
  );
};

const useBrowser = (): BrowserContextValue => useContext(BrowserContext);

export { useBrowser, BrowserProvider };
