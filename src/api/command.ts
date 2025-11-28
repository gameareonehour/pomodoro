import { invoke } from "@tauri-apps/api/core";

export type SoundType = "working" | "break" | "done";

export const playSound = async (soundType: SoundType) => {
  await invoke("play_sound", { soundType });
};

export const debug = async (content: any) => {
  await invoke("debug_msg", { message: JSON.stringify(content) });
};
