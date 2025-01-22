/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const response = await prisma.formulas.findMany();
    return NextResponse.json(response);
  }
  catch (err) {
    console.error(err.stack);
}}
export async function POST(req: NextRequest, res: NextResponse) {
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
