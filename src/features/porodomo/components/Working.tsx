import { Dispatch, FC, SetStateAction, useEffect, useMemo, useRef } from "react";
import { Background } from "../../../components/Background/Background";
import { formatSessionStatus, nextView } from "../domain";
import { formatTime } from "../../../shared";
import { usePorodomo } from "../context";
import { View } from "../../../types";
import { PlayPause } from "./PlayPause";
import { invoke } from "@tauri-apps/api/core";
import { Timeline } from "../../../components/Timeline/Timeline";
import { Inner } from "../../../components/Inner/Inner";
import { Icon } from "../../../components/Icon/Icon";
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
      return "pause";
    } else {
      return "play";
    }
  }, [state.timerStatus]);

  const play = () => {
    dispatch({ type: "updateTimer", value: "running" });
  };

  const pause = () => {
    dispatch({ type: "updateTimer", value: "paused" });
  };

  const discardSession = () => {
    void invoke("play_sound", { soundType: "done" });

    dispatch({ type: "endSession" });
    setView("porodomo:standby");
  };

  const skipSession = () => {
    dispatch({ type: "skipSession" });
  };

  // 作業開始を表す音声を再生.
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

    if (intervalId.current) {
      clearInterval(intervalId.current);
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
    if (state.timerStatus === "paused" && intervalId.current) {
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

  const angle = useMemo(() => {
    // 作業完了の場合、ポインターの位置は360.
    if (state.sessionStatus !== "working") {
      return 360;
    }

    const totalTime = state.timerInputs.working * 60;

    // 作業開始の場合、ポインターの位置は0.
    if (state.remainingTime === totalTime) {
      return 0;
    }

    const elapsedTime = totalTime - state.remainingTime;
    const progress = elapsedTime / totalTime;

    return Math.floor(progress * 360);
  }, [state.remainingTime, state.timerInputs.working]);

  return (
    <Background>
      <Timeline
        angle={angle}
        timerStatus={state.timerStatus}
        sessionStatus={state.sessionStatus}
      />

      <Inner>
        <div className={styles.align}>
          <div className={styles.session}>
            <span className={styles.sessionLabel}>セッション</span>
            <span className={styles.sessionValue}>
              <span>{state.currentSession}</span>
              <span className={styles.sessionValueDivision}>
                <Icon type={"division"} width={16} height={16} />
              </span>
              <span>{state.timerInputs.session}</span>
            </span>

            <span className={styles.sessionStatus}>
              <Icon type={"fire"} width={32} height={32} main />
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
            <button className={styles.circle} onClick={() => discardSession()}>
              <Icon type={"stop"} width={32} height={32} main />
            </button>

            <PlayPause type={controls} play={() => play()} pause={() => pause()} />

            <button className={styles.circle} onClick={() => skipSession()}>
              <Icon type={"skip"} width={32} height={32} main />
            </button>
          </div>
        </div>
      </Inner>
    </Background>
  );
};
