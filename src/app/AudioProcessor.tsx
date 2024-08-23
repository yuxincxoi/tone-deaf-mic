"use client";

import { useEffect, useRef, useState } from "react";

const AudioProcessor = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // 오디오 처리 초기화
    const initAudio = async () => {
      const audioContext = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
      audioContextRef.current = audioContext as AudioContext; // useRef에 저장

      if (audioElementRef.current) {
        // 오디오 데이터를 오디오 노드로 변환
        const sourceNode = audioContext.createMediaElementSource(
          audioElementRef.current
        );
      }
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
