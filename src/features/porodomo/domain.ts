import { View } from "../../types";
import { SessionStatus, TimerInput } from "./types";

export const formatSessionStatus = (status: SessionStatus): string => {
  switch (status) {
    case "working":
      return "作業中";
    case "shortBreak":
      return "休憩中";
    case "longBreak":
      return "休憩中";
    default:
      return "作業中";
  }
}

export const nextSessionStatus = (
  sessionStatus: SessionStatus,
  sessionCount: number,
  maxSessionCount: number
): SessionStatus => {
  switch (sessionStatus) {
    case "working":
      if (sessionCount === maxSessionCount) {
        return "longBreak"
      } else {
        return "shortBreak"
      }
    case "shortBreak":
      return "working" 
    case "longBreak":
      return "done"
    default:
      return "working"
  }
}

export const nextView = (
  nextSession: SessionStatus,
): View => {
  switch (nextSession) {
    case "working":
      return "porodomo:working"
    case "shortBreak":
      return "porodomo:breaking"
    case "longBreak":
      return "porodomo:breaking"
    case "done":
      return "porodomo:standby"
    default:
      return "porodomo:working"
  }
}

export const nextSessionCount = (session: number, nextSession: SessionStatus): number => {
  switch (nextSession) {
    case "standby":
      return session
    case "working":
      return session + 1
    case "shortBreak":
      return session
    case "longBreak":
      return session
    case "done":
      return session + 1
  }
}

export const nextSessionRemainingTime = (nextSession: SessionStatus, timerInputs: TimerInput): number => {
  switch (nextSession) {
    case "standby":
      return 0
    case "working":
      return timerInputs.working * 60
    case "shortBreak":
      return timerInputs.shortBreak * 60
    case "longBreak":
      return timerInputs.longBreak * 60
    case "done":
      return 0
  }
}
