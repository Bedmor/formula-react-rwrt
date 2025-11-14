import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const params = await req.formData();
  const formula_name = params.get("formula_name") as string;
  const formula = params.get("formula") as string;

  if (!formula_name || !formula) {
    return NextResponse.json("Missing formula_name or formula");
  }

  try {
    await prisma.formulas.create({
      data: {
        formula_name,
        formula,
      },
    });
    return NextResponse.json("Formula added to the database");
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        "Formula already exists in the database wait for it to be approved",
      );
    }
    return NextResponse.json("An error occurred while adding the formula");
  }
}
