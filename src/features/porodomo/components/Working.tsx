import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef } from "react";
import { Background } from "../../../components/Background/Background";
import { formatSessionStatus, nextView } from "../domain";
import { formatTime } from "../../../utils";
import { usePorodomo } from "../context";
import { View } from "../../../types";
import { PlayPause } from "./PlayPause";
import { invoke } from "@tauri-apps/api/core";
import styles from "./Working.module.css";

export const Working: FC<{ setView: Dispatch<SetStateAction<View>> }> = ({ setView }) => {
  const { state, dispatch } = usePorodomo();
  const isPlayedSound = useRef(false);
  const intervalId = useRef<number | null>(null);

  const minutes = useMemo(() => {
    return formatTime(Math.floor(state.remainingTime / 60));
  }, [state.remainingTime]);

  const seconds = useMemo(() => {
    return formatTime(Math.round(state.remainingTime % 60));
  }, [state.remainingTime]);

  const sessionStatus = useMemo(() => {
    return formatSessionStatus(state.sessionStatus);
  }, [state.sessionStatus]);

  const controls = useMemo(() => {
    if (state.timerStatus === "running") {
      return "paused";
    } else {
      return "play";
    }
  }, [state.timerStatus]);

  const discardSession = () => {
    void invoke("play_sound", { soundType: "done" });

    dispatch({ type: "endSession" });
    setView("porodomo:standby");
  };

  const skipSession = () => {
    dispatch({ type: "skipSession" });
  };

  useEffect(() => {
    if (!isPlayedSound.current) {
      isPlayedSound.current = true;
      void invoke("play_sound", { soundType: "working" });
    }
  }, [dispatch]);

  useEffect(() => {
    if (state.sessionStatus !== "working") {
      const next = nextView(state.sessionStatus);
      setView(next);

      return;
    }

    intervalId.current = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [state.sessionStatus]);

  useEffect(() => {
    if (state.timerStatus === "stopped" && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
      return;
    }

    if (state.timerStatus === "running" && !intervalId.current) {
      intervalId.current = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);
    }
  }, [state.timerStatus]);

  return (
    <Background>
      <div className="timer-border-line" />
      <div className="timer-pointer" />

      <div className="timer-content">
        <div className={styles.align}>
          <div className={styles.session}>
            <span className={styles.sessionLabel}>セッション</span>
            <span className={styles.sessionValue}>
              <span>{state.currentSession}</span>
              <span className={`icon ${styles.sessionValueDivision}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24">
                  <path d="M7 21L14.9 3H17L9.1 21H7Z" />
                </svg>
              </span>
              <span>{state.timerInputs.session}</span>
            </span>

            <span className={styles.sessionStatus}>
              <span className="icon-main">
                <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24">
                  <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z" />
                </svg>
              </span>
              <span>{sessionStatus}</span>
            </span>
          </div>

          <div className={styles.remainingTime}>
            <span>{minutes}</span>
            <span className={styles.remainingTimeDivider}>:</span>
            <span>{seconds}</span>
          </div>
        </div>

        <div className={styles.sessionControls}>
          <div className={styles.sessionControlOuter}>
            <button className={styles.circleCounterButton} onClick={() => discardSession()}>
              <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                <title>stop</title>
                <path d="M18,18H6V6H18V18Z" />
              </svg>
            </button>

            <PlayPause
              kind={controls}
              play={() => {
                dispatch({ type: "updateTimer", value: "running" });
              }}
              pause={() => {
                dispatch({ type: "updateTimer", value: "stopped" });
              }}
            />

            <button className={styles.circleCounterButton} onClick={() => skipSession()}>
              <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24">
                <title>skip-next</title>
                <path d="M16,18H18V6H16M6,18L14.5,12L6,6V18Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Background>
  );
};
