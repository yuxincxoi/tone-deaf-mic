"use client";

import { useEffect, useRef, useState } from "react";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 오디오 처리 초기화
    const initAudio = async () => {
      const context = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
      setAudioContext(context);
    };

    initAudio();
  }, []);
  return (
    <>
      <audio src="/audio/anthem.mp3" controls></audio>
      <input
        type="range"
        min="100"
        max="5000"
        value="frequency"
        placeholder="input"
      />
      <label>
        Frequency: <span>frequency</span> Hz
      </label>
    </>
  );
};

export default AudioProcessor;
