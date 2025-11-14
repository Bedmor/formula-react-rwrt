/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import type { Formula } from "~/app/types.tsx";

const prisma = new PrismaClient();

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
  } catch (err) {
    console.error(err.stack);
  }
}
export async function POST(req: NextRequest) {
  const params = await req.formData();
  const name = params.get("formula_name");
  try {
    const response = await prisma.formulas.findFirst({
      where: {
        formula_name: name,
      },
    });
    console.log(response);
    if (!response) {
      return NextResponse.json("Formula not found");
    }
    if (response.approved === 0) {
      return NextResponse.json("Formula not approved yet");
    }
    return NextResponse.json(response?.formula);
  } catch (error) {
    console.error(error);
  }
}
