import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const params = await req.formData();
  const id = parseInt(params.get("formula_id") as string);
  const name = params.get("formula_name") as string | null;
  const formula = params.get("formula") as string | null;
  const approved = parseInt(params.get("approved") as string);

  if (isNaN(id)) {
    return NextResponse.json("Invalid formula_id", { status: 400 });
  }

  try {
    const response = await prisma.formulas.findFirst({
      where: {
        formula_id: id,
      },
    });
    if (!response) {
      return NextResponse.json("Formula not found", { status: 404 });
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
  } catch (error: unknown) {
    console.error("Error updating formula:", error);
    return NextResponse.json("An error occurred while updating the formula", {
      status: 500,
    });
  }
}
