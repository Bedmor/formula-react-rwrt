"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LoaderCircle } from "lucide-react";
interface Formula {
  formula_id: number;
  formula_name: string;
  formula: string;
  approved: boolean;
}

export default function Home() {
  function handleCheck(id: number) {
    setFormulas(
      formulas.map((formula) =>
        formula.formula_id === id
          ? { ...formula, approved: !formula.approved }
          : formula,
      ),
    );
  }
  const [formulas, setFormulas] = useState<Formula[]>([]);
  useEffect(() => {
    fetch("/api/search", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setFormulas(data))
      .catch((error) => console.error("Error fetching formulas:", error));
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col gap-4 bg-black">
      <h1 className="text-thin text-4xl m-6 text-white">
        Formulas
      </h1>
      {formulas.length > 0 ? (
        <form>
          <table className="table-auto m-6 text-white">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Formula</th>
                <th>Approved</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formulas.map((formula) => (
                <tr key={formula.formula_id}>
                  <td className="flex h-9 px-3 py-1 text-thin border rounded-md border-white">
                    {formula.formula_id}
                  </td>
                  <td>
                    <Input
                      onBlur={(e) => {
                        const data = new FormData();
                        data.append(
                          "formula_id",
                          formula.formula_id.toString(),
                        );
                        data.append("formula_name", e.target.value);
                        fetch("/api/update", {
                          method: "POST",
                          body: data,
                        })
                          .then((res) => res.json())
                          .then((data) => console.log(data))
                          .catch((error) =>
                            console.error("Error updating formula:", error),
                          );
                      }}
                      type="text"
                      name="formula_name"
                      defaultValue={formula.formula_name}
                    />
                  </td>
                  <td>
                    <Input
                      onBlur={(e) => {
                        const data = new FormData();
                        data.append(
                          "formula_id",
                          formula.formula_id.toString(),
                        );
                        data.append("formula", e.target.value);
                        fetch("/api/update", {
                          method: "POST",
                          body: data,
                        })
                          .then((res) => res.json())
                          .then((data) => console.log(data))
                          .catch((error) =>
                            console.error("Error updating formula:", error),
                          );
                      }}
                      type="text"
                      name="formula"
                      defaultValue={formula.formula}
                    />
                  </td>
                  <td className="flex">
                    <Checkbox
                      className="relative top-2 size-4 border-gray-200"
                      id="approved"
                      name="approved"
                      defaultChecked={formula.approved ? true : false}
                      onCheckedChange={(checked) => {
                        const data = new FormData();
                        data.append(
                          "formula_id",
                          formula.formula_id.toString(),
                        );
                        data.append("approved", checked ? "1" : "0");
                        fetch("/api/update", {
                          method: "POST",
                          body: data,
                        })
                          .then((res) => res.json())
                          .then((data) => console.log(data))
                          .catch((error) =>
                            console.error("Error updating formula:", error),
                          );
                        handleCheck(formula.formula_id);
                      }}
                    />
                    <label
                      htmlFor="approved"
                      className="relative top-1 text-white"
                    >
                      {formula.approved ? "Approved" : "Not Approved"}
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </form>
      ) : (
        <div className="flex flex-row">
          <LoaderCircle
            className="motion-preset-spin"
            size={32}
            color="white"
          />
          <h1 className="text-2xl text-white">Loading...</h1>
        </div>
      )}
    </div>
  );
}
