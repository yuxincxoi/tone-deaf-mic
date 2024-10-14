"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [harmonyAudioUrl, setHarmonyAudioUrl] = useState<string | null>(null);
  const harmonyAudioRef = useRef<HTMLAudioElement | null>(null);

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

  // Jungle 모듈을 사용해 3도 화음 생성
  const createHarmony = async (buffer: AudioBuffer, Jungle: any) => {
    if (!audioContext) return buffer;

    // 오디오 렌더링을 위한 offlineAudioContext 생성
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const source = offlineContext.createBufferSource(); // 오디오 렌더링 노드 생성
    source.buffer = buffer;

    const jungle = new Jungle(offlineContext);
    jungle.setPitchOffset(0.3);

    source.connect(jungle.input);
    jungle.output.connect(offlineContext.destination);

    // 재생 시작
    source.start();

    return offlineContext.startRendering();
  };

  return (
    <>
      <h2>음치 마이크</h2>
      {harmonyAudioUrl && (
        <audio ref={harmonyAudioRef} controls src={harmonyAudioUrl}></audio>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(AudioProcessor), { ssr: false });
