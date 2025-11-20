import { ChangeEvent, Dispatch, FC, SetStateAction, useState } from "react";
import { formatTime, selectAll, validateTimerInput } from "../../../utils";
import { Background } from "../../../components/Background/Background";
import { View } from "../../../types";
import { usePorodomo } from "../context";
import styles from "./Standby.module.css";

export const Standby: FC<{ setView: Dispatch<SetStateAction<View>> }> = ({ setView }) => {
  const { state, dispatch } = usePorodomo();

  const [mode] = useState<"pomodoro" | "countdown">("pomodoro");
  const [working, setWorking] = useState(() => formatTime(state.timerInputs.working));
  const [shortBreak, setShortBreak] = useState(() => formatTime(state.timerInputs.shortBreak));
  const [longBreak, setLongBreak] = useState(() => formatTime(state.timerInputs.longBreak));
  const [session, setSession] = useState(() => state.timerInputs.session);

  const onChangeWorking = (e: ChangeEvent<HTMLInputElement>) => {
    const validated = validateTimerInput(e.target.value);
    if (validated === false) {
      return;
    }
    setWorking(validated);
  };

  const onChangeShortBreak = (e: ChangeEvent<HTMLInputElement>) => {
    const validated = validateTimerInput(e.target.value);
    if (validated === false) {
      return;
    }
    setShortBreak(validated);
  };

  const onChangeLongBreak = (e: ChangeEvent<HTMLInputElement>) => {
    const validated = validateTimerInput(e.target.value);
    if (validated === false) {
      return;
    }
    setLongBreak(validated);
  };

  const startSession = () => {
    dispatch({
      type: "init",
      value: {
        working: parseInt(working),
        shortBreak: parseInt(shortBreak),
        longBreak: parseInt(longBreak),
        session: session,
      },
    });

    setView("porodomo:working");
  };

  return (
    <Background>
      <div className="timer-border-line" />
      <div className="timer-pointer" />

      <div className="timer-content">
        <div className={styles.modeSelection}>
          <span className={styles.modeLabel}>モード</span>
          <button className={styles.modeSelect} onClick={undefined}>
            <span className={styles.modeSelectText}>
              {mode === "pomodoro" ? "ポモドーロ" : "カウントダウン"}
            </span>
            <span className={styles.modeSelectChevron}>
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <title>chevron-down</title>
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </span>
          </button>
        </div>

        <div className={styles.timerSection}>
          <div className={styles.timeField}>
            <span className={styles.timeLabel}>作業</span>
            <input
              className={styles.timeInput}
              type="number"
              value={working}
              onClick={selectAll}
              onChange={onChangeWorking}
            />
          </div>
          <div className={styles.timeFieldDivider}>/</div>
          <div className={styles.timeField}>
            <span className={styles.timeLabel}>休憩</span>
            <input
              className={styles.timeInput}
              type="number"
              value={shortBreak}
              onClick={selectAll}
              onChange={onChangeShortBreak}
            />
          </div>
          <div className={styles.timeField}>
            <span className={styles.timeLabel}>長休憩</span>
            <input
              className={styles.timeInput}
              type="number"
              value={longBreak}
              onClick={selectAll}
              onChange={onChangeLongBreak}
            />
          </div>
        </div>

        <div className={styles.sessionControls}>
          <div className={styles.sessionControlOuter}>
            <span
              className={`icon-main ${styles.sessionStartButton}`}
              onClick={() => startSession()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={38} height={38} viewBox="0 0 24 24">
                <title>play</title>
                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            </span>
            <span className={styles.sessionInputOuter}>
              <span className={styles.sessionInputLabel}>セッション</span>
              <button
                className={styles.circleCounterButton}
                onClick={() => setSession((s) => (s >= 5 ? 1 : s + 1))}
              >
                {session}
              </button>
            </span>
          </div>
        </div>
      </div>
    </Background>
  );
};
