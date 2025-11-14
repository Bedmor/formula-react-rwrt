import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Formula } from "~/app/types.tsx";

const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  const params = await req.formData();
  const formula_id = params.get("formula_id");

  const deletedFormula = await prisma.formulas.delete({
    where: { formula_id: parseInt(formula_id) },
  });
  return NextResponse.json("Formula deleted from the database");
}
