import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Background } from "../../../components/Background/Background";
import { usePorodomo } from "../context";
import { View } from "../../../types";
import { PlayPause } from "../../../components/PlayPause/PlayPause";
import { Timeline } from "../../../components/Timeline/Timeline";
import { Inner } from "../../../components/Inner/Inner";
import { Icon } from "../../../components/Icon/Icon";
import { usePorodomoTimer } from "../hooks/usePorodomoTimer";
import styles from "./Working.module.css";

export const Working: FC<{ setView: Dispatch<SetStateAction<View>> }> = ({ setView }) => {
  const { state } = usePorodomo();

  const {
    minutes,
    seconds,
    sessionStatus,
    controls,
    angle,
    play,
    pause,
    discardSession,
    skipSession,
    clearPorodomoTimer,
  } = usePorodomoTimer({
    phase: "working",
    setView,
  });

  useEffect(() => {
    return () => {
      clearPorodomoTimer();
    };
  }, []);

  return (
    <Background>
      <Timeline angle={angle} timerStatus={state.timerStatus} sessionStatus={state.sessionStatus} />

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
