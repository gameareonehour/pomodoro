import { Dispatch, FC, SetStateAction, useState } from "react";
import { selectAll, validateTimerInput } from "../../utils";
import { Timer } from "../../components/Timer/Timer";
import { View } from "../../types";

export const Standby: FC<{ setView: Dispatch<SetStateAction<View>> }> = ({ setView }) => {
  const [mode, ] = useState<"pomodoro" | "custom">("pomodoro");
  const [work, setWork] = useState("60");
  const [shortBreak, setShortBreak] = useState("5");
  const [longBreak, setLongBreak] = useState("15");
  const [session, setSession] = useState(2);

  return (
    <Timer>
      <div className="timer-circle-border" />
      <div className="timer-top-knob" />

      <div className="timer-content">
        {/* mode selector */}
        <div className="mode-section">
          <span className="mode-label">モード</span>
          <button
            className="mode-select"
            onClick={undefined}
          >
            <span className="mode-select-text">
              {mode === "pomodoro" ? "ポモドーロ" : "カスタム"}
            </span>
            <span className="mode-select-chevron">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <title>chevron-down</title>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </span>
          </button>
        </div>
        {/* time blocks */}
        <div className="time-section">
          <div className="time-card">
            <span className="time-card-label">作業</span>
            <input
              className="timer-input"
              type="number"
              value={work}
              onClick={selectAll}
              onChange={(e) => {
                const validated = validateTimerInput(e.target.value)
                if (validated === false) {
                  return
                }
                setWork(validated);
              }}
            />
          </div>
          <div className="time-card-divider">/</div>
          <div className="time-card">
            <span className="time-card-label">休憩</span>
            <input
              className="timer-input"
              type="number"
              value={shortBreak}
              onClick={selectAll}
              onChange={(e) => {
                const validated = validateTimerInput(e.target.value)
                if (validated === false) {
                  return
                }
                setShortBreak(validated);
              }}
            />
          </div>
          <div className="time-card">
            <span className="time-card-label">長休憩</span>
            <input
              className="timer-input"
              type="number"
              value={longBreak}
              onClick={selectAll}
              onChange={(e) => {
                const validated = validateTimerInput(e.target.value)
                if (validated === false) {
                  return
                }
                setLongBreak(validated);
              }}
            />
          </div>
        </div>
        {/* session + bottom controls */}
        <div className="session-section">
          <div className="bottom-row">
            <button className="circle-play-button" aria-label="スタート" onClick={() => setView("porodomo:working")}>
              <span className="play-icon" />
            </button>
            <span style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "3px"}}>
              <span className="session-label">セッション</span>
              <button
                className="circle-counter-button"
                onClick={() => setSession((s) => (s >= 5 ? 1 : s + 1))}
              >
                {session}
              </button>
            </span>
          </div>
        </div>
      </div>
    </Timer>
  )
}