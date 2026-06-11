import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { AttendanceStatus } from "@prisma/client";

const STATUSES: AttendanceStatus[] = ["PRESENT", "ABSENT", "LEAVE"];

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const rawStudentIds: unknown[] = Array.isArray(data.studentIds) ? data.studentIds : [];
    const studentIds: string[] = [
      ...new Set(rawStudentIds.filter((id): id is string => typeof id === "string" && id.length > 0)),
    ];
    const status = data.status as AttendanceStatus;

    if (!data.date || studentIds.length === 0 || !STATUSES.includes(status)) {
      return NextResponse.json({ error: "Select students, attendance date, and a valid status." }, { status: 400 });
    }

    const existingStudents = await prisma.student.count({ where: { id: { in: studentIds } } });
    if (existingStudents !== studentIds.length) {
      return NextResponse.json({ error: "One or more selected students were not found." }, { status: 404 });
    }

    await prisma.$transaction(
      studentIds.map((studentId) =>
        prisma.studentAttendance.upsert({
          where: { studentId_date: { studentId, date: data.date } },
          update: { status },
          create: { studentId, date: data.date, status },
        })
      )
    );

    return NextResponse.json({ success: true, updatedCount: studentIds.length });
  } catch (error) {
    console.error("Bulk attendance update error:", error);
    return NextResponse.json({ error: "Failed to submit attendance." }, { status: 500 });
  }
}
