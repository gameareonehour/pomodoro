import { SessionStatus, TimerInput, TimerState } from "./types";
import { nextSessionCount, nextSessionRemainingTime, nextSessionStatus } from "./domain";

export type PorodomoState = {
  timerInputs: TimerInput;
  sessionStatus: SessionStatus;
  timerStatus: TimerState;
  currentSession: number;
  remainingTime: number;
};

export const initialState: PorodomoState = {
  timerInputs: {
    working: 30,
    session: 2,
    shortBreak: 5,
    longBreak: 15,
  },
  sessionStatus: "standby",
  timerStatus: "paused",
  currentSession: 0,
  remainingTime: 0,
};

export type PorodomoAction =
  | {
      type: "init";
      value: TimerInput;
    }
  | {
      type: "tick";
    }
  | {
      type: "updateTimer";
      value: TimerState;
    }
  | {
      type: "skipSession";
    }
  | {
      type: "endSession";
    };

export function reducer(state: PorodomoState, action: PorodomoAction): PorodomoState {
  switch (action.type) {
    case "init": {
      return {
        ...state,
        timerInputs: {
          ...action.value,
        },
        sessionStatus: "working",
        timerStatus: "running",
        currentSession: 1,
        remainingTime: action.value.working * 60,
      };
    }
    case "tick":
      if (state.remainingTime <= 1) {
        const nextSession = nextSessionStatus(
          state.sessionStatus,
          state.currentSession,
          state.timerInputs.session,
        );

        const session = nextSessionCount(state.currentSession, nextSession);
        const remainingTime = nextSessionRemainingTime(nextSession, state.timerInputs);

        return {
          ...state,
          sessionStatus: nextSession,
          timerStatus: "running",
          currentSession: session,
          remainingTime: remainingTime,
        };
      }

      return {
        ...state,
        remainingTime: state.remainingTime - 1,
      };
    case "updateTimer":
      return {
        ...state,
        timerStatus: action.value,
      };
    case "skipSession": {
      const nextSession = nextSessionStatus(
        state.sessionStatus,
        state.currentSession,
        state.timerInputs.session,
      );

      const remainingTime = nextSessionRemainingTime(nextSession, state.timerInputs);
      const session = nextSessionCount(state.currentSession, nextSession);

      return {
        ...state,
        sessionStatus: nextSession,
        timerStatus: "running",
        currentSession: session,
        remainingTime: remainingTime,
      };
    }
    case "endSession":
      return {
        ...initialState,
        timerInputs: {
          ...state.timerInputs,
        },
      };
    default:
      return state;
  }
}
