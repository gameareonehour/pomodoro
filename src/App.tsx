import { useState } from "react";
import "./App.css";

function App() {
  const [mode, ] = useState<"pomodoro" | "custom">("pomodoro");
  const [work, setWork] = useState(30);
  const [shortBreak, setShortBreak] = useState(15);
  const [longBreak, setLongBreak] = useState(15);
  const [session, setSession] = useState(2);

  return (
    <div className="app-root" data-tauri-drag-region>
      <div className="timer-circle">
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
              <button
                className="time-card-value"
                onClick={() => setWork((v) => (v === 30 ? 25 : 30))}
              >
                {work}
              </button>
            </div>

            <div className="time-card-divider">/</div>

            <div className="time-card">
              <span className="time-card-label">休憩</span>
              <button
                className="time-card-value"
                onClick={() => setShortBreak((v) => (v === 15 ? 5 : 15))}
              >
                {shortBreak}
              </button>
            </div>

            <div className="time-card">
              <span className="time-card-label">長休憩</span>
              <button
                className="time-card-value"
                onClick={() => setLongBreak((v) => (v === 15 ? 20 : 15))}
              >
                {longBreak}
              </button>
            </div>
          </div>

          {/* session + bottom controls */}
          <div className="session-section">
            <div className="bottom-row">

              <button className="circle-play-button" aria-label="スタート">
                <span className="play-icon" />
              </button>

              <span style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "3px"}}>
                <span className="session-label">セッション</span>
                <button
                  className="circle-counter-button"
                  onClick={() => setSession((s) => (s >= 4 ? 1 : s + 1))}
                >
                  {session}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
