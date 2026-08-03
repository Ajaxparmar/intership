import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { phone, rollNo } = await req.json();

  if (!phone && !rollNo) {
    return NextResponse.json({ error: "Provide phone or roll number" }, { status: 400 });
  }

  const record = await prisma.application.findFirst({
    where: {
      OR: [
        phone ? { phone } : {},
        rollNo ? { rollNo } : {},
      ].filter(c => Object.keys(c).length > 0),
    },
    select: {
      name: true,
      phone: true,
      rollNo: true,
      collegeName: true,
      domain: true,
      duration: true,
      paymentStatus: true,
    },
  });

  if (!record) return NextResponse.json({ error: "No registration found" }, { status: 404 });

  return NextResponse.json({ data: record });
}