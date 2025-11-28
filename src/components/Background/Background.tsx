import { FC, ReactNode } from "react";
import styles from "./Background.module.css";

export const Background: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={styles.background} data-tauri-drag-region>
      <div className={styles.backdrop}>{children}</div>
    </div>
  );
};
