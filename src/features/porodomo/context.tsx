import { createContext, useContext, useReducer } from "react";
import { initialState, PorodomoAction, PorodomoState, reducer } from "./reducer";

export type PorodomoContextValue = {
  state: PorodomoState;
  dispatch: React.Dispatch<PorodomoAction>;
};

export const PorodomoContext = createContext<PorodomoContextValue | undefined>(undefined);

export const PorodomoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {...initialState});

  return (
    <PorodomoContext.Provider value={{ state, dispatch }}>
      {children}
    </PorodomoContext.Provider>
  );
};

export function usePorodomo() {
  const ctx = useContext(PorodomoContext);
  if (!ctx) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return ctx;
}