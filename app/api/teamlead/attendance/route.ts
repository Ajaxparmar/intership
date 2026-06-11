import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const today = new Date().toISOString().slice(0, 10);
    if (!data.teamLeadId || !data.studentId || !data.date || !["PRESENT", "ABSENT", "LEAVE"].includes(data.status)) {
      return NextResponse.json({ error: "Team lead, student, date, and status are required." }, { status: 400 });
    }
    if (data.date !== today) {
      return NextResponse.json({ error: "Team leads can only mark attendance for the current date." }, { status: 403 });
    }

    const student = await prisma.student.findFirst({
      where: { id: data.studentId, group: { teamLead: { userId: data.teamLeadId } } },
      select: { id: true },
    });
    if (!student) {
      return NextResponse.json({ error: "This student is not assigned to your group." }, { status: 403 });
    }

    const attendance = await prisma.studentAttendance.upsert({
      where: { studentId_date: { studentId: data.studentId, date: data.date } },
      update: { status: data.status, remarks: data.remarks?.trim() || undefined },
      create: {
        studentId: data.studentId,
        date: data.date,
        status: data.status,
        remarks: data.remarks?.trim() || undefined,
      },
    });
    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Team lead attendance error:", error);
    return NextResponse.json({ error: "Could not mark attendance." }, { status: 500 });
  }
}
