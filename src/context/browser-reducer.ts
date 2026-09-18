export interface BrowserState {
  name: string;
  time: string;
  message: string;
  task: string | null;
}

export function getGreeting(hours: number): string {
  if (hours >= 0 && hours < 12) return "Good Morning";
  if (hours >= 12 && hours <= 17) return "Good afternoon";
  return "Good evening";
}

export type BrowserAction =
  | { type: "NAME"; payload: string }
  | { type: "TIME"; payload: string }
  | { type: "MESSAGE"; payload: string }
  | { type: "TASK"; payload: string }
  | { type: "CLEAR" };

export const browserReducer = (
  state: BrowserState,
  action: BrowserAction,
): BrowserState => {
  switch (action.type) {
    case "NAME":
      return { ...state, name: action.payload };
    case "TIME":
      return { ...state, time: action.payload };
    case "MESSAGE":
      return { ...state, message: action.payload };
    case "TASK":
      return { ...state, task: action.payload };
    case "CLEAR":
      return { ...state, task: null };
    default:
      return state;
  }
};

export const initialBrowserState: BrowserState = {
  name: "",
  time: "",
  message: "",
  task: null,
};
