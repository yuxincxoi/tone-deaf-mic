"use client";

import { useEffect, useRef, useState } from "react";
import Jungle from "../../lib/jungle.mjs"; // Jungle 모듈 가져오기

const AudioProcessor = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [distortedAudioUrl, setDistortedAudioUrl] = useState<string | null>(
    null
  );
  const distortedAudioRef = useRef<HTMLAudioElement | null>(null);

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
        const response = await fetch("/audio/anthem.mp3");
        // response를 ArrayBuffer로 변환
        const arrayBuffer = await response.arrayBuffer();
        // ArrayBuffer로 변환된 오디오 데이터를 AudioBuffer로 디코딩
        const audioBuffer = await audioContext?.decodeAudioData(arrayBuffer);

        // 왜곡 효과 적용
        const distortedBuffer = applyDistortion(audioBuffer);

        // 왜곡된 오디오 URL 생성
        const distortedAudioBlob = await audioBufferToBlob(distortedBuffer); // audio buffer를 blob 형식으로 변환
        setDistortedAudioUrl(URL.createObjectURL(distortedAudioBlob)); // 변환된 Blob을 브라우저에서 재생할 수 있는 URL로 생성하고 상태 업데이트
      } catch (error) {
        console.error(error);
      }
    };

    processAudio();
  }, [audioContext]);

  const applyDistortion = (buffer: AudioBuffer) => {
    if (!audioContext) return buffer;

    const distortion = audioContext.createWaveShaper(); // 왜곡효과 적용하는 node 생성
    const gain = audioContext.createGain(); // 볼륨조절 node 생성

    // 왜곡 곡선 생성
    const curve = new Float32Array(44100);
    for (let i = 0; i < 44100; i++) {
      const x = (i * 2) / 44100 - 1;
      curve[i] = (3 + x * 3) / (3 + Math.abs(x));
    }
    distortion.curve = curve; // 왜곡된 곡선을 입력신호에 설정
    distortion.oversample = "4x"; // 왜곡 품질 향상

    const source = audioContext.createBufferSource(); // 오디오 재생 노드 생성
    source.buffer = buffer;

    // 오디오 노드(재생) -> 왜곡 노드(왜곡) -> 볼륨 노드(볼륨조절) -> 출력 노드
    source.connect(distortion);
    distortion.connect(gain);
    gain.connect(audioContext.destination);

    return buffer;
  };

  const audioBufferToBlob = async (buffer: AudioBuffer) => {
    // 오디오 렌더링을 위한 offlineAudioContext 생성
    const offlineContext = new OfflineAudioContext(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );

    const source = offlineContext.createBufferSource(); // 오디오 렌더링 노드 생성
    source.buffer = buffer;

    // 오디오 노드(렌더링) -> 출력 노드 연결
    source.connect(offlineContext.destination);

    // 재생 시작
    source.start();

    const renderBuffer = await offlineContext.startRendering(); // 렌더링된 오디오 데이터 버퍼로 반환
    const wavData = encodeWAV(renderBuffer); // WAV 포맷으로 인코딩
    const audioBlob = new Blob([wavData], { type: "audio/wav" }); // Blob으로 변환하여 반환
    return audioBlob;
  };

  // WAV 파일 포맷으로 인코딩하는 함수
  const encodeWAV = (buffer: AudioBuffer) => {
    const numOfChan = buffer.numberOfChannels; // 오디오 채널 수
    const length = buffer.length * numOfChan * 2 + 44; // WAV 파일 길이 (헤더 44바이트 + 오디오 데이터 크기)
    const rate = buffer.sampleRate; // 샘플링 주파수
    const channels = buffer.numberOfChannels; // 오디오 채널 수
    const sampleRate = buffer.sampleRate; // 샘플링 주파수
    const bitsPerSample = 16; // 샘플당 비트 수

    const view = new DataView(new ArrayBuffer(length)); // 메모리 공간을 확보하여 데이터로 접근
    let offset = 0; // 메모리 위치

    // 문자열을 DataView에 기록하는 함수
    const writeString = (str: string) => {
      // 문자열을 8비트로 기록
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };

    // 32비트 정수를 DataView에 기록하는 함수
    const writeUint32 = (value: number) => {
      view.setUint32(offset, value, true);
      offset += 4; // 오프셋을 4바이트 이동
    };

    // 16비트 정수를 DataView에 기록하는 함수
    const writeUint16 = (value: number) => {
      view.setUint16(offset, value, true);
      offset += 2; // 오프셋을 2바이트 이동
    };

    // RIFF chunk descriptor : 파일 기본 정보
    writeString("RIFF"); // RIFF : 파일의 시작을 알리는 마커. WAV 파일이 맞는지 확인
    writeUint32(length - 8); // [파일의 전체 크기 - RIFF 단어와 크기를 나타내는 필드(8바이트)]
    writeString("WAVE"); // 파일 형식 표시

    // fmt sub-chunk : 오디오 형식 정보
    writeString("fmt "); // 오디오 데이터의 형식을 설명하는 정보를 시작하는 마커
    writeUint32(16); // 오디오 형식을 설명하는 데 필요한 데이터의 크기
    writeUint16(1); // 오디오 포맷이 PCM(일반적인 비압축 오디오 형식)이라는 것을 의미
    writeUint16(channels); // 오디오가 구성된 채널 개수
    writeUint32(sampleRate); // 초당 샘플링된 횟수
    writeUint32((sampleRate * channels * bitsPerSample) / 8); // 초당 바이트 수
    writeUint16((channels * bitsPerSample) / 8); // 오디오 데이터가 몇 바이트씩 나뉘어 저장되는지
    writeUint16(bitsPerSample); // 샘플 하나당 몇 비트로 기록되었는지

    // data sub-chunk : 오디오 데이터 정보
    writeString("data"); // 실제 오디오 데이터가 시작된다는 마커
    writeUint32(length - offset - 44); // 오디오 데이터의 크기. [전체 파일 길이 - 지금까지 기록된 헤더 부분(44바이트)]

    // 오디오 데이터 저장할 배열 생성
    const interleaved = new Float32Array(buffer.length * channels);
    // 각 채널의 오디오 데이터를 interleaved 배열에 설정
    for (let i = 0; i < channels; i++) {
      interleaved.set(buffer.getChannelData(i), i * buffer.length);
    }

    // 16비트 PCM 형식으로 변환할 배열 생성
    const samples = new Int16Array(interleaved.length);
    // Float32 데이터를 16비트 PCM 형식으로 변환
    for (let i = 0; i < interleaved.length; i++) {
      samples[i] = Math.min(1, Math.max(-1, interleaved[i])) * 0x7fff;
    }

    // 변환된 16비트 PCM 데이터를 DataView에 기록
    for (let i = 0; i < samples.length; i++) {
      view.setInt16(offset, samples[i], true); // 오디오 데이터를 16비트 정수로 DataView에 저장
      offset += 2;
    }

    return view.buffer;
  };
  return (
    <>
      <div>
        <h2>Original</h2>
        <audio ref={audioElementRef} controls>
          <source src="/audio/anthem.mp3" type="audio/mpeg" />
        </audio>
      </div>
      <div>
        <h2>Distorted Audio</h2>
        <audio
          ref={distortedAudioRef}
          controls
          src={distortedAudioUrl || undefined}
        ></audio>
      </div>
    </>
  );
};

export default AudioProcessor;
