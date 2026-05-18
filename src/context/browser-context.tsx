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
} from "./browser-reducer";

const initialValue: BrowserState = {
  name: "",
  time: "",
  message: "",
  task: null,
};

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
  const [{ name, time, message, task }, browserDispatch] = useReducer(
    browserReducer,
    initialValue,
  );

  return (
    <BrowserContext.Provider
      value={{ name, time, message, task, browserDispatch }}
    >
      {children}
    </BrowserContext.Provider>
  );
};

const useBrowser = (): BrowserContextValue => useContext(BrowserContext);

export { useBrowser, BrowserProvider };
