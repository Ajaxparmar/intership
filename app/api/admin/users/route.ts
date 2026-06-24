import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: { in: ["ADMIN", "TEAMLEAD"] } },
      select: { id: true, fullName: true, phone: true, email: true, role: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("List users error:", error);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const phone = data.phone?.toString().replace(/\D/g, "") ?? "";
    const role = "ADMIN";

    if (!data.fullName?.trim() || !/^\d{10}$/.test(phone) || !data.password || data.password.length < 6) {
      return NextResponse.json({ error: "Name, 10-digit phone, and a 6-character password are required." }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        fullName: data.fullName.trim(),
        phone,
        email: data.email?.trim() || undefined,
        passwordHash: hashPassword(data.password),
        role,
      },
      select: { id: true, fullName: true, phone: true, email: true, role: true },
    });

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("Create user error:", error);
    return NextResponse.json({ error: "Could not create account. The phone number may already exist." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    if (!data.studentId || !["STUDENT", "TEAMLEAD"].includes(data.role)) {
      return NextResponse.json({ error: "Student and valid role are required." }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: data.studentId },
      include: { user: true },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    if (data.role === "STUDENT") {
      await prisma.studentGroup.updateMany({
        where: { teamLeadId: student.id },
        data: { teamLeadId: null } as any,
      });
    }

    const user = student.user
      ? await prisma.user.update({
          where: { id: student.user.id },
          data: { role: data.role },
          select: { id: true, fullName: true, phone: true, email: true, role: true },
        })
      : await prisma.user.create({
          data: {
            fullName: student.fullName,
            phone: student.phone,
            email: student.email,
            passwordHash: student.passwordHash,
            role: data.role,
            student: { connect: { id: student.id } },
          },
          select: { id: true, fullName: true, phone: true, email: true, role: true },
        });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Assign student role error:", error);
    return NextResponse.json({ error: "Could not assign role." }, { status: 500 });
  }
}
