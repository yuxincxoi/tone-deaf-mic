// src/utils/cleanup.ts
export const cleanupAudioResources = (
  microphoneRef: React.MutableRefObject<MediaStreamAudioSourceNode | null>,
  jungleRef: React.MutableRefObject<any>
) => {
  if (microphoneRef.current) {
    microphoneRef.current.disconnect(); // 마이크 입력 해제
  }
  if (jungleRef.current) {
    jungleRef.current.output.disconnect(); // Jungle 출력 해제
  }
};
