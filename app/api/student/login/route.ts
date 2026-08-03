import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const phone = data.phone?.toString().replace(/\D/g, "") ?? "";
    const password = data.password?.toString() ?? "";

    if (!phone || !password) {
      return NextResponse.json({ error: "Phone number and password are required." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { phone },
      include: {
        attendance: { orderBy: { date: "desc" }, take: 30 },
        offerLetters: { orderBy: { createdAt: "desc" } },
        feeReceipts: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!student || !verifyPassword(password, student.passwordHash)) {
      return NextResponse.json({ error: "Invalid phone number or password." }, { status: 401 });
    }

    const { passwordHash, ...safeStudent } = student;
    void passwordHash;

    return NextResponse.json({ success: true, student: safeStudent });
  } catch (error) {
    console.error("Student login error:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
