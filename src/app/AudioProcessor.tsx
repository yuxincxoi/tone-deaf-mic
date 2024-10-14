"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const jungleRef = useRef<any>(null); // Jungle 오디오 프로세서 참조
  const [isProcessing, setIsProcessing] = useState(false); // 음치마이크 실행 여부

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
        jungleRef.current = new Jungle(audioContext);

        if (isProcessing) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          }); // 마이크 스트림 얻기
          microphoneRef.current = audioContext.createMediaStreamSource(stream); // 얻은 마이크 스트림 입력 소스를 AudioContext에 전달
          microphoneRef.current.connect(jungleRef.current.input); // Jungle 오디오 프로세서에 연결
          jungleRef.current.output.connect(audioContext.destination); // 처리된 오디오를 스피커로 출력
        } else {
          if (microphoneRef.current) {
            microphoneRef.current.disconnect();
            jungleRef.current.output.disconnect();
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    processAudio();

    // 컴포넌트 언마운트 시 리소스 정리
    return () => {
      if (microphoneRef.current) {
        microphoneRef.current.disconnect(); // 마이크 입력 해제
      }
      if (jungleRef.current) {
        jungleRef.current.output.disconnect(); // Jungle 출력 해제
      }
    };
  }, [audioContext, isProcessing]);

  const handleStartStop = () => {
    setIsProcessing(!isProcessing);
  };

  const handlePitchChange = () => {};

  return (
    <>
      <h2>음치 마이크</h2>
      <button onClick={handleStartStop}>{isProcessing ? "Off" : "On"}</button>
      <input
        type="range"
        min="-1"
        max="1"
        step="0.1"
        onChange={handlePitchChange}
        placeholder="PitchChanger"
      />
    </>
  );
};

export default dynamic(() => Promise.resolve(AudioProcessor), { ssr: false });
