import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { formatTime } from "../../../shared";
import { formatSessionStatus, nextView } from "../domain";
import { View } from "../../../types";
import { usePorodomo } from "../context";
import { playSound, SoundType } from "../../../api/command";

type Phase = "working" | "breaking";

type UsePorodomoTimerOptions = {
  phase: Phase;
  setView: Dispatch<SetStateAction<View>>;
};

export function usePorodomoTimer({ phase, setView }: UsePorodomoTimerOptions) {
  const { state, dispatch } = usePorodomo();

  const isBegun = useRef(false);
  const intervalId = useRef<number | null>(null);

  const minutes = useMemo(
    () => formatTime(Math.floor(state.remainingTime / 60)),
    [state.remainingTime],
  );

  const seconds = useMemo(
    () => formatTime(Math.round(state.remainingTime % 60)),
    [state.remainingTime],
  );

  const sessionStatus = useMemo(
    () => (state.timerStatus === "paused" ? "停止中" : formatSessionStatus(state.sessionStatus)),
    [state.sessionStatus, state.timerStatus],
  );

  const controls = useMemo<"pause" | "play">(
    () => (state.timerStatus === "running" ? "pause" : "play"),
    [state.timerStatus],
  );

  const isScoped = useMemo(() => {
    return (
      state.sessionStatus === phase ||
      (phase === "breaking" &&
        (state.sessionStatus === "shortBreak" || state.sessionStatus === "longBreak"))
    );
  }, [state.sessionStatus]);

  const angle = useMemo(() => {
    if (!isScoped) return 360;

    const totalTime =
      state.sessionStatus === "working"
        ? state.timerInputs.working * 60
        : state.sessionStatus === "shortBreak"
          ? state.timerInputs.shortBreak * 60
          : state.sessionStatus === "longBreak"
            ? state.timerInputs.longBreak * 60
            : 0;

    if (state.remainingTime === totalTime) return 0;

    const elapsedTime = totalTime - state.remainingTime;
    const progress = elapsedTime / totalTime;

    return Math.floor(progress * 360);
  }, [state.remainingTime, state.sessionStatus, phase, state.timerInputs]);

  const play = () => {
    dispatch({ type: "updateTimer", value: "running" });
  };

  const pause = () => {
    dispatch({ type: "updateTimer", value: "paused" });
  };

  const discardSession = () => {
    playSound("done");

    dispatch({ type: "endSession" });
    setView("porodomo:standby");
  };

  const skipSession = () => {
    dispatch({ type: "skipSession" });
  };

  const clearPorodomoTimer = () => {
    if (intervalId.current) clearInterval(intervalId.current);
  };

  // フェーズ開始時に音声を再生.
  useEffect(() => {
    if (!isScoped) return;

    const soundType = ((): SoundType => {
      if (state.sessionStatus === "working") {
        return "working";
      }
      if (state.sessionStatus === "shortBreak" || state.sessionStatus === "longBreak") {
        return "break";
      }

      return "working";
    })();

    if (!isBegun.current) {
      isBegun.current = true;

      playSound(soundType);
    }
  }, [state.sessionStatus, phase]);

  // タイマーの開始、停止を制御.
  useEffect(() => {
    // 次フェーズに遷移した場合、表示を切り替え.
    // 画面遷移した場合に、クリア関数が呼ばれタイマーは自動停止する.
    if (!isScoped) {
      const next = nextView(state.sessionStatus);
      setView(next);
      return;
    }

    // 一時停止ボタンが押下された場合、タイマーを停止する.
    if (state.timerStatus === "paused" && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
      return;
    }

    // 初回時、及び再生ボタンが押下された場合、タイマーを再開する.
    if (state.timerStatus === "running" && !intervalId.current) {
      intervalId.current = setInterval(() => {
        dispatch({ type: "tick" });
      }, 1000);
    }
  }, [state.timerStatus, state.sessionStatus, phase, dispatch]);

  return {
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
  };
}
