/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  const params = await req.formData();
  const name = params.get("formula_name");
    try {
      const response = await prisma.formulas.findFirst({
        where: {
          formula_name: name,
        },
      });
        return NextResponse.json(response?.formula);
    } catch (error) {
      console.error(error);
    }
}
