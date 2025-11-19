import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Background } from "../../../components/Background/Background"
import { formatSessionStatus, nextView } from "../domain";
import { formatTime } from "../../../utils";
import { usePorodomo } from "../context";
import { View } from "../../../types";
import "./Breaking.css"
import { invoke } from "@tauri-apps/api/core";

export const Breaking: FC<{ setView: Dispatch<SetStateAction<View>> }> = ({ setView }) => {
  const { state, dispatch } = usePorodomo();

  const minutes = formatTime(Math.floor(state.remainingTime / 60));
  const seconds = formatTime(Math.round(state.remainingTime % 60));

  invoke("debug_msg", { message: `json => ${JSON.stringify(state)}` })

  useEffect(() => {
    if (state.sessionStatus !== "shortBreak" && state.sessionStatus !== "longBreak") {
      if (state.sessionStatus === "done") {
        dispatch({ type: "endSession" });
      }

      const next = nextView(state.sessionStatus);
      setView(next);

      return;
    };

    const intervalId = setInterval(() => {
      dispatch({ type: "tick" });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [state.sessionStatus])

  return (
    <Background>
      <div className="timer-circle-border" />
      <div className="timer-top-knob" />

      <div className="timer-content">
        <div className="align">
          <div className="session">
            <span className="session-label">セッション</span>
            <span className="session-value">
              <span>{state.currentSession}</span>
              <span className="icon session-value-division">
                <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24"><path d="M7 21L14.9 3H17L9.1 21H7Z" /></svg>
              </span>
              <span>{state.timerInputs.session}</span>
            </span>

            <span className="session-status">
              <span className="icon-main">
                <svg xmlns="http://www.w3.org/2000/svg" width={36} height={36} viewBox="0 0 24 24"><title>coffee-outline</title><path d="M2,21V19H20V21H2M20,8V5H18V8H20M20,3A2,2 0 0,1 22,5V8A2,2 0 0,1 20,10H18V13A4,4 0 0,1 14,17H8A4,4 0 0,1 4,13V3H20M16,5H6V13A2,2 0 0,0 8,15H14A2,2 0 0,0 16,13V5Z" /></svg>
              </span>
              <span>{formatSessionStatus(state.sessionStatus)}</span>
            </span>
          </div>

          <div className="remaining-time">
            <span>{minutes}</span>
            <span className="remaining-time-divider">:</span>
            <span>{seconds}</span>
          </div>
        </div>
      </div>
    </Background>
  )
}