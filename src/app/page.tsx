import AudioProcessor from "./AudioProcessor";

export default function Home() {
  return (
    <div className="w-96 m-auto pt-52">
      <h1 className="text-5xl text-center font-extrabold">Tone-deaf Mic</h1>
      <AudioProcessor />
    </div>
  );
}
