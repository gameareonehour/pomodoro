import { FC } from "react";
import styles from "./PlayPause.module.css";

type Props = {
  kind: "play" | "paused";
  play: () => void;
  pause: () => void;
};

export const PlayPause: FC<Props> = ({ kind, play, pause }) => {
  if (kind === "play") {
    return (
      <span className={`icon-main ${styles.playPause}`} onClick={() => play()}>
        <svg xmlns="http://www.w3.org/2000/svg" width={42} height={42} viewBox="0 0 24 24">
          <title>play</title>
          <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
        </svg>
      </span>
    );
  }

  return (
    <span className={`icon-main ${styles.playPause}`} onClick={() => pause()}>
      <svg xmlns="http://www.w3.org/2000/svg" width={42} height={42} viewBox="0 0 24 24">
        <title>pause</title>
        <path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
      </svg>
    </span>
  );
};
