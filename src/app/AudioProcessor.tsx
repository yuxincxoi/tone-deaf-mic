"use client";

import { useRef } from "react";

const AudioProcessor = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const audioContext = new AudioContext(); // Web Audio API 기능에 접근하기 위해 인스턴스 생성
  audioContextRef.current = audioContext as AudioContext; // useRef에 저장

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 마이크 스트림 얻기
    microphoneRef.current = audioContext.createMediaStreamSource(stream); // 얻은 스트림을 오디오 컨텍스트에 전달
  };

  return (
    <>
      <button onClick={() => console.log("processing true")}>Start</button>
      <button onClick={() => console.log("processing false")}>Stop</button>
      <input
        type="range"
        min="100"
        max="5000"
        value="frequency"
        placeholder="input"
        onChange={() => console.log("hi")}
      />
      <label>
        Frequency: <span></span> Hz
      </label>
    </>
  );
};

export default AudioProcessor;
