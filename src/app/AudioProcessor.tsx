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

  useEffect(() => {
    const processAudio = async () => {
      try {
        const response = await fetch("/audio/anthem.mp3");
        // response를 ArrayBuffer로 변환
        const arrayBuffer = await response.arrayBuffer();
        // ArrayBuffer로 변환된 오디오 데이터를 AudioBuffer로 디코딩
        const audioBuffer = await audioContext?.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.error(error);
      }
    };

    processAudio();
  });
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
