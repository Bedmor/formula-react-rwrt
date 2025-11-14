import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const response = await prisma.formulas.findMany();
    if (response.length === 0) {
      return NextResponse.json(
        { message: "No formulas found" },
        { status: 404 },
      );
    }
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Error fetching formulas:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching formulas" },
      { status: 500 },
    );
  }
}
export async function POST(req: NextRequest) {
  const params = await req.formData();
  const name = params.get("formula_name") as string;
  try {
    const response = await prisma.formulas.findFirst({
      where: {
        formula_name: name,
      },
    });
    console.log(response);
    if (!response) {
      return NextResponse.json("Formula not found", { status: 404 });
    }
    if (response.approved === 0) {
      return NextResponse.json("Formula not approved yet", { status: 403 });
    }
    return NextResponse.json(response.formula);
  } catch (error: unknown) {
    console.error("Error searching formula:", error);
    return NextResponse.json(
      "An error occurred while searching for the formula",
      { status: 500 },
    );
  }
}
