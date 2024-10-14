// src/utils/jungleProcessor.ts
export const initializeJungleProcessor = async (
  audioContext: AudioContext,
  jungleRef: React.MutableRefObject<any>,
  pitchOffset: number
) => {
  const { default: Jungle } = await import("../../lib/jungle.mjs");
  jungleRef.current = new Jungle(audioContext);
  jungleRef.current.setPitchOffset(pitchOffset);
};

export const updatePitchOffset = (
  jungleRef: React.MutableRefObject<any>,
  newPitchOffset: number
) => {
  if (jungleRef.current) {
    jungleRef.current.setPitchOffset(newPitchOffset);
  }
};
