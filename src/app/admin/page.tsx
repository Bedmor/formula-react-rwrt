"use client";
import { useEffect, useState } from "react";
import type { Formula } from "@/app/types.tsx";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircle, X } from "lucide-react";
import useSWR, { useSWRConfig } from "swr";
export default function Home() {
  const { mutate } = useSWRConfig();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const fetcher = async (url: string | URL | Request): Promise<Formula[]> => {
    const res = await fetch(url, { method: "GET" });
    return res.json() as Promise<Formula[]>;
  };

  const { data, error, isLoading } = useSWR<Formula[], Error>(
    "/api/search",
    fetcher,
  );
  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setFormulas(data);
    } else {
      setFormulas([]);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching formulas:", error);
  }
  function handleNameChange(id: number, name: string) {
    const data = new FormData();
    data.append("formula_id", id.toString());
    data.append("formula_name", name);
    void fetch("/api/update", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        void mutate("/api/search");
      })
      .catch((error) => console.error("Error updating formula name:", error));
  }

  function handleFormulaChange(id: number, formula: string) {
    const data = new FormData();
    data.append("formula_id", id.toString());
    data.append("formula", formula);
    void fetch("/api/update", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        void mutate("/api/search");
      })
      .catch((error) => console.error("Error updating formula:", error));
  }

  function handleApprovalChange(id: number, approved: boolean) {
    const data = new FormData();
    data.append("formula_id", id.toString());
    data.append("approved", approved ? "1" : "0");
    void fetch("/api/update", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        void mutate("/api/search");
      })
      .catch((error) =>
        console.error("Error updating approval status:", error),
      );
    handleCheck(id);
  }

  function handleRemove(id: number) {
    const updatedFormulas = formulas.filter(
      (formula) => formula.formula_id !== id,
    );
    setFormulas(updatedFormulas);

    const data = new FormData();
    data.append("formula_id", id.toString());
    void fetch("/api/remove", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error removing formula:", error));
  }

  function handleAdd() {
    const data = new FormData();
    data.append("formula_name", "null");
    data.append("formula", "null");
    data.append("approved", "0");
    void fetch("/api/add", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        void mutate("/api/search");
      })
      .catch((error) => console.error("Error adding formula:", error));
  }

  function handleCheck(id: number) {
    setFormulas(
      formulas.map((formula) =>
        formula.formula_id === id
          ? { ...formula, approved: formula.approved === 1 ? 0 : 1 }
          : formula,
      ),
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col gap-4 bg-black">
      <h1 className="text-thin m-6 text-4xl text-white">Formulas</h1>
      {formulas ? (
        isLoading ? (
          <div className="flex flex-row">
            <LoaderCircle
              className="motion-preset-spin"
              size={32}
              color="white"
            />
            <h1 className="text-2xl text-white">Loading...</h1>
          </div>
        ) : (
          <form>
            <table className="m-6 table-auto text-white">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Formula</th>
                  <th>Approved</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {formulas.map((formula) => (
                  <tr key={formula.formula_id}>
                    <td className="text-thin flex h-9 rounded-md border border-white px-3 py-1">
                      {formula.formula_id}
                    </td>
                    <td>
                      <Input
                        onBlur={(e) => {
                          handleNameChange(formula.formula_id, e.target.value);
                        }}
                        type="text"
                        name="formula_name"
                        defaultValue={formula.formula_name ?? ""}
                      />
                    </td>
                    <td>
                      <Input
                        onBlur={(e) => {
                          handleFormulaChange(
                            formula.formula_id,
                            e.target.value,
                          );
                        }}
                        type="text"
                        name="formula"
                        defaultValue={formula.formula ?? ""}
                      />
                    </td>
                    <td className="flex">
                      <Checkbox
                        className="relative top-2 size-4 border-gray-200"
                        id="approved"
                        name="approved"
                        defaultChecked={formula.approved === 1}
                        onCheckedChange={(checked: boolean) => {
                          handleApprovalChange(formula.formula_id, checked);
                        }}
                      />
                      <label
                        htmlFor="approved"
                        className="relative top-1 text-white"
                      >
                        {formula.approved === 1 ? "Approved" : "Not Approved"}
                      </label>
                    </td>
                    <td>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(formula.formula_id);
                        }}
                      >
                        <X />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleAdd();
                void mutate("/api/search");
              }}
              variant={"secondary"}
            >
              ADD
            </Button>
          </form>
        )
      ) : (
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleAdd();
          }}
          variant={"secondary"}
        >
          ADD
        </Button>
      )}
    </div>
  );
}
