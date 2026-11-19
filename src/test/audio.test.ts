import { afterEach, expect, it, vi } from "vitest";
import { setAudioMuted, sounds } from "@/lib/audio";

afterEach(() => { setAudioMuted(false); vi.unstubAllGlobals(); });
it("all effects stay silent even when unmuted", () => {
  const start = vi.fn();
  vi.stubGlobal("AudioContext", class {
    state = "running";
    currentTime = 0;
    destination = {};
    suspend = vi.fn();
    resume = vi.fn();
    createOscillator = () => ({ frequency: { value: 0 }, connect: () => ({ connect: vi.fn() }), start, stop: vi.fn() });
    createGain = () => ({ gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() } });
  });
  setAudioMuted(true);
  sounds.correct(); sounds.wrong(); sounds.cheer();
  expect(start).not.toHaveBeenCalled();
  setAudioMuted(false);
  sounds.correct();
  sounds.wrong(); sounds.cheer();
  expect(start).not.toHaveBeenCalled();
});
it("never speaks during rewards or mute changes", () => {
  const voice = vi.fn();
  vi.stubGlobal("speechSynthesis", { speak: voice });
  setAudioMuted(true);
  sounds.correct(); sounds.cheer();
  setAudioMuted(false);
  expect(voice).not.toHaveBeenCalled();
});