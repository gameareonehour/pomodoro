export type SessionStatus = "standby" | "working" | "shortBreak" | "longBreak" | "done";

export type TimerStatus = "running" | "paused";

export type TimerInput = {
  working: number;
  session: number;
  shortBreak: number;
  longBreak: number;
};
