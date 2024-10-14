// src/utils/audioContext.ts
export const initializeAudioContext = async (setAudioContext: Function) => {
  const context = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
  setAudioContext(context);
};
