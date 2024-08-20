import { useRef } from "react";

const AudioProcessor = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const audioContext = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
  audioContextRef.current = audioContext as AudioContext; // useRef에 저장

  return (
    <>
      <h2>Audio</h2>
    </>
  );
};

export default AudioProcessor;
