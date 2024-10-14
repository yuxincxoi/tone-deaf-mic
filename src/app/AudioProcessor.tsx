"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // 오디오 처리 초기화
    const initAudio = async () => {
      const context = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
      setAudioContext(context);
    };

    initAudio();
  }, []);

  useEffect(() => {
    if (!audioContext) return;

    const processAudio = async () => {
      try {
        const { default: Jungle } = await import("../../lib/jungle.mjs");
      } catch (error) {
        console.error(error);
      }
    };

    processAudio();
  }, [audioContext]);

  return (
    <>
      <h2>음치 마이크</h2>
    </>
  );
};

export default dynamic(() => Promise.resolve(AudioProcessor), { ssr: false });
