"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const jungleRef = useRef<any>(null); // Jungle 오디오 프로세서 참조
  const [isProcessing, setIsProcessing] = useState(false); // 음치마이크 실행 여부
  const [pitchOffset, setPitchOffset] = useState(0.3);

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
        jungleRef.current.setPitchOffset(pitchOffset);

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
  }, [audioContext, isProcessing, pitchOffset]);

  const handleStartStop = () => {
    setIsProcessing(!isProcessing);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPitchOffset = parseFloat(e.target.value); // 입력받은 피치 값을 숫자로 변환
    setPitchOffset(newPitchOffset);

    if (jungleRef.current) {
      jungleRef.current.setPitchOffset(newPitchOffset); // Jungle 인스턴스의 피치 오프셋 업데이트
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    const switchInput = document.getElementById("switch") as HTMLInputElement;
    const switchLabel = switchInput.nextElementSibling as HTMLLabelElement;
    const onfButton = switchLabel.querySelector(".onf_btn") as HTMLElement;

    switchInput.addEventListener("change", () => {
      if (switchInput.checked) {
        switchLabel.classList.add("bg-[#c44]", "border-[#c44]");
        switchLabel.classList.remove("hover:bg-[#efefef]");
        onfButton.classList.add(
          "left-[34px]",
          "bg-white",
          "shadow-[1px_2px_3px_rgba(0,0,0,0.12)]"
        );
      } else {
        switchLabel.classList.remove("bg-[#c44]", "border-[#c44]");
        switchLabel.classList.add("hover:bg-[#efefef]");
        onfButton.classList.remove(
          "left-[34px]",
          "bg-white",
          "shadow-[1px_2px_3px_rgba(0,0,0,0.12)]"
        );
      }
    });
  });

  return (
    <>
      <div>
        <label className="relative inline-flex items-center cursor-pointer mt-16 mx-auto w-60">
          <input
            type="checkbox"
            checked={isProcessing} // 체크박스 상태와 isProcessing 동기화
            onChange={handleStartStop} // 상태 변경 시 핸들러 호출
            placeholder="onOff"
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[3.5px] after:left-[95.5px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-black hover:peer-checked:bg-stone-700 mx-auto"></div>
        </label>
        <br />
        <div className="flex justify-between pt-16">
          <p>down</p>
          <p>up</p>
        </div>
        <input
          id="pitch"
          type="range"
          min="-1"
          max="1"
          step="0.1"
          value={pitchOffset}
          onChange={handlePitchChange}
          placeholder="PitchChanger"
          className="z-10 mb-1 mt-4 h-2 w-full appearance-none bg-neutral-100 focus:outline-black dark:bg-neutral-900 dark:focus:outline-white [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black active:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:dark:bg-white [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:active:scale-110 [&::-webkit-slider-thumb]:dark:bg-white [&::-moz-range-thumb]:rounded-full [&::-webkit-slider-thumb]:rounded-full rounded-full"
        />
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(AudioProcessor), { ssr: false });
