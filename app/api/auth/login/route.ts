import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const phone = data.phone?.toString().replace(/\D/g, "") ?? "";
    const password = data.password?.toString() ?? "";
    const selectedRole = data.role?.toString().toUpperCase() ?? "";

    if (!["ADMIN", "TEAMLEAD", "STUDENT"].includes(selectedRole)) {
      return NextResponse.json({ error: "Please select a login role." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phone },
      include: {
        student: {
          include: {
            group: { include: { teamLead: { select: { id: true, fullName: true, phone: true } } } },
            attendance: { orderBy: { date: "desc" }, take: 60 },
            offerLetters: { orderBy: { createdAt: "desc" } },
            leaveRequests: { orderBy: { createdAt: "desc" } },
            feeReceipts: { orderBy: { createdAt: "desc" } },
            leadGroups: {
              include: {
                students: {
                  include: {
                    attendance: { orderBy: { date: "desc" } },
                    leaveRequests: { where: { status: "PENDING" }, orderBy: { createdAt: "desc" } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      const legacyStudent = await prisma.student.findUnique({
        where: { phone },
        include: {
          group: { include: { teamLead: { select: { id: true, fullName: true, phone: true } } } },
          attendance: { orderBy: { date: "desc" }, take: 60 },
          offerLetters: { orderBy: { createdAt: "desc" } },
          leaveRequests: { orderBy: { createdAt: "desc" } },
          feeReceipts: { orderBy: { createdAt: "desc" } },
        },
      });
      if (selectedRole === "STUDENT" && legacyStudent && verifyPassword(password, legacyStudent.passwordHash)) {
        const { passwordHash, ...safeStudent } = legacyStudent;
        void passwordHash;
        return NextResponse.json({
          success: true,
          user: { id: legacyStudent.id, fullName: legacyStudent.fullName, phone, role: "STUDENT", student: safeStudent, leadGroups: [] },
        });
      }
    }

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid phone number or password." }, { status: 401 });
    }
    if (user.role !== selectedRole) {
      return NextResponse.json({ error: `This account is not registered as ${selectedRole.toLowerCase()}.` }, { status: 403 });
    }

    const { passwordHash, ...safeUser } = user;
    void passwordHash;
    return NextResponse.json({
      success: true,
      user: { ...safeUser, leadGroups: user.student?.leadGroups ?? [] },
    });
  } catch (error) {
    console.error("Role login error:", error);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
