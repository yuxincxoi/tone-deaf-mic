// src/utils/audioProcessor.ts
import { initializeAudioContext } from "./audioContext";
import {
  initializeJungleProcessor,
  updatePitchOffset,
} from "./jungleProcessor";
import {
  startMicrophoneProcessing,
  stopMicrophoneProcessing,
} from "./microphone";
import { cleanupAudioResources } from "./cleanUp";

export const handleAudioProcessing = async (
  audioContext: AudioContext | null,
  isProcessing: boolean,
  microphoneRef: React.MutableRefObject<MediaStreamAudioSourceNode | null>,
  jungleRef: React.MutableRefObject<any>,
  pitchOffset: number
) => {
  if (!audioContext) return;

  try {
    await initializeJungleProcessor(audioContext, jungleRef, pitchOffset);

    if (isProcessing) {
      await startMicrophoneProcessing(audioContext, microphoneRef, jungleRef);
    } else {
      stopMicrophoneProcessing(microphoneRef, jungleRef);
    }
  } catch (error) {
    console.error(error);
  }
};
