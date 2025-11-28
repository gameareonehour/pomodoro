import { CSSProperties, FC, useMemo } from "react";
import { SessionStatus, TimerStatus } from "../../features/porodomo/types";
import styles from "./Timeline.module.css";

export const Timeline: FC<{
  angle: number;
  sessionStatus: SessionStatus;
  timerStatus: TimerStatus;
}> = ({ angle, timerStatus, sessionStatus }) => {
  const dynamic = useMemo((): CSSProperties => {
    const color = (() => {
      const white = "white";
      const blue = "#0081CB";
      const orange = "#D05F10";

      if (timerStatus === "paused") {
        return white;
      }

      switch (sessionStatus) {
        case "standby":
          return white;
        case "working":
          return blue;
        case "shortBreak":
        case "longBreak":
          return orange;
        case "done":
          return white;
        default:
          return white;
      }
    })();

    return {
      ["--angle" as any]: `${angle}deg`,
      ["--line-color" as any]: color,
    };
  }, [timerStatus, sessionStatus, angle]);

  return (
    <>
      <span className={styles.timeline} style={dynamic}></span>
      <span className={styles.backdrop} style={dynamic}></span>

      <div className={styles.timerPointerRotator} style={dynamic}>
        <div className={styles.timerPointer} style={dynamic} />
      </div>
    </>
  );
};
