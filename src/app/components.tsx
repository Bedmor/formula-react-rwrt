"use client";
import { useState } from "react";

export function SearchButton() {
  const [response, setResponse] = useState("");
  async function handleSubmitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await fetch("/api/search", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setResponse(data);
      });
  }

  return (
    <div className="flex min-w-max flex-col items-center justify-center gap-6">
      <div className="flex min-w-max flex-row">
        <form onSubmit={handleSubmitSearch}>
          <input
            name="formula_name"
            className="sm:w-max[24rem] peer h-14 rounded-lg rounded-e-none border-transparent bg-inherit px-4 text-green-600 outline-none transition-all focus:border-2 focus:border-green-600 lg:w-[50rem]"
            type="text"
            id="SearchB"
            placeholder="You Can Search Here!"
            autoFocus
          />
          <button
            type="submit"
            id="FindB"
            className="size-14 rounded-lg rounded-s-none bg-green-600 text-gray-900 opacity-0 transition-all peer-focus:opacity-100"
          >
            Bul!
          </button>
        </form>
      </div>
      <h1 id="result" className="text-6xl text-green-600 transition-all">
        {response}
      </h1>
    </div>
  );
}
//TODO: Add confirmation for adding formulas
export function AddButton() {
  "use client";
  const [AddPressed, setAddPressed] = useState(false);
  return (
    <>
      {!AddPressed && (
        <button
          id="add"
          type="button"
          className="absolute right-10 top-10 rounded-lg bg-green-600 p-1 text-white"
          onClick={() => setAddPressed(!AddPressed)}
        >
          Formül Ekle(WIP)
        </button>
      )}
      <div>
        {AddPressed && (
          <div className="fixed inset-0 flex flex-col flex-wrap items-center justify-center gap-4 bg-gray-900">
            <button
              className="relative bottom-44 right-80 h-8 w-20 rounded-lg bg-green-600 text-white"
              id="close"
              type="button"
              onClick={() => setAddPressed(!AddPressed)}
            >
              {"<-"}
            </button>
            <input
              className="h-8 w-80 rounded-lg"
              type="text"
              id="formulaName"
              placeholder="Formül İsmi"
            />
            <input
              className="h-8 w-80 rounded-lg"
              type="text"
              id="formulaContent"
              placeholder="Formül İçeriği"
            />
            <button
              className="h-10 w-20 bg-green-600 text-white"
              id="addFormula"
              type="button"
            >
              Ekle
            </button>
          </div>
        )}
      </div>
    </>
  );
}
