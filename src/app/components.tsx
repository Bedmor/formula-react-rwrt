"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ParticleBackground from "./ParticleBackground";

export function SearchButton() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    await fetch("/api/search", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data: string) => {
        setResponse(data);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="flex min-w-max flex-col items-center justify-center gap-6">
      <div className="flex min-w-max flex-row">
        <form className="flex flex-row" onSubmit={handleSubmitSearch}>
          <Input
            name="formula_name"
            className="sm:w-max[24rem] peer h-14 rounded-e-none bg-inherit px-4 text-white transition-all focus:border-4 lg:w-[50rem]"
            type="text"
            id="SearchB"
            placeholder="You Can Search Here!"
            autoFocus
          />
          <Button
            type="submit"
            variant="outline"
            id="FindB"
            className="size-14 rounded-s-none opacity-0 transition-all peer-focus:opacity-100"
          >
            Bul!
          </Button>
        </form>
      </div>
      <h1 id="result" className="text-6xl font-thin text-white transition-all">
        {loading ? "Loading..." : response}
      </h1>
    </div>
  );
}
//TODO: Add confirmation for adding formulas
export function AddButton() {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [AddPressed, setAddPressed] = useState(false);
  async function handleSubmitAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    await fetch("/api/add", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data: string) => {
        setResponse(data);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      {!AddPressed && (
        <Button
          id="add"
          type="button"
          variant="ghost"
          className="absolute right-10 top-10 text-white"
          onClick={() => setAddPressed(!AddPressed)}
        >
          Formül Ekle(WIP)
        </Button>
      )}
      <div>
        {AddPressed && (
          <form
            onSubmit={handleSubmitAdd}
            className="motion-preset-expand fixed inset-0 flex flex-col flex-wrap items-center justify-center gap-4"
          >
            <ParticleBackground />
            <h1 className="text-6xl font-thin text-white">Formül Ekle</h1>
            <Button
              className="relative bottom-44 right-80"
              size="icon"
              id="close"
              type="button"
              onClick={() => {
                setAddPressed(!AddPressed);
                setResponse("");
              }}
            >
              {"<-"}
            </Button>
            <Input
              name="formula_name"
              className="h-8 w-80 text-white"
              type="text"
              id="formulaName"
              placeholder="Formül İsmi"
            />
            <Input
              name="formula"
              className="h-8 w-80 text-white"
              type="text"
              id="formulaContent"
              placeholder="Formül İçeriği"
            />
            <Button className="h-10 w-20" id="addFormula" type="submit">
              Ekle
            </Button>
            <h1
              id="result2"
              className="text-6xl font-thin text-white transition-all"
            >
              {loading ? "Loading..." : response}
            </h1>
          </form>
        )}
      </div>
    </>
  );
}
