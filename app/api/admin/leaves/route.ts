import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leaves = await prisma.leaveRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            profileImage: true,
            courseName: true,
            batchName: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, leaves });
  } catch (error) {
    console.error("Admin leave list error:", error);
    return NextResponse.json({ error: "Could not load leave requests." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    if (!data.leaveId || !["APPROVED", "REJECTED"].includes(data.status)) {
      return NextResponse.json({ error: "Leave request and decision are required." }, { status: 400 });
    }

    const leave = await prisma.leaveRequest.update({
      where: { id: data.leaveId },
      data: { status: data.status, reviewedAt: new Date() },
    });

    return NextResponse.json({ success: true, leave });
  } catch (error) {
    console.error("Admin leave review error:", error);
    return NextResponse.json({ error: "Could not review leave request." }, { status: 500 });
  }
}
