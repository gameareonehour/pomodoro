import { FC, ReactNode } from "react";
import "./Background.css";

export const Background: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="app-root" data-tauri-drag-region>
      <div className="background">{children}</div>
    </div>
  );
};
