import { FC, ReactNode } from "react"

export const Timer: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="app-root" data-tauri-drag-region>
      <div className="timer-circle">
        {children}
      </div>
    </div>
  )
}