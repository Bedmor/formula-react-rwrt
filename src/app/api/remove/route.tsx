import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const params = await req.formData();
  const formula_id = params.get("formula_id") as string;
  const id = parseInt(formula_id);

  if (isNaN(id)) {
    return NextResponse.json("Invalid formula_id", { status: 400 });
  }

  try {
    await prisma.formulas.delete({
      where: { formula_id: id },
    });
    return NextResponse.json("Formula deleted from the database");
  } catch (error: unknown) {
    console.error("Error deleting formula:", error);
    return NextResponse.json("An error occurred while deleting the formula", {
      status: 500,
    });
  }
}
