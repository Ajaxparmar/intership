import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.studentId || !data.fromDate || !data.toDate || !data.reason?.trim()) {
      return NextResponse.json({ error: "Dates and reason are required." }, { status: 400 });
    }
    if (data.toDate < data.fromDate) {
      return NextResponse.json({ error: "To date must be on or after from date." }, { status: 400 });
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        studentId: data.studentId,
        fromDate: data.fromDate,
        toDate: data.toDate,
        reason: data.reason.trim(),
      },
    });
    return NextResponse.json({ success: true, leave }, { status: 201 });
  } catch (error) {
    console.error("Leave request error:", error);
    return NextResponse.json({ error: "Could not apply for leave." }, { status: 500 });
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
    console.error("Leave review error:", error);
    return NextResponse.json({ error: "Could not review leave request." }, { status: 500 });
  }
}
