/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  const params = await req.formData();
  const formula_name = params.get("formula_name");
  const formula = params.get("formula");

  if (!formula_name || !formula) {
    return NextResponse.json("Missing formula_name or formula");
  }

  try {
    const newFormula = await prisma.formulas.create({
      data: {
        formula_name,
        formula,
      },
    });
    return NextResponse.json("Formula added to the database");
  } catch (error) {
    if (error.code === "P2002") {
      return NextResponse.json("Formula already exists in the database wait for it to be approved");
    }
    else {
      return NextResponse.json("An error occured while adding the formula");
    }
  }
}
