import { FC, ReactNode } from "react";
import styles from "./Inner.module.css";

export const Inner: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={styles.inner}>
      {children}
    </div>
  )
}