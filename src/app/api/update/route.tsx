import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
import type { Formula } from "~/app/types.tsx";

export async function POST(req: NextRequest) {
  const params = await req.formData();
  const id = parseInt(params.get("formula_id"));
  const name = params.get("formula_name");
  const formula = params.get("formula");
  const approved = parseInt(params.get("approved"));
  try {
    const response = await prisma.formulas.findFirst({
      where: {
        formula_id: id,
      },
    });
    if (!response) {
      return NextResponse.json("Formula not found");
    }
    await prisma.formulas.update({
      where: { formula_id: id },
      data: {
        formula_name: name ?? undefined,
        formula: formula ?? undefined,
        approved: isNaN(approved) ? undefined : approved,
      },
    });
    return NextResponse.json("Formula updated successfully");
  } catch (error) {
    console.error(error.stack);
  }
}
