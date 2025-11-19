export type SessionStatus = "standby" | "working" | "shortBreak" | "longBreak" | "done";

export type TimerState = "running" | "paused" | "stopped";

export type TimerInput = {
  working: number;
  session: number;
  shortBreak: number;
  longBreak: number;
};
