import { createContext, useContext, useState, type ReactNode } from "react";
import { setAudioMuted } from "@/lib/audio";

const AudioState = createContext({ muted: false, toggle: () => {} });
export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false);
  return <AudioState.Provider value={{ muted, toggle: () => {
    const next = !muted;
    setAudioMuted(next);
    setMuted(next);
  } }}>{children}</AudioState.Provider>;
}
export const useAudio = () => useContext(AudioState);