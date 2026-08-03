import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AttendanceStatus } from "@prisma/client";

const STATUSES: AttendanceStatus[] = ["PRESENT", "ABSENT", "LEAVE"];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const status = data.status as AttendanceStatus;

    if (!data.date || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Attendance date and valid status are required." }, { status: 400 });
    }

    const attendance = await prisma.studentAttendance.upsert({
      where: { studentId_date: { studentId: id, date: data.date } },
      update: { status, remarks: data.remarks || undefined },
      create: {
        studentId: id,
        date: data.date,
        status,
        remarks: data.remarks || undefined,
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Attendance update error:", error);
    return NextResponse.json({ error: "Failed to update attendance." }, { status: 500 });
  }
}
