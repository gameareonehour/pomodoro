import { FC } from "react";
import { Icon } from "../Icon/Icon";
import styles from "./PlayPause.module.css";

type Props = {
  type: "play" | "pause";
  play: () => void;
  pause: () => void;
};

export const PlayPause: FC<Props> = ({ type, play, pause }) => {
  return (
    <span
      className={styles.playPause}
      onClick={() => {
        type === "play" ? play() : pause();
      }}
    >
      <Icon type={type} width={42} height={42} main />
    </span>
  );
};
