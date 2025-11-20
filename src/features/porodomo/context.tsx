import type { Dispatch, ReactNode } from "react";
import { createContext, useContext, useReducer } from "react";
import { initialState, PorodomoAction, PorodomoState, reducer } from "./reducer";

type PorodomoContextValue = {
  state: PorodomoState;
  dispatch: Dispatch<PorodomoAction>;
};

const PorodomoContext = createContext<PorodomoContextValue | undefined>(undefined);

type PorodomoProviderProps = {
  children: ReactNode;
};

export const PorodomoProvider = ({ children }: PorodomoProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { ...initialState });

  return (
    <PorodomoContext.Provider value={{ state, dispatch }}>{children}</PorodomoContext.Provider>
  );
};

export function usePorodomo() {
  const ctx = useContext(PorodomoContext);
  if (!ctx) {
    throw new Error("usePorodomo must be used within PorodomoProvider");
  }
  return ctx;
}
