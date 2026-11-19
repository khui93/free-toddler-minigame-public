// Silent compatibility API: no browser audio or speech is created.
export function setAudioMuted(_value: boolean) {}
export const sounds = { correct: () => {}, wrong: () => {}, cheer: () => {} };
