/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AddButton, SearchButton } from "./components";
import ParticleBackground from "./ParticleBackground";


export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col flex-wrap items-center justify-center gap-y-10">
      <ParticleBackground />
      <div className="">
        <AddButton />
      </div>
      <h1
        id="text"
        className="text-white transition-all font-thin hover:drop-shadow-lg sm:text-6xl lg:text-7xl"
      >
        FORMULA FINDER
      </h1>

      <SearchButton />
    </div>
  );
}
