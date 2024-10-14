"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { initializeAudioContext } from "../modules/audioContext";
import { handleAudioProcessing } from "../modules/audioProcessor";
import { cleanupAudioResources } from "@/modules/cleanUp";
import { updatePitchOffset } from "../modules/jungleProcessor";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const jungleRef = useRef<any>(null); // Jungle 오디오 프로세서 참조
  const [isProcessing, setIsProcessing] = useState(false); // 음치마이크 실행 여부
  const [pitchOffset, setPitchOffset] = useState(0.3);

  useEffect(() => {
    initializeAudioContext(setAudioContext); // 오디오 컨텍스트 초기화
  }, []);

  useEffect(() => {
    handleAudioProcessing(
      audioContext,
      isProcessing,
      microphoneRef,
      jungleRef,
      pitchOffset
    );

    // 컴포넌트 언마운트 시 리소스 정리
    return () => cleanupAudioResources(microphoneRef, jungleRef);
  }, [audioContext, isProcessing, pitchOffset]);

  const handleStartStop = () => {
    setIsProcessing(!isProcessing);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPitchOffset = parseFloat(e.target.value); // 입력받은 피치 값을 숫자로 변환
    setPitchOffset(newPitchOffset);
    updatePitchOffset(jungleRef, newPitchOffset); // 피치 오프셋 업데이트
  };

  return (
    <>
      <h2>음치 마이크</h2>
      <button onClick={handleStartStop}>{isProcessing ? "Off" : "On"}</button>
      <input
        type="range"
        min="-1"
        max="1"
        step="0.1"
        value={pitchOffset}
        onChange={handlePitchChange}
        placeholder="PitchChanger"
      />
      <p>pitch : {pitchOffset}</p>
    </>
  );
};

export default dynamic(() => Promise.resolve(AudioProcessor), { ssr: false });
