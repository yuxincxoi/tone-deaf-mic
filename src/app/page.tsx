import AudioProcessor from "./AudioProcessor";

export default function Home() {
  return (
    <div className="w-96 m-auto pt-52">
      <h1 className="text-5xl text-center">음치 마이크</h1>
      <AudioProcessor />
    </div>
  );
}
