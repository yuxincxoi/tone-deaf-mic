// src/utils/microphone.ts
export const startMicrophoneProcessing = async (
  audioContext: AudioContext,
  microphoneRef: React.MutableRefObject<MediaStreamAudioSourceNode | null>,
  jungleRef: React.MutableRefObject<any>
) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  }); // 마이크 스트림 얻기
  microphoneRef.current = audioContext.createMediaStreamSource(stream); // 얻은 마이크 스트림 입력 소스를 AudioContext에 전달
  microphoneRef.current.connect(jungleRef.current.input); // Jungle 오디오 프로세서에 연결
};

export const stopMicrophoneProcessing = (
  microphoneRef: React.MutableRefObject<MediaStreamAudioSourceNode | null>,
  jungleRef: React.MutableRefObject<any>
) => {
  if (microphoneRef.current) {
    microphoneRef.current.disconnect();
    jungleRef.current.output.disconnect();
  }
};
