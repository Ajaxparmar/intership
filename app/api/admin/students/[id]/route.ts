import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { FeeStatus } from "@prisma/client";

function feeStatus(totalFee: number, paidFee: number, nextDueDate?: string): FeeStatus {
  if (paidFee >= totalFee) return "PAID";
  if (nextDueDate && new Date(nextDueDate) < new Date()) return "OVERDUE";
  return paidFee > 0 ? "PARTIAL" : "PENDING";
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await request.json();
    const batchId = data.batchId?.toString().trim();

    if (!batchId) {
      return NextResponse.json({ error: "A batch must be selected." }, { status: 400 });
    }

    const [student, batch] = await Promise.all([
      prisma.student.findUnique({ where: { id } }),
      prisma.batch.findUnique({ where: { id: batchId } }),
    ]);

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }
    if (!batch) {
      return NextResponse.json({ error: "Selected batch was not found." }, { status: 404 });
    }

    const nextDueDate = data.nextDueDate?.toString().trim() || undefined;
    const updatedStudent = await prisma.student.update({
      where: { id },
      data: {
        batch: { connect: { id: batch.id } },
        batchName: batch.name,
        courseName: batch.course,
        startDate: batch.startDate,
        endDate: batch.endDate,
        nextDueDate: nextDueDate || null,
        feeStatus: feeStatus(student.totalFee, student.paidFee, nextDueDate),
      },
      include: {
        batch: true,
        attendance: { orderBy: { date: "desc" }, take: 10 },
        offerLetters: { orderBy: { createdAt: "desc" } },
        feeReceipts: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "Could not update student." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const student = await prisma.student.findUnique({
      where: { id },
      select: { id: true, fullName: true, userId: true },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found." }, { status: 404 });
    }

    const leadGroupCount = await prisma.studentGroup.count({ where: { teamLeadId: id } });
    if (leadGroupCount > 0) {
      return NextResponse.json(
        { error: "Assign another team lead to this student's groups before deleting the student." },
        { status: 409 }
      );
    }

    await Promise.all([
      prisma.studentAttendance.deleteMany({ where: { studentId: id } }),
      prisma.offerLetter.deleteMany({ where: { studentId: id } }),
      prisma.leaveRequest.deleteMany({ where: { studentId: id } }),
      prisma.feeReceipt.deleteMany({ where: { studentId: id } }),
    ]);

    await prisma.student.delete({ where: { id } });
    if (student.userId) {
      await prisma.user.deleteMany({ where: { id: student.userId } });
    }

    return NextResponse.json({ success: true, deletedStudent: student.fullName });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "Could not delete student." }, { status: 500 });
  }
}
