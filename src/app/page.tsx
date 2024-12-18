/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { AddButton,SearchButton } from "./components";



export function Ekle() {
  return (
    <div>
      <label htmlFor="formul">Formül:</label>
      <label id="carpi">X</label>
      <input id="formul" type="text" />
      <input id="formul_ad" type="text" />
      <label htmlFor="formul_ad">Formül Ad:</label>
      <button id="sbutton" type="button">
        Ekle
      </button>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col flex-wrap items-center justify-center gap-y-10 bg-gray-900">
      <div className="">
        <AddButton />
      </div>
      <h1
        id="text"
        className="text-green-600 transition-all hover:drop-shadow-lg sm:text-6xl lg:text-7xl"
      >
        FORMULA FINDER
      </h1>

      <SearchButton />

      
    </div>
  );
}
