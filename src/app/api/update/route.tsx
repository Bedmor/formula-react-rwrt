import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
const prisma = new PrismaClient();
import type { Formula } from "~/app/types.tsx";

export async function POST(req: NextRequest) {
  const params = await req.formData();
  const id = parseInt(params.get("formula_id") as string);
  const name = params.get("formula_name") as string | null;
  const formula = params.get("formula") as string | null;
  const approved = parseInt(params.get("approved") as string);
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
